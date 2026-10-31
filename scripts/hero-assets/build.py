"""
Hero assets for the "Cinematic Depth" hero.

From one source photo it produces, for a desktop (16:10) and a mobile (9:19.5) crop:
  - plate:  the graded photo, softened (1.5px), darkened, with a vignette and a soft
            shadow where the subject stands (so parallax reads as depth, not a double)
  - cutout: the subject only (transparent), graded identically, edge colours
            decontaminated so there is no halo
encoded as AVIF + WebP at 1x/2x, plus a static film-grain tile and meta.json
(image sizes + where the head is, used to place the name behind it).

Usage (from a venv with: rembg[cpu] pillow numpy pymatting):
    python scripts/hero-assets/build.py SOURCE.jpg [--alpha cutout-alpha.png] [--out src/assets/hero]

--alpha takes an external matte (e.g. a remove.bg export: either an RGBA cutout or a
grey mask) instead of running rembg.
"""

import argparse
import json
from pathlib import Path

import numpy as np
from PIL import Image, ImageFilter, ImageOps

# Output widths (CSS px at 1x). 2x is produced when the source is big enough.
# zoom: frame height as a fraction of the source height. When the frame needs more
# picture than the photo has (a portrait photo in a 16:10 frame), the plate is
# extended with a mirrored, heavily blurred, darkened continuation of its edges.
# head_y: where the head centre sits in the frame (never extends below the photo).
DESKTOP = {"aspect": 16 / 10, "width": 1440, "zoom": 0.72, "head_y": 0.38}
MOBILE = {"aspect": 9 / 19.5, "width": 430, "zoom": 1.3, "head_y": 0.40}

EXTEND_BLUR = 22  # px of the 1x output
EXTEND_DARKEN = 0.5  # brightness at the far edge of an extension
EXTEND_SEAM = 110  # px of the 1x output over which the extension blends in
CUTOUT_EDGE_FADE = 0.03  # subject fades out near a photo edge that got extended

# Grade
DESATURATE = 0.15
BLACK_POINT = np.array([0x14, 0x12, 0x10]) / 255  # lifted, warm blacks
WARM_SHADOWS = np.array([0.025, 0.008, -0.02])
S_CURVE = 0.22

# Plate treatment (in CSS px of the 1x output)
PLATE_BLUR = 1.5
PLATE_DARKEN = 0.75
# Where the subject stands, the plate becomes a soft dark shadow: parallax offsets
# between plate and cutout then read as depth, never as a second head
SUBJECT_SHADOW = 0.82
SUBJECT_SHADOW_SPREAD = 26  # px of the 1x output (dilation)
SUBJECT_SHADOW_SOFTNESS = 34  # px of the 1x output (blur)
VIGNETTE = 0.38


def grade(rgb: np.ndarray) -> np.ndarray:
    """Slightly desaturated, warm shadows, lifted blacks, gentle S-curve. rgb in 0..1."""
    luma = rgb @ np.array([0.2126, 0.7152, 0.0722])
    out = rgb + (luma[..., None] - rgb) * DESATURATE
    s = out * out * (3 - 2 * out)  # smoothstep S-curve
    out = out + (s - out) * S_CURVE
    shadows = (1 - luma[..., None]) ** 2
    out = out + WARM_SHADOWS * shadows
    out = BLACK_POINT + (1 - BLACK_POINT) * out
    return np.clip(out, 0, 1)


def matte(img: Image.Image, alpha_path: str | None) -> np.ndarray:
    """Subject alpha in 0..1 at source resolution."""
    if alpha_path:
        ext = Image.open(alpha_path)
        ext = ext.getchannel("A") if ext.mode in ("RGBA", "LA") else ext.convert("L")
        return np.asarray(ext.resize(img.size, Image.LANCZOS), dtype=np.float64) / 255

    from rembg import new_session, remove

    session = new_session("isnet-general-use")
    mask = remove(
        img,
        session=session,
        only_mask=True,
        alpha_matting=True,
        alpha_matting_foreground_threshold=240,
        alpha_matting_background_threshold=12,
        alpha_matting_erode_size=8,
    )
    return np.asarray(mask.convert("L"), dtype=np.float64) / 255


def refine(alpha: np.ndarray, scale: float) -> np.ndarray:
    """Pull the edge in ~1px and feather it ~1px (in output px), so no background rim survives."""
    a = Image.fromarray((alpha * 255).astype(np.uint8))
    erode = max(3, int(round(1 * scale)) * 2 + 1)
    a = a.filter(ImageFilter.MinFilter(erode))
    a = a.filter(ImageFilter.GaussianBlur(max(0.6, 1 * scale)))
    return np.asarray(a, dtype=np.float64) / 255


