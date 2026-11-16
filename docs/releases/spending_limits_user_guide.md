# Managing user spending limits via the API (M1)

A task-oriented guide for the **DIAL admin / operator**. It covers the basic M1 use cases: personal defaults, project grants, team budgets, and how several budgets stack.

Sources: the design `design/spending_limits_m1_core.md` (section numbers such as "design 2.6" refer to it) and the DIAL Core implementation, verified against `ai-dial-core` (branch `fix/snyk-dependency-vulnerabilities`, HEAD `aa2b217f9`). **Where the two differ, this guide follows Core.** The main differences are listed in the box below.

> **Differences between the design and Core.**
> - The resource types are `policies` and `policy_assignments` (the design proposed `limit_policies` and `limit_assignments`).
> - A priority tie that creation can see is rejected with `409`, and any two budgets with `roles` subject rules count as overlapping (see section 6).
> - `per` is **required** and must be exactly `["subject"]`; it has no default.
> - `source` on an assignment is free text, not a fixed list.
> - Core ships extra pieces the design does not describe: the counter sweeper and the `dial_budget_personal_missing` gauge.
>
> The admin endpoints are marked `x-preview` in Core's OpenAPI spec, so they may still change.

> **Authentication.** Policy endpoints are admin-only (`403` otherwise). The examples use `Authorization: Bearer $ADMIN_TOKEN` as a placeholder for "an admin credential"; use whatever your deployment accepts for admin access.

---

## 1. The idea in one minute

Every model call with a cost is paid by exactly one **budget**. If no budget can pay, the call gets `429`.

A budget is built from two records:

| Record | Says | Written |
|---|---|---|
| **Policy** (limit policy) | *What* the money is: object set, amount per window, sharing, kind, `priority` | once, reusable |
| **Assignment** | *Who* it reaches (`subject`) and *where* it counts (`costObject`, the project) | once per grant or ticket |

Policy and assignment together must pin `subject` and `costObject` **exactly once**. Two forms follow from that:

- **Bound**: a reusable policy that pins nothing, plus an assignment that supplies *who* and *where*. This is what a ticket produces.
- **Self-applying**: one policy that pins its own *who* and *where*. No assignment record. This is used for tier defaults and team budgets.

A budget with its own counters is called a **budget instance**. Its id is the assignment id, or the policy id for a self-applying policy.

### What M1 supports

| Axis | M1 |
|---|---|
| Callers | JWT users only. API-key callers stay on the legacy role `costLimit` |
| Kind | `budget` only (caps are M2) |
| Quantity | `cost` only |
| Windows | `day` and `month` (calendar windows) |
| Sharing | `per: ["subject"]`: each matched user gets their own counter |
| Objects | `"*"` or an explicit list of model names (no packages) |
| Stacking | inside **one cost object** only, in authored `priority` order |

---

## 2. Before you start

### 2.1 Cutover mode and the personal cost object

Core's top-level config holds:

```json
{ "spendingLimits": { "mode": "off", "defaultCostObject": "ORG" } }
```

| `mode` | Legacy `costLimit` | Budgets |
|---|---|---|
| `off` | enforces | inactive |
| `shadow` | still enforces | resolved and charged; "no budget" and "exhausted" are logged (INFO, with reason, user, cost object and model) and metered, never returned as 429 |
| `enforce` | ignored for JWT callers | enforced; 429 is returned |

Recommended order: define personal defaults and project grants, run in `shadow`, read the would-be 429s, fix gaps, then flip to `enforce`. Rollback is a config change (design 6.8).

When the mode is `shadow` or `enforce` and the personal cost object has no unexpired cost budget, Core logs a warning on every config rebuild and sets the gauge `dial_budget_personal_missing` to 1. Use it to catch a missing default before the flip. It is a warning only.

The **cost object** of a call is, in order:

