---
sidebar_position: 2
title: Contribution guide
unlisted: true
---

The [EPAM RAIL team](https://epam-rail.com/about-us) manages [AI DIAL](https://epam-rail.com/about-us) as a multi-repository project. DIAL is API-first and can function as a headless system. All components, except for AI DIAL CORE (which exposes APIs), are optional. Each component publishes its own artifacts, which can be used independently. All components have designated owners. The AI DIAL platform is released as a stable assembly of its components in the form of Helm charts.

This document provides general guidelines for contributing to the project. Please note that some repositories may contain additional, specific recommendations.

# Quick Start
To deploy the entire platform, use [DIAL Helm](https://github.com/epam/ai-dial-helm). We highly recommend familiarizing yourself with this repository.

For instructions on how to build, test, run, and configure a specific component, please refer to the README.md file in the corresponding repository.

# Project structure
Here is the current list of repositories:

- [DIAL Helm](https://github.com/epam/ai-dial-helm) - the helm chart. Find stable assemblies here.
- [DIAL Core](https://github.com/epam/ai-dial-core) - the main component that exposes API.
- [DIAL SDK](https://github.com/epam/ai-dial-sdk) - the development kit for applications and model adapters.
- [DIAL Chat](https://github.com/epam/ai-dial-chat) - default UI.
- [DIAL Chat Themes](https://github.com/epam/ai-dial-chat-themes) - the static content and UI customizations for the default UI.
- [DIAL CI](https://github.com/epam/ai-dial-ci) - GitHub CI commons.
- [DIAL Assistant](https://github.com/epam/ai-dial-assistant) - model agnostic assistant/addon implementation for AI DIAL. It allows using self-hosted OpenAI plugins as AI DIAL addons.
- [DIAL Analytics Realtime](https://github.com/epam/ai-dial-analytics-realtime) - simple real-time usage analytics. That transforms logs into InfluxDB metrics
- Model adapters:
    - [DIAL Azure OpenAI Adapter](https://github.com/epam/ai-dial-adapter-openai) - a plugable Azure ChatGPT adapter.
    - [DIAL GCP VertexAI Adapter](https://github.com/epam/ai-dial-adapter-vertexai) - a plugable Google LLMs adapter.
    - [DIAL AWS Bedrock Adapter](https://github.com/epam/ai-dial-adapter-bedrock) - a plugable Amazon LLMs adapter (Anthropic Claude 1/2 is included).
    - More LLM adapters will be released (you may contribute)

Please see [repository map](https://epam-rail.com/open-source).

# Project Vision
AI DIAL is a secure, enterprise-grade, free LLM orchestrator that is API-first and model-agnostic. It is designed to be cloud-agnostic, providing horizontal features that simplify interactions with various models and LLM-centric applications, as well as the development of LLM applications. We strive to avoid dependencies on specific cloud or LLM vendors, compromises on scalability or security, excessive expansion of our tech footprint, or potential licensing risks. We typically design features as APIs, which custom extensions can leverage.

The solution is domain-agnostic. We prioritize use-case-agnostic generic features (such as rendering charts in the frontend based on model responses) over features that are overly specific to a single domain (like supporting medical anthologies). However, specific implementations can be built as extensions or derived works. For more information, refer to our [extension framework](https://epam-rail.com/extension-framework) and [API reference](https://epam-rail.com/dial_api).

## Feature Validation Checklist
Every new feature will be meticulously evaluated for:
- Overall correctness
- API-first design, ensuring usefulness for extensions and derived work
- Impact on performance
- Impact on the overall solution's security
- Impact on privacy: the platform is not intended to store personal data
- Compatibility with permissive licensing
- Compatibility with third-party solutions such as models, deployment orchestration systems, identity providers (SSO platforms), log, telemetry, or secret storages
- Impact on technology footprint
- Impact on overall system complexity

# Release Process
Individual components are released independently without a specific schedule. The platform itself is released as stable assemblies. The following section outlines the release process for the platform.

DIAL platform releases occur periodically according to a formal schedule. Typically, minor releases happen biweekly. However, if there are quality concerns, the release may be postponed for an additional week.

## Milestones
Since GitHub only supports milestones within a single repository, we use a custom field called `Milestones` in the [AI DIAL Project](https://github.com/orgs/epam/projects/22). The built-in milestone field is not used. When we refer to a milestone, we mean this custom field.

Milestones are used to indicate the target release version (and date) for a given issue. The milestone name format is `2023-Dec-6`. We maintain the scope of one current and two upcoming milestones. The plan for the current milestone can be considered accurate with minor deviations (subject to changes every Monday). The two upcoming milestones may undergo significant changes, but they provide an indication of our current objectives.

If an issue does not have a milestone, it is in the plan and not expected to be addressed in the near future.

## Schedule
Our weekly schedule is as follows:

* Every Monday is dedicated to planning. The most important issues are staged for completion in the current or next sprints by assigning the corresponding milestone.
* Every other Wednesday is the release day, when we publish release artifacts to public package repositories.
* Every Thursday, we review PRs/Issues that have not received immediate attention.

## Versioning
DIAL components adhere to [semantic versioning](https://semver.org/). We aim to maintain protocol compatibility between different minor releases, with breaking changes only occurring in major version updates. However, only stable assemblies from [DIAL Helm](https://github.com/epam/ai-dial-helm) have been fully tested for integration.

The version of a stable assembly is determined by the name of the Milestone.

Patch versions are only created to deliver hot fixes to an existing release.

## Release Support
Currently, AI DIAL does not offer Long-Term Support (LTS) versions. Therefore, we only **apply patches to the two most recent releases**, mostly security fixes or highly severe bugs. These updates occur alongside the standard release flow and include both bug fixes and potential security-related fixes. Given the rapid development in this field, patching earlier releases seems impractical. However, since DIAL does not contain any business logic or LLMs, frequent updates should not impact the application's logic.

If you require a patch for an older revision, please contact our [Business team](mailto:WFBMarketingAskEPAM@epam.com).

# Issues
The primary method for reporting defects or suggesting changes is to create an issue in the corresponding repository.

We categorize issues using the following labels:
- `bug` - to identify defects
- `enhancement` - for improvements of existing functionality or to suggest a new feature. In case it's hard to say if it's a `bug` or an `enhancement`, the `enhancement` label will be used.
- `question` - for seeking help with specific questions

Some issues may be closed with the following statuses:
- `invalid` - for incorrectly reported issues
- `wontfix` - for issues we are unable to fix

Issues can be opened by any developer or external contributor. Labels will be assigned by the development team or a planning manager once the issue is processed. Currently, we use a straightforward issue flow:

1. An issue is reported.
2. Once the implementation is planned, a milestone is assigned.
3. Once the issue is implemented and verified, it is closed.

# Branching Strategy
We follow the [old GitLab flow branching strategy](https://docs.gitlab.cn/14.0/ee/topics/gitlab_flow.html#github-flow-as-a-simpler-alternative) with release branches. Here are the key points:

- We maintain a single upstream branch called `development`.
- We do not use environment branches.
- We have branches named `release-<major>.<minor>` that point to the head of the corresponding supported release to simplify patch releases.
- When we're ready to publish a new release, we create/update a release branch. Scripts automatically update the version (in version files) based on the branch name and existing tags.
- Each release creates a git tag on a commit `major.minor.patch` and publishes the corresponding artifacts (Docker images, libraries).
- Development occurs in feature branches (an issue reference in the name is mandatory) or forks. Once ready for review, a PR into `development` must be opened (an issue reference in the name is mandatory).
- After a PR is merged into development, scripts automatically update the version (in version files) to the highest existing tag and increment the minor version by one. In case we merged a commit with `BREAKING CHANGE` in a title, major version will be updated instead. Then, we publish artifacts with the version `major.minor.patch-rc`.
- We follow an "upstream-first" approach. To patch an existing release, we first fix the `development` branch and then cherry-pick the necessary commits into the branch based on the release to be patched.
- Only in rare cases when a fix is no longer relevant for `development`, we may skip the previous step and create a PR directly to `release`. The merge will be done with a squash.
- When merging PRs into `development`, we squash commits with a fast-forward merge.
- When merging from `development` to `release`, we do not squash commits.

# PRs
Direct commits into DIAL repositories are only permitted for repository owners. Other team members and external contributors are expected to submit their PRs into `development` from their forks. 

## Contribution Gates
Reviewing PRs can require significant time and effort from the development team, potentially impacting the team's delivery pace and focus. Therefore, before committing to a review, we need to ensure that the PR meets the following basic criteria:

- Unit tests are mandatory for new features and fixes. A test cannot be considered a unit test if it performs network communications with other services.
- All unit tests should pass in the PR.
- In addition to unit tests, we will run [end-to-end tests](https://github.com/epam/ai-dial-chat/tree/development/e2e) on a private environment. These tests need to pass.
- Linting checks (checkstyle, black, etc.) must pass.
- The PR should reference an issue that includes a description (see the [Issues](#issues) section).
- An issue with `approved-contribution` (see below) to ensure the change complies with the product vision. 
- Since we squash commits, we don't have specific requirements for commit titles (use common sense). However, the PR name must comply with [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/).
- There must be no merge conflicts upon initial submission and during each subsequent review iteration.
- Coding principles must be respected.

Once the PR is ready for review, the issue will be reassigned from the contributor to the reviewer.

## Getting Your PR Review into Scope
DIAL is developed with a specific vision in mind, and we aim to avoid it becoming a collection of loosely connected features. Therefore, we only add features that align with this vision. Even if you're willing to contribute to the codebase, reviewing PRs requires additional work from a maintainer. Hence, it's advisable to check if maintainers will have sufficient time to promptly review your PR.

Begin your contribution by opening a GitHub issue and explaining the change you intend to make. Please explicitly mention in its title or beginning of the description that this is something you want to develop. This issue will be labeled as `external-contribution` once processed. Engage in the discussion with the development team, which may respond immediately or later (as we dedicate Thursdays to issue processing). Once an agreement is reached, the maintainer will confirm this in the comments and add the `approved-contribution` label. Then, a planning manager will assign an estimated milestone to this issue. The assigned milestone will indicate when the development team will have time to review your contribution. You may work on the code in parallel with this discussion, but there's no guarantee of a review or ETA for changes that don't have the `approved-contribution` label. Furthermore, we may close such PRs if the author has no intention of seeking approval.

## Code Review
We adopt code review principles from Google as described in [Google's How to do a code review](https://google.github.io/eng-practices/review/reviewer/), except we don't guarantee to review external PRs within one day, as mentioned above.

# Coding Principles
The codebase should remain clean, concise, and well-structured. Every PR should improve the codebase. Good code is optimized for readability and maintains a balance between the principles below. While none should be applied absolutely, a bold violation of any principle will result in a rejected PR.

## No Magic
When multiple alternative approaches exist, we should strive for transparency and choose the more imperative approach over a declarative one that hides details under a complex implementation.

## No New Tech Dependencies Without Justification
Any new technology added to the dependencies must have strong justification submitted with the PR. This must include a clear description of goals, long-term consequences analysis, analysis of alternatives, and a review of related dependencies already used in the DIAL ecosystem. Adding multiple frameworks/libs for solving the same problem is not allowed.

## No Reinventing the Wheel
The "not invented here" principle should be avoided. Reimplementing standard or well-known functionality from commonly used libraries is not allowed unless strongly justified in a PR. Particularly strong reasons are required to reimplement functionality not related to the component's main purpose.

## No Overengineering
Any code generalization that makes the code larger is usually a bad idea. A bottom-up approach should be used until we have a reasonable number of examples to generalize. We should strive for current code readability and not anticipate too much about the future. Slight code duplication is much cheaper to maintain than incorrect abstractions and premature generalization.

## No Grand Code
In addition to the previous point, long and complicated implementations are usually wrong. Therefore, code conciseness is a good quality metric. **PRs with over lines 1000 changed (excluding tests and docs) will be rejected due to their size, with rare exceptions.**

## No Dead Code
Any dead code spotted should be removed immediately. No dead code is allowed in PRs. All ideas for the future should be kept in issues, forks, and branches, rather than affecting the main codebase maintenance.

## No Changes Without Test Coverage
PRs without tests will not be accepted. Both positive and negative scenarios (when applicable) should be covered.

## No Modes/Regimes
The introduction of config flags, modes, or regimes is a last resort option. Regimes exponentially increase the complexity of the code as every possible combination must be tested and documented. The introduction of a regime requires the most severe justification.

## No Grand Comments Explaining the Code
Code is the most formal and explicit way to explain things. If this is not true for your code, it indicates overengineering. Comments should explain motivation, not implementation. To describe algorithms and scientific methods, please refer to publications or an original article.

# Communication Channels
- For defects and feature requests open issues in the corresponding repo: [https://github.com/epam/ai-dial-*](https://github.com/search?q=ai-dial+in%3Aname+org%3Aepam&type=repositories) 
- To contact the code owners team: WFBMarketingAskEPAM@epam.com
- To report a security issue: WFBMarketingAskEPAM@epam.com
- For business and sales inquiries: WFBMarketingAskEPAM@epam.com
- For press and media inquiries: WFBMarketingAskEPAM@epam.com
- For informal chat with the dev team and other adopters: [Discord](https://discord.gg/3TPc4zV4gS) / #RAIL

# Getting Help
First, please check our regularly updated [FAQ](https://example.com), as your question may already have been answered.

If you have a specific question, you can open an issue with the `question` label.

If you're unsure and would like to speak with someone, you can join the #RAIL discord channel on [this server](https://discord.gg/3TPc4zV4gS) and ask people there.
