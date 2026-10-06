#!/usr/bin/env python3
"""
Per-version component changelog reader.

Each admin component publishes its release notes as the ANNOTATED GIT TAG message
(a developer-written, feature-scoped list for that version, e.g.
"(Assets) add roles support to platform applications and toolsets"). This is the
primary "what shipped and where to look" signal for the reconcile -- it tells the
agent what to read in the diff instead of eyeballing a 1000-line diff.

For each repo it lists the version tags in (baseline, target] and prints each tag's
annotation, oldest first -- i.e. the release-by-release changelog across the span.

Usage:
    python changelog.py                      # all repos, baseline..latest-release target
    python changelog.py --release 1.48
    python changelog.py --repo ai-dial-admin-frontend
    python changelog.py --repo ai-dial-admin-frontend --from 0.16.0 --to 0.21.0
"""

import argparse
import re
import subprocess
import tempfile
from pathlib import Path

import yaml

from detect import git, ensure_cache
from resolve_version import resolve_versions, latest_release, version_tuple, REPO_ROOT

MANIFEST = Path(__file__).resolve().parent.parent / "manifest.yaml"


def remote_version_tags(cache):
    code, out, _ = git(cache, "ls-remote", "--tags", "origin")
    tags = []
    for line in out.splitlines():
        m = re.search(r"refs/tags/(\d+\.\d+\.\d+)$", line.strip())
        if m:
            tags.append(m.group(1))
    return sorted(set(tags), key=version_tuple)


def versions_in_range(cache, frm, to):
    """Version tags strictly after `frm`, up to and including `to`."""
    lo, hi = version_tuple(frm), version_tuple(to)
    return [t for t in remote_version_tags(cache)
            if lo < version_tuple(t) <= hi]


def tag_annotation(cache, tag):
    # Fetch the tag (shallow) then read its annotation body.
    git(cache, "fetch", "--depth", "1", "origin", "tag", tag)
    code, out, _ = git(cache, "tag", "-l", "--format=%(contents)", tag)
    return out.strip() if code == 0 else ""


def main():
    ap = argparse.ArgumentParser(description="Read per-version component changelogs across the catch-up span.")
    ap.add_argument("--repo", help="One repo key. Default: all repos with a baseline.")
    ap.add_argument("--release", help="DIAL release for the target versions. Default: latest.")
    ap.add_argument("--from", dest="frm", help="Override baseline (only with --repo).")
    ap.add_argument("--to", help="Override target (only with --repo).")
    ap.add_argument("--cache-root")
    ap.add_argument("--manifest", default=str(MANIFEST))
    args = ap.parse_args()

    manifest = yaml.safe_load(Path(args.manifest).read_text(encoding="utf-8"))
    repos = {r["key"]: r for r in manifest["repos"]}
    releases_dir = REPO_ROOT / manifest.get("dial_releases_path", "docs/releases")
    release = args.release or latest_release(releases_dir)
    targets, _ = resolve_versions(releases_dir, release, list(repos))
    cache_root = Path(args.cache_root or (Path(tempfile.gettempdir()) / "admin-guide-sync-cache"))

    keys = [args.repo] if args.repo else list(repos)
    for key in keys:
        r = repos[key]
        baseline = args.frm if (args.repo and args.frm) else r.get("baseline")
        target = args.to if (args.repo and args.to) else targets.get(key)
        print(f"\n{'='*70}\n{key}\n{'='*70}")
        if target is None:
            print("  not shipped in this release"); continue
        if baseline is None:
            print(f"  ALL-NEW (no baseline). Target {target}; read its tag annotation directly.")
            baseline = target  # just show the target's own notes below
        cache = ensure_cache(cache_root / key, r["url"])
        span = versions_in_range(cache, baseline, target) if baseline != target else [target]
        if not span:
            print(f"  no version tags in ({baseline}, {target}] -- up to date."); continue
        for v in span:
            ann = tag_annotation(cache, v)
            print(f"\n--- {v} ---")
            print(ann if ann else "  (no tag annotation)")


if __name__ == "__main__":
    main()
