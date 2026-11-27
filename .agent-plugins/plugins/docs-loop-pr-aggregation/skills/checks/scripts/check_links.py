#!/usr/bin/env python3
"""Fast check of relative links, anchors, and sidebar ids in docs_v2.

Usage (from the root of the epam/ai-dial checkout):
  python3 -I check_links.py [FILE ...]

With no FILE, every page is checked. With FILEs (for example the pages a sync changed),
only links in those pages are checked, but anchors and routes still resolve against the
whole tree. It does not replace `npm run build`, which is authoritative; it catches the
same broken links in seconds and works when node_modules is missing.
"""
import os
import re
import sys

D = 'docs_v2'
PREFIX = re.compile(r'^\d+\.')
LINK = re.compile(r'\]\(([^)\s]+)(?:\s+"[^"]*")?\)')
FENCE = re.compile(r'^\s*(```|~~~)')


def route_of(path):
    parts = [PREFIX.sub('', p) for p in os.path.relpath(path, D).split(os.sep)]
    parts[-1] = re.sub(r'\.mdx?$', '', parts[-1])
    return '/'.join(parts)


def slug(text):
    text = re.sub(r'<[^>]+>', '', text)
    text = re.sub(r'\[([^\]]*)\]\([^)]*\)', r'\1', text)
    text = text.strip().lower().replace('`', '')
    text = re.sub(r'[^\w\- ]', '', text)
    return text.replace(' ', '-')


def main():
    if not os.path.isdir(D):
        sys.exit('run from the ai-dial checkout root')
    files, routes, anchors = [], {}, {}
    for root, _, fs in os.walk(D):
        for f in fs:
            if f.endswith(('.md', '.mdx')):
                p = os.path.join(root, f)
                files.append(p)
                routes[route_of(p)] = p
    for p in files:
        seen, out, in_code = {}, set(), False
        for line in open(p, encoding='utf-8'):
            if FENCE.match(line):
                in_code = not in_code
            if in_code:
                continue
            m = re.match(r'^#{1,6}\s+(.+?)\s*(?:\{#([\w-]+)\})?\s*$', line)
            if m:
                s = m.group(2) or slug(m.group(1))
                n = seen.get(s, 0)
                out.add(s if n == 0 else f'{s}-{n}')
                seen[s] = n + 1
            out.update(re.findall(r'<a\s+(?:id|name)="([^"]+)"', line))
        anchors[p] = out

    targets = [os.path.normpath(f) for f in sys.argv[1:]] or files
    errors, checked = [], 0
    for p in targets:
        if not p.endswith(('.md', '.mdx')) or not os.path.exists(p):
            continue
        in_code = False
        for ln, line in enumerate(open(p, encoding='utf-8'), 1):
            if FENCE.match(line):
                in_code = not in_code
            if in_code:
                continue
            for url in LINK.findall(line):
                if re.match(r'^[a-zA-Z][a-zA-Z0-9+.-]*:', url):
                    continue
                checked += 1
                if url.startswith('/'):
                    errors.append(f'{p}:{ln} absolute link {url}: use a relative .md path')
                    continue
                path, _, frag = url.partition('#')
                tgt = p
                if path:
                    tgt = os.path.normpath(os.path.join(os.path.dirname(p), path))
                    if not os.path.isfile(tgt):
                        if re.search(r'\.[A-Za-z0-9]+$', path):
                            errors.append(f'{p}:{ln} missing file {url}')
                            continue
                        # An extension-less link is a Docusaurus route, relative to the page's route.
                        base = os.path.dirname(route_of(p))
                        r = os.path.normpath(os.path.join(base, path.rstrip('/')))
                        tgt = routes.get(r) or routes.get(r + '/index')
                        if not tgt:
                            errors.append(f'{p}:{ln} missing route {url}')
                            continue
                if frag and tgt.endswith(('.md', '.mdx')) and frag not in anchors.get(tgt, set()):
                    errors.append(f'{p}:{ln} missing anchor {url}')

    sb = open('sidebars-v2.js', encoding='utf-8').read()
    ids = re.findall(r'"id":\s*"([^"]+)"', sb)
    for i in ids:
        if i not in routes:
            errors.append(f'sidebars-v2.js: doc id {i} has no page')
    print(f'checked {checked} relative links in {len(targets)} file(s); {len(ids)} sidebar ids')
    print(f'{len(errors)} error(s)')
    for e in errors:
        print(e)
    sys.exit(1 if errors else 0)


if __name__ == '__main__':
    main()
