#!/usr/bin/env python3
"""Scope, frontmatter, style, and readability checks for a guide alignment run.

Usage (from the root of the epam/ai-dial checkout):
  python3 -I guide_checks.py [--base BASE] [--section understand-dial ...] [--allow-last-verified]

BASE defaults to origin/development, else the local development branch. Compares the working
tree (committed or not, plus untracked files under docs_v2/) with BASE.
  scope        every changed path is an existing page in a target section (the four, or the
               ones given with --section); no page is added, removed, or renamed, and
               sidebars-v2.js doesn't change
  frontmatter  existing pages keep every field, last_verified included (unless
               --allow-last-verified, used only when the run's options include set last_verified); new pages
               have every field
  style        on added lines only. Errors: banned words, Next steps or Related headings, MDX
               hazards (bare <...> or {...}), absolute or docs.dialx.ai links, code fences
               without a language, headings below H4. Warnings: branch-pinned GitHub links,
               localhost in code, sentences over 30 words, exclamation marks, changelog wording
  admonitions  a new admonition takes the form its page uses: ::: blocks, or a bold label and a
               blockquote. A page with neither takes its folder's form, then its section's
               (::: in Understand DIAL and Operating DIAL, bold labels in Connecting to DIAL;
               Building with DIAL follows the folder). Labels: Note, Tip, Warning. :::info only
               on a page that already has one
  readability  warnings: a page that grows by more than 150 words or 15%, a new heading, a new
               table on an explanation or landing page, an added paragraph of more than 5
               sentences, an added line copied from a source page, an unspaced em dash or a
               double hyphen on a page that writes spaced em dashes
Exit code 1 when any error is found.
"""
import argparse
import os
import re
import subprocess
import sys
from collections import Counter

TARGET_NAMES = ('understand-dial', 'connecting-to-dial', 'building-with-dial', 'operating-dial')
SECTION_FORM = {'understand-dial': 'colon', 'connecting-to-dial': 'bold', 'operating-dial': 'colon'}
REQUIRED = ('title', 'type', 'persona', 'component', 'last_verified', 'owner')
BANNED = re.compile(r'\b(simply|just|easy|easily|obviously|please note|it should be noted|click here|'
                    r'our product|ai-powered|cutting-edge|best-in-class)\b', re.I)
CLOSING = re.compile(r'^#{2,6}\s+(next steps|related\b.*|see also|where to go next)\s*$', re.I)
CHANGELOG = re.compile(r"(\bnew in\b|\bsince (version )?\d+\.\d+|\bas of (version )?\d+\.\d+|\(added in\b|"
                       r"\bwhat's new\b|\brecently (added|introduced)\b|\bstarting (from|with) (version|release) )", re.I)
BRANCH_LINK = re.compile(r'https://github\.com/epam/[\w.-]+/(?:blob|tree)/(main|master|development|develop)/')
FENCE = re.compile(r'^\s*(```|~~~)\s*(\S*)')
ADMON = re.compile(r'^:::\s*(\w+)')
BOLD = re.compile(r'^(?:>\s*)?\*\*(Note|Tip|Warning|Important|Deprecated|Caution|Danger|Info)\*\*:?\s*$|^>\s*\*\*(Note|Tip|Warning|Important)\*\*:')


def git(*args):
    return subprocess.run(['git', *args], capture_output=True, text=True)


def section_of(path):
    p = path.split('/')
    return re.sub(r'^\d+\.', '', p[1]) if len(p) > 1 and p[0] == 'docs_v2' else ''


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


def body(text):
    lines = text.split('\n')
    if lines and lines[0].strip() == '---':
        for i in range(1, len(lines)):
            if lines[i].strip() == '---':
                return lines[i + 1:]
    return lines


def prose_lines(lines):
    out, in_code = [], False
    for l in lines:
        if FENCE.match(l):
            in_code = not in_code
            continue
        if not in_code:
            out.append(l)
    return out


def words(lines):
    return sum(len(re.sub(r'[|`*#>\[\]()-]', ' ', l).split()) for l in prose_lines(lines))


def forms(text):
    colon = bold = info = False
    for l in prose_lines(body(text)):
        s = l.strip()
        m = ADMON.match(s)
        if m:
            colon = colon or m[1] in ('note', 'tip', 'warning', 'caution', 'danger')
            info = info or m[1] == 'info'
        bold = bold or bool(BOLD.match(s))
    return colon, bold, info


