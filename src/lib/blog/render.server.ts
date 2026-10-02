// Build-time only: Markdown → HTML with Shiki syntax highlighting.
import path from "node:path";
import { imageSizeFromFile } from "image-size/fromFile";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeShiki from "@shikijs/rehype";
import rehypeStringify from "rehype-stringify";
import type { Element, Root } from "hast";
import { fail, getPublishedSources, isLenient, PUBLIC_DIR } from "./posts.server";
import type { Post } from "./types";

/**
 * Lazy-loads images in post bodies and adds width/height for files in /public,
 * so the layout doesn't shift while they load. A missing file fails the build;
 * in dev it was already reported as a warning by posts.server.ts.
 */
function rehypeImages() {
  return async (tree: Root) => {
    const images: Element[] = [];
    const walk = (node: Root | Element) => {
      for (const child of node.children) {
        if (child.type !== "element") continue;
        if (child.tagName === "img") images.push(child);
        walk(child);
      }
    };
    walk(tree);

    await Promise.all(
      images.map(async (img) => {
        img.properties.loading = "lazy";
        img.properties.decoding = "async";
        const src = String(img.properties.src ?? "");
        if (!src.startsWith("/")) return;
        try {
          const { width, height } = await imageSizeFromFile(path.join(PUBLIC_DIR, src));
          img.properties.width = width;
          img.properties.height = height;
        } catch {
          if (!isLenient()) throw new Error(`afbeelding in de tekst niet gevonden: public${src}`);
        }
      }),
    );
  };
}

const processor = unified()
  .use(remarkParse)
  .use(remarkGfm)
  .use(remarkRehype) // raw HTML in Markdown is ignored on purpose
  .use(rehypeShiki, {
    theme: "vitesse-dark",
    transformers: [
      {
        // Exposes the language for the label in prose.css
        pre(node) {
          node.properties["data-language"] = this.options.lang;
        },
      },
    ],
  })
  .use(rehypeImages)
  .use(rehypeStringify);

export async function getPost(slug: string): Promise<Post | null> {
  const source = (await getPublishedSources()).find((p) => p.meta.slug === slug);
  if (!source) return null;
  try {
    const html = String(await processor.process(source.body));
    return { ...source.meta, html };
  } catch (e) {
    fail(`${slug}.md`, (e as Error).message);
  }
}
