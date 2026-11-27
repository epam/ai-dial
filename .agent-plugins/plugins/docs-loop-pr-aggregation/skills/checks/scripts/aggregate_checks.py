#!/usr/bin/env python3
"""Check an aggregation branch after its merges are committed.

Usage (from the root of the epam/ai-dial checkout):
  python3 -I aggregate_checks.py --base <BASE> --prs <WORK>/prs.json [--head HEAD] [--json <WORK>/checks.json]

Errors (must be zero):
  scope        a changed path outside docs_v2/ and sidebars-v2.js
  markers      a conflict marker on an added line
  ancestry     a merged PR head that the branch doesn't contain
  frontmatter  a changed page without a frontmatter block, with a duplicate key, or a bad last_verified
  numbering    two siblings with the same numeric prefix in a folder the merge touched
Warnings (account for each one):
  dropped      a line a PR added that the branch no longer has; each must match a resolution in the conflict ledger
  duplicates   a long line that appears more often than on the base, as when two PRs added the same fact
  whitespace   what `git diff --check` reports
Info:
  overlaps     files changed by more than one merged PR, or by the PR and by the base after the PR branched;
               read the whole diff of each one
"""
import argparse
import json
import re
import subprocess
import sys
from collections import Counter

ALLOWED = ('docs_v2/', 'sidebars-v2.js')
MARKER = re.compile(r'^(<{7}( |$)|>{7}( |$)|\|{7}( |$)|={7}$)')
KEY = re.compile(r'^([A-Za-z_][\w-]*):')
DATE = re.compile(r'^\d{4}-\d{2}-\d{2}$')
TRIVIAL = re.compile(r'^(\|[\s:|-]*\||-{3,}|`{3,}\w*|[#>*-]+)$')
PREFIX = re.compile(r'^(\d+)\.')


def git(*args):
    return subprocess.run(['git', *args], capture_output=True, text=True)


def show(rev, path):
    r = git('show', f'{rev}:{path}')
    return r.stdout if r.returncode == 0 else None


def added_lines(a, b):
    """{path_at_b: [added line, ...]} for the diff a..b, following renames."""
    out, path = {}, None
    for line in git('diff', '-U0', '-M', '--no-color', f'{a}..{b}').stdout.splitlines():
        if line.startswith('+++ '):
            path = line[6:] if line.startswith('+++ b/') else None
        elif line.startswith('+') and path and not line.startswith('+++'):
            out.setdefault(path, []).append(line[1:])
    return out


def renames(a, b):
    m = {}
    for line in git('diff', '--name-status', '-M', f'{a}..{b}').stdout.splitlines():
        p = line.split('\t')
        if p[0].startswith('R'):
            m[p[1]] = p[2]
    return m


