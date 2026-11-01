import meta from "@/assets/hero/meta.json";
import grain from "@/assets/hero/grain.png";

/*
 * Hero images produced by scripts/hero-assets/build.py. Collected with a glob,
 * so a missing 2x file (small source) simply drops out of the srcset.
 */
const files = import.meta.glob<string>("../assets/hero/*.{avif,webp}", {
  eager: true,
  query: "?url",
  import: "default",
});

type Variant = "desktop" | "mobile";
type Layer = "plate" | "cutout";
type Format = "avif" | "webp";

const url = (name: string) => files[`../assets/hero/${name}`];

export function srcSet(layer: Layer, variant: Variant, format: Format): string {
  return meta[variant].widths
    .map((w, i) => {
      const file = url(`${layer}-${variant}${i ? "@2x" : ""}.${format}`);
      return file ? `${file} ${w}w` : null;
    })
    .filter(Boolean)
    .join(", ");
}

export const fallbackSrc = (layer: Layer) => url(`${layer}-desktop.webp`);

/** The scene box is sized like object-fit: cover, so these match its rendered width */
export const SIZES = {
  desktop: `max(100vw, ${(100 * meta.desktop.aspect).toFixed(2)}vh)`,
  mobile: `max(100vw, ${(100 * meta.mobile.aspect).toFixed(2)}vh)`,
};

/** Phones and tablets upright get the tall crop; a phone on its side keeps the wide one */
export const HERO_PORTRAIT = "(max-width: 899px) and (orientation: portrait)";

export const heroMeta = meta;
export const grainUrl = grain;

/** Route links(): preload the plate (the LCP image) for the matching layout */
export const plateLinks = [
  {
    rel: "preload",
    as: "image",
    type: "image/avif",
    imageSrcSet: srcSet("plate", "mobile", "avif"),
    imageSizes: SIZES.mobile,
    media: HERO_PORTRAIT,
    fetchPriority: "high",
  },
  {
    rel: "preload",
    as: "image",
    type: "image/avif",
    imageSrcSet: srcSet("plate", "desktop", "avif"),
    imageSizes: SIZES.desktop,
    media: "(min-width: 900px), (orientation: landscape)",
    fetchPriority: "high",
  },
] as const;
