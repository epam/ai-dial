---
name: impact
description: Use when deciding whether a change in the epam/ai-dial service pages, user guides, or release documents requires an edit in Understand DIAL, Connecting to DIAL, Building with DIAL, or Operating DIAL - finding the guide pages it touches, the significance test for guide readers, the verdicts, which source proves a guide statement, how much text an edit deserves, the rules for adding and removing text, and worked examples from this repository.
user-invocable: false
---

# Guide impact triage

A guide is not a second reference. It explains a mechanism, walks a reader through a task, or helps an architect decide, and it links the reference for detail. Most source changes leave every guide true. The job is to find the guide statements that a PR in the window made false, the steps it broke, and the few new capabilities a guide's reader must know about, and to change exactly those.

## 1. Find the candidates

```bash
python3 -I "${CLAUDE_SKILL_DIR}/scripts/impact.py" --work <WORK> [--section <NAME> ...]
python3 -I "${CLAUDE_PLUGIN_ROOT}/skills/checks/scripts/repo_refs.py" > <WORK>/repo-refs.txt
```

`impact.py` reads `changes.json` and `releases.json` and writes `<WORK>/impact.md`: per target page, the triggers ranked high, medium, and low.

| Trigger | Fires when the guide page |
|---|---|
| `link` | links a source page that changed, moved, or was removed; high when the anchor is a changed, renamed, or removed section, or the page is gone |
| `id` | names an identifier that a source page removed; high when no source page has it any more |
| `value` | names the key of a table row that changed, with an old value nearby (high) |
| `version` | names a version, image tag, or chart version that the window or a release replaced |
| `hub` | links three or more service folders and never names a new service |
| `release` | names a release feature, or an identifier the release removed or deprecated |

Work through every high and medium trigger. Skim the low ones. Then read the two lists at the end, "Source entries with no trigger" and "Release features no target page names". The topic map in `docs-services-review-and-update-relatives:sections` says which guide pages depend on each source; a new capability matters to the page whose reader needs it, even when that page has never mentioned it.

`repo-refs.txt` lists paths in this repository that a guide points to and that no longer exist. Each one is a broken step.

For each candidate, open the guide page and read the whole section around the line, then the source text. Decide with the test below and write one ledger row.

## 2. The test

An edit is warranted when one of these is true:

1. **False.** A sentence, list item, table cell, example value, version, link description, or diagram on the guide now contradicts a source page at `<BASE>` or a release document.
2. **Broken.** A step in a tutorial or how-to no longer works: a removed or renamed setting, endpoint, file, folder, value, or screen; a changed default the step relies on; a new required setting without which the step fails.
3. **Incomplete where it claims to be complete.** The page lists all members of a set (services, adapters, providers, identity providers, limit mechanisms, API surfaces) or calls itself the hub for a topic, and the set gained or lost a member.
4. **Missing for this reader.** A released capability changes how this page's reader decides or acts on the page's own topic, the page already covers that topic, and a source page documents it. Example: budgets that can replace role cost limits, on the page that tells operators how to cap spend.

If none is true, the verdict is `skip`, however interesting the change is.

## 3. Verdicts

| Verdict | When | What happens |
|---|---|---|
| `update` | the test passes and the sources prove the new text | edit the page; one ledger row per edit, with its source |
| `already consistent` | the guide already says it, or says nothing a change contradicts | nothing |
| `skip (<reason>)` | the test fails | listed in the PR under "Reviewed, not changed" |
| `flag (<reason>)` | the test passes, but the sources can't settle the text, the fix is an editorial decision, the page is out of scope, or the fix needs a test run | text unchanged; listed under "Needs review" |

## 4. What proves a guide statement

- **Service pages are the authority for service facts.** They are verified against released code by the service sync. Cite the page and its heading.
- **The user guides are the authority for screens.** A guide that describes an Admin or Chat screen follows them.
- **Release documents** prove what a platform release ships and which component versions it pins, which features are Preview, and what operators must do on upgrade. The upgrade notes are precise; the release notes are product language.
- **A guide follows the service pages, not ahead of them.** When a release document describes a change that the service page doesn't show yet, such as a newer chart or image version or a new required variable, the guide stays as it is: flag it, and name the service sync that should run first ("run the service sync for `epam/ai-dial-helm`"). The service docs set the pace.
- **Release behavior with a documented feature.** A guide may state behavior that the upgrade notes describe when a service page documents the feature it belongs to, so the reader has a reference to follow. Mark it Preview if the sources do. If no source page documents the feature at all, the verdict is `flag (release documents only)`.
- **Never from release notes alone:** positioning, product names, marketing claims, model line-ups.
- **When sources disagree**, don't choose. Flag it, quoting both.

