import { defineConfig, type Plugin } from "vite";
import { reactRouter } from "@react-router/dev/vite";
import fs from "fs";
import path from "path";

/**
 * `vite preview` falls back to the root index.html for "/blog", so the prerendered
 * build/client/blog/index.html is never served locally. Serve it, like static hosts do.
 */
function previewPrerenderedRoutes(): Plugin {
  return {
    name: "preview-prerendered-routes",
    configurePreviewServer(server) {
      const root = path.resolve(server.config.root, server.config.build.outDir);
      server.middlewares.use((req, _res, next) => {
        const [pathname, query] = (req.url ?? "/").split("?");
        if (pathname !== "/" && !path.extname(pathname)) {
          const file = path.join(root, pathname, "index.html");
          if (fs.existsSync(file)) {
            req.url = `${pathname.replace(/\/$/, "")}/index.html${query ? `?${query}` : ""}`;
          }
        }
        next();
      });
    },
  };
}

export default defineConfig(({ command, mode, isPreview }) => {
  // Blog modes, read in src/lib/blog/posts.server.ts:
  // dev → problems in posts become on-page warnings; build stays strict.
  // (`react-router build` can start an internal Vite server too, hence the argv check.)
  const isDevServer = command === "serve" && !isPreview && !process.argv.includes("build");
  if (isDevServer) process.env.BLOG_DEV = "true";
  // `npm run dev:drafts` → also show posts with `draft: true`
  if (isDevServer && mode === "drafts") process.env.BLOG_DRAFTS = "true";

  return {
    plugins: [reactRouter(), previewPrerenderedRoutes()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
  };
});
