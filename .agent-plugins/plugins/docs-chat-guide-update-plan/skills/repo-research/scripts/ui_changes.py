"""List the changes a DIAL Chat user can see between two stable releases of one repository.

Usage (from the root of the epam/ai-dial checkout):
  python3 -I ui_changes.py --repo epam/<REPO> --clone <WORK>/repos/<REPO> --windows <WORK>/windows.json \
      --out <WORK>/research/<REPO>/ui_changes.json [--from <TAG>] [--to <TAG>]

  --repo     epam/ai-dial-chat, epam/ai-dial-quickapps-backend, or epam/ai-dial-quickapps-frontend
  --clone    a clone of the repository with its tags, such as `git clone --filter=blob:none`
  --windows  the output of release_windows.py. Each start date in it is compared on its own, from
             that date's baseline to the target: a feature added and removed again between two
             baselines shows only in the newer window. --from and --to compare two tags instead
It compares trees, so cherry-picked backports count once. Every change carries "first", the first
reviewed release of its window, by publication date, that ships the change as the target has it,
and "date", the day that release was published.

Output (--out): {repo, to, notes, windows: {start date: {...}}}, and in each window:
  from, to, releases          the tags compared, and the window's releases in publication order
  strings                     UI text (chat and quickapps-frontend):
    layout_changed            true when the string files differ between the two tags; then the
                              key lists are unreliable and the value lists are the evidence
    changed                   [{key, old, new, first, date}]: the same key shows other text
    added / removed           [{key, value, first, date}]
    moved                     keys renamed with the same text: nothing a user sees
    values_removed            [{value, keys}]: text that no key shows any more
    values_added              [{value, keys, first, date}]
  files                       {area: [{path, status, first, date}]}: user-visible paths only,
                              tests, stories, generated code, and CI left out
  specs                       [{name, status, first, date}]: openspec/specs/<name>/spec.md
  archived_changes            [{name, first, date}]: new openspec/changes/archive/<name> folders;
                              the folder date is when work ended, not a release date
  watch                       {path: unified diff}: routes and feature flags
  packages                    [{name, old, new, first, date}]: @epam/* dependencies, whose
                              components the UI renders
  schema                      quickapps-backend: [{path, field, old, new, first, date}] for the
                              title, description, enum, default, const, and x-preview of
                              docs/generated-app-schema.json, and added or removed properties
  tools                       quickapps-backend: [{name, status, old, new}] from
                              docs/generated-internal-tools.json
  stage_text                  quickapps-backend: [{file, sign, text}]: changed string literals
                              that name stages and steps a chat shows
Top level:
  notes                       [{pr, section, text, first, date, releases}]: the release-note bullets
                              of all reviewed releases, one per PR, in the release that lists it first

Stdout: the counts. It only reads: it never edits, commits, pushes, or writes to GitHub.
Exit 0 when the run can go on; exit 1 with a "STOP: <reason>" line when a tag is missing from the
clone or the repository has no profile.
"""
import argparse
import json
import re
import subprocess
import sys
from collections import OrderedDict

TESTS = [r'(^|/)tests?/', r'(^|/)__tests__/', r'(^|/)e2e/', r'\.(spec|test|stories)\.[cm]?[jt]sx?$',
         r'\.snap$', r'(^|/)generated/', r'(^|/)__mocks__/', r'(^|/)test-utils/']