## 5. How much text

A guide edit is the smallest change that makes the page true for its reader. Keep the page readable as it is now: a reader who knew the old page should notice only that it is correct.

| Change | Edit |
|---|---|
| a false statement | rewrite only the false part of that sentence or cell; keep the sentence's shape |
| a removed thing (setting, endpoint, page, feature) | delete only the sentence, bullet, row, or link that names it, and repair the list or paragraph around it; a whole paragraph or section is a `flag` (section 6) |
| a renamed thing | replace the name everywhere on the page; fix the link and its anchor |
| a broken step | fix the command, value, path, or screen name, keeping the step's numbering and its `**Verify:**` line; if the sources don't say what replaces it, `flag` |
| a fixed limitation ("In 0.2.1, … fails unless …") | delete the caveat once a source says the fix shipped |
| a new minimum version | change the number only where a source states it |
| a member added to a complete list | one entry in the list's own format, worded from the Services landing row or the source page's first sentence, with a link |
| a new capability for this reader | one or two sentences, in the section that discusses that need, ending with a link to the reference; on a bold-lead list, one bullet in that form |
| a new related page the reader will need | a Further reading entry, only if the block has fewer than six |
| a whole new topic | `flag (new topic; needs a decision)`; never a new section or page in this task |

Never copy a settings table, a defaults list, or a sequence of reference facts into a guide; link it. Never add "new in", "since", or a release number to describe a change; state current behavior. A minimum version stays when a reader acts on it.

## 6. Adding and removing

People wrote and reviewed these pages. A run changes them only where a PR in the window requires it, and adds and removes less than it could. A PR's description says what changed; it doesn't decide what a guide says.

**Add a fact** only when all four hold:

1. It passes the test (section 2): a complete list gained a member, a step needs a new required setting, or a released capability changes how this page's reader decides or acts.
2. A PR in the window introduced it, and a source page at `<BASE>` documents it. The ledger names the page and its heading.
3. The page already covers the topic: the fact extends what one of its sections says, and the page's scope stays the same.
4. It takes the smallest form in section 5: a clause, one or two sentences, a list item, or a table row in a shape the page already uses, with a link to the source page for the detail.

Otherwise the verdict is `skip (reference detail no guide states)`, or `flag (new topic for this page; needs a decision)` when the reader needs it but the page doesn't cover the topic. Never add a section, a page, a diagram, an example, or a Further reading block in this task.

**Remove or rewrite existing text** only when both hold:

1. A PR in the window made it false: it removed, renamed, or changed the setting, endpoint, component, screen, value, or step that the text describes, and the page at `<BASE>` confirms it.
2. The edit takes out or rewrites only the false part: a word, a value, a clause, a list item, a row, or a link. The rest of the sentence, the paragraph, and the section stays.

- When something replaces the removed thing, put the new name or value in place instead of deleting the sentence: Redis to Valkey, an old setting to its successor.
- Removing a whole paragraph, section, step, example, or diagram node is `flag (removes <WHAT>; needs a decision)`, never `update`.
- Never remove text because no source mentions it any more, because it repeats a service page, because it reads as dated, or because a PR's description calls it outdated while the page at `<BASE>` doesn't prove it.
- Never revert or redo what a person changed on a target page in the window. `changes.md` lists those pages at the end; treat their changes as deliberate.

## 7. Which page

Edit the page whose claim is false or whose reader needs the fact, and only that page. When several guide pages say the same thing, fix each false statement, but add a new fact to one page and link it from the others only if they already point there. Concept pages in Understand DIAL get the what and the why, the how-tos in Operating DIAL get the setting and the step, the tutorials get only what their steps need.

## 8. Out of scope pages and service gaps

Record these under "Needs review", with the path, the line, and why: a stale statement on `1.overview.md`, `6.administering-dial-new/`, `7.services/`, `8.chat-user-guide/`, or `9.demos/`; a service page that lags a release; a repository path that is gone.

## Worked examples

