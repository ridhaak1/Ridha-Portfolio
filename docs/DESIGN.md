# Design system

The source of truth for how this portfolio looks and moves. Read it before touching a
section, and update it whenever you add a primitive.

Hero, Selected Work, About, Contact, the footer and the global chrome are done: do not redesign
them unless asked.

## Design language

Dark warm stage, ink-white text, depth through layers and parallax, calm premium motion.

- **Display type:** Switzer 700, tight tracking (`-0.05em` at giant sizes), sentence case.
- **Meta and HUD type:** small Geist Mono, muted.
- **Motion:** `expo-out` by default. Things rise through masks, wipe in, or scrub with scroll.
- **Depth:** layered plates, type and frames that move at different rates.

**Never use:** dots or rating bars, glow, gradients, glassmorphism, badges or pills, section
numbers like "§ 02", all-caps letter-spaced labels, icon grids. Numbered steps and diagram
callouts ("01 Plan", "01 Interface") are fine: the ban is on numbering the page's sections.

**Never reference Ridha's employer anywhere on the site:** not in copy, config, metadata or
placeholders. Describe the role by what Ridha does ("Full-stack Software Developer").

## Section order

Hero → Selected Work → About → Contact → Footer, composed in `src/routes/home.tsx`. The hero is
sticky; Work rises over it. `<main>` lifts away at the end to reveal the footer.

The home route sits outside `MainLayout` and renders its own `<main>`, so GSAP stays off the blog.

| Section | Status |
| --- | --- |
| Hero "Cinematic Depth" | Done. Graded café plate, giant "RIDHA" between plate and cutout, parallax + tilt, scroll exit (RID/HA split, camera push-in) |
| Selected Work | Done. Pinned scenes (mood plate → giant title → frame), scrubbed cuts, "Work 01 / 03" counter |
| About | Done. "The whole stack": pinned Plan → Build → Refine story of an exploded isometric stack, phase indicator, callouts |
| Contact | Done. "Hello, in every language": pinned flight past giant greetings toward the blurred café, then the arrival plane |
| Footer | Done. Curtain reveal, giant cropped "RIDHA", copyright, live time, back to top |

Global chrome on the home route: fixed `TopHud`, custom `Cursor`, static grain on each stage,
and `InternshipNotice` (temporary, `showInternshipNotice` in `src/config/site.ts`).

## Tokens

CSS tokens live in `src/styles/design-tokens.css`. Motion values are mirrored in
`src/motion/tokens.ts`; change both together. `src/styles/tokens.css` holds the reset
and the older tokens the blog's styles still use, so don't use its colours or fonts in new work.

### Color

| Token | Value | Use |
| --- | --- | --- |
| `--stage-bg` | `#0d0b09` | Dark warm stage |
| `--ink-white` | `#edebe6` | Text on stages and photography |
| `--hairline-dark` | `rgba(237,235,230,.16)` | Rules on dark |
| ink-white at `.8` / `.5` | | Secondary and muted meta text on the stage |
| `--stage-raised` | `#191512` | Raised surfaces on the stage: stage + 4% lightness |
| `--paper`, `--ink`, `--ink-muted`, `--hairline`, `--accent` | | Light palette, unused by the dark sections |

### Type

| Token | Value |
| --- | --- |
| `--font-sans` | Switzer (variable, roman and italic, self-hosted) |
| `--font-meta` | Geist Mono (variable, self-hosted) |
| DM Sans 300/300 italic/400/500, Bebas Neue, JetBrains Mono | Body text and the blog. Self-hosted, latin subset: **no Google Fonts requests anywhere** |
| IBM Plex Sans Arabic 700 | Contact's Arabic greeting only. A 1.9 KB subset, loaded with the `FontFace` API when Contact is near |
| `--text-meta` | `0.75rem` |
| Giant titles | Hero name `27cqw` (`60cqw` on phones), Work titles up to `26vw`, both weight 700, `-0.05em` |

### Grid

12 columns, `--grid-gap: clamp(12px, 1.6vw, 24px)`,
`--grid-margin: clamp(16px, 4vw, 64px)`. Breakpoint: phone layout at `max-width: 899px`
(`MOBILE` in `src/motion/media.ts`).

### Easing and duration

