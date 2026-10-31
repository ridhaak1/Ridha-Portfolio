# Hero assets

`build.py` turns one portrait photo into everything the hero needs, in `src/assets/hero/`:
graded background plates and transparent cutouts (desktop 16:10 + mobile 9:19.5, AVIF + WebP,
1x/2x when the source is large enough), a film-grain tile and `meta.json` (sizes and head
position, which the hero uses to place the name behind the head).

## Run

```sh
python -m venv .venv-hero
.venv-hero/Scripts/python -m pip install "rembg[cpu]" pillow numpy pymatting   # Pillow ≥ 11.3 for AVIF
.venv-hero/Scripts/python scripts/hero-assets/build.py path/to/original.jpg
```

The first run downloads the rembg `isnet-general-use` model (~180 MB).
Then `npm run build` as usual — the hero picks up whatever files exist.

## Options

- `--alpha cutout.png` — use an external matte (e.g. a remove.bg export, RGBA or grey mask)
  instead of rembg, for better hair edges.
- `--debug some/folder` — also writes the raw and refined mattes for inspection.

Look and framing are constants at the top of the script (grade, plate blur/darkening,
subject shadow, vignette, and per-layout `zoom` / `head_y`).
