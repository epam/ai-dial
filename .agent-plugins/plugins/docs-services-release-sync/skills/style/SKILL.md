---
name: style
description: Use when writing or changing any text in docs_v2 of the epam/ai-dial repository, including a single table row, a sentence, an admonition, a deprecation, a Mermaid diagram, an image, a code example, a source link, or a Further reading entry, and when reviewing such a change for terminology, voice, formatting, or Markdown and MDX mistakes.
---

# DIAL docs style

The page around an edit sets its local conventions: table columns, how sources are cited, how defaults are written, how a row starts. Read the section before you change it, and make the new text indistinguishable from its neighbors. The rules below are the ones edits break most often.

## Voice

| Page `type` | Voice |
|---|---|
| `reference` (every service page except how-tos) | third person, declarative, present tense, no opinions: "Core retries another upstream on a retriable error." |
| `how-to` | imperative steps: "Set `THEMES_CONFIG_URL` on DIAL Chat." |
| `explanation`, `landing` | precise prose that explains why; no marketing |

- Sentences of 15–20 words, 30 at most. Paragraphs of 2–4 sentences.
- State behavior, not history: "The default is `30`," never "The default was raised from 10 to 30." The one exception is an upgrade note a reader must act on.
- No hedging ("might", "probably", "should work"), no exclamation marks, no emojis, no first person singular.
- Never use: simply, just, easy, easily, obviously, "please note that", "it should be noted", "click here", "our product", AI-powered, cutting-edge, best-in-class.
- Oxford comma, ISO dates (`2026-11-25`), numerals in technical contexts, and em dashes without spaces.

## Terminology

The glossary, `docs_v2/2.understand-dial/2.foundations/2.glossary.md`, is the authority.

| Write | Not |
|---|---|
| DIAL, DIAL Core, DIAL Chat, DIAL Admin, DIAL SDK | Dial, dial, the backend, the server |
| service names as the Services landing table writes them: DIAL Model Provider, DIAL Log Parser, DIAL MCP Gateway | shortened or repository names in prose |
| Unified API, for DIAL's extension of Chat Completions and Embeddings | "the DIAL API", or the Unified API as Core's only API: Core also serves OpenAI Responses and Anthropic Messages |
| Toolset, Toolsets | Tool Set, tool-set (code identifiers such as `tool_sets` stay as they are) |
| Application, Adapter, Interceptor, each in its own sense | one used for another |
| Quick App, Code App, Custom App, MCP server | Assistant, Addon (deprecated) |

Lowercase generic nouns mid-sentence ("an application", "an adapter"). HTTP methods are uppercase (`GET`). Environment variables, properties, values, paths, and file names are in backticks.

## Settings tables

- The standard columns are `| Variable | Default | Description |`. Existing tables also use `Setting`, `Property`, `Value`, or `Field` for the first column and add `Required` or `Applies to`. Keep a table's columns and row order.
- Insert a new row beside the rows it relates to, or at the end of its subsystem's table. Never re-sort a table.
- Name the environment variable when the service reads one. Give a Spring or JSON property name only when no variable exists. Core static settings use their JSON path, for example `redis.singleServerConfig.address`.
- Default: a literal in backticks (`` `false` ``, `` `300` ``), `—` for none, or a short phrase for a computed default ("Yesterday in the process's local date", "`DIAL_URL`").
- Description: one or two sentences that say what the setting does, its unit, its allowed values, and what it interacts with. Copy the neighbors' shape, such as a leading `**Required.**`, or a "The …" opening, or a trailing period.
- Put side effects and constraints in the row or in the paragraph right after the table.

## Admonitions

Pages use one of two forms. A new admonition takes the form its page already uses.

Most service pages use a bold label on its own line, followed by a blockquote. A page with no admonition yet also takes this form:

```markdown
**Warning**
> Reruns replace matching output partitions without a transactional rollback.
```

Pages that already contain a `:::note`, `:::tip`, or `:::warning` block use that form, for example the Core settings pages, the Chat and Quick Apps configuration pages, and the adapter overviews:

```markdown
:::warning
Leave `access.admin.rules` out to keep the built-in default.
:::
```

- The labels are Note, Tip, and Warning (`:::note`, `:::tip`, `:::warning`). Use Warning only for data loss, downtime, security exposure, or cost.
- `:::info` is reserved for the repository block of a service overview (`docs-services-release-sync:services-section`).
- Never convert an existing admonition to the other form.
- A deprecation is never an admonition; see "A deprecated setting" under Edit patterns.

## Code blocks

- Always set the language (`bash`, `yaml`, `json`, `python`, `text`, `regex`), and never include shell prompts.
- Placeholders are `<ANGLE_BRACKETS>` inside code. In prose and tables, a placeholder goes in backticks, because a bare `<WORD>` or `{…}` breaks the MDX build.
- Pin image and chart versions in runnable examples: the target tag for the service's own image, or `<VERSION>` where the page already uses it.
- Use `0.0.0.0` or a Compose service name (`http://dial-core:8080`), not `localhost`, in example hosts. Real defaults that contain `localhost` are reproduced as they are in tables.