PROFILES = {
    'epam/ai-dial-chat': {
        'strings': ['apps/chat/src/i18n/locales/en.json'],
        'visible': ['apps/chat/src', 'apps/chat-api/src', 'libs'],
        'exclude': TESTS + [r'^libs/chat-api-client/'],
        'areas': [r'^(apps/chat/src/(?:pages|components)/[^/]+)', r'^(apps/chat/src/[^/]+)',
                  r'^(apps/chat-api/src/[^/]+)', r'^(libs/[^/]+)'],
        'specs': 'openspec/specs', 'archive': 'openspec/changes/archive',
        'watch': ['apps/chat/src/types/routes.ts',
                  'apps/chat-api/src/app-config/known-ui-features.constants.ts',
                  'apps/chat-api/src/app-config/feature-flags/feature-key.enum.ts'],
        'packages': ['package.json'],
    },
    'epam/ai-dial-quickapps-frontend': {
        'strings': ['src/i18n/locales/en.json', 'src/i18n/locales/common.json',
                    'src/i18n/locales/quick-app-editor.json'],
        'visible': ['src'],
        'exclude': TESTS,
        'areas': [r'^(src/components/[^/]+)', r'^(src/[^/]+)'],
        'specs': 'openspec/specs', 'archive': 'openspec/changes/archive',
        'watch': ['src/main.tsx'],
        'packages': ['package.json'],
    },
    'epam/ai-dial-quickapps-backend': {
        'strings': [],
        'visible': ['src/quickapp', 'config/predefined', 'docs/generated-app-schema.json',
                    'docs/generated-internal-tools.json'],
        'exclude': TESTS + [r'^src/tests/'],
        'areas': [r'^(src/quickapp/[^/]+)', r'^(config/predefined/[^/]+)', r'^(docs/[^/]+)'],
        'schema': 'docs/generated-app-schema.json',
        'tools': 'docs/generated-internal-tools.json',
        'watch': [],
        'packages': [],
    },
}
SCHEMA_FIELDS = ('title', 'description', 'enum', 'default', 'const', 'x-preview')
STAGE_LINE = re.compile(r'\b(name|title|display_name|create_stage|[A-Z_]*(?:STAGE|SECTION)[A-Z_]*)\s*[=(]\s*f?["\']')
PR_REF = re.compile(r'\(#(\d+)\)|/pull/(\d+)')


class Repo:
    def __init__(self, path):
        self.path = path
        self.blobs = {}

    def git(self, *args, check=True):
        r = subprocess.run(['git', '-C', self.path, *args], capture_output=True, text=True)
        if check and r.returncode != 0:
            print(f'STOP: git {" ".join(args)} failed: {r.stderr.strip()[:300]}')
            sys.exit(1)
        return r.stdout

    def tree(self, tag, paths):
        out = self.git('ls-tree', '-r', tag, '--', *paths, check=False)
        res = {}
        for line in out.splitlines():
            meta, _, path = line.partition('\t')
            res[path] = meta.split()[2]
        return res

    def blob(self, oid):
        if oid not in self.blobs:
            self.blobs[oid] = self.git('cat-file', 'blob', oid)
        return self.blobs[oid]

    def show(self, tag, path):
        oid = self.tree(tag, [path]).get(path)
        return self.blob(oid) if oid else None


def flatten(obj, prefix=''):
    out = {}
    if isinstance(obj, dict):
        for k, v in obj.items():
            out.update(flatten(v, f'{prefix}.{k}' if prefix else k))
    elif isinstance(obj, str):
        out[prefix] = obj
    return out


def strings_at(repo, tag, files):
    res, layout = {}, []
    for f in files:
        text = repo.show(tag, f)
        if text is None:
            continue
        layout.append(f)
        stem = '' if f.endswith('/en.json') else f.rsplit('/', 1)[-1][:-5] + ':'
        try:
            data = json.loads(text)
        except ValueError:
            continue
        res.update({stem + k: v for k, v in flatten(data).items()})
    return res, layout


def first_release(releases, probe):
    for r in releases:
        if probe(r['tag']):
            return r['tag'], r['published']
    return None, None


def visible(path, prof):
    return not any(re.search(p, path) for p in prof['exclude'])


def area(path, prof):
    for p in prof['areas']:
        m = re.match(p, path)
        if m:
            return m.group(1)
    return path.rsplit('/', 1)[0]


