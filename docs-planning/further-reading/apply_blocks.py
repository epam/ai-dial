#!/usr/bin/env python3
"""
One-off tool: normalise the closing link blocks of docs_v2 pages.

  * removes `## Next steps`, `## Where to go next`, `## Related tasks`, `## Related pages`,
    `## Related troubleshooting` and any old `## Further reading` from every page
    (generated `8.reference/changelog/` pages are skipped);
  * on every non-index page listed in the map, appends ONE `## Further reading` block
    (2-6 bullets) built from the map;
  * `0.index.md` pages and pages passed with --no-fr get no closing block.
  Nothing above the first closing heading is touched.

Usage (repo root, Python 3.9+, standard library only):
  python3 -I apply_blocks.py --root docs_v2 --map map.txt --desc desc.tsv --labels labels.tsv \
      --no-fr overview [--list-missing missing.tsv] [--write]
  Without --write it is a dry run. Exit code 1 while anything is missing or wrong.

map.txt     <page-id> => <target>; <target>; ...        (2-6 targets, in display order)
            target = <route-id> | +<route-id> | EXT:<substring of an external URL in the page's old blocks>
            `+` is informational only ("this link was not in the page's old blocks").
desc.tsv    <page-id> TAB <target-id> TAB <description> [TAB <link text>]
            Overrides the old description (and, with a 4th column, the link text) of that link.
labels.tsv  <target-id> TAB <link text>
            Required whenever the link text would otherwise be a page title shared by several
            docs_v2 pages (for example "Models"); used for every such link to that target.

Link text  : 4th column of desc.tsv > old link text (link reused from the old blocks) > target title;
             if the result equals a shared title, labels.tsv replaces it.
Description: desc.tsv > old description. Old anchors (`page.md#section`) are kept.
"""
import argparse, collections, os, posixpath, re, sys

CLOSING = {'next steps', 'where to go next', 'further reading', 'related tasks',
           'related pages', 'related troubleshooting'}
HEAD = re.compile(r'^(#{1,6})\s+(.*?)\s*$')
BULLET = re.compile(r'^\s{0,3}[-*]\s+')
LINK = re.compile(r'\[([^\]]+)\]\(([^)\s]+)\)')
FRONT = re.compile(r'^---\n(.*?)\n---\n', re.S)


def strip_prefix(seg):
    return re.sub(r'^\d+\.', '', seg)


def route_of(path, root):
    rel = os.path.relpath(path, root)[:-3]
    return '/'.join(strip_prefix(s) for s in rel.split(os.sep))


def collect_files(root):
    out = []
    for dp, _, fn in os.walk(root):
        for f in fn:
            if f.endswith('.md'):
                out.append(os.path.join(dp, f))
    return sorted(out)


def is_generated(path):
    return '/changelog/' in path.replace(os.sep, '/')


_titles = {}


def title_of(path):
    if path not in _titles:
        m = FRONT.match(open(path, encoding='utf-8').read())
        t = re.search(r'^title:\s*(.*)$', m.group(1), re.M) if m else None
        if not t:
            raise SystemExit(f'no title in {path}')
        _titles[path] = t.group(1).strip().strip('"').strip("'")
    return _titles[path]


def resolve(src, href, root, route2file, fileset):
    """Return ('doc', path) | ('ext', url) | ('missing', href) | ('self', None)."""
    if re.match(r'^[a-z][a-z0-9+.-]*:', href):
        return ('ext', href)
    h = href.split('#')[0]
    if not h:
        return ('self', None)
    if h.endswith('.md'):
        t = posixpath.normpath(posixpath.join(posixpath.dirname(src), h))
        return ('doc', t) if t in fileset else ('missing', href)
    if h.startswith('/'):
        r = h.lstrip('/')
        r = r[3:] if r.startswith('v2/') else r
    else:
        r = posixpath.normpath(posixpath.join(posixpath.dirname(route_of(src, root)), h))
    return ('doc', route2file[r]) if r in route2file else ('missing', href)


