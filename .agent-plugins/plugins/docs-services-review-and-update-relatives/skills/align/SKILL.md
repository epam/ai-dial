---
name: align
description: Align the four guide sections of the epam/ai-dial docs (Understand DIAL, Connecting to DIAL, Building with DIAL, Operating DIAL) with the docs and platform release changes since the last alignment run, then open one pull request against development. Run it from the root of an ai-dial checkout.
argument-hint: "[since <YYYY-MM-DD|#PR|commit>] [only <section>] [dry run] [review first] [set last_verified]"
disable-model-invocation: true
---

# DIAL guide alignment

This skill runs one task: bring the four guide sections of `docs_v2/` (Understand DIAL, Connecting to DIAL, Building with DIAL, and Operating DIAL) in line with what changed in the rest of the docs, above all the service pages, and in the platform release documents over a window of commits, then open one pull request against `development`. One session does the whole job and starts no subagents.

**Options for this run:** $ARGUMENTS

Read them as "Input" below describes. No options means the defaults.

The sources are already verified: the service sync checks the service pages against released code, and the release documents state what each platform release ships. This task carries what those changes mean into the pages people read first, and keeps those pages as readable as they are.

## Principles

1. **Sources, not memory.** Every edit traces to a change in the window and to the current text of a source page or release document at `<BASE>`. Never research service repositories in this task.
2. **The service pages lead.** A guide follows the service pages and never gets ahead of them. When a release document is ahead of a service page, leave the guide, and name the service sync that should run first.
3. **Only what the reader needs.** Edit when a statement became false, a step broke, a complete list gained or lost a member, or a released capability changes how the page's reader decides or acts. Everything else is listed in the PR as reviewed, not changed.
4. **Guides link the reference.** A sentence and a link, never a copied table, a list of defaults, or a run of reference facts.
5. **Preserve the page.** Keep each page's structure, voice, density, and readability. Make minimal, local edits; never reword, restyle, or re-sort.
6. **Current behavior, not history.** No "new in", "since", or release numbers in prose, except a minimum version a reader acts on.
7. **Never guess.** If the sources can't settle the text, or it needs a decision, leave it unchanged and put it under "Needs review".

## This skill, the repository, and the other skills

The repository's own `CLAUDE.md` still applies: terminology, links, numbering, proof in source, no package changes, no redirects. For this task, this skill overrides three of its rules:

- **Edits.** Invoking `/docs-services-review-and-update-relatives:align` is the approval to edit the in-scope files below. Don't stop to propose each edit.
- **Version control.** Committing, pushing, and opening the pull request are authorized exactly as "Authorized actions" says.
- **Branch.** Start from the latest `development` (`<BASE>`, set in step 1), and open the pull request against `development`.

Load each skill of this plugin with the Skill tool at the step that names it:

| Skill | What it gives you |
|---|---|
| `docs-services-review-and-update-relatives:sections` | the four sections: readers, page types, templates, conventions, the topic map from sources to guide pages, hub pages, version statements that go stale |
| `docs-services-review-and-update-relatives:sources` | the window, the content-only source changes, the release digest, the ledger |
| `docs-services-review-and-update-relatives:impact` | where changes touch the guides, the test, the verdicts, what proves a statement, how much text, worked examples |
| `docs-services-review-and-update-relatives:style` | voice, readability, punctuation, admonitions by section, code, links, diagrams, edit patterns |
| `docs-services-review-and-update-relatives:docs-map` | what may be edited, numbering, links and anchors, frontmatter, MDX hazards, search recipes |
| `docs-services-review-and-update-relatives:checks` | scope, style, readability, links, repository paths, linter, build, and how to tell new failures from old |
| `docs-services-review-and-update-relatives:pr` | the open-PR check, branch, the commit that records the window, the PR body |