| Name | Value |
| --- | --- |
| `EASE` / `--ease-expo` | `expo-out`, `cubic-bezier(0.16, 1, 0.3, 1)`, registered in `motion/gsap.ts` |
| `DUR` / `--dur-*` | fast `0.6`, base `0.9`, slow `1.2` (seconds; there's no `--dur-slow` in CSS) |
| `FADE.duration` | `0.4`, repeat visits and reduced motion |
| `PARALLAX` | plate `6`, name `14`, cutout `24` (px at viewport edge), tilt `2`deg, lerp `0.8`s |
| `FLOAT` | amplitude `5`px, period `7`s (touch) |
| `CORRIDOR` | All the corridor's depths, fades, steering and timing. `perspective` mirrors `Contact.module.css` |
| `STACK` | Exploded gap `0.16` of plane width, tight gap `8`px, lift `36`px, dim `0.35`, tilt `4`deg, end hold `0.12` |
| `--intro-*` | Hero intro timings, pure CSS: about 2s on desktop, 1.2s on phones |

## Motion primitives

**Nothing animated runs during hydration.** Hero and footer setup goes through `afterIntro`, and Work
waits for `whenNear` with a -1px margin, so its cost lands on the first scroll.
About and Contact keep their animation code in `*.motion.ts` modules, imported by
`loadMotionWhenNear` about a viewport away. Pinned heights come from `useMediaAttribute`, so they're
set at first commit and the page never changes length. Until the code arrives, `[data-pinned]` stages
stay empty (`:not([data-live])`).

Always import GSAP from `@/motion/gsap`: it registers the plugins and the shared ease, and is
safe during prerendering.

| Primitive | File | What it does |
| --- | --- | --- |
| `createParallax(layers, scene, isActive, tilt?)` | `motion/parallax.ts` | Mouse parallax + scene tilt for fine pointers. Returns a cleanup, with `.reset()` to ease back to rest |
| `createFloat(layers)` | `motion/parallax.ts` | Slow autonomous float, the touch substitute. Returns a cleanup |
| `RevealText` | `motion/RevealText.tsx` | Line-by-line masked rise on scroll, plain fade under reduced motion |
| `corridorLayout`, `createCorridor` | `motion/corridorLayout.ts`, `motion/corridor.ts` | The 3D corridor: see Patterns |
| `queryStack`, `buildStackStory`, `syncLeaders`, `setActiveLayer` | `motion/isoStack.ts` | The isometric stack: see Patterns |
| `MagneticButton` | `motion/MagneticButton.tsx` | Leans toward the cursor, up to `max` px. Fine pointers only |
| `useLenis()` | `motion/lenis.ts` | Smooth scroll driven by the GSAP ticker. Home route only, off under reduced motion |
| `getLenis()` | `motion/lenis.ts` | The live instance, or `null` |
| `scrollToElement(el)` | `motion/lenis.ts` | Lenis scroll when running, native otherwise |
| `scrollToTop()` | `motion/lenis.ts` | Back to the top over 1.6s, native otherwise |
| `sectionEntry(el)`, `jumpToSection(el)`, `jumpToY(y)` | `motion/lenis.ts` | Where a section is entered (its `[data-nav-anchor]`, if any), and an instant jump there |
| `useHashLanding()` | `hooks/useHashLanding.ts` | Lands on the URL's hash, or restores the position after a reload or back, once pins, fonts and `ScrollTrigger.refresh` are done. Leaves the visitor alone once they scroll |
| `afterIntro(init)`, `whenNear(el, load)`, `loadMotionWhenNear(...)` | `motion/schedule.ts` | Deferred setup: after the intro or first input, one task per turn; near the viewport; a section's dynamic module with a plain-layout fallback |
| `useMediaAttribute(ref, attr, query)` | `hooks/useMediaAttribute.ts` | An attribute that tracks a media query from first commit |
| `matches()` | `motion/media.ts` | `REDUCED_MOTION`, `FINE_POINTER` and `MOBILE` queries |
| `onIntroDone()`, `markIntroDone()` | `motion/intro.ts` | Once-per-session intro state |

Chrome:

- **`TopHud`** (`components/hud/TopHud.tsx`): name, section nav, live time. Fixed, mono,
  `mix-blend-mode: difference`, with an active-section dot from `useActiveSection`. Add new
  sections to its `LINKS`.
- **`Cursor`** (`components/cursor/Cursor.tsx`): a dot that grows into a ring over `a`, `button`
  and `[data-cursor]`. Fine pointers only, off under reduced motion. The ring's content comes
  from attributes on the hovered element:
  - `data-cursor="View case"`: a text label under the ring.
  The label follows `data-cursor` live, so an element changes it by updating the attribute.

## Patterns

**Project drawer** (`components/projects/ProjectDrawer.tsx`): a `role="dialog"`, portalled to `body`,
with no framer-motion. A flat copy of the screenshot flies from the clicked frame to the panel's
image and back (FLIP), while the content rises through masks. All scene frames hide during the
flight, because they're stacked and the one below would show. Close with the button, Escape or a
click outside. Focus is trapped, and returns to the frame without triggering Work's focus jump.
Extra screenshots go in `screenshots` on the project in `data/projects.ts`.

**3D corridor** (`sections/Contact.tsx`, `motion/corridor.ts`): CSS 3D, no WebGL.

- Nesting: `scene` (perspective) → `steer` (mouse) → `world` (camera, `translateZ`) → words, frames
  and plate at fixed depths. Each word's inner element takes its opacity, scale and blur.
- `createCorridor` returns `render(progress)`, a pure function of progress with no timeline, so
  scrubbing back lands exactly where it was. It drives every word, frame, the plate and the plane.
- `corridorLayout` (`motion/corridorLayout.ts`, no GSAP) computes each word's depth, size and side from `site.greetings`, keeping it off
  the center line. Edit the list without touching the layout. New Arabic letters need
  `scripts/font-subset/subset.py` re-run. Other non-Latin scripts need a font of their own.
- Hairline frames and four rails are what make the black read as a space being flown through.
  Frames are four solid strips, not a border: a 1px border on a layer rasterized at a small scale
  loses whole edges. They clear away on arrival, so they never cross the plane's text.
- Blur goes only on the word passing the camera. Words sit further apart than the fade range, so
  only one is ever blurred.
- The plane isn't really in the world. It's a flat element in the stage, scaled and faded as if it
  were at `planeZ`, ending at exactly scale 1 so its text is crisp and hover targets are steady.
- The camera arrives before the pin ends (`CORRIDOR.hold`). Steering eases to 0 on arrival.
- A pinned section can place a `[data-nav-anchor]`, and `TopHud` lands there instead of on its
  first frame. Focus inside the plane before arrival jumps to the arrival point.
- Default CSS has no corridor, only the plane and a quiet mono line of the greetings. JS turns the
  corridor on with `data-pinned` or `data-flying`, so prerender, no JS and reduced motion are plain,
  and the giant words can't compete for LCP.
- Phones: no pin. The same `render` plays once over 2.5s, with fewer words, no blur and a gentle
  auto-drift, then the plane builds in.

**Rolling letters** (`sections/Contact.tsx`): each character is a clipped box holding two stacked
copies, rendered in JSX. On hover the stacks tween `yPercent: -50` with a small stagger over 0.5s
`EASE`, and back on leave. The element's `aria-label` carries the text. Mouse only, not under
reduced motion. `font-kerning: none` keeps the width the same as plain text.

**Isometric stack** (`sections/About.tsx`, `motion/isoStack.ts`): CSS 3D planes, no WebGL.

- Nesting gives each motion its own element, so they can't fight over a transform: `scene`
  (perspective) → `tilt` (mouse) → `rotX` → `rotZ` (scrubbed) → `plane` (scrubbed explode) → `lift`
  (hover). `rotX` and `rotZ` are separate because GSAP's fixed transform order can't produce
  `rotateX() rotateZ()` on one element.
- The CSS default is the final pose, so no JS and reduced motion just work. GSAP sets the blueprint
  start state, and one timeline runs the whole story: scrubbed on desktop, played once on phones.
- Text on a plane goes along its front edge. Everywhere else, the plane above covers it.
- Leader lines are one SVG overlay, redrawn from zero-size anchors read with
  `getBoundingClientRect`, so they follow the real 3D position through rotation, tilt and lift.
- The story ends before the pin does (`STACK.hold`). Otherwise the section would unpin the moment
  hover and tilt became available.
- Focus on a label that isn't drawn yet scrolls to the hold point.

**Phase indicator** (`sections/About.tsx`): three mono rows, the active one in ink-white and the
others at 30%, with a 1px line filling beside the active row. On phones it's a single line where
the rows crossfade. 30% fails a contrast audit, so the visible rows are `aria-hidden` and an
`srOnly` list carries the same text.

**Copy email** (`sections/Contact.tsx`): a `<button>` whose `aria-label` contains the address.
`navigator.clipboard` in try/catch, falling back to `mailto:`. On success, `data-cursor` becomes
"Copied ✓" for 1.6s and a `role="status"` toast shows. The toast is always mounted, so screen
readers announce it. A separate plain link opens the mail app.

**Curtain footer** (`sections/Footer.tsx`):

- In flow by default: prerender, no JS, touch and reduced motion all use this state.
- With a fine pointer and no reduced motion, `html[data-curtain]` fixes it at `z-index: -1` and
  gives `<main>` the stage background and `margin-bottom: var(--footer-h)`.
- `--footer-h` is pure CSS, derived from the measured text size, so both modes give the page the
  same height. If the name's font, weight or tracking changes, remeasure the constants in
  `Footer.module.css`.
- `z-index: -1` avoids a stacking context on `<main>`, which would break `TopHud`'s blending.
- The letters scrub from `main`'s `bottom bottom` to `max`, which works in both modes.
- The curtain is off on touch because its smoothness can't be judged in emulation. To try it on
  real phones, drop `FINE_POINTER` from `CURTAIN` in `Footer.tsx`.

Rules for any fixed layer hidden under the page:

- **Keep it `visibility: hidden` until it's close to showing.** Painted at load, it counts as a
  layout shift and can take over LCP, even when covered. This cost the footer CLS 0.34 and a
  performance score of 82 on desktop.
- **Scroll to it on focus.** Fixed elements don't scroll into view when tabbed to.
- **Move focus out** before covering it again, as back to top does.

## Rules that are easy to get wrong

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
- **Tweens that share targets with a scrub must yield to it.** Arriving mid-pin (deep link, reload,
  fast scroll) lets a play-once intro overwrite the scrubbed state, as Work's intro once did. Re-render
  the scrub afterwards: `tl.progress(0, true).progress(at, true)`.
- **Lenis `stop()` clips `<html>`, which breaks `position: sticky`.** `design-tokens.css`
  overrides this, so whoever stops Lenis must lock body scrolling themselves.

## Budgets

- **Lighthouse, mobile:** performance, best practices and SEO at least 90, accessibility at
  least 98, and TBT under 400ms with a real 4x CPU. Also run desktop.
- **LCP:** the hero h1 (Lighthouse reports one of its letters). It is pure-CSS animated so it
  paints before hydration. The hero plate is preloaded per layout. Nothing below the fold may compete for LCP.
- **Reduced motion:** every section needs a fallback with no parallax, no scrub and no pinning,
  using fades only (`FADE.duration`).
- **Touch:** nothing may depend on hover. Fine-pointer effects have a touch substitute or
  simply don't exist there.
- **Keyboard:** everything reachable by pointer is reachable by keyboard, with a visible focus
  state, including inside pinned sequences.
- **Decorative duplicates:** giant titles, diagrams and similar are `aria-hidden`, with the real
  text available to assistive tech (`aria: "none"` on `SplitText`, `srOnly` headings).

## Verification habit

Before reporting visual work as done:

1. `npm run typecheck`, `npm run lint`, `npm run build`.
2. Lighthouse on the production build (`npm run preview`), mobile and desktop, plus a run with 4x
   CPU applied in the browser (`throttlingMethod: "devtools"`). The default mobile run only simulates it.
3. Playwright screenshots at **1440×900** and **390×844**, driven by real scrolling and
   hovering so they capture mid-animation states. Also check with
   `reducedMotion: "reduce"`.
4. Open and inspect the screenshots yourself. A passing build says nothing about how it looks.

Simulate touch scrolling with raw `Input.dispatchTouchEvent` events. CDP's
`Input.synthesizeScrollGesture` silently doesn't scroll in this setup, on any page.

Playwright's WebKit on Windows flattens all CSS 3D and ignores variable font weights, even on a
minimal page, so its screenshots say nothing about Safari. Use Linux WebKit, and a real iPhone.

Screenshots: `scripts/work-assets/build.py` paints out private details and unverifiable claims (see
`CLEANUP`, `MOVE`, `STAT_ROW`). The originals in `src/assets/images` keep them, so never ship those.

Generated files: `scripts/sitemap.mjs` writes the sitemap on every build. `scripts/brand/build.mjs`
renders `public/og-image.png` and the PNG favicons from the real hero, so re-run it after hero changes.

Playwright and Lighthouse are not project dependencies. Run them from a temporary folder, with
`channel: "msedge"` or another current browser. An old Playwright Chromium (`chromium-1028`) fails
to update `:has(:hover)` styles, which looks like a CSS bug but isn't.