## Source links

- Pin GitHub links to a release tag, with a line range when the link supports a specific claim: `https://github.com/epam/<REPO>/blob/<TAG>/<PATH>#L40-L44`.
- Cite the way the page already does: as inline link text ("The [command](…) defines five options"), or as a `Source:` / `Sources:` line after a table. Never add a source style the page doesn't use.
- Cite the code, not the README, as the authority for a setting or default. When upstream docs disagree with the code, document the code. Add one sentence about the difference only when readers of the upstream text would be misled.

## Internal links and Further reading

- Internal links follow the `docs-services-release-sync:docs-map` skill: relative, ending in `.md`, with numeric prefixes.
- A page other than `0.index.md` ends with at most one `## Further reading` block of 2–6 links: `- [Title](./x.md) — what the reader gets`. The description has at most 14 words, starts in lowercase unless it begins with a proper noun, and has no trailing period. `0.index.md` pages have no closing block. Never write `## Next steps`, `## Related …`, or `## See also`.
- Add a Further reading link only when the page now uses what the target covers.

## Diagrams

Diagrams are Mermaid: of the 58 in docs_v2, 44 are `flowchart` and 11 are `sequenceDiagram`. 19 of the 24 service folders have one, almost always in the overview. In a sync:

- Update a diagram when a release adds, removes, or renames a component, dependency, or connection that it shows. Change only those nodes and edges, and keep the direction, node ids, and classes of the rest.
- Never add or redraw a diagram. If a new feature needs one, list it under "Needs review".
- Mermaid diagrams contain no links. Put relative links in the text under the diagram.
- Give a new node the class of its kind from the palette below. Mark an optional dependency with a dashed arrow (`-.->`).

The palette:

```text
classDef uiStyle fill:#dcfce7,stroke:#16a34a,color:#14532d;          users, DIAL Chat, DIAL Admin
classDef coreStyle fill:#dbeafe,stroke:#2563eb,color:#1e3a8a;        DIAL Core
classDef processingStyle fill:#f3e8ff,stroke:#9333ea,color:#581c87;  services that do the work
classDef adapterStyle fill:#ffedd5,stroke:#ea580c,color:#7c2d12;     adapters, extension workloads
classDef storageStyle fill:#fef3c7,stroke:#d97706,color:#78350f;     databases, registries, caches
classDef extStyle fill:#e5e7eb,stroke:#6b7280,color:#374151;         external or optional systems
```

## Images

Never add, replace, or delete an image in a sync; screenshots and image diagrams can't be rebuilt from source. When a release makes an image wrong, leave it, and list it under "Needs review" with the page, the image path, and what changed. Only the Quick Apps folder has images among the service pages.

## Edit patterns for a release sync

**A new setting** is one row in the table of its subsystem:

```markdown
| `TOOL_CALL_RESULT_LIMIT__MAX_CHARS` | `80000` | The maximum length, in characters, of a tool response that reaches the model. A longer response is replaced by a "response too large" error. Must be at least `TOOL_CALL_RESULT_OFFLOAD__SIZE_THRESHOLD`. |
```

**A changed default** edits the Default cell and any sentence that repeats the old value. Search the folder for the old value first.

**A deprecated setting** keeps its row. The Description starts with `**Deprecated.**`, names the replacement, and says what happens when both are set:

```markdown
| `DEFAULT_REGION` | — | **Deprecated.** Use `GCP_DEFAULT_REGION`; ignored when that is set. |
```

A page with a `## Deprecated variables` or `## Deprecated fields` section, such as the Quick Apps backend and manifest pages, lists it there instead, in that table's columns.

**A renamed setting:** document the new name. Keep the old one only if it still works, as a deprecated setting.

**A removed setting or feature:** delete its row or text. Search docs_v2 for the name and fix every mention.

**A behavior change** is one sentence in the section that describes that behavior, stated as current behavior:

```markdown
Apps without a `dial_files` block get every `internal_file_*` tool, including the ones that write, move, and delete files. Set `features.dial_files.enabled_tools` to `read_only` for agents that must not change the workspace.
```

**A breaking change or migration step** is one sentence naming the version, or a Warning when it risks data loss, downtime, security exposure, or cost:

```markdown
**Warning**
> From 0.23.0, DIAL Admin takes access decisions from DIAL Core's `GET /v1/user/role-assignments`. With authentication on and no admin rules, Core answers `NONE` for every caller, so configure Core's admin rules before you upgrade.
```

**A fixed limitation or a released "development branch" feature:** delete the caveat, and document the released behavior.

**A substantial new feature with a configuration surface** is a new H2 or H3 in the page that owns the topic: one opening paragraph, its settings table, and its source links. Add a page only as described in `docs-services-release-sync:change-triage`.

## Final read

Before finishing, read every changed paragraph as a reader would:

- Delete every sentence the reader would not miss.
- Check that each new claim has a pinned source.
- Check that no version, date, or history wording leaked into prose.
- Check that the edit doesn't repeat a fact another page owns. Link that page instead.
