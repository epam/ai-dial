#!/usr/bin/env python3
"""Map DIAL service repositories to their docs folders through the overview :::info blocks.

Usage (from the root of the epam/ai-dial checkout):
  python3 -I service_folder.py                      # the whole catalog
  python3 -I service_folder.py REPO_OR_URL [...]    # the folder of each repository

A repository belongs to the folder whose docs_v2/7.services/<N>.<service>/0.index.md
links it inside the :::info block. Exit code 1 when a repository has no folder or several.
"""
import glob
import os
import re
import sys

ROOT = 'docs_v2/7.services'
REPO = re.compile(r'https://github\.com/epam/([A-Za-z0-9_.-]+)')


def name_of(arg):
    arg = arg.strip().rstrip('/')
    m = re.search(r'github\.com/([^/]+)/([^/?#]+)', arg)
    if m:
        return m[1].lower(), re.sub(r'\.git$', '', m[2])
    if '/' in arg:
        owner, repo = arg.split('/', 1)
        return owner.lower(), repo
    return 'epam', arg


def catalog():
    rows = []
    for index in sorted(glob.glob(f'{ROOT}/*/0.index.md'),
                        key=lambda p: int(os.path.basename(os.path.dirname(p)).split('.')[0])):
        lines = open(index, encoding='utf-8').read().split('\n')
        title, repos, in_info = '', [], False
        for line in lines:
            if not title and line.startswith('title:'):
                title = line.split(':', 1)[1].strip().strip('"')
            s = line.strip()
            if s == ':::info':
                in_info = True
                continue
            if in_info and s == ':::':
                in_info = False
                continue
            if in_info:
                for r in REPO.findall(line):
                    if r not in repos:
                        repos.append(r)
        dates = []
        for page in glob.glob(f'{os.path.dirname(index)}/**/*.md', recursive=True):
            m = re.search(r'^last_verified:\s*(\S+)', open(page, encoding='utf-8').read(), re.M)
            if m:
                dates.append(m[1])
        rows.append({'folder': os.path.dirname(index) + '/', 'title': title, 'repos': repos,
                     'pages': len(dates), 'oldest': min(dates) if dates else '-'})
    return rows


def main():
    if not os.path.isdir(ROOT):
        sys.exit(f'run from the ai-dial checkout root; {ROOT} not found')
    rows = catalog()
    if len(sys.argv) == 1:
        for r in rows:
            print(f"{r['folder']:<48} {r['title']:<36} pages={r['pages']:<3} "
                  f"oldest_last_verified={r['oldest']}  repos={', '.join(r['repos']) or '(none)'}")
        return
    status = 0
    for arg in sys.argv[1:]:
        owner, repo = name_of(arg)
        if owner != 'epam':
            print(f'{arg}: not an epam repository; out of scope')
            status = 1
            continue
        hits = [r for r in rows if repo in r['repos']]
        if len(hits) == 1:
            h = hits[0]
            others = [x for x in h['repos'] if x != repo]
            print(f"epam/{repo} -> {h['folder']} ({h['title']}); "
                  f"other repositories in this folder: {', '.join(others) or 'none'}")
        elif not hits:
            print(f'epam/{repo}: no docs folder links it in an :::info block; out of scope')
            status = 1
        else:
            print(f"epam/{repo}: linked by several folders: {', '.join(h['folder'] for h in hits)}")
            status = 1
    sys.exit(status)


if __name__ == '__main__':
    main()
