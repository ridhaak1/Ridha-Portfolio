import { gsap, ScrollTrigger } from "@/motion/gsap";
import { buildStackStory, queryStack, setActiveLayer, syncLeaders } from "@/motion/isoStack";
import { getLenis } from "@/motion/lenis";
import { FINE_POINTER, matches, REDUCED_MOTION } from "@/motion/media";
import { createParallax } from "@/motion/parallax";
import { FADE, STACK } from "@/motion/tokens";
import { ABOUT_PINNED } from "./aboutLayout";

const STACKED = "(max-width: 899px) and (prefers-reduced-motion: no-preference)";

/** Phone sequence: seconds to play the whole story once */
const AUTOPLAY_DURATION = 3.2;
/** How long leader lines keep following after the pointer stops (the tilt is still easing), ms */
const LEADER_SETTLE = 1200;

const layerIndex = (el: Element | null) => {
  const value = el?.closest("[data-layer]")?.getAttribute("data-layer");
  return value == null ? null : Number(value);
};

/** The isometric stack's story and interaction. Loaded when the section is about a viewport away. */
export function initAbout(track: HTMLElement) {
  const els = queryStack(track);
  const [tilt] = gsap.utils.selector(track)("[data-tilt]");
  /** Interactive once the story has finished */
  let ready = false;
  let active: number | null = null;
  let lifts = true;
  let toHold: (() => void) | null = null;
  let resetTilt: (() => void) | null = null;

  const setActive = (i: number | null) => {
    if (i === active) return;
    active = i;
    setActiveLayer(els, i, lifts);
  };

  const setReady = (next: boolean) => {
    if (next === ready) return;
    ready = next;
    track.toggleAttribute("data-ready", next);
    if (next) {
      // Keyboard focus may have jumped here ahead of the story
      const focused = document.activeElement;
      if (focused && track.contains(focused) && focused.matches(":focus-visible")) setActive(layerIndex(focused));
    } else {
      setActive(null);
      resetTilt?.();
    }
  };

  const mm = gsap.matchMedia();

  mm.add(ABOUT_PINNED, () => {
    const end = 1 / (1 + STACK.hold); // Where the hold starts, as a share of the pin

    const story = buildStackStory(els, 0.3, {
      scrollTrigger: {
        trigger: track,
        start: "top top",
        end: "bottom bottom",
        scrub: true,
        invalidateOnRefresh: true,
        onToggle: (self) => track.toggleAttribute("data-animating", self.isActive),
        onUpdate: (self) => {
          if (self.progress > 0.6) syncLeaders(els);
          setReady(self.progress >= end);
        },
      },
    });
    story.to({}, { duration: STACK.hold }, 1);

    toHold = () => {
      const top = track.getBoundingClientRect().top + window.scrollY;
      const y = top + end * (track.offsetHeight - window.innerHeight);
      const lenis = getLenis();
      if (lenis) lenis.scrollTo(y, { duration: 0.8 });
      else window.scrollTo({ top: y });
    };

    const sync = () => syncLeaders(els);
    ScrollTrigger.addEventListener("refresh", sync);

    // Arriving already past the story (a deep link, a reload)
    const trigger = story.scrollTrigger;
    if (trigger) {
      if (trigger.progress > 0.6) sync();
      setReady(trigger.progress >= end);
    }

    // Leaders follow the planes while the pointer tilts the stack
    let syncUntil = 0;
    const onMove = () => (syncUntil = performance.now() + LEADER_SETTLE);
    const tick = () => {
      if (ready && performance.now() < syncUntil) syncLeaders(els);
    };
    const steering = matches(FINE_POINTER) ? createParallax([], tilt, () => ready, STACK.tilt) : null;
    resetTilt = steering?.reset ?? null;
    window.addEventListener("pointermove", onMove, { passive: true });
    track.addEventListener("focusin", onMove);
    gsap.ticker.add(tick);

    return () => {
      toHold = null;
      track.removeAttribute("data-animating");
      setReady(false);
      resetTilt = null;
      steering?.();
      ScrollTrigger.removeEventListener("refresh", sync);
      window.removeEventListener("pointermove", onMove);
      track.removeEventListener("focusin", onMove);
      gsap.ticker.remove(tick);
    };
  });

  mm.add(STACKED, () => {
    const story = buildStackStory(els, 0, { paused: true, onComplete: () => setReady(true) });
    story.duration(AUTOPLAY_DURATION);
    ScrollTrigger.create({
      trigger: gsap.utils.selector(track)("[data-scene]")[0],
      start: "top 72%",
      once: true,
      onEnter: () => story.play(),
    });
    return () => setReady(false);
  });

  mm.add(REDUCED_MOTION, () => {
    lifts = false;
    setReady(true);
    syncLeaders(els);
    const sync = () => syncLeaders(els);
    ScrollTrigger.addEventListener("refresh", sync);
    gsap.fromTo(
      gsap.utils.selector(track)("[data-fade]"),
      { opacity: 0 },
      { opacity: 1, duration: FADE.duration, scrollTrigger: { trigger: track, start: "top 80%", once: true } },
    );
    return () => {
      lifts = true;
      setReady(false);
      ScrollTrigger.removeEventListener("refresh", sync);
    };
  });

  return {
    setActive,
    pointerOver: (target: Element) => {
      if (ready) setActive(layerIndex(target));
    },
    focusLayer: (i: number) => {
      if (ready) setActive(i);
      else toHold?.(); // The labels aren't drawn yet: jump to where they are
    },
    cleanup: () => mm.revert(),
  };
}

export type AboutMotion = ReturnType<typeof initAbout>;
