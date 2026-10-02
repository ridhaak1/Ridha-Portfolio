// Vercel serves build/client/404.html (with status 404) for any path without a static file.
// React Router prerenders the catch-all route at /404 → move it to the root.
import { renameSync, rmSync } from "node:fs";

renameSync("build/client/404/index.html", "build/client/404.html");
rmSync("build/client/404", { recursive: true });
console.log("Moved build/client/404/index.html → build/client/404.html");
