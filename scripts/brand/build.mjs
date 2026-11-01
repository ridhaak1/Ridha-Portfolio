// Renders the share image and PNG favicons into public/, from the real hero and favicon.svg.
// Run against the production preview, with Playwright available from outside the project:
//   npm run build && npm run preview -- --port 4173    (in another terminal)
//   node scripts/brand/build.mjs                        (NODE_PATH pointing at a Playwright install)
import { createRequire } from "node:module";
import { readFileSync } from "node:fs";

const require = createRequire(process.env.NODE_PATH ? `${process.env.NODE_PATH}/` : import.meta.url);
const { chromium } = require("playwright");

const browser = await chromium.launch({ channel: "msedge" });

// 1200×630: name + cutout over plate, with the page's chrome out of the way
const og = await browser.newPage({ viewport: { width: 1200, height: 630 } });
await og.goto("http://localhost:4173/", { waitUntil: "networkidle" });
await og.waitForTimeout(3500);
await og.addStyleTag({
  content: `header, aside, [data-hud] p:last-child { display: none !important; }`,
});
await og.screenshot({ path: "public/og-image.png" });

const svg = readFileSync("public/favicon.svg", "utf8");
for (const [file, size] of [
  ["favicon-32.png", 32],
  ["apple-touch-icon.png", 180],
  ["icon-512.png", 512],
]) {
  const page = await browser.newPage({ viewport: { width: size, height: size } });
  await page.setContent(`<!doctype html><style>*{margin:0}svg{display:block;width:100vw;height:100vh}</style>${svg}`);
  await page.screenshot({ path: `public/${file}` });
  await page.close();
}

await browser.close();
console.log("Wrote public/og-image.png and PNG favicons");
