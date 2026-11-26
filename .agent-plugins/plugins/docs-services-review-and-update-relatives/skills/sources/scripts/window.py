#!/usr/bin/env python3
"""Find the window of commits that a guide alignment run reviews.

Usage (from the root of the epam/ai-dial checkout):
  python3 -I window.py [--base BASE] [--since DATE|COMMIT|#PR] [--today YYYY-MM-DD] --out FILE

BASE defaults to origin/development, else the local development branch. The window ends at BASE
and starts, exclusive, at:
  1. --since, when given: a date (the last first-parent commit before that day), a commit, or a
     pull request number such as #687 (the window starts after the commit that merged it);
  2. otherwise the commit named by the newest alignment commit on BASE, whose message contains
     "align with docs and release changes through <SHA>";
  3. otherwise the last first-parent commit before the same day one month ago.
A commit in the window that adds 50 or more pages under docs_v2/ is a bulk import, such as the
creation of the tree: pages written together carry no change from one to the other, so the window
then starts after the newest such commit.
Writes JSON to --out and prints a summary. Exit code 1 when no window can be set.
"""
import argparse
import calendar
import json
import re
import subprocess
import sys
from datetime import date

MARKER = re.compile(r'align with docs and release changes through ([0-9a-f]{10,40})')
MARKER_GREP = 'align with docs and release changes through [0-9a-f]{10}'
BULK_PAGES = 50
PATHS = ['docs_v2', 'docs/releases', 'sidebars-v2.js']
TARGET_NAMES = ('understand-dial', 'connecting-to-dial', 'building-with-dial', 'operating-dial')


def git(*args):
    return subprocess.run(['git', *args], capture_output=True, text=True)


def commit_of(ref):
    r = git('rev-parse', '--verify', '-q', f'{ref}^{{commit}}')
    return r.stdout.strip() if r.returncode == 0 else None


def before(day, base):
    out = git('rev-list', '-1', '--first-parent', f'--before={day} 00:00:00', base).stdout.strip()
    return out or None


def month_ago(today):
    y, m = (today.year, today.month - 1) if today.month > 1 else (today.year - 1, 12)
    return date(y, m, min(today.day, calendar.monthrange(y, m)[1]))


