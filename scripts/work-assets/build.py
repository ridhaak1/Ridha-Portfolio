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

# Screenshot clean-up, in source px. The originals stay untouched.
# Boxes are painted out with the surrounding background: the framework dev-tools button and the
# "Join +2,000 students" row in Ajib, the account email in MyShop's logout button
CLEANUP = {
    "ajib": [(24, 1444, 126, 1544), (118, 1200, 722, 1298)],
    "admin-panel": [(2440, 60, 2612, 92)],
}
# MyShop: the word that's left, recentred on its button: source box, new left edge
MOVE = {
    "admin-panel": [((2350, 60, 2438, 92), 2439)],
}
# ReviewNest: the "500+ businesses" stat goes and the other two close the gap, so the row still
# starts at the margin. The background has a grid and a soft glow, so a flat fill would show.
STAT_ROW = {
    "reviewnest": {"box": (318, 1276, 1020, 1372), "keep_from": 580, "to": 327, "grid_dy": 96},
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


def move(img: Image.Image, moves, fill_from) -> Image.Image:
    """Lifts a box of text off a flat button and puts it back further along."""
    out = img.copy()
    for (x0, y0, x1, y1), to in moves:
        piece = img.crop((x0, y0, x1, y1))
        out.paste(tuple(int(v) for v in np.median(np.asarray(fill_from.crop((x1 + 2, y0, x1 + 40, y0 + 2))).reshape(-1, 3), axis=0)), (x0, y0, x1, y1))
        out.paste(piece, (to, y0))
    return out


def close_stat_row(img: Image.Image, box, keep_from, to, grid_dy) -> Image.Image:
    """
    Rebuilds a row of stats without its first one. The clean background comes from the same area one
    grid repeat lower, so the grid lines carry on; the kept text is what differs from that background.
    """
    a = np.asarray(img, dtype=np.float64).copy()
    x0, y0, x1, y1 = box
    row = a[y0:y1, x0:x1].copy()
    clean_bg = a[y0 + grid_dy:y1 + grid_dy, x0:x1].copy()
    text = row - clean_bg
    alpha = np.clip((np.abs(text).max(axis=2, keepdims=True) - 8) / 12, 0, 1)
    a[y0:y1, x0:x1] = clean_bg
    kept_x, target_x = keep_from - x0, to - x0
    width = x1 - keep_from
    placed = a[y0:y1, x0 + target_x:x0 + target_x + width]
    a[y0:y1, x0 + target_x:x0 + target_x + width] = placed + text[:, kept_x:kept_x + width] * alpha[:, kept_x:kept_x + width]
    return Image.fromarray(np.clip(a, 0, 255).astype(np.uint8))


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
        source = Image.open(IMAGES / file).convert("RGB")
        img = clean(source, CLEANUP.get(pid, []))
        if pid in MOVE:
            img = move(img, MOVE[pid], source)
        if pid in STAT_ROW:
            img = close_stat_row(img, **STAT_ROW[pid])
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
