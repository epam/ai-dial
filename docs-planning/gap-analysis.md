# DIAL Documentation - Gap Analysis

> **Status:** Draft

* * *


## 1. Navigation and menu structure

### 1.1 Duplicate titles, different content

The same label appears in multiple sidebar locations, pointing to different pages with overlapping but non-identical content.

| Duplicated title | Location 1 | Location 2 | Problem | Duplicated title | Location 1 | Location 2 | Problem |
| :-- | :-- | :-- | :-- | :-- | :-- | :-- | :-- |
| Access Control | "Introduction to Access Control in DIAL" — Menu: Platform > Architecture & Concepts > Access Control Overview — URL: https://docs.dialx.ai/platform/architecture-and-concepts/access-control | "Access Control in DIAL" — Menu: Platform > Core > Access Control — URL: https://docs.dialx.ai/platform/core/access-control-intro | Both cover access control. The first is a high-level conceptual overview (subjects, objects, roles). The second is a detailed technical treatment (authorization rules, config file vs API, per-request keys). Neither links to the other cleanly. A reader who finds one doesn't know the other exists. |  |  |  |  |
| About | "DIAL Core" — Menu: Platform > Core > About — URL: https://docs.dialx.ai/platform/core/about-core | "DIAL Chat" — Menu: Platform > Chat > About — URL: https://docs.dialx.ai/platform/chat/about-chat | Both pages use the generic sidebar label "About" for two unrelated component overviews. A reader scanning the sidebar sees "About" twice and can't distinguish them without clicking. |  |  |  |  |
| Deployment | "DIAL Deployment Highlights" — Menu: Platform > Deployment — URL: https://docs.dialx.ai/platform/deployment-intro | Menu: Tutorials > DevOps > Deployment — links directly to GitHub: https://github.com/epam/ai-dial-helm/tree/main/charts/dial/examples/generic/simple | Two separate "Deployment" entries: one is a conceptual overview on the docs site, the other exits to GitHub with no docs-site landing page. |  |  |  |  |
| Observability | "Observability and Monitoring" — Menu: Platform > Observability — URL: https://docs.dialx.ai/platform/observability-intro | Menu: Tutorials > DevOps > Observability — URL: https://docs.dialx.ai/tutorials/devops/observability-config | Same topic in two locations. The first is conceptual (what OTEL is, what Prometheus does). The second is a configuration how-to. No cross-reference. |  |  |  |  |
| Analytics | "Analytics" — Menu: Platform > Analytics — URL: https://docs.dialx.ai/platform/realtime-analytics-intro | "Analytics Realtime Configuration" — Menu: Tutorials > DevOps > Configuration > Analytics Realtime Configuration — URL: https://docs.dialx.ai/tutorials/devops/configuration/realtime-analytics-config | Same split as Observability: overview vs setup, two locations. |  |  |  |  |
| Admin Panel | "About DIAL Admin" — Menu: Platform > Admin Panel — URL: https://docs.dialx.ai/platform/admin-panel | "Introduction to DIAL Admin Panel" — Menu: Tutorials > Admins > Admin Panel User Guide > Introduction — URL: https://docs.dialx.ai/tutorials/admin/home | Both are introductions to the Admin Panel. One is a feature overview, the other is the start of the user guide. A reader searching "Admin Panel" gets two results. |  |  |  |  |
| Interceptors | "Interceptors" — Menu: Platform > Core > Interceptors — URL: https://docs.dialx.ai/platform/core/interceptors | Interceptors section within "DIAL Architecture" — Menu: Platform > Architecture & Concepts > Architecture Highlights — URL: https://docs.dialx.ai/platform/architecture-and-concepts/architecture#interceptors | Two separate treatments of interceptors at different depths, no cross-linking between them. |  |  |  |  |

  

### 1.2 The Platform vs Tutorials split is incoherent

The site implies: **Platform** = "what DIAL is" (explanation), **Tutorials** = "how to do things." In practice, the boundary is arbitrary:

