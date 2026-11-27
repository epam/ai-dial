"""Check a DIAL Chat User Guide update proposal: the work order, the branch, and the PR body.

Usage (from the root of the epam/ai-dial checkout):
  python3 -I plan_checks.py --work-order <FILE> [--title '<TITLE>'] [--body <WORK>/pr-body.md]
      [--base <BASE> --date YYYY-MM-DD [--inventory <WORK>/guide.json]]

--work-order is <WORK>/work-order.md at step 7, and the copy in the branch,
.research/chat-user-guide-<DATE>.md (or -2, -3), at step 9.

Work order checks (always):
  sections   the headings Summary, Manual updates, Changes in the releases, Reviewed, no guide
             impact, and Needs review, in this order
  items      numbered 1..N without gaps, each "- [ ] **<N>. <Type>.** <UI path>" with a known type,
             and "What changed" plus the fields its type needs (work-order skill, sections 2 and 4):
               Where:     `<page>`, section "<heading>", line <N>: the page exists, the line is in
                          it, the heading exists and the line is under it
               Image:     an existing image; New image: a path that doesn't exist yet, in an
                          existing folder
               Replace:   `<old>` → `<new>`: <old> is on the Where line, word for word
               Remove:    lines <A>–<B> inside the page
               Source:    at least one link to a PR, a release, or a file pinned to a stable tag
                          of the three repositories, and the release as X.Y.Z (YYYY-MM-DD)
  links      every github.com/epam/<repo>/blob/ or /tree/ link is pinned to an X.Y.Z tag
  rules      no AI attribution, no label commands; with --title, the title starts with
             "[DIAL Loop]: Chat update proposal" and has no attribution either
Branch checks (with --base and --date), for the commit step:
  diff       what is staged, against <BASE>: only `last_verified: <DATE>` lines changed, only in the
             guide's pages, on every page of --inventory; one added file, the work order, at
             .research/chat-user-guide-<DATE>.md (or -2, -3) and the same path as --work-order;
             nothing else; nothing in those paths changed but not staged; nothing untracked under
             docs_v2/.
PR body checks (with --body):
  body       the headings Summary and Verification, in this order; at most 65,536 characters,
             GitHub's limit for a PR body; it names the work order's path when that path is under
             .research/; no AI attribution, no label commands. The tag rule of "links" doesn't apply:
             the body links the work order at the branch.

Stdout: one line per check, "ok" or "FAIL" with the reasons; "FAIL files" when a file passed in
--work-order, --body, or --inventory doesn't exist. It only reads: it never edits, stages, commits,
pushes, or writes to GitHub. Exit 0 when every check passes; exit 1 when one fails.
"""
import argparse
import json
import os
import re
import subprocess
import sys

ROOT = 'docs_v2/8.chat-user-guide'
SECTIONS = ['Summary', 'Manual updates', 'Changes in the releases', 'Reviewed, no guide impact',
            'Needs review']
BODY_SECTIONS = ['Summary', 'Verification']
TITLE_PREFIX = '[DIAL Loop]: Chat update proposal'
BODY_LIMIT = 65536
TYPES = {
    'Retake a screenshot': {'Where', 'Image', 'Capture', 'Source'},
    'Add a screenshot': {'Where', 'New image', 'Capture', 'Source'},
    'Remove a screenshot': {'Where', 'Image', 'Source'},
    'Replace text': {'Where', 'Replace', 'Source'},
    'Add text': {'Where', 'Text', 'Source'},
    'Remove text': {'Where', 'Remove', 'Source'},
}
REPOS = r'ai-dial-chat|ai-dial-quickapps-backend|ai-dial-quickapps-frontend'
ITEM = re.compile(r'^- \[[ xX]\] \*\*(\d+)\. ([^.*]+)\.\*\* (.+)$')
FIELD = re.compile(r'^\s+- \*\*([A-Za-z ]+):\*\* ?(.*)$')
WHERE = re.compile(r'^`([^`]+)`, section "([^"]+)", line (\d+)\b')
REPLACE = re.compile(r'^`(.+?)` → `(.*?)`$')
REMOVE = re.compile(r'^lines? (\d+)(?:[–-](\d+))?\b')
CODE_PATH = re.compile(r'^`([^`]+)`')
SOURCE_LINK = re.compile(rf'https://github\.com/epam/({REPOS})/(pull/\d+|releases/tag/\d+\.\d+\.\d+|'
                         rf'(?:blob|tree)/\d+\.\d+\.\d+/\S+)')
