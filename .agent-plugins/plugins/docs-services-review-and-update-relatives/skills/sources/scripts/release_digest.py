#!/usr/bin/env python3
"""Digest of the platform release documents that the PRs of a guide sync window added or changed.

Usage (from the root of the epam/ai-dial checkout):
  python3 -I release_digest.py --work <WORK> [--release N ...]

Reads <WORK>/window.json (from window.py). Without --release it takes every docs/releases/<N>/
folder with a file that a reviewed PR added or changed. For each release it reads, at the base:
  <N>-release-notes.md  the summary, every Major Enhancement (title, Preview flag, first
                        sentences, bold phrases), and every Additional Notes item per component;
  upgrade-to-<N>.md     the Versions list, compared with the previous release's list, and each
                        component section with its sub-sections (breaking changes, new, removed,
                        and deprecated settings, behavioral changes, migrations, API changes),
                        their items, callouts, and backticked identifiers;
  any other file        its title and H2 headings.
Every feature phrase and identifier is searched in the source pages (docs_v2 outside the four
target sections) and in the target pages, so you see what the docs already cover.
Writes <WORK>/releases.json and <WORK>/releases.md.
"""
import argparse
import json
import os
import re
import subprocess

TARGET_NAMES = ('understand-dial', 'connecting-to-dial', 'building-with-dial', 'operating-dial')
TICK = re.compile(r'`([^`\n]+)`')
IDENT = re.compile(r'^(?:[A-Z][A-Z0-9]*_[A-Z0-9_]+|[A-Z]{4,}|[a-z][A-Za-z0-9_-]*(?:\.[A-Za-z0-9_*<>-]+)+|'
                   r'[a-z]+(?:[A-Z][a-z0-9]+)+|[a-z][a-z0-9]*(?:_[a-z0-9]+)+|/[\w{}<>.:/-]{2,})$')
STOP = {'the', 'and', 'for', 'with', 'new', 'now', 'are', 'all', 'from', 'into', 'more', 'their', 'your'}


def git(*args):
    return subprocess.run(['git', *args], capture_output=True, text=True)


def show(rev, path):
    r = git('show', f'{rev}:{path}')
    return r.stdout if r.returncode == 0 else None


def vkey(v):
    return [int(x) if x.isdigit() else 0 for x in re.split(r'[.]', v)]


def read_tree(rev):
    names = [n for n in git('ls-tree', '-r', '--name-only', rev, '--', 'docs_v2').stdout.split('\n') if n.endswith('.md')]
    p = subprocess.run(['git', 'cat-file', '--batch'], input=('\n'.join(f'{rev}:{n}' for n in names) + '\n').encode(),
                       capture_output=True)
    data, out, pos = p.stdout, {}, 0
    for n in names:
        nl = data.index(b'\n', pos)
        size = int(data[pos:nl].split()[2])
        out[n] = data[nl + 1:nl + 1 + size].decode('utf-8', 'replace')
        pos = nl + 1 + size + 1
    return out


class Corpus:
    def __init__(self, tree):
        self.src, self.tgt = {}, {}
        for p, t in tree.items():
            sec = re.sub(r'^\d+\.', '', p.split('/')[1])
            (self.tgt if sec in TARGET_NAMES else self.src)[p] = t

    @staticmethod
    def _find(texts, needle, exact):
        hits = []
        for p, t in texts.items():
            if (needle in t) if exact else (needle.lower() in t.lower()):
                hits.append(p)
        return sorted(hits)

    def where(self, needle, exact=False):
        return {'sources': self._find(self.src, needle, exact), 'targets': self._find(self.tgt, needle, exact)}


def short(p):
    return re.sub(r'(^|/)\d+\.', r'\1', p.replace('docs_v2/', '')).replace('.md', '')


def fmt_hits(h, n=4):
    def one(lst):
        return f'{len(lst)}' + (f' ({", ".join(short(x) for x in lst[:n])}{", …" if len(lst) > n else ""})' if lst else '')
    return f'sources {one(h["sources"])}; targets {one(h["targets"])}'


