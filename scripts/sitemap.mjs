// Writes build/client/sitemap.xml from what was actually prerendered, so a new post is in it
// automatically and a draft never is. Runs after the build.
import { existsSync, readdirSync, writeFileSync } from "node:fs";

const SITE_URL = "https://ridha.dev"; // Mirrors src/data/site.ts

const blogDir = "build/client/blog";
const posts = readdirSync(blogDir, { withFileTypes: true })
  .filter((entry) => entry.isDirectory() && existsSync(`${blogDir}/${entry.name}/index.html`))
  .map((entry) => `/blog/${entry.name}`);

const urls = ["/", "/blog", ...posts]
  .map((path) => `  <url>\n    <loc>${SITE_URL}${path}</loc>\n  </url>`)
  .join("\n");

writeFileSync(
  "build/client/sitemap.xml",
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`,
);
console.log(`Wrote sitemap.xml with ${posts.length + 2} URLs`);
