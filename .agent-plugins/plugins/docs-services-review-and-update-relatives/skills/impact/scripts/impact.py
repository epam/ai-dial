#!/usr/bin/env python3
"""Where the window's source changes touch the four target sections.

Usage (from the root of the epam/ai-dial checkout, at the window's end):
  python3 -I impact.py --work <WORK> [--section understand-dial ...]

Reads <WORK>/changes.json (source_changes.py) and, when present, <WORK>/releases.json
(release_digest.py). Searches the target pages in the working tree and writes <WORK>/impact.md
and <WORK>/impact.json: for each target page, the triggers that point at it, ranked high,
medium, or low, with the line, its text, and the source entry. Triggers:
  link     the page links to a source page that changed, moved, or was removed; high when the
           link's anchor is a changed, renamed, or removed section, or the target is gone
  id       the page names an identifier that a source page removed; high when no source page
           has it any more
  value    the page names the key of a table row that changed, and an old value is near it
  version  the page names a version, image tag, or chart version that the window replaced
  hub      a new service, and the page links three or more service folders without naming it
  release  the page names a release feature, or an identifier the release removed or deprecated
It also lists the source entries and release features with no trigger. Read those too: a
capability can matter to a page that has never mentioned it.
"""
import argparse
import json
import os
import re
from collections import defaultdict

D = 'docs_v2'
TARGET_NAMES = ('understand-dial', 'connecting-to-dial', 'building-with-dial', 'operating-dial')
LINK = re.compile(r'\]\(([^)\s]+)(?:\s+"[^"]*")?\)')
FENCE = re.compile(r'^\s*(```|~~~)')
RANK = {'high': 0, 'medium': 1, 'low': 2}
IDENT = re.compile(r'^(?:[A-Z][A-Z0-9]*_[A-Z0-9_]+|[A-Z]{4,}[0-9]*|[a-z][A-Za-z0-9_-]*(?:\.[A-Za-z0-9_*-]+)+|'
                   r'[a-z]+(?:[A-Z][a-z0-9]+)+|[a-z][a-z0-9]*(?:_[a-z0-9]+)+|/[\w{}<>.:/-]{2,})$')


def substantive(e):
    """A changed page whose change is more than a line or two of wording."""
    n = e.get('lines', {})
    return (n.get('removed', 0) + n.get('added', 0) >= 4 or e.get('headings_removed') or e.get('headings_renamed')
            or e.get('ids_removed') or e.get('rows_changed') or e.get('rows_removed'))


def target_pages(sections):
    out = {}
    for sec in sorted(os.listdir(D)):
        name = re.sub(r'^\d+\.', '', sec)
        if name not in TARGET_NAMES or (sections and name not in sections):
            continue
        for root, _, files in os.walk(os.path.join(D, sec)):
            for f in files:
                if f.endswith('.md'):
                    p = os.path.join(root, f)
                    out[p] = open(p, encoding='utf-8').read().split('\n')
    return out


def token_re(s):
    return re.compile(r'(?<![\w.\-/])' + re.escape(s) + r'(?![\w\-])')