def decontaminate(rgb: np.ndarray, alpha: np.ndarray) -> np.ndarray:
    """Estimate pure foreground colours at the soft edge (removes the background halo)."""
    from pymatting import estimate_foreground_ml

    return np.clip(estimate_foreground_ml(rgb, alpha), 0, 1)


def head_position(alpha: np.ndarray) -> tuple[float, float]:
    """Head centre (x, y) in source px: centre of the top part of the silhouette."""
    rows = np.where(alpha.max(axis=1) > 0.5)[0]
    top, bottom = rows[0], rows[-1]
    head_bottom = top + int((bottom - top) * 0.22)
    region = alpha[top:head_bottom] > 0.5
    ys, xs = np.nonzero(region)
    return float(xs.mean()), float(top + ys.mean())


def crop_box(size, spec, head):
    """Frame of zoom × source height, head at head_y. May extend past the photo on the
    top and the sides (never the bottom: the subject is cut off there)."""
    w, h = size
    ch = h * spec["zoom"]
    cw = ch * spec["aspect"]
    x = head[0] - cw / 2
    if cw <= w:
        x = np.clip(x, 0, w - cw)
    y = min(head[1] - ch * spec["head_y"], h - ch)
    return int(round(x)), int(round(y)), int(round(cw)), int(round(ch))


def ramp(n: int, length: float) -> np.ndarray:
    """0 at index 0 rising to 1 over `length` px (for blending at seams)."""
    return np.clip(np.arange(n) / max(length, 1), 0, 1)


