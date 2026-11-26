#!/usr/bin/env python3
"""Build the review ledger of a sync: every PR and PR-less commit the release window ships.

Usage:
  python3 -I release_window.py ... --json > WINDOW.json
  python3 -I inventory.py --repo epam/REPO --clone DIR --window WINDOW.json --out LEDGER.md
      [--folder DOCS_FOLDER] [--no-api]

For each release in the window it unions:
  - the PRs its release notes reference (a "(#123)" or a /pull/123 link is a PR; a bare "#123"
    counts only when GitHub confirms it is a PR, not an issue);
  - the PR numbers at the end of the commit subjects of PREVIOUS..TAG (squash merges);
  - commits without a PR number, which are reviewed as items of their own.
A "sync development into release" PR is expanded into the PRs it carries. Each PR is listed
once, with every release that ships it and its files bucketed. A PR that touches only tests,
CI, or dependency manifests gets the suggested verdict "skip", which the reviewer must still
confirm. With --folder, a dependency bump of a package the pages name with a version is flagged.
Each release's notes are saved as notes/<TAG>.md next to the ledger.

The GitHub API (gh) is used when it works. Without it (or with --no-api), the script reads
public github.com pages and the clone instead:
  release notes and their PRs  the release page, where GitHub links each #N to a PR or an issue
  PRs a sync PR carries        the PR's public commits page
  titles and files             the PR's squash commit in the clone
"""
import argparse
import html
import json
import os
import re
import subprocess
import sys
import urllib.request

UA = 'dial-docs-sync'
BUCKETS = [
    ('tests', re.compile(r'(^|/)(tests?|__tests__|e2e|integration-tests?|testdata|fixtures)/|'
                         r'(_test|\.test|\.spec|Test|Tests)\.[A-Za-z]+$')),
    ('ci', re.compile(r'^\.github/|^\.gitlab|^\.ort\.yml$|^\.pre-commit|^\.?dependabot|'
                      r'(^|/)Makefile$|^\.editorconfig$|^\.(eslint|prettier)')),
    ('deps', re.compile(r'(^|/)(poetry\.lock|uv\.lock|package-lock\.json|yarn\.lock|pnpm-lock\.yaml|'
                        r'go\.sum|gradle\.lockfile|Pipfile\.lock|pyproject\.toml|package\.json|'
                        r'build\.gradle(\.kts)?|gradle\.properties|pom\.xml)$|(^|/)requirements[^/]*\.txt$')),
    ('docs', re.compile(r'\.(md|mdx|rst)$|^docs?/')),
    ('settings', re.compile(r'application[^/]*\.ya?ml$|aidial\.settings\.json$|(^|/)[^/]*settings[^/]*\.(py|java|ts|json)$|'
                            r'(^|/)[^/]*(config|Config|Properties|properties)[^/]*\.(py|java|ts|ya?ml|json)$|'
                            r'(^|/)\.env\.(example|template|sample)$|(^|/)env\.py$|(^|/)values[^/]*\.yaml$|'
                            r'(^|/)Chart\.yaml$|(^|/)templates/|(^|/)Dockerfile[^/]*$|(^|/)entrypoint[^/]*\.sh$')),
    ('interface', re.compile(r'openapi|swagger|schema[^/]*\.json$|(^|/)(api|routes?|controllers?|endpoints?|handlers?)/|'
                             r'Controller\.java$|(^|/)(server|app|main|__main__)\.py$|\.proto$|(^|/)mcp[^/]*\.py$')),
]
SIGNAL = re.compile(r'\b(feat|add|adds|added|new|remove|removes|removed|drop|deprecat\w*|breaking|rename\w*|'
                    r'default|support\w*|config\w*|env|variable|setting|option|endpoint|api|auth\w*|'
                    r'security|secret|migrat\w*|upgrade|require\w*|limit|timeout|header|port|image|helm|'
                    r'preview|ga|enable\w*|disable\w*)\b', re.I)