def area(path):
    """Classify a path by its unnumbered section name, so commits from before a renumbering
    (4.operating-dial, 6.services) land in the same area as today's paths."""
    p = path.split('/')
    if p[0] == 'sidebars-v2.js':
        return 'menu'
    if p[0] == 'docs':
        return f'releases/{p[2]}' if len(p) > 2 else 'releases'
    if len(p) < 2:
        return 'other'
    sec = re.sub(r'^\d+\.', '', p[1])
    if sec in TARGET_NAMES:
        return f'target/{sec}'
    if sec == 'services':
        return f'services/{re.sub(r"^[0-9]+[.]", "", p[2])}' if len(p) > 3 else 'services/landing'
    names = {'overview.md': 'overview', 'administering-dial-new': 'admin-guide',
             'chat-user-guide': 'chat-guide', 'demos': 'demos'}
    return names.get(sec, f'other/{sec}')


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--base')
    ap.add_argument('--since', help='YYYY-MM-DD, a commit, or #<PR>')
    ap.add_argument('--today', default=date.today().isoformat())
    ap.add_argument('--out', required=True)
    a = ap.parse_args()
    today = date.fromisoformat(a.today)

    base_ref = a.base or next((r for r in ('origin/development', 'development') if commit_of(r)), None)
    if not base_ref or not commit_of(base_ref):
        sys.exit('STOP: no origin/development and no local development branch; pass --base')
    base = commit_of(base_ref)

    start, mode, note = None, None, ''
    if a.since:
        s = a.since.strip()
        if re.fullmatch(r'\d{4}-\d{2}-\d{2}', s):
            start, mode = before(s, base), f'since {s}'
        elif re.fullmatch(r'#?\d+', s):
            n = s.lstrip('#')
            start = git('log', base, '--first-parent', '-E', f'--grep=\\(#{n}\\)', '--format=%H', '-1').stdout.strip() or None
            mode = f'since #{n}'
        else:
            start, mode = commit_of(s), f'since {s}'
        if not start:
            sys.exit(f'STOP: --since {s} matches no commit on {base_ref}')
    else:
        log = git('log', base, '-E', f'--grep={MARKER_GREP}', '--format=%H%x1f%B%x1e', '-n', '5').stdout
        for rec in filter(None, (r.strip() for r in log.split('\x1e'))):
            sha, _, msg = rec.partition('\x1f')
            m = MARKER.search(msg)
            target = commit_of(m[1]) if m else None
            if target and git('merge-base', '--is-ancestor', target, base).returncode == 0:
                start, mode = target, 'previous alignment run'
                note = f'marker in {sha[:10]}: {msg.splitlines()[0][:100]}'
                break
        if not start:
            day = month_ago(today).isoformat()
            start, mode = before(day, base), f'one month (since {day}); no previous alignment run found'
            if not start:
                start = git('rev-list', '--max-parents=0', base).stdout.split()[-1]
                mode += '; history is shorter, so the window starts at the first commit'

    fmt = '%H%x1f%ad%x1f%s'
    rows = git('log', '--first-parent', '--reverse', f'--format={fmt}', '--date=short', f'{start}..{base}').stdout
    commits, bulk, skipped = [], [], 0
    for line in filter(None, rows.split('\n')):
        sha, day, subject = line.split('\x1f', 2)
        ns = git('diff', '--name-status', '-M30%', f'{sha}^1', sha, '--', *PATHS).stdout
        entries = [l.split('\t') for l in ns.splitlines() if l]
        if not entries:
            skipped += 1
            continue
        areas = {}
        added_pages = 0
        for e in entries:
            st, path = e[0][0], e[-1]
            areas[area(path)] = areas.get(area(path), 0) + 1
            if st == 'A' and path.startswith('docs_v2/') and path.endswith('.md'):
                added_pages += 1
        msg = git('log', '-1', '--format=%B', sha).stdout
        pr = re.search(r'\(#(\d+)\)\s*$', subject)
        c = {'sha': sha, 'date': day, 'subject': subject, 'pr': int(pr[1]) if pr else None,
             'files': len(entries), 'added_pages': added_pages, 'areas': areas,
             'alignment_run': bool(MARKER.search(msg))}
        commits.append(c)
        if added_pages >= BULK_PAGES:
            bulk.append(c)

    eff = start
    if bulk:
        eff = bulk[-1]['sha']
        keep = False
        trimmed = []
        for c in commits:
            if keep:
                trimmed.append(c)
            if c['sha'] == eff:
                keep = True
        commits = trimmed

    def info(sha):
        d, s = git('log', '-1', '--format=%ad%x1f%s', '--date=short', sha).stdout.strip().split('\x1f', 1)
        return {'commit': sha, 'date': d, 'subject': s}

    out = {
        'base_ref': base_ref, 'base': info(base), 'today': today.isoformat(),
        'start': dict(info(start), mode=mode, note=note),
        'effective_start': dict(info(eff), reason=(f'bulk import of {bulk[-1]["added_pages"]} pages' if bulk else 'same as start')),
        'bulk_imports_skipped': [{'sha': c['sha'], 'date': c['date'], 'subject': c['subject'], 'added_pages': c['added_pages']} for c in bulk],
        'commits': commits, 'commits_without_docs_changes': skipped,
    }
    with open(a.out, 'w', encoding='utf-8') as f:
        json.dump(out, f, indent=1)

    print(f'base: {base_ref} at {base[:10]} ({out["base"]["date"]})')
    print(f'start: {start[:10]} ({out["start"]["date"]}), {mode}' + (f'\n  {note}' if note else ''))
    for c in out['bulk_imports_skipped']:
        print(f'bulk import skipped: {c["sha"][:10]} {c["date"]} {c["subject"][:70]} ({c["added_pages"]} pages added)')
    print(f'window: {eff[:10]}..{base[:10]}, {len(commits)} commits with docs changes, {skipped} without')
    for c in commits:
        flag = ' [alignment run]' if c['alignment_run'] else ''
        areas = ', '.join(f'{k} {v}' for k, v in sorted(c['areas'].items()))
        print(f'  {c["sha"][:10]} {c["date"]} {c["subject"][:80]}{flag}\n      {areas}')


if __name__ == '__main__':
    main()