* "Access Control in DIAL" (URL: [https://docs.dialx.ai/platform/core/access-control-intro](https://docs.dialx.ai/platform/core/access-control-intro), Menu: `Platform > Core > Access Control`) is a **detailed technical treatment** covering authorization rules, object types, configuration files, and API endpoints — not an "explanation." By [Diátaxis](https://diataxis.fr/) standards, it is a reference with how-to elements.
* "DIAL Deployment Highlights" (URL: [https://docs.dialx.ai/platform/deployment-intro](https://docs.dialx.ai/platform/deployment-intro), Menu: `Platform > Deployment`) is a **lightweight conceptual overview** that immediately links to the Tutorials > DevOps section for actual instructions.
* "Authentication" (URL: [https://docs.dialx.ai/platform/core/auth-intro](https://docs.dialx.ai/platform/core/auth-intro), Menu: `Platform > Architecture & Concepts > Authentication`) lives at a `/platform/core/` URL but is displayed in the Architecture & Concepts sidebar group — the URL contradicts the menu placement.
* The DevOps sidebar entry (Menu: `Tutorials > DevOps`) links directly to GitHub ([https://github.com/epam/ai-dial-helm/tree/main/charts/dial/examples/generic/simple](https://github.com/epam/ai-dial-helm/tree/main/charts/dial/examples/generic/simple)) with no docs-site landing page.

### 1.3 What the "Tutorials" section actually contains

The top-level "Tutorials" section (Menu: `Tutorials`, URL: [https://docs.dialx.ai/tutorials/user-guide](https://docs.dialx.ai/tutorials/user-guide)) contains no in-depth, learning-oriented tutorials that teach a developer to build something from scratch with explanation, verification, and learning outcomes. Here is what each page within it actually is:

**User guides (product manuals):**

| Page title | Menu path | URL | Actual content type | Page title | Menu path | URL | Actual content type |
| :-- | :-- | :-- | :-- | :-- | :-- | :-- | :-- |
| "Chat User Guide" | Tutorials > Chat User Guide | https://docs.dialx.ai/tutorials/user-guide | Comprehensive end-user manual for DIAL Chat UI — describes conversations, prompts, agents, marketplace, workspace, files, settings. Not a guided learning experience. |  |  |  |  |
| "Mind Map Studio User Guide" | Tutorials > Mind Map Studio | https://docs.dialx.ai/tutorials/mind-map | End-user guide for Mind Map Studio — covers creating mind maps, sources, content editing, and customization. Has brief procedural steps but no learning outcomes or verification. |  |  |  |  |
| "Introduction to DIAL Admin Panel" | Tutorials > Admins > Admin Panel User Guide > Introduction | https://docs.dialx.ai/tutorials/admin/home | Admin Panel user guide with sub-pages for Entities, Builders, Assets, Deployments, Access Management, Approvals, and Audit. Comprehensive manual, not a tutorial. |  |  |  |  |

  

**Quickstart pages (minimal step-by-step, no depth):**

| Page title | Menu path | URL | Actual content type | Page title | Menu path | URL | Actual content type |
| :-- | :-- | :-- | :-- | :-- | :-- | :-- | :-- |
| "Launch DIAL Chat with a Sample Application" | Tutorials > Developers > Run DIAL Locally > Chat with Application | https://docs.dialx.ai/tutorials/developers/local-run/quick-start-with-application | Quickstart: Prerequisites → download folder from GitHub → docker compose up → "it works." Has numbered steps but: no explanation of what happens during setup, no verification beyond "select Echo Application and type," no "what you learned," no code to write. |  |  |  |  |
| "Launch DIAL Chat with an Azure model" | Tutorials > Developers > Run DIAL Locally > Chat with OpenAI Model | https://docs.dialx.ai/tutorials/developers/local-run/quick-start-model | Same pattern as above. |  |  |  |  |
| "Launch DIAL Chat with Ollama" | Tutorials > Developers > Run DIAL Locally > Chat with a Self-Hosted Model (Ollama) | https://docs.dialx.ai/tutorials/developers/local-run/quick-start-with-self-hosted-model-ollama | Same pattern. |  |  |  |  |
| "Launch DIAL Chat with vLLM" | Tutorials > Developers > Run DIAL Locally > Chat with a Self-Hosted Model (vLLM) | https://docs.dialx.ai/tutorials/developers/local-run/quick-start-with-self-hosted-model-vllm | Same pattern. |  |  |  |  |

  

**Configuration references and how-tos (mislabeled as tutorials):**

| Page title | Menu path | URL | Actual content type | Page title | Menu path | URL | Actual content type |
| :-- | :-- | :-- | :-- | :-- | :-- | :-- | :-- |
| "Quick App Configuration Guide" | Tutorials > Developers > Apps Development > How to Configure Quick App | https://docs.dialx.ai/tutorials/developers/apps-development/quick-app-configuration | JSON schema reference: documents fields, types, required flags, and example JSON for Quick App configuration. No guided steps. |  |  |  |  |
| "Custom Buttons in Apps" | Tutorials > Developers > Apps Development > Custom Buttons in Apps | https://docs.dialx.ai/tutorials/developers/apps-development/custom-buttons | Reference for button types (Starter, Populate, Action, Checkbox) and their JSON schema. |  |  |  |  |
| "How to Enable Apps in DIAL" | Tutorials > Developers > Apps Development > Enable Apps | https://docs.dialx.ai/tutorials/developers/apps-development/enable-app | How-to: explains the process for registering applications in DIAL Core via API or config files. |  |  |  |  |
| "DIAL-to-DIAL Adapter" | Tutorials > Developers > Apps Development > Local Development | https://docs.dialx.ai/tutorials/developers/apps-development/adapter-dial | Configuration guide for the adapter (environment variables, config generation script, docker compose). Misleadingly placed as the first page of "Apps Development." |  |  |  |  |
| "Custom Content in Chat" | Tutorials > Developers > Chat > Custom Content in Chat | https://docs.dialx.ai/tutorials/developers/chat/chat-objects | API reference for the custom_content field: attachments, stages, markdown, visualizers, plotly. |  |  |  |  |
| "Managing Authorization in Complex Application Ecosystems" | Tutorials > Developers > Apps Development > Auth Matrix | https://docs.dialx.ai/tutorials/developers/apps-development/auth-matrix | Explanation of authorization flows in multi-app scenarios. |  |  |  |  |
| "Prompt Caching" | Tutorials > Developers > Prompt Caching | https://docs.dialx.ai/tutorials/developers/prompt-caching | Conceptual explanation of how prompt caching works in LLMs and in DIAL. |  |  |  |  |

  

**API how-tos:**

| Page title | Menu path | URL | Actual content type | Page title | Menu path | URL | Actual content type |
| :-- | :-- | :-- | :-- | :-- | :-- | :-- | :-- |
| "Publications" | Tutorials > Developers > Working with Resources > Publications | https://docs.dialx.ai/tutorials/developers/work-with-resources/work-with-publications | How-to with API reference: publication workflow, API endpoints, request examples. |  |  |  |  |
| "Sharing" | Tutorials > Developers > Working with Resources > Sharing | https://docs.dialx.ai/tutorials/developers/work-with-resources/sharing | How-to for sharing resources via API. |  |  |  |  |
| "Notifications" | Tutorials > Developers > Working with Resources > Notifications | https://docs.dialx.ai/tutorials/developers/work-with-resources/notifications | How-to for notification configuration. |  |  |  |  |

  

**Integration guides:**

| Page title | Menu path | URL | Actual content type | Page title | Menu path | URL | Actual content type |
| :-- | :-- | :-- | :-- | :-- | :-- | :-- | :-- |
| "Integration between DIAL and Microsoft Copilot" | Tutorials > Developers > Examples of Integrations > Integration with MS Copilot | https://docs.dialx.ai/tutorials/developers/integrations/copilot-to-dial | Integration how-to. |  |  |  |  |
| "Integration with MS Excel" | Tutorials > Developers > Examples of Integrations > Integration with MS Excel | https://docs.dialx.ai/tutorials/developers/integrations/ms-excel-addin | Integration how-to. |  |  |  |  |
| "Integration with MS Teams" | Tutorials > Developers > Examples of Integrations > Integration with MS Teams | https://docs.dialx.ai/tutorials/developers/integrations/msteams-bot | Integration how-to. |  |  |  |  |
| "Integration with n8n" | Tutorials > Developers > Examples of Integrations > Integration with n8n | https://docs.dialx.ai/tutorials/developers/integrations/n8n-integration | Integration how-to. |  |  |  |  |

  

**External link (no docs-site content):**

| Menu label | Menu path | Destination | Menu label | Menu path | Destination |
| :-- | :-- | :-- | :-- | :-- | :-- |
| "DevOps" | Tutorials > DevOps | Links directly to GitHub: https://github.com/epam/ai-dial-helm/tree/main/charts/dial/examples/generic/simple |  |  |  |

  

**Summary:** The "Tutorials" section contains 3 user guides, 4 quickstarts, 7 configuration references/how-tos, 3 API how-tos, 4 integration guides, 1 explanation, 1 external link, and 7 admin guide sub-pages. The quickstart pages are the closest thing to tutorials — they have numbered steps leading to "DIAL is running" — but they lack explanation of what's happening, meaningful verification, and learning outcomes. There are no in-depth, guided tutorials that teach a developer to build an application, create an adapter, write an interceptor, or use the API programmatically.

### 1.4 Excessive sidebar depth

  

| Path | Depth | URL | Path | Depth | URL |
| :-- | :-- | :-- | :-- | :-- | :-- |
| Tutorials > Developers > Apps Development > Multimodality > DIAL Cookbook > Examples > [page] | 7 levels | https://docs.dialx.ai/tutorials/developers/apps-development/multimodality/dial-cookbook/examples/how_to_call_text_to_text_applications |  |  |  |
| Tutorials > DevOps > Auth & Access Control > Configure IDPs > [specific IDP] | 5 levels | e.g., https://docs.dialx.ai/tutorials/devops/auth-and-access-control/configure-idps/cognito |  |  |  |

### 1.5 Misleading section labels

  

| Menu label | Menu path | Expected content | Actual first page | URL | Menu label | Menu path | Expected content | Actual first page | URL |
| :-- | :-- | :-- | :-- | :-- | :-- | :-- | :-- | :-- | :-- |
| "Apps Development" | Tutorials > Developers > Apps Development | How to build DIAL apps | "DIAL-to-DIAL Adapter" — a local dev proxy utility, not app development | https://docs.dialx.ai/tutorials/developers/apps-development/adapter-dial |  |  |  |  |  |
| "Chat" | Tutorials > Developers > Chat | Chat-related tutorials | "Custom Content in Chat" — API reference for custom_content features (attachments, stages, visualizers) | https://docs.dialx.ai/tutorials/developers/chat/chat-objects |  |  |  |  |  |
| "Working with Resources" | Tutorials > Developers > Working with Resources | Resource management overview | "Publications" — API reference for one specific sub-feature | https://docs.dialx.ai/tutorials/developers/work-with-resources/work-with-publications |  |  |  |  |  |
| "DevOps" | Tutorials > DevOps | DevOps landing page on docs site | Direct link to GitHub Helm repo | https://github.com/epam/ai-dial-helm/tree/main/charts/dial/examples/generic/simple |  |  |  |  |  |

### 1.6 Inconsistent treatment of app types

  

| App type | Treatment in sidebar | Details | App type | Treatment in sidebar | Details |
| :-- | :-- | :-- | :-- | :-- | :-- |
| Mind Map Studio | Top-level entry under Tutorials | Menu: Tutorials > Mind Map Studio — URL: https://docs.dialx.ai/tutorials/mind-map — same sidebar level as "Developers" and "DevOps" |  |  |  |
| Quick Apps | Single buried page | Menu: Tutorials > Developers > Apps Development > How to Configure Quick App — URL: https://docs.dialx.ai/tutorials/developers/apps-development/quick-app-configuration — this is a JSON schema reference, not a guide for building Quick Apps |  |  |  |
| Code Apps | No section anywhere | Mentioned in the Architecture page (URL: https://docs.dialx.ai/platform/architecture-and-concepts/architecture#agent-builders) and in the Chat User Guide, but has no dedicated developer documentation, no tutorial, and no menu entry |  |  |  |

### 1.7 No "what's next" navigation between pages

Pages end without linking to logical next steps:

| Page | URL | What a reader would logically do next | What the page provides | Page | URL | What a reader would logically do next | What the page provides |
| :-- | :-- | :-- | :-- | :-- | :-- | :-- | :-- |
| Quick Start | https://docs.dialx.ai/quick-start | Try a real model, or build an app | Links to previous/next page in sidebar order. No "next steps" section. |  |  |  |  |
| "Launch DIAL Chat with a Sample Application" | https://docs.dialx.ai/tutorials/developers/local-run/quick-start-with-application | Call the API, build a custom app | No "next steps" section. Previous/Next links go to "Mind Map Studio" and "Chat with OpenAI Model." |  |  |  |  |
| "How to Enable Apps in DIAL" | https://docs.dialx.ai/tutorials/developers/apps-development/enable-app | Build an app to register | Links to "Local Development" and "How to Configure Quick App." No tutorial link. |  |  |  |  |

  

### 1.8 Quick Start appears in two places

  

| Entry | Menu path | URL | Scope | Entry | Menu path | URL | Scope |
| :-- | :-- | :-- | :-- | :-- | :-- | :-- | :-- |
| Top-level Quick Start | Quick Start (nav bar) | https://docs.dialx.ai/quick-start | Docker Compose echo application only |  |  |  |  |
| Run DIAL Locally | Tutorials > Developers > Run DIAL Locally | https://docs.dialx.ai/tutorials/developers/local-run/quick-start-with-application | Four variations (application, Azure model, Ollama, vLLM) |  |  |  |  |

The Quick Start page does not link to the "Run DIAL Locally" section. A reader who finishes Quick Start has no path to the more detailed local setups.

### 1.9 URL paths vs menu paths don't match

  

| URL | Menu placement | Problem | URL | Menu placement | Problem |
| :-- | :-- | :-- | :-- | :-- | :-- |
| https://docs.dialx.ai/platform/core/auth-intro | Platform > Architecture & Concepts > Authentication | URL says core/, menu says Architecture & Concepts |  |  |  |
| https://docs.dialx.ai/legal-and-compliance | Platform > Compliance and Legal Q&A | URL has no platform/ prefix but page appears under Platform |  |  |  |
| https://docs.dialx.ai/video%20demos/dial-product-overview | Demos | URL contains a space (video demos), a web anti-pattern |  |  |  |
| https://docs.dialx.ai/tutorials/developers/apps-development/multimodality/dial-cookbook/examples/how_to_call_text_to_text_applications | Tutorials > Developers > Apps Development > Examples | URL contains multimodality/dial-cookbook/ which does not appear in the menu |  |  |  |

* * *

## 2\. Structural gaps (site-wide)

  

| Gap | Evidence | Impact | Gap | Evidence | Impact |
| :-- | :-- | :-- | :-- | :-- | :-- |
| Docs site redirects to GitHub READMEs as authoritative source | Configuration guide (URL: https://docs.dialx.ai/tutorials/devops/configuration/configuration-guide) says "Refer to the AI DIAL Core" with link to GitHub for every component; Quick Start asks users to download from GitHub; DevOps sidebar entry is a GitHub link | Fragmented UX, broken search, invisible staleness |  |  |  |
| API Reference hosted off-site | API docs at https://dialx.ai/dial_api — not part of docs.dialx.ai navigation or search | Reader loses context |  |  |  |
| No versioned documentation | DIAL ships biweekly with semver; docs have no version selector | Readers can't find docs matching their version |  |  |  |
| No version compatibility matrix | Core, SDK, adapters, Chat, Admin, Helm chart version independently; no table shows which work together | Non-Helm deployments are guesswork |  |  |  |
| No changelog on docs site | Release notes only on GitHub (e.g., https://github.com/epam/ai-dial-core/releases) | Product velocity invisible to docs readers |  |  |  |
| Orphaned pages | "Handling High Loads" (URL: https://docs.dialx.ai/platform/high-load-performance), "DIAL Evolution" (URL: https://docs.dialx.ai/platform/history), "Compliance and Legal Q&A" (URL: https://docs.dialx.ai/legal-and-compliance, menu mismatch) — none connected to a narrative or learning path | Feel like blog posts, not documentation |  |  |  |
| Demos conflate showcases with tutorials | Demos section (Menu: Demos, URL: https://docs.dialx.ai/video%20demos/dial-product-overview) mixes short capability flyovers with longer coding walkthroughs | Neither audience finds what they expect |  |  |  |
| No community surface | No contribution guide on-site (only on GitHub: https://github.com/epam/ai-dial/blob/main/CONTRIBUTING.md), no community extension list, no forum links, no marketplace submission process | Open-source project looks proprietary |  |  |  |

* * *

## 3\. Onboarding and positioning

  

| Gap | Evidence | Impact | Gap | Evidence | Impact |
| :-- | :-- | :-- | :-- | :-- | :-- |
| Landing page is a flat list of 9 sections | Home page (URL: https://docs.dialx.ai/) lists Quick Start, Architecture, DIAL Admin, Run DIAL Locally, Helm Deployment, Configuration, User Manual, and Repositories in a flat layout | No persona routing, no "start here" |  |  |  |
| "What is DIAL" opens with the acronym | "What is DIAL" page (URL: https://docs.dialx.ai/platform/architecture-and-concepts/vision) starts with "DIAL is an acronym for Deterministic Integrator of Applications and Language Models" | Readers don't learn what problem DIAL solves |  |  |  |
| No comparison pages | Absent from site | Evaluators can't answer "DIAL vs X" |  |  |  |
| No Quick Start per persona | Single Docker Compose path (URL: https://docs.dialx.ai/quick-start) targets the App Developer persona only | DevOps, Admin, Evaluator, and End user personas have no entry point |  |  |  |
| No environment prerequisites | Quick Start (URL: https://docs.dialx.ai/quick-start) says "Docker engine (Docker Compose Version 2.20.0 +) installed on your machine" and nothing else. "Launch DIAL Chat with a Sample Application" (URL: https://docs.dialx.ai/tutorials/developers/local-run/quick-start-with-application) additionally requires Python 3.8+ and pip but doesn't address WSL2, Rosetta for ARM, Docker Desktop resource allocation, or tested OS distributions | First-time users fail silently and leave |  |  |  |

* * *

## 4\. Content depth

  

| Gap | Evidence | Impact | Gap | Evidence | Impact |
| :-- | :-- | :-- | :-- | :-- | :-- |
| No in-depth tutorials exist | As documented in §1.3 above: the "Tutorials" section contains user guides, quickstarts, references, how-tos, and external links. The quickstart pages (e.g., URL: https://docs.dialx.ai/tutorials/developers/local-run/quick-start-with-application) have numbered steps but no explanation of what happens, no meaningful verification, and no learning outcomes. There are no tutorials that teach a developer to build an application, create an adapter, write an interceptor, or use the API programmatically. | A developer who wants to learn DIAL beyond "run docker compose" has nowhere to go. This is the #1 content gap. |  |  |  |
| No "getting started with the API" guide | After the Quick Start, the next developer task is calling the API. There is no bridge between "DIAL is running" and "I can programmatically use it." The API reference is off-site (https://dialx.ai/dial_api) with no on-site usage guide covering chat completions, streaming, file upload, or conversation management. | The most important developer on-ramp doesn't exist |  |  |  |
| DIAL Apps ecosystem under-documented | Custom Apps: only the quickstart (URL: https://docs.dialx.ai/tutorials/developers/local-run/quick-start-with-application) shows a minimal echo app. Quick Apps: only a JSON schema reference exists (URL: https://docs.dialx.ai/tutorials/developers/apps-development/quick-app-configuration). Code Apps: mentioned on the Architecture page (URL: https://docs.dialx.ai/platform/architecture-and-concepts/architecture#agent-builders) and Chat User Guide but has no developer section. Mind Map Studio: end-user guide only (URL: https://docs.dialx.ai/tutorials/mind-map). No unified story of what each app type is, when to use which, or how they relate. | Primary value surface invisible to new users |  |  |  |
| Tool Sets undocumented | Tool Sets are referenced in the Architecture page (URL: https://docs.dialx.ai/platform/architecture-and-concepts/architecture#mcp-servers) and in the Quick App Configuration Guide (URL: https://docs.dialx.ai/tutorials/developers/apps-development/quick-app-configuration) under the tools section. No standalone reference, authoring guide, or examples exist. | Agent-building unreachable |  |  |  |
| Videos not self-sufficient | Videos are referenced from pages like the Quick Start (URL: https://docs.dialx.ai/quick-start) and "Launch DIAL Chat with a Sample Application" (URL: https://docs.dialx.ai/tutorials/developers/local-run/quick-start-with-application). These screencasts show code and configuration on-screen but the associated pages don't include the shown code, sample data, or config files. | Can't reproduce what you see |  |  |  |
| Naming chaos across app creation surfaces | Architecture page (URL: https://docs.dialx.ai/platform/architecture-and-concepts/architecture#agent-builders) says "Agent Builders (technical name application runners)." Chat page architecture section uses "Application builders." Admin sidebar (URL: https://docs.dialx.ai/tutorials/admin/builders-application-runners) uses "Builders." SDK documentation (https://github.com/epam/ai-dial-sdk) uses neither term consistently. | Four labels for one concept; readers believe these are different things |  |  |  |
| No OpenAI API compatibility matrix | "What is DIAL" page (URL: https://docs.dialx.ai/platform/architecture-and-concepts/vision) and Architecture page both describe the API as "OpenAI-compatible" but never specify which OpenAI API version, which endpoints are supported, what extensions DIAL adds (custom_content, stages, attachments), or what is unsupported. | Developers migrating from OpenAI discover incompatibilities at runtime |  |  |  |
| SDK documentation absent from docs site | SDK only documented in GitHub README (https://github.com/epam/ai-dial-sdk). No on-site reference, tutorial, or getting-started guide. | Developers must leave the site |  |  |  |
| No production hardening guide | "Handling High Loads" (URL: https://docs.dialx.ai/platform/high-load-performance) is an isolated page under Platform, not connected to HA, secrets, backup, upgrade, or cost control. No linear "how to go to production" narrative. | Can't answer "is this production-ready?" |  |  |  |
| Observability stops at "use OTEL" | "Observability and Monitoring" (URL: https://docs.dialx.ai/platform/observability-intro) explains what OTEL and Prometheus are but provides no setup instructions, no tracing configuration, no provider-specific guides (Datadog, CloudWatch, etc.), and no alerting rules. | DevOps must figure out the last mile alone |  |  |  |
| Networking/firewall docs promised but undelivered | "Launch DIAL Chat with a Sample Application" (URL: https://docs.dialx.ai/tutorials/developers/local-run/quick-start-with-application) explicitly states: "Deploying and distributing these applications for production purposes will require additional configurations that guarantee secure access to the application endpoints through the implementation of firewalls and other network security settings to prevent unauthorized intrusion." This documentation is never provided anywhere on the site. | Gap acknowledged in existing docs and left unfilled |  |  |  |
| No dependency configuration | Redis and blob storage are required dependencies mentioned in the Architecture page (URL: https://docs.dialx.ai/platform/architecture-and-concepts/architecture) and Deployment page (URL: https://docs.dialx.ai/platform/deployment-intro). No guidance exists for: Redis version, cluster vs standalone, Sentinel, memory sizing; blob storage provider selection (S3 vs GCS vs Azure Blob), IAM configuration, bucket structure. | Day-one deployment decisions undocumented |  |  |  |
| No error reference | DIAL Core returns HTTP error codes. No documentation explains what specific errors mean or how to fix them. No error code catalog exists on the site. | Developers read source code to debug |  |  |  |
| No testing guidance | DIAL SDK (https://github.com/epam/ai-dial-sdk) has testing utilities, but docs site has no content on unit testing custom apps, integration testing against DIAL Core, or mocking patterns. | Developers ship untested apps |  |  |  |
| Cookbook buried and stale | Located at 7-level depth (URL: https://docs.dialx.ai/tutorials/developers/apps-development/multimodality/dial-cookbook/examples/how_to_call_text_to_text_applications). The page header warns about using openai-python-sdk — the code examples pin dependencies over 2 years old. | Signals abandonware |  |  |  |
| No reference architectures | No diagrams or guides for common patterns: enterprise RAG, eval-driven dev, multi-tenant deployment, hybrid cloud. | Architects design from scratch |  |  |  |
| No troubleshooting hub | No centralized FAQ or troubleshooting page. Error resolution scattered across component READMEs on GitHub. | Support load |  |  |  |
| No RAG explanation | DIAL RAG is a major repo (https://github.com/epam/ai-dial-rag). RAG is mentioned throughout the Architecture page. No page explains DIAL's approach to RAG vs building it with raw frameworks. | Developers can't evaluate the RAG offering |  |  |  |
| No file management how-to | Architecture page (URL: https://docs.dialx.ai/platform/architecture-and-concepts/architecture#other-apis) references a File Storage Management API. No developer guide covers upload, list, or retrieve — the most common first task after API access. | Developers reverse-engineer from API spec |  |  |  |

* * *

## 5\. Terminology and concepts

  

| Gap | Evidence | Impact | Gap | Evidence | Impact |
| :-- | :-- | :-- | :-- | :-- | :-- |
| No glossary | No single page on the site defines the core terms: Application, Adapter, Tool Set, Quick App, Code App, Agent Builder, Interceptor, Overlay, Deployment, MCP Server, Publication | Readers conflate concepts; different pages use different terms for the same thing |  |  |  |
| Four labels for one concept | "Agent Builders" at https://docs.dialx.ai/platform/architecture-and-concepts/architecture#agent-builders; "application runners" in parenthetical on the same page; "Application builders" on https://docs.dialx.ai/platform/chat/about-chat; "Builders" in Admin sidebar at https://docs.dialx.ai/tutorials/admin/builders-application-runners | Readers believe these are different things |  |  |  |
| Deprecated concepts surfaced without marking | Assistant repo (https://github.com/epam/ai-dial-assistant) is archived with a notice, but docs site doesn't flag it. Addon protocol is legacy. | Dead ends |  |  |  |
| Inconsistent capitalization | "DIAL Core" vs "the backend" vs "dial core" appear across different pages | Breaks search, signals inattention |  |  |  |

* * *

## 6\. Sustainability

  

| Gap | Evidence | Impact | Gap | Evidence | Impact |
| :-- | :-- | :-- | :-- | :-- | :-- |
| No freshness enforcement | Cookbook examples (URL: https://docs.dialx.ai/tutorials/developers/apps-development/multimodality/dial-cookbook/examples/how_to_call_text_to_text_applications) use 2+ year old dependencies | Erodes trust |  |  |  |
| No page ownership | No owner field in page frontmatter | No accountability for decay |  |  |  |
| No CI quality gates | Broken links and outdated terminology merge without checks | Quality regresses between releases |  |  |  |
| No video/article pairing enforced | Some pages reference videos as primary learning material without providing equivalent written content with code and data | Can't reproduce content |  |  |  |

* * *

## 7\. Gap severity ranking

  

| Rank | Gap | Category | Key evidence URL | Rank | Gap | Category | Key evidence URL |
| :-- | :-- | :-- | :-- | :-- | :-- | :-- | :-- |
| 1 | No in-depth tutorials exist (quickstarts are not tutorials) | Content | https://docs.dialx.ai/tutorials/developers/local-run/quick-start-with-application |  |  |  |  |
| 2 | No "getting started with the API" guide | Content | https://dialx.ai/dial_api (off-site, no on-site bridge) |  |  |  |  |
| 3 | DIAL Apps ecosystem under-documented / asymmetric | Content | https://docs.dialx.ai/tutorials/developers/apps-development/quick-app-configuration |  |  |  |  |
| 4 | Tool Sets undocumented | Content | https://docs.dialx.ai/platform/architecture-and-concepts/architecture#mcp-servers |  |  |  |  |
| 5 | Seven duplicate-title pairs in navigation | Navigation | §1.1 table above |  |  |  |  |
| 6 | Platform/Tutorials split incoherent | Navigation | §1.2 above |  |  |  |  |
| 7 | "Tutorials" section entirely mislabeled | Navigation | §1.3 above |  |  |  |  |
| 8 | GitHub redirects as authoritative source | Structural | https://docs.dialx.ai/tutorials/devops/configuration/configuration-guide |  |  |  |  |
| 9 | Videos not self-sufficient | Content | https://docs.dialx.ai/quick-start |  |  |  |  |
| 10 | No OpenAI API compatibility matrix | Content | https://docs.dialx.ai/platform/architecture-and-concepts/vision |  |  |  |  |
| 11 | Four labels for "Agent Builder" concept | Terminology | https://docs.dialx.ai/platform/architecture-and-concepts/architecture#agent-builders |  |  |  |  |
| 12 | No glossary | Terminology | (absent) |  |  |  |  |
| 13 | Observability stops at "use OTEL" | Content | https://docs.dialx.ai/platform/observability-intro |  |  |  |  |
| 14 | Networking/firewall promised, not delivered | Content | https://docs.dialx.ai/tutorials/developers/local-run/quick-start-with-application |  |  |  |  |
| 15 | No dependency config (Redis, blob storage) | Content | https://docs.dialx.ai/platform/deployment-intro |  |  |  |  |
| 16 | No error reference | Content | (absent) |  |  |  |  |
| 17 | No version compatibility matrix | Structural | (absent) |  |  |  |  |
| 18 | No production hardening guide | Content | https://docs.dialx.ai/platform/high-load-performance |  |  |  |  |
| 19 | Cookbook buried and stale | Content + Nav | https://docs.dialx.ai/tutorials/developers/apps-development/multimodality/dial-cookbook/examples/how_to_call_text_to_text_applications |  |  |  |  |
| 20 | No community surface | Structural | https://github.com/epam/ai-dial/blob/main/CONTRIBUTING.md (GitHub only) |  |  |  |  |
| 21 | No testing guidance for custom apps | Content | https://github.com/epam/ai-dial-sdk (GitHub only) |  |  |  |  |
| 22 | No environment prerequisites | Content | https://docs.dialx.ai/quick-start |  |  |  |  |
| 23 | No "what's next" navigation | Navigation | https://docs.dialx.ai/quick-start |  |  |  |  |
| 24 | Excessive sidebar depth (up to 7 levels) | Navigation | https://docs.dialx.ai/tutorials/developers/apps-development/multimodality/dial-cookbook/examples/how_to_call_text_to_text_applications |  |  |  |  |
| 25 | No changelog on docs site | Structural | (absent — only on GitHub) |  |  |  |  |

[Filter table data](#)[Create a pivot table](#)[Create a chart from data series](#)

[Configure buttons visibility](/users/tfac-settings.action)