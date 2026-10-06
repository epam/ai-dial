# Session handoff — doc-sync skills

Context for picking this up in a new session.

## The big picture

Goal: keep two DIAL user guides in sync with the apps they document, eventually
automatically (a DIAL release triggers a GitHub Action that updates the guide and
opens a PR for human review). Two skills, same design:

- **`chat-guide-sync`** — for the Chat guide (`docs_v2/chat-user-guide-new/`).
  Lives on branch **`chat-userguide-review`** (committed). Single source repo
  (`epam/ai-dial-chat`). Engine built + validated; guide is current, so it only
  needs steady-state syncing. Automation (trigger/PR/agent-in-CI) not built —
  see its own `references/automation-todo.md`.
- **`admin-guide-sync`** — for the Admin guide (`docs_v2/5.administering-dial/`).
  Lives on branch **`admin-userguide-sync`** (from `feature/doc_improvements`,
  NOT committed — staged in working tree). FIVE source repos. This is the active work.

Both replace the old, retired `chat-guide-capture` skill (deleted on the chat branch;
its keepers were harvested into `chat-guide-sync/references/capture-and-prose.md`).

## How the engine works (both skills)

```
DIAL release upgrade doc  -> component version(s)         [resolve_version.py]
per version: component release notes = git TAG annotation [changelog.py]  <- PRIMARY targeting
git diff baseline..target of the source repo             [detect.py]      <- authoritative detail
route changed paths -> guide pages via manifest `sources`[detect.py]
per page: pull the changed specs/code = evidence          [gather.py]
agent reads evidence, decides write/no-op/flag            [references/m2-verify-and-write.md]
agent writes text directly; flags screenshots for a human
assemble the PR body (Done / Recapture / Flag)            [assemble_pr.py]
```

KEY LESSON (learned by under-reporting in a test): **lead with the changelog
(`changelog.py`), then read the diff GUIDED by it.** A raw multi-release diff is too
big to eyeball and will hide changes. `openspec/specs` is only a partial signal
(incomplete at old baselines). The changelog (annotated git tag message) is the
developer-written list of what actually shipped per version.

Reconcile verdicts: matches / changed / new / removed / cosmetic. New feature with no
section -> draft it + hard-flag (option A). Text only in V1; screenshots -> Recapture
list. Never write an unverified claim as fact -> Flag list.

## admin-guide-sync — current state

Files in `.claude/skills/admin-guide-sync/`:
- `SKILL.md` — orchestrator (modes auto/manual; actions verify-only/update/rebuild).
- `manifest.yaml` — 5 repos (with per-repo `baseline` + `signals`), 20 pages mapped
  to `sources`. THE keystone.
- `scripts/` — resolve_version, changelog, detect, gather, assemble_pr (all multi-repo),
  + crop/mask (for later screenshot capture).
- `references/catch-up-plan.md` — the phased plan (READ THIS FIRST).
- `references/m2-verify-and-write.md` — the write contract + PR format.
- `references/capture-and-prose.md` — screenshot discipline (later) + write lessons.

The 5 repos and baselines (guide currently covers **DIAL 1.43**):
| repo | baseline (1.43) |
|---|---|
| ai-dial-admin-frontend | 0.16.0 (NX/Next; `openspec/specs` + `locales/en.ts` + `src/components`) |
| ai-dial-admin-deployment-manager-backend | 0.16.0 (Java, code only) |
| ai-dial-admin-backend (deprecating) | 0.16.0 (Java, code only) |
| ai-dial-admin-evaluation-framework-backend | null — did NOT exist at 1.43 (Java, has specs) |
| ai-dial-admin-evaluation-metrics | null — did NOT exist at 1.43 (Python) |

Latest release is **1.48** (admin components 0.21.0; eval 0.4.0 / 0.3.0). It was
pulled into this branch's `docs/releases/1.48/` from origin/main (the branch otherwise
only had up to 1.47).

### Phases
- Phase 0 (confirm baseline) — DONE: guide covers 1.43.
- Phase 1 (multi-repo engine) — DONE + validated (resolve/changelog/detect/gather).
- Phase 2 (map 20 pages) — DONE + validated (19/20 flag on 1.48; compliance-faq is
  static, correctly excluded; eval repos surface as all-new).
- Phase 3 (the actual catch-up 1.43->1.48) — NOT STARTED. The real content work.
- Phase 4 (automation: trigger, PR open, agent-in-CI) — NOT STARTED.

### Decisions made
- **Evaluation is IN scope** — the guide gets a NEW Evaluation section (no baseline,
  no old-guide equivalent), sourced from the two eval repos + frontend eval UI. A
  planned (commented) `12.evaluation.md` page sits in the manifest; create it in Phase 3.
- Old guide `docs/tutorials/3.admin` is a **consultation reference only** — never
  ported page-by-page (new guide is structured differently).
- en.ts labels handled coarsely in V1 (it's TypeScript, not JSON); lean on specs/code.
- Do the catch-up **release by release** (1.43->1.44->...->1.48), page by page — NOT
  one 5-release jump (that hides changes).

## Next step

Phase 3, first slice: **1.43 -> 1.44, one page at a time.**
1. `python scripts/changelog.py --repo ai-dial-admin-frontend --from 0.16.0 --to 0.17.1`
   (and the other repos) to see what shipped.
2. `python scripts/gather.py --release 1.44` for the evidence bundles.
3. Reconcile + write per page per `m2-verify-and-write.md`, every changelog line
   reaching a verdict. Propose writes for review before applying (user gates the
   first real write).
Then advance to 1.45, 1.46, 1.47, 1.48. Create the Evaluation section along the way.

## Gotchas / environment
- Repo rule: **never commit/push** without explicit permission (user handles git).
  This branch's work is uncommitted on purpose.
- `gh` CLI is NOT available in the dev environment (it IS in GitHub Actions) — that's
  why "open the PR" is deferred to the automation phase.
- Windows: git needs `core.longpaths=true` (scripts set it); subprocess git calls
  decode UTF-8 explicitly (en.ts/diffs break cp1252).
- Shallow clones / tag fetches of the 5 repos cache under the OS temp dir
  (`admin-guide-sync-cache/<repo>`); they persist within a session.
- `resolve_version` reads `docs/releases` from the CURRENT branch — make sure the
  target release folder is present (pull from origin/main if needed, as 1.48 was).
```
