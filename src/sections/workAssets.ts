import meta from "@/assets/work/meta.json";

/*
 * Scene images produced by scripts/work-assets/build.py (frames: sharp 16:10
 * screenshots; plates: tiny pre-blurred mood backgrounds).
 */
const files = import.meta.glob<string>("../assets/work/*.{avif,webp}", {
  eager: true,
  query: "?url",
  import: "default",
});

type Format = "avif" | "webp";
const url = (name: string) => files[`../assets/work/${name}`];
const metaFor = (id: string) => (meta as Record<string, { widths: number[]; aspect: number }>)[id];

export function frameSrcSet(id: string, format: Format): string {
  return (metaFor(id)?.widths ?? [])
    .map((w, i) => {
      const file = url(`frame-${id}${i ? "@2x" : ""}.${format}`);
      return file ? `${file} ${w}w` : null;
    })
    .filter(Boolean)
    .join(", ");
}

export const frameSrc = (id: string) => url(`frame-${id}.webp`);
export const plateSrc = (id: string, format: Format) => url(`plate-${id}.${format}`);
export const frameSize = (id: string) => {
  const w = metaFor(id)?.widths[0] ?? 800;
  return { width: w, height: Math.round(w / (metaFor(id)?.aspect ?? 1.6)) };
};

/** Rendered frame width (see Work.module.css --frame-w) */
export const FRAME_SIZES = "(min-width: 900px) min(52vw, (100vh - 330px) * 1.6), 92vw";

/** Route links(): the first scene's frame, low priority (the hero's plate comes first) */
export const firstFrameLink = (id: string) =>
  ({
    rel: "preload",
    as: "image",
    type: "image/avif",
    imageSrcSet: frameSrcSet(id, "avif"),
    imageSizes: FRAME_SIZES,
    fetchPriority: "low",
  }) as const;
