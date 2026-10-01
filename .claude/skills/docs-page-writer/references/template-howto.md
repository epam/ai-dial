# How-to Template

Use this template when `type: how-to` in frontmatter.

How-tos are **task-oriented**. They help a competent user accomplish a specific goal. The reader already knows what they want to do — they need the steps.

## Rules

- One goal per page. Title starts with a verb: "Configure…", "Add…", "Rotate…", "Enable…"
- Assume baseline familiarity with DIAL. Don't explain what DIAL Core is.
- Alternatives are welcome (unlike tutorials). "You can also configure this via environment variable."
- No learning outcomes section — this isn't a tutorial.

## Structure

```markdown
---
title: "Configure rate limits"
type: how-to
persona: devops
component: core
last_verified: 2026-04-27
owner: "@dial-core-team"
---

# Configure rate limits

Rate limits control how many requests a user or role can make to a deployment
within a time window. This guide covers configuration via the admin API and
via static config files.

## Prerequisites

- DIAL Core running (local or deployed)
- Admin API access or file system access to the Core config directory

## Configure via Admin API

1. Send a `POST` request to `/v1/admin/rate-limits`:

       curl -X POST https://<YOUR_DIAL_HOST>/v1/admin/rate-limits \
         -H "Api-Key: <YOUR_ADMIN_KEY>" \
         -H "Content-Type: application/json" \
         -d '{
           "deployment": "gpt-4",
           "role": "default",
           "limit": 100,
           "window_seconds": 3600
         }'

2. Verify the rate limit is active:

       curl https://<YOUR_DIAL_HOST>/v1/admin/rate-limits \
         -H "Api-Key: <YOUR_ADMIN_KEY>"

## Configure via config file

Add the following to `rate-limits.json` in the Core config directory:

    (config example)

Restart DIAL Core for changes to take effect.

## Related tasks

- [Roles and rate limits](/operating/auth/roles-rate-limits) — understand the role model
- [Usage limits and cost control](/administering/usage-limits) — set cost caps per user

## Next steps

- [Monitoring](/operating/observability/metrics) — track rate limit hits in your dashboards
- [Alerting](/operating/observability/alerting) — set up alerts for rate limit exhaustion
```

## Anti-patterns to avoid

- **Turning into a tutorial** by explaining basics. The reader knows what rate limits are.
- **Burying the steps** under three paragraphs of context. Goal → Prerequisites → Steps.
- **Missing the "Related tasks" section.** How-tos connect to each other.