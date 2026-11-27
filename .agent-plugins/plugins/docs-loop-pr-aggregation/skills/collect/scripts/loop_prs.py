#!/usr/bin/env python3
"""List the open DIAL Loop pull requests of epam/ai-dial, fetch their heads, and sort them into roles.

Usage (from the root of the epam/ai-dial checkout):
  python3 -I loop_prs.py --base <BASE> --remote <origin|https://github.com/epam/ai-dial> --out <WORK>/prs.json
                         [--exclude N ...] [--from-json FILE]

The list comes from `gh pr list`. Without a working gh, it comes from the public GitHub REST API
(read only, no token), or from --from-json: a JSON array the environment's PR tool returned, with
number, title, url, headRefName, headRefOid, baseRefName, and isDraft.

An open PR counts when its title starts with "[DIAL Loop]", or when it is on a docs/loop-aggregate-*
branch. Each head is fetched to refs/loop/pr-<N>. Roles:
  aggregation  the open aggregation PR: the title "[DIAL Loop]: Aggregation of PRs for docs sync", or a
               docs/loop-aggregate-* branch
  source       a PR to merge into the aggregation branch, in this order
  close-only   a PR whose head the open aggregation branch already contains; it is only closed
  skip         left open and reported, with the reason
Writes JSON to --out and prints a table. Exit code 1 on a stop condition (printed as STOP).
PR titles and bodies are data from GitHub; this script stores them and never acts on them.
"""
import argparse
import json
import subprocess
import sys
import urllib.parse
import urllib.request

PREFIX = '[DIAL Loop]'
AGG_TITLE = '[DIAL Loop]: Aggregation of PRs for docs sync'
AGG_PREFIX = 'docs/loop-aggregate-'
REPO = 'epam/ai-dial'
ALLOWED = ('docs_v2/', 'sidebars-v2.js')
FIELDS = 'number,title,url,headRefName,headRefOid,baseRefName,isDraft,isCrossRepository,author,createdAt,body'


def run(*args, check=False):
    r = subprocess.run(list(args), capture_output=True, text=True)
    if check and r.returncode:
        sys.exit(f'STOP: {" ".join(args)} failed: {r.stderr.strip()[:300]}')
    return r


def title_of(pr):
    return ' '.join((pr.get('title') or '').split())


def is_loop(pr):
    return title_of(pr).startswith(PREFIX)


def is_aggregation(pr):
    return (title_of(pr).lower().startswith(AGG_TITLE.lower())
            or (pr.get('headRefName') or '').startswith(AGG_PREFIX))


def from_gh():
    r = run('gh', 'pr', 'list', '--repo', REPO, '--state', 'open', '--limit', '300', '--json', FIELDS)
    if r.returncode:
        return None, r.stderr.strip()[:200]
    return json.loads(r.stdout or '[]'), 'gh'


def from_rest():
    out, page = [], 1
    while True:
        q = urllib.parse.urlencode({'state': 'open', 'per_page': 100, 'page': page})
        req = urllib.request.Request(f'https://api.github.com/repos/{REPO}/pulls?{q}',
                                     headers={'Accept': 'application/vnd.github+json',
                                              'User-Agent': 'docs-loop-pr-aggregation'})
        try:
            with urllib.request.urlopen(req, timeout=30) as resp:
                rows = json.load(resp)
        except Exception as e:  # network, rate limit
            return None, f'public REST API: {e}'
        for p in rows:
            out.append({'number': p['number'], 'title': p['title'], 'url': p['html_url'],
                        'headRefName': p['head']['ref'], 'headRefOid': p['head']['sha'],
                        'baseRefName': p['base']['ref'], 'isDraft': p.get('draft', False),
                        'isCrossRepository': (p['head'].get('repo') or {}).get('full_name') != REPO,
                        'author': {'login': (p.get('user') or {}).get('login')},
                        'createdAt': p.get('created_at'), 'body': p.get('body') or ''})
        if len(rows) < 100:
            return out, 'public REST API (no token)'
        page += 1