These were checked against this repository on 2026-11-25.

| Change | Verdict and edit |
|---|---|
| `#688` adds DIAL MCP Gateway, a new service folder | `already consistent` for `2.understand-dial/3.capabilities/8.coding-agents-and-harnesses.md`: the same PR added a bullet and a Further reading link there. `skip (selective list)` for the glossary (13 of 24 services), architecture highlights (11 of 24), and the DIAL stack (7 of 24). `flag (out of scope)`: `1.overview.md` lists every service except MCP Gateway. |
| Release 1.50: Budgets and Spending Policies (Preview); Core documents `spendingLimits.mode` (`off`, `shadow`, `enforce`) in `14.global-settings.md#spending-limits` | `already consistent` for `2.understand-dial/5.security-and-governance/5.usage-limits-and-cost-control.md`, which explains the three modes. `update` for `5.operating-dial/7.production-readiness/6.cost-control.md`: it calls itself "the operational hub" for the settings that enforce limits and names only role limits; add one bullet under Step 1 linking the spending limits settings. |
| Release 1.50: Organization Units (Preview); Core documents `orgUnits.enabled` in `2.settings/7.access.md#sharing-and-org-units`, and the 1.50 upgrade notes say "Inside a unit, its roles decide who reads and writes; folder read rules grant nothing there" | `update` for `2.understand-dial/5.security-and-governance/2.authorization-rules-and-spaces.md`: its sentence that a sub-folder's effective rule includes all parent restrictions is no longer the whole story. Add two sentences after it: org units are Preview and off by default, and inside a unit its roles decide access. Link the Core setting. |
| `#680` removes `dial-docker-compose/` from the repository | `flag (step broken; new location undecided)`: `repo_refs.py` finds four local-setup tutorials that clone this repository and `cd` into `dial-docker-compose/<scenario>`, and the section overview that describes the folder. The folder exists on neither `development` nor `main`, and no source says where the files live now. |
| `5.operating-dial/2.cloud-deployment/8.admin-installation.md` names chart `dial-admin` 0.20.0 and images `0.22.0` and `0.22.1`; release 1.50 ships chart 0.21.0 and Admin 0.23.0 | `already consistent` with `7.services/12.helm/1.configuration/4.dial-admin.md`, which still describes chart 0.20.0. `flag (the Helm pages are not synced to 1.50; run the service sync for epam/ai-dial-helm, then this page follows)`. |
| Tutorials pin old images: `epam/ai-dial-adapter-dial:0.14.0` in the DIAL-to-DIAL adapter tutorial, `ai-dial-core:0.25.1` and `ai-dial-chat:0.26.0` in five Custom App pages (`4.building-with-dial/1.apps/4.custom-apps/1.`–`4.`, `6.`); release 1.50 ships 0.21.0, 0.50.1, and 1.3.1 | `flag (pinned images behind release 1.50; a tutorial's pins change only with a test run)`, as one "Needs review" line per page. The pins are still released versions, so nothing is false. |
| `#687` replaces Core's Redis page with `3.valkey.md`: Core speaks the Redis protocol, settings keep the `redis` prefix, Redis stays supported | `skip (still true)` for "managed Redis-compatible service", "Azure Cache for Redis", and `aidial.redis.*` in the guides. A sentence saying the chart bundles Redis would be `update`: the chart bundles Valkey. |
| `#683`: the Admin guide's "Max retry attempts" now counts every attempt, including the first | `already consistent`: the guides speak of retries in general ("caps retries per deployment") and state no count. |
| Release 1.50: all adapters ship as DIAL Model Provider | `already consistent`: the Services landing marks the standalone adapters "Will be deprecated; use DIAL Model Provider", the model deployment guides configure Model Provider, and architecture highlights says the adapters run in one service. |
| Release 1.50: DIAL Loop (Preview), and a five-product line-up in the release notes | `flag (release notes only)` for DIAL Loop: no source page documents it. The line-up is positioning: never rewrite `1.what-is-dial.md` from release notes. |
| Release 1.50 adds the Claude 5.5 family; the Claude Code tutorial's example uses `anthropic.claude-opus-4-8` | `skip (example values; the reader sets their own deployment IDs)` |
| `#683`: Evaluation Framework's `TEST_CASE_MULTI_TURN_MAX_TURNS` default from `10` to `30` | `skip (reference detail no guide states)` |
