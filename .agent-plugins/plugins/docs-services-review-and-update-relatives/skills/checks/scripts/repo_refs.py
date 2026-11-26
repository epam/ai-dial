#!/usr/bin/env python3
"""Check that the paths in this repository that the guides point readers to still exist.

Usage (from the root of the epam/ai-dial checkout):
  python3 -I repo_refs.py [--base BASE] [--added-only] [FILE ...]

With no FILE, every page of the four target sections is checked. It finds:
  - links to https://github.com/epam/ai-dial/blob|tree/<ref>/<path>;
  - `cd ai-dial/<path>` in a code block, the step after cloning this repository;
  - backticked paths whose first segment is, or once was, a top-level directory here and is
    distinctive to this repository (`dial-*` or `docs_v2`), such as `dial-docker-compose/ollama`.
    Generic names such as `src/` or `docs/` are skipped: on a library page they mean that
    library's repository.
Each path must exist at BASE (default origin/development, else development). A link pinned to
main is also checked at origin/main or main when that branch exists. For a missing path the
report names the commit that removed it. --added-only checks only lines added since BASE, for
the final checks of a run. Exit code 1 when a checked path is missing.
"""
import argparse
import os
import re
import subprocess
import sys

TARGET_NAMES = ('understand-dial', 'connecting-to-dial', 'building-with-dial', 'operating-dial')
GH = re.compile(r'https://github\.com/epam/ai-dial/(?:blob|tree)/([\w.-]+)/([^)\]\s#?"\'`]+)')
CD = re.compile(r'\bcd\s+ai-dial/([\w./-]+)')
TICK = re.compile(r'`([a-z][\w.-]*/[\w./-]*)`')
FENCE = re.compile(r'^\s*(```|~~~)')


def git(*args):
    return subprocess.run(['git', *args], capture_output=True, text=True)


def commit_of(ref):
    r = git('rev-parse', '--verify', '-q', f'{ref}^{{commit}}')
    return r.stdout.strip() if r.returncode == 0 else None


def exists(rev, path):
    return git('cat-file', '-e', f'{rev}:{path.rstrip("/")}').returncode == 0


def removed_by(path):
    out = git('log', '--all', '-1', '--format=%h %ad %s', '--date=short', '--diff-filter=D', '--', path.rstrip('/')).stdout.strip()
    if not out:
        out = git('log', '--all', '-1', '--format=%h %ad %s', '--date=short', '--diff-filter=D', '--', path.rstrip('/') + '/*').stdout.strip()
    return out


def added_lines(base, path):
    if git('ls-files', '--error-unmatch', path).returncode != 0:
        return None
    res = git('diff', '-U0', base, '--', path).stdout
    nums = set()
    for m in re.finditer(r'^@@ -\S+ \+(\d+)(?:,(\d+))? @@', res, re.M):
        start, count = int(m[1]), int(m[2] or 1)
        nums.update(range(start, start + count))
    return nums


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--base')
    ap.add_argument('--added-only', action='store_true')
    ap.add_argument('files', nargs='*')
    a = ap.parse_args()
    base = a.base or next((r for r in ('origin/development', 'development') if commit_of(r)), None)
    if not base:
        sys.exit('no origin/development and no local development branch; pass --base')
    main_ref = next((r for r in ('origin/main', 'main') if commit_of(r)), None)
    files = a.files
    if not files:
        for sec in sorted(os.listdir('docs_v2')):
            if re.sub(r'^\d+\.', '', sec) in TARGET_NAMES:
                for root, _, fs in os.walk(os.path.join('docs_v2', sec)):
                    files += [os.path.join(root, f) for f in fs if f.endswith('.md')]
    top_now = set(git('ls-tree', '--name-only', base).stdout.split())
    seg_cache = {}

    def repo_segment(seg):
        if not (seg.startswith('dial-') or seg == 'docs_v2'):
            return False
        if seg not in seg_cache:
            seg_cache[seg] = seg in top_now or bool(git('log', '--all', '-1', '--format=%h', '--', seg).stdout.strip())
        return seg_cache[seg]

    missing, checked = [], 0
    for f in sorted(files):
        if not os.path.isfile(f):
            continue
        only = added_lines(base, f) if a.added_only else None
        in_code = False
        for n, line in enumerate(open(f, encoding='utf-8'), 1):
            if FENCE.match(line):
                in_code = not in_code
            if only is not None and n not in only:
                continue
            refs = []
            for ref, path in GH.findall(line):
                refs.append((path, ref))
            if in_code:
                refs += [(p, None) for p in CD.findall(line)]
            for p in TICK.findall(line):
                if not re.search(r'[<>{}*]', p) and repo_segment(p.split('/')[0]):
                    refs.append((p, None))
            for path, ref in refs:
                path = path.rstrip('.,;:')
                checked += 1
                revs = [base]
                if ref == 'main' and main_ref:
                    revs.append(main_ref)
                elif ref and ref not in ('main', 'development', 'master') and commit_of(ref):
                    revs = [ref]
                for rev in revs:
                    if not exists(rev, path):
                        why = removed_by(path)
                        missing.append(f'{f}:{n} `{path}` does not exist at {rev}' + (f' (removed by {why})' if why else ''))
                        break
    print(f'checked {checked} repository paths in {len(files)} file(s) against {base}' + (f' and {main_ref}' if main_ref else ''))
    print(f'{len(missing)} missing')
    for m in missing:
        print('  ' + m)
    sys.exit(1 if missing else 0)


if __name__ == '__main__':
    main()
