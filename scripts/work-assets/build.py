"""
"Selected Work" scene assets, from the existing project screenshots.

Per project:
  - frame: the sharp screenshot, 16:10 crop (top-aligned, centred), AVIF + WebP at 800/1600w
  - plate: ambient mood background — the screenshot zoomed ×1.6, blurred, darkened 55%,
           graded like the hero, tinted with the project's mood colour. Baked (no runtime
           CSS filter) and small, since it's a blur.
plus meta.json (frame sizes).

Usage (same venv as scripts/hero-assets):
    python scripts/work-assets/build.py [--out src/assets/work]
"""

import argparse
import json
import sys
from pathlib import Path

import numpy as np
from PIL import Image, ImageFilter

sys.path.insert(0, str(Path(__file__).resolve().parent.parent / "hero-assets"))
from build import grade  # noqa: E402  (same grade as the hero)

ROOT = Path(__file__).resolve().parents[2]
IMAGES = ROOT / "src" / "assets" / "images"

# id → screenshot, mood tint (sRGB 0..1), horizontal crop anchor (0 left … 0.5 centre … 1 right)
PROJECTS = {
    "ajib": ("ajibhome.png", (0.16, 0.62, 0.6), 0.5),  # teal
    "admin-panel": ("adminpanel.png", (0.55, 0.52, 0.48), 0.5),  # neutral, warm grey
    "reviewnest": ("reviewnest.png", (0.16, 0.26, 0.58), 0.5),  # navy
}

# Screenshot clean-up: boxes (source px) painted out with the surrounding background,
# e.g. the framework dev-tools button captured in the bottom-left of the Ajib screenshot
CLEANUP = {
    "ajib": [(24, 1444, 126, 1544)],
}


def clean(img: Image.Image, boxes) -> Image.Image:
    """Fill each box with the median colour of a thin ring around it (flat UI backgrounds)."""
    out = img.copy()
    a = np.asarray(img)
    for x0, y0, x1, y1 in boxes:
        pad = 12
        ring = np.concatenate([
            a[max(0, y0 - pad):y0, x0:x1].reshape(-1, 3),
            a[y1:y1 + pad, x0:x1].reshape(-1, 3),
            a[y0:y1, max(0, x0 - pad):x0].reshape(-1, 3),
            a[y0:y1, x1:x1 + pad].reshape(-1, 3),
        ])
        out.paste(tuple(int(v) for v in np.median(ring, axis=0)), (x0, y0, x1, y1))
    return out

FRAME_ASPECT = 16 / 10
FRAME_WIDTHS = (800, 1600)

PLATE_WIDTH = 640
PLATE_ZOOM = 1.6
PLATE_BLUR = 18  # px at PLATE_WIDTH (≈ 40px once stretched over the viewport)
PLATE_DARKEN = 0.45  # −55%
PLATE_TINT = 0.55
# Light and dark screenshots must land on the same dark stage: after darkening,
# every plate is normalised to this mean luminance (keeps ink-white titles ≥ 7:1)
PLATE_MEAN_LUMA = 0.12


def save(img: Image.Image, out: Path, name: str, quality: int):
    img.save(out / f"{name}.webp", "WEBP", quality=quality, method=6)
    img.save(out / f"{name}.avif", "AVIF", quality=quality - 18, speed=4)


def frame_crop(img: Image.Image, anchor: float = 0.5) -> Image.Image:
    w, h = img.size
    if w / h > FRAME_ASPECT:
        cw = round(h * FRAME_ASPECT)
        x = round((w - cw) * anchor)
        return img.crop((x, 0, x + cw, h))
    ch = round(w / FRAME_ASPECT)
    return img.crop((0, 0, w, ch))  # top-aligned


def plate(img: Image.Image, tint, anchor: float) -> Image.Image:
    framed = frame_crop(img, anchor)
    w, h = framed.size
    cw, ch = round(w / PLATE_ZOOM), round(h / PLATE_ZOOM)
    x, y = (w - cw) // 2, (h - ch) // 2
    small = framed.crop((x, y, x + cw, y + ch)).resize(
        (PLATE_WIDTH, round(PLATE_WIDTH / FRAME_ASPECT)), Image.LANCZOS
    )
    small = small.filter(ImageFilter.GaussianBlur(PLATE_BLUR))
    rgb = np.asarray(small, dtype=np.float64) / 255
    rgb = grade(rgb) * PLATE_DARKEN
    luma = rgb @ np.array([0.2126, 0.7152, 0.0722])
    tinted = luma[..., None] * np.array(tint) * 2.2
    rgb = rgb * (1 - PLATE_TINT) + tinted * PLATE_TINT
    mean = float((rgb @ np.array([0.2126, 0.7152, 0.0722])).mean())
    rgb *= PLATE_MEAN_LUMA / max(mean, 1e-3)
    return Image.fromarray((np.clip(rgb, 0, 1) * 255).astype(np.uint8))


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--out", default=str(ROOT / "src" / "assets" / "work"))
    out = Path(ap.parse_args().out)
    out.mkdir(parents=True, exist_ok=True)

    meta = {}
    for pid, (file, tint, anchor) in PROJECTS.items():
        img = clean(Image.open(IMAGES / file).convert("RGB"), CLEANUP.get(pid, []))
        framed = frame_crop(img, anchor)
        widths = [w for w in FRAME_WIDTHS if w <= framed.width] or [framed.width]
        for i, w in enumerate(widths):
            save(framed.resize((w, round(w / FRAME_ASPECT)), Image.LANCZOS), out, f"frame-{pid}{'@2x' if i else ''}", 82)
        save(plate(img, tint, anchor), out, f"plate-{pid}", 70)
        meta[pid] = {"widths": widths, "aspect": FRAME_ASPECT}

    (out / "meta.json").write_text(json.dumps(meta, indent=2))
    print(json.dumps(meta, indent=2))


if __name__ == "__main__":
    main()
