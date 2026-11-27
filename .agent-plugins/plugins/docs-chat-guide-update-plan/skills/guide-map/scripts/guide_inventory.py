"""List the pages of the DIAL Chat User Guide with their dates, headings, screenshots, and UI labels.

Usage (from the root of the epam/ai-dial checkout):
  python3 -I guide_inventory.py [--root docs_v2/8.chat-user-guide] --out <WORK>/guide.json

Reads every .md page under --root, in menu order (the numeric prefixes), and skips code blocks.
For each page, the output (--out) holds:
  file           the repository-relative path
  title          the frontmatter title
  last_verified  the frontmatter date, or null when it is missing
  lines          the page's line count
  headings       [{line, level, text, anchor}]; anchor is the Docusaurus id (`{#id}` wins)
  images         [{line, path, alt, exists}]; path is repository-relative
  labels         [{line, text}]: every **bold** span, which is how the guide names UI elements
The top level holds "root" and "dates": {last_verified: [files]}.

Stdout: one line per page (date, headings, images, labels), and the distinct dates.
It only reads: it never edits, commits, pushes, or writes to GitHub.
Exit 0 when the run can go on; exit 1 with a "STOP: <reason>" line when the folder has no pages.
A missing image is printed as a "warning" line: the build would fail on it, so it belongs under
"Needs review".
"""
import argparse
import json
import os
import re
import sys

HEADING = re.compile(r'^(#{1,6})\s+(.+?)\s*(?:\{#([\w-]+)\})?\s*$')
IMAGE = re.compile(r'!\[([^\]]*)\]\(([^)\s]+)(?:\s+"[^"]*")?\)')
BOLD = re.compile(r'\*\*(?!\s)(.+?)(?<!\s)\*\*')
FENCE = re.compile(r'^\s*(```|~~~)')


def order_key(path):
    parts = []
    for seg in path.split(os.sep):
        m = re.match(r'^(\d+)\.', seg)
        parts.append((int(m.group(1)) if m else 10**6, seg))
    return parts


def slug(text, seen):
    s = re.sub(r'`|\*\*|\*|_', '', text)
    s = re.sub(r'\[([^\]]*)\]\([^)]*\)', r'\1', s).strip().lower()
    s = re.sub(r'[^\w\- ]', '', s, flags=re.U).replace(' ', '-')
    n = seen.get(s, 0)
    seen[s] = n + 1
    return s if n == 0 else f'{s}-{n}'


def frontmatter(lines):
    front = {}
    if lines and lines[0].strip() == '---':
        for i in range(1, len(lines)):
            if lines[i].strip() == '---':
                return front, i + 1
            m = re.match(r'^([\w-]+):\s*(.*)$', lines[i])
            if m:
                front[m.group(1)] = m.group(2).strip().strip('"\'')
    return front, 0


def scan(path, repo_root):
    lines = open(path, encoding='utf-8').read().split('\n')
    front, body_start = frontmatter(lines)
    page = {'file': os.path.relpath(path, repo_root), 'title': front.get('title'),
            'last_verified': front.get('last_verified') or None, 'lines': len(lines),
            'headings': [], 'images': [], 'labels': []}
    seen, in_code = {}, False
    for n, line in enumerate(lines, 1):
        if n <= body_start:
            continue
        if FENCE.match(line):
            in_code = not in_code
            continue
        if in_code:
            continue
        h = HEADING.match(line)
        if h:
            text = h.group(2)
            anchor = h.group(3) or slug(text, seen)
            page['headings'].append({'line': n, 'level': len(h.group(1)), 'text': text, 'anchor': anchor})
        for m in IMAGE.finditer(line):
            target = m.group(2)
            if target.startswith(('http://', 'https://')):
                continue
            full = os.path.normpath(os.path.join(os.path.dirname(path), target))
            page['images'].append({'line': n, 'path': os.path.relpath(full, repo_root), 'alt': m.group(1),
                                   'exists': os.path.isfile(full)})
        for m in BOLD.finditer(IMAGE.sub('', line)):
            page['labels'].append({'line': n, 'text': m.group(1)})
    return page


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--root', default='docs_v2/8.chat-user-guide')
    ap.add_argument('--out', required=True)
    a = ap.parse_args()
    repo_root = os.getcwd()
    if not os.path.isdir(a.root):
        print(f'STOP: {a.root} is not a folder; run from the root of the ai-dial checkout')
        sys.exit(1)
    paths = []
    for d, _, files in os.walk(a.root):
        paths += [os.path.join(d, f) for f in files if f.endswith('.md') and not f.startswith('_')]
    paths.sort(key=lambda p: order_key(os.path.relpath(p, a.root)))
    if not paths:
        print(f'STOP: no pages under {a.root}')
        sys.exit(1)
    pages = [scan(p, repo_root) for p in paths]
    dates = {}
    for p in pages:
        dates.setdefault(p['last_verified'] or 'missing', []).append(p['file'])
    with open(a.out, 'w', encoding='utf-8') as f:
        json.dump({'root': a.root, 'dates': dates, 'pages': pages}, f, indent=2, ensure_ascii=False)
    for p in pages:
        print(f"{p['last_verified'] or 'NO DATE':<10}  {p['file']}  headings {len(p['headings'])}, "
              f"images {len(p['images'])}, labels {len(p['labels'])}")
    print('dates     ' + '; '.join(f'{d}: {len(f)} page(s)' for d, f in sorted(dates.items())))
    missing = [f"{p['file']}:{i['line']} {i['path']}" for p in pages for i in p['images'] if not i['exists']]
    if missing:
        print('warning   images the pages show are missing: ' + '; '.join(missing))
    print(f'wrote {a.out}')


if __name__ == '__main__':
    main()