def parse_blocks(lines):
    """Return [(name, start, end)] for level-2 closing headings (code fences ignored)."""
    heads, in_code = [], False
    for i, l in enumerate(lines):
        if l.startswith('```') or l.startswith('~~~'):
            in_code = not in_code
        if in_code:
            continue
        m = HEAD.match(l)
        if m:
            heads.append((i, len(m.group(1)), m.group(2)))
    blocks = []
    for k, (i, lvl, name) in enumerate(heads):
        if lvl == 2 and name.lower() in CLOSING:
            end = len(lines)
            for j in range(k + 1, len(heads)):
                if heads[j][1] <= 2:
                    end = heads[j][0]
                    break
            blocks.append((name, i, end))
    return blocks


def bullets_of(lines, start, end):
    """Bullet items of a block body; indented continuation lines are joined, other prose is dropped."""
    items, cur = [], None
    for l in lines[start + 1:end]:
        if BULLET.match(l):
            if cur is not None:
                items.append(cur)
            cur = BULLET.sub('', l).strip()
        elif l.strip() and cur is not None and l.startswith((' ', '\t')):
            cur += ' ' + l.strip()
    if cur is not None:
        items.append(cur)
    return items


def parse_item(item):
    """[(text, href, description|None)]; only a single-link bullet carries a reusable description."""
    ms = list(LINK.finditer(item))
    if not ms:
        return []
    if len(ms) > 1:
        return [(m.group(1), m.group(2), None) for m in ms]
    m = ms[0]
    if item[:m.start()].strip('* '):  # sentence-style bullet ("**Do X:** use [Y](...) to ..."): no reusable description
        return [(m.group(1), m.group(2), None)]
    rest = item[m.end():].lstrip('*').strip()
    rest = re.sub(r'^[—–:-]\s*', '', rest).strip().rstrip('.').strip()
    return [(m.group(1), m.group(2), rest or None)]


