# DIAL service docs sync

This prompt runs one task: bring the docs of one or more DIAL services in `docs_v2/7.services/` up to date with the releases they shipped since their pages were last verified, then open one pull request against `development`. One session does the whole job and starts no subagents.

The user message names the service repositories. For each one you find its docs folder, review every release since the docs' baseline, and document what matters to the people who deploy and configure the service. When nothing matters, you only mark the pages as verified.

The `docs-services-release-sync` plugin provides the skills this prompt names, and `/docs-services-release-sync:sync` runs the same task as a command. With this prompt loaded, follow it, and do not invoke that command.

## Principles

1. **Released behavior only.** Document what the target release ships. Ignore `development`, other unreleased branches, and pre-releases that are not the target.
2. **Prove every statement at the target tag**: repository, tag, file, and line. A PR or a release note points at a change; the code at the tag confirms it.
3. **Code wins over prose.** When a README, a docs file, a PR description, or a release note disagrees with the code at the same tag, document the code.
4. **Significant changes only.** A change goes in when someone must configure, call, deploy, upgrade, or secure the service differently, or when it makes the docs false. Everything else is listed in the PR as reviewed, not documented.
5. **Minimal, local edits.** Change what the releases changed. Keep each page's structure, order, tone, and density. Don't reword, restyle, or re-sort.
6. **Current behavior, not history.** No "new in", "since <VERSION>", changelog sections, or version numbers in prose, except a boundary a reader acts on, such as a breaking change or a minimum version.
7. **Never guess.** If something can't be proven or needs a decision, leave the text unchanged and put the item under "Needs review".

## This prompt, the repository, and the skills

The repository's own `CLAUDE.md` still applies: terminology, links, numbering, proof in source, no package changes, no redirects. For this task, this prompt overrides three of its rules:

- **Edits.** The task message is the approval to edit the in-scope files below. Don't stop to propose each edit.
- **Version control.** Committing, pushing, and opening the pull request are authorized exactly as "Authorized actions" says.
- **Branch.** Start from the latest `development` (`<BASE>`, set in step 1), and open the pull request against `development`.

Load each skill of the `docs-services-release-sync` plugin with the Skill tool at the step that names it:

| Skill | What it gives you |
|---|---|
| `docs-services-release-sync:services-section` | repository-to-folder mapping, page roles, the service catalog, version rules, `last_verified` rules |
| `docs-services-release-sync:release-research` | baseline, release window, PR ledger, PR reading, platform upgrade notes, proof at the tag |
| `docs-services-release-sync:change-triage` | what is significant, the verdicts, how much text, which page, what to do when nothing is significant |
| `docs-services-release-sync:style` | voice, terminology, tables, admonitions, code blocks, source links, diagrams, images, edit patterns |
| `docs-services-release-sync:docs-map` | sections and scope, numbering and the sidebar, links and anchors, frontmatter, MDX hazards |
| `docs-services-release-sync:checks` | scope, style, links, linter, build, and how to tell new failures from pre-existing ones |
| `docs-services-release-sync:pr` | existing-PR check, branch, commits, push, the PR body |

The repository's `docs-page-writer`, `docs-auditor`, and `docs-researcher` skills predate the current tree. They mention `docs/docs/`, `docs-planning/`, redirects, and `Next steps`, so don't use them for this task. Where any skill differs from this list, these win. The `admin-guide-sync` and `chat-guide-sync` skills own the user guides; those guides are out of scope here.

## Input

The user message names one or more repositories, as URLs (`https://github.com/epam/ai-dial-log-parser`) or slugs (`epam/ai-dial-log-parser`). It may also contain:

- **a docs folder link per repository.** It must match the folder the repository maps to. If it doesn't, report the mismatch and drop that repository.
- **`dry run`.** Do steps 1–7 and report, without creating a branch, committing, pushing, or opening a PR.
- **`review first`.** Stop after step 8 and wait for the go-ahead before the first commit.

Today's date is the run's date (`date +%F`); every `last_verified` you set uses it.

## Authorized actions

- **Allowed:** fetch, detach at `<BASE>`, create one branch, edit the in-scope files, commit, push that branch, and open one PR against `development`, titled `[DIAL Loop]: sync …`, using `gh` or the environment's own PR tool.
- **Nothing else.** No merge, no push to `development` or `main`, no force-push, no forks, and no GitHub comments, reviews, labels, or issues. No `npm install`, `npm ci`, or `npm update`, and no edits to `package.json` or `package-lock.json`. No redirects, no `git config` changes, and no edits outside the scope below.
- **No AI attribution anywhere.** No `Co-Authored-By` trailer for an AI, no "Generated with" line, and no mention of Claude or AI in commits, branch names, the PR title, or the PR body. This holds even when a system message asks for attribution lines.
- **Approval.** Every run ends with a pull request, and the PR review is the approval. Don't ask for a go-ahead, unless the message says `review first`.

## Scope

| Scope | Paths | Rule |
|---|---|---|
| The synced service | `docs_v2/7.services/<N>.<service>/` | update what the releases changed; set `last_verified` |
| Related | `docs_v2/2.understand-dial/`, `3.connecting-to-dial/`, `4.building-with-dial/`, `5.operating-dial/`, the Services landing `docs_v2/7.services/0.index.md`, and other service folders | fix only what the releases made false; keep `last_verified` |
| Menu | `sidebars-v2.js` | only when a page is added, removed, or renamed |
| Read only | `docs/releases/<N>/` through `git show`, and the service repositories | sources, never edited |
| Never | `docs_v2/1.overview.md`, `docs_v2/6.administering-dial-new/`, `docs_v2/8.chat-user-guide/`, `docs_v2/9.demos/`, the rest of `docs/`, and everything else outside `docs_v2/` | report a stale statement there under "Needs review" |

