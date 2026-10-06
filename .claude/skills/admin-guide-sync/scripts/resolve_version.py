#!/usr/bin/env python3
"""
Resolve the DIAL Admin component versions the latest DIAL release ships.

Admin spans several repos, so this returns a {repo_key: version} map, one entry
per repo listed in manifest.yaml `repos`, read from the latest release's
upgrade-to-<N>.md (lines like "ai-dial-admin-frontend: `0.20.0`").

A tracked repo missing from the upgrade doc is reported, not fatal: a repo may
legitimately not ship in a given release (e.g. the evaluation repos did not exist
at 1.43). The caller decides what to do (for catch-up, a repo with `baseline: null`
that now appears is an all-new source).

NOTE: this branch may not have the newest release folder (e.g. 1.48 lives on
`main`). Sync `docs/releases` from `main` first, or pass --release.

Usage:
    python resolve_version.py                 # latest release on this branch
    python resolve_version.py --release 1.48
    python resolve_version.py --json
"""

import argparse
import json
import re
import sys
from pathlib import Path

import yaml

MANIFEST = Path(__file__).resolve().parent.parent / "manifest.yaml"
REPO_ROOT = Path(__file__).resolve().parents[4]


def version_tuple(name):
    try:
        return tuple(int(p) for p in name.split("."))
    except ValueError:
        return None


def latest_release(releases_dir):
    versions = [p.name for p in releases_dir.iterdir()
                if p.is_dir() and version_tuple(p.name)]
    if not versions:
        sys.exit(f"No release folders in {releases_dir}")
    return max(versions, key=version_tuple)


def resolve_versions(releases_dir, release, repo_keys):
    doc = releases_dir / release / f"upgrade-to-{release}.md"
    if not doc.exists():
        sys.exit(f"Upgrade doc not found: {doc}")
    text = doc.read_text(encoding="utf-8")
    found, missing = {}, []
    for key in repo_keys:
        # "<key>: `X.Y.Z`" -- the trailing backtick-quoted semver.
        m = re.search(rf"{re.escape(key)}:\s*`(\d+\.\d+\.\d+)`", text)
        if m:
            found[key] = m.group(1)
        else:
            missing.append(key)
    return found, missing


def main():
    ap = argparse.ArgumentParser(description="Resolve admin component versions a DIAL release ships.")
    ap.add_argument("--release", help="Release folder name (e.g. 1.48). Default: latest on this branch.")
    ap.add_argument("--manifest", default=str(MANIFEST))
    ap.add_argument("--json", action="store_true")
    args = ap.parse_args()

    manifest = yaml.safe_load(Path(args.manifest).read_text(encoding="utf-8"))
    releases_dir = REPO_ROOT / manifest.get("dial_releases_path", "docs/releases")
    repo_keys = [r["key"] for r in manifest["repos"]]

    release = args.release or latest_release(releases_dir)
    found, missing = resolve_versions(releases_dir, release, repo_keys)

    if args.json:
        print(json.dumps({"release": release, "versions": found, "missing": missing}, indent=2))
        return

    print(f"DIAL {release} ships:")
    for k, v in found.items():
        print(f"  {k}: {v}")
    if missing:
        print(f"Not listed in this release's upgrade doc ({len(missing)}): {', '.join(missing)}")


if __name__ == "__main__":
    main()
