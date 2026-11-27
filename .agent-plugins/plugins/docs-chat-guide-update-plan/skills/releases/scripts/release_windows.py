"""Find the stable releases the DIAL Chat User Guide update plan reviews, for each repository.

Usage (from the root of the epam/ai-dial checkout):
  python3 -I release_windows.py --inventory <WORK>/guide.json --out <WORK>/windows.json
      [--since YYYY-MM-DD] [--today YYYY-MM-DD] [--repo epam/<REPO> ...] [--from-json epam/<REPO>=<FILE> ...]

  --inventory  the output of guide_inventory.py; its distinct last_verified dates are the start dates
  --since      one start date for every page instead (the run's `since` option)
  --today      the end of the window; defaults to the system date
  --repo       the repositories; defaults to the three the guide documents
  --from-json  a JSON array of release objects with the REST API's fields (tag_name, published_at,
               prerelease, draft, html_url, body), for a repository the GitHub API can't reach

GitHub access, in order: `gh api`, then the public REST API (GH_TOKEN or GITHUB_TOKEN when set),
then --from-json.

Rules:
  stable      a published release that GitHub doesn't mark as a draft or a pre-release, with a tag
              X.Y.Z and no suffix. X.Y.Z-rc.N, and any other suffix, is a release candidate: ignored.
  legacy      epam/ai-dial-chat versions below 1.0.0 are the legacy chat, which the guide doesn't
              document: ignored.
  baseline    for each start date D: the highest stable version published before D. A release
              published on D itself is reviewed, because the page may have been checked before it
              came out.
  target      the highest stable version published on or before --today.
  review      every stable version above the oldest baseline, up to the target, oldest publication
              first. "dates" lists the start dates whose window holds it: its version is above that
              date's baseline.
  older_line  a stable release published inside the window, at or below the baseline of the oldest
              start date: a backport to an older line. Listed, never reviewed.
Versions are compared as numbers (1.10.0 > 1.9.3), never by date: DIAL publishes backports of older
lines after newer lines. Dates are the UTC day of published_at.

Output (--out), one entry per repository under "repos":
  source              gh | rest | file
  status              review (at least one release to review) | up-to-date
  baselines           {start date: {tag, published}}
  target              {tag, published, url}, or null when up to date
  review              [{tag, published, url, dates, body}]; body is the release notes, as published
  older_line          [{tag, published}]
  candidates_ignored  release-candidate tags published inside the window
  drafts_ignored      the number of draft releases the API showed
The top level holds "today", "start_dates", "mode" (last_verified, or since when --since set one
date for every page), and "pages_by_date" (from the inventory).

Stdout: a short summary per repository. It only reads: it never edits, commits, pushes, or writes
to GitHub. Exit 0 when the run can go on; exit 1 with a "STOP: <reason>" line when a repository's
releases can't be read or a start date has no baseline.
"""
import argparse
import json
import os
import re
import subprocess
import sys
import urllib.request
from datetime import date

REPOS = ['epam/ai-dial-chat', 'epam/ai-dial-quickapps-backend', 'epam/ai-dial-quickapps-frontend']
FLOOR = {'epam/ai-dial-chat': (1, 0, 0)}
STABLE = re.compile(r'^(\d+)\.(\d+)\.(\d+)$')
ANY_VERSION = re.compile(r'^v?\d+\.\d+\.\d+')
UA = 'dial-docs-chat-guide-plan'


def stop(msg):
    print(f'STOP: {msg}')
    sys.exit(1)


def from_gh(repo):
    try:
        r = subprocess.run(['gh', 'api', '--paginate', f'repos/{repo}/releases?per_page=100',
                            '--jq', '.[] | {tag_name, published_at, prerelease, draft, html_url, body}'],
                           capture_output=True, text=True)
    except FileNotFoundError:
        return None, 'gh: command not found'
    if r.returncode != 0:
        return None, (r.stderr.strip().splitlines() or ['gh failed'])[-1]
    return [json.loads(line) for line in r.stdout.splitlines() if line.strip()], None


def from_rest(repo):
    token = os.environ.get('GH_TOKEN') or os.environ.get('GITHUB_TOKEN')
    out, page = [], 1
    while page <= 30:
        req = urllib.request.Request(f'https://api.github.com/repos/{repo}/releases?per_page=100&page={page}',
                                     headers={'User-Agent': UA, 'Accept': 'application/vnd.github+json'})
        if token:
            req.add_header('Authorization', f'Bearer {token}')
        try:
            with urllib.request.urlopen(req, timeout=60) as resp:
                batch = json.load(resp)
        except Exception as e:  # noqa: BLE001 - any failure means this route is unavailable
            return None, f'REST API: {e}'
        if not batch:
            break
        out.extend(batch)
        page += 1
    return out, None


def key(tag):
    m = STABLE.match(tag)
    return tuple(int(x) for x in m.groups()) if m else None