def service_names():
    """Map a repository name (ai-dial-core) and a service folder to the service's title."""
    repo2name, folder2name = {}, {}
    sdir = next((os.path.join(D, s) for s in os.listdir(D) if re.match(r'\d+\.services$', s)), None)
    if not sdir:
        return repo2name, folder2name
    for f in os.listdir(sdir):
        idx = os.path.join(sdir, f, '0.index.md')
        if not os.path.isfile(idx):
            continue
        t = open(idx, encoding='utf-8').read()
        h1 = next((l[2:].strip() for l in t.split('\n') if l.startswith('# ')), f)
        folder2name[f] = h1
        m = re.search(r'^:::info\s*$(.*?)^:::\s*$', t, re.M | re.S)
        for repo in re.findall(r'github\.com/epam/([\w.-]+?)(?:/|\)|$)', m[1] if m else '', re.M):
            repo2name.setdefault(repo, h1)
    return repo2name, folder2name


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--work', required=True)
    ap.add_argument('--section', action='append', default=[], help='limit to these target sections')
    a = ap.parse_args()
    if not os.path.isdir(D):
        raise SystemExit('run from the ai-dial checkout root')
    ch = json.load(open(os.path.join(a.work, 'changes.json'), encoding='utf-8'))
    rel_path = os.path.join(a.work, 'releases.json')
    releases = json.load(open(rel_path, encoding='utf-8')) if os.path.exists(rel_path) else []
    pages = target_pages(set(a.section))
    repo2name, folder2name = service_names()

    links = defaultdict(list)          # resolved target file -> [(page, line, anchor, url)]
    svc_links = defaultdict(set)       # page -> service folders it links
    code = {}                          # page -> set of line numbers inside code blocks
    for p, lines in pages.items():
        in_code, cl = False, set()
        for n, line in enumerate(lines, 1):
            if FENCE.match(line):
                in_code = not in_code
                continue
            if in_code:
                cl.add(n)
                continue
            for url in LINK.findall(line):
                if re.match(r'^[a-zA-Z][a-zA-Z0-9+.-]*:', url) or url.startswith('#'):
                    continue
                path, _, frag = url.partition('#')
                tgt = os.path.normpath(os.path.join(os.path.dirname(p), path))
                links[tgt].append((p, n, frag, url))
                m = re.match(r'docs_v2/\d+\.services/(\d+\.[\w-]+)/', tgt)
                if m:
                    svc_links[p].add(m[1])
        code[p] = cl

    trig = defaultdict(list)
    fired = set()

    def add(page, level, kind, line, why, entry):
        text = pages[page][line - 1].strip() if line else ''
        trig[page].append({'level': level, 'kind': kind, 'line': line, 'why': why, 'entry': entry,
                           'text': text[:240]})
        fired.add(entry)

    def grep(needle, regex=None):
        rx = regex or token_re(needle)
        for p, lines in pages.items():
            for n, line in enumerate(lines, 1):
                if rx.search(line):
                    yield p, n

    for e in ch['entries']:
        eid = f'[{e["id"]}] {e.get("new") or e.get("old")}'
        prs = ', '.join(sorted({f'#{c["pr"]}' if c['pr'] else c['sha'] for c in e['commits']}))
        ref = f'{eid} ({prs})'
        kind = e['kind']
        if kind in ('removed', 'rewritten-away') or (e['status'] == 'R' and e.get('old')):
            for p, n, frag, url in links.get(os.path.normpath(e['old']), []):
                if os.path.normpath(e['old']) != os.path.normpath(e.get('new') or ''):
                    add(p, 'high', 'link', n, f'links `{url}`, which was {"removed" if kind in ("removed", "rewritten-away") else "moved to " + str(e.get("new"))}', ref)
        if kind in ('changed', 'rewritten') and e.get('new'):
            hot = set(e.get('sections_changed', []))
            gone = {h['anchor'] for h in e.get('headings_removed', [])} | {h['old_anchor'] for h in e.get('headings_renamed', [])}
            only_reading = hot <= {'further-reading'}
            for p, n, frag, url in links.get(os.path.normpath(e['new']), []):
                if frag and frag in gone:
                    add(p, 'high', 'link', n, f'links `#{frag}`, a heading the window removed or renamed', ref)
                elif frag and frag in hot:
                    add(p, 'high', 'link', n, f'links `#{frag}`, a section whose text changed', ref)
                elif not only_reading:
                    add(p, 'medium' if substantive(e) and not frag else 'low', 'link', n,
                        f'links a page whose text changed in {", ".join("#" + s for s in sorted(hot)) or "its body"}', ref)
        for x in e.get('ids_removed', []):
            for p, n in grep(x['id']):
                add(p, 'high' if x['gone'] else 'medium', 'id', n,
                    f'names `{x["id"]}`, which the window removed' + (' from every source page' if x['gone'] else ' from this source page (still documented elsewhere)'), ref)
        for r in e.get('rows_changed', []):
            key = r['key']
            ident = bool(IDENT.match(key))
            if not ident and not (' ' in key and len(key) >= 10):
                continue
            ocells = [c.strip().strip('`') for c in r['old'].strip('|').split('|')]
            ncells = [c.strip().strip('`') for c in r['new'].strip('|').split('|')]
            olds = [o for o, nn in zip(ocells[1:], ncells[1:]) if o != nn and 0 < len(o) <= 40]
            rx = re.compile(re.escape(key), re.I) if ' ' in key else token_re(key)
            for p, n in grep(key, rx):
                near = '\n'.join(pages[p][max(0, n - 3):n + 2])
                hit = [o for o in olds if token_re(o).search(near)]
                if hit:
                    add(p, 'high', 'value', n, f'names `{key}` with the old value {", ".join("`" + h + "`" for h in hit)} nearby; the row changed', ref)
                elif ident:
                    add(p, 'low', 'value', n, f'names `{key}`, whose row changed', ref)
        for r in e.get('rows_removed', []):
            if IDENT.match(r['key']):
                rx = re.compile(re.escape(r['key']), re.I) if ' ' in r['key'] else token_re(r['key'])
                for p, n in grep(r['key'], rx):
                    add(p, 'medium', 'value', n, f'names `{r["key"]}`, a row the window removed', ref)
        for v in e.get('versions_gone', []):
            for p, n in grep(v):
                add(p, 'medium', 'version', n, f'names `{v}`, a version the source page no longer names', ref)
        ns = e.get('new_service')
        if ns:
            name = ns['name']
            for p, fs in svc_links.items():
                if len(fs) >= 3 and ns['folder'] not in fs and name.lower() not in '\n'.join(pages[p]).lower():
                    add(p, 'low', 'hub', 0, f'links {len(fs)} service folders and never names {name}; is it a complete list?', ref)

    rel_unmatched = []
    for rel in releases:
        n = rel['release']
        prev = rel.get('previous')
        for f in rel.get('notes', {}).get('features', []):
            hit_any = False
            for phrase, h in f.get('hits', {}).items():
                if ' ' not in phrase.strip():
                    continue
                for page in h['targets']:
                    if page in pages:
                        rx = re.compile(re.escape(phrase), re.I)
                        for k, line in enumerate(pages[page], 1):
                            if rx.search(line):
                                add(page, 'low', 'release', k, f'mentions "{phrase}", part of the {n} feature "{f["title"]}"', f'release {n}')
                                hit_any = True
                                break
            src = sorted({s for h in f.get('hits', {}).values() for s in h['sources']})
            if not hit_any:
                rel_unmatched.append(f'{n} **{f["title"]}**: no target page names it; source pages that do: {len(src)}' +
                                     (f' ({", ".join(src[:5])})' if src else ' (release documents only)'))
        for c in rel.get('components', []):
            for s in c.get('sections', []):
                if not re.search(r'remov|deprecat|breaking', s['title'], re.I):
                    continue
                for i in s.get('keys', []):
                    for p, k in grep(i):
                        add(p, 'high', 'release', k, f'names `{i}`: {c["component"]} {c["version"]} lists it under "{s["title"]}"', f'release {n}')
        vers, pvers = rel.get('versions', {}), {}
        if prev:
            pvers = next((r.get('versions', {}) for r in releases if r['release'] == prev), None) or {}
        for key, new in vers.items():
            group, name = key.split(':', 1)
            old = pvers.get(key)
            for p, lines in pages.items():
                for k, line in enumerate(lines, 1):
                    m = re.search(r'(?<![\w-])' + re.escape(name) + r':(v?\d+\.\d+\.\d+)', line) if group == 'component' else None
                    if m and m[1].lstrip('v') != new:
                        add(p, 'medium', 'version', k, f'pins `{name}:{m[1]}`; release {n} ships {new}', f'release {n}')
                    elif group == 'chart':
                        cm = re.search(rf'(?:dial/|charts/|`){re.escape(name)}(?![\w-])`?\s+(?:chart\s+)?(?:version\s+)?`?(\d+\.\d+\.\d+)', line)
                        if not cm and re.search(rf'helm\s+(?:install|upgrade)\b.*\sdial/{re.escape(name)}(?![\w-])', line):
                            cm = re.search(r'--version\s+`?(\d+\.\d+\.\d+)', '\n'.join(lines[k - 1:k + 5]))
                        if cm and cm[1] != new:
                            add(p, 'medium', 'version', k, f'names chart {name} {cm[1]}; release {n} ships chart {new}', f'release {n}')
                    elif old and old != new and name in repo2name and repo2name[name].lower() in line.lower() and token_re(old).search(line):
                        add(p, 'medium', 'version', k, f'names {repo2name[name]} {old}; release {n} ships {new}', f'release {n}')

    for p in trig:
        seen, uniq, merged = set(), [], {}
        for t in sorted(trig[p], key=lambda t: (RANK[t['level']], t['line'])):
            k = (t['kind'], t['line'], t['why'])
            if k in seen:
                continue
            seen.add(k)
            if t['kind'] == 'link':
                mk = (t['level'], t['why'], t['entry'])
                if mk in merged:
                    merged[mk]['lines'].append(t['line'])
                    continue
                t['lines'] = [t['line']]
                merged[mk] = t
            uniq.append(t)
        trig[p] = uniq
    order = sorted(trig, key=lambda p: (-sum(t['level'] == 'high' for t in trig[p]), -sum(t['level'] == 'medium' for t in trig[p]), p))
    counts = {l: sum(t['level'] == l for p in trig for t in trig[p]) for l in RANK}
    hit_entries = {t["entry"].split(" (")[0] for p in trig for t in trig[p]}
    silent, trivial = [], 0
    for e in ch['entries']:
        if f'[{e["id"]}] {e.get("new") or e.get("old")}' in hit_entries or e['kind'] not in ('changed', 'added', 'rewritten', 'removed'):
            continue
        if e['area'].startswith('releases/'):
            continue  # read releases.md instead
        if e['kind'] == 'changed' and set(e.get('sections_changed', [])) <= {'further-reading'}:
            trivial += 1
            continue
        silent.append(e)

    md = [f'# Impact on the target sections', '',
          f'Window {ch["window"]["start"][:10]}..{ch["window"]["end"][:10]}. Triggers: {counts["high"]} high, {counts["medium"]} medium, '
          f'{counts["low"]} low, on {len(trig)} of {len(pages)} target pages.', '']
    for p in order:
        c = {l: sum(t['level'] == l for t in trig[p]) for l in RANK}
        md += [f'## {p} ({c["high"]} high, {c["medium"]} medium, {c["low"]} low)', '']
        for t in trig[p]:
            loc = ('L' + ', L'.join(str(x) for x in t.get('lines', [t['line']]))) if t['line'] else 'page'
            md.append(f'- [{t["level"]}] {t["kind"]} {loc}: {t["why"]} — {t["entry"]}')
            if t['text'] and t['level'] != 'low':
                md.append(f'  > {t["text"]}')
        md.append('')
    md += ['## Source entries with no trigger', '',
           'No target page links, names, or lists what these changed. Check each against the topic map in `docs-services-review-and-update-relatives:sections`. '
           f'Not listed: release documents (see releases.md) and {trivial} pages whose only change is in Further reading.', '']
    for e in silent:
        prs = ', '.join(sorted({f'#{c["pr"]}' if c['pr'] else c['sha'] for c in e['commits']}))
        extra = f'; sections {", ".join("#" + s for s in e.get("sections_changed", []))}' if e.get('sections_changed') else ''
        md.append(f'- [{e["id"]}] {e["kind"]} `{e.get("new") or e.get("old")}` — {e.get("title", "")} ({prs}){extra}')
    if releases:
        md += ['', '## Release features no target page names', '']
        md += [f'- {x}' for x in rel_unmatched] or ['- none']
    json.dump({'triggers': trig, 'order': order, 'silent': [e['id'] for e in silent], 'release_unmatched': rel_unmatched},
              open(os.path.join(a.work, 'impact.json'), 'w', encoding='utf-8'), indent=1)
    open(os.path.join(a.work, 'impact.md'), 'w', encoding='utf-8').write('\n'.join(md) + '\n')
    print(f'triggers: {counts["high"]} high, {counts["medium"]} medium, {counts["low"]} low on {len(trig)} pages; '
          f'{len(silent)} source entries with no trigger; wrote {os.path.join(a.work, "impact.md")}')


if __name__ == '__main__':
    main()
