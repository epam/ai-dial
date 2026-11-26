#!/usr/bin/env python3
"""Ledger of the source changes in a guide alignment window.

Usage (from the root of the epam/ai-dial checkout):
  python3 -I source_changes.py --work <WORK>

Reads <WORK>/window.json (from window.py) and compares the window's effective start with its
end, with rename detection, over docs_v2/, docs/releases/, and sidebars-v2.js. It keeps only
content changes: a hunk that differs in nothing but link targets, whitespace, or frontmatter is
dropped, so a renumbering or a link repair leaves no noise.

Writes:
  <WORK>/changes.json     one entry per changed source page, with the facts below
  <WORK>/changes.md       the same, to read
  <WORK>/diffs/NNN.diff   the content-only diff of entry NNN

Facts per page: status (added, removed, moved, changed), the commits and PR numbers that touched
it, the sections whose text changed (anchors), headings removed, added, or renamed, backticked
identifiers removed or added (a removed one is "gone" when no source page has it any more),
table rows changed, removed, or added (keyed by their first cell), and version numbers that
disappeared or appeared. Pages in the four target sections are listed apart, as context; they
are not sources.
"""
import argparse
import difflib
import json
import os
import re
import subprocess
import sys

TARGET_NAMES = ('understand-dial', 'connecting-to-dial', 'building-with-dial', 'operating-dial')
FENCE = re.compile(r'^\s*(```|~~~)')
HEAD = re.compile(r'^(#{1,6})\s+(.+?)\s*(?:\{#([\w-]+)\})?\s*$')
TICK = re.compile(r'`([^`\n]+)`')
ID = re.compile(
    r'^(?:[A-Z][A-Z0-9]*_[A-Z0-9_]+'            # ENV_VARS
    r'|[A-Z]{4,}[0-9]*'                         # ENUM VALUES such as OAUTH
    r'|[a-z][A-Za-z0-9_-]*(?:\.[A-Za-z0-9_*-]+)+'  # dotted.properties and file.names
    r'|[a-z]+(?:[A-Z][a-z0-9]+)+'               # camelCase
    r'|[a-z][a-z0-9]*(?:_[a-z0-9]+)+'           # snake_case
    r'|[a-z][a-z0-9]*(?:-[a-z0-9]+){1,}'        # kebab-case names and images
    r'|/[\w{}<>.:/-]{2,}'                        # /api/paths
    r'|--[a-z][\w-]+)$')                         # --cli-flags
VER = re.compile(r'(?<![\w.])v?\d+\.\d+\.\d+(?:-(?:rc|alpha|beta|preview|dev|snapshot)[\w.]*)?(?![\w.-])', re.I)


def git(*args):
    return subprocess.run(['git', *args], capture_output=True, text=True)


def show(rev, path):
    r = git('show', f'{rev}:{path}')
    return r.stdout if r.returncode == 0 else None


def section_name(path):
    p = path.split('/')
    return re.sub(r'^\d+\.', '', p[1]) if len(p) > 1 and p[0] == 'docs_v2' else ''


def area(path):
    p = path.split('/')
    if p[0] == 'sidebars-v2.js':
        return 'menu'
    if p[0] == 'docs':
        return f'releases/{p[2]}' if len(p) > 2 else 'releases'
    sec = section_name(path)
    if sec in TARGET_NAMES:
        return f'target/{sec}'
    if sec == 'services':
        return f'services/{p[2]}' if len(p) > 3 else 'services/landing'
    return {'overview.md': 'overview', 'administering-dial-new': 'admin-guide',
            'chat-user-guide': 'chat-guide', 'demos': 'demos'}.get(sec, f'other/{sec}')


def area_order(a):
    if a.startswith('services/'):
        m = re.match(r'services/(\d+)\.', a)
        return (0, int(m[1]) if m else 0, a)
    rank = {'admin-guide': 1, 'chat-guide': 2, 'overview': 3, 'demos': 4, 'menu': 6}
    if a.startswith('releases/'):
        return (5, 0, a)
    return (rank.get(a, 7), 0, a)


def slug(text):
    text = re.sub(r'<[^>]+>', '', text)
    text = re.sub(r'\[([^\]]*)\]\([^)]*\)', r'\1', text)
    text = text.strip().lower().replace('`', '')
    text = re.sub(r'[^\w\- ]', '', text)
    return text.replace(' ', '-')


def split_fm(text):
    lines = text.split('\n')
    if lines and lines[0].strip() == '---':
        for i in range(1, len(lines)):
            if lines[i].strip() == '---':
                return lines[:i + 1], lines[i + 1:], i + 1
    return [], lines, 0