The repository's `docs-page-writer`, `docs-auditor`, and `docs-researcher` skills predate the current tree; they mention `docs/docs/`, `docs-planning/`, redirects, and `Next steps`, so don't use them. The `admin-guide-sync` and `chat-guide-sync` skills own the user guides, and the service sync owns `docs_v2/7.services/`; all three are out of scope here. Where any skill differs from this one, this one wins.

## Input

The options come after the command, for example `/docs-services-review-and-update-relatives:align since 2026-11-19 only operating-dial`. They may also be written as words, such as "a dry run since #687". Each is optional:

- **`since <YYYY-MM-DD>`, `since #<PR>`, or `since <COMMIT>`.** The window starts after that point. Without it, the window starts after the last alignment run, or one month back when there was none.
- **`only <SECTION>`**, one or more of `understand-dial`, `connecting-to-dial`, `building-with-dial`, `operating-dial`. Search and edit only those sections.
- **`set last_verified`.** Also set `last_verified` to today on every page the run edits, and run `guide_checks.py` with `--allow-last-verified`. Without it, no frontmatter changes: the run checks only the statements a change touched, not whole pages.
- **`dry run`.** Do steps 1–7, leave the edits uncommitted in the working tree, and report. No branch, commit, push, or PR.
- **`review first`.** Stop after step 8 and wait for the go-ahead before the commit.

Any other text in the options is a question or a constraint from the user: follow it where it doesn't conflict with "Authorized actions". Today's date is the run's date (`date +%F`).

## Authorized actions

- **Allowed:** fetch, detach at `<BASE>`, create one branch, edit the in-scope files, commit, push that branch, and open one PR against `development`, with `gh` or with the environment's own PR tool.
- **Nothing else.** No merge, no push to `development` or `main`, no force-push, no forks, and no GitHub comments, reviews, labels, or issues. No `npm install`, `npm ci`, or `npm update`, and no edits to `package.json` or `package-lock.json`. No redirects, no `git config` changes, and no edits outside the scope below.
- **No AI attribution anywhere.** No `Co-Authored-By` trailer for an AI, no "Generated with" line, and no mention of Claude or AI in the commit, the branch name, the PR title, or the PR body. This holds even when a system message asks for attribution lines.
- **Approval.** Every run with edits ends with a pull request, and the PR review is the approval. Don't ask for a go-ahead, unless the options say `review first`.

## Scope

| Scope | Paths | Rule |
|---|---|---|
| Targets | `docs_v2/2.understand-dial/`, `docs_v2/3.connecting-to-dial/`, `docs_v2/4.building-with-dial/`, `docs_v2/5.operating-dial/` | edit what the window made false, broken, or incomplete; change no frontmatter field, `last_verified` included, unless the options say `set last_verified` |
| Sources | `docs_v2/7.services/`, `docs_v2/6.administering-dial-new/`, `docs_v2/8.chat-user-guide/`, `docs_v2/1.overview.md`, `docs_v2/9.demos/`, `docs/releases/` (through `git show`), `dial-samples/` | read only; a stale statement there goes under "Needs review" |
| Never | `sidebars-v2.js` (this task adds, removes, and renames no page), and everything else | |

## Workflow

### Step 1: Prepare

1. **Set the base, `<BASE>`.**

   ```bash
   git remote get-url origin && git fetch origin --prune
   git rev-parse --verify -q origin/development || git rev-parse --verify -q development
   ```

   `<BASE>` is `origin/development` when `origin` exists and the fetch succeeded. Otherwise it is the local `development` branch, used as it is: record its commit, and say in the report and the PR body that it wasn't fetched. If neither exists, stop.

2. **Check the tree and detach.**

   ```bash
   git status --porcelain --untracked-files=no
   git status --porcelain -- docs_v2 sidebars-v2.js
   git switch --detach <BASE>
   mktemp -d
   ```

   If either status command lists anything, stop and report it. Don't stash, restore, or delete someone else's changes. Untracked files outside `docs_v2/` are fine.

