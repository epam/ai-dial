#!/usr/bin/env python3
"""
Resolve the ai-dial-chat version the latest DIAL platform release ships.

Reads the newest release folder under docs/releases/<N>/ in THIS repo, opens its
upgrade-to-<N>.md, and extracts the single `ai-dial-chat: X.Y.Z` line. That
version is the "--to" the detector diffs the guide toward.

Fails loud if the upgrade doc names zero or more than one chat version >= 1.0.0,
rather than guessing -- a second match means a release exception (as 1.47 had,
when the old 0.4x line ended) and a human should look.

Usable both automatically (no args; reads paths from manifest.yaml) and by hand.

Usage:
    python resolve_version.py                 # latest release, from manifest paths
    python resolve_version.py --release 1.48  # a specific release
    python resolve_version.py --json
"""

import argparse
import json
import re
import sys
from pathlib import Path

import yaml

MANIFEST = Path(__file__).resolve().parent.parent / "manifest.yaml"
REPO_ROOT = Path(__file__).resolve().parents[4]  # .claude/skills/<skill>/scripts -> repo root

# `ai-dial-chat:` then a backtick-quoted semver. The trailing colon stops this
# from also matching `ai-dial-chat-themes:`.
CHAT_LINE = re.compile(r"ai-dial-chat:\s*`(\d+\.\d+\.\d+)`")


def version_tuple(name):
    try:
        return tuple(int(p) for p in name.split("."))
    except ValueError:
        return None


def latest_release(releases_dir):
    versions = []
    for p in releases_dir.iterdir():
        if p.is_dir() and version_tuple(p.name):
            versions.append(p.name)
    if not versions:
        sys.exit(f"No release folders found in {releases_dir}")
    return max(versions, key=version_tuple)


def resolve_chat_version(releases_dir, release):
    doc = releases_dir / release / f"upgrade-to-{release}.md"
    if not doc.exists():
        sys.exit(f"Upgrade doc not found: {doc}")
    found = CHAT_LINE.findall(doc.read_text(encoding="utf-8"))
    # Keep only the current (>= 1.0.0) chat line; drop any legacy 0.4x mention.
    current = [v for v in found if version_tuple(v) >= (1, 0, 0)]
    if len(current) == 0:
        sys.exit(f"No `ai-dial-chat: X.Y.Z` (>= 1.0.0) found in {doc}. "
                 f"Release may ship no new chat, or the doc format changed.")
    if len(current) > 1:
        sys.exit(f"Expected exactly one chat version in {doc}, found {len(current)}: "
                 f"{current}. Likely a release exception -- resolve by hand.")
    return current[0]


def main():
    ap = argparse.ArgumentParser(description="Resolve the chat version a DIAL release ships.")
    ap.add_argument("--release", help="Release folder name (e.g. 1.48). Default: latest.")
    ap.add_argument("--manifest", default=str(MANIFEST))
    ap.add_argument("--json", action="store_true")
    args = ap.parse_args()

    manifest = yaml.safe_load(Path(args.manifest).read_text(encoding="utf-8"))
    releases_dir = REPO_ROOT / manifest.get("dial_releases_path", "docs/releases")
    if not releases_dir.exists():
        sys.exit(f"Releases dir not found: {releases_dir}")

    release = args.release or latest_release(releases_dir)
    version = resolve_chat_version(releases_dir, release)

    if args.json:
        print(json.dumps({"release": release, "chat_version": version}))
    else:
        print(f"DIAL {release} ships ai-dial-chat {version}")


if __name__ == "__main__":
    main()
