// Build-time only: reads Markdown posts from content/blog. Never shipped to the browser.
// Uses relative imports only, because react-router.config.ts imports this file too.
// Messages are Dutch on purpose: they are read by the blog author.
//
// Two modes (set in vite.config.ts):
// - `npm run build`: strict — any problem in a published post stops the build.
// - `npm run dev`:   lenient — problems become warnings shown on the page and in the terminal.
import fs from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { parse as parseYaml } from "yaml";
import type { PostMeta } from "./types";

const CONTENT_DIR = path.resolve(process.cwd(), "content/blog");
export const PUBLIC_DIR = path.resolve(process.cwd(), "public");
const WORDS_PER_MINUTE = 200;
const SUMMARY_LENGTH = 160;
const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

// Read at call time: vite.config.ts sets these after this module may have been loaded.
/** `npm run dev` / `npm run dev:drafts` */
export const isLenient = () => process.env.BLOG_DEV === "true";
/** `npm run dev:drafts` only */
const showDrafts = () => process.env.BLOG_DRAFTS === "true";

const dateFormat = new Intl.DateTimeFormat("nl-BE", {
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "UTC",
});

interface SourcePost {
  meta: PostMeta;
  body: string;
}

export function fail(file: string, message: string): never {
  throw new Error(`[blog] ${file}: ${message}`);
}

/**
 * Collects problems for one file: throws on the first one in strict mode,
 * records it as a warning (and logs it) in lenient mode.
 */
export function createReporter(file: string) {
  const warnings: string[] = [];
  return {
    warnings,
    problem(message: string) {
      if (!isLenient()) fail(file, message);
      warnings.push(message);
      console.warn(`\x1b[33m⚠ [blog] ${file}: ${message}\x1b[0m`);
    },
  };
}

const publicFileExists = (src: string) => existsSync(path.join(PUBLIC_DIR, src));

function isRealDate(date: string) {
  const d = new Date(`${date}T00:00:00Z`);
  return !Number.isNaN(d.getTime()) && d.toISOString().startsWith(date);
}

function readingTime(body: string) {
  const words = body.trim().split(/\s+/).filter(Boolean).length;
  return `${Math.max(1, Math.ceil(words / WORDS_PER_MINUTE))} min lezen`;
}