def folder_form(path):
    c = Counter()
    d = os.path.dirname(path)
    for f in os.listdir(d):
        p = os.path.join(d, f)
        if f.endswith('.md') and p != path:
            colon, bold, _ = forms(open(p, encoding='utf-8').read())
            c['colon'] += colon
            c['bold'] += bold
    if c['colon'] > c['bold']:
        return 'colon'
    if c['bold'] > c['colon']:
        return 'bold'
    return SECTION_FORM.get(section_of(path))


def norm(s):
    s = re.sub(r'\]\([^)]*\)', ']', s)
    s = re.sub(r'[`*_>#|]', ' ', s).lower()
    return ' '.join(s.split())


def changes(base):
    out = []
    res = git('diff', '--name-status', '-M', base, '--')
    if res.returncode != 0:
        sys.exit(f'git diff failed: {res.stderr.strip()}')
    for line in res.stdout.splitlines():
        parts = line.split('\t')
        if parts[0][0] == 'R':
            out.append(('R', parts[2], parts[1]))
        else:
            out.append((parts[0][0], parts[1], parts[1]))
    for path in git('ls-files', '--others', '--exclude-standard', '--', 'docs_v2', 'sidebars-v2.js').stdout.split():
        out.append(('A', path, None))
    return out


def added_lines(base, path, status):
    if status == 'A':
        return None
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


def source_lines():
    """Normalized long lines of every source page, to catch text copied into a guide."""
    out = {}
    for root, _, files in os.walk('docs_v2'):
        for f in files:
            p = os.path.join(root, f)
            if not f.endswith('.md') or section_of(p) in TARGET_NAMES:
                continue
            for l in open(p, encoding='utf-8'):
                for sent in sentences(norm(l)):
                    out.setdefault(sent, p)
    return out


def sentences(normalized):
    """Sentences of 10 or more words, the unit for spotting text copied from a source page."""
    return [x.strip() for x in re.split(r'(?<=[.?!;:])\s+', normalized) if len(x.split()) >= 10]


