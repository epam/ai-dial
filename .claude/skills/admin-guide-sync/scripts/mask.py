#!/usr/bin/env python3
"""Redact sensitive regions (real names, emails, API keys, etc.) in a screenshot.

Minimal by design: heavy Gaussian blur only, no badges/boxes/arrows, no solid fill --
this keeps the redaction visually consistent with a light UI instead of punching a hard
black box into the page. Use when a captured screenshot incidentally shows a real person's
identity or a secret value that a dedicated test account didn't avoid on its own.

Usage:
    python mask.py <src.png> <dst.png> "x,y,w,h" ["x2,y2,w2,h2" ...]

Coordinates are pixel coordinates in the SOURCE image (measure from the actual saved
screenshot file, not a downscaled preview -- a viewer often shows an image smaller than its
real size, and small measurement errors are invisible at that scale but land on the wrong
text once redrawn at full resolution). Keep each region tight around just the sensitive
text (e.g. a name), not the whole surrounding sentence.
"""
import sys
from PIL import Image, ImageFilter

BLUR_RADIUS = 12

def main():
    if len(sys.argv) < 4:
        print(__doc__)
        sys.exit(1)
    src, dst, *regions = sys.argv[1:]
    img = Image.open(src).convert("RGB")
    for region in regions:
        x, y, w, h = [int(v) for v in region.split(",")]
        box = (x, y, x + w, y + h)
        patch = img.crop(box).filter(ImageFilter.GaussianBlur(BLUR_RADIUS))
        img.paste(patch, box)
    img.save(dst)
    print(f"wrote {dst} ({len(regions)} region(s) blurred)")

if __name__ == "__main__":
    main()
