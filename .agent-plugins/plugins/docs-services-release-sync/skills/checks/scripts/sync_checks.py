#!/usr/bin/env python3
"""Scope, frontmatter, and style checks for a DIAL service docs sync.

Usage (from the root of the epam/ai-dial checkout):
  python3 -I sync_checks.py [--base BASE] --service docs_v2/7.services/<N>.<service>/ \
      [--service ...] [--today YYYY-MM-DD]

BASE defaults to origin/development, or to the local development branch when the checkout
has no origin. Compares the working tree (committed or not, plus untracked files under
docs_v2/) with BASE.
  scope        every changed path is in a synced service folder, an allowed related section,
               or sidebars-v2.js when a page was added or removed
  frontmatter  existing pages change only last_verified; service pages carry --today;
               related pages keep their date; new pages have every required field
  style        only on added lines: banned words, closing headings, ::: blocks on a page that had
               none, other ::: types or bold labels than note/tip/warning (:::info only in 0.index.md),
               absolute or site links, MDX hazards, fences without a language, deep headings (errors);
               bold labels on a ::: page, branch-pinned GitHub links, localhost in code, long
               sentences, version prose (warnings)
Exit code 1 when any error is found.
"""
import argparse
import os
import re
import subprocess
import sys
from datetime import date

RELATED = ('docs_v2/2.understand-dial/', 'docs_v2/3.connecting-to-dial/',
           'docs_v2/4.building-with-dial/', 'docs_v2/5.operating-dial/', 'docs_v2/7.services/')
REQUIRED = {
    'title': None,
    'type': {'tutorial', 'how-to', 'reference', 'explanation', 'landing'},
    'persona': {'app-dev', 'devops', 'admin', 'evaluator', 'architect', 'end-user', 'all'},
    'component': {'core', 'chat', 'admin', 'sdk', 'adapters', 'helm', 'platform', 'rag'},
    'last_verified': None,
    'owner': None,
}
BANNED = re.compile(r'\b(simply|just|easy|easily|obviously|please note|it should be noted|click here|'
                    r'our product|ai-powered|cutting-edge|best-in-class)\b', re.I)
CLOSING = re.compile(r'^#{2,6}\s+(next steps|related\b.*|see also|where to go next)\s*$', re.I)
VERSION_PROSE = re.compile(r'(checked against \S*\d|version scope|\bnew in \d|\bsince (version )?\d+\.\d+|'
                           r'first (released|introduced) in|\bas of \d+\.\d+)', re.I)
BRANCH_LINK = re.compile(r'https://github\.com/epam/[\w.-]+/(?:blob|tree)/(main|master|development|develop)/')
FENCE = re.compile(r'^\s*(```|~~~)\s*(\S*)')
ADMONITION = re.compile(r'^:::\s*(\w+)')
COLON_KINDS = ('note', 'tip', 'warning')
BOLD_LABEL = re.compile(r'^\*\*(Note|Tip|Warning|Important|Deprecated|Caution|Danger|Info)\*\*$')


def git(*args):
    return subprocess.run(['git', *args], capture_output=True, text=True)


def frontmatter(text):
    data, lines = {}, text.split('\n')
    if lines and lines[0].strip() == '---':
        for line in lines[1:]:
            if line.strip() == '---':
                break
            if ':' in line and not line.startswith((' ', '\t', '#')):
                k, _, v = line.partition(':')
                data[k.strip()] = v.strip()
    return data


def changes(base):
    out = []
    res = git('diff', '--name-status', '-M', base, '--')
    if res.returncode != 0:
        sys.exit(f'git diff failed: {res.stderr.strip()}')
    for line in res.stdout.splitlines():
        parts = line.split('\t')
        status = parts[0][0]
        if status == 'R':
            out.append(('R', parts[2], parts[1]))
        else:
            out.append((status, parts[1], parts[1]))
    for path in git('ls-files', '--others', '--exclude-standard', '--', 'docs_v2', 'sidebars-v2.js').stdout.split():
        out.append(('A', path, None))
    return out