def classify(repo, items):
    stable, candidates, drafts = [], [], 0
    for r in items:
        tag = r.get('tag_name') or ''
        if r.get('draft'):
            drafts += 1
            continue
        if not r.get('published_at') or not ANY_VERSION.match(tag):
            continue
        rel = {'tag': tag, 'published': r['published_at'][:10], 'url': r.get('html_url') or
               f'https://github.com/{repo}/releases/tag/{tag}', 'body': r.get('body') or ''}
        k = key(tag)
        if k is None or r.get('prerelease'):
            candidates.append(rel)
            continue
        if k < FLOOR.get(repo, (0, 0, 0)):
            continue
        rel['key'] = k
        stable.append(rel)
    return stable, candidates, drafts


def window(repo, items, starts, today):
    stable, candidates, drafts = classify(repo, items)
    if not stable:
        stop(f'{repo}: no stable release found')
    stable = [r for r in stable if r['published'] <= today]
    baselines = {}
    for d in starts:
        before = [r for r in stable if r['published'] < d]
        if not before:
            stop(f'{repo}: no stable release was published before {d}, so the window has no baseline')
        baselines[d] = max(before, key=lambda r: r['key'])
    oldest = baselines[min(starts)]
    target = max(stable, key=lambda r: r['key'])
    review, older = [], []
    for r in sorted(stable, key=lambda r: (r['published'], r['key'])):
        if r['key'] > oldest['key']:
            r['dates'] = [d for d in starts if r['key'] > baselines[d]['key']]
            review.append(r)
        elif r['published'] >= min(starts):
            older.append({'tag': r['tag'], 'published': r['published']})
    first = min(starts)
    return {
        'status': 'review' if review else 'up-to-date',
        'baselines': {d: {'tag': b['tag'], 'published': b['published']} for d, b in baselines.items()},
        'target': {'tag': target['tag'], 'published': target['published'], 'url': target['url']} if review else None,
        'review': [{k: r[k] for k in ('tag', 'published', 'url', 'dates', 'body')} for r in review],
        'older_line': older,
        'candidates_ignored': [c['tag'] for c in candidates if first <= c['published'] <= today],
        'drafts_ignored': drafts,
    }


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--inventory')
    ap.add_argument('--since')
    ap.add_argument('--today', default=date.today().isoformat())
    ap.add_argument('--repo', action='append')
    ap.add_argument('--from-json', action='append', default=[])
    ap.add_argument('--out', required=True)
    a = ap.parse_args()

    pages_by_date = {}
    if a.inventory:
        inv = json.load(open(a.inventory, encoding='utf-8'))
        for p in inv['pages']:
            pages_by_date.setdefault(p.get('last_verified') or 'missing', []).append(p['file'])
    if a.since:
        starts = [date.fromisoformat(a.since).isoformat()]
    else:
        if not pages_by_date:
            stop('pass --inventory (the output of guide_inventory.py) or --since')
        if 'missing' in pages_by_date:
            stop('pages without last_verified: ' + ', '.join(pages_by_date['missing']))
        starts = sorted(pages_by_date)
    for d in starts:
        if d > a.today:
            stop(f'start date {d} is after today ({a.today})')
    files = dict(x.split('=', 1) for x in a.from_json)

    result = {'today': a.today, 'start_dates': starts, 'mode': 'since' if a.since else 'last_verified',
              'pages_by_date': pages_by_date, 'repos': {}}
    for repo in a.repo or REPOS:
        items, source, why = None, None, []
        if repo in files:
            items, source = json.load(open(files[repo], encoding='utf-8')), 'file'
        else:
            items, err = from_gh(repo)
            source = 'gh'
            if items is None:
                why.append(err)
                items, err = from_rest(repo)
                source = 'rest'
                if items is None:
                    why.append(err)
                    stop(f'{repo}: releases unreadable ({"; ".join(why)}); pass --from-json {repo}=<FILE>')
        w = window(repo, items, starts, a.today)
        w['source'] = source
        result['repos'][repo] = w

    with open(a.out, 'w', encoding='utf-8') as f:
        json.dump(result, f, indent=2, ensure_ascii=False)
    print(f'window    start dates {", ".join(starts)}; today {a.today}')
    for repo, w in result['repos'].items():
        base = ', '.join(f'{d}: {b["tag"]}' for d, b in w['baselines'].items())
        print(f'{repo}  ({w["source"]})')
        print(f'  baseline  {base}')
        if w['status'] == 'up-to-date':
            print('  status    up to date: no stable release above the baseline')
        else:
            print(f'  target    {w["target"]["tag"]} ({w["target"]["published"]})')
            print('  review    ' + ', '.join(f'{r["tag"]} ({r["published"]})' for r in w['review']))
        if w['older_line']:
            print('  ignored   older-line backports: ' + ', '.join(r['tag'] for r in w['older_line']))
        if w['candidates_ignored']:
            print('  ignored   release candidates: ' + ', '.join(w['candidates_ignored']))
    print(f'wrote {a.out}')


if __name__ == '__main__':
    main()
