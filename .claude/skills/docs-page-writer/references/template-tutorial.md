# Tutorial Template

Use this template when `type: tutorial` in frontmatter.

Tutorials are **learning-oriented**. They take a newcomer from zero to a working result. The reader is doing, not just reading.

## Rules

- Every step must be runnable as written on a clean machine. No "adapt this to your environment."
- Don't explain *why* mid-step — defer to an Explanation page and link to it.
- Include a verification check after every meaningful action ("you should see…").
- Pair with a sample repo: all code, data, and config committed to `github.com/epam/ai-dial-samples/<tutorial-slug>`.
- If a tutorial video exists, embed it on this page — videos don't live in a separate section.

## Structure

```markdown
---
title: "Build a RAG app with DIAL"
type: tutorial
persona: app-dev
component: apps
last_verified: 2026-04-27
owner: "@dial-sdk-team"
---

# Build a RAG app with DIAL

In this tutorial, you'll build a retrieval-augmented generation (RAG) application
using DIAL SDK and register it in DIAL Core. By the end, you'll have a working app
that answers questions from a document collection.

## Prerequisites

- DIAL running locally via Docker Compose ([Quick Start](/quick-start))
- Python 3.11+ installed
- Basic familiarity with Python and REST APIs

## What you'll build

_Screenshot or diagram of the end state._

A Custom App that takes a user question, retrieves relevant chunks from a
document store, and generates an answer using a model deployed in DIAL.

## Step 1: Set up the project

Create a new directory and install DIAL SDK:

    mkdir dial-rag-app && cd dial-rag-app
    pip install aidial-sdk==0.22.0

**Verify:** `pip show aidial-sdk` shows version 0.22.0.

## Step 2: Create the application

Create `app.py` with the following content:

    (complete, runnable code here)

**Verify:** (what to check)

## Step 3: Register in DIAL Core

(steps with verification)

## Step 4: Test the application

(steps with verification)

## What you learned

- How to create a Custom App using DIAL SDK
- How to register an application in DIAL Core
- How to connect a retriever to the chat completion flow

## Next steps

- [Tool Sets](/building/quick-apps/tool-sets/) — add tools to your app for dynamic data access
- [Evaluations](/building/evaluations/) — measure your RAG app's quality
- [Deploy to Kubernetes](/operating/cloud-deployment/) — take your app to production
```

## Anti-patterns to avoid

- **Explaining theory mid-step.** "Redis uses an append-only file for persistence, which means…" — save it for an Explanation page.
- **Offering alternatives.** "You could also use X instead." Tutorials have one path. How-tos have alternatives.
- **Assuming environment.** "If you're on Windows…" — link to the Environment Prerequisites page instead.
- **Skipping verification.** Every step needs a "you should see" checkpoint.
- **Ending without "What you learned" and "Next steps."**