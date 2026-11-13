#!/usr/bin/env python3
"""
Evidence gatherer for M2 (verify & write).

The detector says WHICH pages changed and WHAT source changed under each. This
script turns that into a per-page EVIDENCE BUNDLE the agent reads before writing:
the actual changed material, pulled at the pinned `to` tag, with no judgment
applied. It is pure input-gathering -- the reconcile/write decisions stay the
agent's job (see references/m2-verify-and-write.md).

Per flagged page it collects:
  - spec diffs       what changed in each matched openspec/specs/<feature>/spec.md
  - label changes    key-level old -> new for each matched en.json namespace
  - code changes     list of changed files under matched page/component/hook folders
  - backend changes  list of changed apps/chat-api files
  - current page     the path of the guide page to edit

Output: one Markdown bundle per page in --out (default: a temp dir), plus an
index printed to stdout. Everything is fetched from chat_repo_url; no local clone.

Usage:
    python gather.py                      # latest DIAL release vs. manifest
    python gather.py --to 1.0.7
    python gather.py --to 1.0.7 --out ./evidence
"""

import argparse
import tempfile
from pathlib import Path

import yaml

import detect
from detect import (
    git, ensure_cache, fetch_tags, classify, glob_match, file_at, EN_JSON,
)
from resolve_version import resolve_chat_version, latest_release, REPO_ROOT

MANIFEST = Path(__file__).resolve().parent.parent / "manifest.yaml"
MAX_DIFF_LINES = 200  # per spec file, to keep a bundle readable


def load_json(text):
    import json
    try:
        return json.loads(text) if text else {}
    except json.JSONDecodeError:
        return {}


def namespace_key_diff(cache, frm, to, namespace):
    """old -> new for each changed key in one en.json namespace."""
    before = load_json(file_at(cache, frm, EN_JSON)).get(namespace, {})
    after = load_json(file_at(cache, to, EN_JSON)).get(namespace, {})
    if not isinstance(before, dict) or not isinstance(after, dict):
        return {}
    out = {}
    for k in sorted(set(before) | set(after)):
        if before.get(k) != after.get(k):
            out[k] = (before.get(k), after.get(k))
    return out


def spec_diff(cache, frm, to, spec_name):
    path = f"openspec/specs/{spec_name}/spec.md"
    code, out, _ = git(cache, "diff", f"{frm}..{to}", "--", path)
    if code != 0 or not out.strip():
        # New spec (absent in `frm`): show its full content as the evidence.
        content = file_at(cache, to, path)
        return f"(new spec)\n{content}" if content else "(no diff available)"
    lines = out.splitlines()
    if len(lines) > MAX_DIFF_LINES:
        lines = lines[:MAX_DIFF_LINES] + [f"... (+{len(lines) - MAX_DIFF_LINES} more lines)"]
    return "\n".join(lines)


def collect_per_page(manifest, cache, frm, to, changed):
    """For each page: the matched spec/label/code/backend changes."""
    pages = manifest["pages"]
    # Which en.json namespaces changed at all (cheap gate before key diffs).
    changed_ns = detect.changed_label_namespaces(cache, frm, to) or set()

    per_page = {}
    for p in pages:
        specs, codes, backends = set(), [], []
        for path in changed:
            kind, key = classify(path)
            if kind == "spec":
                for g in p.get("specs", []):
                    if glob_match(key, g):
                        specs.add(key)
            elif kind == "code":
                for g in p.get("code", []):
                    if glob_match(key, g):
                        codes.append(path)
            elif kind == "backend" and p.get("backend"):
                backends.append(path)
        # Label namespaces this page owns that changed.
        labels = []
        for g in p.get("labels", []):
            for ns in sorted(changed_ns):
                if glob_match(ns, g) and ns not in labels:
                    labels.append(ns)

        if specs or codes or backends or labels:
            per_page[p["file"]] = {
                "specs": sorted(specs),
                "labels": labels,
                "code": sorted(set(codes)),
                "backend": sorted(set(backends)),
            }
    return per_page


