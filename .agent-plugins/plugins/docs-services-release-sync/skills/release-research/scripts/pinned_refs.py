#!/usr/bin/env python3
"""List what a DIAL service docs folder pins to releases, and what has drifted.

Usage:
  python3 -I pinned_refs.py DOCS_FOLDER [--repo REPO] [--clone DIR --target TAG] [--json]

Reports, per page:
  - last_verified from the frontmatter;
  - GitHub links pinned to a tag (repo, tag, path, line range) and links to branches;
  - image tags pinned in text or examples (epam/<image>:<tag>);
  - version statements in prose that a new release can make stale.

With --repo, --clone, and --target, it also checks every link pinned to that repository:
  unchanged  the file is identical at the target, so the claim still holds;
  changed    the file differs at the target: re-verify the sentence that cites it;
  missing    the file no longer exists at the target: fix the link and the claim.
"""
import argparse
import json
import os
import re
import subprocess
import sys

GH = re.compile(r'https://github\.com/epam/([\w.-]+)/(blob|tree|raw|releases/tag|compare)/'
                r'([^/\s)#>"\']+)((?:/[^\s)#>"\']*)?)(#L(\d+)(?:-L(\d+))?)?')
IMAGE = re.compile(r'\b(?:ghcr\.io/)?epam/(ai-dial-[a-z0-9-]+):([0-9][\w.-]*)')
BRANCH = re.compile(r'^(main|master|development|develop|gh-pages|release-[\w.]+)$')
STATEMENTS = re.compile(
    r'(checked against|^#+ .*version scope|reference release|platform releases? pins?|'
    r'\bpins? \d+\.\d+|no release has|`development` branch|development branch|'
    r'\bin \d+\.\d+\.\d+,|\bsince (?:version )?\d+\.\d+|\bfirst release\b|\*\*\d+\.\d+\.\d+\*\*|'
    r'\bminimum dial core\b|\bor later\b)', re.IGNORECASE)


def frontmatter(lines):
    data = {}
    if lines and lines[0].strip() == '---':
        for line in lines[1:]:
            if line.strip() == '---':
                break
            k, _, v = line.partition(':')
            data[k.strip()] = v.strip().strip('"')
    return data


def scan(folder):
    pages = []
    for root, _, files in os.walk(folder):
        for f in sorted(files):
            if not f.endswith(('.md', '.mdx')):
                continue
            path = os.path.join(root, f)
            lines = open(path, encoding='utf-8').read().split('\n')
            page = {'page': path, 'last_verified': frontmatter(lines).get('last_verified'),
                    'pins': [], 'branches': [], 'images': [], 'statements': []}
            in_code = False
            for n, line in enumerate(lines, 1):
                if line.lstrip().startswith('```'):
                    in_code = not in_code
                for m in GH.finditer(line):
                    repo, kind, ref, rest, _, l1, l2 = m.groups()
                    entry = {'line': n, 'repo': repo, 'kind': kind, 'ref': ref,
                             'path': rest.lstrip('/'), 'lines': f'L{l1}-L{l2 or l1}' if l1 else ''}
                    (page['branches'] if BRANCH.match(ref) else page['pins']).append(entry)
                for m in IMAGE.finditer(line):
                    page['images'].append({'line': n, 'image': m[1], 'tag': m[2]})
                m = None if in_code else STATEMENTS.search(line)
                if m:
                    start = max(0, m.start() - 90)
                    text = ('…' if start else '') + line[start:m.end() + 110].strip()
                    page['statements'].append({'line': n, 'text': text})
            pages.append(page)
    pages.sort(key=lambda p: p['page'])
    return pages


def git(clone, *args):
    return subprocess.run(['git', '-C', clone, *args], capture_output=True, text=True)


def drift(pages, repo, clone, target):
    if git(clone, 'rev-parse', '--verify', '-q', f'{target}^{{commit}}').returncode != 0:
        sys.exit(f'target tag {target} is not in {clone}')
    results = []
    for p in pages:
        for pin in p['pins']:
            if pin['repo'] != repo or pin['kind'] not in ('blob', 'tree', 'raw') or not pin['path']:
                continue
            tag, path = pin['ref'], pin['path'].rstrip('/')
            if tag == target:
                state = 'at-target'
            elif git(clone, 'rev-parse', '--verify', '-q', f'{tag}^{{commit}}').returncode != 0:
                state = 'tag-not-in-clone'
            elif git(clone, 'cat-file', '-e', f'{target}:{path}').returncode != 0:
                state = 'missing'
            elif git(clone, 'diff', '--quiet', tag, target, '--', path).returncode == 0:
                state = 'unchanged'
            else:
                state = 'changed'
            results.append({**pin, 'page': p['page'], 'state': state})
    return results


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('folder')
    ap.add_argument('--repo', help='repository name, for example ai-dial-log-parser')
    ap.add_argument('--clone')
    ap.add_argument('--target')
    ap.add_argument('--json', action='store_true')
    a = ap.parse_args()
    repo = a.repo.split('/')[-1] if a.repo else None
    pages = scan(a.folder)
    checks = []
    if a.clone or a.target:
        if not (repo and a.clone and a.target):
            sys.exit('--clone and --target need --repo')
        checks = drift(pages, repo, a.clone, a.target)
    if a.json:
        print(json.dumps({'pages': pages, 'drift': checks}, indent=2))
        return

    tags = {}
    for p in pages:
        pins = [x for x in p['pins'] if not repo or x['repo'] == repo]
        print(f"{p['page']}  last_verified={p['last_verified']}")
        for x in pins:
            print(f"  pin    L{x['line']}: {x['repo']}@{x['ref']} {x['path']} {x['lines']}".rstrip())
            if x['kind'] != 'compare':
                tags.setdefault(x['repo'], set()).add(x['ref'])
        for x in p['branches']:
            if not repo or x['repo'] == repo:
                print(f"  branch L{x['line']}: {x['repo']}@{x['ref']} {x['path']} (leave as is)")
        for x in p['images']:
            print(f"  image  L{x['line']}: epam/{x['image']}:{x['tag']}")
        for x in p['statements']:
            print(f"  prose  L{x['line']}: {x['text']}")
    dates = sorted(p['last_verified'] for p in pages if p['last_verified'])
    print('---')
    print(f"pages {len(pages)}; oldest last_verified {dates[0] if dates else 'none'}; "
          f"newest {dates[-1] if dates else 'none'}")
    for r, ts in sorted(tags.items()):
        print(f"pinned tags of {r}: {' '.join(sorted(ts))}")
    if checks:
        counts = {}
        for c in checks:
            counts[c['state']] = counts.get(c['state'], 0) + 1
        print('drift: ' + ', '.join(f'{k}={v}' for k, v in sorted(counts.items())))
        for c in checks:
            if c['state'] not in ('unchanged', 'at-target'):
                print(f"  {c['state']:<16} {c['page']}:{c['line']} {c['ref']} {c['path']} {c['lines']}".rstrip())


if __name__ == '__main__':
    main()
