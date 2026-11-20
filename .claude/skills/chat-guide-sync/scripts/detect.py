#!/usr/bin/env python3
"""
Drift detector for the DIAL Chat User Guide sync pipeline.

Fetches ai-dial-chat from its URL (no local clone assumed), diffs two versions,
and prints which guide pages might now be wrong -- each with the reason it was
flagged, plus changed files that matched no page (coverage gaps worth seeing).

Fully automatic, zero required arguments:
  --to   defaults to the chat version the latest DIAL release ships
         (resolved from docs/releases via resolve_version.py).
  --from defaults to manifest.last_verified_chat_version.
The chat repo is fetched into a cache dir from manifest.chat_repo_url. Only the
two tags' trees are fetched (shallow) -- no working-tree checkout, so the repo's
long-path files never touch disk.

Usage:
    python detect.py                         # latest DIAL release vs. manifest
    python detect.py --to 1.0.19
    python detect.py --from 1.0.4 --to 1.0.7 --json
"""

import argparse
import fnmatch
import json
import subprocess
import sys
import tempfile
from pathlib import Path

EN_JSON = "apps/chat/src/i18n/locales/en.json"

import yaml

from resolve_version import resolve_chat_version, latest_release, REPO_ROOT

MANIFEST = Path(__file__).resolve().parent.parent / "manifest.yaml"


def git(repo, *args):
    # Force UTF-8 decoding; git output (en.json, diffs) contains bytes the
    # Windows default cp1252 codec cannot decode.
    r = subprocess.run(
        ["git", "-C", str(repo), *args],
        capture_output=True, text=True, encoding="utf-8", errors="replace",
    )
    return r.returncode, r.stdout, r.stderr


def ensure_cache(cache, url):
    """A minimal repo with just the remote set -- no checkout, no history."""
    cache = Path(cache)
    cache.mkdir(parents=True, exist_ok=True)
    if not (cache / ".git").exists():
        subprocess.run(["git", "init", "-q", str(cache)], check=True)
    code, out, _ = git(cache, "remote", "get-url", "origin")
    if code != 0:
        git(cache, "remote", "add", "origin", url)
    return cache


def fetch_tags(cache, *tags):
    """Shallow-fetch only the given tags' trees. diff A..B needs no common history."""
    args = ["fetch", "--depth", "1", "origin"]
    for t in tags:
        args += ["tag", t]
    code, _, err = git(cache, *args)
    if code != 0:
        sys.exit(f"git fetch failed for {tags}: {err.strip()}")
    for t in tags:
        code, _, _ = git(cache, "rev-parse", "--verify", "--quiet", f"{t}^{{commit}}")
        if code != 0:
            sys.exit(f"Tag not found after fetch: {t}")


def file_at(cache, ref, path):
    """Contents of one file at a ref, or None if absent there."""
    code, out, _ = git(cache, "show", f"{ref}:{path}")
    return out if code == 0 else None


def changed_label_namespaces(cache, frm, to):
    """Top-level en.json namespaces whose contents differ between the two refs.

    Routing by namespace (not the whole file) is what makes a label change flag
    only the owning pages instead of all 12.
    """
    before = file_at(cache, frm, EN_JSON)
    after = file_at(cache, to, EN_JSON)
    try:
        b = json.loads(before) if before else {}
        a = json.loads(after) if after else {}
    except json.JSONDecodeError:
        return None  # signal "could not parse" -> caller falls back to whole-file
    changed = set()
    for ns in set(b) | set(a):
        if b.get(ns) != a.get(ns):
            changed.add(ns)
    return changed


def glob_match(name, pattern):
    """Case-insensitive glob, deterministic across OSes (fnmatch.fnmatch is
    case-sensitive on Linux but not Windows -- we normalize ourselves)."""
    return fnmatch.fnmatchcase(name.lower(), pattern.lower())


def classify(path):
    """Map a changed repo path to (kind, key) the manifest can match against."""
    parts = path.split("/")
    if path == EN_JSON:
        return ("labels", None)
    if path.startswith("apps/chat-api/"):
        return ("backend", None)
    if path.startswith("openspec/specs/") and len(parts) > 2:
        return ("spec", parts[2])
    if path.startswith("openspec/changes/") and len(parts) > 2:
        return ("change", parts[2])
    # Raw UI code: route by the page/component/hook-area folder name. Must come
    # before the generic libs/ branch so chat-hooks routes by area, not as a lib.
    if path.startswith("libs/chat-hooks/src/") and len(parts) > 3:
        seg = parts[3]
        return ("code", seg[:-3] if seg.endswith(".ts") else seg)
    if path.startswith("apps/chat/src/pages/") and len(parts) > 4:
        return ("code", parts[4])
    if path.startswith("apps/chat/src/components/") and len(parts) > 4:
        return ("code", parts[4])
    if path.startswith("libs/") and len(parts) > 1:
        return ("lib", parts[1])
    return ("other", path)


def matches_page(kind, key, page):
    if kind == "spec":
        for g in page.get("specs", []):
            if glob_match(key, g):
                return f"spec {key} (matched '{g}')"
    elif kind == "lib":
        for g in page.get("libs", []):
            if glob_match(key, g):
                return f"lib {key}"
    elif kind == "code":
        for g in page.get("code", []):
            if glob_match(key, g):
                return f"code {key} (matched '{g}')"
    elif kind == "backend" and page.get("backend"):
        return "chat-api backend changed"
    return None


