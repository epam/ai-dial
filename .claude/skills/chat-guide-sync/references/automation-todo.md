# Automation TODO (the mechanics — do this when ready to automate)

The skill's decision-making is **done and validated** (detect -> gather -> reconcile
-> write -> PR format, proven on real version jumps 1.0.4->1.0.6 and 1.0.4->1.1.8).
Everything below is the **plumbing** that makes it run by itself and open a PR. None
of it changes *what* the agent writes — only *how* it runs unattended.

Pick this up when the team is ready to turn automation on. Until then, the skill is
usable **manually** today (invoke it; it runs the scripts, writes edits, you review
and commit).

## What's already in place (don't rebuild)

- `resolve_version.py`, `detect.py`, `gather.py`, `assemble_pr.py` — tested.
- The write step — agent behavior per `m2-verify-and-write.md`, in place, validated
  as drafts (never yet *landed* in a real run).
- `crop.py`, `mask.py` + `capture-and-prose.md` — capture know-how for M3.

## What's left — in build order

### Step A — Drift check on GitHub (verify-only, safe first)
Smallest "GitHub runs it by itself" step. Fully scriptable, no agent, no writes.
- [ ] A GitHub Action in THIS repo that fires on a new DIAL release (see "Fire
      signal" below).
- [ ] It runs `resolve_version.py` + `detect.py`.
- [ ] If pages are affected, it **opens an issue** listing them (the work list).
- [ ] Prove the loop end to end: release -> workflow runs -> issue appears.

### Step B — Full sync on GitHub (write + PR)
Turns the drift issue into an actual PR. Needs the agent to run in CI.
- [ ] **Run the agent in CI** — Claude Code (headless) or the API, invoked from the
      Action, executing the skill's `update` action against the work list. This is
      the real architectural piece; everything else is small.
- [ ] **Branch + commit + open PR** — mechanical git/`gh`:
      branch off `main`, commit the agent's edits + the `manifest.yaml`
      `last_verified_chat_version` bump, `gh pr create` with the body from
      `assemble_pr.py`. (`gh` is available in Actions; it was NOT in the dev
      environment, which is why this was deferred.)
- [ ] PR body = the 3-bucket format; Recapture + Flag items carried through.

### Step C — Screenshot capture (later; V1 leaves these to a human)
- [ ] Decide capture strategy: headless (Playwright + seeded test account as CI
      secrets + screenshot-diff) vs. human-assisted (agent emits a shot list).
- [ ] If headless: the `fixtures/` + disposable-items whitelist (pre-authorized demo
      content) so capture needs no runtime approval.
- [ ] Apply `capture-and-prose.md` discipline (masking, sidebar privacy, coordinate
      convention, `crop.py`/`mask.py`).

## Open decisions / prerequisites (resolve at Step A/B)

- **Fire signal** — new folder under `docs/releases/<N>/` committed to `main`, vs.
  the GitHub *release* object on the ai-dial repo. (Left open earlier.)
- **Where the workflow lives** — this (docs) repo, watching ai-dial-chat indirectly
  through the DIAL release doc. We don't own ai-dial-chat's workflows.
- **CI secrets** — Claude credentials for the agent; a token for `gh pr create`;
  (Step C) a test-env URL + seeded account.
- **auto-mode gates** — in auto mode the human gates become the PR review + committed
  config (manifest, later fixtures), NOT runtime prompts. Confirm this is acceptable
  before turning Step B on.
- **Draft vs report for new features** — agreed V1: option A (draft a best-effort
  section from source + hard flag). Keep unless revisited.

## Caveats to carry forward

- **First real write is unproven at scale.** The write step has only produced drafts.
  The first unattended run should be watched, ideally scoped to one page.
- **Baseline bump.** `last_verified_chat_version` is `1.0.4`. Every successful sync
  must bump it (in the same PR) or the next run re-flags everything.
- **en.json noise is handled** (key-level namespace routing), but a very large jump
  (minor-version) will still flag most pages — expected; reconcile filters it.
- **The agent, not a script, writes.** Any "make it deterministic" instinct is wrong
  for the write step — keep the human PR review as the safety net.
