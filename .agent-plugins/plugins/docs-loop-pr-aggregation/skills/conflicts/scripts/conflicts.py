#!/usr/bin/env python3
"""Describe the conflicts of the merge in progress, hunk by hunk, so each one can be resolved from the evidence.

Usage (from the checkout root, while `git merge` has stopped on conflicts):
  python3 -I conflicts.py [--out FILE]     # report every conflicted path
  python3 -I conflicts.py --check          # exit 1 while any conflict or conflict marker remains

Run the merge with `git -c merge.conflictStyle=zdiff3 merge ...` so each hunk carries the base text.
For each path: the conflict kind (both modified, both added, deleted by one side, ...), the commits
of each side that touched it, and every hunk with its ours, base, and theirs text plus a hint.
The script only reads; it never resolves anything.
"""
import argparse
import re
import subprocess
import sys

KINDS = {'UU': 'both modified', 'AA': 'both added', 'DU': 'deleted by ours (the aggregation), modified by theirs',
         'UD': 'modified by ours (the aggregation), deleted by theirs', 'AU': 'added by ours only', 'UA': 'added by theirs only',
         'DD': 'deleted on both sides'}
START, BASE_M, MID, END = re.compile(r'^<{7}( |$)'), re.compile(r'^\|{7}( |$)'), re.compile(r'^={7}$'), re.compile(r'^>{7}( |$)')
DATE = re.compile(r'^last_verified:\s*"?(\d{4}-\d{2}-\d{2})"?\s*$')


def git(*args):
    return subprocess.run(['git', *args], capture_output=True, text=True)


def unmerged():
    out = {}
    for line in git('status', '--porcelain=v1', '--untracked-files=no').stdout.splitlines():
        xy, path = line[:2], line[3:]
        if xy in KINDS:
            out[path.split(' -> ')[-1]] = xy
    return out


def hunks(text):
    lines, out, i = text.split('\n'), [], 0
    while i < len(lines):
        if START.match(lines[i]):
            h = {'line': i + 1, 'ours': [], 'base': [], 'theirs': [], 'zdiff3': False}
            part = 'ours'
            i += 1
            while i < len(lines) and not END.match(lines[i]):
                if BASE_M.match(lines[i]):
                    part, h['zdiff3'] = 'base', True
                elif MID.match(lines[i]):
                    part = 'theirs'
                else:
                    h[part].append(lines[i])
                i += 1
            h['end'] = i + 1
            out.append(h)
        i += 1
    return out


def in_frontmatter(text, line_no):
    lines = text.split('\n')
    if not lines or lines[0] != '---':
        return False
    for i, l in enumerate(lines[1:], start=2):
        if l == '---':
            return line_no < i
    return False


def hint(path, h, text):
    sides = h['ours'] + h['base'] + h['theirs']
    if in_frontmatter(text, h['line']):
        dates = [m[1] for l in h['ours'] + h['theirs'] for m in [DATE.match(l)] if m]
        others = [l for l in sides if not DATE.match(l)]
        if dates and not others:
            return f'frontmatter last_verified only: keep the later date, {max(dates)}'
        return 'frontmatter: keep every field once; a date field takes the later date'
    if path == 'sidebars-v2.js':
        return 'sidebar entries: keep both, in folder order; the result must stay valid JavaScript'
    if not h['base'] and h['zdiff3']:
        return 'both sides added text at the same place: keep both unless they state the same fact'
    if all(l.lstrip().startswith('|') for l in h['ours'] + h['theirs'] if l.strip()):
        return 'table rows: keep every row from both sides once, in the table\'s order; merge two edits of the same row'
    if not h['ours'] or not h['theirs']:
        return 'one side removed these lines, the other changed them: the side whose source is newer and proven wins'
    return 'same lines changed on both sides: combine both edits when they change different facts; otherwise the newer proven source wins'


def side_commits(path):
    r = git('log', '--left-right', '--format=%m %h %s', 'HEAD...MERGE_HEAD', '--', path)
    ours = [l[2:] for l in r.stdout.splitlines() if l.startswith('<')]
    theirs = [l[2:] for l in r.stdout.splitlines() if l.startswith('>')]
    return ours, theirs


def check():
    left = unmerged()
    marked = []
    for path in git('diff', '--name-only', 'HEAD').stdout.splitlines():
        try:
            with open(path, encoding='utf-8') as f:
                text = f.read()
        except (FileNotFoundError, IsADirectoryError, UnicodeDecodeError):
            continue
        for n, l in enumerate(text.split('\n'), start=1):
            if START.match(l) or END.match(l) or BASE_M.match(l):
                marked.append(f'{path}:{n}: {l[:40]}')
    for p, xy in left.items():
        print(f'unresolved: {p} ({KINDS[xy]})')
    for m in marked:
        print(f'conflict marker: {m}')
    print(f'{len(left)} unresolved path(s), {len(marked)} marker line(s)')
    return 1 if left or marked else 0


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--out')
    ap.add_argument('--check', action='store_true')
    a = ap.parse_args()
    if a.check:
        sys.exit(check())
    if git('rev-parse', '-q', '--verify', 'MERGE_HEAD').returncode:
        sys.exit('no merge in progress')
    mh = git('log', '-1', '--format=%h %s', 'MERGE_HEAD').stdout.strip()
    rep = [f'# Conflicts merging {mh}', '']
    paths = unmerged()
    if not paths:
        rep.append('No conflicted path.')
    for path, xy in sorted(paths.items()):
        ours, theirs = side_commits(path)
        rep += [f'## {path}', '', f'- kind: {KINDS[xy]}',
                f'- ours (the aggregation branch): ' + ('; '.join(ours[:6]) or 'no commit since the merge base'),
                f'- theirs (the PR being merged): ' + ('; '.join(theirs[:6]) or 'no commit since the merge base'), '']
        if xy not in ('UU', 'AA'):
            rep += ['Not a text conflict: decide which version of the file stays, from both PRs\' bodies and sources. '
                    'Read the other side with `git show :2:<path>` (ours) and `git show :3:<path>` (theirs).', '']
            continue
        try:
            with open(path, encoding='utf-8') as f:
                text = f.read()
        except UnicodeDecodeError:
            rep += ['Binary file: a text resolution is impossible; see "When to abort" in the conflicts skill.', '']
            continue
        hs = hunks(text)
        if not hs:
            rep += ['No conflict markers: the conflict is in the file mode or the rename; compare `:2:` and `:3:`.', '']
        for i, h in enumerate(hs, start=1):
            rep += [f'### Hunk {i}, lines {h["line"]}-{h["end"]}', '', f'Hint: {hint(path, h, text)}', '']
            for name in ('ours', 'base', 'theirs'):
                if name == 'base' and not h['zdiff3']:
                    rep.append('base: not shown; rerun the merge with -c merge.conflictStyle=zdiff3')
                    continue
                body = '\n'.join(h[name]) if h[name] else '(nothing)'
                rep += [f'{name}:', '```text', body, '```']
            rep.append('')
    text = '\n'.join(rep)
    if a.out:
        with open(a.out, 'w', encoding='utf-8') as f:
            f.write(text + '\n')
        print(f'{len(paths)} conflicted path(s); report in {a.out}')
    else:
        print(text)


if __name__ == '__main__':
    main()