def strings_diff(repo, prof, a, b, releases):
    old, lo = strings_at(repo, a, prof['strings'])
    new, ln = strings_at(repo, b, prof['strings'])
    per = {r['tag']: strings_at(repo, r['tag'], prof['strings'])[0] for r in releases}
    out = {'layout_changed': lo != ln, 'from_files': lo, 'to_files': ln, 'changed': [], 'added': [],
           'removed': [], 'moved': [], 'values_removed': [], 'values_added': []}

    def when(k, value):
        return first_release(releases, lambda t: per[t].get(k) == value)

    added = {k: v for k, v in new.items() if k not in old}
    removed = {k: v for k, v in old.items() if k not in new}
    for k in sorted(set(old) & set(new)):
        if old[k] != new[k]:
            f, d = when(k, new[k])
            out['changed'].append({'key': k, 'old': old[k], 'new': new[k], 'first': f, 'date': d})
    old_by_value = {}
    for k, v in removed.items():
        old_by_value.setdefault(v, []).append(k)
    for k, v in sorted(added.items()):
        if v in old_by_value and old_by_value[v]:
            out['moved'].append({'from': old_by_value[v].pop(0), 'to': k, 'value': v})
            continue
        f, d = when(k, v)
        out['added'].append({'key': k, 'value': v, 'first': f, 'date': d})
    moved_from = {m['from'] for m in out['moved']}
    for k, v in sorted(removed.items()):
        if k in moved_from:
            continue
        f, d = first_release(releases, lambda t: k not in per[t])
        out['removed'].append({'key': k, 'value': v, 'first': f, 'date': d})
    old_values, new_values = set(old.values()), set(new.values())
    for v in sorted(old_values - new_values):
        out['values_removed'].append({'value': v, 'keys': sorted(k for k, x in old.items() if x == v)})
    for v in sorted(new_values - old_values):
        f, d = first_release(releases, lambda t: v in per[t].values())
        out['values_added'].append({'value': v, 'keys': sorted(k for k, x in new.items() if x == v),
                                    'first': f, 'date': d})
    return out


def files_diff(repo, prof, a, b, releases):
    paths = prof['visible']
    ta, tb = repo.tree(a, paths), repo.tree(b, paths)
    trees = {r['tag']: repo.tree(r['tag'], paths) for r in releases}
    out = OrderedDict()
    for p in sorted(set(ta) | set(tb)):
        if ta.get(p) == tb.get(p) or not visible(p, prof):
            continue
        status = 'added' if p not in ta else 'deleted' if p not in tb else 'modified'
        f, d = first_release(releases, lambda t: trees[t].get(p) == tb.get(p))
        out.setdefault(area(p, prof), []).append({'path': p, 'status': status, 'first': f, 'date': d})
    return out


def folder_diff(repo, root, a, b, releases, leaf=None):
    def names(tag):
        res = {}
        for p, oid in repo.tree(tag, [root]).items():
            rest = p[len(root) + 1:]
            if '/' not in rest:
                continue
            name, tail = rest.split('/', 1)
            if leaf is None or tail == leaf:
                res[name] = res.get(name, '') + oid
        return res
    na, nb = names(a), names(b)
    per = {r['tag']: names(r['tag']) for r in releases}
    out = []
    for n in sorted(set(na) | set(nb)):
        if na.get(n) == nb.get(n):
            continue
        status = 'added' if n not in na else 'removed' if n not in nb else 'modified'
        f, d = first_release(releases, lambda t: per[t].get(n) == nb.get(n))
        out.append({'name': n, 'status': status, 'first': f, 'date': d})
    return out


def packages_diff(repo, prof, a, b, releases):
    def deps(tag):
        res = {}
        for f in prof['packages']:
            text = repo.show(tag, f)
            if not text:
                continue
            data = json.loads(text)
            for sect in ('dependencies', 'devDependencies', 'peerDependencies'):
                res.update({k: v for k, v in (data.get(sect) or {}).items() if k.startswith('@epam/')})
        return res
    da, db = deps(a), deps(b)
    per = {r['tag']: deps(r['tag']) for r in releases}
    out = []
    for k in sorted(set(da) | set(db)):
        if da.get(k) != db.get(k):
            f, d = first_release(releases, lambda t: per[t].get(k) == db.get(k))
            out.append({'name': k, 'old': da.get(k), 'new': db.get(k), 'first': f, 'date': d})
    return out