1. the project of a JWT caller: the claim named by `identityProviders.*.projectPath` (set it to the claim that holds the project),
2. otherwise the project of the API key (`Key.project`),
3. otherwise the personal cost object, `ORG` by default.

Only JWT callers are checked against budgets; API-key callers always stay on the legacy `costLimit`. `defaultCostObject` follows the folder-name rules (no `/`, no `%`). Choose that name once, before writing policies, and make sure no real project uses it, because Core cannot detect the collision (design 6.1).

### 2.2 URLs and naming

Both record types are admin-only in M1 and live under the `platform` bucket:

| Record | URL |
|---|---|
| Global policy | `/v1/policies/platform/<name>` |
| Project policy (incl. self-applying) | `/v1/policies/platform/<costObject>/<name>` |
| Assignment | `/v1/policy_assignments/platform/<costObject>/<id>` |

Methods: `PUT` (create or update), `GET`, `DELETE`. `POST` returns `405`. Any bucket other than `platform` returns `404`.

| Call | Success | Notes |
|---|---|---|
| `PUT` | `200`, body `{"name": "<path>"}`, header `ETag` | Create and update are the same call. Add `If-None-Match: *` to make it create-only, or `If-Match: <etag>` to update only the version you read |
| `GET` | `200`, the record (with `id` set to its path) and `ETag` | `404` if missing |
| `DELETE` | `204` | `404` if missing; `If-Match` is honoured |

Bulk creation through `POST /v1/admin/apply` accepts manifests of kind `Policy` and `PolicyAssignment` (`{ "kind", "name", "spec" }`). It is also preview, so this guide uses single-record `PUT`.

Naming rules:

- The record name is the **last part of the URL**. An `id` in the body is optional, but if present it must equal the path (`422` otherwise).
- One folder level only: `<costObject>/<id>`. The folder is the cost object and must equal the record's `costObject`.
- No `/` and no `%` inside a name element, and each element must match the entity-name pattern `[A-Za-z0-9._:@\[\]()-]`. A malformed path gives `400`.
- An id must be unique inside a cost object **across** assignments and self-applying policies (`409` on a clash).

Status codes of `PUT` and `DELETE`:

| Code | Meaning |
|---|---|
| `400` | malformed path or JSON, an unknown field, a wrong type |
| `403` | not an admin |
| `409` | priority tie with another budget (see section 6), name already taken by the other record type, or deleting a policy that an assignment still references |
| `412` | `If-Match` / `If-None-Match` precondition failed |
| `422` | a validation rule is broken (the message says which) |

### 2.3 Shell setup used in the examples

```bash
export DIAL_URL=https://dial.example.com
export ADMIN_TOKEN=...   # an admin credential
```

---

## 3. Use case 1: a personal default budget per tier

**Goal.** Chat and other project-less calls must have a budget. Every user with the role `costLimit-1000` gets $100 per month.

The default is **defined by you**. Nothing in Core creates or implies one. With no personal policy, every project-less call gets `429` "no budget" once you enforce.

One policy per tier, self-applying, in the personal cost object folder:

```bash
curl -X PUT "$DIAL_URL/v1/policies/platform/ORG/personal-standard" \
  -H "Authorization: Bearer $ADMIN_TOKEN" -H "Content-Type: application/json" \
  -d '{
    "priority": 100,
    "kind": "budget",
    "quantity": "cost",
    "object": "*",
    "per": ["subject"],
    "cost": { "month": 100 },
    "subject": [ { "source": "roles", "function": "EQUAL", "targets": ["costLimit-1000"] } ],
    "costObject": "ORG"
  }'
```

Required fields of every policy: `kind` (`budget`), `quantity` (`cost`), `priority`, `object`, `per` (exactly `["subject"]`, no default), and `cost` with at least one window. A window you leave out is **not limited**; `day` and `month` are the only windows, and each amount must be greater than 0. The fields `attachedTo`, `harness`, `broker` and `packages` are reserved and rejected ("not supported yet").