def frontmatter_errors(path, text):
    lines = text.split('\n')
    if not lines or lines[0] != '---':
        return [f'{path}: no frontmatter block']
    try:
        end = lines.index('---', 1)
    except ValueError:
        return [f'{path}: frontmatter block not closed']
    errs, keys = [], Counter()
    for l in lines[1:end]:
        m = KEY.match(l)
        if m:
            keys[m[1]] += 1
            if m[1] == 'last_verified':
                v = l.split(':', 1)[1].strip().strip('"\'')
                if not DATE.match(v):
                    errs.append(f'{path}: last_verified is "{v}", not YYYY-MM-DD')
    errs += [f'{path}: frontmatter key "{k}" appears {n} times' for k, n in keys.items() if n > 1]
    return errs


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--base', required=True)
    ap.add_argument('--prs', required=True)
    ap.add_argument('--head', default='HEAD')
    ap.add_argument('--json')
    a = ap.parse_args()
    with open(a.prs, encoding='utf-8') as f:
        data = json.load(f)
    head = git('rev-parse', a.head).stdout.strip()
    base = git('rev-parse', a.base).stdout.strip()
    mb = git('merge-base', base, head).stdout.strip()
    E, W, I = {}, {}, {}

    def add(d, k, msg):
        d.setdefault(k, []).append(msg)

    ns = [l.split('\t') for l in git('diff', '--name-status', '-M', f'{mb}..{head}').stdout.splitlines() if l]
    changed = {p[-1]: p[0][0] for p in ns}
    for p in ns:
        for x in p[1:]:
            if not (x.startswith(ALLOWED[0]) or x == ALLOWED[1]):
                add(E, 'scope', f'{x} ({p[0]})')

    for path, lines in added_lines(mb, head).items():
        for l in lines:
            if MARKER.match(l):
                add(E, 'markers', f'{path}: {l[:60]}')
    for l in git('diff', '--check', f'{mb}..{head}').stdout.splitlines():
        if l.startswith('+') or 'conflict marker' in l:
            continue
        add(W, 'whitespace', l)

    merged = [r for r in data['prs'] if r['role'] in ('source', 'close-only', 'aggregation') and r.get('head')]
    for r in merged:
        if git('merge-base', '--is-ancestor', r['head'], head).returncode:
            add(E, 'ancestry', f'#{r["number"]} head {r["head"][:10]} is not in {a.head}')

    for path, st in changed.items():
        if st == 'D' or not (path.startswith('docs_v2/') and path.endswith(('.md', '.mdx'))):
            continue
        text = show(head, path)
        if text is not None:
            for e in frontmatter_errors(path, text):
                add(E, 'frontmatter', e)

    dirs = {p.rsplit('/', 1)[0] for p, st in changed.items() if p.startswith('docs_v2/') and '/' in p and st in 'AR'}
    for d in sorted(dirs):
        names = git('ls-tree', '--name-only', f'{head}:{d}').stdout.split()
        prefixes = Counter(m[1] for n in names if n != 'img' for m in [PREFIX.match(n)] if m)
        for pre, n in prefixes.items():
            if n > 1:
                same = [x for x in names if x.startswith(f'{pre}.')]
                add(E, 'numbering', f'{d}/: prefix {pre}. used by ' + ', '.join(same))

    agg_renames = renames(mb, head)
    head_text = {}
    for r in merged:
        if r['role'] == 'close-only':
            continue
        for path, lines in added_lines(r['merge_base'], r['head']).items():
            target = agg_renames.get(path, path)
            if target not in head_text:
                t = show(head, target)
                head_text[target] = {x.strip() for x in t.split('\n')} if t is not None else None
            have = head_text[target]
            for l in lines:
                s = l.strip()
                if len(s) < 3 or TRIVIAL.match(s) or s.startswith('last_verified:'):
                    continue
                if have is None:
                    add(W, 'dropped', f'#{r["number"]} {path}: the file is gone from the branch')
                    break
                if s not in have:
                    add(W, 'dropped', f'#{r["number"]} {target}: {s[:110]}')

    for path, st in changed.items():
        if st == 'D' or not path.startswith('docs_v2/'):
            continue
        now = Counter(x.strip() for x in (show(head, path) or '').split('\n') if len(x.strip()) >= 40)
        before = Counter(x.strip() for x in (show(mb, path) or '').split('\n') if len(x.strip()) >= 40)
        for line, n in now.items():
            if n > 1 and n > before.get(line, 0) and not TRIVIAL.match(line):
                add(W, 'duplicates', f'{path}: {n}x {line[:100]}')

    for p, nums in sorted(data.get('overlaps', {}).items()):
        add(I, 'overlaps', f'{p}: ' + ', '.join(f'#{n}' for n in nums))
    for r in merged:
        if r['role'] == 'close-only':
            continue
        moved = set(git('diff', '--name-only', f'{r["merge_base"]}..{base}').stdout.split())
        for p in sorted(moved & set(r['files'])):
            add(I, 'overlaps', f'{p}: #{r["number"]} and the base after #{r["number"]} branched')

    for title, d in (('error', E), ('warning', W), ('info', I)):
        for k, msgs in d.items():
            print(f'{title} {k}: {len(msgs)}')
            for m in msgs[:60]:
                print(f'  {m}')
            if len(msgs) > 60:
                print(f'  ... {len(msgs) - 60} more (see --json)')
    ne, nw = sum(map(len, E.values())), sum(map(len, W.values()))
    print(f'{len(changed)} changed path(s) vs {a.base}; {ne} error(s), {nw} warning(s)')
    if a.json:
        with open(a.json, 'w', encoding='utf-8') as f:
            json.dump({'errors': E, 'warnings': W, 'info': I}, f, indent=1)
    sys.exit(1 if ne else 0)


if __name__ == '__main__':
    main()
