#!/usr/bin/env python3
"""Compute the baseline, target, and review window of a DIAL docs sync.

Usage:
  python3 -I release_window.py --repo epam/REPO --since YYYY-MM-DD
      [--pinned TAG ...] [--chart NAME] [--clone DIR] [--tags] [--json]

  --since   the oldest last_verified among the pages that cover the repository
  --pinned  release tags this repository's links are pinned to on those pages
            (from pinned_refs.py); a pinned tag newer than the date baseline wins
  --chart   Helm chart name in epam/ai-dial-helm; tags look like NAME-1.2.3
  --clone   a local clone; its tags are used when the repository has no GitHub releases
            or the GitHub API is unavailable (gh missing, logged out, or blocked)
  --tags    use the clone's tags even when the API works

Versions are ordered by semver, never by publication date: DIAL publishes
patch releases of older lines (backports) after newer lines.

Tags can't show drafts. When it works from tags, the script reads the public release page of
every tag above the baseline: "released this" is a published release, a "Pre-release" badge
marks a pre-release, and "tagged this" is a tag without a published release (a draft, or a
repository that publishes tags only).
"""
import argparse
import json
import re
import subprocess
import sys
import urllib.request
from datetime import date, timedelta

VERSION = re.compile(r'^v?(\d+)\.(\d+)\.(\d+)(?:-([0-9A-Za-z.-]+))?$')
UA = 'dial-docs-sync'
MAX_PAGES = 80


def run(cmd):
    try:
        return subprocess.run(cmd, capture_output=True, text=True)
    except FileNotFoundError:
        return subprocess.CompletedProcess(cmd, 127, '', f'{cmd[0]}: command not found')


def parse(tag, chart):
    name = tag
    if chart:
        if not tag.startswith(chart + '-'):
            return None
        name = tag[len(chart) + 1:]
    m = VERSION.match(name)
    if not m:
        return None
    major, minor, patch, pre = int(m[1]), int(m[2]), int(m[3]), m[4]
    pre_key = ()
    if pre:
        pre_key = tuple((0, int(p), '') if p.isdigit() else (1, 0, p) for p in pre.split('.'))
    return {
        'tag': tag,
        'key': (major, minor, patch, 0 if pre else 1, pre_key),
        'line': (major, minor),
        'patch': patch,
        'pre': pre is not None,
    }


def from_releases(repo, chart):
    """(releases, drafts, error); releases is None when the GitHub API is unavailable."""
    res = run(['gh', 'release', 'list', '-R', repo, '-L', '300',
               '--json', 'tagName,publishedAt,isPrerelease,isDraft'])
    if res.returncode != 0:
        lines = res.stderr.strip().splitlines()
        return None, [], lines[-1] if lines else 'gh failed'
    out, drafts = [], []
    for r in json.loads(res.stdout or '[]'):
        if r.get('isDraft'):
            drafts.append(r['tagName'])
            continue
        v = parse(r['tagName'], chart)
        if not v:
            continue
        v['date'] = r['publishedAt'][:10]
        # GitHub's pre-release flag wins over the tag name.
        v['pre'] = v['pre'] or bool(r.get('isPrerelease'))
        out.append(v)
    return out, drafts, None


def from_tags(clone, chart):
    fmt = '%(refname:short)|%(creatordate:short)'
    res = run(['git', '-C', clone, 'for-each-ref', 'refs/tags', f'--format={fmt}'])
    if res.returncode != 0:
        sys.exit(f'git failed: {res.stderr.strip()}')
    out = []
    for line in res.stdout.splitlines():
        tag, _, day = line.partition('|')
        v = parse(tag, chart)
        if v:
            v['date'] = day
            out.append(v)
    return out


def page_status(repo, tag):
    """(status, published date) from the public release page.

    status is 'released', 'prerelease', 'tag', or None when the page can't be read.
    """
    req = urllib.request.Request(f'https://github.com/{repo}/releases/tag/{tag}', headers={'User-Agent': UA})
    try:
        with urllib.request.urlopen(req, timeout=30) as r:
            text = r.read().decode('utf-8', 'replace')
    except Exception:
        return None, None
    i = text.find('released this')
    if i >= 0:
        m = re.search(r'datetime="(\d{4}-\d{2}-\d{2})', text[i:])
        status = 'prerelease' if re.search(r'>\s*Pre-release\s*<', text) else 'released'
        return status, m[1] if m else None
    if 'tagged this' in text:
        return 'tag', None
    return None, None