For another tier, write another policy with a different id, amount **and priority**, for example `ORG/personal-elite` with `costLimit-3000` and `priority: 90` (the role name is yours). Two tier policies share the same `roles` source, so with the same priority the second `PUT` returns `409`.

What happens:

- Everyone carrying that role gets their **own** $100 counter. No per-user records are needed.
- The budget pays only calls whose cost object is `ORG`, that is, calls with no project.

Pitfalls:

- **Overlapping tiers add up.** A user matching two tier policies gets both piles (design 6.5, T15). Write the tier rules so they do not overlap.
- **Amounts must be positive.** Zero or less is rejected (`422`), because zero already means "access denied" in Core's role limits.
- **Core has no tool that converts role `costLimit` values into tier policies.** The design describes a proposing tool, but I found none in Core. Read the amounts from your roles and write one policy per tier yourself.
- **Overlapping `roles` rules at the same priority are rejected.** Two budgets whose subjects both use `roles` always count as overlapping, so give each tier its own priority (section 6).

---

## 4. Use case 2: a user budget on a project (ticket)

**Goal.** A ticket approves $500 per month for `sergey` on project `IMF`, for models `opus` and `sonnet`.

**Step 1: the policy, once.** It pins nothing, so it can be reused by every ticket. `priority` is required on every budget policy.

```bash
curl -X PUT "$DIAL_URL/v1/policies/platform/anthropic-pro-500" \
  -H "Authorization: Bearer $ADMIN_TOKEN" -H "Content-Type: application/json" \
  -d '{
    "priority": 10,
    "kind": "budget",
    "quantity": "cost",
    "object": ["opus", "sonnet"],
    "per": ["subject"],
    "cost": { "month": 500 }
  }'
```

**Step 2: the assignment, per ticket.**

```bash
curl -X PUT "$DIAL_URL/v1/policy_assignments/platform/IMF/TKT-48812" \
  -H "Authorization: Bearer $ADMIN_TOKEN" -H "Content-Type: application/json" \
  -d '{
    "policy": "anthropic-pro-500",
    "subject": [ { "source": "sub", "function": "EQUAL", "targets": ["sergey"] } ],
    "costObject": "IMF",
    "source": "ticket",
    "ticket": "TKT-48812"
  }'
```

What happens:

- A call by `sergey` whose project claim is `IMF` (the claim named by `identityProviders.*.projectPath`) to `opus` or `sonnet` is paid from this budget, $500 per month.
- Chat and other projects do not touch it. A call to `gpt` is not in the object set, so this budget is not a candidate for it.
- The record becomes visible on every pod a moment later. Limits are soft, so this is acceptable.

Rules to remember:

- The assignment carries **no amount, no object set, no `per`, no window and no `priority`**. Sending any of them is rejected with a message that the field "belongs to the policy". A different amount means a different policy.
- The assignment pins `subject` and `costObject` only if the policy does not (and the policy must pin the other way round). Pinned by both or by neither gives `422`.
- `subject` is a list of rules, OR-composed. Rule fields: `source` (`roles`, `email`, or a dotted JWT claim path such as `sub`), `function` (`EQUAL`, `CONTAIN`, `REGEX`, `TRUE`, `FALSE`), `targets`. `EQUAL` and `CONTAIN` ignore case; `REGEX` must match the whole value. Every function except `TRUE` and `FALSE` needs non-empty `targets`, and a `REGEX` target must compile.
- **`*` is not a wildcard.** `EQUAL` with `["*"]` only matches a value that is literally `*`. To reach every JWT user use `{ "source": "sub", "function": "TRUE" }`.
- A rule whose `source` claim is missing from the token does not match, even with `TRUE`.
- An **empty** subject list is rejected (`422`), so a mistake can never reach everybody.
- The policy named in `policy` must already exist (`422` otherwise). A project policy (`<costObject>/<name>`) can only be used by assignments in the same folder.
- `sub` is matched against the raw JWT claim, while the counter key is the Core user id (`userIdPath`, default `sub`). They coincide in the default setup.

