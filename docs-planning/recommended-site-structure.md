# DIAL Documentation - Recommended Site Structure

> **Purpose:** This document defines the target information architecture for `[docs.dialx.ai](http://docs.dialx.ai)`. It maps directly to the Docusaurus sidebar configuration. Every page is annotated with its [Diátaxis](https://diataxis.fr/) type, primary persona, and whether it exists today or is new.

* * *

## Legend

| Annotation | Meaning | Annotation | Meaning |
| :-- | :-- | :-- | :-- |
| [Tutorial] | Learning-oriented, guided, hands-on |  |  |
| [How-to] | Task-oriented, assumes competence |  |  |
| [Reference] | Lookup-oriented, exhaustive, neutral |  |  |
| [Explanation] | Understanding-oriented, context and trade-offs |  |  |
| [Landing] | Navigation/routing page |  |  |
| 🆕 | Does not exist today — new content required |  |  |
| ← current location | Where this content currently lives on the site |  |  |
| (italic note) | Design rationale or content guidance |  |  |

* * *

## Top-level navigation

```
HomeUnderstand DIALBuilding with DIALOperating DIALAdministering DIALChat User GuideReferenceUse CasesDemos
```

* * *

## Full structure

### 1\. Home `[Landing]`

*Persona-routed entry page. Cards with a one-sentence promise and a direct link.*

* Developer quick start `[Tutorial]` ← *currently: Quick Start + Tutorials > Developers > Run DIAL Locally > Chat with Application (merge into one streamlined path)*
* DevOps quick start `[Tutorial]` ← *currently: fragmented across Quick Start, Tutorials > DevOps (GitHub link), Platform > Deployment*
* Admin quick start `[Tutorial]` **🆕**
* Evaluator quick start `[Tutorial]` **🆕** — *15-minute demo path*
* Architect overview `[Explanation]` **🆕** — *links to reference architectures*
* End user guide `[Tutorial]` — *links to §2 Chat User Guide*

* * *

### 2\. Understand DIAL `[Explanation]`

*Concepts and positioning. No setup instructions. Answers "what" and "why," not "how."*

*Docusaurus sidebar grouping labels (visual only, do not add navigation depth):*

#### Positioning

* What is DIAL `[Explanation]` ← *currently: Platform > Architecture & Concepts > What is DIAL — rewrite: lead with value, not the acronym*
* Comparisons **🆕**
  * DIAL vs AI gateways `[Explanation]` **🆕** — *LiteLLM, Portkey, Kong*
  * DIAL vs app builders `[Explanation]` **🆕** — *Dify, Flowise, n8n*
  * DIAL vs frameworks `[Explanation]` **🆕** — *LangChain, LlamaIndex, Semantic Kernel*
  * DIAL vs AI studios `[Explanation]` **🆕** — *Azure AI Studio, Google AI Studio*

#### Architecture

* Architecture highlights `[Explanation]` ← *currently: Platform > Architecture & Concepts > Architecture Highlights — absorbs "Platform Components" page*
* DIAL Stack `[Reference]` ← *currently: Platform > Architecture & Concepts > DIAL Stack*
* Application server `[Explanation]` ← *currently: Platform > Architecture & Concepts > Application Server*
* Unified API overview `[Explanation]` ← *currently: Platform > Core > About > Unified API section*

#### Capabilities

* Agentic platform `[Explanation]` ← *currently: Platform > Architecture & Concepts > Agentic Platform*
* RAG in DIAL `[Explanation]` **🆕** — *DIAL's approach to RAG, component overview (DIAL RAG, RAG Eval), comparison to building RAG with raw frameworks, when to use DIAL RAG vs roll your own*
* Multimodality `[Explanation]` ← *currently: Platform > Multimodality*
* Collaboration and sharing `[Explanation]` ← *currently: Platform > Collaboration*

#### Security and governance

* Authentication and access control `[Explanation]` ← *currently: TWO separate pages — merge into one canonical explanation*
* Usage limits and cost control `[Explanation]` ← *currently: Platform > Architecture & Concepts > Usage Limits and Cost Control*

#### Foundations

* Core concepts and glossary **🆕**
  * Concept map `[Explanation]` **🆕** — *visual: Custom App → Quick App → Code App → Mind Map → Tool Set → MCP Server → Adapter → Interceptor → Overlay → Agent Builder (canonical name) → Deployment*
  * Glossary `[Reference]` **🆕** — *alphabetical, auto-linked on first use per page; resolves "Agent Builder" vs "application runner" vs "application builders" vs "Builders" — one canonical name*
* DIAL evolution `[Explanation]` ← *currently: Platform > DIAL Evolution — kept for product history and philosophy ("why DIAL exists, how it got here"); distinct from the Changelog in Reference (§7) which tracks per-release changes*

*Merged/removed pages:*

* *Platform > Core > About → absorbed into Architecture highlights and Unified API overview*
* *Platform > Chat > About → renamed "DIAL Chat overview," absorbed into Architecture highlights*
* *Platform > Architecture & Concepts > Main Concepts → absorbed into Core concepts and glossary*
* *Platform > Architecture & Concepts > Authentication (URL /platform/core/auth-intro) → merged into Authentication and access control; URL mismatch fixed*

* * *

### 3\. Building with DIAL `[Tutorial + How-to]`

*The centerpiece section. Tutorials and how-tos for app developers. Every tutorial has a paired sample repo, sample data, and configuration. Tutorial videos are embedded inline on their parent tutorial pages, not in a separate section.*

*Docusaurus sidebar grouping labels:*

#### Apps

##### 3.1 DIAL Apps overview **🆕** `[Explanation]`

← *partially: Platform > Core > DIAL-Native Apps + Platform > Architecture > Agent Builders — consolidate and expand*

* When to use which **🆕** `[Explanation]` — *decision matrix: Custom App vs Quick App vs Code App vs Mind Map Studio*

##### 3.2 Custom Apps **🆕**

* Architecture and lifecycle `[Explanation]` **🆕** — *absorbs Platform > Core > DIAL-Native Apps*
* Getting started with DIAL SDK `[Tutorial]` **🆕**
* Tutorial: build a RAG app `[Tutorial]` **🆕** — *E2E with sample repo + data*
* Tutorial: translator app `[Tutorial]` ← *currently: Tutorials > Developers > Apps Development (exists, needs remediation)*
* Custom buttons in apps `[How-to]` ← *currently: Tutorials > Developers > Apps Development > Custom Buttons in Apps*
* Registering apps in DIAL Core `[How-to]` ← *currently: Tutorials > Developers > Apps Development > Enable Apps*
* Deployment `[How-to]`
* Examples `[Reference]` ← *currently: buried under multimodality/dial-cookbook — relocated, tested, CI-validated*

##### 3.3 Quick Apps **🆕**

* What are Quick Apps `[Explanation]` **🆕**
* Authoring guide `[How-to]` **🆕** — *absorbs "How to Configure Quick App"*
* Working with tools and agents `[How-to]` **🆕**
* Tool Sets **🆕**
  * What is a Tool Set `[Explanation]` **🆕**
  * Define and register a Tool Set `[How-to]` **🆕**
  * MCP server integration `[How-to]` **🆕** — *absorbs Architecture page MCP content*
  * Sharing and permissions `[How-to]` **🆕**
  * Tool Set reference `[Reference]` **🆕**
  * Examples `[Reference]` **🆕**
* Tutorial: Quick App with agent loop `[Tutorial]` **🆕** — *E2E with sample repo + data*
* Examples `[Reference]` **🆕**

##### 3.4 Code Apps **🆕**

* Overview `[Explanation]` **🆕**
* Getting started `[Tutorial]` **🆕**
* Tutorial: build and deploy a Code App `[Tutorial]` **🆕** — *E2E with sample repo*

##### 3.5 Mind Map Studio **🆕**

*Developer-facing content. End-user content stays in Chat User Guide (§2).*

* Overview `[Explanation]` **🆕**
* Authoring workflow `[How-to]` **🆕**
* Export and publish `[How-to]` **🆕**

#### Extension points

##### 3.6 Interceptors

* What are interceptors `[Explanation]` ← *currently: Platform > Core > Interceptors*
* Tutorial: PII-redacting interceptor `[Tutorial]` **🆕** — *E2E with sample repo*
* Interceptors SDK reference `[Reference]` **🆕**
* Configuration and assignment `[How-to]` ← *currently: configuration section of Platform > Core > Interceptors*
* Examples `[Reference]`

##### 3.7 Adapters

* What are adapters `[Explanation]`
* Tutorial: custom adapter `[Tutorial]` **🆕** — *E2E with sample repo*
* Supported providers `[Reference]` ← *currently: Platform > AI Model Providers*

#### Developer tools

##### 3.8 SDK reference **🆕** `[Reference]`

*Auto-generated from docstrings + hand-authored guides.*

##### 3.9 Chat customization

← *currently: Tutorials > Developers > Chat (entire sub-section)*

* Custom content in Chat `[Reference]` ← *currently: Custom Content in Chat (attachments, stages, markdown, visualizers, plotly)*
* Data visualization `[How-to]` ← *currently: Platform > Chat > Data Visualization*
* Create custom visualizer `[Tutorial]` ← *currently: Tutorials > Developers > Chat > Create Visualizer*
* Chat localization `[How-to]` ← *currently: Tutorials > Developers > Chat > Chat Localization*
* Theming and design `[How-to]` ← *currently: Tutorials > Developers > Chat > Design Structure*
* Marketplace `[Explanation]` ← *currently: Platform > Chat > Marketplace*

##### 3.10 Chat customization

← *currently: Tutorials > Developers > Chat*

* Custom content in Chat `[Reference]` ← *currently: Custom Content in Chat*
* Data visualization `[How-to]` ← *currently: Platform > Chat > Data Visualization*
* Create custom visualizer `[Tutorial]`
* Chat localization `[How-to]`
* Theming and design `[How-to]`
* Marketplace `[Explanation]` ← *currently: Platform > Chat > Marketplace*

##### 3.11 DIAL Overlay

* Overview `[Explanation]`
* Tutorial: custom UI with Overlay `[Tutorial]` **🆕**

#### Quality and testing

##### 3.12 Evaluations **🆕**

* Overview `[Explanation]` **🆕**
* RAG Eval toolkit `[How-to]` **🆕**
* Tutorial: eval-driven development `[Tutorial]` **🆕** — *E2E with sample repo + data*

#### Integrations

##### 3.13 Integrations

← *currently: Tutorials > Developers > Examples of Integrations*

###### 3.13.1 Chatbot integrations

*AI embedded in messaging and conversation platforms.* ← *currently: Tutorials > Developers > Examples of Integrations (partial)*

* Integration with MS Teams `[How-to]` ← *currently: Tutorials > Developers > Integrations > MS Teams*
* Integration with MS Copilot `[How-to]` ← *currently: Tutorials > Developers > Integrations > MS Copilot*

###### 3.13.2 Productivity add-ins

*AI embedded in desktop and productivity tools.*

* Integration with MS Excel `[How-to]` ← *currently: Tutorials > Developers > Integrations > MS Excel*

###### 3.13.3 Workflow automation

*DIAL as a node in automation pipelines.*

* Integration with n8n `[How-to]` ← *currently: Tutorials > Developers > Integrations > n8n*

###### 3.13.4 Orchestration patterns **🆕**

*Routing and coordination across providers and models within DIAL.*

* Tutorial: multi-provider routing `[Tutorial]` **🆕** — *E2E with sample repo*
* *Future: failover chains, cost-capped routing, A/B testing between models, latency-based selection, region-aware routing*

#### Platform APIs and resources

##### 3.14 Working with DIAL resources

← *currently: Tutorials > Developers > Working with Resources*

* File management `[How-to]` **🆕** — *upload, list, retrieve files via the File Storage Management API; the most common first developer task*
* Publications API `[How-to]` ← *currently: Work with Resources > Publications*
* Sharing API `[How-to]` ← *currently: Work with Resources > Sharing*
* Notifications `[How-to]` ← *currently: Work with Resources > Notifications*
* Per-request keys `[Reference]` ← *currently: Platform > Core > Per-Request Keys*
* Auth matrix for apps `[Reference]` ← *currently: Apps Development > Auth Matrix*

##### 3.14 Advanced topics

* Prompt caching `[How-to]` ← *currently: Tutorials > Developers > Prompt Caching*

* * *

### 4\. Operating DIAL `[How-to + Reference]`

*Everything a DevOps / Platform engineer needs.*

#### 4.1 Local setup

← *currently: Tutorials > Developers > Run DIAL Locally*

* Docker Compose with Azure model `[How-to]`
* Docker Compose with Ollama `[How-to]`
* Docker Compose with vLLM `[How-to]`
* Docker Compose with application `[How-to]`
* DIAL-to-DIAL Adapter for local dev `[How-to]` ← *currently: first page of "Apps Development" — relocated*

#### 4.2 Cloud deployment

← *currently: Tutorials > DevOps > Deployment (mostly GitHub links) + Platform > Deployment (overview)*

* Helm chart overview `[Explanation]` **🆕** — *absorbs Platform > Deployment*
* AWS deployment `[How-to]`
* Azure deployment `[How-to]`
* GCP deployment `[How-to]`
* Generic Kubernetes `[How-to]`
* Azure Secrets deployment `[How-to]`
* Custom Apps deployment `[How-to]`
* Quick Apps installation `[How-to]`

#### 4.3 Model deployment

← *currently: Tutorials > DevOps > Deployment > Deployment of Models*

* Bedrock model deployment `[How-to]`
* OpenAI model deployment `[How-to]`
* Vertex model deployment `[How-to]`
* Databricks model deployment `[How-to]` ← *currently: Use Databricks Models*

#### 4.4 Configuration reference **🆕** `[Reference]`

*Consolidated, no GitHub redirects.*

* Core configuration `[Reference]` **🆕**
* Chat configuration `[Reference]` **🆕**
* Adapter configuration `[Reference]` **🆕**
* Auth Helper configuration `[Reference]` **🆕**
* Load balancer configuration `[Reference]` ← *currently: Platform > Core > Load Balancer*
* Config precedence rules `[Reference]` **🆕** — *file → env var → CLI → dynamic*
* Enable publications `[How-to]` ← *currently: Tutorials > DevOps > Configuration > Enable Publications*

#### 4.5 Auth and access control

← *currently: Tutorials > DevOps > Auth & Access Control*

* API keys `[How-to]`
* JWT configuration `[How-to]`
* Roles and rate limits `[How-to]`
* SSO / IdP setup
  * Overview `[Explanation]` ← *includes a comparison table summarizing all supported IdPs: protocol, managed vs self-hosted, key trade-offs — so evaluators can compare without opening six pages*
  * AWS Cognito `[How-to]`
  * Auth0 `[How-to]`
  * Google Identity `[How-to]`
  * Microsoft Entra ID `[How-to]`
  * Okta `[How-to]`
  * Keycloak `[How-to]`

#### 4.6 Observability — *first-class, not an appendix*

← *currently: Platform > Observability (concept) + Tutorials > DevOps > Observability (config) — merged*

* Overview `[Explanation]` ← *currently: Platform > Observability — covers OTEL architecture, what DIAL emits (metrics, traces, logs), and the collector → backend → visualization pipeline*
* Tracing (OpenTelemetry) `[How-to]` **🆕** — *distributed tracing setup: configuring OTEL exporters in DIAL Core, trace context propagation across Core → Adapter → Interceptor → Application, sampling strategies, trace ID correlation with logs*
* Metrics and monitoring `[How-to]` **🆕** — *Prometheus scrape config, DIAL-emitted metrics reference, Grafana dashboard setup, key metrics to alert on*
* Logging `[How-to]` **🆕** — *log format, log levels, Vector pipeline configuration, log aggregation setup*
* Alerting `[How-to]` **🆕** — *alert rules for common failure modes: adapter timeout, token limit exhaustion, storage unavailable, upstream model errors*
* Analytics Realtime setup `[How-to]` ← *currently: Tutorials > DevOps > Configuration > Analytics Realtime Configuration — absorbs Platform > Analytics overview*
* Provider-specific guides **🆕**
  * Datadog `[How-to]` **🆕** — *OTEL Collector → Datadog exporter config, Datadog APM for traces, log forwarding via Datadog Agent, dashboard templates*
  * Grafana + Prometheus `[How-to]` **🆕** — *the "default" stack; Prometheus Operator for Kubernetes, pre-built Grafana dashboards, InfluxDB for Analytics Realtime*
  * ELK Stack `[How-to]` **🆕** — *Elasticsearch + Logstash/Fluentd + Kibana setup, log parsing, index templates*
  * Azure Monitor `[How-to]` **🆕** — *Application Insights integration, Azure Log Analytics, Azure-native OTEL exporter*
  * AWS CloudWatch `[How-to]` **🆕** — *CloudWatch Logs, Container Insights, OTEL Collector → CloudWatch exporter*

#### 4.7 Production readiness **🆕** `[How-to]`

*Linear chapter. Read top to bottom.*

* High availability `[How-to]` **🆕**
* Scaling `[How-to]` **🆕** — *absorbs Platform > Handling High Loads*
* Secrets management `[How-to]` **🆕**
* Backup and restore `[How-to]` **🆕**
* Upgrade procedure `[How-to]` **🆕**
* Cost control `[How-to]` **🆕**
* Security hardening `[How-to]` **🆕** — *absorbs Platform > Core > PII Compliance & Privacy*

#### 4.8 Troubleshooting **🆕** `[Reference]`

* * *

### 5\. Administering DIAL `[How-to]`

*Merges Platform > Admin Panel (overview) with Tutorials > Admins (user guide).*

* Admin Panel overview `[Explanation]` ← *merged from Platform > Admin Panel + Tutorials > Admins > Introduction*
* Admin Panel user guide
  * Entities `[How-to]`
  * Builders `[How-to]` — *sidebar label aligned to glossary canonical name*
  * Assets `[How-to]`
  * Deployments (including MCP servers) `[How-to]`
  * Access management `[How-to]`
  * Approvals `[How-to]`
  * Audit `[How-to]`
* User management `[How-to]` **🆕**
* Publications and review `[How-to]`
* Usage limits and cost control `[How-to]`
* Compliance and legal FAQ `[Reference]` ← *URL fixed from `/legal-and-compliance` to proper path*

* * *

### 6\. Chat User Guide `[Tutorial]`

*Persona: **End user** — people who use DIAL Chat daily to interact with models and apps. Not developer-facing. Separate top-level entry because end users are the largest audience and should not navigate through developer sections to find the product manual.*

← *currently: Tutorials > Chat User Guide (keep structure largely as-is, updated for current UI)*

*Includes end-user documentation for all features accessible within DIAL Chat: conversations, prompts, marketplace, Quick Apps (user perspective), Code Apps (user perspective), Mind Maps (user perspective), files, sharing, publications, toolsets, settings.*

*The current standalone "Mind Map Studio" page under Tutorials is merged here for end-user content. Developer-facing Mind Map content goes to Building with DIAL > DIAL Apps > Mind Map Studio.*

* * *

### 7\. Reference `[Reference]`

*Pure lookup. These are **navigation shortcuts** — each entry points to a page that lives canonically in another section. They exist because some readers think in terms of "I need to look up a reference" rather than "I'm in the Building section." No content is duplicated; only navigation paths are duplicated.*

* Unified API `[Reference]` — *canonical home: on-site or deeply integrated*
* SDK reference `[Reference]` **🆕** — *canonical home: §4.8*
* Configuration reference `[Reference]` **🆕** — *canonical home: §5.4*
* Glossary `[Reference]` **🆕** — *canonical home: §3*
* Supported models and providers `[Reference]` ← *currently: Platform > AI Model Providers*
* Changelog `[Reference]` **🆕** — *auto-pulled from GitHub releases*

* * *

### 8\. Use Cases **🆕** `[Explanation]`

* By use case → features `[Explanation]` **🆕**
* By feature → use cases `[Explanation]` **🆕**
* Reference architectures **🆕**
  * Enterprise RAG with access control `[Explanation]` **🆕** — *links to §3 RAG in DIAL for conceptual context*
  * Eval-driven app development loop `[Explanation]` **🆕**
  * Multi-tenant deployment `[Explanation]` **🆕**
  * Hybrid cloud `[Explanation]` **🆕**

* * *

### 9\. Demos `[Landing]`

*Short (2–5 min) capability showcases for the **Evaluator** persona. No code, no setup instructions, no paired written walkthrough required — these are not tutorials. They answer "what can DIAL do?" not "how do I build with DIAL?"*

*Tutorial videos — longer, code-on-screen, step-by-step — are **not** in this section. They are embedded inline on their parent tutorial pages throughout Building with DIAL and Operating DIAL. If a tutorial video has no parent tutorial page, it has no home on the docs site until the written tutorial is created.*

← *currently: top-level Demos section — audit and split: showcase videos stay here, tutorial videos migrate to their parent pages*

* Platform overview
* Chat capabilities
* Apps and agents showcase
* Deployment and admin walkthrough

## Current pages - migration map

Every page currently on the site is accounted for below. If a page is not listed in the structure above, its disposition is noted here.

| Current page | Disposition | Current page | Disposition |
| :-- | :-- | :-- | :-- |
| Platform > Core > About | Content split: Unified API section → §3 Unified API overview; remainder absorbed into §3 Architecture highlights. Page retired. |  |  |
| Platform > Chat > About | Renamed to "DIAL Chat overview," absorbed into §3 Architecture highlights. Generic "About" title eliminated. |  |  |
| Platform > Architecture & Concepts > Main Concepts | Absorbed into §3 Core concepts and glossary. |  |  |
| Platform > Architecture & Concepts > Platform Components | Absorbed into §3 Architecture highlights. |  |  |
| Platform > Architecture & Concepts > Authentication (at /platform/core/auth-intro) | Merged into §3 Authentication and access control. URL mismatch fixed. |  |  |
| Platform > Architecture & Concepts > Access Control Overview | Merged into §3 Authentication and access control (one page, not two). |  |  |
| Platform > Core > Access Control | Merged into §3 Authentication and access control (one page, not two). |  |  |
| Platform > Deployment | Absorbed into §5.2 Cloud deployment > Helm chart overview. |  |  |
| Platform > Observability | Merged with DevOps observability → §5.6 Overview. |  |  |
| Platform > Analytics | Merged with DevOps analytics config → §5.6 Analytics Realtime setup. |  |  |
| Platform > Admin Panel | Merged with Tutorials > Admins > Introduction → §6 Admin Panel overview. |  |  |
| Platform > Handling High Loads | Absorbed into §5.7 Production readiness > Scaling. |  |  |
| Platform > Core > PII Compliance & Privacy | Absorbed into §5.7 Production readiness > Security hardening. |  |  |
| Platform > Core > Load Balancer | Relocated to §5.4 Configuration reference > Load balancer configuration. |  |  |
| Platform > Core > Per-Request Keys | Relocated to §4.13 Working with DIAL resources > Per-request keys. |  |  |
| Platform > Core > DIAL-Native Apps | Absorbed into §4.1 DIAL Apps overview and §4.2 Custom Apps > Architecture and lifecycle. |  |  |
| Platform > Chat > Data Visualization | Relocated to §4.9 Chat customization > Data visualization. |  |  |
| Platform > Chat > Marketplace | Relocated to §4.9 Chat customization > Marketplace. |  |  |
| Platform > Collaboration | Conceptual content → §3 Collaboration and sharing. Operational content → §4.13 and §6. |  |  |
| Tutorials > Mind Map Studio | User content → §2 Chat User Guide. Developer content → §4.5 Mind Map Studio. |  |  |
| Tutorials > DevOps (GitHub link) | Replaced with §5 Operating DIAL landing page on docs site. |  |  |
| Tutorials > Developers > Apps Development > Local Development (DIAL-to-DIAL Adapter) | Relocated to §5.1 Local setup. |  |  |
| Tutorials > Developers > Apps Development > Examples (cookbook) | Relocated to §4.2 Custom Apps > Examples. Stale content remediated. |  |  |
| Tutorials > DevOps > Configuration > Analytics Realtime Configuration | Relocated to §5.6 Analytics Realtime setup. |  |  |
| Tutorials > DevOps > Configuration > Enable Publications | Relocated to §5.4 Configuration reference > Enable publications. |  |  |
| Demo/tutorial videos currently in Demos section | Audited and split: showcase-only videos stay in §9 Demos; tutorial videos migrate to parent tutorial pages in §4 and §5. |  |  |
| Tutorials > Developers > Integrations > MS Teams | Relocated to §3.13.1 |  |  |
| Tutorials > Developers > Integrations > MS Copilot | Relocated to §3.13.1 |  |  |
| Tutorials > Developers > Integrations > MS Excel | Relocated to §3.13.2 |  |  |
| Tutorials > Developers > Integrations > n8n | Relocated to §3.13.3 |  |  |

  

[Filter table data](#)[Create a pivot table](#)[Create a chart from data series](#)

[Configure buttons visibility](/users/tfac-settings.action)