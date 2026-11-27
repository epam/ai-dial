#!/usr/bin/env python3
"""Find the pull requests an alignment run reviews: the PRs of epam/ai-dial closed in the last month
whose changes are on the base.

Usage (from the root of the epam/ai-dial checkout, after `git fetch origin`):
  python3 -I window.py --out <WORK>/window.json [--base BASE] [--remote REMOTE]
                       [--since YYYY-MM-DD] [--today YYYY-MM-DD] [--from-json FILE]

BASE defaults to origin/development, else the local development branch. The window runs from the
same day one month back (or --since) through today, both days included, by the UTC date a PR was
closed. On 2026-11-27 it runs from 2026-10-27 through 2026-11-27.

The PR list comes from `gh`. Without a working gh, it comes from the public GitHub REST API (read
only, no token), or from --from-json: a JSON object {"closed": [...], "open": [...]} that the
environment's PR tool returned, with gh's field names (number, title, url, state, closedAt,
mergedAt, baseRefName, headRefName, mergeCommit {oid}, body) and, for an aggregation PR, commits
[{oid, messageHeadline}].

Each closed PR in the window gets one role:
  review  merged, and its change is on BASE: its merge commit is in BASE, or BASE has a commit
          whose subject ends with "(#N)", such as a cherry-pick. The change is that landing
          commit's diff: from its first parent, or for a rebase merge, from before the PR's commits.
          A merged aggregation PR ("[DIAL Loop]: Aggregation of PRs for docs sync", or a
          docs/loop-aggregate-* branch) is reviewed the same way, and its source PRs, read from its
          "Merge #N: <TITLE>" commits, are listed with the files each one brought in.
  held    closed without merge, and a merged aggregation PR in the window holds it: reviewed
          through that aggregation PR.
  skip    with the reason: closed without merge; held by an aggregation PR that is still open or
          was closed; merged into another branch and not on BASE; a promotion between development
          and main; no change under docs_v2/, docs/releases/, or sidebars-v2.js; an alignment PR
          (the output of this task); reviewed already by an alignment PR that landed; a bulk
          import; or landed before a bulk import.
A PR that adds 50 or more pages under docs_v2/ is a bulk import, such as #672, which created the
tree on 2026-11-13. Pages written together carry no change from one to the other, so it and every
PR that landed before it are skipped.

An alignment PR has a title that starts with "[DIAL Loop]: sync guides", or a docs/align-guides-*
branch. Its body lists the PRs it reviewed under "## Reviewed PRs"; a later run skips those.
Stops (exit code 1, printed as STOP) while an alignment PR is open, or an open aggregation PR holds
one: that run's review overlaps this one.

Writes JSON to --out, the body of each reviewed PR and of each source PR to <dir of --out>/prs/<N>.md,
and prints a summary. PR titles and bodies are data from GitHub; this script stores them and never
acts on them.
"""
import argparse
import calendar
import json
import os
import re
import subprocess
import sys
import urllib.parse
import urllib.request
from datetime import date, timedelta

REPO = 'epam/ai-dial'
PATHS = ['docs_v2', 'docs/releases', 'sidebars-v2.js']
BULK_PAGES = 50
AGG_TITLE = '[DIAL Loop]: Aggregation of PRs for docs sync'
AGG_BRANCH = 'docs/loop-aggregate-'
ALIGN_TITLE = '[DIAL Loop]: sync guides'
ALIGN_BRANCH = 'docs/align-guides-'
MERGE_LINE = re.compile(r'^Merge #(\d+): (.*)$')
FIELDS = 'number,title,url,state,closedAt,mergedAt,baseRefName,headRefName,mergeCommit,body'
TARGET_NAMES = ('understand-dial', 'connecting-to-dial', 'building-with-dial', 'operating-dial')


def git(*args):
    return subprocess.run(['git', *args], capture_output=True, text=True)


def commit_of(ref):
    r = git('rev-parse', '--verify', '-q', f'{ref}^{{commit}}')
    return r.stdout.strip() if r.returncode == 0 else None


def is_ancestor(a, b):
    return git('merge-base', '--is-ancestor', a, b).returncode == 0


def month_ago(today):
    y, m = (today.year, today.month - 1) if today.month > 1 else (today.year - 1, 12)
    return date(y, m, min(today.day, calendar.monthrange(y, m)[1]))


