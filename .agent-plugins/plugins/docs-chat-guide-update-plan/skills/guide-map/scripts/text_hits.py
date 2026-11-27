"""Find the guide lines that quote UI text the reviewed releases changed or removed.

Usage (from the root of the epam/ai-dial checkout):
  python3 -I text_hits.py --inventory <WORK>/guide.json --windows <WORK>/windows.json \
      --changes <WORK>/research/<REPO>/ui_changes.json [--changes ...] --out <WORK>/text_hits.json

Takes from each ui_changes.py output, window by window:
  changed      a key whose text changed: the old text is searched, the new text is the replacement
  removed      a key that is gone, when no key of the target shows its text any more
  text_gone    other text that no key of the target shows any more
  stage        a string literal removed from a stage or step name (quickapps-backend)
A window covers the pages whose last_verified is its start date; in `since` mode it covers every
page. The Quick Apps repositories only reach the sections in SCOPE below (a heading and everything
under it); when a heading isn't found, the whole page is searched and a warning is printed. Placeholders such as {{count}} split a text into parts, and each part of 4 characters or more
is searched. Texts shorter than 12 characters are matched case-sensitively.

Each hit has a strength:
  strong  the text is a whole **bold** label, `code`, a quotation, an image's alt text, or a heading
  weak    the text is somewhere in a sentence; texts under 5 characters are not reported as weak
Output (--out): {"hits": [{page, line, strength, where, kind, repo, window, key, old, new, first,
date, context}], "by_page": {page: count}}. Every hit is a lead: read the line before you put it in
the work order.

Stdout: the hits per page, strong first. It only reads: it never edits, commits, pushes, or writes
to GitHub. Exit 0 when the run can go on; exit 1 with a "STOP: <reason>" line when an input file
can't be read.
"""
import argparse
import json
import re
import sys

PLACEHOLDER = re.compile(r'\{\{[^}]*\}\}|\{[a-zA-Z_]+\}|%s|%d')
LITERAL = re.compile(r'f?"([^"]{3,})"|f?\'([^\']{3,})\'')
FENCE = re.compile(r'^\s*(```|~~~)')
SCOPE = {
    'epam/ai-dial-quickapps-frontend': [('3.catalog/2.agents.md', 'Build a Quick App')],
    'epam/ai-dial-quickapps-backend': [('3.catalog/2.agents.md', 'Build a Quick App'),
                                       ('1.conversations.md', 'Stages')],
}


def load(path):
    try:
        return json.load(open(path, encoding='utf-8'))
    except (OSError, ValueError) as e:
        print(f'STOP: can\'t read {path}: {e}')
        sys.exit(1)


def candidates(ch):
    """Yield (kind, key, old, new, first, date) for one window of ui_changes.py output."""
    s = ch.get('strings') or {}
    for x in s.get('changed', []):
        yield 'changed', x['key'], x['old'], x['new'], x['first'], x['date']
    for x in s.get('removed', []):
        if x['value'] in {v['value'] for v in s.get('values_removed', [])}:
            yield 'removed', x['key'], x['value'], None, x['first'], x['date']
    keyed = {x['value'] for x in s.get('removed', [])} | {x['old'] for x in s.get('changed', [])}
    for x in s.get('values_removed', []):
        if x['value'] not in keyed:
            yield 'text_gone', ', '.join(x['keys']), x['value'], None, None, None
    for x in ch.get('stage_text', []):
        if x['sign'] != '-':
            continue
        m = LITERAL.search(x['text'])
        if m:
            yield 'stage', x['file'], (m.group(1) or m.group(2)).strip(), None, None, None


def parts(text):
    return [p.strip(' .,:;!?') for p in PLACEHOLDER.split(text) if len(p.strip(' .,:;!?')) >= 4]


SPANS = [('alt', re.compile(r'!\[[^\]]*\]')), ('bold', re.compile(r'\*\*(?!\s).+?\*\*')),
         ('code', re.compile(r'`[^`]+`')), ('quote', re.compile(r'"[^"]+"|“[^”]+”'))]


def strength(line, start, end, is_heading):
    if is_heading:
        return 'strong', 'heading'
    for where, rx in SPANS:
        for m in rx.finditer(line):
            if m.start() <= start and end <= m.end():
                return 'strong', where
    return 'weak', 'text'