def fm_dict(fm_lines):
    d = {}
    for l in fm_lines[1:-1]:
        if ':' in l and not l.startswith((' ', '\t', '#')):
            k, _, v = l.partition(':')
            d[k.strip()] = v.strip().strip('"')
    return d


def headings(body):
    out, seen, in_code = [], {}, False
    for i, line in enumerate(body):
        if FENCE.match(line):
            in_code = not in_code
            continue
        if in_code:
            continue
        m = HEAD.match(line)
        if m:
            s = m[3] or slug(m[2])
            n = seen.get(s, 0)
            seen[s] = n + 1
            out.append((i, len(m[1]), m[2].strip(), s if n == 0 else f'{s}-{n}'))
    return out


def anchor_at(heads, idx):
    a = ''
    for i, _, _, s in heads:
        if i > idx:
            break
        a = s
    return a


def norm(s):
    s = re.sub(r'\]\([^)]*\)', ']()', s)
    s = re.sub(r'<a\s+[^>]*>\s*</a>', '', s)
    return ' '.join(s.split())


def ids_in(lines):
    out = set()
    for l in lines:
        for t in TICK.findall(l):
            t = t.strip()
            if 3 <= len(t) <= 80 and ID.match(t) and not VER.fullmatch(t):
                out.add(t)
    return out


def row_key(line):
    cells = [c.strip() for c in line.strip().strip('|').split('|')]
    k = cells[0] if cells else ''
    k = re.sub(r'\[([^\]]*)\]\([^)]*\)', r'\1', k)
    return re.sub(r'[`*]', '', k).strip(), cells


def table_rows(lines):
    rows = {}
    for l in lines:
        s = l.strip()
        if s.startswith('|') and not re.match(r'^\|[\s:|-]+\|?$', s):
            k, cells = row_key(s)
            if k:
                rows[k] = (s, cells)
    return rows


def first_paragraph(body):
    started = False
    for l in body:
        s = l.strip()
        if s.startswith('# '):
            started = True
            continue
        if started and s and not s.startswith(('#', ':::', '|', '-', '*', '>', '```', '<', '!')):
            return s[:320]
    return ''


def read_tree(rev, paths):
    """Read every .md blob under paths at rev in one git cat-file call."""
    names = [n for n in git('ls-tree', '-r', '--name-only', rev, '--', *paths).stdout.split('\n') if n.endswith('.md')]
    if not names:
        return {}
    p = subprocess.run(['git', 'cat-file', '--batch'],
                       input=('\n'.join(f'{rev}:{n}' for n in names) + '\n').encode(), capture_output=True)
    data, out, pos = p.stdout, {}, 0
    for n in names:
        nl = data.index(b'\n', pos)
        header = data[pos:nl].decode().split()
        size = int(header[2]) if len(header) == 3 else 0
        out[n] = data[nl + 1: nl + 1 + size].decode('utf-8', 'replace')
        pos = nl + 1 + size + 1
    return out


def landing_rows(text):
    rows = {}
    for l in (text or '').split('\n'):
        m = re.match(r'^\|\s*\[([^\]]+)\]\((\d+\.[\w-]+)/0\.index\.md\)\s*\|\s*(.+?)\s*\|\s*$', l)
        if m:
            rows[m[2]] = (m[1], m[3])
    return rows


def commits_for(start, end, *paths):
    out = git('log', '--first-parent', '--format=%h%x1f%s', f'{start}..{end}', '--', *[p for p in paths if p]).stdout
    res = []
    for l in filter(None, out.split('\n')):
        sha, subj = l.split('\x1f', 1)
        m = re.search(r'\(#(\d+)\)\s*$', subj)
        res.append({'sha': sha, 'pr': int(m[1]) if m else None, 'subject': subj[:100]})
    return res


