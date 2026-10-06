#!/usr/bin/env python3
"""
PR-body assembler for M2.

Takes the agent's per-page records (what it did, what to recapture, what to flag)
and formats them into the fixed, concise PR body: three buckets, counts in the
subtitle, one line per item, empty sections omitted. Deterministic, so every PR
looks the same whether CI or a human ran the sync.

The agent produces the records; this script owns the shape (humans won't read a
lot -- see references/m2-verify-and-write.md). Evidence stays in the diff and the
inline screenshot markers, NOT here.

Records JSON schema:
    {
      "from": "1.0.4", "to": "1.0.7", "release": "1.48",   # release optional
      "pages": [
        {"file": "3.catalog/3.toolsets.md",
         "done":      ["auth labels Log in->Connect; added API-key path"],
         "recapture": ["details panel (shows old 'Log in')"],
         "flag":      []}
      ]
    }

Usage:
    python assemble_pr.py records.json
    python assemble_pr.py records.json --out pr-body.md
    cat records.json | python assemble_pr.py -
"""

import argparse
import json
import re
import sys
from pathlib import Path


def short(page_file):
    """'3.catalog/3.toolsets.md' -> 'toolsets.md' (basename, numeric prefix stripped)."""
    base = page_file.rsplit("/", 1)[-1]
    return re.sub(r"^\d+\.", "", base)


def bucket_lines(pages, key):
    """[(page, item)] flattened across pages for one bucket, in page order."""
    out = []
    for p in pages:
        for item in p.get(key, []) or []:
            out.append(f"- {short(p['file'])} — {item}")
    return out


def assemble(records):
    frm = records.get("from", "?")
    to = records.get("to", "?")
    release = records.get("release")
    pages = records.get("pages", [])

    done = bucket_lines(pages, "done")
    recap = bucket_lines(pages, "recapture")
    flag = bucket_lines(pages, "flag")

    pages_updated = sum(1 for p in pages if p.get("done"))

    title = f"## Synced to chat {to}"
    if release:
        title += f" (DIAL {release})"

    subtitle = (f"{pages_updated} page{'s' if pages_updated != 1 else ''} updated"
                f" · {len(recap)} need screenshots · {len(flag)} flagged")

    out = [title, subtitle, ""]

    if not (done or recap or flag):
        out.append("No page changes required for this version.")
        return "\n".join(out)

    if done:
        out += ["## Done"] + done + [""]
    if recap:
        out += [f"## Recapture ({len(recap)})"] + recap + [""]
    if flag:
        out += [f"## Flag ({len(flag)})"] + flag + [""]

    return "\n".join(out).rstrip() + "\n"


def main():
    ap = argparse.ArgumentParser(description="Assemble the M2 PR body from agent records.")
    ap.add_argument("records", help="Records JSON file, or '-' for stdin.")
    ap.add_argument("--out", help="Write the PR body here instead of stdout.")
    args = ap.parse_args()

    raw = sys.stdin.read() if args.records == "-" else Path(args.records).read_text(encoding="utf-8")
    records = json.loads(raw)
    body = assemble(records)

    if args.out:
        Path(args.out).write_text(body, encoding="utf-8")
        print(f"PR body -> {args.out}")
    else:
        sys.stdout.write(body)


if __name__ == "__main__":
    main()