def check_pages(repo, rels, since, pinned):
    """Read the release pages of the tags that can matter; return (rels, unpublished, note).

    Checked: every tag above the newest tag dated on or before `since` (or above the newest
    pin), and every tag created in the 30 days before `since`, since a tag can be published
    days after it was created.
    """
    by_date = [r for r in rels if not r['pre'] and r['date'] <= since]
    floor = max([r['key'] for r in by_date] + [p['key'] for p in pinned], default=None)
    recent = (date.fromisoformat(since) - timedelta(days=30)).isoformat()
    todo = sorted((r for r in rels if floor is None or r['key'] > floor or r['date'] >= recent),
                  key=lambda r: r['key'], reverse=True)
    statuses = {r['tag']: page_status(repo, r['tag']) for r in todo[:MAX_PAGES]}
    known = [s for s, _ in statuses.values() if s]
    if any(s in ('released', 'prerelease') for s in known):
        unpublished = []
        for r in rels:
            s, published = statuses.get(r['tag'], (None, None))
            if s == 'tag':
                unpublished.append(r['tag'])
            elif s in ('released', 'prerelease'):
                r['pre'] = r['pre'] or s == 'prerelease'
                r['date'] = published or r['date']
        note = 'release pages checked: publication dates used, tags without a published release dropped'
        if len(todo) > MAX_PAGES:
            note += f'; only the newest {MAX_PAGES} candidate tags were checked'
        return [r for r in rels if r['tag'] not in set(unpublished)], unpublished, note
    if known:
        return rels, [], 'no tag has a published release: the repository publishes tags only'
    if todo:
        return rels, [], 'release pages unreachable: drafts cannot be told apart, and tag dates stand in for release dates'
    return rels, [], ''


