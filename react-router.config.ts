import type { Config } from "@react-router/dev/config";
import { getPublishedSlugs } from "./src/lib/blog/posts.server";

// With ssr: false, the dev server only serves loader data for paths in the prerender
// list, which is computed once at startup — so a post added while `npm run dev` runs
// would 404 when clicked. In dev we therefore render on the server; the build stays
// fully static (ssr: false + prerender).
const isDevServer = process.argv.includes("dev");

export default {
  appDirectory: "src",
  ssr: isDevServer,
  // Every published post gets its own static HTML file
  async prerender() {
    const slugs = await getPublishedSlugs();
    return ["/", "/blog", ...slugs.map((slug) => `/blog/${slug}`)];
  },
} satisfies Config;
