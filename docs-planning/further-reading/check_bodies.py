#!/usr/bin/env python3
"""
Prove that only the closing link blocks changed: for every docs_v2 page, the text ABOVE the first closing
heading (Next steps / Where to go next / Further reading / Related ...) must be identical to the baseline,
ignoring trailing blank lines. Exit code 1 on any difference.

Baseline = git HEAD (default) or a directory copy (--old-root, for dry runs).
The moved entry page is compared with its old path, with its expected link rewrite (`](../` -> `](./`).

Usage (repo root):  python3 -I check_bodies.py --root docs_v2
                    python3 -I check_bodies.py --root /tmp/copy/docs_v2 --old-root /tmp/orig/docs_v2
"""
import argparse, os, re, subprocess, sys

CLOSING = re.compile(r'^## (Next steps|Where to go next|Further reading|Related tasks|Related pages|Related troubleshooting)\s*$', re.I)
RENAMES = {'1.overview.md': ('1.home/0.index.md', lambda t: t.replace('](../', '](./'))}


def body(text):
    lines, in_code, out = text.split('\n'), False, []
    for l in lines:
        if l.startswith('```') or l.startswith('~~~'):
            in_code = not in_code
        if not in_code and CLOSING.match(l):
            break
        out.append(l)
    while out and not out[-1].strip():
        out.pop()
    return '\n'.join(out)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--root', default='docs_v2')
    ap.add_argument('--old-root', default=None)
    a = ap.parse_args()
    diffs = checked = 0
    for dp, _, fn in os.walk(a.root):
        for f in sorted(fn):
            if not f.endswith('.md'):
                continue
            p = os.path.join(dp, f)
            rel = os.path.relpath(p, a.root).replace(os.sep, '/')
            if '/changelog/' in '/' + rel and f != 'index.md':
                continue
            old_rel, fix = RENAMES.get(rel, (rel, lambda t: t))
            if a.old_root:
                op = os.path.join(a.old_root, old_rel)
                old = open(op, encoding='utf-8').read() if os.path.exists(op) else None
            else:
                r = subprocess.run(['git', 'show', f'HEAD:docs_v2/{old_rel}'], capture_output=True, text=True)
                old = r.stdout if r.returncode == 0 else None
            if old is None:
                print(f'NEW FILE (no baseline): {rel}')
                diffs += 1
                continue
            checked += 1
            if body(fix(old)) != body(open(p, encoding='utf-8').read()):
                print(f'BODY CHANGED: {rel}')
                diffs += 1
    print(f'pages compared: {checked}   differences: {diffs}')
    sys.exit(1 if diffs else 0)


if __name__ == '__main__':
    main()
