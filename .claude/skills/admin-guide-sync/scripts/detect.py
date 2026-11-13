#!/usr/bin/env python3
"""
Multi-repo drift detector for the DIAL Admin User Guide.

Admin spans several source repos. For a target DIAL release this:
  - resolves each repo's shipped version (resolve_version),
  - per repo, fetches that repo's baseline (manifest) and target tags, diffs them,
    classifies each changed path using THAT repo's `signals` config, and routes it
    to the guide pages whose `sources[<repo>]` globs match,
  - merges everything into one work list.

A repo with `baseline: null` that now ships (e.g. the evaluation repos, absent at
1.43) can't be diffed -- it's reported as an ALL-NEW source for the catch-up, not a
drift diff.

Shared helpers (git/cache/fetch/classify/glob_match) are imported by gather.py.

Usage:
    python detect.py                 # latest release on this branch vs. manifest baselines
    python detect.py --release 1.48
    python detect.py --json
"""

import argparse
import fnmatch
import json
import subprocess
import sys
import tempfile
from pathlib import Path

import yaml

from resolve_version import resolve_versions, latest_release, REPO_ROOT

MANIFEST = Path(__file__).resolve().parent.parent / "manifest.yaml"


def git(repo, *args):
    r = subprocess.run(["git", "-C", str(repo), *args],
                       capture_output=True, text=True, encoding="utf-8", errors="replace")
    return r.returncode, r.stdout, r.stderr


def glob_match(name, pattern):
    return fnmatch.fnmatchcase(name.lower(), pattern.lower())


def ensure_cache(cache, url):
    cache = Path(cache)
    cache.mkdir(parents=True, exist_ok=True)
    if not (cache / ".git").exists():
        subprocess.run(["git", "-c", "core.longpaths=true", "init", "-q", str(cache)], check=True)
    code, _, _ = git(cache, "remote", "get-url", "origin")
    if code != 0:
        git(cache, "remote", "add", "origin", url)
    return cache


def fetch_tags(cache, *tags):
    args = ["fetch", "--depth", "1", "origin"]
    for t in tags:
        args += ["tag", t]
    code, _, err = git(cache, *args)
    if code != 0:
        return False, err.strip()
    for t in tags:
        code, _, _ = git(cache, "rev-parse", "--verify", "--quiet", f"{t}^{{commit}}")
        if code != 0:
            return False, f"tag not found after fetch: {t}"
    return True, ""


def classify(path, signals):
    """Map a repo-relative changed path to (kind, key) using that repo's signals."""
    specs = signals.get("specs")
    labels = signals.get("labels")
    code = signals.get("code")
    if specs and path.startswith(specs + "/"):
        return ("spec", path[len(specs) + 1:].split("/")[0])
    if labels and path == labels:
        return ("labels", None)
    if code and path.startswith(code + "/"):
        return ("code", path[len(code) + 1:])   # relative-to-code-root path
    return ("other", path)


def match_page(page, repo_key, kind, key):
    src = (page.get("sources") or {}).get(repo_key)
    if not src:
        return None
    if kind == "spec":
        for g in src.get("specs", []):
            if glob_match(key, g):
                return f"[{repo_key}] spec {key} (~{g})"
    elif kind == "code":
        # Report at the glob level, not per-file -- many files under one dir collapse
        # to one reason ("code ~components/Containers*"), which is what's actionable.
        for g in src.get("code", []):
            if glob_match(key, g):
                return f"[{repo_key}] code ~{g}"
    elif kind == "labels" and src.get("labels"):
        return f"[{repo_key}] labels changed"
    return None


def main():
    ap = argparse.ArgumentParser(description="Detect which admin-guide pages a release bump affects.")
    ap.add_argument("--release", help="DIAL release to target (e.g. 1.48). Default: latest on this branch.")
    ap.add_argument("--cache-root", help="Root dir for per-repo caches. Default: a temp dir.")
    ap.add_argument("--manifest", default=str(MANIFEST))
    ap.add_argument("--json", action="store_true")
    args = ap.parse_args()

    manifest = yaml.safe_load(Path(args.manifest).read_text(encoding="utf-8"))
    repos = manifest["repos"]
    pages = manifest["pages"]
    releases_dir = REPO_ROOT / manifest.get("dial_releases_path", "docs/releases")
    release = args.release or latest_release(releases_dir)

    repo_keys = [r["key"] for r in repos]
    target_versions, _ = resolve_versions(releases_dir, release, repo_keys)

    cache_root = Path(args.cache_root or (Path(tempfile.gettempdir()) / "admin-guide-sync-cache"))

    flagged = {p["file"]: [] for p in pages}
    unmatched = []            # (repo, path) changed but matched no page
    new_sources = []          # repos all-new since baseline (can't diff)
    skipped = []              # repos not in this release
    repo_summary = {}

    for r in repos:
        key = r["key"]
        baseline = r.get("baseline")
        target = target_versions.get(key)
        signals = r.get("signals") or {}

        if target is None:
            skipped.append(key)
            continue
        if baseline is None:
            new_sources.append((key, target))
            continue
        if baseline == target:
            repo_summary[key] = "unchanged"
            continue

        cache = ensure_cache(cache_root / key, r["url"])
        ok, errmsg = fetch_tags(cache, baseline, target)
        if not ok:
            repo_summary[key] = f"FETCH FAILED ({errmsg})"
            continue

        code, out, err = git(cache, "diff", "--name-only", f"{baseline}..{target}")
        if code != 0:
            repo_summary[key] = f"DIFF FAILED ({err.strip()})"
            continue
        changed = [l.strip() for l in out.splitlines() if l.strip()]
        repo_summary[key] = f"{baseline}..{target}, {len(changed)} files"

        for path in changed:
            kind, ckey = classify(path, signals)
            if kind == "other":
                unmatched.append((key, path))
                continue
            hit = False
            for p in pages:
                reason = match_page(p, key, kind, ckey)
                if reason:
                    if reason not in flagged[p["file"]]:
                        flagged[p["file"]].append(reason)
                    hit = True
            if not hit:
                unmatched.append((key, path))

    worklist = {f: rs for f, rs in flagged.items() if rs}

    if args.json:
        print(json.dumps({
            "release": release, "target_versions": target_versions,
            "repo_summary": repo_summary, "new_sources": new_sources,
            "skipped": skipped, "worklist": worklist,
            "unmatched_count": len(unmatched),
        }, indent=2))
        return

    print(f"DIAL {release} — admin guide drift\n")
    print("Per repo:")
    for k in repo_keys:
        if k in repo_summary:
            print(f"  {k}: {repo_summary[k]}")
    for k, v in new_sources:
        print(f"  {k}: ALL-NEW since baseline (now {v}) — new-section source, not diffable")
    for k in skipped:
        print(f"  {k}: not in this release")
    print()

    if not worklist:
        print("No page flagged. (Expected until per-page `sources` are filled — Phase 2.)")
    else:
        print(f"Pages to re-check ({len(worklist)} of {len(pages)}):")
        for f, rs in worklist.items():
            print(f"  {f}")
            for r in rs[:8]:
                print(f"      - {r}")
            if len(rs) > 8:
                print(f"      - (+{len(rs) - 8} more)")
    print(f"\nChanged files matched to NO page: {len(unmatched)} "
          f"(all of them until Phase 2 fills `sources`).")


if __name__ == "__main__":
    main()