def page_lines(path):
    lines = open(path, encoding='utf-8').read().split('\n')
    out, in_code, fm = [], False, lines[:1] == ['---']
    for n, line in enumerate(lines, 1):
        if fm:
            if n > 1 and line.strip() == '---':
                fm = False
            continue
        if FENCE.match(line):
            in_code = not in_code
        out.append((n, line, in_code))
    return out


def line_ranges(inv, repo, root):
    """{page: [(first, last)]} the repository's text may reach, or None for whole pages."""
    if repo not in SCOPE:
        return None
    pages = {p['file']: p for p in inv['pages']}
    out = {}
    for rel, heading in SCOPE[repo]:
        page = pages.get(f'{root}/{rel}')
        if not page:
            print(f'warning   {root}/{rel} not found; the scope of {repo} skips it')
            continue
        hs = page['headings']
        idx = next((i for i, h in enumerate(hs) if h['text'] == heading), None)
        if idx is None:
            print(f'warning   heading "{heading}" not found in {page["file"]}; searching the whole page')
            out.setdefault(page['file'], []).append((1, page['lines']))
            continue
        end = next((h['line'] - 1 for h in hs[idx + 1:] if h['level'] <= hs[idx]['level']), page['lines'])
        out.setdefault(page['file'], []).append((hs[idx]['line'], end))
    return out


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--inventory', required=True)
    ap.add_argument('--windows', required=True)
    ap.add_argument('--changes', action='append', required=True)
    ap.add_argument('--out', required=True)
    a = ap.parse_args()
    inv, win = load(a.inventory), load(a.windows)
    all_pages = [p['file'] for p in inv['pages']]
    texts = {f: page_lines(f) for f in all_pages}

    hits, seen = [], set()
    for path in a.changes:
        ch = load(path)
        ranges = line_ranges(inv, ch.get('repo'), inv['root'])
        for start, c in ch.get('windows', {}).items():
            pages = all_pages if win.get('mode') == 'since' or start == 'custom' else \
                win.get('pages_by_date', {}).get(start, [])
            if ranges is not None:
                pages = [p for p in pages if p in ranges]
            for kind, key, old, new, first, date in candidates(c):
                for part in parts(old or ''):
                    flags = 0 if len(part) < 12 else re.I
                    pat = re.compile(r'(?<![\w-])' + re.escape(part) + r'(?![\w-])', flags)
                    for page in pages:
                        for n, line, in_code in texts[page]:
                            if ranges is not None and not any(a0 <= n <= b0 for a0, b0 in ranges[page]):
                                continue
                            for m in pat.finditer(line):
                                st, where = ('strong', 'code') if in_code else \
                                    strength(line, m.start(), m.end(), line.lstrip().startswith('#'))
                                if st == 'weak' and len(part) < 5:
                                    continue
                                k = (page, n, part, ch.get('repo'))
                                if k in seen:
                                    continue
                                seen.add(k)
                                hits.append({'page': page, 'line': n, 'strength': st, 'where': where,
                                             'kind': kind, 'repo': ch.get('repo'), 'window': start,
                                             'key': key, 'old': old, 'match': part, 'new': new,
                                             'first': first, 'date': date, 'context': line.strip()[:240]})
    hits.sort(key=lambda h: (all_pages.index(h['page']), h['line']))
    by_page = {}
    for h in hits:
        by_page[h['page']] = by_page.get(h['page'], 0) + 1
    with open(a.out, 'w', encoding='utf-8') as f:
        json.dump({'hits': hits, 'by_page': by_page}, f, indent=2, ensure_ascii=False)
    for page in all_pages:
        ph = [h for h in hits if h['page'] == page]
        if not ph:
            continue
        print(f'{page}  {len(ph)} hit(s)')
        for h in sorted(ph, key=lambda h: (h['strength'] != 'strong', h['line'])):
            repl = f' -> "{h["new"]}"' if h['new'] is not None else ' (gone)'
            print(f"  {h['line']:>4} {h['strength']:<6} {h['where']:<7} \"{h['match']}\"{repl}  "
                  f"[{h['repo'].split('/')[-1]} {h['first'] or '?'}]")
    print(f'{len(hits)} hits on {len(by_page)} pages')
    print(f'wrote {a.out}')


if __name__ == '__main__':
    main()