def read_tsv(path, ncols_min, ncols_max):
    rows = []
    if not path:
        return rows
    for n, line in enumerate(open(path, encoding='utf-8'), 1):
        line = line.rstrip('\n')
        if not line.strip() or line.startswith('#'):
            continue
        cols = line.split('\t')
        if not ncols_min <= len(cols) <= ncols_max:
            raise SystemExit(f'{path}:{n}: expected {ncols_min}-{ncols_max} tab-separated columns, got {len(cols)}')
        rows.append([c.strip() for c in cols])
    return rows


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--root', default='docs_v2')
    ap.add_argument('--map', required=True)
    ap.add_argument('--desc', default=None)
    ap.add_argument('--labels', default=None)
    ap.add_argument('--no-fr', nargs='*', default=[], help='page ids that never get Further reading')
    ap.add_argument('--list-missing', help='write page TAB target TAB target title TAB what is missing')
    ap.add_argument('--write', action='store_true')
    a = ap.parse_args()

    allfiles = collect_files(a.root)
    fileset = set(allfiles)
    files = [f for f in allfiles if not is_generated(f)]
    route2file = {route_of(f, a.root): f for f in allfiles}
    title_count = collections.Counter(title_of(f).lower() for f in files)
    shared = {t for t, n in title_count.items() if n > 1}

    fmap = {}
    for line in open(a.map, encoding='utf-8'):
        line = line.strip()
        if not line or line.startswith('#'):
            continue
        k, v = line.split(' => ')
        fmap[k.strip()] = [x.strip() for x in v.split(';') if x.strip()]
    desc, text_override = {}, {}
    for row in read_tsv(a.desc, 3, 4):
        desc[(row[0], row[1])] = row[2].rstrip('.')
        if len(row) == 4 and row[3]:
            text_override[(row[0], row[1])] = row[3]
    labels = {row[0]: row[1] for row in read_tsv(a.labels, 2, 2)}

    errors, warnings, plan, missing = [], [], {}, []
    for f in files:
        pid = route_of(f, a.root)
        no_fr = os.path.basename(f) == '0.index.md' or pid in a.no_fr
        lines = open(f, encoding='utf-8').read().split('\n')
        blocks = parse_blocks(lines)
        if blocks:  # closing blocks must be the tail of the file
            first = min(b[1] for b in blocks)
            covered = set()
            for _, s, e in blocks:
                covered.update(range(s, e))
            for i in range(first, len(lines)):
                if i not in covered and lines[i].strip():
                    errors.append(f'{pid}: content after closing blocks at line {i + 1}: {lines[i][:60]!r}')
                    break
        old_doc, old_ext = {}, {}
        for _, s, e in ([] if no_fr else blocks):
            for item in bullets_of(lines, s, e):
                for text, href, d in parse_item(item):
                    kind, tgt = resolve(f, href, a.root, route2file, fileset)
                    if kind == 'doc':
                        anchor = href.split('#', 1)[1] if '#' in href else ''
                        if tgt not in old_doc or (old_doc[tgt][1] is None and d):
                            old_doc[tgt] = (text, d, anchor)
                    elif kind == 'ext':
                        if tgt not in old_ext or (old_ext[tgt][1] is None and d):
                            old_ext[tgt] = (text, d)
                    elif kind == 'missing':
                        warnings.append(f'{pid}: unresolved old link {href}')
        bullets = []
        if not no_fr:
            if pid not in fmap:
                errors.append(f'{pid}: not in map and not an index page')
            else:
                if not 2 <= len(fmap[pid]) <= 6:
                    errors.append(f'{pid}: {len(fmap[pid])} links in the map (need 2-6)')
                seen_text = set()
                for tok in fmap[pid]:
                    if tok.startswith('EXT:'):
                        m = [u for u in old_ext if tok[4:] in u]
                        if len(m) != 1:
                            errors.append(f'{pid}: {tok} matches {len(m)} old external links')
                            continue
                        text, d = old_ext[m[0]]
                        if not d:
                            errors.append(f'{pid}: old external link {m[0]} has no description')
                            continue
                        bullets.append(f'- [{text}]({m[0]}) — {d}')
                        seen_text.add(text.lower())
                        continue
                    tid = tok.lstrip('+')
                    tf = route2file.get(tid)
                    if tf is None or is_generated(tf) and tid != 'reference/changelog/index':
                        errors.append(f'{pid}: unknown or generated target {tid}')
                        continue
                    rel = os.path.relpath(tf, os.path.dirname(f)).replace(os.sep, '/')
                    if not rel.startswith('.'):
                        rel = './' + rel
                    text, d, anchor = old_doc.get(tf, (title_of(tf), None, ''))
                    d = desc.get((pid, tid)) or d
                    text = text_override.get((pid, tid), text)
                    no_label = False
                    if text.lower() in shared:
                        if tid in labels:
                            text = labels[tid]
                        else:
                            missing.append((pid, tid, title_of(tf), 'label'))
                            no_label = True
                    if not d:
                        missing.append((pid, tid, title_of(tf), 'description'))
                        continue
                    if no_label:
                        continue
                    if text.lower() in seen_text:
                        errors.append(f'{pid}: link text "{text}" used twice in one block')
                    seen_text.add(text.lower())
                    bullets.append(f'- [{text}]({rel}{"#" + anchor if anchor else ""}) — {d}')
        plan[f] = (lines, blocks, bullets)

    if a.list_missing:
        with open(a.list_missing, 'w', encoding='utf-8') as fh:
            for row in missing:
                fh.write('\t'.join(row) + '\n')
    need_d = sum(1 for r in missing if r[3] == 'description')
    need_l = sum(1 for r in missing if r[3] == 'label')
    print(f'pages scanned: {len(files)}   errors: {len(errors)}   warnings: {len(warnings)}   '
          f'missing descriptions: {need_d}   missing labels: {need_l}')
    for w in warnings:
        print('  WARN', w)
    for e in errors:
        print('  ERROR', e)
    if errors or missing:
        sys.exit(1)

    changed = fr = 0
    for f, (lines, blocks, bullets) in plan.items():
        if not blocks and not bullets:
            continue
        keep = lines[:min(b[1] for b in blocks)] if blocks else list(lines)
        while keep and not keep[-1].strip():
            keep.pop()
        if bullets:
            keep += ['', '## Further reading', ''] + bullets
            fr += 1
        changed += 1
        if a.write:
            open(f, 'w', encoding='utf-8').write('\n'.join(keep) + '\n')
    print(f'files rewritten: {changed}   with Further reading: {fr}' + ('' if a.write else '   (dry run, nothing written)'))


if __name__ == '__main__':
    main()