ABBR = {'organization': 'org', 'application': 'app', 'applications': 'apps', 'configuration': 'config',
        'authentication': 'auth', 'deployment': 'deployment'}


def variants(phrase):
    """The phrase, its singular, and common abbreviations: 'Organization Units' also finds 'org unit'."""
    p = re.sub(r'\s+', ' ', phrase).strip()
    out = [p]
    words = p.split(' ')
    last = words[-1].lower()
    if len(words) > 1 and last.endswith('ies'):
        out.append(' '.join(words[:-1] + [words[-1][:-3] + 'y']))
    elif len(words) > 1 and last.endswith('s') and not last.endswith('ss'):
        out.append(' '.join(words[:-1] + [words[-1][:-1]]))
    for v in list(out):
        ws = v.split(' ')
        if ws[0].lower() in ABBR:
            out.append(' '.join([ABBR[ws[0].lower()]] + ws[1:]))
    return list(dict.fromkeys(out))


def section(text, title):
    m = re.search(rf'^## {re.escape(title)}\s*$(.*?)(?=^## |\Z)', text, re.M | re.S)
    return m[1] if m else ''


def sentences(s, n=2):
    s = re.sub(r'\s+', ' ', re.sub(r'<[^>]+>|!\[[^\]]*\]\([^)]*\)|\[!\[.*?\]\(.*?\)\]\(.*?\)', '', s)).strip()
    parts = re.split(r'(?<=[.!?])\s+', s)
    return ' '.join(parts[:n])


def parse_notes(text):
    out = {'summary': sentences(section(text, 'Brief Summary'), 3), 'features': [], 'notes': []}
    for para in re.split(r'\n\s*\n', section(text, 'Major Enhancements')):
        m = re.match(r'^\*\*(.+?)\*\*:?\s*(.*)', para.strip(), re.S)
        if not m:
            continue
        title = m[1].strip().rstrip(':')
        body = m[2]
        bold = [b.strip() for b in re.findall(r'\*\*([^*]+)\*\*', body)]
        out['features'].append({'title': title, 'preview': '(preview)' in title.lower(),
                                'text': sentences(body, 2), 'bold': bold})
    comp = None
    for line in section(text, 'Additional Notes').split('\n'):
        s = line.strip()
        m = re.match(r'^\*\*([^*]+)\*\*\s*$', s)
        if m:
            comp = m[1]
            continue
        m = re.match(r'^[*-]\s+\*\*(.+?):?\*\*:?\s*(.*)', s)
        if m and comp:
            out['notes'].append({'component': comp, 'title': m[1].rstrip(':'), 'text': sentences(m[2], 1)})
    return out


def parse_versions(text):
    out, group = {}, None
    m = re.search(r'^## Versions\s*$(.*?)(?=^## |\Z)', text or '', re.M | re.S)
    for line in (m[1] if m else '').split('\n'):
        if re.search(r'Helm chart versions', line, re.I):
            group = 'chart'
        elif re.search(r'components versions', line, re.I):
            group = 'component'
        v = re.match(r'^\s*-\s*([\w.-]+):\s*`([^`]+)`', line)
        if v and group:
            out[f'{group}:{v[1]}'] = v[2]
    return out


