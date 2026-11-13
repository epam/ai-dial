#!/usr/bin/env python3
"""
Post-change check for docs_v2 closing blocks. Exit code 1 on any violation.
Usage (repo root):  python3 -I verify_blocks.py --root docs_v2 [--overview 1.overview.md]

Rules (V = verifier rule; the relevance rubric in PLAN.md is R1-R5)
  V1  no `## Next steps`, `## Where to go next`, `## Related tasks|pages|troubleshooting` anywhere
  V2  0.index.md pages, the overview page and changelog/index.md: no `## Further reading`
  V3  every other page: at most ONE `## Further reading`, and it is the LAST section of the file
  V4  Further reading has 2-6 bullets, each exactly `- [text](target) — description`
  V5  every internal link is relative, ends in .md (optional #anchor), resolves to an existing docs_v2
      file, is not the page itself, is not repeated, is not the page's own folder hub (0.index.md in the
      same directory), and is not a generated changelog sub-page
  V6  at least 2 bullets are internal links
  V7  no trailing period on a description; the file ends with exactly one newline
  V8  a description must not read like a next step (next / now / continue / start here /
      this page|guide|tutorial) and must not be a placeholder
  V9  link texts are unique within the block and are not a bare title that several docs_v2 pages share
"""
import argparse, collections, os, posixpath, re, sys

BAD = {'next steps', 'where to go next', 'related tasks', 'related pages', 'related troubleshooting'}
HEAD = re.compile(r'^(#{1,6})\s+(.*?)\s*$')
BUL = re.compile(r'^- \[([^\]]+)\]\(([^)\s]+)\) — (\S.*)$')
NEXTISH = re.compile(r"\bnext\b(?!\.js)|\bnow\b|\bcontinue\b|\bstart here\b|\bthis (page|guide|tutorial)\b|placeholder|neutral text", re.I)


def title_of(path):
    m = re.search(r'^title:\s*(.*)$', open(path, encoding='utf-8').read(), re.M)
    return m.group(1).strip().strip('"').strip("'") if m else ''


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--root', default='docs_v2')
    ap.add_argument('--overview', default='1.overview.md')
    a = ap.parse_args()
    files = []
    for dp, _, fn in os.walk(a.root):
        for f in fn:
            if f.endswith('.md'):
                files.append(os.path.join(dp, f))
    fset = set(files)
    gen = lambda p: '/changelog/' in p.replace(os.sep, '/')
    tcount = collections.Counter(title_of(p).lower() for p in files if not gen(p))
    shared = {t for t, n in tcount.items() if n > 1}
    bad, n_fr, n_pages, hist = [], 0, 0, collections.Counter()
    for f in sorted(files):
        if gen(f) and os.path.basename(f) != 'index.md':
            continue
        n_pages += 1
        txt = open(f, encoding='utf-8').read()
        lines = txt.split('\n')
        rel = os.path.relpath(f, a.root)
        is_hub = os.path.basename(f) == '0.index.md' or rel == a.overview or gen(f)
        heads, in_code = [], False
        for i, l in enumerate(lines):
            if l.startswith('```') or l.startswith('~~~'):
                in_code = not in_code
            if in_code:
                continue
            m = HEAD.match(l)
            if m:
                heads.append((i, len(m.group(1)), m.group(2)))
        for i, lvl, name in heads:
            if name.lower() in BAD:
                bad.append(f'{rel}:{i + 1} V1 forbidden heading "{name}"')
        frs = [(k, h) for k, h in enumerate(heads) if h[1] == 2 and h[2].lower() == 'further reading']
        if is_hub:
            if frs:
                bad.append(f'{rel} V2 index/overview page has Further reading')
        else:
            if len(frs) > 1:
                bad.append(f'{rel} V3 several Further reading blocks')
            for k, (i, lvl, name) in frs:
                if any(h[1] <= 2 for h in heads[k + 1:]):
                    bad.append(f'{rel} V3 Further reading is not the last section')
                body = [l for l in lines[i + 1:] if l.strip()]
                seen, texts, internal = set(), set(), 0
                if not 2 <= len(body) <= 6:
                    bad.append(f'{rel} V4 {len(body)} bullets (need 2-6)')
                hist[len(body)] += 1
                for l in body:
                    m = BUL.match(l)
                    if not m:
                        bad.append(f'{rel} V4 malformed bullet: {l[:90]!r}')
                        continue
                    text, href, d = m.groups()
                    if d.rstrip().endswith('.'):
                        bad.append(f'{rel} V7 trailing period: {l[:90]!r}')
                    if NEXTISH.search(d):
                        bad.append(f'{rel} V8 description reads like a next step: {l[:110]!r}')
                    if text.lower() in texts:
                        bad.append(f'{rel} V9 link text used twice: "{text}"')
                    texts.add(text.lower())
                    if text.lower() in shared:
                        bad.append(f'{rel} V9 ambiguous link text (shared title): "{text}"')
                    if href in seen:
                        bad.append(f'{rel} V5 duplicate link {href}')
                    seen.add(href)
                    if re.match(r'^https?://', href):
                        continue
                    if href.startswith('/') or not href.split('#')[0].endswith('.md'):
                        bad.append(f'{rel} V5 internal link must be relative and end with .md: {href}')
                        continue
                    tgt = posixpath.normpath(posixpath.join(posixpath.dirname(f), href.split('#')[0]))
                    if tgt not in fset:
                        bad.append(f'{rel} V5 broken link {href}')
                        continue
                    internal += 1
                    if tgt == f:
                        bad.append(f'{rel} V5 self link')
                    if os.path.basename(tgt) == '0.index.md' and os.path.dirname(tgt) == os.path.dirname(f):
                        bad.append(f'{rel} V5 links its own folder hub {href}')
                    if gen(tgt) and os.path.basename(tgt) != 'index.md':
                        bad.append(f'{rel} V5 links a generated changelog sub-page {href}')
                if internal < 2:
                    bad.append(f'{rel} V6 only {internal} internal links')
                n_fr += 1
        if not txt.endswith('\n') or txt.endswith('\n\n'):
            bad.append(f'{rel} V7 file must end with exactly one newline')
    print(f'pages checked: {n_pages}   pages with Further reading: {n_fr}   '
          f'links per block: {dict(sorted(hist.items()))}   violations: {len(bad)}')
    for b in bad:
        print('  ', b)
    sys.exit(1 if bad else 0)


if __name__ == '__main__':
    main()