def schema_nodes(obj, path=''):
    res = {}
    if isinstance(obj, dict):
        fields = {k: obj[k] for k in SCHEMA_FIELDS if k in obj}
        if fields or 'properties' in obj:
            res[path or '/'] = fields
        for k, v in obj.items():
            if isinstance(v, (dict, list)):
                res.update(schema_nodes(v, f'{path}/{k}'))
    elif isinstance(obj, list):
        for i, v in enumerate(obj):
            res.update(schema_nodes(v, f'{path}/{i}'))
    return res


def schema_diff(repo, path, a, b, releases):
    def load(tag):
        text = repo.show(tag, path)
        return schema_nodes(json.loads(text)) if text else {}
    na, nb = load(a), load(b)
    per = {r['tag']: load(r['tag']) for r in releases}
    out = []
    for p in sorted(set(na) | set(nb)):
        if p not in na or p not in nb:
            status = 'added' if p not in na else 'removed'
            f, d = first_release(releases, lambda t: (p in per[t]) == (p in nb))
            out.append({'path': p, 'field': None, 'old': status == 'removed' or None,
                        'new': status == 'added' or None, 'status': status, 'first': f, 'date': d})
            continue
        for field in SCHEMA_FIELDS:
            if na[p].get(field) != nb[p].get(field):
                f, d = first_release(releases, lambda t: per[t].get(p, {}).get(field) == nb[p].get(field))
                out.append({'path': p, 'field': field, 'old': na[p].get(field), 'new': nb[p].get(field),
                            'status': 'changed', 'first': f, 'date': d})
    return out


def tools_diff(repo, path, a, b):
    def load(tag):
        text = repo.show(tag, path)
        return {t['name']: t.get('description') for t in json.loads(text)} if text else {}
    ta, tb = load(a), load(b)
    out = []
    for n in sorted(set(ta) | set(tb)):
        if ta.get(n) != tb.get(n):
            status = 'added' if n not in ta else 'removed' if n not in tb else 'changed'
            out.append({'name': n, 'status': status, 'old': ta.get(n), 'new': tb.get(n)})
    return out


def stage_text(repo, a, b):
    diff = repo.git('diff', '-U0', a, b, '--', 'src/quickapp', ':(exclude)src/tests')
    out, cur = [], None
    for line in diff.splitlines():
        if line.startswith('+++ b/'):
            cur = line[6:]
        elif line[:1] in ('+', '-') and not line.startswith(('+++', '---')) and cur and cur.endswith('.py'):
            if STAGE_LINE.search(line):
                out.append({'file': cur, 'sign': line[0], 'text': line[1:].strip()})
    return out