RELEASE = re.compile(r'\b\d+\.\d+\.\d+ \(\d{4}-\d{2}-\d{2}\)')
PINNED = re.compile(rf'https://github\.com/epam/({REPOS}|ai-dial)/(?:blob|tree)/([^/\s)]+)/')
RESEARCH = re.compile(r'^\.research/chat-user-guide-(\d{4}-\d{2}-\d{2})(?:-\d+)?\.md$')
ATTRIBUTION = re.compile(r'Co-Authored-By:|Generated with|noreply@anthropic\.com|🤖|\bClaude\b|\bAI[- ]generated\b', re.I)
LABELS = re.compile(r'--(?:add-|remove-)?label\b|\bgh label\b')


def rel(path):
    """The path relative to the working directory (the checkout root), with / separators."""
    return os.path.relpath(os.path.abspath(path)).replace(os.sep, '/')


def headings(text):
    return [ln[3:].strip() for ln in text.split('\n') if ln.startswith('## ')]


def heading_ranges(lines):
    """[(text, level, start, end)] for the page's headings, skipping code blocks."""
    hs, in_code = [], False
    for n, line in enumerate(lines, 1):
        if re.match(r'^\s*(```|~~~)', line):
            in_code = not in_code
            continue
        m = re.match(r'^(#{1,6})\s+(.+?)\s*(?:\{#[\w-]+\})?\s*$', line)
        if m and not in_code:
            hs.append([m.group(2), len(m.group(1)), n, len(lines)])
    for i, h in enumerate(hs):
        for later in hs[i + 1:]:
            if later[1] <= h[1]:
                h[3] = later[2] - 1
                break
    return hs


def page_path(p):
    p = p.strip()
    return p if p.startswith('docs_v2/') else os.path.normpath(os.path.join(ROOT, p))