def style(path, status, base_text, added, errors, warnings, copied_from, page_type):
    text = open(path, encoding='utf-8').read()
    lines = text.split('\n')
    in_code, in_fm, fence_lang = False, lines[:1] == ['---'], ''
    b_colon, b_bold, b_info = forms(base_text) if base_text else (False, False, False)
    expected = 'colon' if b_colon and not b_bold else 'bold' if b_bold and not b_colon else None
    fallback = None if (b_colon or b_bold) else folder_form(path)
    spaced = len(re.findall(r' — ', base_text or '')) >= len(re.findall(r'\S—\S', base_text or ''))
    para, para_start = [], 0

    def flush():
        joined = ' '.join(para)
        if para and len(re.findall(r'[.?!](\s|$)', joined)) > 5:
            warnings.append(f'{path}:{para_start} added paragraph of more than 5 sentences; split it or cut it')

    for n, line in enumerate(lines, 1):
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
            flush()
            para = []
            continue
        loc = f'{path}:{n}'
        if in_code:
            if re.search(r'\blocalhost\b', line):
                warnings.append(f'{loc} localhost in an example; use 0.0.0.0 or a service name unless the page already does')
            if fence_lang in ('bash', 'sh', 'shell', 'zsh') and re.match(r'^\s*\$ ', line):
                warnings.append(f'{loc} shell prompt in a code block')
            continue
        s = line.strip()
        if s and not s.startswith(('#', '|', ':::', '!', '<')):
            if not para:
                para_start = n
            para.append(s)
        else:
            flush()
            para = []
        m = ADMON.match(s)
        if m:
            kind = m[1]
            if kind == 'info':
                if not b_info:
                    errors.append(f'{loc} :::info is used only on pages that already have one')
            elif kind not in ('note', 'tip', 'warning'):
                errors.append(f'{loc} :::{kind}; use :::note, :::tip, or :::warning')
            elif expected == 'bold':
                errors.append(f'{loc} ::: block on a page that uses bold labels; use **{kind.capitalize()}** and a blockquote')
            elif fallback == 'bold':
                warnings.append(f'{loc} ::: block; this folder or section uses bold labels with a blockquote')
        bm = BOLD.match(s)
        if bm:
            label = bm[1] or bm[2]
            if label not in ('Note', 'Tip', 'Warning') and not (base_text and f'**{label}**' in base_text):
                errors.append(f'{loc} "**{label}**" label; use Note, Tip, or Warning')
            elif expected == 'colon':
                errors.append(f'{loc} bold label on a page that uses ::: blocks; use :::{label.lower()}')
            elif fallback == 'colon':
                warnings.append(f'{loc} bold label; this folder or section uses ::: blocks')
        if CLOSING.match(s):
            errors.append(f'{loc} closing section "{s}"; use "## Further reading"')
        if re.match(r'^#{5,}\s', s):
            errors.append(f'{loc} heading deeper than H4')
        elif re.match(r'^#{2,4}\s', s) and status != 'A':
            warnings.append(f'{loc} new heading "{s}"; a guide takes a sentence and a link before a new section')
        if re.match(r'^\|[\s:|-]+\|?$', s) and status != 'A' and page_type in ('explanation', 'landing'):
            warnings.append(f'{loc} new table on an {page_type} page; link the reference table instead')
        if re.search(r'\]\(/', line):
            errors.append(f'{loc} absolute internal link; use a relative path ending in .md')
        if 'docs.dialx.ai' in line:
            errors.append(f'{loc} link to docs.dialx.ai; link the docs_v2 page instead')
        if BRANCH_LINK.search(line):
            warnings.append(f'{loc} GitHub link pinned to a branch; keep it only if the page links that way already')
        p = prose_only(line)
        b = BANNED.search(p)
        if b:
            errors.append(f'{loc} banned word "{b[0]}"')
        if re.search(r'<[A-Za-z_][\w-]*>', p) or re.search(r'[{}]', p):
            errors.append(f'{loc} bare <...> or {{...}} outside code breaks the MDX build; wrap it in backticks')
        c = CHANGELOG.search(p)
        if c:
            warnings.append(f'{loc} changelog wording ("{c[0]}"); state current behavior, or a minimum version a reader acts on')
        if '!' in re.sub(r'!\[', '', p).replace('!=', ''):
            warnings.append(f'{loc} exclamation mark in prose')
        if spaced and (re.search(r'\S—\S', p) or re.search(r'\s--\s', p)):
            warnings.append(f'{loc} dash style; this page writes spaced em dashes (" — ")')
        if not s.startswith('|'):
            for sentence in re.split(r'(?<=[.?!])\s+', p):
                if len(sentence.split()) > 30:
                    warnings.append(f'{loc} sentence of {len(sentence.split())} words; the limit is 30')
        for sent in sentences(norm(line)):
            if sent in copied_from:
                warnings.append(f'{loc} copied from {copied_from[sent]}; a guide links the reference instead of repeating it')
                break
    flush()


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--base', help='default: origin/development, else the local development branch')
    ap.add_argument('--section', action='append', default=[], help='target sections this run may edit')
    ap.add_argument('--allow-last-verified', action='store_true')
    a = ap.parse_args()
    allowed = set(a.section) or set(TARGET_NAMES)
    if not a.base:
        a.base = next((r for r in ('origin/development', 'development')
                       if git('rev-parse', '--verify', '-q', f'{r}^{{commit}}').returncode == 0), None)
        if not a.base:
            sys.exit('no origin/development and no local development branch; pass --base')
    errors, warnings, report = [], [], []
    items = changes(a.base)
    copied = source_lines()
    for status, path, old in items:
        sec = section_of(path)
        if path == 'sidebars-v2.js':
            kind = 'menu'
            errors.append('sidebars-v2.js changed; a guide alignment adds, removes, and renames no page')
        elif sec in allowed:
            kind = sec
            if path.endswith('.md') and status in ('A', 'D', 'R'):
                errors.append(f'{path}: page {"added" if status == "A" else "removed" if status == "D" else "renamed"}; '
                              'a guide alignment adds, removes, and renames no page; flag the need instead')
        else:
            kind = 'OUT OF SCOPE'
            errors.append(f'{path}: out of scope for this run; undo it')
        report.append(f'{status} {kind:<20} {path}')
        if not path.endswith('.md') or status == 'D' or kind == 'OUT OF SCOPE':
            continue
        text = open(path, encoding='utf-8').read()
        cur = frontmatter(text)
        base_text = git('show', f'{a.base}:{old}').stdout if status in ('M', 'R') else ''
        if status in ('M', 'R'):
            prev = frontmatter(base_text)
            for k in sorted(set(prev) | set(cur)):
                if prev.get(k) != cur.get(k) and not (k == 'last_verified' and a.allow_last_verified):
                    errors.append(f'{path}: frontmatter "{k}" changed ({prev.get(k)!r} -> {cur.get(k)!r}); keep it')
            ob, nb = words(body(base_text)), words(body(text))
            if nb - ob > max(150, ob * 0.15):
                warnings.append(f'{path}: grew by {nb - ob} words ({ob} -> {nb}); check the proportion rules in docs-services-review-and-update-relatives:impact')
        else:
            for k in REQUIRED:
                if not cur.get(k, '').strip('"'):
                    errors.append(f'{path}: new page lacks frontmatter "{k}"')
        style(path, status, base_text, added_lines(a.base, path, status), errors, warnings, copied, cur.get('type', ''))

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
