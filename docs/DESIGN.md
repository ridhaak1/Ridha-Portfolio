# Design system

The source of truth for how this portfolio looks and moves. Read it before touching a
section, and update it whenever you add a primitive.

The site is being redesigned section by section. Hero, Selected Work, About and the global
chrome are done: do not redesign them unless asked.

## Design language

Dark warm stage, ink-white text, depth through layers and parallax, calm premium motion.

- **Display type:** Switzer 700, tight tracking (`-0.05em` at giant sizes), sentence case.
- **Meta and HUD type:** small Geist Mono, muted.
- **Motion:** `expo-out` by default. Things rise through masks, wipe in, or scrub with scroll.
- **Depth:** layered plates, type and frames that move at different rates.

**Never use:** dots or rating bars, glow, gradients, glassmorphism, badges or pills, section
numbers like "§ 02", all-caps letter-spaced labels, icon grids.

**Never reference Ridha's employer anywhere on the site:** not in copy, config, metadata or
placeholders. Describe the role by what Ridha does ("Full-stack Software Developer").

## Section order

Hero → Selected Work → About → Contact, composed in `src/routes/home.tsx`. The hero is
sticky; Work rises over it.

| Section | Status |
| --- | --- |
| Hero "Cinematic Depth" | Done. Graded café plate, giant "RIDHA" between plate and cutout, parallax + tilt, scroll exit (RID/HA split, camera push-in) |
| Selected Work | Done. Pinned scenes (mood plate → giant title → frame), scrubbed cuts, "Work 01 / 03" counter |
| About | Done. Scroll-lit statement, facts row, stack as film credits, velocity marquee into Contact |
| Contact | Legacy, not yet redesigned. Still uses framer-motion and the old tokens |

Global chrome on the home route: fixed `TopHud`, custom `Cursor`, static grain on each stage,
and `InternshipNotice` (temporary, `showInternshipNotice` in `src/config/site.ts`).

Placeholder still to fill in: `buildingSince` in `src/config/site.ts`.

## Tokens

CSS tokens live in `src/styles/design-tokens.css`. Motion values are mirrored in
`src/motion/tokens.ts`; change both together. `src/styles/tokens.css` holds the old dark
tokens for legacy sections, so don't use it in new work.

### Color

| Token | Value | Use |
| --- | --- | --- |
| `--stage-bg` | `#0d0b09` | Dark warm stage |
| `--ink-white` | `#edebe6` | Text on stages and photography |
| `--hairline-dark` | `rgba(237,235,230,.16)` | Rules on dark |
| ink-white at `.8` / `.5` | | Secondary and muted meta text on the stage |
| `--paper`, `--ink`, `--ink-muted`, `--hairline`, `--accent` | | Light palette, unused by the dark sections |

### Type

| Token | Value |
| --- | --- |
| `--font-sans` | Switzer (variable, roman and italic, self-hosted) |
| `--font-meta` | Geist Mono (variable, self-hosted) |
| `--text-display` | `clamp(2.5rem, 7.9vw, 8rem)` |
| `--text-body` | `1rem` |
| `--text-meta` | `0.75rem` |
| `--tracking-display` / `--leading-display` | `-0.04em` / `0.94` |
| Giant titles | Hero name `27cqw` (`60cqw` on phones), Work titles up to `26vw`, both weight 700, `-0.05em` |

The display tokens `--weight-display` (500) and `--weight-display-active` (640) are not what
the giant titles use. They set `font-weight: 700` directly.

### Grid

12 columns (`--grid-cols`), `--grid-max: 1440px`, `--grid-gap: clamp(12px, 1.6vw, 24px)`,
`--grid-margin: clamp(16px, 4vw, 64px)`. Breakpoint: phone layout at `max-width: 899px`
(`MOBILE` in `src/motion/media.ts`).

### Easing and duration

| Name | Value |
| --- | --- |
| `EASE` / `--ease-expo` | `expo-out`, `cubic-bezier(0.16, 1, 0.3, 1)`, registered in `motion/gsap.ts` |
| `DUR` / `--dur-*` | fast `0.6`, base `0.9`, slow `1.2` (seconds) |
| `FADE.duration` | `0.4`, repeat visits and reduced motion |
| `PARALLAX` | plate `6`, name `14`, cutout `24` (px at viewport edge), tilt `2`deg, lerp `0.8`s |
| `FLOAT` | amplitude `5`px, period `7`s (touch) |
| `SCROLL_LIT` | Unlit opacity `0.18`, scrub range and word stagger |
| `MARQUEE` | Base drift, velocity boost, skew limit `8`deg |
| `--intro-*` | Hero intro timings, pure CSS: about 2s on desktop, 1.2s on phones |

## Motion primitives

Always import GSAP from `@/motion/gsap`: it registers the plugins and the shared ease, and is
safe during prerendering.