SYNC_PR = re.compile(r'\b(sync|merge)\b.*\b(development|develop|main)\b.*\b(into|to)\b', re.I)
CHORE = re.compile(r'^\[skip ci\]|^(chore|build)(\(.*\))?: (update|bump) version', re.I)


def sh(*cmd):
    try:
        return subprocess.run(cmd, capture_output=True, text=True)
    except FileNotFoundError:
        return subprocess.CompletedProcess(cmd, 127, '', f'{cmd[0]}: command not found')


def gh_json(*args):
    res = sh('gh', *args)
    if res.returncode != 0:
        return None
    try:
        return json.loads(res.stdout)
    except json.JSONDecodeError:
        return None


def fetch(url):
    req = urllib.request.Request(url, headers={'User-Agent': UA})
    try:
        with urllib.request.urlopen(req, timeout=30) as r:
            return r.read().decode('utf-8', 'replace')
    except Exception:
        return None


def body_html(page):
    """The rendered release notes inside a release page."""
    m = re.search(r'<div[^>]*data-test-selector="body-content"[^>]*>', page or '')
    if not m:
        return ''
    depth, start = 1, m.end()
    for t in re.finditer(r'<div\b|</div>', page[start:]):
        depth += 1 if t.group(0) == '<div' else -1
        if depth == 0:
            return page[start:start + t.start()]
    return page[start:]


def html_to_text(h):
    h = re.sub(r'<h(\d)[^>]*>', lambda m: '\n' + '#' * int(m[1]) + ' ', h)
    h = re.sub(r'<li[^>]*>', '\n- ', h)
    h = re.sub(r'<br\s*/?>|</p>|</h\d>|</ul>|</ol>|</pre>', '\n', h)
    h = re.sub(r'</?code>', '`', h)
    h = re.sub(r'<[^>]+>', '', h)
    return re.sub(r'\n{3,}', '\n\n', html.unescape(h)).strip() + '\n'


def bucket(path):
    for name, rx in BUCKETS:
        if rx.search(path):
            return name
    return 'code'