---

## 5. Use case 3: a budget for a whole project team

**Goal.** Every member of `imf-devs` gets $300 per month on project IMF. Each member has an **own** counter.

**Self-applying form**: one record.

```bash
curl -X PUT "$DIAL_URL/v1/policies/platform/IMF/base-300" \
  -H "Authorization: Bearer $ADMIN_TOKEN" -H "Content-Type: application/json" \
  -d '{
    "priority": 20,
    "kind": "budget",
    "quantity": "cost",
    "object": "*",
    "per": ["subject"],
    "cost": { "month": 300 },
    "subject": [ { "source": "roles", "function": "EQUAL", "targets": ["imf-devs"] } ],
    "costObject": "IMF"
  }'
```

**Bound form**: use this when the same amount serves several projects. Write the policy once, then one assignment per project. Use it *instead of* the self-applying form for the same team: in one project both would carry priority 20 on `roles` rules, and the second write returns `409`.

```bash
# policy, once (global, pins nothing)
curl -X PUT "$DIAL_URL/v1/policies/platform/monthly-300" \
  -H "Authorization: Bearer $ADMIN_TOKEN" -H "Content-Type: application/json" \
  -d '{ "priority": 20, "kind": "budget", "quantity": "cost",
        "object": "*", "per": ["subject"], "cost": { "month": 300 } }'

# assignment for IMF
curl -X PUT "$DIAL_URL/v1/policy_assignments/platform/IMF/base" \
  -H "Authorization: Bearer $ADMIN_TOKEN" -H "Content-Type: application/json" \
  -d '{ "policy": "monthly-300", "costObject": "IMF",
        "subject": [ { "source": "roles", "function": "EQUAL", "targets": ["imf-devs"] } ] }'

# assignment for PHX, same policy
curl -X PUT "$DIAL_URL/v1/policy_assignments/platform/PHX/base" \
  -H "Authorization: Bearer $ADMIN_TOKEN" -H "Content-Type: application/json" \
  -d '{ "policy": "monthly-300", "costObject": "PHX",
        "subject": [ { "source": "roles", "function": "EQUAL", "targets": ["phx-devs"] } ] }'
```

Each assignment is its own budget instance with its own counters. Changing `monthly-300` to 350 changes **both** projects.

---

## 6. Use case 4: several budgets for one user (stacking and priority)

**Goal.** Alice has a dedicated $500 budget for `gpt` and a general $1000 budget for everything, both on project IMF. Can she spend $1500?

Yes. Budgets that match one call are separate piles that **add up**. The pile whose policy has the **lowest `priority`** is checked first. The first pile with money left pays. When it is dry, the next one pays.

```bash
# policies (global)
curl -X PUT "$DIAL_URL/v1/policies/platform/gpt-500" \
  -H "Authorization: Bearer $ADMIN_TOKEN" -H "Content-Type: application/json" \
  -d '{ "priority": 1, "kind": "budget", "quantity": "cost",
        "object": ["gpt"], "per": ["subject"], "cost": { "month": 500 } }'

curl -X PUT "$DIAL_URL/v1/policies/platform/all-1000" \
  -H "Authorization: Bearer $ADMIN_TOKEN" -H "Content-Type: application/json" \
  -d '{ "priority": 2, "kind": "budget", "quantity": "cost",
        "object": "*", "per": ["subject"], "cost": { "month": 1000 } }'

# assignments for alice on IMF
curl -X PUT "$DIAL_URL/v1/policy_assignments/platform/IMF/alice-gpt" \
  -H "Authorization: Bearer $ADMIN_TOKEN" -H "Content-Type: application/json" \
  -d '{ "policy": "gpt-500", "costObject": "IMF",
        "subject": [ { "source": "sub", "function": "EQUAL", "targets": ["alice"] } ] }'

curl -X PUT "$DIAL_URL/v1/policy_assignments/platform/IMF/alice-all" \
  -H "Authorization: Bearer $ADMIN_TOKEN" -H "Content-Type: application/json" \
  -d '{ "policy": "all-1000", "costObject": "IMF",
        "subject": [ { "source": "sub", "function": "EQUAL", "targets": ["alice"] } ] }'
```

