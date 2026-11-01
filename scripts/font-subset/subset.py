"""
Subsets IBM Plex Sans Arabic 700 to the Arabic letters used by `greetings` in src/config/site.ts.
Re-run this whenever a greeting with new Arabic letters is added.

  pip install fonttools brotli
  npm pack @fontsource/ibm-plex-sans-arabic   (then unpack it somewhere temporary)
  python scripts/font-subset/subset.py <unpacked>/package/files/ibm-plex-sans-arabic-arabic-700-normal.woff2

All of a letter's joining forms are kept, so the words stay connected.
"""
import re
import sys
from pathlib import Path

from fontTools import subset

ROOT = Path(__file__).resolve().parents[2]
CONFIG = ROOT / "src" / "config" / "site.ts"
OUT = ROOT / "public" / "fonts" / "IBMPlexSansArabic-700-subset.woff2"

ARABIC = re.compile(r"[؀-ۿݐ-ݿ]")


def main(source: str) -> None:
    text = "".join(sorted(set(ARABIC.findall(CONFIG.read_text(encoding="utf-8")))))
    if not text:
        sys.exit(f"No Arabic letters found in {CONFIG}")

    options = subset.Options()
    options.flavor = "woff2"
    options.layout_features = ["*"]  # init, medi, fina, rlig…: Arabic shaping depends on them
    options.hinting = False
    options.desubroutinize = True
    options.notdef_outline = True

    font = subset.load_font(source, options)
    subsetter = subset.Subsetter(options)
    subsetter.populate(text=text)
    subsetter.subset(font)
    subset.save_font(font, str(OUT), options)

    print(f"{len(text)} letters, {len(font.getGlyphOrder())} glyphs, {OUT.stat().st_size} bytes -> {OUT.name}")


if __name__ == "__main__":
    if len(sys.argv) != 2:
        sys.exit(__doc__)
    main(sys.argv[1])