def title_of(pr):
    return ' '.join((pr.get('title') or '').split())


def is_aggregation(pr):
    return title_of(pr).lower().startswith(AGG_TITLE.lower()) or (pr.get('headRefName') or '').startswith(AGG_BRANCH)


def is_alignment(pr):
    return title_of(pr).lower().startswith(ALIGN_TITLE.lower()) or (pr.get('headRefName') or '').startswith(ALIGN_BRANCH)


def area(path):
    p = path.split('/')
    if p[0] == 'sidebars-v2.js':
        return 'menu'
    if p[0] == 'docs':
        return 'releases'
    sec = re.sub(r'^\d+\.', '', p[1]) if len(p) > 1 else 'other'
    if sec in TARGET_NAMES:
        return 'target'
    return {'services': 'services', 'overview.md': 'overview', 'administering-dial-new': 'admin-guide',
            'chat-user-guide': 'chat-guide', 'demos': 'demos'}.get(sec, f'other/{sec}')


class GH:
    name = 'gh'

    def _json(self, *args):
        r = subprocess.run(['gh', *args], capture_output=True, text=True)
        if r.returncode:
            raise RuntimeError(r.stderr.strip()[:200])
        return json.loads(r.stdout or 'null')

    def closed(self, since):
        return self._json('pr', 'list', '--repo', REPO, '--state', 'closed', '--limit', '500',
                          '--search', f'closed:>={since}', '--json', FIELDS)

    def open(self):
        return self._json('pr', 'list', '--repo', REPO, '--state', 'open', '--limit', '300',
                          '--json', 'number,title,url,headRefName,body')

    def pr(self, n):
        return self._json('pr', 'view', str(n), '--repo', REPO, '--json', FIELDS)

    def commits(self, n):
        d = self._json('pr', 'view', str(n), '--repo', REPO, '--json', 'commits')
        return [{'oid': c.get('oid'), 'messageHeadline': c.get('messageHeadline', '')} for c in d.get('commits', [])]


class REST:
    name = 'public REST API (no token)'

    def _get(self, path, **q):
        url = f'https://api.github.com/repos/{REPO}/{path}' + (f'?{urllib.parse.urlencode(q)}' if q else '')
        req = urllib.request.Request(url, headers={'Accept': 'application/vnd.github+json',
                                                   'User-Agent': 'docs-guide-sync'})
        with urllib.request.urlopen(req, timeout=30) as resp:
            return json.load(resp)

    @staticmethod
    def _shape(p):
        merged = p.get('merged_at')
        return {'number': p['number'], 'title': p['title'], 'url': p['html_url'],
                'state': 'MERGED' if merged else ('CLOSED' if p.get('state') == 'closed' else 'OPEN'),
                'closedAt': p.get('closed_at'), 'mergedAt': merged,
                'baseRefName': p['base']['ref'], 'headRefName': p['head']['ref'],
                'mergeCommit': {'oid': p.get('merge_commit_sha')} if merged else None,
                'body': p.get('body') or ''}

    def closed(self, since):
        out, page = [], 1
        while True:
            rows = self._get('pulls', state='closed', sort='updated', direction='desc', per_page=100, page=page)
            out += [self._shape(p) for p in rows if (p.get('closed_at') or '')[:10] >= since]
            if len(rows) < 100 or (rows[-1].get('updated_at') or '')[:10] < since:
                return out
            page += 1

    def open(self):
        return [self._shape(p) for p in self._get('pulls', state='open', per_page=100)]

    def pr(self, n):
        return self._shape(self._get(f'pulls/{n}'))

    def commits(self, n):
        rows = self._get(f'pulls/{n}/commits', per_page=100)
        return [{'oid': c['sha'], 'messageHeadline': (c['commit']['message'] or '').split('\n', 1)[0]} for c in rows]


class FromJSON:
    def __init__(self, path):
        with open(path, encoding='utf-8') as f:
            d = json.load(f)
        self.name = f'--from-json {path}'
        self._closed, self._open = d.get('closed', []), d.get('open', [])
        self._by = {p['number']: p for p in self._closed + self._open}

    def closed(self, since):
        return [p for p in self._closed if (p.get('closedAt') or '')[:10] >= since]

    def open(self):
        return self._open

    def pr(self, n):
        if n not in self._by:
            raise RuntimeError(f'#{n} is not in the JSON')
        return self._by[n]

    def commits(self, n):
        return (self._by.get(n) or {}).get('commits') or []