What happens on a call to `gpt`: `alice-gpt` pays first. When it is used up, `alice-all` pays. A call to any other model skips `alice-gpt`, because `gpt` is the only model in its object set.

How priority works:

- `priority` is an integer on the **policy**, required, lower burns first. **There is no default order.**
- Leave gaps (10, 20, 30) so a budget can be inserted later.
- Every assignment of one policy shares its position. A project that needs a different position needs a different policy.
- Two budgets of **different policies** that can both pay one call must have **different** priorities. `PUT` returns `409` when it can see the overlap: the object sets intersect and the subjects can match one caller. Two assignments of the **same** policy may share a priority; they are ordered by id.
- What counts as visible overlap (Core's rule): rules on different sources always overlap, and **any two `roles` rules overlap**, because a caller holds several roles. On one other source, `EQUAL` targets overlap when they are equal ignoring case (or one contains or matches the other); two `REGEX` rules overlap only when identical. A `TRUE` rule overlaps everything and `FALSE` overlaps nothing.
- So two role-based budgets on the same objects need different priorities even for different roles (for example `imf-devs` and `imf-leads`). The design's trace T13 (two role budgets with equal priority, accepted at creation) would be a `409` in Core.
- A tie that creation cannot see, for example rules the check cannot compare, is resolved at call time by instance id, ascending, and logged and metered (`dial_budget_ambiguous_priority_total`). The call is not refused.
- Updating a policy re-runs these checks for all its assignments. Changing `priority`, `object`, `subject` or `costObject` can produce a `409` (a tie) or a `422` (an assignment that would become invalid).
- Stacking is **inside one cost object**. A dry `IMF` budget never spends alice's personal `ORG` budget, and a project call with no assignment for that project gets `429` even if `ORG` has money.

---

## 7. Changing, withdrawing and re-granting

| Operation | How | Effect on the counter |
|---|---|---|
| **Update** | `PUT` the same record id | Kept. Spend already counted stays counted |
| **Withdraw** | `DELETE` the assignment (or self-applying policy) | Enforcement stops. The counter is no longer used; the sweeper deletes it once both its windows have closed (see below) |
| **Re-grant** | `PUT` a **new id** | A new, empty counter |
| **Change a policy** | `PUT` the policy | Re-scopes every assignment that references it, including `priority` |
| **Delete a policy** | `DELETE` the policy | `409` while any assignment references it; the message lists some of them |

Mutable on an assignment: `policy`, `subject`, `expiresAt`, `description`, `ticket`. The name and `costObject` cannot change: `costObject` must equal the folder of the path.

The counter lives at `platform/limits/<costObject>/budgets/<instance id>/<user>/<model>/costs` and is internal (no URL). Core runs a sweeper (`budgetCounterSweep.period`, default 5 minutes; `batch`, default 500 rows per tick) that deletes a counter row once both its windows have closed and no assignment or self-applying policy exists for its budget. So a withdrawn budget's counter is not kept for reports.

### Raise a budget and keep the spend

Point the assignment at another policy (for example `anthropic-pro-700`, created like the one in section 4 with the same `priority`). The id, and so the counter, is kept. The `409` tie check compares the new policy only with budgets of *other* policies, so this is accepted unless another budget with a different policy ties with it:

```bash
curl -X PUT "$DIAL_URL/v1/policy_assignments/platform/IMF/TKT-48812" \
  -H "Authorization: Bearer $ADMIN_TOKEN" -H "Content-Type: application/json" \
  -d '{ "policy": "anthropic-pro-700",
        "subject": [ { "source": "sub", "function": "EQUAL", "targets": ["sergey"] } ],
        "costObject": "IMF", "source": "ticket", "ticket": "TKT-48812" }'
```

### Withdraw, then start from zero

```bash
curl -X DELETE "$DIAL_URL/v1/policy_assignments/platform/IMF/TKT-48812" \
  -H "Authorization: Bearer $ADMIN_TOKEN"

# later: a new id means a new empty counter
curl -X PUT "$DIAL_URL/v1/policy_assignments/platform/IMF/TKT-49100" \
  -H "Authorization: Bearer $ADMIN_TOKEN" -H "Content-Type: application/json" \
  -d '{ "policy": "anthropic-pro-500", "costObject": "IMF",
        "subject": [ { "source": "sub", "function": "EQUAL", "targets": ["sergey"] } ],
        "source": "ticket", "ticket": "TKT-49100" }'
```

If alice's budget was withdrawn with $400 of $500 spent, the re-grant gives her a fresh $500, not $100.

Good to know:

- **Do not rewrite the id to "reset".** To keep spend, update. To restart, withdraw and create a new id.
- **Changing `subject`** on a `per: ["subject"]` budget does not move counters. Users who stay matched keep theirs. Users who drop out keep an unreferenced counter until cleanup.
- **Tier moves** (a user changes role) switch the matching policy and so the counter: a fresh counter, no carry-over. A downgrade can therefore raise total spend in a period. This is a known, accepted effect.
- **Windows roll over by themselves.** On the 1st of the month nothing runs: a stale counter simply counts as zero.

---

## 8. Expiring (interim) grants

An assignment can expire. After `expiresAt` it is **not effective**: it is skipped when budgets are resolved, and it no longer takes part in the priority-tie check. The record stays until you delete it. Self-applying policies have no expiry.

Extra fields (all optional):

| Field | Meaning |
|---|---|
| `expiresAt` | ISO-8601 date-time **with an offset** (`2026-12-31T00:00:00Z`); `422` if it does not parse. It must be in the future when you create the record or change the value; saving other changes to an already expired assignment is accepted |
| `source` | free text recording where the grant came from, for example `ticket`, `backfill` or `admin`. Core stores it and does not validate or use it |
| `ticket` | external ticket reference, stored as text |
| `description` | free text |

Typical case, the cutover backfill of the design (6.8): give a user an interim grant that is replaced by a ticketed one. Core has no backfill tool, so you create these assignments yourself, for example from the would-be 429s you saw in `shadow`. Use a dedicated tier policy with a **high** priority number (for example 90), so any ticketed grant in the same project (lower number) pays first and the interim budget is only the fall-through.

```bash
curl -X PUT "$DIAL_URL/v1/policy_assignments/platform/IMF/backfill-sergey" \
  -H "Authorization: Bearer $ADMIN_TOKEN" -H "Content-Type: application/json" \
  -d '{
    "policy": "tier-1000-month-100",
    "subject": [ { "source": "sub", "function": "EQUAL", "targets": ["sergey"] } ],
    "costObject": "IMF",
    "source": "backfill",
    "expiresAt": "2026-12-31T00:00:00Z"
  }'
```

(`tier-1000-month-100` is an admin-defined global policy, month $100, priority 90.)

Known temporary effect: a user in N projects can spend up to N times the tier amount until the interim grants are replaced.

---

## 9. Inspecting and verifying

### Read the records

```bash
# one record
curl "$DIAL_URL/v1/policy_assignments/platform/IMF/TKT-48812" -H "Authorization: Bearer $ADMIN_TOKEN"

# metadata of a record
curl "$DIAL_URL/v1/metadata/policy_assignments/platform/IMF/TKT-48812" -H "Authorization: Bearer $ADMIN_TOKEN"
```

Listings use the metadata endpoint with a folder path that ends with a slash:

```bash
# project policies and assignments of IMF
curl "$DIAL_URL/v1/metadata/policies/platform/IMF/"            -H "Authorization: Bearer $ADMIN_TOKEN"
curl "$DIAL_URL/v1/metadata/policy_assignments/platform/IMF/"  -H "Authorization: Bearer $ADMIN_TOKEN"

# the root: global policies and the cost object folders
curl "$DIAL_URL/v1/metadata/policies/platform/"                -H "Authorization: Bearer $ADMIN_TOKEN"
```

### What the user sees

`GET /v1/user/limits` and `GET /v1/user/usage` gain an additive `budgets[]`. Each entry has `costObject`, `policy` (the policy path), `priority`, and `day` and `month` windows with `{ total, used, resetsAt }`. The legacy top-level cost stats keep working. Counters have no URL; this is the way to read them.

### Check the effect of a change

1. In `shadow` mode, make a call as the user, with and without a project claim.
2. Check `budgets[]` in `GET /v1/user/limits` for the expected `total` and the growing `used`.
3. Look for logged and metered "no budget" and "exhausted" outcomes before moving to `enforce`.

### Reading a 429

| `message` | `display_message` | Meaning | Fix |
|---|---|---|---|
| `No budget covers <model> for cost object <costObject>` | `You have no budget for this model` | no candidate budget for this user, project and model | add an assignment, or define the tier policy for `ORG` |
| `Budget exhausted for cost object <costObject>` | `You've exceeded your budget` | every candidate is used up in a window | wait, or raise or add a budget |

Both come as `429` with the Azure-style body (`{error:{code,message,display_message}}`). Only the "exhausted" answer carries `Retry-After`: whole seconds, rounded up, until the earliest instant at which any candidate budget has money again. The "no budget" answer has no retry time, because waiting does not help.

On the Claude Code and Codex routes in `enforce` mode, Core also reports the caller's budget as spend caps when the caller has exactly one budget in the cost object; see Core's `docs/anthropic-spend-limits.md` and `docs/codex-spend-limits.md`. On those routes the exhausted answer has no display message.

Limits are soft: the check compares recorded spend, so one call (especially a streaming one) can overshoot the budget. The overshoot is recorded in full on the budget that paid.

---

## 10. Cheat sheet and common mistakes

| Symptom | Likely cause |
|---|---|
| `422` "pinned by neither" | neither the policy nor the assignment pins `subject` (or `costObject`) |
| `422` "pinned by both" | the policy already pins it; the assignment must not |
| `422` empty `subject` | use `{ "source": "sub", "function": "TRUE" }` for everyone |
| `422` `costObject` differs from the folder | the path must be `<costObject>/<id>` |
| `422` "does not exist" | the `policy` of an assignment is missing, or is a project policy of another cost object |
| `422` "belongs to the policy" | an amount, `priority`, `per` or object set was sent on an assignment |
| `422` priority, `per`, `cost` | a budget policy needs `priority`, `per: ["subject"]` and a positive `cost.day` or `cost.month` |
| `422` "must be in the future" | `expiresAt` is in the past |
| `400` unknown field | a typo or a field Core does not know; the body must match the record schema |
| `409` same priority | another budget of a different policy in the cost object has the same priority and can pay the same calls; give them different priorities. Any two `roles` rules overlap |
| `409` name taken | an assignment and a self-applying policy cannot share an id in one cost object |
| `409` policy delete | an assignment still references it |
| "Everyone" rule reaches nobody | `EQUAL` with `*` is not a wildcard; use `TRUE` |
| Project call gets 429 "no budget" though `ORG` has money | project calls never spend the personal budget; add a project assignment |
| All chat calls get 429 | no personal tier policy defined for the user's role |
| API-key caller ignores the budgets | by design in M1: keys stay on the legacy role `costLimit` |
| A project behaves like chat | its name equals the personal cost object name; Core cannot detect that collision |

Not in M1: pools and other `per` shapes, caps, packages (`@name`), key and PAT subjects, token or request budgets, fall-through across cost objects, a default stacking order.
