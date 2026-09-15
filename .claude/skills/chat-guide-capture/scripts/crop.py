#!/usr/bin/env python3
"""Crop a saved screenshot to a region, without re-fetching from the browser.

Use this whenever a screenshot already on disk just needs different framing (e.g.
excluding a sidebar, or tightening around a dialog) -- editing the saved file is
cheaper than another live `zoom`/`screenshot` call, since both of those are full
round-trips with real image tokens.

Usage:
    python crop.py <src> <dst> "x,y,w,h"

Coordinates are pixel coordinates in the SOURCE image.
"""
import sys
from PIL import Image

def main():
    if len(sys.argv) != 4:
        print(__doc__)
        sys.exit(1)
    src, dst, region = sys.argv[1:]
    x, y, w, h = [int(v) for v in region.split(",")]
    img = Image.open(src).convert("RGB")
    img.crop((x, y, x + w, y + h)).save(dst)
    print(f"wrote {dst} (cropped to {w}x{h} from {x},{y})")

if __name__ == "__main__":
    main()