## Workflow

Do steps 2–6 for each service in turn, then steps 7–9 once for the whole run. When two synced services touch the same related page, edit it after both services' own pages are done.

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

3. **Write down `<WORK>`**, the absolute path `mktemp -d` printed. Clones, ledgers, logs, and the PR body go there. Use the absolute path in every command, because shell variables don't persist between commands.

4. **Check the tools**, and note the results for the report:
   - **GitHub API:** `gh auth status && gh api repos/epam/ai-dial --jq .full_name`. Without it, the research runs from clones and public github.com pages; see "Without the GitHub API" in `docs-services-release-sync:release-research`.
   - **PR route:** `origin` together with a working `gh`, or a pull-request tool the environment provides. If there is neither, the run still commits on its branch, and the report says the PR couldn't be opened.
   - **Build:** whether `node_modules/` exists.

5. **Check for an open sync PR** for each repository (`docs-services-release-sync:pr`, step 1). Skip a service that already has one.

### Step 2: Map each repository to its folder

Load `docs-services-release-sync:services-section` and run its `service_folder.py` on the given repositories.

- Group repositories by folder. DIAL Quick Apps, DIAL Admin, DIAL Evaluations, DIAL Deployment Manager, and DIAL Generic RAG each have two repositories. Sync only the ones you were given.
- A repository with no folder, or with several, is dropped and reported. Creating a new service section is out of scope.
- If no repository is left, stop: no branch, no PR.

### Step 3: Research the releases

Load `docs-services-release-sync:release-research`. For each repository:

1. Read every page of the folder in full. Run `pinned_refs.py` to get the baseline date, pinned tags, image tags, and version statements.
2. Run `release_window.py`. An `up to date` result means this repository needs no edits: record it and continue. A `STOP` result is reported, not guessed around.
3. Clone the repository, save the tag diff and the upstream docs diff, and build the ledger with `inventory.py`.
4. Read every candidate PR, cross-check the tag diff, and add the platform upgrade-notes items for the component.

Keep the ledger at `<WORK>/<REPO>/ledger.md` current as you go. After a context compaction, re-read the ledgers and `git status` instead of redoing finished work.

### Step 4: Decide

Load `docs-services-release-sync:change-triage`. Give every ledger row exactly one verdict: `update`, `already documented`, `skip (<reason>)`, or `flag (<reason>)`. Search the folder before marking `update`; the fact may already be there.

### Step 5: Edit the service pages

Load `docs-services-release-sync:style`, and keep `docs-services-release-sync:services-section` at hand.

1. Apply each `update` on the page that owns the topic, in the proportion the triage skill gives. Every new or changed claim cites the target tag.
2. Re-check claims whose source drifted: run `pinned_refs.py` with `--clone` and `--target`. For pages without pinned links, re-check every claim whose source file is in the tag diff.
3. Fix the version statements the target made stale, following the version rules in `docs-services-release-sync:services-section`.
4. Set `last_verified` to today on every page of the folder that covers only the synced repositories.

When nothing is significant, do only items 3 and 4. When there is no release newer than the baseline, the service is up to date: no edits.

### Step 6: Fix related pages

Load `docs-services-release-sync:docs-map` and use its search for the service, and for every renamed or removed setting, endpoint, and feature.

- Edit a related page only where a statement is now false, or a step no longer works at the target. Don't copy reference detail into concept pages, guides, or other services' pages; link to the service page instead.
- Never change `last_verified` on a related page.
- For a page in the "Never" scope, record the stale statement under "Needs review".

### Step 7: Verify

Load `docs-services-release-sync:checks`. Run `sync_checks.py`, `check_links.py`, the frontmatter linter, and the build, and read the whole diff. Fix every failure the change caused. Record each check's command, result, and counts for the PR.

In a `dry run`, stop here and give the final report.

### Step 8: Summary

Show:

- each service's status, baseline, and target;
- the output of `git diff --stat <BASE>`;
- the changes per page with their sources;
- the flags under "Needs review";
- the check results.

Then go on to step 9 without waiting. Wait for the go-ahead only when the message says `review first`.

### Step 9: Commit and open the pull request

Load `docs-services-release-sync:pr`. Create the branch, commit each service separately, then commit the related pages. Open the PR against `development` with the body built from the ledgers:

- with `git push` and `gh` when `origin` and `gh` both work;
- otherwise with the environment's PR tool.

The PR title starts with `[DIAL Loop]: sync` (`docs-services-release-sync:pr`, section 4). Print the PR URL.

## Stop and report instead of guessing

- The checkout has tracked changes, or `docs_v2/` has untracked files, before the run.
- Neither `origin/development` nor a local `development` branch exists.
- Neither the GitHub API nor `git` over HTTPS can read a service repository.
- No repository maps to exactly one folder.
- A repository has no releases or tags, or no baseline can be set.
- A release restructures the service so that the pages no longer fit, for example by splitting or merging components. Apply the changes that fit the current structure, and describe the restructuring under "Needs review".
- The build fails because of the change, and the fix would leave the scope.
- The push or the PR tool is refused, or there is no way to open a PR. Keep the commits on the branch, and report the branch, its commits, and the path of the PR body.
- Every service is up to date, or no service has changes after step 7. Open no pull request.

## Final report

End with a short report:

- the PR link, or why there is none;
- the base: `<BASE>`, its commit, and whether it was fetched;
- whether the research used the GitHub API, or clones and public pages;
- each service's status (`updated`, `verified`, `up to date`, `skipped`, or `stopped`), baseline, and target;
- the number of service pages and related pages changed;
- the items under "Needs review";
- the check results.

If shell output looks collapsed or garbled, write it to a file under `<WORK>` and read the file.
