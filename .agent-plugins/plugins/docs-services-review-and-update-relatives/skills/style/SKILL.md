---
name: style
description: Use when writing or changing text in Understand DIAL, Connecting to DIAL, Building with DIAL, or Operating DIAL in the epam/ai-dial docs - a sentence, a bullet, a step, a table cell, an admonition, a code example, a link, a diagram, or a Further reading entry - so that the edit matches the page's voice, form, and density and the page stays as readable as it was.
---

# Guide style

An edit in a guide must be invisible as an edit. Read the whole section first, then write the new text so that it could have been there from the start: same voice, same sentence length, same list form, same link style, same punctuation. When this skill and the page disagree, the page wins, except for the hard rules marked **Never**.

## Voice by page type

| `type` | Voice | Example from the guides |
|---|---|---|
| `tutorial` | second person, imperative steps, a visible result after each step | "In this tutorial you point Claude Code … at DIAL and watch a DIAL-hosted model reply." |
| `how-to` | imperative, goal first; assumes the reader knows why | "Add the key to the `keys` section of `config.json`." |
| `explanation` | third person, present tense; explains why and what to decide; names its reader | "This page explains those mechanisms and the access boundaries that come with them. It is for architects who have read [What is DIAL](…)." |
| `reference` (glossary, DIAL stack, SDK reference) | declarative, one fact per sentence | "The optional service that runs chat completions … on recurring or one-time schedules." |
| `landing` | what the section covers, then the list of its pages | "This section explains what DIAL provides, one capability per page." |

- Sentences of 15–20 words, 30 at most; paragraphs of 2–4 sentences.
- State current behavior: "Core keeps each user's toolset credentials", never "Core now keeps" or "Since 0.50, Core keeps".
- A minimum version stays where a reader acts on it: "DIAL Core 0.46.0 or later, the release that adds the `/anthropic` endpoint."
- No hedging ("might", "should work"), no exclamation marks, no emojis, no first person singular.
- **Never** use: simply, just, easy, easily, obviously, "please note that", "it should be noted", "click here", "our product", AI-powered, cutting-edge, best-in-class.

## Keep the page readable

- **Place new text where the reader needs it**: right after the sentence it qualifies, in the step that uses it, in the section about that need. Never append an afterthought at the end of a section.
- **One idea per edit.** A changed fact takes a changed clause, not a new paragraph.
- **Keep lists parallel.** A new bullet takes the form of its siblings: a bold lead with a period (`- **Toolsets.** …`), a link with an em dash and a description, or a plain sentence.
- **Don't stack callouts.** At most one new admonition per page, and none where a sentence does the job.
- **Don't widen tables.** Add a row only to a table that already lists such rows; never add a column.
- **Don't import reference detail.** A guide names a setting and links its row; it doesn't list defaults, allowed values, or every related setting.
- **Keep the page's own words** for its concepts. If a page says "Public space" with a capital P, or wraps terms in “curly quotes”, so does the new sentence.
- Never reword, reorder, or reformat text that the change doesn't touch.

## Punctuation and typography

- Em dashes are spaced (" — ") in every guide section, as in the Further reading format; tight dashes ("—") appear on only a few Building pages. Match the page.
- Oxford comma; ISO dates (`2026-11-25`); numerals in technical contexts.
- Product and service names as the Services landing writes them: DIAL Core, DIAL Chat, DIAL Admin, DIAL MCP Gateway. Some pages use positioning names such as DIAL Gateway; keep them where they are and don't add new ones.
- Terminology follows the glossary (`2.understand-dial/2.foundations/2.glossary.md`): Unified API, Toolset (one word), Application, Adapter, Interceptor, Quick App, Code App, Custom App. Assistant and Addon are deprecated.
- Environment variables, settings, values, paths, endpoints, and file names in backticks; HTTP methods in capitals.

## Admonitions

A new admonition takes the form its page already uses. On a page with none, take the form of its folder, then of its section:

| Section | Default form |
|---|---|
| Understand DIAL | `:::note` / `:::warning` blocks |
| Connecting to DIAL | a bold label and a blockquote |
| Building with DIAL | mixed: the folder decides |
| Operating DIAL | `:::note` / `:::warning` blocks |

```markdown
:::warning
The `simple` examples omit production concerns such as authentication, encryption, and high availability.
:::
```

```markdown
**Note**
> In bridge 0.2.1, OAuth external services fail unless the administrator changes the bridge's header block list.
```

- Labels: Note, Tip, Warning. Warning only for data loss, downtime, security exposure, cost, or a step that fails.
- `:::info` appears only where a page already has one, such as `:::info Coming soon`.
- Never convert an admonition to the other form.

## Code blocks and examples

- Every fence has a language (`bash`, `json`, `yaml`, `powershell`, `text`), and no shell prompts.
- Keep the page's placeholders: `<YOUR_DIAL_HOST>`, `<DIAL_API_KEY>`, `<CHART_VERSION>`, `https://dial.example.com`. In prose and tables, a placeholder goes in backticks; a bare `<WORD>` or `{…}` breaks the MDX build.
- `localhost` is right in local Docker Compose setups; elsewhere use the host style the page uses.
- Don't change pinned images, chart versions, or model IDs in a runnable example unless the step is broken; a tutorial's versions were tested together.

## Links

- Internal links are relative and end in `.md`, with the numeric prefixes; see `docs-services-review-and-update-relatives:docs-map`.
- Link the reference instead of restating it: the service page and its heading for a setting, the Admin or Chat guide for a screen.
- Link text says what the reader gets there: "[spending limits](…/14.global-settings.md#spending-limits)", not "here" or the file name.
- Further reading: one block, 2–6 links, `- [Title](./x.md) — what the reader gets`, lowercase after the dash unless a proper noun, no period. Add an entry only when the reader of this page will need the target.
- **Never** write `## Next steps`, `## Related …`, or `## See also`.

## Diagrams and images

- Diagrams are Mermaid. In Understand DIAL most use the palette's `classDef`s (`uiStyle`, `coreStyle`, `processingStyle`, `adapterStyle`, `storageStyle`, `extStyle`); Operating DIAL's diagrams use none. Keep the diagram's own style.
- Update a diagram only when a change in the window adds, removes, or renames a component or connection it shows; change only those nodes and edges. Never add or redraw one.
- Never add, replace, or delete an image or screenshot. A stale screenshot goes under "Needs review" with its path.

## Edit patterns

**A bold-lead bullet** in a list of mechanisms or limitations (`#688`, on the coding agents page):

```markdown
- **Toolsets.** An agent that calls DIAL toolsets over MCP signs in through [DIAL MCP Gateway](../../7.services/24.mcp-gateway/0.index.md). DIAL Core keeps each user's toolset credentials, so the agent never holds them.
```

**A qualifying sentence** right after the statement it limits:

```markdown
… The effective authorization rule for an object in a sub-folder includes restrictions applied to all parent sub-folders up to the “root” folder. [Org units](../../7.services/1.core/1.configuration/2.settings/7.access.md#sharing-and-org-units), a Preview feature that is off by default, change this inside a unit. There, the unit's roles decide who reads and writes, and folder read rules grant nothing.
```

**An entry in a hub list** that already points to the settings for a topic:

```markdown
- [Configure roles and rate limits](../5.auth-and-access-control/3.roles-and-rate-limits.md) — token, cost, and request limits per role and deployment
- [Spending limits](../../7.services/1.core/1.configuration/14.global-settings.md#spending-limits) — budgets in place of the role cost limit for callers who sign in through an identity provider
```

**A removed caveat**: delete the sentence or the admonition once a source says the limitation is gone, and repair the paragraph around it.

**A fixed step**: change the command, value, or path inside the step; keep its number, its code block, and its `**Verify:**` line.

## Final read

Read every changed paragraph aloud in its section:

- Does it read as if it were always there?
- Is every new claim backed by a source row in the ledger?
- Did any history wording ("now", "new", "since", "no longer") slip in?
- Did the page grow only by what the change needs?
- Does a link point where the text says it does?