def check_items(text, errors):
    items, cur = [], None
    in_manual = False
    for line in text.split('\n'):
        if line.startswith('## '):
            in_manual = line[3:].strip() == 'Manual updates'
            cur = None
            continue
        if not in_manual:
            continue
        m = ITEM.match(line)
        if m:
            cur = {'n': int(m.group(1)), 'type': m.group(2).strip(), 'path': m.group(3), 'fields': {}}
            items.append(cur)
            continue
        f = FIELD.match(line)
        if f and cur is not None:
            cur['fields'][f.group(1).strip()] = f.group(2).strip()
    nums = [i['n'] for i in items]
    if nums != list(range(1, len(items) + 1)):
        errors.append(f'items are numbered {nums}, expected 1..{len(items)}')
    cache = {}
    for it in items:
        tag = f"item {it['n']}"
        need = TYPES.get(it['type'])
        if need is None:
            errors.append(f"{tag}: unknown type \"{it['type']}\"; use one of: {', '.join(TYPES)}")
            continue
        missing = (need | {'What changed'}) - set(it['fields'])
        if missing:
            errors.append(f"{tag}: missing {', '.join(sorted(missing))}")
        if '→' not in it['path']:
            errors.append(f"{tag}: the UI path after the type has no \"→\" steps")
        where = WHERE.match(it['fields'].get('Where', ''))
        lines = None
        if 'Where' in it['fields'] and not where:
            errors.append(f"{tag}: Where must read `<page>`, section \"<heading>\", line <N>")
        if where:
            page, heading, line_no = page_path(where.group(1)), where.group(2), int(where.group(3))
            if not os.path.isfile(page):
                errors.append(f'{tag}: {page} does not exist')
            else:
                lines = cache.setdefault(page, open(page, encoding='utf-8').read().split('\n'))
                if not 1 <= line_no <= len(lines):
                    errors.append(f'{tag}: line {line_no} is outside {page} ({len(lines)} lines)')
                hs = [h for h in heading_ranges(lines) if h[0] == heading]
                if not hs:
                    errors.append(f'{tag}: {page} has no heading "{heading}"')
                elif not any(h[2] <= line_no <= h[3] for h in hs):
                    errors.append(f'{tag}: line {line_no} is not under "{heading}" in {page}')
        for key, must_exist in (('Image', True), ('New image', False)):
            if key in it['fields']:
                m = CODE_PATH.match(it['fields'][key])
                if not m:
                    errors.append(f'{tag}: {key} must start with the path in backticks')
                    continue
                img = page_path(m.group(1))
                if must_exist and not os.path.isfile(img):
                    errors.append(f'{tag}: image {img} does not exist')
                if not must_exist and (os.path.exists(img) or not os.path.isdir(os.path.dirname(img))):
                    errors.append(f'{tag}: new image {img} exists already, or its folder does not')
        if 'Replace' in it['fields']:
            m = REPLACE.match(it['fields']['Replace'])
            if not m:
                errors.append(f'{tag}: Replace must read `<old>` → `<new>`')
            elif where and lines and 1 <= int(where.group(3)) <= len(lines) and \
                    m.group(1) not in lines[int(where.group(3)) - 1]:
                errors.append(f'{tag}: `{m.group(1)}` is not on line {where.group(3)} of {where.group(1)}')
        if 'Remove' in it['fields']:
            m = REMOVE.match(it['fields']['Remove'])
            if not m:
                errors.append(f'{tag}: Remove must start with "lines <A>–<B>" or "line <A>"')
            elif lines and not (1 <= int(m.group(1)) <= int(m.group(2) or m.group(1)) <= len(lines)):
                errors.append(f'{tag}: Remove range is outside the page')
        src = it['fields'].get('Source', '')
        if 'Source' in it['fields']:
            if not SOURCE_LINK.search(src):
                errors.append(f'{tag}: Source has no PR, release, or tag-pinned file link of the three repositories')
            if not RELEASE.search(src):
                errors.append(f'{tag}: Source does not name the release as X.Y.Z (YYYY-MM-DD)')
    return len(items)


def check_diff(base, day, inventory, work_order, errors):
    """(pages changed, work order files added); every problem goes to errors."""
    def git(*args):
        r = subprocess.run(['git', *args], capture_output=True, text=True)
        if r.returncode != 0:
            errors.append(f'git {" ".join(args)}: {r.stderr.strip()[:200]}')
        return r.stdout

    status = {}
    for ln in git('diff', '--cached', '--no-renames', '--name-status', base).split('\n'):
        if ln:
            code, path = ln.split('\t', 1)
            status[path] = code[:1]
    pages = [p for p in status if p.startswith(ROOT + '/') and p.endswith('.md')]
    research = [p for p in status if p.startswith('.research/')]
    outside = [p for p in status if p not in pages and p not in research]
    if outside:
        errors.append('changed outside the guide pages and the work order: ' + ', '.join(outside))

    if not research:
        errors.append(f'no work order under .research/ is staged; expected {rel(work_order)} '
                      f'(git add -- docs_v2/8.chat-user-guide/ <RESEARCH>)')
    elif len(research) > 1:
        errors.append('more than one file under .research/ changed: ' + ', '.join(research))
    for p in research:
        m = RESEARCH.match(p)
        if status[p] != 'A':
            errors.append(f'{p}: expected a new file, found git status {status[p]}')
        if not m or m.group(1) != day:
            errors.append(f'{p}: expected .research/chat-user-guide-{day}.md, or the same name with -2 or -3')
        if p != rel(work_order):
            errors.append(f'{p}: is not the --work-order file ({rel(work_order)})')

    for p in pages:
        if status[p] != 'M':
            errors.append(f'{p}: expected a changed page, found git status {status[p]}')
            continue
        diff = git('diff', '--cached', '-U0', base, '--', p)
        body = [ln for ln in diff.split('\n') if ln[:1] in ('+', '-') and not ln.startswith(('+++', '---'))]
        if body != [b for b in body if re.match(r'^[-+]last_verified: ', b)] or \
                f'+last_verified: {day}' not in body:
            errors.append(f'{p}: the diff changes more than `last_verified: {day}`')

    unstaged = [p for p in git('diff', '--name-only', '--', ROOT, *research).split('\n') if p]
    if unstaged:
        errors.append('changed but not staged: ' + ', '.join(unstaged))
    untracked = [p for p in git('ls-files', '--others', '--exclude-standard', '--', 'docs_v2').split('\n') if p]
    if untracked:
        errors.append('untracked under docs_v2/: ' + ', '.join(untracked))
    if inventory:
        for p in json.load(open(inventory, encoding='utf-8'))['pages']:
            text = open(p['file'], encoding='utf-8').read()
            if not re.search(rf'^last_verified: {re.escape(day)}\s*$', text, re.M):
                errors.append(f"{p['file']}: last_verified is not {day}")
    return len(pages), len(research)