def predecessor(rel, all_rels, base):
    """The tag to diff against for one release: previous patch on its line, or previous x.y.0.

    The baseline wins when it is on the same line and newer, for example a pinned pre-release.
    """
    lower = [r for r in all_rels if not r['pre'] and r['key'] < rel['key']]
    same_line = [r for r in lower if r['line'] == rel['line']]
    if rel['patch'] > 0 and same_line:
        prev = max(same_line, key=lambda r: r['key'])
    else:
        zeros = [r for r in lower if r['patch'] == 0]
        pool = zeros or lower
        prev = max(pool, key=lambda r: r['key']) if pool else None
    if base['key'] < rel['key'] and base['line'] == rel['line'] and (prev is None or base['key'] > prev['key']):
        prev = base
    return prev['tag'] if prev else None


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--repo', required=True)
    ap.add_argument('--since', required=True, help='oldest last_verified, YYYY-MM-DD')
    ap.add_argument('--pinned', nargs='*', default=[])
    ap.add_argument('--chart')
    ap.add_argument('--clone')
    ap.add_argument('--tags', action='store_true')
    ap.add_argument('--json', action='store_true')
    a = ap.parse_args()
    since = date.fromisoformat(a.since).isoformat()

    drafts, source, api_error, tag_mode = [], 'GitHub releases', None, False
    rels = []
    if not a.tags:
        rels, drafts, api_error = from_releases(a.repo, a.chart)
    if not rels:
        if rels is None:
            why = f'GitHub API unavailable: {api_error}'
        else:
            why = 'requested with --tags' if a.tags else 'no GitHub releases'
        if not a.clone:
            sys.exit(f'{why}. Clone the repository and pass --clone DIR; its tags are used instead.')
        rels, source, tag_mode = from_tags(a.clone, a.chart), f'git tags ({why})', True
    if not rels:
        sys.exit('STOP: the repository has no releases or tags to compare.')

    unpublished = []
    if tag_mode:
        pins = [r for r in rels if r['tag'] in set(a.pinned)]
        rels, unpublished, note = check_pages(a.repo, rels, since, pins)
        if note:
            source += '; ' + note

    stable = [r for r in rels if not r['pre']]
    by_tag = {r['tag']: r for r in rels}
    candidates = [r for r in stable if r['date'] <= since]
    base = max(candidates, key=lambda r: r['key']) if candidates else None
    base_reason = f'newest stable release published on or before {since}'
    pinned = [by_tag[t] for t in a.pinned if t in by_tag]
    unknown_pins = [t for t in a.pinned if t not in by_tag]
    if pinned:
        newest_pin = max(pinned, key=lambda r: r['key'])
        if base is None or newest_pin['key'] > base['key']:
            base, base_reason = newest_pin, 'newest tag the pages pin'
    if base is None:
        sys.exit(f'STOP: no baseline. No release predates {since} and no page pins a release tag.')
    oldest_pin = min(pinned, key=lambda r: r['key']) if pinned else None

    newer_stable = [r for r in stable if r['key'] > base['key']]
    status, target = 'sync', None
    if newer_stable:
        target = max(newer_stable, key=lambda r: r['key'])
    else:
        newer_pre = [r for r in rels if r['pre'] and r['key'] > base['key']]
        if base['pre'] and newer_pre:
            target, status = max(newer_pre, key=lambda r: r['key']), 'sync-prerelease'
        else:
            status = 'up-to-date'

    review, context, beyond = [], [], []
    if target:
        first_of_line = min((r for r in stable if r['line'] == target['line']),
                            key=lambda r: r['date'], default=None)
        for r in sorted(rels, key=lambda r: r['key']):
            if r['key'] <= base['key']:
                continue
            if r['key'] > target['key']:
                if r['pre']:
                    beyond.append(r)
                continue
            if r['pre'] and r is not target:
                context.append(r)
                continue
            r['backport'] = bool(first_of_line and r['line'] < target['line']
                                 and r['date'] > first_of_line['date'])
            r['previous'] = predecessor(r, rels, base)
            review.append(r)

    result = {
        'repo': a.repo, 'chart': a.chart, 'source': source, 'status': status,
        'baseline': {'tag': base['tag'], 'date': base['date'], 'reason': base_reason},
        'target': {'tag': target['tag'], 'date': target['date']} if target else None,
        'review': [{'tag': r['tag'], 'date': r['date'], 'previous': r['previous'],
                    'backport': r['backport']} for r in review],
        'context_prereleases': [r['tag'] for r in context],
        'newer_prereleases_ignored': [r['tag'] for r in beyond],
        'drafts_ignored': drafts,
        'unpublished_tags_ignored': unpublished,
        'oldest_pinned_tag': oldest_pin['tag'] if oldest_pin else None,
        'unknown_pinned_tags': unknown_pins,
    }
    if a.json:
        print(json.dumps(result, indent=2))
        return

    print(f"repo      {a.repo}{' chart ' + a.chart if a.chart else ''}  ({source})")
    print(f"baseline  {base['tag']} ({base['date']}): {base_reason}")
    if status == 'up-to-date':
        print('status    up to date: no release newer than the baseline')
    else:
        label = 'target    ' + target['tag'] + f" ({target['date']})"
        print(label + ('  PRE-RELEASE target: say "pre-release" wherever the version is named'
                       if status == 'sync-prerelease' else ''))
        print(f"tag diff  git diff --stat {base['tag']} {target['tag']}")
        print('review, oldest first:')
        for r in review:
            note = '  backport of an older line: review only PRs not already seen' if r['backport'] else ''
            prev = r['previous'] or '(first release)'
            print(f"  {r['tag']:<22} {r['date']}  commits: git log --format='%H %s' {prev}..{r['tag']}{note}")
    if context:
        print('context   pre-releases inside the window (read, do not document): '
              + ', '.join(r['tag'] for r in context))
    if beyond:
        print('ignored   pre-releases newer than the target: ' + ', '.join(r['tag'] for r in beyond))
    if drafts:
        print('ignored   drafts: ' + ', '.join(drafts))
    if unpublished:
        print('ignored   tags without a published release (drafts or unreleased): ' + ', '.join(unpublished))
    if oldest_pin and oldest_pin['key'] < base['key']:
        print(f"drift     links pinned to {oldest_pin['tag']} predate the baseline; "
              'run pinned_refs.py with --clone and --target to re-check their claims')
    if unknown_pins:
        print('warning   pinned tags not found among releases: ' + ', '.join(unknown_pins))


if __name__ == '__main__':
    main()