def commits(clone, *rev):
    res = sh('git', '-C', clone, 'log', '--no-merges', '--format=%H%x1f%s%x1e', *rev)
    if res.returncode != 0:
        sys.exit(f"git log {' '.join(rev)} failed: {res.stderr.strip()}")
    for rec in res.stdout.split('\x1e'):
        rec = rec.strip()
        if rec:
            sha, _, subject = rec.partition('\x1f')
            yield sha, subject


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--repo', required=True)
    ap.add_argument('--clone', required=True)
    ap.add_argument('--window', required=True, help='JSON from release_window.py --json')
    ap.add_argument('--out', required=True)
    ap.add_argument('--folder', help='docs folder; flags dependency bumps of packages the pages name')
    ap.add_argument('--no-api', '--no-fetch', dest='no_api', action='store_true',
                    help='never call the GitHub API; use github.com pages and the clone')
    a = ap.parse_args()
    owner_repo = a.repo if '/' in a.repo else f'epam/{a.repo}'
    window = json.load(open(a.window))
    if not window.get('review'):
        sys.exit('the window has no release to review')
    api = not a.no_api and sh('gh', 'api', f'repos/{owner_repo}', '--jq', '.full_name').returncode == 0
    mode = 'GitHub API' if api else 'no GitHub API: release pages, PR commit pages, and the clone'
    notes_dir = os.path.join(os.path.dirname(os.path.abspath(a.out)), 'notes')
    os.makedirs(notes_dir, exist_ok=True)

    folder_text = ''
    if a.folder:
        for root, _, files in os.walk(a.folder):
            for f in files:
                if f.endswith('.md'):
                    folder_text += open(os.path.join(root, f), encoding='utf-8').read().lower()

    # PR number -> squash commit, from every branch of the clone.
    squash = {}
    for sha, subject in commits(a.clone, '--all'):
        m = re.search(r'\(#(\d+)\)\s*$', subject)
        if m:
            squash.setdefault(int(m[1]), (sha, subject))

    prs, loose, cross, issue_cache, unread_notes = {}, [], set(), {}, []

    def is_pr(n):
        if n not in issue_cache:
            data = gh_json('api', f'repos/{owner_repo}/issues/{n}')
            issue_cache[n] = bool(data and data.get('pull_request'))
        return issue_cache[n]

    def add(n, tag, via=None):
        entry = prs.setdefault(n, {'releases': [], 'via': via})
        if tag not in entry['releases']:
            entry['releases'].append(tag)

    for rel in window['review']:
        tag, prev = rel['tag'], rel['previous']
        found = set()
        if api:
            body = (gh_json('release', 'view', tag, '-R', owner_repo, '--json', 'body') or {}).get('body') or ''
            open(os.path.join(notes_dir, f'{tag}.md'), 'w', encoding='utf-8').write(body + '\n')
            for group in re.findall(r'\(([^()]*#\d+[^()]*)\)', body):
                # "(#12)" and "(#12, #13)" are PRs by convention; "(Issue #4754)" is checked.
                pure = re.fullmatch(r'\s*(?:[\w.-]+/[\w.-]+)?#\d+(?:\s*,\s*(?:[\w.-]+/[\w.-]+)?#\d+)*\s*', group)
                for other, n in re.findall(r'(?:([\w.-]+/[\w.-]+))?#(\d+)', group):
                    if other and other.lower() != owner_repo.lower():
                        cross.add(f'{other}#{n}')
                    elif pure or is_pr(int(n)):
                        found.add(int(n))
            for other, n in re.findall(r'github\.com/([\w.-]+/[\w.-]+)/pull/(\d+)', body):
                (found.add(int(n)) if other.lower() == owner_repo.lower() else cross.add(f'{other}#{n}'))
            for n in re.findall(r'(?<![\w/(#-])#(\d+)\b', re.sub(r'\([^()]*\)', '', body)):
                if int(n) not in found and is_pr(int(n)):
                    found.add(int(n))
        else:
            notes = body_html(fetch(f'https://github.com/{owner_repo}/releases/tag/{tag}'))
            if not notes:
                unread_notes.append(tag)
            open(os.path.join(notes_dir, f'{tag}.md'), 'w', encoding='utf-8').write(html_to_text(notes))
            for other, n in re.findall(r'href="https://github\.com/([\w.-]+/[\w.-]+)/pull/(\d+)', notes):
                (found.add(int(n)) if other.lower() == owner_repo.lower() else cross.add(f'{other}#{n}'))
        for sha, subject in commits(a.clone, f'{prev}..{tag}' if prev else tag):
            m = re.search(r'\(#(\d+)\)\s*$', subject)
            if m:
                found.add(int(m[1]))
                squash.setdefault(int(m[1]), (sha, subject))
            elif not CHORE.match(subject):
                loose.append((sha[:10], subject, tag))
        for n in found:
            add(n, tag)

    details = {}

    def read(n):
        if n in details:
            return details[n]
        title, labels, files, ok = '', [], [], False
        if api:
            data = gh_json('pr', 'view', str(n), '-R', owner_repo, '--json', 'title,labels,files')
            if data:
                ok, title = True, data.get('title') or ''
                labels = [l['name'] for l in data.get('labels', [])]
                files = [f['path'] for f in data.get('files', [])]
        elif n in squash:
            sha, subject = squash[n]
            ok, title = True, subject
            files = sh('git', '-C', a.clone, 'show', '--name-only', '--format=', sha).stdout.split()
        details[n] = (ok, title or (squash.get(n, ('', ''))[1]), labels, files)
        return details[n]

    # Expand "sync development into release" PRs into the PRs they carry.
    for n in list(prs):
        ok, title, _, _ = read(n)
        if not SYNC_PR.search(title):
            continue
        carried = set()
        if api:
            for c in (gh_json('pr', 'view', str(n), '-R', owner_repo, '--json', 'commits') or {}).get('commits', []):
                m = re.search(r'\(#(\d+)\)\s*$', c.get('messageHeadline', ''))
                if m:
                    carried.add(int(m[1]))
        else:
            page = fetch(f'https://github.com/{owner_repo}/pull/{n}/commits') or ''
            carried = {int(x) for x in re.findall(r'\(#(\d+)\)', page)}
        for c in sorted(carried - {n}):
            if c not in prs:
                prs[c] = {'releases': list(prs[n]['releases']), 'via': n}

    rows = []
    stop = {'the', 'all', 'and', 'group', 'dependencies', 'deps', 'version', 'versions', 'packages'}
    for n in sorted(prs):
        info = prs[n]
        ok, title, labels, files = read(n)
        counts = {}
        for path in files:
            b = bucket(path)
            counts[b] = counts.get(b, 0) + 1
        if SYNC_PR.search(title):
            hint = 'expand: merges another branch; its PRs are listed "via"; check the tag diff too'
        elif counts and set(counts) <= {'tests', 'ci', 'deps'}:
            hint = 'skip? only tests, CI, or dependency manifests; confirm from the title'
        elif not ok and api:
            hint = 'gh could not read it as a PR; it may be an issue number: review the commit instead'
        elif not ok:
            hint = f'candidate: no squash commit in the clone; find it with git log --all --grep "#{n}"'
        else:
            hint = 'candidate: read the diff of settings, interface, and docs files'
        if folder_text:
            named = [p for p in re.findall(r'\b(?:bump|update|upgrade)s?\s+([\w.@/-]+)(?:\s+and\s+([\w.@/-]+))?', title, re.I)
                     for p in p if p]
            named = [p for p in named if len(p) > 2 and p.lower() not in stop and re.search(
                r'(?<![\w-])' + re.escape(p.lower()) + r'(?![\w-])[^\n]{0,25}?\d+\.\d+', folder_text)]
            if named:
                hint = f"check: the pages name {', '.join(named)}; update the version they state"
        if info.get('via'):
            hint += f" (via #{info['via']})"
        files_col = ', '.join(f'{k}={v}' for k, v in sorted(counts.items())) or '-'
        signal = 'yes' if SIGNAL.search(title) else ''
        rows.append(f"| #{n} | {(title or '?').replace('|', '/')} | {' '.join(info['releases'])} | {files_col} | "
                    f"{','.join(labels) or '-'} | {signal} | {hint} | | |")

    with open(a.out, 'w', encoding='utf-8') as out:
        out.write(f"# Ledger: {owner_repo} {window['baseline']['tag']} -> {window['target']['tag']}\n\n")
        out.write(f'Source: {mode}. Release notes: {notes_dir}/<TAG>.md\n\n')
        out.write('Fill Verdict with update, already documented, skip (reason), or flag (reason), '
                  'and Evidence with the page edited and the tag-pinned source.\n\n')
        out.write('| PR | Title | Releases | Files | Labels | Signal | Suggested | Verdict | Evidence |\n')
        out.write('|---|---|---|---|---|---|---|---|---|\n')
        out.write('\n'.join(rows) + '\n')
        if loose:
            out.write('\n## Commits without a PR\n\n| Commit | Subject | Release | Verdict |\n|---|---|---|---|\n')
            for sha, subject, tag in loose:
                out.write(f"| {sha} | {subject.replace('|', '/')} | {tag} | |\n")
        if cross:
            out.write('\n## PRs in other repositories that the notes reference\n\n| PR | Verdict |\n|---|---|\n')
            for ref in sorted(cross):
                out.write(f'| {ref} | |\n')
        out.write('\n## Platform upgrade notes items\n\n| Item | Verdict |\n|---|---|\n')
        out.write('\n## Tag diff files not covered by a reviewed PR\n\n| File | Commits | Verdict |\n|---|---|---|\n')
    candidates = sum(1 for r in rows if '| candidate' in r or '| expand' in r or '| check:' in r)
    print(f'{mode}')
    print(f'{len(rows)} PRs ({candidates} to read), {len(loose)} commits without a PR, '
          f'{len(cross)} PRs in other repositories -> {a.out}')
    if unread_notes:
        print('warning: release notes not readable for ' + ', '.join(unread_notes) +
              '; the PRs come from the commit range only')


if __name__ == '__main__':
    main()