def notes(releases):
    items, by_pr = [], {}
    for r in releases:
        section = None
        for line in r.get('body', '').splitlines():
            if line.startswith('#'):
                section = line.lstrip('#').strip()
                continue
            text = line.strip()
            if not text.startswith(('* ', '- ')):
                continue
            prs = [int(x or y) for x, y in PR_REF.findall(text)]
            pr = prs[-1] if prs else None
            if pr is not None and pr in by_pr:
                by_pr[pr]['releases'].append(r['tag'])
                continue
            item = {'pr': pr, 'section': section, 'text': text[2:], 'first': r['tag'],
                    'date': r['published'], 'releases': [r['tag']]}
            items.append(item)
            if pr is not None:
                by_pr[pr] = item
    return items


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--repo', required=True)
    ap.add_argument('--clone', required=True)
    ap.add_argument('--windows', required=True)
    ap.add_argument('--from', dest='frm')
    ap.add_argument('--to')
    ap.add_argument('--out', required=True)
    a = ap.parse_args()
    prof = PROFILES.get(a.repo)
    if not prof:
        print(f'STOP: no profile for {a.repo}; known: {", ".join(PROFILES)}')
        sys.exit(1)
    w = json.load(open(a.windows, encoding='utf-8'))['repos'].get(a.repo)
    if not w or w['status'] != 'review':
        print(f'STOP: {a.repo} has nothing to review in {a.windows}')
        sys.exit(1)
    to = a.to or w['target']['tag']
    if a.frm:
        windows = {'custom': (a.frm, w['review'])}
    else:
        windows = {d: (b['tag'], [r for r in w['review'] if d in r['dates']]) for d, b in sorted(w['baselines'].items())}
    repo = Repo(a.clone)
    for t in sorted({to, *(f for f, _ in windows.values()), *(r['tag'] for r in w['review'])}):
        if not repo.git('tag', '--list', t).strip():
            print(f'STOP: tag {t} is not in {a.clone}; run `git -C {a.clone} fetch --tags`')
            sys.exit(1)

    res = {'repo': a.repo, 'to': to, 'windows': {}, 'notes': notes(w['review'])}
    for start, (frm, releases) in windows.items():
        res['windows'][start] = compare(repo, prof, frm, to, releases)

    with open(a.out, 'w', encoding='utf-8') as f:
        json.dump(res, f, indent=2, ensure_ascii=False)
    for start, c in res['windows'].items():
        print(f"{a.repo}  pages verified {start}: {c['from']} -> {to}  ({len(c['releases'])} releases)")
        if 'strings' in c:
            s = c['strings']
            print(f"  strings   changed {len(s['changed'])}, added {len(s['added'])}, removed {len(s['removed'])}, "
                  f"moved {len(s['moved'])}; text gone {len(s['values_removed'])}, text new {len(s['values_added'])}"
                  + ('  LAYOUT CHANGED: use the value lists' if s['layout_changed'] else ''))
        n = sum(len(v) for v in c['files'].values())
        print(f"  files     {n} user-visible files in {len(c['files'])} areas")
        if 'specs' in c:
            print(f"  specs     {len(c['specs'])} changed; archived changes {len(c['archived_changes'])} new")
        if c['watch']:
            print('  watch     changed: ' + ', '.join(c['watch']))
        if c.get('packages'):
            print('  packages  ' + ', '.join(f"{p['name']} {p['old']} -> {p['new']}" for p in c['packages']))
        if 'schema' in c:
            print(f"  schema    {len(c['schema'])} changes; tools {len(c['tools'])}; stage text {len(c['stage_text'])}")
    print(f"notes     {len(res['notes'])} release-note items")
    print(f'wrote {a.out}')


def compare(repo, prof, frm, to, releases):
    c = {'from': frm, 'to': to, 'releases': [{'tag': r['tag'], 'published': r['published']} for r in releases]}
    if prof['strings']:
        c['strings'] = strings_diff(repo, prof, frm, to, releases)
    c['files'] = files_diff(repo, prof, frm, to, releases)
    if prof.get('specs'):
        c['specs'] = folder_diff(repo, prof['specs'], frm, to, releases, leaf='spec.md')
        c['archived_changes'] = [x for x in folder_diff(repo, prof['archive'], frm, to, releases)
                                 if x['status'] == 'added']
    c['watch'] = {p: d for p in prof['watch'] for d in [repo.git('diff', frm, to, '--', p)] if d}
    if prof['packages']:
        c['packages'] = packages_diff(repo, prof, frm, to, releases)
    if prof.get('schema'):
        c['schema'] = schema_diff(repo, prof['schema'], frm, to, releases)
        c['tools'] = tools_diff(repo, prof['tools'], frm, to)
        c['stage_text'] = stage_text(repo, frm, to)
    return c


if __name__ == '__main__':
    main()