def added_lines(base, path, status):
    if status == 'A':
        return None  # every line is new
    res = git('diff', '-U0', base, '--', path)
    nums = set()
    for m in re.finditer(r'^@@ -\S+ \+(\d+)(?:,(\d+))? @@', res.stdout, re.M):
        start, count = int(m[1]), int(m[2] or 1)
        nums.update(range(start, start + count))
    return nums


def prose_only(line):
    line = re.sub(r'`[^`]*`', '', line)
    line = re.sub(r'\]\([^)]*\)', ']', line)
    return re.sub(r'https?://\S+', '', line)


def admonition_forms(text):
    """Which admonition forms a page uses: (has ::: note/tip/warning blocks, has bold labels)."""
    colon = bold = in_code = False
    for line in text.split('\n'):
        if FENCE.match(line):
            in_code = not in_code
            continue
        if in_code:
            continue
        s = line.strip()
        m = ADMONITION.match(s)
        colon = colon or bool(m and m[1] in COLON_KINDS)
        bold = bold or bool(BOLD_LABEL.match(s))
    return colon, bold


def style(path, added, errors, warnings, base_text=''):
    text = open(path, encoding='utf-8').read().split('\n')
    in_code, in_fm, fence_lang = False, text[:1] == ['---'], ''
    is_index = os.path.basename(path) == '0.index.md'
    base_colon, base_bold = admonition_forms(base_text)
    for n, line in enumerate(text, 1):
        if in_fm:
            if n > 1 and line.strip() == '---':
                in_fm = False
            continue
        new = added is None or n in added
        f = FENCE.match(line)
        if f:
            if not in_code and new and not f[2]:
                errors.append(f'{path}:{n} code fence without a language')
            in_code, fence_lang = (not in_code), (f[2] if not in_code else '')
            continue
        if not new:
            continue
        loc = f'{path}:{n}'
        if in_code:
            if re.search(r'\blocalhost\b', line):
                warnings.append(f'{loc} localhost in an example; use 0.0.0.0 or a service name')
            if fence_lang in ('bash', 'sh', 'shell', 'zsh') and re.match(r'^\s*\$ ', line):
                warnings.append(f'{loc} shell prompt in a code block')
            continue
        s = line.strip()
        m = ADMONITION.match(s)
        if m:
            kind = m[1]
            if kind == 'info':
                if not is_index:
                    errors.append(f'{loc} :::info is only for the repository block of a service overview')
            elif kind not in COLON_KINDS:
                errors.append(f'{loc} :::{kind}; use :::note, :::tip, or :::warning')
            elif not base_colon:
                errors.append(f'{loc} ::: block on a page that has none; use a bold label and a blockquote')
        b = BOLD_LABEL.match(s)
        if b:
            if b[1] not in ('Note', 'Tip', 'Warning'):
                errors.append(f'{loc} "**{b[1]}**" label; use Note, Tip, or Warning '
                              '(a deprecation starts its table row with **Deprecated.**)')
            elif base_colon and not base_bold:
                warnings.append(f'{loc} bold label on a page that uses ::: blocks; use :::{b[1].lower()}')
        if CLOSING.match(s):
            errors.append(f'{loc} closing section "{s}"; use "## Further reading"')
        h = re.match(r'^(#{5,})\s', s)
        if h:
            errors.append(f'{loc} heading deeper than H4')
        if re.search(r'\]\(/', line):
            errors.append(f'{loc} absolute internal link; use a relative path ending in .md')
        if 'docs.dialx.ai' in line:
            errors.append(f'{loc} link to docs.dialx.ai; link the docs_v2 page instead')
        if BRANCH_LINK.search(line):
            warnings.append(f'{loc} GitHub link pinned to a branch; pin a release tag unless intended')
        p = prose_only(line)
        b = BANNED.search(p)
        if b:
            errors.append(f'{loc} banned word "{b[0]}"')
        if re.search(r'<[A-Za-z_][\w-]*>', p) or re.search(r'[{}]', p):
            errors.append(f'{loc} bare <...> or {{...}} outside code breaks the MDX build; wrap it in backticks')
        v = VERSION_PROSE.search(p)
        if v:
            warnings.append(f'{loc} version statement in prose ("{v[0]}"); keep versions in pinned links')
        if '!' in re.sub(r'!\[', '', p).replace('!=', ''):
            warnings.append(f'{loc} exclamation mark in prose')
        if not s.startswith('|'):
            for sentence in re.split(r'(?<=[.?!])\s+', p):
                words = len(sentence.split())
                if words > 30:
                    warnings.append(f'{loc} sentence of {words} words; the limit is 30')


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--base', help='default: origin/development, else the local development branch')
    ap.add_argument('--service', action='append', default=[], help='synced service folder')
    ap.add_argument('--today', default=date.today().isoformat())
    a = ap.parse_args()
    services = [s.rstrip('/') + '/' for s in a.service]
    if not services:
        sys.exit('pass --service for each synced folder')
    if not a.base:
        a.base = next((r for r in ('origin/development', 'development')
                       if git('rev-parse', '--verify', '-q', f'{r}^{{commit}}').returncode == 0), None)
        if not a.base:
            sys.exit('no origin/development and no local development branch; pass --base')
    errors, warnings, report = [], [], []
    items = changes(a.base)
    pages_added_or_removed = any(st in ('A', 'D', 'R') and p.endswith('.md') and p.startswith('docs_v2/')
                                 for st, p, _ in items)
    for status, path, old in items:
        if any(path.startswith(s) for s in services):
            kind = 'service'
        elif path == 'sidebars-v2.js':
            kind = 'menu'
            if not pages_added_or_removed:
                errors.append('sidebars-v2.js changed although no page was added, removed, or renamed')
        elif path.startswith(RELATED):
            kind = 'related'
        else:
            kind = 'OUT OF SCOPE'
            errors.append(f'{path}: out of scope for a service sync; undo it')
        report.append(f'{status} {kind:<12} {path}')
        if not path.endswith('.md') or status == 'D':
            continue
        cur = frontmatter(open(path, encoding='utf-8').read())
        base_text = git('show', f'{a.base}:{old}').stdout if status in ('M', 'R') else ''
        if status in ('M', 'R'):
            prev = frontmatter(base_text)
            for k in sorted(set(prev) | set(cur)):
                if k != 'last_verified' and prev.get(k) != cur.get(k):
                    errors.append(f'{path}: frontmatter "{k}" changed ({prev.get(k)!r} -> {cur.get(k)!r})')
            lv_prev, lv = prev.get('last_verified'), cur.get('last_verified')
            if kind == 'related' and lv != lv_prev:
                errors.append(f'{path}: related page; keep last_verified {lv_prev}')
            if kind == 'service' and lv != a.today:
                warnings.append(f'{path}: last_verified is {lv}, not {a.today} '
                                '(fine only for a page that also covers a repository not synced)')
        else:
            for k, allowed in REQUIRED.items():
                v = cur.get(k, '').strip('"')
                if not v:
                    errors.append(f'{path}: new page lacks frontmatter "{k}"')
                elif allowed and v not in allowed:
                    warnings.append(f'{path}: "{k}: {v}" is not accepted by lint:frontmatter; '
                                    'keep it only if the sibling pages use it')
        style(path, added_lines(a.base, path, status), errors, warnings, base_text)

    print(f'changed paths vs {a.base}: {len(items)}')
    for r in report:
        print('  ' + r)
    print(f'errors: {len(errors)}')
    for e in errors:
        print('  ' + e)
    print(f'warnings: {len(warnings)} (review each; fix the ones in text you wrote)')
    for w in warnings:
        print('  ' + w)
    sys.exit(1 if errors else 0)


if __name__ == '__main__':
    main()
