#!/usr/bin/env python3
"""
Multi-repo evidence gatherer for the DIAL Admin guide (M2 input step).

For each flagged page, produces an evidence bundle grouped BY REPO: spec diffs,
lists of changed code files under the matched globs, and a coarse label-changed
flag. For an ALL-NEW repo (the evaluation repos, absent at the 1.43 baseline) it
can't diff, so it lists the specs present at the target as "new-area" evidence to
author from.

Pure input-gathering; the reconcile/write decisions stay the agent's job
(references/m2-verify-and-write.md).

Usage:
    python gather.py                      # latest release on this branch
    python gather.py --release 1.48
    python gather.py --release 1.47 --out ./evidence
"""

import argparse
import tempfile
from pathlib import Path

import yaml

from detect import (
    git, glob_match, ensure_cache, fetch_tags, classify, MANIFEST,
)
from resolve_version import resolve_versions, latest_release, REPO_ROOT

MAX_DIFF_LINES = 150
MAX_CODE_FILES = 25


def spec_diff(cache, specs_root, frm, to, spec_name):
    path = f"{specs_root}/{spec_name}/spec.md"
    code, out, _ = git(cache, "diff", f"{frm}..{to}", "--", path)
    if code != 0 or not out.strip():
        content = file_at(cache, to, path)
        return f"(new spec)\n{content}" if content else "(no diff available)"
    lines = out.splitlines()
    if len(lines) > MAX_DIFF_LINES:
        lines = lines[:MAX_DIFF_LINES] + [f"... (+{len(lines) - MAX_DIFF_LINES} more lines)"]
    return "\n".join(lines)


def file_at(cache, ref, path):
    code, out, _ = git(cache, "show", f"{ref}:{path}")
    return out if code == 0 else None


def list_specs_at(cache, specs_root, ref):
    code, out, _ = git(cache, "ls-tree", "-d", "--name-only", f"{ref}:{specs_root}")
    if code != 0:
        return []
    return [l.strip().split("/")[-1] for l in out.splitlines() if l.strip()]


def prep_repos(manifest, release, cache_root):
    """Per repo: baseline/target/cache/changed-paths (or state)."""
    releases_dir = REPO_ROOT / manifest.get("dial_releases_path", "docs/releases")
    repo_keys = [r["key"] for r in manifest["repos"]]
    targets, _ = resolve_versions(releases_dir, release, repo_keys)

    info = {}
    for r in manifest["repos"]:
        key = r["key"]
        baseline = r.get("baseline")
        target = targets.get(key)
        signals = r.get("signals") or {}
        rec = {"baseline": baseline, "target": target, "signals": signals,
               "state": None, "cache": None, "changed": []}
        if target is None:
            rec["state"] = "absent"
        elif baseline is None:
            rec["state"] = "all-new"
            rec["cache"] = ensure_cache(cache_root / key, r["url"])
            ok, _ = fetch_tags(rec["cache"], target)
            rec["state"] = "all-new" if ok else "fetch-failed"
        elif baseline == target:
            rec["state"] = "unchanged"
        else:
            rec["cache"] = ensure_cache(cache_root / key, r["url"])
            ok, err = fetch_tags(rec["cache"], baseline, target)
            if not ok:
                rec["state"] = "fetch-failed"
            else:
                rec["state"] = "diffed"
                _, out, _ = git(rec["cache"], "diff", "--name-only", f"{baseline}..{target}")
                rec["changed"] = [l.strip() for l in out.splitlines() if l.strip()]
        info[key] = rec
    return info


def page_evidence(page, info):
    """Collect matched evidence per repo for one page."""
    out = {}
    for repo_key, src in (page.get("sources") or {}).items():
        rec = info.get(repo_key)
        if not rec or rec["state"] in ("absent", "unchanged", "fetch-failed"):
            continue
        signals = rec["signals"]

        if rec["state"] == "all-new":
            # No diff possible; offer the spec inventory at target as new-area evidence.
            specs_root = signals.get("specs")
            new_specs = list_specs_at(rec["cache"], specs_root, rec["target"]) if specs_root else []
            # keep only specs this page claims
            want = src.get("specs", [])
            matched = [s for s in new_specs if any(glob_match(s, g) for g in want)] if want else new_specs
            out[repo_key] = {"state": "all-new", "new_specs": sorted(matched)}
            continue

        specs_hit, code_hit, labels_hit = set(), set(), False
        for path in rec["changed"]:
            kind, key = classify(path, signals)
            if kind == "spec":
                for g in src.get("specs", []):
                    if glob_match(key, g):
                        specs_hit.add(key)
            elif kind == "code":
                for g in src.get("code", []):
                    if glob_match(key, g):
                        code_hit.add(path)
            elif kind == "labels" and src.get("labels"):
                labels_hit = True
        if specs_hit or code_hit or labels_hit:
            out[repo_key] = {"state": "diffed", "specs": sorted(specs_hit),
                             "code": sorted(code_hit), "labels": labels_hit}
    return out


