# Explanation Template

Use this template when `type: explanation` in frontmatter.

Explanations are **understanding-oriented**. They discuss *why* something is the way it is: context, trade-offs, design decisions. The reader wants to understand, not do.

## Rules

- Never contains setup instructions. Link to How-tos for practical follow-up.
- May use "we" for design intent ("We chose this approach because…").
- Diagrams and concept maps are encouraged.
- Can reference trade-offs and alternatives honestly.
- Longer form is fine — this is where depth lives.

## Structure

```markdown
---
title: "RAG in DIAL"
type: explanation
persona: app-dev
component: apps
last_verified: 2026-04-27
owner: "@dial-sdk-team"
---

# RAG in DIAL

Retrieval-augmented generation (RAG) grounds model responses in real data by
retrieving relevant context before generating. This page explains how DIAL
approaches RAG, what components are involved, and when to use DIAL RAG versus
building your own pipeline with raw frameworks.

## Why RAG matters for enterprise deployments

(Context and motivation — 2–4 paragraphs)

## DIAL's approach

(Architecture explanation with diagram)

### DIAL RAG components

(Component overview: DIAL RAG, RAG Eval, Tool Sets, file storage)

### How DIAL RAG differs from LangChain/LlamaIndex

(Honest comparison — where DIAL adds value, where raw frameworks give more control)

## Trade-offs and limitations

(What DIAL RAG is not good at, when to choose a different approach)

## Further reading

- [Tutorial: Build a RAG app](/building/custom-apps/tutorial-rag) — hands-on guided build
- [RAG Eval toolkit](/building/evaluations/rag-eval) — measure retrieval and generation quality
- [Tool Sets](/building/quick-apps/tool-sets/) — connect RAG to agent workflows

## Next steps

- [Build a RAG app](/building/custom-apps/tutorial-rag) — put this understanding into practice
- [Enterprise RAG reference architecture](/use-cases/architectures/enterprise-rag) — production deployment pattern
```

## Anti-patterns to avoid

- **Smuggling in reference details.** Parameter tables belong in Reference pages.
- **Giving setup instructions.** "First, install…" belongs in a Tutorial or How-to.
- **Being vague to avoid controversy.** Explanations should state trade-offs clearly. "This approach sacrifices X for Y" is better than "there are various considerations."
- **Skipping diagrams.** If the concept has spatial or structural relationships, a diagram is mandatory, not optional.