import { gsap } from "./gsap";
import { EASE, DUR, STACK } from "./tokens";

/** The final pose (also the CSS default) and the blueprint pose the story starts from */
const FINAL = { x: 58, z: -38 };
const BLUEPRINT = { x: 62, z: -44 };

/** Elements of an isometric stack, found by their data attributes (see sections/About.tsx) */
export function queryStack(root: Element) {
  const q = gsap.utils.selector(root);
  return {
    rotX: q("[data-rot-x]")[0],
    rotZ: q("[data-rot-z]")[0],
    planes: q<HTMLElement>("[data-plane]"),
    lifts: q<HTMLElement>("[data-lift]"),
    anchors: q("[data-anchor]"),
    outlines: q("[data-outline]"),
    borders: q("[data-border]"),
    surfaces: q("[data-surface]"),
    contents: q("[data-content]"),
    rows: q("[data-phase]"),
    fills: q("[data-fill]"),
    svg: q("[data-leaders]")[0],
    paths: q("[data-leader]"),
    items: q("[data-layer-item]"),
    labels: q("[data-layer-label]"),
  };
}

export type StackEls = ReturnType<typeof queryStack>;

/** Distance from the stack's middle plane: top +2 … bottom -2 */
const depth = (els: StackEls, i: number) => (els.planes.length - 1) / 2 - i;

/** px per unit of depth when exploded; follows the plane's size */
const explodedGap = (els: StackEls) => els.planes[0].offsetWidth * STACK.gap;

/**
 * Plan → Build → Refine as one timeline over 0–1, from a wireframe blueprint to the final
 * pose. Scrubbed on desktop, played once on phones. `inactivePhase` is the opacity of the
 * phases that aren't current.
 */
export function buildStackStory(els: StackEls, inactivePhase: number, vars: gsap.TimelineVars) {
  const { rotX, rotZ, planes, outlines, borders, surfaces, contents, rows, fills, paths, labels } = els;

  gsap.set(rotX, { rotationX: BLUEPRINT.x });
  gsap.set(rotZ, { rotation: BLUEPRINT.z });
  planes.forEach((plane, i) => gsap.set(plane, { z: depth(els, i) * STACK.tightGap }));
  gsap.set([...borders, ...surfaces, ...contents], { opacity: 0 });
  gsap.set(outlines, { opacity: 1 });
  gsap.set(fills, { scaleY: 0 });
  rows.forEach((row, i) => gsap.set(row, { opacity: i === 0 ? 1 : inactivePhase }));
  gsap.set(paths, { strokeDashoffset: 1 });
  gsap.set(labels, { opacity: 0, y: 8 });

  const tl = gsap.timeline({ defaults: { ease: "none" }, ...vars });

  // Plan: just the outlines, drifting slightly so the page doesn't feel stuck
  tl.to(rotX, { rotationX: BLUEPRINT.x - 1, duration: 0.33 }, 0)
    .to(rotZ, { rotation: BLUEPRINT.z + 1, duration: 0.33 }, 0)
    .to(fills[0], { scaleY: 1, duration: 0.33 }, 0);

  // Build: surfaces and logos fill in top → bottom as the planes separate
  tl.to(rows[0], { opacity: inactivePhase, duration: 0.03 }, 0.33)
    .to(rows[1], { opacity: 1, duration: 0.03 }, 0.33)
    .to(fills[1], { scaleY: 1, duration: 0.33 }, 0.33);
  planes.forEach((plane, i) => {
    const at = 0.34 + i * 0.045;
    tl.to(plane, { z: () => depth(els, i) * explodedGap(els), duration: 0.3, ease: EASE }, 0.35)
      .to([surfaces[i], borders[i]], { opacity: 1, duration: 0.12 }, at)
      .to(outlines[i], { opacity: 0, duration: 0.12 }, at)
      .to(contents[i], { opacity: 1, duration: 0.1 }, at + 0.05);
  });

  // Refine: settle on the final angle, then the callouts draw in
  tl.to(rows[1], { opacity: inactivePhase, duration: 0.03 }, 0.66)
    .to(rows[2], { opacity: 1, duration: 0.03 }, 0.66)
    .to(fills[2], { scaleY: 1, duration: 0.34 }, 0.66)
    .to(rotX, { rotationX: FINAL.x, duration: 0.2, ease: "power3.out" }, 0.66)
    .to(rotZ, { rotation: FINAL.z, duration: 0.2, ease: "power3.out" }, 0.66);
  labels.forEach((label, i) => {
    const at = 0.8 + i * 0.015;
    tl.to(label, { opacity: 1, y: 0, duration: 0.12, ease: "power2.out" }, at);
    if (paths[i]) tl.to(paths[i], { strokeDashoffset: 0, duration: 0.14 }, at);
  });

  return tl;
}

/**
 * Points each leader line at its plane's corner, wherever 3D has put it right now. Runs from
 * the corner to an elbow just before the label, then straight into the label's first line.
 */
export function syncLeaders({ svg, paths, anchors, items }: StackEls) {
  if (!svg || !paths.length) return;
  const origin = svg.getBoundingClientRect();
  paths.forEach((path, i) => {
    const a = anchors[i].getBoundingClientRect();
    const label = items[i].getBoundingClientRect();
    const x = label.left - origin.left - 10;
    const y = label.top - origin.top + 8;
    path.setAttribute("d", `M${a.left - origin.left} ${a.top - origin.top} L${x - 20} ${y} L${x} ${y}`);
  });
}

/** Lifts one layer and dims the others (null resets). `animated: false`: dimming only, as fades. */
export function setActiveLayer({ lifts, items, paths }: StackEls, active: number | null, animated = true) {
  lifts.forEach((lift, i) => {
    gsap.to(lift, {
      z: animated && active === i ? STACK.lift : 0,
      opacity: active === null || active === i ? 1 : STACK.dim,
      duration: DUR.fast,
      ease: EASE,
      overwrite: true,
    });
    items[i].toggleAttribute("data-active", active === i);
    paths[i]?.toggleAttribute("data-active", active === i);
  });
}
