---
name: change-triage
description: Use when deciding whether a change shipped in a DIAL service release belongs in the docs - a PR, commit, release-note line, upstream doc change, or platform upgrade note - including how much text it deserves, which page owns it, and what to do when a release has nothing worth documenting.
user-invocable: false
---

# Release change triage

The docs describe what a platform engineer needs to deploy, configure, upgrade, integrate, and secure a service. They are not a changelog. Most PRs in a release don't belong in the docs; a few matter a lot. The job is to find those few, document them well, and leave everything else out.

## The test

A change is **significant** when the answer to any of these is yes:

1. **Act**: Must someone configure, call, deploy, or secure the service differently because of it?
2. **Upgrade**: Does upgrading to the target break something, flip a default, need a migration step, change cost, or require another component's version?
3. **Truth**: Does it make a sentence, table row, example, or caveat on the docs false?

If all three answers are no, the verdict is `skip`, however large or interesting the change is.

## Verdicts

| Verdict | When | What happens |
|---|---|---|
| `update` | significant, and missing or wrong in the docs | edit the page that owns the topic; cite a tag-pinned source |
| `already documented` | significant, and the docs already state it correctly | nothing |
| `skip (<reason>)` | not significant | listed in the PR under "Reviewed, not documented" |
| `flag (<reason>)` | significant, but not provable from released source, or it needs a human decision | text unchanged; listed under "Needs review" |

## Significant

| Kind | Examples |
|---|---|
| Settings | an environment variable, property, chart value, CLI option, or manifest field is added, renamed, removed, or deprecated; a default changes; validation tightens (newly required, new allowed values, new limits) |
| Features with a surface | a capability that is turned on, configured, or called: a new auth mode, endpoint, tool type, provider, model family, or integration; a Preview feature that becomes GA; a feature removed |
| API contract | endpoints, parameters, request or response fields, status codes, streaming events, authentication, MCP tools |
| Deployment | image name or registry, ports, health endpoints, runtime or base image, user and UID, writable paths, a new required service, minimum versions of dependencies or other DIAL components, database migrations that need privileges |
| Security | authentication, authorization, credential handling, forwarded headers, encryption, data written to logs, defaults that expose or restrict |
| Upgrade | breaking changes, migration steps, paired upgrades ("upgrade together with X"), defaults that flip on upgrade, cost-relevant behavior |
| Docs truth | a documented limitation, known issue, or workaround is fixed; something the docs call unreleased ("the `development` branch adds X") is released; a version a page names is now stale |
| Upstream docs | the service's own docs add, change, or remove a description of a setting, endpoint, behavior, deployment step, or limitation, and the code at the target confirms it |

## Not significant

Skip these, and give the reason in the ledger:

- Dependency and library upgrades, including CVE fixes, that change no setting or behavior. The exception is a page that names that dependency's version: then update the version (`inventory.py --folder` flags these).
- Refactoring, performance work, internal metrics, log lines, and diagnostics. The exceptions are a surface the page already documents (for example a metrics table or a log format) and a change that adds a setting.
- Tests, CI, build tooling, code style, release chores, and local development setups.
- Bug fixes that make the service behave as the docs already say.
- Upstream doc changes that only fix wording, formatting, or links, or that cover contributor topics.
- Anything only on `development`, or only in a pre-release that is not the target.
- UI-only changes: screens, labels, layouts. They belong to the Admin and Chat user guides, which have their own sync skills. Note them under "Needs review" only when a services page describes that UI.

## Gray zones

- **Preview features off by default.** A new setting that turns one on is a table row, marked Preview the way the page marks others. Write a subsection only when the page already documents Preview features in depth, as the Quick Apps capability pages do.
- **A fix that changes documented behavior** (an error code, a limit, an edge case the page describes) is `update`. A fix that restores documented behavior is `already documented`.
- **A new optional dependency or integration** is significant only when it has a setting or a deployment step.
- **A release that only re-tags.** For example, OpenAPI to MCP 0.2.2's notes list only "sync development into release-0.2 (#43)". Expand it: the PRs it carries and the tag diff decide.
- **Can't prove it?** If the PR says one thing and the code at the target says another, document the code. If the code can't settle it, the verdict is `flag`.

## How much text