def check_body(body, work_order, errors):
    found = headings(body)
    if found != BODY_SECTIONS:
        errors.append(f'found {found}, expected {BODY_SECTIONS}')
    if len(body) > BODY_LIMIT:
        errors.append(f'{len(body)} characters; GitHub allows {BODY_LIMIT:,}')
    path = rel(work_order)
    if path.startswith('.research/') and path not in body:
        errors.append(f'does not name the work order, {path}')
    errors += [f'{m.group(0)!r}' for m in ATTRIBUTION.finditer(body)]
    errors += [f'label command {m.group(0)!r}' for m in LABELS.finditer(body)]


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--work-order', required=True)
    ap.add_argument('--title')
    ap.add_argument('--body')
    ap.add_argument('--base')
    ap.add_argument('--date')
    ap.add_argument('--inventory')
    a = ap.parse_args()
    for flag, path in (('--work-order', a.work_order), ('--body', a.body), ('--inventory', a.inventory)):
        if path and not os.path.isfile(path):
            print(f'FAIL files\n     {flag} {path} does not exist')
            sys.exit(1)
    text = open(a.work_order, encoding='utf-8').read()
    failed = False

    def report(name, errors, note=''):
        nonlocal failed
        if errors:
            failed = True
            print(f'FAIL {name}')
            for e in errors:
                print(f'     {e}')
        else:
            print(f'ok   {name}{note}')

    found = headings(text)
    report('sections', [] if found == SECTIONS else [f'found {found}, expected {SECTIONS}'])
    errs = []
    n = check_items(text, errs)
    report('items', errs, f' ({n})')
    bad = sorted({m.group(0) for m in PINNED.finditer(text) if not re.fullmatch(r'\d+\.\d+\.\d+', m.group(2))})
    report('links', [f'not pinned to an X.Y.Z tag: {b}' for b in bad])
    errs = [f'work order: {m.group(0)!r}' for m in ATTRIBUTION.finditer(text)]
    errs += [f'work order: label command {m.group(0)!r}' for m in LABELS.finditer(text)]
    if a.title is not None:
        if not a.title.startswith(TITLE_PREFIX):
            errs.append(f'title does not start with "{TITLE_PREFIX}"')
        errs += [f'title: {m.group(0)!r}' for m in ATTRIBUTION.finditer(a.title)]
    report('rules', errs, f' ({len(text)} characters)')
    if a.base:
        if not a.date:
            print('FAIL diff\n     --base needs --date')
            sys.exit(1)
        errs = []
        pages, added = check_diff(a.base, a.date, a.inventory, a.work_order, errs)
        report('diff', errs, f' ({pages} pages, only last_verified: {a.date}; {added} work order added)')
    if a.body:
        body = open(a.body, encoding='utf-8').read()
        errs = []
        check_body(body, a.work_order, errs)
        report('body', errs, f' ({len(body)} characters)')
    sys.exit(1 if failed else 0)


if __name__ == '__main__':
    main()