def label_reasons(page, changed_ns):
    """Changed en.json namespaces that this page owns. [] if none."""
    reasons = []
    for g in page.get("labels", []):
        for ns in sorted(changed_ns):
            if glob_match(ns, g) and f"label '{ns}' changed" not in reasons:
                reasons.append(f"label '{ns}' changed")
    return reasons


def main():
    ap = argparse.ArgumentParser(description="Detect which guide pages a chat version bump affects.")
    ap.add_argument("--to", help="New chat version/tag. Default: version the latest DIAL release ships.")
    ap.add_argument("--from", dest="frm", help="Old version/tag. Default: manifest.last_verified_chat_version.")
    ap.add_argument("--release", help="DIAL release to resolve --to from (e.g. 1.48). Default: latest.")
    ap.add_argument("--cache", help="Chat repo cache dir. Default: a temp dir.")
    ap.add_argument("--manifest", default=str(MANIFEST))
    ap.add_argument("--json", action="store_true")
    args = ap.parse_args()

    manifest = yaml.safe_load(Path(args.manifest).read_text(encoding="utf-8"))

    frm = args.frm or manifest.get("last_verified_chat_version")
    if not frm:
        sys.exit("No --from and manifest has no last_verified_chat_version.")

    to = args.to
    release = None
    if not to:
        releases_dir = REPO_ROOT / manifest.get("dial_releases_path", "docs/releases")
        release = args.release or latest_release(releases_dir)
        to = resolve_chat_version(releases_dir, release)

    if frm == to:
        msg = f"Guide already matches chat {to}"
        if release:
            msg += f" (DIAL {release})"
        print(msg + "; nothing to check.")
        return

    url = manifest["chat_repo_url"]
    cache = args.cache or str(Path(tempfile.gettempdir()) / "chat-guide-sync-cache")
    ensure_cache(cache, url)
    fetch_tags(cache, frm, to)

    code, out, err = git(cache, "diff", "--name-only", f"{frm}..{to}")
    if code != 0:
        sys.exit(f"git diff failed: {err.strip()}")
    changed = [l.strip() for l in out.splitlines() if l.strip()]

    pages = manifest["pages"]
    flagged = {p["file"]: [] for p in pages}
    unmatched = []

    # Non-label changes.
    for path in changed:
        kind, key = classify(path)
        if kind == "change":
            continue  # dated change proposal; its real spec is caught under specs/
        if kind == "other":
            unmatched.append(path)
            continue
        if kind == "labels":
            continue  # handled below, key-level
        hit_any = False
        for p in pages:
            reason = matches_page(kind, key, p)
            if reason:
                if reason not in flagged[p["file"]]:
                    flagged[p["file"]].append(reason)
                hit_any = True
        if not hit_any:
            unmatched.append(path)

    # Label changes, routed by namespace so only owning pages flag.
    labels_note = None
    orphan_ns = []
    if EN_JSON in changed:
        changed_ns = changed_label_namespaces(cache, frm, to)
        if changed_ns is None:
            # Could not parse -> fall back to flagging every page that owns labels.
            labels_note = ("Could not parse en.json at one ref; flagged every page "
                           "with a labels list as a safe fallback.")
            for p in pages:
                if p.get("labels"):
                    flagged[p["file"]].append("en.json changed (unparsed)")
        else:
            for p in pages:
                for r in label_reasons(p, changed_ns):
                    if r not in flagged[p["file"]]:
                        flagged[p["file"]].append(r)
            # Namespaces no page claims -> label coverage gaps.
            owned = set()
            for p in pages:
                for g in p.get("labels", []):
                    owned.update(ns for ns in changed_ns if glob_match(ns, g))
            orphan_ns = sorted(changed_ns - owned)

    worklist = {f: r for f, r in flagged.items() if r}

    if args.json:
        print(json.dumps({
            "release": release, "from": frm, "to": to,
            "changed_files": len(changed),
            "worklist": worklist, "unmatched": unmatched,
            "orphan_label_namespaces": orphan_ns,
        }, indent=2))
        return

    header = f"Chat {frm} -> {to}"
    if release:
        header += f" (DIAL {release})"
    print(f"{header}: {len(changed)} source files changed.\n")

    if not worklist:
        print("No guide page affected. (All changes are outside mapped dependencies.)")
    else:
        print(f"Pages to re-check ({len(worklist)} of {len(pages)}):\n")
        for f, reasons in worklist.items():
            print(f"  {f}")
            for r in reasons[:8]:
                print(f"      - {r}")
            if len(reasons) > 8:
                print(f"      - (+{len(reasons) - 8} more)")
            print()

    if labels_note:
        print(f"Note: {labels_note}\n")
    if orphan_ns:
        print(f"Changed en.json namespaces no page claims ({len(orphan_ns)}) "
              f"-- review for label coverage gaps: {', '.join(orphan_ns)}\n")

    if unmatched:
        print(f"Changed files matched to NO page ({len(unmatched)}) -- review for coverage gaps:")
        for p in unmatched[:40]:
            print(f"      {p}")
        if len(unmatched) > 40:
            print(f"      (+{len(unmatched) - 40} more)")


if __name__ == "__main__":
    main()
