# Diátaxis Classification Signals

Use these heuristics to classify a page. When signals conflict, the **dominant** pattern wins.

## Tutorial signals

The page IS a tutorial if:
- It has numbered steps that build on each other toward a goal
- It starts from a clean state and produces a working result
- It says "you will learn" or "by the end of this tutorial"
- It includes verification after steps ("you should see…")
- It has a "What you learned" section
- The reader creates something that didn't exist before

The page is NOT a tutorial if:
- Steps are "download and run" with no explanation (that's a quickstart)
- It assumes the reader already knows the domain (that's a how-to)
- Steps are optional or unordered (that's a how-to)
- It describes what something IS rather than guiding the reader to DO (that's an explanation)

## How-to signals

The page IS a how-to if:
- Title starts with a verb: "Configure…," "Enable…," "Add…," "Rotate…"
- It assumes the reader already knows what they want to achieve
- It provides steps without explaining why each step matters
- It offers alternatives ("you can also…")
- It addresses a specific, bounded task

The page is NOT a how-to if:
- It teaches concepts along the way (that's a tutorial)
- It exhaustively lists every parameter (that's reference)
- It discusses design decisions or trade-offs (that's explanation)

## Reference signals

The page IS a reference if:
- It's organized as a catalog: parameters, endpoints, config keys, error codes
- It uses tables with type/default/description columns
- Every entry is documented, even obvious ones
- Ordering is systematic (alphabetical, structural), not priority-based
- Voice is neutral and declarative — no "you should"
- It includes complete type information

The page is NOT a reference if:
- It explains WHY a setting exists (that's explanation)
- It walks through configuration step-by-step (that's how-to)
- It selectively highlights "important" settings (that's how-to or explanation)

## Explanation signals

The page IS an explanation if:
- It discusses WHY something is the way it is
- It covers trade-offs, alternatives, and design decisions
- It uses phrases like "this approach was chosen because…"
- It includes architecture diagrams showing relationships
- It compares DIAL to other tools or approaches
- It has no runnable steps

The page is NOT an explanation if:
- It includes setup instructions (those belong in how-to)
- It catalogs parameters (that's reference)
- It guides the reader through building something (that's tutorial)

## User guide signals

The page IS a user guide if:
- It documents a UI: "click this button," "navigate to this menu"
- It's organized by product feature, not by learning goal
- The reader is an end user, not a developer or operator
- Screenshots dominate

Use `type: user-guide` in frontmatter. User guides are distinct from how-tos (task-oriented for technical users) and tutorials (learning-oriented from zero). The Chat User Guide section is the primary example in DIAL docs.

## Common misclassification patterns in DIAL docs

These are the most frequent mistakes found during the Gap Analysis:

| Page looks like | But is actually | Why it's misclassified |
|---|---|---|
| "Tutorial" (in the Tutorials section) | Configuration reference | It documents JSON schema fields, not guided steps |
| "Tutorial" (in the Tutorials section) | User guide | It's a comprehensive product manual, not a learning experience |
| "Tutorial" (in the Tutorials section) | How-to | It assumes familiarity and provides task-oriented steps without teaching |
| "Platform" explanation | Detailed reference | It lists authorization rules, config files, and API endpoints |
| "Platform" explanation | Lightweight landing page | It's 3 paragraphs that link to the Tutorials section for real content |
| Quickstart | Tutorial | It has numbered steps but no explanation, no verification, no learning outcomes |

## Mixed pages — how to spot them

A page is mixed (needs splitting) if it:
- Starts with "What is X" (explanation) then switches to "How to configure X" (how-to)
- Has a concept section followed by a parameter table (explanation + reference)
- Teaches a concept via guided steps but also lists every configuration option (tutorial + reference)
- Contains a user guide section alongside developer API documentation (user guide + reference)

**Recommendation when mixed:** note both types and recommend splitting in the audit.