def render(manifest, info, page_file, ev, release):
    guide_root = manifest["guide_root"]
    lines = [f"# Evidence: {page_file}", "",
             f"DIAL {release}. Page: `{guide_root}/{page_file}`", "",
             "> Input only. Apply the verdicts in references/m2-verify-and-write.md.", ""]
    for repo_key, e in ev.items():
        lines += [f"## {repo_key}", ""]
        if e["state"] == "all-new":
            lines.append("**ALL-NEW repo since baseline** (no diff). Author the section from "
                         "these specs at the target version:")
            lines += [f"- {s}" for s in e["new_specs"]] or ["(no matching specs)"]
            lines.append("")
            continue
        if e["labels"]:
            lines += ["**Labels changed** (en.ts) -- re-check this page's labels/screens.", ""]
        if e["code"]:
            lines += ["**Changed code files:**"]
            for c in e["code"][:MAX_CODE_FILES]:
                lines.append(f"- `{c}`")
            if len(e["code"]) > MAX_CODE_FILES:
                lines.append(f"- (+{len(e['code']) - MAX_CODE_FILES} more)")
            lines.append("")
        if e["specs"]:
            rec = info[repo_key]
            lines += ["**Spec diffs:**", ""]
            for s in e["specs"]:
                lines += [f"### {s}", "", "```diff",
                          spec_diff(rec["cache"], rec["signals"]["specs"],
                                    rec["baseline"], rec["target"], s), "```", ""]
    return "\n".join(lines)


def main():
    ap = argparse.ArgumentParser(description="Gather per-page evidence bundles (multi-repo).")
    ap.add_argument("--release", help="DIAL release. Default: latest on this branch.")
    ap.add_argument("--cache-root")
    ap.add_argument("--out")
    ap.add_argument("--manifest", default=str(MANIFEST))
    args = ap.parse_args()

    manifest = yaml.safe_load(Path(args.manifest).read_text(encoding="utf-8"))
    releases_dir = REPO_ROOT / manifest.get("dial_releases_path", "docs/releases")
    release = args.release or latest_release(releases_dir)
    cache_root = Path(args.cache_root or (Path(tempfile.gettempdir()) / "admin-guide-sync-cache"))

    info = prep_repos(manifest, release, cache_root)
    out_dir = Path(args.out or (Path(tempfile.gettempdir()) / f"admin-guide-evidence-{release}"))
    out_dir.mkdir(parents=True, exist_ok=True)

    print(f"DIAL {release} evidence -> {out_dir}\n")
    print("Per repo:", {k: v["state"] for k, v in info.items()}, "\n")

    n = 0
    for p in manifest["pages"]:
        ev = page_evidence(p, info)
        if not ev:
            continue
        n += 1
        slug = p["file"].replace("/", "__").replace(".md", "")
        bundle = out_dir / f"{slug}.md"
        bundle.write_text(render(manifest, info, p["file"], ev, release), encoding="utf-8")
        parts = []
        for rk, e in ev.items():
            if e["state"] == "all-new":
                parts.append(f"{rk.split('-')[-1]}:all-new({len(e['new_specs'])})")
            else:
                bits = []
                if e["specs"]: bits.append(f"{len(e['specs'])}spec")
                if e["code"]: bits.append(f"{len(e['code'])}code")
                if e["labels"]: bits.append("labels")
                parts.append(f"{rk.split('-')[-1]}:{'+'.join(bits)}")
        print(f"  {p['file']:42} {', '.join(parts)}")
    print(f"\n{n} page bundle(s) written.")


if __name__ == "__main__":
    main()
