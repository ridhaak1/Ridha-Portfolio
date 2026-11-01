# Ridha Al-Khaykanee — portfolio

The source of [ridha.dev](https://ridha.dev): a cinematic portfolio and a Dutch internship blog.

**Stack:** React Router 7 (framework mode, `ssr: false` + prerender), Vite, TypeScript, CSS Modules, GSAP (ScrollTrigger, SplitText), Lenis. Deployed as static files on Vercel.

The design language, tokens, motion primitives and budgets are in [docs/DESIGN.md](docs/DESIGN.md). How to write a blog post is in [BLOG.md](BLOG.md).

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Dev server |
| `npm run dev:drafts` | Dev server that also shows draft posts |
| `npm run build` | Typecheck, prerender to `build/client`, write `404.html` and `sitemap.xml` |
| `npm run preview` | Serve the production build |
| `npm run typecheck` | Types only |
| `npm run lint` | ESLint |

## Asset pipelines

Generated files are committed. Run these only when a source changes.

| Script | Output | Needs |
| --- | --- | --- |
| `scripts/hero-assets/build.py` | Hero plates, cutouts, grain (`src/assets/hero`) | Python, Pillow, NumPy, rembg. See its [README](scripts/hero-assets/README.md) |
| `scripts/work-assets/build.py` | Work frames and mood plates (`src/assets/work`), with private details painted out | Python, Pillow, NumPy |
| `scripts/font-subset/subset.py` | Arabic font subset. Re-run when `greetings` in `src/config/site.ts` gains new letters | Python, fonttools, brotli |
| `scripts/brand/build.mjs` | Share image and PNG icons (`public/`). Re-run after hero changes | Playwright, with `npm run preview` running |