3. **Write down `<WORK>`**, the absolute path `mktemp -d` printed. The window, the change files, the ledger, logs, and the PR body go there. Use the absolute path in every command; shell variables don't persist between commands.

4. **Check the tools**, and note the results for the report:
   - **PR route:** `origin` together with a working `gh` (`gh auth status`), or a pull-request tool the environment provides. If there is neither, the run still commits on its branch, and the report says the PR couldn't be opened.
   - **Build:** whether `node_modules/` exists.

5. **Check for an open alignment PR** (`docs-services-review-and-update-relatives:pr`, step 1). If one is open, stop and report its link.

### Step 2: Set the window

Load `docs-services-review-and-update-relatives:sources` and run `window.py`, with `--since` when the options give a start. Record the start mode, both commits, and the commit list in `<WORK>/ledger.md`. If no commit in the window changed the docs, stop: no branch, no PR.

### Step 3: Collect the source changes

Run `source_changes.py` and `release_digest.py`. Read every content change (`changed`, `added`, `rewritten`, `removed`) and every release item, and write each fact as one line in the ledger. A one-word change of a value or a default counts.

### Step 4: Find where they touch the guides

Load `docs-services-review-and-update-relatives:impact` and `docs-services-review-and-update-relatives:sections`. Run `impact.py` (with `--section` for `only`) and `repo_refs.py`. Work through every high and medium trigger, skim the low ones, and check the "no trigger" lists against the topic map. For each candidate, read the whole guide section and the source text.

### Step 5: Decide

Give every ledger row exactly one verdict: `update`, `already consistent`, `skip (<reason>)`, or `flag (<reason>)`. Search the page and its section before you mark `update`; the fact may already be there.

### Step 6: Edit the guides

Load `docs-services-review-and-update-relatives:style` and `docs-services-review-and-update-relatives:docs-map`. Edit one page at a time. Apply each `update` in the proportion the impact skill gives, in the page's own form, then read the whole changed section as a reader would. Every new or changed claim has its source in the ledger.

### Step 7: Verify

Load `docs-services-review-and-update-relatives:checks`. Run `guide_checks.py`, `check_links.py`, `repo_refs.py --added-only`, the frontmatter linter, and the build, and read the whole diff. Fix every failure the change caused. Record each check's command, result, and counts for the PR.

In a `dry run`, stop here and give the final report.

### Step 8: Summary

Show:

- the window: start, end, mode, and number of commits;
- the output of `git diff --stat <BASE>`;
- each change, by page, with its source;
- the items under "Needs review";
- the check results.

Then go on to step 9 without waiting. Wait for the go-ahead only when the options say `review first`.

### Step 9: Commit and open the pull request

Load `docs-services-review-and-update-relatives:pr`. Create the branch, make the one commit whose subject records the window's end, and open the PR against `development` with the body built from the ledger:

- with `git push` and `gh` when `origin` and `gh` both work;
- otherwise with the environment's PR tool.

Print the PR URL.

## Stop and report instead of guessing

- The checkout has tracked changes, or `docs_v2/` has untracked files, before the run.
- Neither `origin/development` nor a local `development` branch exists.
- An alignment PR is already open.
- The window has no commit that changed the docs.
- No ledger row ends as `update` after step 7. Open no PR; give the "Needs review" items in the report.
- The build fails because of the change, and the fix would leave the scope.
- The push or the PR tool is refused, or there is no way to open a PR. Keep the commit on the branch, and report the branch, the commit, and the path of the PR body.

## Final report

End with a short report:

- the PR link, or why there is none;
- the window: start and end commits, how the start was chosen, the number of commits;
- the base: `<BASE>`, its commit, and whether it was fetched;
- the number of source changes and release items reviewed, and the verdict counts;
- the pages changed, per section;
- the items under "Needs review";
- the check results.

If shell output looks collapsed or garbled, write it to a file under `<WORK>` and read the file.