def extend(rgb, alpha, fg, box, scale):
    """Pad the photo so `box` lies inside it. Plate padding: mirrored, blurred, darkened.
    Cutout padding: transparent, with the subject fading out near the padded edges."""
    h, w = alpha.shape
    x, y, cw, ch = box
    top, left, right = max(0, -y), max(0, -x), max(0, x + cw - w)
    if not (top or left or right):
        return rgb, alpha, fg, box

    pad = ((top, 0), (left, right), (0, 0))
    mirrored = np.pad(rgb, pad, mode="symmetric")
    blurred = np.asarray(
        Image.fromarray((mirrored * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(EXTEND_BLUR * scale)),
        dtype=np.float64,
    ) / 255
    H, W = mirrored.shape[:2]

    # Weight of the extension: 1 outside the photo, blending in across the seam;
    # darkening grows toward the outer edge
    seam = EXTEND_SEAM * scale
    ext = np.zeros((H, W))
    dark = np.ones((H, W))
    if top:
        d = top - np.arange(H)  # >0 inside the padding
        ext = np.maximum(ext, np.clip(d / seam + 0.5, 0, 1)[:, None])
        dark = np.minimum(dark, (1 - (1 - EXTEND_DARKEN) * np.clip(d / top, 0, 1))[:, None])
    if left:
        d = left - np.arange(W)
        ext = np.maximum(ext, np.clip(d / seam + 0.5, 0, 1)[None, :])
        dark = np.minimum(dark, (1 - (1 - EXTEND_DARKEN) * np.clip(d / left, 0, 1))[None, :])
    if right:
        d = np.arange(W) - (left + w - 1)
        ext = np.maximum(ext, np.clip(d / seam + 0.5, 0, 1)[None, :])
        dark = np.minimum(dark, (1 - (1 - EXTEND_DARKEN) * np.clip(d / right, 0, 1))[None, :])
    out = mirrored * (1 - ext[..., None]) + blurred * dark[..., None] * ext[..., None]

    a = np.pad(alpha, pad[:2])
    f = np.pad(fg, pad)
    fade = CUTOUT_EDGE_FADE * w
    if left:
        a[:, left:] *= ramp(W - left, fade)[None, :]
    if right:
        a[:, : left + w] *= ramp(left + w, fade)[::-1][None, :]
    return out, a, f, (x + left, y + top, cw, ch)


def vignette(w, h):
    yy, xx = np.mgrid[0:h, 0:w]
    d = np.hypot((xx / w - 0.5) * 1.1, (yy / h - 0.5))
    return 1 - VIGNETTE * np.clip((d - 0.35) / 0.45, 0, 1) ** 1.6


def save(img: Image.Image, out: Path, name: str, quality: int):
    img.save(out / f"{name}.webp", "WEBP", quality=quality, method=6)
    img.save(out / f"{name}.avif", "AVIF", quality=quality - 18, speed=4)


def build_variant(key, spec, rgb, fg, alpha, head, out: Path, meta: dict):
    src_h, src_w = alpha.shape
    box = crop_box((src_w, src_h), spec, head)
    scale_1x = box[2] / spec["width"]  # source px per output px
    rgb, alpha, fg, (x, y, cw, ch) = extend(rgb, alpha, fg, box, scale_1x)
    head = (head[0] - box[0] + x, head[1] - box[1] + y)
    crop = (slice(y, y + ch), slice(x, x + cw))
    c_rgb, c_fg, c_a = rgb[crop], fg[crop], alpha[crop]

    # Source px per 1x output px (padding doesn't change it): is a 2x worth exporting?
    widths = [spec["width"]]
    if scale_1x >= 2:
        widths.append(spec["width"] * 2)
    elif scale_1x > 1.2:
        widths.append(int(spec["width"] * scale_1x))  # best available "2x"

    # Plate: soften, darken, subject shadow, vignette
    plate = Image.fromarray((c_rgb * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(PLATE_BLUR * scale_1x))
    p = np.asarray(plate, dtype=np.float64) / 255 * PLATE_DARKEN
    shadow = Image.fromarray((c_a * 255).astype(np.uint8))
    shadow = shadow.filter(ImageFilter.MaxFilter(int(SUBJECT_SHADOW_SPREAD * scale_1x) | 1)).filter(
        ImageFilter.GaussianBlur(SUBJECT_SHADOW_SOFTNESS * scale_1x)
    )
    p *= 1 - SUBJECT_SHADOW * (np.asarray(shadow, dtype=np.float64) / 255)[..., None]
    p *= vignette(cw, ch)[..., None]
    plate = Image.fromarray((np.clip(p, 0, 1) * 255).astype(np.uint8))

    cutout = Image.fromarray(
        (np.dstack([c_fg, c_a]) * 255).astype(np.uint8), "RGBA"
    )

    for i, w in enumerate(widths):
        h = round(w / spec["aspect"])
        suffix = "" if i == 0 else "@2x"
        save(plate.resize((w, h), Image.LANCZOS), out, f"plate-{key}{suffix}", 78)
        save(cutout.resize((w, h), Image.LANCZOS), out, f"cutout-{key}{suffix}", 84)

    meta[key] = {
        "widths": widths,
        "aspect": spec["aspect"],
        "head": {"x": round((head[0] - x) / cw, 4), "y": round((head[1] - y) / ch, 4)},
        "crop": {"x": x, "y": y, "w": cw, "h": ch},
    }


def grain(out: Path):
    # Small tile, 16 grey levels: at 5% opacity it is indistinguishable from full noise
    rng = np.random.default_rng(7)
    noise = rng.normal(128, 42, (64, 64)).clip(0, 255)
    noise = (np.round(noise / 17) * 17).clip(0, 255).astype(np.uint8)
    Image.fromarray(noise, "L").save(out / "grain.png", optimize=True)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("source")
    ap.add_argument("--alpha", help="external matte instead of rembg")
    ap.add_argument("--out", default="src/assets/hero")
    ap.add_argument("--debug", help="folder for the raw matte and edge previews")
    args = ap.parse_args()

    out = Path(args.out)
    out.mkdir(parents=True, exist_ok=True)
    img = ImageOps.exif_transpose(Image.open(args.source)).convert("RGB")
    rgb = np.asarray(img, dtype=np.float64) / 255

    raw = matte(img, args.alpha)
    scale = img.width / DESKTOP["width"]
    alpha = refine(raw, scale)
    fg = decontaminate(rgb, alpha)

    graded = grade(rgb)
    graded_fg = grade(fg)
    head = head_position(alpha)

    if args.debug:
        dbg = Path(args.debug)
        dbg.mkdir(parents=True, exist_ok=True)
        Image.fromarray((raw * 255).astype(np.uint8)).save(dbg / "matte-raw.png")
        Image.fromarray((alpha * 255).astype(np.uint8)).save(dbg / "matte-refined.png")

    meta = {"source": {"w": img.width, "h": img.height}}
    build_variant("desktop", DESKTOP, graded, graded_fg, alpha, head, out, meta)
    build_variant("mobile", MOBILE, graded, graded_fg, alpha, head, out, meta)
    grain(out)
    (out / "meta.json").write_text(json.dumps(meta, indent=2))
    print(json.dumps(meta, indent=2))


if __name__ == "__main__":
    main()