| Change | Text |
|---|---|
| a new setting | one table row in the subsystem's table |
| a changed default | edit the Default cell and every sentence that repeats the old value |
| a behavior change | one sentence in the section that describes that behavior |
| a breaking change or migration step | one sentence that names the version, or a **Warning** when it risks data loss, downtime, security exposure, or cost |
| a deprecation | the row stays, and its Description starts with `**Deprecated.**` and names the replacement; on a page with a `## Deprecated variables` or `## Deprecated fields` section, it goes in that section's table instead |
| a removal | delete the row or text, and every mention across docs_v2 |
| a substantial feature with a configuration surface | a subsection in the owning page: one paragraph, its settings table, its sources |
| a feature with no home that would overload the owning page | a new page, as a last resort; say so in the PR |

Never write "What's new", "New in X", "since version X", or a per-release page. The overview's `:::info` block already links the releases.

## Which page

Put each fact on the page that already owns its topic; the `docs-services-release-sync:services-section` skill lists the page roles. A setting goes into its subsystem's table, an endpoint into the API page, a dependency into the dependencies table, a deployment requirement into the overview's Deployment section. If another page already states the fact, change it there and link to it rather than repeating it.

## When nothing is significant

When every item is `skip` or `already documented`:

1. Set `last_verified` to today on the pages that cover the synced repositories.
2. Fix only the version statements that the new target made stale: "checked against" numbers, platform-release pins, the service's own image tags in examples, "In <VERSION>, …" caveats, and "no release has it yet" sentences. `pinned_refs.py` lists them.
3. Change nothing else. The PR records that the docs were verified against the target.

When there is no release newer than the baseline at all, the repository is up to date: no edits and no PR.

## Worked examples

These are checked against the releases named.

| Change | Verdict and edit |
|---|---|
| OpenAPI to MCP 0.2.2: the notes say only "sync development into release-0.2 (#43)", but the tag diff adds `PATH_PARAMS_ALLOW_RESERVED` and `MCP_VALIDATE_OUTPUT` (`CONFIGURATION.md` L42, L48) | `update`: add both rows to the environment variables page. Delete "The `development` branch adds … No release has them yet." Re-check each "In 0.2.1, …" warning at 0.2.2. |
| OpenAPI to MCP 0.2.2, #36: bump `fastmcp` from 3.4.5 to 3.4.10, while the configuration page says "FastMCP 3.4.5, which 0.2.1 locks" | `update`: the page names this dependency's version; verify it in `poetry.lock` at the target |
| Quick Apps Backend 0.14.0, #710: an app without a `dial_files` block now gets every `internal_file_*` tool, including the ones that write and delete | `already documented`: the manifest page already gives the default as "On, all tools". Search the folder before you write; pages are sometimes written ahead from `development`. |
| Quick Apps Backend 0.14.0, #693: ten Preview features promoted to GA | `already documented`: the capabilities index already lists one Preview feature. Its sentence "In 0.13.2, one capability is in Preview" is a stale version statement, though. Re-check it at the target, then state it without the version. |
| Quick Apps Backend 0.14.0, #703: authlib and dnspython upgraded for CVEs | `skip (dependency upgrade, no setting or behavior change)` |
| Quick Apps Backend 0.14.0, #669: timed milestones in the execution-time stage | `skip (diagnostics detail; SHOW_EXECUTION_TIME_STAGE is already documented)` |
| Core 0.50.7, #2311: dynamic client registration and PKCE for applications' external services, which need `toolsets.security.allowedRedirectUris` | `update` the `toolsets.security.allowedRedirectUris` row in Toolsets security: the list now also gates external services, and a missing entry makes saving fail with `400`. No page documents applications' external services yet, so a new subsection for them is `flag (new topic; needs a decision)`. |
| Helm `dial-8.2.1`: `charts/dial/Chart.yaml` adds the `modelProvider` alias (L47–L51), while the platform chart page says "chart 8.1.0 has no alias for it" | `update`: the Note and the aliases table are now false |
| Evaluation Framework Backend 0.6.0: new `TEST_SUITE_RUN_EXEC_MAX_RESP_BODY_BYTES`; `TEST_CASE_MULTI_TURN_MAX_TURNS` default from `10` to `30` | `update`: one new row and one Default cell |
| Admin Frontend 0.23.0: access decisions move to DIAL Core's `GET /v1/user/role-assignments`; `NIM_ENABLED` removed | `update`: a Warning with the upgrade step, the removed row deleted, and every mention of NIM removed |
| Log Parser 0.3.0, #21: no failure when the root of `assembled_response` is a list | `already documented`: the page says a non-object response root yields a null answer |