def analyse(start, end, status, old, new, corpus_ids):
    old_text = show(start, old) if old else None
    new_text = show(end, new) if new else None
    e = {'status': status, 'old': old, 'new': new, 'area': area(new or old)}
    of, ob, ooff = split_fm(old_text or '')
    nf, nb, noff = split_fm(new_text or '')
    e['title'] = fm_dict(nf or of).get('title', '') or next(
        (l[2:].strip() for l in (nb or ob) if l.startswith('# ')), '')
    if status == 'A':
        e['kind'] = 'added'
        e['first_paragraph'] = first_paragraph(nb)
        e['headings'] = [h[2] for h in headings(nb) if h[1] == 2]
        return e, []
    if status == 'D':
        e['kind'] = 'removed'
        e['headings'] = [h[2] for h in headings(ob) if h[1] <= 3]
        return e, []
    oh, nh = headings(ob), headings(nb)
    sm = difflib.SequenceMatcher(None, [norm(l) for l in ob], [norm(l) for l in nb], autojunk=False)
    hunks = []
    for tag, i1, i2, j1, j2 in sm.get_opcodes():
        if tag == 'equal':
            continue
        o, n = ob[i1:i2], nb[j1:j2]
        if not any(l.strip() for l in o + n):
            continue
        hunks.append({'old_line': i1 + ooff + 1, 'new_line': j1 + noff + 1,
                      'section': anchor_at(nh, j1) if n else anchor_at(oh, i1), 'old': o, 'new': n})
    fm_changed = sorted(k for k in set(fm_dict(of)) | set(fm_dict(nf)) if fm_dict(of).get(k) != fm_dict(nf).get(k))
    if not hunks:
        e['kind'] = 'moved' if status == 'R' else ('frontmatter-only' if fm_changed else 'links-only')
        e['frontmatter_changed'] = fm_changed
        return e, []
    e['kind'] = 'changed'
    e['frontmatter_changed'] = fm_changed
    old_lines = [l for h in hunks for l in h['old']]
    new_lines = [l for h in hunks for l in h['new']]
    e['lines'] = {'removed': len([l for l in old_lines if l.strip()]), 'added': len([l for l in new_lines if l.strip()])}
    e['sections_changed'] = sorted({h['section'] for h in hunks if h['section']})
    ot, nt = {h[2] for h in oh}, {h[2] for h in nh}
    removed_h = [h for h in oh if h[2] not in nt]
    added_h = [h for h in nh if h[2] not in ot]
    renamed = []
    for h in list(removed_h):
        for g in added_h:
            if g[1] == h[1] and any(x['old_line'] - ooff - 1 <= h[0] < x['old_line'] - ooff - 1 + len(x['old'])
                                    and x['new_line'] - noff - 1 <= g[0] < x['new_line'] - noff - 1 + len(x['new']) for x in hunks):
                renamed.append({'old': h[2], 'old_anchor': h[3], 'new': g[2], 'new_anchor': g[3]})
                removed_h.remove(h)
                added_h.remove(g)
                break
    e['headings_removed'] = [{'text': h[2], 'anchor': h[3]} for h in removed_h]
    e['headings_added'] = [{'text': h[2], 'anchor': h[3]} for h in added_h]
    e['headings_renamed'] = renamed
    oid, nid = ids_in(ob), ids_in(nb)
    e['ids_removed'] = [{'id': i, 'gone': i not in corpus_ids} for i in sorted(ids_in(old_lines) & (oid - nid))]
    e['ids_added'] = sorted(ids_in(new_lines) & (nid - oid))
    orows, nrows = table_rows(old_lines), table_rows(new_lines)
    ofile, nfile = table_rows(ob), table_rows(nb)
    e['rows_changed'] = [{'key': k, 'old': orows[k][0][:300], 'new': nrows[k][0][:300]}
                         for k in sorted(set(orows) & set(nrows)) if norm(orows[k][0]) != norm(nrows[k][0])]
    e['rows_removed'] = [{'key': k, 'old': orows[k][0][:300]} for k in sorted(set(orows) - set(nfile))]
    e['rows_added'] = [{'key': k, 'new': nrows[k][0][:300]} for k in sorted(set(nrows) - set(ofile))]
    ov = set(VER.findall('\n'.join(old_lines))) - set(VER.findall('\n'.join(nb)))
    nv = set(VER.findall('\n'.join(new_lines))) - set(VER.findall('\n'.join(ob)))
    e['versions_gone'], e['versions_new'] = sorted(ov), sorted(nv)
    return e, hunks


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--work', required=True)
    a = ap.parse_args()
    w = json.load(open(os.path.join(a.work, 'window.json'), encoding='utf-8'))
    start, end = w['effective_start']['commit'], w['base']['commit']
    os.makedirs(os.path.join(a.work, 'diffs'), exist_ok=True)

    raw = git('diff', '-M30%', '--name-status', '-z', start, end, '--', 'docs_v2', 'docs/releases', 'sidebars-v2.js').stdout.split('\0')
    items, i = [], 0
    while i < len(raw) and raw[i]:
        st = raw[i]
        if st[0] in 'RC':
            items.append((st[0], raw[i + 1], raw[i + 2]))
            i += 3
        else:
            items.append((st[0], raw[i + 1] if st[0] == 'D' else None, raw[i + 1]))
            if st[0] == 'D':
                items[-1] = ('D', raw[i + 1], None)
            elif st[0] == 'A':
                items[-1] = ('A', None, raw[i + 1])
            else:
                items[-1] = (st[0], raw[i + 1], raw[i + 1])
            i += 2

    tree = read_tree(end, ['docs_v2', 'docs/releases'])
    corpus_ids = set()
    for path, text in tree.items():
        if section_name(path) not in TARGET_NAMES:
            corpus_ids |= ids_in(text.split('\n'))
    landing = landing_rows(tree.get(next((p for p in tree if re.match(r'docs_v2/\d+\.services/0\.index\.md$', p)), ''), ''))
    renamed_into = {os.path.dirname(n) for s, o, n in items if s == 'R' and n}

    entries, targets, other = [], [], {'images_added': 0, 'images_removed': 0, 'menu_changed': False, 'non_md': []}
    nid = 0
    for st, old, new in items:
        path = new or old
        if path == 'sidebars-v2.js':
            other['menu_changed'] = True
            continue
        if not path.endswith('.md'):
            if re.search(r'\.(png|jpe?g|gif|svg|webp)$', path, re.I):
                other['images_added' if st == 'A' else 'images_removed' if st == 'D' else 'images_added'] += 1 if st in 'AD' else 0
            else:
                other['non_md'].append(f'{st} {path}')
            continue
        is_target = section_name(path) in TARGET_NAMES
        e, hunks = analyse(start, end, st, old, new, corpus_ids)
        e['commits'] = commits_for(start, end, old, new)
        if is_target:
            targets.append({k: e.get(k) for k in ('status', 'kind', 'old', 'new', 'title', 'commits', 'headings_removed', 'headings_renamed', 'sections_changed')})
            continue
        if e['kind'] == 'added':
            m = re.match(r'docs_v2/\d+\.services/(\d+\.[\w-]+)/0\.index\.md$', path)
            if m and os.path.dirname(path) not in renamed_into:
                name, desc = landing.get(m[1], (e['title'], ''))
                e['new_service'] = {'folder': m[1], 'name': name, 'landing_description': desc}
        nid += 1
        e['id'] = nid
        if hunks:
            fn = os.path.join(a.work, 'diffs', f'{nid:03d}.diff')
            with open(fn, 'w', encoding='utf-8') as f:
                f.write(f'# {e["status"]} {old or ""} -> {new or ""}\n')
                f.write('# commits: ' + '; '.join(f'{c["sha"]} {c["subject"]}' for c in e['commits']) + '\n')
                for h in hunks:
                    f.write(f'@@ old L{h["old_line"]} new L{h["new_line"]} section #{h["section"]}\n')
                    f.writelines(f'-{l}\n' for l in h['old'])
                    f.writelines(f'+{l}\n' for l in h['new'])
            e['diff_file'] = fn
        entries.append(e)

    # A removed page and an added page with the same title in the same area were rewritten in a
    # new place: rename detection misses them when most of the text changed.
    added = {(e['area'], e['title']): e for e in entries if e['kind'] == 'added' and e['title']}
    for e in entries:
        if e['kind'] == 'removed' and (e['area'], e['title']) in added:
            twin = added[(e['area'], e['title'])]
            twin['kind'], twin['old'] = 'rewritten', e['old']
            e['kind'], e['rewritten_as'] = 'rewritten-away', twin['new']
    entries.sort(key=lambda e: (area_order(e['area']), e.get('new') or e.get('old')))
    out = {'window': {'start': start, 'end': end, 'base_ref': w['base_ref']}, 'entries': entries,
           'target_changes': targets, 'other': other}
    json.dump(out, open(os.path.join(a.work, 'changes.json'), 'w', encoding='utf-8'), indent=1)

    kinds = {}
    for e in entries:
        kinds[e['kind']] = kinds.get(e['kind'], 0) + 1
    md = [f'# Source changes {start[:10]}..{end[:10]}', '',
          'Counts: ' + ', '.join(f'{k} {v}' for k, v in sorted(kinds.items())) +
          f'; target pages changed in the window: {len(targets)}', '']
    QUIET = ('links-only', 'frontmatter-only', 'moved', 'rewritten-away')
    quiet = [e for e in entries if e['kind'] in QUIET]
    cur = None
    for e in entries:
        if e['kind'] in QUIET:
            continue
        if e['area'] != cur:
            cur = e['area']
            md += [f'## {cur}', '']
        prs = ', '.join(sorted({f'#{c["pr"]}' if c['pr'] else c['sha'] for c in e['commits']}))
        md.append(f'### [{e["id"]}] {e["kind"]}: {e.get("new") or e.get("old")}')
        if e['status'] == 'R':
            md.append(f'- moved from `{e["old"]}`')
        md.append(f'- title: {e["title"]}; commits: {prs}')
        if e.get('new_service'):
            ns = e['new_service']
            md.append(f'- **new service** {ns["name"]} (`{ns["folder"]}`): {ns["landing_description"]}')
        if e['kind'] == 'rewritten':
            md.append(f'- rewritten from `{e["old"]}` (same title, most of the text changed: read both)')
        if e['kind'] in ('added', 'rewritten'):
            md.append(f'- first paragraph: {e.get("first_paragraph", "")}')
            md.append(f'- H2: {"; ".join(e.get("headings", []))}')
        if e['kind'] == 'removed':
            md.append(f'- headings: {"; ".join(e.get("headings", []))}')
        if e['kind'] == 'changed':
            md.append(f'- lines: -{e["lines"]["removed"]} +{e["lines"]["added"]}; sections: {", ".join("#" + s for s in e["sections_changed"])}; diff: `{e["diff_file"]}`')
            for k, label in (('headings_removed', 'headings removed'), ('headings_added', 'headings added')):
                if e[k]:
                    md.append(f'- {label}: ' + '; '.join(f'{h["text"]} (#{h["anchor"]})' for h in e[k]))
            if e['headings_renamed']:
                md.append('- headings renamed: ' + '; '.join(f'#{h["old_anchor"]} -> #{h["new_anchor"]}' for h in e['headings_renamed']))
            if e['ids_removed']:
                md.append('- identifiers removed: ' + ', '.join(f'`{x["id"]}`' + (' (gone)' if x['gone'] else '') for x in e['ids_removed'][:40]))
            if e['ids_added']:
                md.append('- identifiers added: ' + ', '.join(f'`{x}`' for x in e['ids_added'][:40]))
            for r in e['rows_changed'][:15]:
                md.append(f'- row changed `{r["key"]}`:\n  - old: {r["old"][:220]}\n  - new: {r["new"][:220]}')
            for r in e['rows_removed'][:15]:
                md.append(f'- row removed `{r["key"]}`: {r["old"][:200]}')
            if e['rows_added']:
                md.append('- rows added: ' + ', '.join(f'`{r["key"]}`' for r in e['rows_added'][:30]))
            if e['versions_gone'] or e['versions_new']:
                md.append(f'- versions gone: {", ".join(e["versions_gone"]) or "none"}; new: {", ".join(e["versions_new"]) or "none"}')
        md.append('')
    md += ['## Pages with no content change', '',
           f'{len(quiet)} pages changed only links, whitespace, or frontmatter, or moved without a content change:', '']
    md += [f'- {e["kind"]}: `{e.get("new") or e.get("old")}`' + (f' (from `{e["old"]}`)' if e['status'] == 'R' else '')
           + (f' (now `{e["rewritten_as"]}`)' if e.get('rewritten_as') else '') for e in quiet]
    md += ['', '## Target pages changed in the window (context, not sources)', '']
    for t in targets:
        prs = ', '.join(sorted({f'#{c["pr"]}' if c['pr'] else c['sha'] for c in t['commits']}))
        extra = ''
        if t.get('headings_removed'):
            extra = '; headings removed: ' + ', '.join('#' + h['anchor'] for h in t['headings_removed'])
        md.append(f'- {t["kind"]}: `{t.get("new") or t.get("old")}` ({prs}){extra}')
    md += ['', '## Other', '', f'- images added or removed: {other["images_added"]} / {other["images_removed"]}',
           f'- sidebars-v2.js changed: {other["menu_changed"]}'] + [f'- {x}' for x in other['non_md']]
    open(os.path.join(a.work, 'changes.md'), 'w', encoding='utf-8').write('\n'.join(md) + '\n')
    print(f'{len(entries)} source pages: ' + ', '.join(f'{k} {v}' for k, v in sorted(kinds.items())))
    print(f'{len(targets)} target pages changed in the window (context)')
    print(f'wrote {os.path.join(a.work, "changes.md")} and {os.path.join(a.work, "changes.json")}')


if __name__ == '__main__':
    main()
