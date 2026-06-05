---
title: "Component compatibility matrix"
type: reference
persona: devops
component: helm
last_verified: 2026-06-05
owner: "@dial-docs-team"
---

# Component compatibility matrix

:::info Coming soon
A consolidated matrix — every DIAL component version across every platform release in one
table — is in progress. Until it lands, use the authoritative version data already published
with each release (links below).
:::

DIAL ships as a **platform release** (a Helm stable assembly) that pins a compatible set of
component versions. Each release's upgrade guide lists the exact Helm chart versions and the
version of every component in that assembly, plus any cross-component incompatibilities called
out for that release.

## Where to find component versions today

Each upgrade guide opens with a **Versions** section (Helm chart versions and main component
versions) and a **Before upgrade** section that flags release-specific incompatibilities:

- [Upgrade to DIAL 1.43](changelog/upgrade-to-1.43.md)
- [Upgrade to DIAL 1.42](changelog/upgrade-to-1.42.md)
- [Upgrade to DIAL 1.41](changelog/upgrade-to-1.41.md)
- [Upgrade to DIAL 1.40](changelog/upgrade-to-1.40.md)
- [Upgrade to DIAL 1.39](changelog/upgrade-to-1.39.md)
- [Upgrade to DIAL 1.38](changelog/upgrade-to-1.38.md)

For the full list of releases, see the **[Changelog](changelog/index.md)**.