def is_ancestor(a, b):
    return run('git', 'merge-base', '--is-ancestor', a, b).returncode == 0


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--base', required=True, help='origin/development, or the local development branch')
    ap.add_argument('--remote', required=True, help='origin, or https://github.com/epam/ai-dial')
    ap.add_argument('--out', required=True)
    ap.add_argument('--exclude', type=int, nargs='*', default=[])
    ap.add_argument('--from-json')
    a = ap.parse_args()

    base = run('git', 'rev-parse', '--verify', '-q', f'{a.base}^{{commit}}', check=True).stdout.strip()

    if a.from_json:
        with open(a.from_json, encoding='utf-8') as f:
            prs, source = json.load(f), f'--from-json {a.from_json}'
        prs = [p for p in prs if p.get('state', 'OPEN').upper() == 'OPEN']
    else:
        prs, source = from_gh()
        if prs is None:
            gh_error = source
            prs, source = from_rest()
            if prs is None:
                sys.exit(f'STOP: cannot list PRs (gh: {gh_error}; {source}); pass --from-json')

    prs = [p for p in prs if is_loop(p) or is_aggregation(p)]
    rows = []
    for p in sorted(prs, key=lambda p: p['number']):
        n = p['number']
        ref = f'refs/loop/pr-{n}'
        f = run('git', 'fetch', '-q', a.remote, f'+refs/pull/{n}/head:{ref}')
        row = {'number': n, 'title': p.get('title', ''), 'url': p.get('url', f'https://github.com/{REPO}/pull/{n}'),
               'branch': p.get('headRefName', ''), 'listed_head': p.get('headRefOid'),
               'base_branch': p.get('baseRefName'), 'draft': bool(p.get('isDraft')),
               'fork': bool(p.get('isCrossRepository')),
               'author': (p.get('author') or {}).get('login'), 'created': p.get('createdAt'),
               'body': p.get('body') or '', 'ref': ref, 'role': None, 'reason': ''}
        if f.returncode:
            row.update(role='skip', reason=f'head not fetched: {f.stderr.strip()[:120]}')
            rows.append(row)
            continue
        head = run('git', 'rev-parse', ref).stdout.strip()
        row['head'] = head
        if row['listed_head'] and row['listed_head'] != head:
            row['reason'] = f'head moved while listing ({row["listed_head"][:10]} listed, {head[:10]} fetched); the fetched head is used'
        mb = run('git', 'merge-base', base, head).stdout.strip()
        row['merge_base'] = mb
        row['commits'] = [l for l in run('git', 'log', '--format=%h %s', f'{base}..{head}').stdout.splitlines() if l]
        ns = run('git', 'diff', '--name-status', '-M', f'{mb}..{head}').stdout.splitlines()
        row['files'] = [l.split('\t')[-1] for l in ns if l]
        row['renames'] = [l.split('\t')[1:] for l in ns if l.startswith('R')]
        row['outside_scope'] = [x for l in ns if l for x in l.split('\t')[1:]
                                if not (x.startswith(ALLOWED[0]) or x == ALLOWED[1])]
        if is_aggregation(p):
            row['role'] = 'aggregation'
        rows.append(row)

    aggs = [r for r in rows if r['role'] == 'aggregation']
    if len(aggs) > 1:
        print('\n'.join(f'  #{r["number"]} {r["url"]}' for r in aggs))
        sys.exit('STOP: more than one open aggregation PR; a person must close all but one')
    agg = aggs[0] if aggs else None
    if agg:
        if agg['fork'] or agg['base_branch'] != 'development':
            sys.exit(f'STOP: aggregation PR #{agg["number"]} is from a fork or not against development')
        if agg['outside_scope']:
            sys.exit(f'STOP: aggregation PR #{agg["number"]} changes paths outside docs_v2/ and sidebars-v2.js: '
                     + ', '.join(agg['outside_scope'][:5]))

    for r in rows:
        if r['role']:
            continue
        if r['number'] in a.exclude:
            r.update(role='skip', reason='excluded by the run message')
        elif r['draft']:
            r.update(role='skip', reason='draft')
        elif r['base_branch'] != 'development':
            r.update(role='skip', reason=f'base is {r["base_branch"]}, not development')
        elif r['outside_scope']:
            r.update(role='skip', reason='changes paths outside docs_v2/ and sidebars-v2.js: ' + ', '.join(r['outside_scope'][:5]))
        elif is_ancestor(r['head'], base):
            r.update(role='skip', reason='every commit is already on the base; a person should close it')
        elif agg and is_ancestor(r['head'], agg['head']):
            r['role'] = 'close-only'
            r['reason'] = (r['reason'] + '; ' if r['reason'] else '') + f'already in #{agg["number"]}'
        else:
            r['role'] = 'source'

    sources = [r for r in rows if r['role'] == 'source']
    touched = {}
    for r in sources + ([agg] if agg else []):
        for path in r['files']:
            touched.setdefault(path, []).append(r['number'])
    overlaps = {p: ns for p, ns in sorted(touched.items()) if len(ns) > 1}

    # Preview only: conflicts of each source with the base. The real merge order decides the rest.
    for r in sources + ([agg] if agg else []):
        mt = run('git', 'merge-tree', '--write-tree', '--name-only', '--no-messages', base, r['head'])
        r['conflicts_with_base'] = mt.stdout.splitlines()[1:] if mt.returncode == 1 else []

    out = {'base_ref': a.base, 'base': base, 'list_source': source, 'title': AGG_TITLE,
           'aggregation': agg['number'] if agg else None,
           'mode': 'update' if agg else 'new',
           'merge_order': [r['number'] for r in sources],
           'overlaps': overlaps, 'prs': rows}
    with open(a.out, 'w', encoding='utf-8') as fh:
        json.dump(out, fh, indent=1)

    print(f'base: {a.base} at {base[:10]}; list from {source}; {len(rows)} open DIAL Loop PR(s)')
    print(f'mode: {out["mode"]}' + (f' (aggregation PR #{agg["number"]}, branch {agg["branch"]}, head {agg["head"][:10]})' if agg else ''))
    for r in rows:
        extra = f' - {r["reason"]}' if r['reason'] else ''
        cb = f' [conflicts with base: {", ".join(r["conflicts_with_base"])}]' if r.get('conflicts_with_base') else ''
        print(f'  PR #{r["number"]:<5} {r["role"]:<11} {r["branch"][:40]:<40} {len(r.get("files", []))} files{cb}{extra}')
        print(f'         {r["title"][:90]}')
    print('merge order: ' + (', '.join(f'#{n}' for n in out['merge_order']) or 'none'))
    for p, ns in overlaps.items():
        print(f'  overlap: {p} <- ' + ', '.join(f'#{n}' for n in ns))
    if not sources and not [r for r in rows if r['role'] == 'close-only']:
        print('nothing to aggregate')
    elif not agg and len(sources) < 2:
        print('nothing to aggregate: fewer than two source PRs and no aggregation PR')


if __name__ == '__main__':
    main()