/** Plain-text excerpt of the Markdown body, cut at a word boundary. */
function excerpt(body: string) {
  const text = body
    .replace(/```[\s\S]*?```/g, " ") // code blocks
    .replace(/!\[[^\]]*\]\([^)]*\)/g, " ") // images
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1") // links → their text
    .replace(/^\s{0,3}(#{1,6}|>|[-*+]|\d+\.)\s+/gm, "") // headings, quotes, list markers
    .replace(/[*_`~]/g, "") // emphasis and inline code markers
    .replace(/\s+/g, " ")
    .trim();
  if (text.length <= SUMMARY_LENGTH) return text;
  const cut = text.slice(0, SUMMARY_LENGTH);
  return `${cut.slice(0, cut.lastIndexOf(" ") > 80 ? cut.lastIndexOf(" ") : SUMMARY_LENGTH).replace(/[,.;:!?—-]+$/, "")}…`;
}

function splitFrontmatter(source: string) {
  const match = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/.exec(source);
  return match ? { yaml: match[1], body: match[2] } : null;
}

/** Returns null for drafts that should be skipped (they are not validated). */
async function readPost(fileName: string): Promise<SourcePost | null> {
  const { warnings, problem } = createReporter(fileName);
  const slug = fileName.replace(/\.md$/, "");
  const source = await fs.readFile(path.join(CONTENT_DIR, fileName), "utf8");

  // ── Frontmatter ──
  let data: Record<string, unknown> = {};
  let body = source;
  const split = splitFrontmatter(source);
  if (!split) {
    problem("geen frontmatter gevonden. Het bestand moet beginnen met een blok tussen --- en ---.");
  } else {
    // HTML comments are notes for the author (they are not rendered either)
    body = split.body.replace(/<!--[\s\S]*?-->/g, "");
    try {
      data = (parseYaml(split.yaml) ?? {}) as Record<string, unknown>;
    } catch (e) {
      problem(`de frontmatter is geen geldige YAML: ${(e as Error).message.split("\n")[0]}`);
    }
  }

  // Drafts are skipped before validation, so a half-finished draft never blocks a build
  let draft = false;
  if (data.draft !== undefined) {
    if (typeof data.draft === "boolean") draft = data.draft;
    else problem("`draft` moet true of false zijn (zonder aanhalingstekens)");
  }
  if (draft && !showDrafts()) return null;

  // ── Required: title, date ──
  if (!SLUG_PATTERN.test(slug)) {
    problem("ongeldige bestandsnaam. Gebruik alleen kleine letters, cijfers en streepjes, bv. week-3-mijn-titel.md");
  }

  let title = typeof data.title === "string" ? data.title.trim() : "";
  if (!title) {
    problem("`title` ontbreekt");
    title = slug;
  }

  let date = typeof data.date === "string" ? data.date : "";
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    problem(
      data.date === undefined
        ? "`date` ontbreekt"
        : `\`date\` "${String(data.date)}" moet de vorm JJJJ-MM-DD hebben, bv. date: "2026-10-01"`,
    );
    date = "";
  } else if (!isRealDate(date)) {
    problem(`\`date\` "${date}" bestaat niet`);
    date = "";
  }

  // ── Optional: summary, tags, cover, coverAlt ──
  let summary = excerpt(body);
  if (data.summary !== undefined) {
    if (typeof data.summary === "string" && data.summary.trim()) summary = data.summary.trim();
    else problem("`summary` moet tekst zijn (of laat de regel weg)");
  }

  let tags: string[] = [];
  if (data.tags !== undefined && data.tags !== null) {
    if (Array.isArray(data.tags) && data.tags.every((t) => typeof t === "string" && t.trim())) {
      tags = [...new Set(data.tags.map((t: string) => t.trim().toLowerCase().replace(/\s+/g, "-")))];
    } else {
      problem("`tags` moet een lijst met woorden zijn, bv. tags: [code, reflectie]");
    }
  }

  let cover: string | null = null;
  if (data.cover !== undefined && data.cover !== null && data.cover !== "") {
    if (typeof data.cover !== "string" || !data.cover.startsWith("/")) {
      problem("`cover` moet een pad zijn dat met / begint, bv. cover: /images/blog/week-3/cover.jpg");
    } else if (!publicFileExists(data.cover)) {
      problem(`cover-afbeelding niet gevonden: public${data.cover}`);
    } else {
      cover = data.cover;
    }
  }

  const coverAlt = typeof data.coverAlt === "string" ? data.coverAlt : "";

  // ── Images in the text ──
  for (const [, src] of body.matchAll(/!\[[^\]]*\]\((\/[^)\s]+)/g)) {
    if (!publicFileExists(src)) problem(`afbeelding in de tekst niet gevonden: public${src}`);
  }

  return {
    body,
    meta: {
      slug,
      title: draft ? `[Concept] ${title}` : title,
      date,
      dateLabel: date ? dateFormat.format(new Date(`${date}T00:00:00Z`)) : "Datum ontbreekt",
      summary,
      tags,
      cover,
      coverAlt,
      readingTime: readingTime(body),
      warnings,
    },
  };
}

/** Published posts (drafts skipped unless `dev:drafts`), newest first. Files starting with "_" are ignored. */
export async function getPublishedSources(): Promise<SourcePost[]> {
  // Read fresh on every call, so new or edited files show up in dev after a refresh
  const files = (await fs.readdir(CONTENT_DIR)).filter((f) => f.endsWith(".md") && !f.startsWith("_"));
  const posts = (await Promise.all(files.map(readPost))).filter((p): p is SourcePost => p !== null);
  // Newest first; posts without a valid date (dev only) go last
  return posts.sort(
    (a, b) => b.meta.date.localeCompare(a.meta.date) || a.meta.slug.localeCompare(b.meta.slug),
  );
}

export async function getAllPosts(): Promise<PostMeta[]> {
  return (await getPublishedSources()).map((p) => p.meta);
}

export async function getPublishedSlugs(): Promise<string[]> {
  return (await getPublishedSources()).map((p) => p.meta.slug);
}
