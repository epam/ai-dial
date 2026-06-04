---
title: "Admin quick start"
type: tutorial
persona: admin
component: admin
last_verified: 2026-06-01
owner: "@dial-docs-team"
---

# Admin quick start

In this tutorial, you will sign in to DIAL Admin and complete your first administration tasks: reviewing the registered entities, approving a pending publication, and checking access rules. By the end, you will know where the core management surfaces live and how to act on them. This path is for administrators who manage models, applications, access, and governance for a DIAL deployment.

## Prerequisites

- Access to a running DIAL deployment that includes [DIAL Admin](../administering-dial/0.index.md). If you do not have one, follow the [DevOps quick start](devops-quick-start) first, or use a deployment provided by your platform team.
- An account with the administrator role in that deployment.
- The URL of the DIAL Admin interface, provided by your platform team.

## Step 1: Sign in to DIAL Admin

Open the DIAL Admin URL in your browser and sign in with your administrator account.

**Verify:** the DIAL Admin dashboard loads and the left navigation lists sections such as Entities, Deployments, and Access Management.

## Step 2: Review the registered entities

Open the **Entities** section. Entities are the models, applications, routes, and tool sets that DIAL Core exposes through the [Unified API](/docs/platform/3.core/0.about-core.md).

1. Open [Models](../administering-dial/entities/models.md) and confirm which models are registered.
2. Open [Applications](../administering-dial/entities/applications.md) and review the available applications.

**Verify:** you can see at least one entity and open its configuration.

## Step 3: Approve a pending publication

[Publication](../administering-dial/6.publications-and-review.md) is the workflow that promotes a user's resource to the shared Marketplace. Every request needs administrator approval.

1. Open the **Approvals** section.
2. Select a pending request, review its contents, and approve or reject it.

**Verify:** an approved resource appears in the Marketplace for its target audience.

:::note
If no publication requests are pending, this step is informational. Return to it when a user submits a resource for review.
:::

## Step 4: Check access rules

Open the **Access Management** section to see how access is granted.

- [Roles](../administering-dial/access-management/roles.md) define permissions, usage limits, and cost limits.
- [Keys](../administering-dial/access-management/keys.md) authenticate API clients and map them to roles.

**Verify:** you can open a role and see the resources and limits it grants.

## What you learned

- How to sign in to DIAL Admin and navigate its main sections
- Where models, applications, and other entities are managed
- How to approve a publication and where access rules are defined

## Next steps

- [Admin Panel overview](../administering-dial/0.index.md) — full reference for every DIAL Admin section
- [Operating DIAL: auth and access control](../operating-dial/auth-and-access-control/index) — configure roles, keys, and identity providers
- [Operating DIAL: configuration reference](../operating-dial/configuration/index) — the settings behind the entities you manage