def parse_upgrade(text):
    comps, cur, sub = [], None, None
    for line in text.split('\n'):
        m = re.match(r'^####\s+([\w.-]+)\s+`([^`]+)`', line)
        if m:
            cur = {'component': m[1], 'version': m[2], 'callouts': [], 'sections': []}
            comps.append(cur)
            sub = None
            continue
        if re.match(r'^##\s', line):
            cur = None
            continue
        if not cur:
            continue
        h = re.match(r'^#{3,6}\s+(.+?)\s*$', line)
        if h:
            sub = {'title': h[1], 'items': [], 'ids': [], 'keys': []}
            cur['sections'].append(sub)
            continue
        if re.match(r'^>\s*\[!(IMPORTANT|WARNING|CAUTION)\]', line):
            cur['callouts'].append({'kind': re.match(r'^>\s*\[!(\w+)\]', line)[1], 'text': ''})
            continue
        if line.startswith('>') and not cur['callouts']:
            continue
        if line.startswith('>') and cur['callouts'] and len(cur['callouts'][-1]['text']) < 400:
            cur['callouts'][-1]['text'] += ' ' + line.lstrip('> ').strip()
            continue
        s = line.strip()
        if not s or s == '---':
            continue
        if sub is None:
            sub = {'title': '(intro)', 'items': [], 'ids': [], 'keys': []}
            cur['sections'].append(sub)
        if s.startswith('|') and not re.match(r'^\|[\s:|-]+\|?$', s):
            first = s.strip('|').split('|')[0].strip()
            if first.lower() not in ('variable', 'setting', 'setting (env var)', 'component', 'previous configuration', 'field'):
                sub['items'].append(re.sub(r'\s+', ' ', s)[:240])
                k = TICK.findall(first)
                if k and IDENT.match(k[0].strip()):
                    sub['keys'].append(k[0].strip())
        elif re.match(r'^[-*]\s|^\*\*', s):
            sub['items'].append(re.sub(r'\s+', ' ', re.sub(r'^[-*]\s+', '', s))[:240])
            if re.search(r'\b(remov|no longer|renamed|replac|deprecat|dropped)', s, re.I):
                sub['keys'] += [t.strip() for t in TICK.findall(s) if IDENT.match(t.strip())]
        for t in TICK.findall(s):
            t = t.strip()
            if IDENT.match(t) and t not in sub['ids']:
                sub['ids'].append(t)
    return comps


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--work', required=True)
    ap.add_argument('--release', action='append', default=[])
    a = ap.parse_args()
    w = json.load(open(os.path.join(a.work, 'window.json'), encoding='utf-8'))
    end = w['base']['commit']
    units = [r for r in w['prs'] if r['role'] == 'review']

    def changed_in(path):
        """Files under path that a reviewed PR changed, with the PR numbers."""
        out = {}
        for u in units:
            for f in git('diff', '--name-only', u['range']['from'], u['range']['to'], '--', path).stdout.split():
                out.setdefault(f, set()).add(u['number'])
        return out

    rels = a.release
    if not rels:
        rels = sorted({n.split('/')[2] for n in changed_in('docs/releases') if n.count('/') >= 3}, key=vkey)
    all_rels = sorted({n.split('/')[2] for n in git('ls-tree', '-r', '--name-only', end, '--', 'docs/releases').stdout.split()
                       if n.count('/') >= 3}, key=vkey)
    corpus = Corpus(read_tree(end))
    out, md = [], [f'# Release documents changed by the PRs closed {w["start"]} through {w["end"]}', '']
    if not rels:
        md.append('No reviewed PR changed a release document.')
    for n in rels:
        files = sorted(f for f in git('ls-tree', '--name-only', end, f'docs/releases/{n}/').stdout.split() if f.endswith('.md'))
        by_file = changed_in(f'docs/releases/{n}')
        changed = set(by_file)
        prs = sorted({str(x) for v in by_file.values() for x in v}, key=int)
        rel = {'release': n, 'files': files, 'changed': sorted(changed), 'prs': prs}
        md += [f'## {n}', '', f'Files: {", ".join(os.path.basename(f) + (" (changed)" if f in changed else "") for f in files)}; PRs: {", ".join("#" + p for p in prs) or "—"}', '']
        notes_f = next((f for f in files if f.endswith(f'{n}-release-notes.md')), None)
        if notes_f:
            notes = parse_notes(show(end, notes_f) or '')
            rel['notes'] = notes
            md += ['### Summary', '', notes['summary'], '', '### Major enhancements', '']
            for f in notes['features']:
                phrases = [re.sub(r'\s*\(.*?\)\s*', ' ', f['title']).strip()] + [b for b in f['bold'] if len(b) > 3]
                f['hits'] = {v: corpus.where(v) for p in dict.fromkeys(phrases) for v in variants(p)}
                md.append(f'- **{f["title"]}**{" (Preview)" if f["preview"] and "preview" not in f["title"].lower() else ""}: {f["text"]}')
                for p, h in f['hits'].items():
                    md.append(f'  - "{p}": {fmt_hits(h)}')
            md += ['', '### Additional notes', '']
            for x in notes['notes']:
                x['hits'] = corpus.where(x['title'])
                md.append(f'- {x["component"]}, **{x["title"]}**: {x["text"]} — {fmt_hits(x["hits"], 3)}')
            md.append('')
        up_f = next((f for f in files if os.path.basename(f) == f'upgrade-to-{n}.md'), None)
        if up_f:
            text = show(end, up_f) or ''
            vers = parse_versions(text)
            prev = [r for r in all_rels if vkey(r) < vkey(n)]
            pvers = {}
            if prev:
                pvers = parse_versions(show(end, f'docs/releases/{prev[-1]}/upgrade-to-{prev[-1]}.md') or '')
            rel['versions'] = vers
            rel['previous'] = prev[-1] if prev else None
            md += [f'### Versions, compared with {prev[-1] if prev else "nothing"}', '', '| Component | Before | Now |', '|---|---|---|']
            for k in sorted(set(vers) | set(pvers)):
                if vers.get(k) != pvers.get(k):
                    md.append(f'| {k} | {pvers.get(k, "—")} | {vers.get(k, "removed")} |')
            same = [k for k in vers if vers.get(k) == pvers.get(k)]
            md += ['', f'Unchanged: {", ".join(sorted(same)) or "—"}', '', '### Upgrade notes by component', '']
            comps = parse_upgrade(text)
            rel['components'] = comps
            for c in comps:
                md.append(f'#### {c["component"]} {c["version"]}')
                seen = set()
                for co in c['callouts']:
                    t = co['text'].strip()
                    if t and t not in seen:
                        seen.add(t)
                        md.append(f'- **{co["kind"]}**: {t[:400]}')
                for s in c['sections']:
                    if not s['items'] and not s['ids']:
                        continue
                    md.append(f'- *{s["title"]}*:')
                    for it in s['items'][:12]:
                        md.append(f'  - {it}')
                    if len(s['items']) > 12:
                        md.append(f'  - … {len(s["items"]) - 12} more')
                    s['hits'] = {i: corpus.where(i, exact=True) for i in s['ids'][:25]}
                    shown = [f'`{i}` ({len(h["sources"])} src, {len(h["targets"])} tgt)' for i, h in s['hits'].items()]
                    if shown:
                        md.append('  - identifiers: ' + ', '.join(shown))
                md.append('')
        for f in files:
            if f in (notes_f, up_f):
                continue
            t = show(end, f) or ''
            title = next((l[2:].strip() for l in t.split('\n') if l.startswith('# ')), os.path.basename(f))
            h2 = [l[3:].strip() for l in t.split('\n') if l.startswith('## ')]
            rel.setdefault('other', []).append({'file': f, 'title': title, 'h2': h2})
            md += [f'### Other document: {os.path.basename(f)}', '', f'"{title}". Sections: {"; ".join(h2)}', '']
        out.append(rel)
    json.dump(out, open(os.path.join(a.work, 'releases.json'), 'w', encoding='utf-8'), indent=1)
    open(os.path.join(a.work, 'releases.md'), 'w', encoding='utf-8').write('\n'.join(md) + '\n')
    print(f'releases: {", ".join(rels) or "none"}; wrote {os.path.join(a.work, "releases.md")}')


if __name__ == '__main__':
    main()