def reviewed_by(body):
    """PR numbers listed under the "## Reviewed PRs" heading of an alignment PR's body."""
    nums, inside = set(), False
    for line in (body or '').split('\n'):
        if re.match(r'^##\s', line):
            inside = bool(re.match(r'^##\s+Reviewed PRs\s*$', line.strip()))
            continue
        if inside:
            nums |= {int(x) for x in re.findall(r'(?<![\w/])#(\d+)\b', line)}
    return nums


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--out', required=True)
    ap.add_argument('--base')
    ap.add_argument('--remote')
    ap.add_argument('--since', help='YYYY-MM-DD; the default is the same day one month back')
    ap.add_argument('--today', default=date.today().isoformat())
    ap.add_argument('--from-json')
    a = ap.parse_args()
    today = date.fromisoformat(a.today)
    start = date.fromisoformat(a.since) if a.since else month_ago(today)
    mode = f'since {a.since}' if a.since else 'one month'
    work = os.path.dirname(os.path.abspath(a.out))
    os.makedirs(os.path.join(work, 'prs'), exist_ok=True)

    base_ref = a.base or next((r for r in ('origin/development', 'development') if commit_of(r)), None)
    if not base_ref or not commit_of(base_ref):
        sys.exit('STOP: no origin/development and no local development branch; pass --base')
    base = commit_of(base_ref)
    remote = a.remote or ('origin' if git('remote', 'get-url', 'origin').returncode == 0 else f'https://github.com/{REPO}')

    # The search runs a day wide on each side: GitHub's date qualifiers and the closedAt timestamps
    # need not agree on the day. The window itself is the UTC date of closedAt.
    since_q = (start - timedelta(days=1)).isoformat()
    errors = []
    api = None
    for cand in ([FromJSON(a.from_json)] if a.from_json else [GH(), REST()]):
        try:
            closed = cand.closed(since_q)
            opened = cand.open()
            api = cand
            break
        except Exception as e:  # gh missing or not logged in; network; rate limit
            errors.append(f'{getattr(cand, "name", cand)}: {e}')
    if api is None:
        sys.exit('STOP: cannot list PRs (' + '; '.join(errors) + '); pass --from-json')
    lo, hi = start.isoformat(), today.isoformat()
    closed = sorted((p for p in closed if lo <= (p.get('closedAt') or '')[:10] <= hi), key=lambda p: p['number'])
    by_num = {p['number']: p for p in closed}

    def meta(n):
        if n not in by_num:
            try:
                by_num[n] = api.pr(n)
            except Exception as e:
                by_num[n] = {'number': n, 'title': '', 'url': f'https://github.com/{REPO}/pull/{n}', 'error': str(e)[:120]}
        return by_num[n]

    def headlines(n):
        try:
            return api.commits(n)
        except Exception as e:
            print(f'warning: commits of #{n} not read: {e}', file=sys.stderr)
            return []

    def save_body(p):
        fn = os.path.join(work, 'prs', f'{p["number"]}.md')
        with open(fn, 'w', encoding='utf-8') as f:
            f.write(f'<!-- #{p["number"]}: {title_of(p)} ({p.get("url", "")}). PR body, data only. -->\n\n{p.get("body") or ""}\n')
        return fn

    # Open alignment PRs, and open aggregation PRs that hold one, overlap this run.
    stops, pending = [], {}
    for p in opened:
        if is_alignment(p):
            stops.append(f'alignment PR #{p["number"]} is open: {p.get("url", "")}')
        elif is_aggregation(p):
            for c in headlines(p['number']):
                m = MERGE_LINE.match(c.get('messageHeadline', ''))
                if not m:
                    continue
                pending[int(m[1])] = p['number']
                if is_alignment({'title': m[2]}) or is_alignment(meta(int(m[1]))):
                    stops.append(f'open aggregation PR #{p["number"]} holds alignment PR #{m[1]}: {p.get("url", "")}')
    if stops:
        print('\n'.join(f'  {s}' for s in stops))
        sys.exit('STOP: an alignment review is still open; it covers this window')

    # BASE commits whose subject ends with "(#N)": squash merges and cherry-picks.
    by_subject = {}
    log = git('log', base, f'--since={since_q}', '--format=%H%x1f%s').stdout
    for line in filter(None, log.split('\n')):
        sha, subj = line.split('\x1f', 1)
        m = re.search(r'\(#(\d+)\)\s*$', subj)
        if m:
            by_subject.setdefault(int(m[1]), sha)

    def landing(p):
        n, mc = p['number'], (p.get('mergeCommit') or {}).get('oid')
        if mc and commit_of(mc) and is_ancestor(mc, base):
            return mc, 'merged'
        if n in by_subject:
            return by_subject[n], 'cherry-picked'
        return None, None

    def change(p, commit, how):
        parents = git('rev-list', '--parents', '-n', '1', commit).stdout.split()
        subj = git('log', '-1', '--format=%s', commit).stdout.strip()
        if len(parents) >= 3:
            method, frm = 'merge commit', parents[1]
        elif re.search(rf'\(#{p["number"]}\)\s*$', subj):
            method, frm = ('squash' if how == 'merged' else 'cherry-pick'), parents[1]
        else:
            k = len(headlines(p['number']))
            method, frm = f'rebase ({k} commits)', (commit_of(f'{commit}~{k}') if k else None)
        if not frm:
            return None
        ns = git('diff', '--name-status', '-M30%', frm, commit, '--', *PATHS).stdout
        files = [l.split('\t') for l in ns.splitlines() if l]
        added = sum(1 for f in files if f[0] == 'A' and f[-1].startswith('docs_v2/') and f[-1].endswith('.md'))
        day = git('log', '-1', '--format=%cs', commit).stdout.strip()
        return {'landing': {'commit': commit, 'date': day, 'method': method}, 'range': {'from': frm, 'to': commit},
                'files': [{'status': f[0][0], 'path': f[-1], 'old': f[1] if f[0][0] == 'R' else None} for f in files],
                'added_pages': added}

    def row(p, role, reason='', **kw):
        r = {'number': p['number'], 'title': title_of(p), 'url': p.get('url', ''), 'state': p.get('state'),
             'closed': (p.get('closedAt') or '')[:10], 'base_branch': p.get('baseRefName'),
             'branch': p.get('headRefName'), 'role': role, 'reason': reason}
        r.update(kw)
        return r

    rows, landed_guides, held = [], [], {}
    for p in closed:
        n = p['number']
        if (p.get('headRefName') or '') in ('development', 'main'):
            rows.append(row(p, 'skip', f'promotes {p["headRefName"]} into {p.get("baseRefName")}'))
            continue
        if p.get('state') != 'MERGED':
            rows.append(row(p, 'skip', 'closed without merge'))  # may become `held` below
            continue
        commit, how = landing(p)
        if not commit:
            rows.append(row(p, 'skip', f'merged into {p.get("baseRefName")}; not on {base_ref}'))
            continue
        if is_alignment(p):
            landed_guides.append(p)
            rows.append(row(p, 'skip', 'alignment PR: the output of this task'))
            continue
        ch = change(p, commit, how)
        if not ch:
            rows.append(row(p, 'skip', f'landed as {commit[:10]}, but its diff could not be computed'))
            continue
        r = row(p, 'review', kind='aggregation' if is_aggregation(p) else 'pr', **ch)
        if r['kind'] == 'aggregation':
            commits = headlines(n)
            agg_ref = f'refs/guides/pr-{n}'
            fetched = git('fetch', '-q', remote, f'+refs/pull/{n}/head:{agg_ref}').returncode == 0
            sources = []
            for c in commits:
                m = MERGE_LINE.match(c.get('messageHeadline', ''))
                if not m:
                    continue
                s = meta(int(m[1]))
                files = None
                if fetched and c.get('oid') and commit_of(c['oid']):
                    out = git('diff', '--name-only', f'{c["oid"]}^1', c['oid'], '--', *PATHS).stdout
                    files = [x for x in out.split('\n') if x]
                src = {'number': s['number'], 'title': title_of(s) or m[2], 'url': s.get('url', ''),
                       'branch': s.get('headRefName'), 'alignment': is_alignment(s) or is_alignment({'title': m[2]}),
                       'files': files}
                if s.get('body') is not None and 'error' not in s:
                    src['body_file'] = save_body(s)
                sources.append(src)
                held[s['number']] = n
                if src['alignment']:
                    landed_guides.append(s)
            r['sources'] = sources
            if not sources:
                r['reason'] = 'no "Merge #N:" commits found; read the body for its source PRs'
        rows.append(r)

    for r in rows:
        if r['role'] == 'skip' and r['reason'] == 'closed without merge':
            n = r['number']
            if n in held:
                r.update(role='held', reason=f'held by #{held[n]}, reviewed through it', held_by=held[n])
            elif n in pending:
                r['reason'] = f'held by #{pending[n]}, which is still open; the run after it merges reviews it'
            elif is_alignment(by_num[n]):
                r['reason'] = 'alignment PR, closed without merge'

    # Skip what a landed alignment PR reviewed already.
    reviewed = {}
    for g in landed_guides:
        for x in reviewed_by(g.get('body')):
            reviewed.setdefault(x, g['number'])
    units = [r for r in rows if r['role'] == 'review']
    for r in units:
        if r['number'] in reviewed:
            r.update(role='skip', reason=f'reviewed by alignment PR #{reviewed[r["number"]]}')
        elif not r['files']:
            r.update(role='skip', reason='no change under docs_v2/, docs/releases/, or sidebars-v2.js')

    # A bulk import, and everything that landed before it, carries no change to propagate.
    units = [r for r in rows if r['role'] == 'review']
    bulk = [r for r in units if r['added_pages'] >= BULK_PAGES]
    newest = None
    for r in bulk:
        if newest is None or is_ancestor(newest['landing']['commit'], r['landing']['commit']):
            newest = r
    if newest:
        for r in units:
            if r is newest:
                r.update(role='skip', reason=f'bulk import: adds {r["added_pages"]} pages under docs_v2/')
            elif is_ancestor(r['landing']['commit'], newest['landing']['commit']):
                r.update(role='skip', reason=f'landed before the bulk import #{newest["number"]}')

    def info(sha):
        d, s = git('log', '-1', '--format=%cs%x1f%s', sha).stdout.strip().split('\x1f', 1)
        return {'commit': sha, 'date': d, 'subject': s}

    units = [r for r in rows if r['role'] == 'review']
    for r in units:
        r['body_file'] = save_body(by_num[r['number']])
    out = {'base_ref': base_ref, 'base': info(base), 'today': hi, 'start': lo, 'end': hi, 'mode': mode,
           'list_source': api.name, 'remote': remote,
           'units': [r['number'] for r in units],
           'reviewed_before': {str(k): v for k, v in sorted(reviewed.items())},
           'prs': rows}
    with open(a.out, 'w', encoding='utf-8') as f:
        json.dump(out, f, indent=1)

    print(f'base: {base_ref} at {base[:10]} ({out["base"]["date"]}); list from {api.name}')
    print(f'window: PRs closed {lo} through {hi} ({mode}); {len(closed)} closed, {len(units)} to review')
    for r in units:
        areas = {}
        for f in r['files']:
            areas[area(f['path'])] = areas.get(area(f['path']), 0) + 1
        print(f'  review #{r["number"]:<5} {r["landing"]["date"]} {r["landing"]["method"]:<13} {r["title"][:80]}')
        print('         ' + ', '.join(f'{k} {v}' for k, v in sorted(areas.items())))
        for s in r.get('sources', []):
            tag = ' [alignment]' if s['alignment'] else ''
            nf = f'{len(s["files"])} files' if s['files'] is not None else 'files unknown'
            print(f'         holds #{s["number"]} ({nf}){tag} {s["title"][:70]}')
        if r['reason']:
            print(f'         note: {r["reason"]}')
    for role in ('held', 'skip'):
        for r in (x for x in rows if x['role'] == role):
            print(f'  {role:<6} #{r["number"]:<5} {r["reason"]}: {r["title"][:60]}')
    if not units:
        print('nothing to review: no PR closed in the window changed the docs on the base')


if __name__ == '__main__':
    main()