| Primitive | File | What it does |
| --- | --- | --- |
| `createParallax(layers, scene, isActive)` | `motion/parallax.ts` | Mouse parallax + scene tilt for fine pointers. Returns a cleanup |
| `createFloat(layers)` | `motion/parallax.ts` | Slow autonomous float, the touch substitute. Returns a cleanup |
| `RevealText` | `motion/RevealText.tsx` | Line-by-line masked rise on scroll, plain fade under reduced motion |
| `ScrollLitText` | `motion/ScrollLitText.tsx` | Words light up from `SCROLL_LIT.dim` to full as you scroll through. Fully lit under reduced motion |
| `createVelocityMarquee(root, track, copies)` | `motion/marquee.ts` | Endless strip: slow drift, faster with scroll velocity, flips with scroll direction, skews and eases back. Pauses offscreen. Returns a cleanup |
| `MagneticButton` | `motion/MagneticButton.tsx` | Leans toward the cursor, fine pointers only |
| `useLenis()` | `motion/lenis.ts` | Smooth scroll driven by the GSAP ticker. Home route only, off under reduced motion |
| `getLenis()` | `motion/lenis.ts` | The live instance, or `null` |
| `scrollToElement(el)` | `motion/lenis.ts` | Lenis scroll when running, native otherwise |
| `matches()`, `useMediaQuery()` | `motion/media.ts` | `REDUCED_MOTION`, `FINE_POINTER` and `MOBILE` queries |
| `onIntroDone()`, `markIntroDone()` | `motion/intro.ts` | Once-per-session intro state |

`ScrollLitText` needs its caller to provide the accessible copy. Mark the lit paragraph
`aria-hidden` and put the same sentence in an `srOnly` paragraph, because unlit words would
otherwise fail the contrast audit.

Chrome:

- **`TopHud`** (`components/hud/TopHud.tsx`): name, section nav, live time. Fixed, mono,
  `mix-blend-mode: difference`, with an active-section dot from `useActiveSection`. Add new
  sections to its `LINKS`.
- **`Cursor`** (`components/cursor/Cursor.tsx`): a dot that grows into a ring over `a`, `button`
  and `[data-cursor]`. Fine pointers only, off under reduced motion. The ring's content comes
  from attributes on the hovered element:
  - `data-cursor="View case"`: a text label under the ring.
  - `data-cursor-icon="<svg path>"`: a monochrome logo in the ring (24×24 viewBox, as in
    simple-icons).
  - `data-cursor-glyph="SQL"`: short mono text in the ring, for things with no honest logo.

  With an icon or glyph the ring becomes a solid stage-coloured disc with normal blending, lifted
  above the pointer, because a logo inverted over text is unreadable. These elements also get
  the ring on keyboard focus.

Rules that are easy to get wrong:

- **Browser code only inside effects.** The site is prerendered (`ssr: false` + prerender).
- **`getLenis()` is `null` during a section's own effects.** `useLenis` runs in the parent
  route's `useEffect`, after its children's effects. Read it lazily, when it's needed.
- **Set hidden start states from GSAP, never from CSS.** Prerendered and no-JS pages must show
  the final state.
- **Clean up.** Use `gsap.context` or `gsap.matchMedia` and revert on unmount. Revert
  `SplitText` too.
- **Masks around focusable content use `overflow: clip`, not `hidden`.** Focusing inside
  `overflow: hidden` can scroll the mask itself. Remove the clip after the reveal so focus
  outlines show.
- **Lenis `stop()` clips `<html>`, which breaks `position: sticky`.** `design-tokens.css`
  overrides this, so whoever stops Lenis must lock body scrolling themselves.

## Budgets

- **Lighthouse, mobile:** performance, best practices and SEO at least 90, accessibility at
  least 98. Also run desktop.
- **LCP:** the hero h1 (Lighthouse reports one of its letters). It is pure-CSS animated so it
  paints before hydration. The hero plate is preloaded per layout. Nothing below the fold may compete for LCP.
- **Reduced motion:** every section needs a fallback with no parallax, no scrub and no pinning,
  using fades only (`FADE.duration`).
- **Touch:** nothing may depend on hover. Fine-pointer effects have a touch substitute or
  simply don't exist there.
- **Keyboard:** everything reachable by pointer is reachable by keyboard, with a visible focus
  state, including inside pinned sequences.
- **Decorative duplicates:** giant titles, marquees and similar are `aria-hidden`, with the real
  text available to assistive tech (`aria: "none"` on `SplitText`, `srOnly` headings).

## Verification habit

Before reporting visual work as done:

1. `npm run typecheck`, `npm run lint`, `npm run build`.
2. Lighthouse on the production build (`npm run preview`), mobile and desktop.
3. Playwright screenshots at **1440×900** and **390×844**, driven by real scrolling and
   hovering so they capture mid-animation states. Also check with
   `reducedMotion: "reduce"`.
4. Open and inspect the screenshots yourself. A passing build says nothing about how it looks.

Playwright and Lighthouse are not project dependencies. Run them from a temporary folder, with
`channel: "msedge"` or another current browser. An old Playwright Chromium (`chromium-1028`) fails
to update `:has(:hover)` styles, which looks like a CSS bug but isn't.