def render_bundle(manifest, cache, frm, to, page_file, ev):
    guide_root = manifest["guide_root"]
    page_path = f"{guide_root}/{page_file}"
    lines = [
        f"# Evidence: {page_file}",
        "",
        f"Chat {frm} -> {to}. Page to edit: `{page_path}`",
        "",
        "> Input only. Apply the verdicts in references/m2-verify-and-write.md.",
        "",
    ]

    if ev["labels"]:
        lines += ["## Label changes (en.json, old -> new)", ""]
        for ns in ev["labels"]:
            kd = namespace_key_diff(cache, frm, to, ns)
            lines.append(f"### `{ns}`")
            if not kd:
                lines.append("(namespace changed but no key-level diff resolved)")
            for k, (old, new) in kd.items():
                lines.append(f"- `{k}`: {old!r} -> {new!r}")
            lines.append("")

    if ev["specs"]:
        lines += ["## Spec changes (openspec/specs)", ""]
        for s in ev["specs"]:
            lines += [f"### {s}", "", "```diff", spec_diff(cache, frm, to, s), "```", ""]

    if ev["code"]:
        lines += ["## Changed code files (read if a spec didn't explain the change)", ""]
        lines += [f"- `{c}`" for c in ev["code"]] + [""]

    if ev["backend"]:
        lines += ["## Changed backend files (apps/chat-api)", ""]
        lines += [f"- `{b}`" for b in ev["backend"]] + [""]

    return "\n".join(lines)


def main():
    ap = argparse.ArgumentParser(description="Gather per-page evidence bundles for M2.")
    ap.add_argument("--to", help="New chat version/tag. Default: version the latest DIAL release ships.")
    ap.add_argument("--from", dest="frm", help="Old version/tag. Default: manifest.last_verified_chat_version.")
    ap.add_argument("--release", help="DIAL release to resolve --to from. Default: latest.")
    ap.add_argument("--cache", help="Chat repo cache dir. Default: a temp dir.")
    ap.add_argument("--out", help="Output dir for bundles. Default: a temp dir.")
    ap.add_argument("--manifest", default=str(MANIFEST))
    args = ap.parse_args()

    manifest = yaml.safe_load(Path(args.manifest).read_text(encoding="utf-8"))
    frm = args.frm or manifest.get("last_verified_chat_version")

    to = args.to
    release = None
    if not to:
        releases_dir = REPO_ROOT / manifest.get("dial_releases_path", "docs/releases")
        release = args.release or latest_release(releases_dir)
        to = resolve_chat_version(releases_dir, release)

    if frm == to:
        print(f"Guide already matches chat {to}; no evidence to gather.")
        return

    url = manifest["chat_repo_url"]
    cache = args.cache or str(Path(tempfile.gettempdir()) / "chat-guide-sync-cache")
    ensure_cache(cache, url)
    fetch_tags(cache, frm, to)

    code, out, err = git(cache, "diff", "--name-only", f"{frm}..{to}")
    if code != 0:
        raise SystemExit(f"git diff failed: {err.strip()}")
    changed = [l.strip() for l in out.splitlines() if l.strip()]

    per_page = collect_per_page(manifest, cache, frm, to, changed)

    out_dir = Path(args.out or (Path(tempfile.gettempdir()) / f"chat-guide-evidence-{to}"))
    out_dir.mkdir(parents=True, exist_ok=True)

    print(f"Chat {frm} -> {to}: evidence for {len(per_page)} page(s) -> {out_dir}\n")
    for page_file, ev in per_page.items():
        slug = page_file.replace("/", "__").replace(".md", "")
        bundle_path = out_dir / f"{slug}.md"
        bundle_path.write_text(render_bundle(manifest, cache, frm, to, page_file, ev), encoding="utf-8")
        parts = []
        if ev["labels"]:  parts.append(f"{len(ev['labels'])} label ns")
        if ev["specs"]:   parts.append(f"{len(ev['specs'])} specs")
        if ev["code"]:    parts.append(f"{len(ev['code'])} code")
        if ev["backend"]: parts.append("backend")
        print(f"  {page_file:34} {', '.join(parts)}")
        print(f"      -> {bundle_path}")


if __name__ == "__main__":
    main()
