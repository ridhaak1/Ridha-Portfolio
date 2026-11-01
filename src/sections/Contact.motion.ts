import { site } from "@/config/site";
import { createCorridor } from "@/motion/corridor";
import { corridorLayout } from "@/motion/corridorLayout";
import { gsap, ScrollTrigger } from "@/motion/gsap";
import { getLenis } from "@/motion/lenis";
import { FINE_POINTER, matches, REDUCED_MOTION } from "@/motion/media";
import { createFloat, createParallax } from "@/motion/parallax";
import { CORRIDOR, DUR, EASE, FADE } from "@/motion/tokens";
import { ARRIVE_AT, CONTACT_PINNED, onPhones } from "./contactLayout";

const STACKED = "(max-width: 899px) and (prefers-reduced-motion: no-preference)";
const FONT_URL = "/fonts/IBMPlexSansArabic-700-subset.woff2";

const { greetings } = site;
const pad = (n: number) => String(n).padStart(2, "0");

/** The corridor's flight. Loaded when the section is about a viewport away. */
export function initContact(track: HTMLElement) {
  const q = gsap.utils.selector(track);
  const [world] = q("[data-world]");
  const [steer] = q("[data-steer]");
  const [plate] = q<HTMLElement>("[data-plate]");
  const [plane] = q<HTMLElement>("[data-plane]");
  const [headline] = q("[data-headline]");
  const [counter] = q("[data-counter]");
  const [counterWord] = q("[data-counter-word]");
  const [counterIndex] = q("[data-counter-index]");
  const [counterLanguage] = q("[data-counter-language]");
  const words = q<HTMLElement>("[data-word]");
  const gates = q<HTMLElement>("[data-gate]");
  const depths = corridorLayout(greetings).map((p) => p.z);
  let arrived = true;
  let toArrival: (() => void) | null = null;

  // Only now, not with @font-face, which would fetch as soon as the word is laid out, however far
  // offscreen. The system's Arabic font is a fine fallback.
  new FontFace("IBM Plex Sans Arabic", `url(${FONT_URL}) format("woff2")`, { weight: "700" })
    .load()
    .then((face) => document.fonts.add(face))
    .catch(() => {});

  const showWord = (i: number) => {
    counterWord.textContent = greetings[i].word;
    counterIndex.textContent = `${pad(i + 1)} / ${pad(greetings.length)}`;
    counterLanguage.textContent = greetings[i].language;
  };

  const mm = gsap.matchMedia();

  mm.add(CONTACT_PINNED, () => {
    const render = createCorridor({ world, plate, words, depths, gates, plane, onWord: showWord });

    gsap.set(headline, { yPercent: 110 });
    const arrival = gsap
      .timeline({ paused: true, defaults: { ease: EASE } })
      .to(headline, { yPercent: 0, duration: DUR.slow }, 0)
      .to(counter, { opacity: 0, duration: DUR.fast }, 0);

    const steering = matches(FINE_POINTER)
      ? createParallax([[steer, CORRIDOR.steer]], steer, () => !arrived, CORRIDOR.tilt)
      : null;
    steering?.(); // Not listening until the stage is on screen

    const setArrived = (next: boolean) => {
      if (next === arrived) return;
      arrived = next;
      track.toggleAttribute("data-arrived", next);
      if (next) {
        arrival.play();
        steering?.reset();
      } else {
        arrival.reverse();
      }
    };
    arrived = false;

    const update = (self: ScrollTrigger) => {
      render(gsap.utils.clamp(0, 1, self.progress / ARRIVE_AT));
      // A little slack: landing on the arrival point by scrolling can stop a pixel short
      setArrived(self.progress >= ARRIVE_AT - 0.003);
    };
    const flight = ScrollTrigger.create({
      trigger: track,
      start: "top top",
      end: "bottom bottom",
      onUpdate: update,
      onRefresh: update,
      onToggle: (self) => track.toggleAttribute("data-animating", self.isActive),
    });
    update(flight); // Created late, so it may already be mid-flight or past it
    // The stage is on screen from when it enters until it has lifted off the top
    const onScreen = ScrollTrigger.create({
      trigger: track,
      start: "top bottom",
      end: "bottom top",
      onToggle: (self) => (self.isActive ? steering?.attach() : steering?.()),
    });
    if (onScreen.isActive) steering?.attach();

    toArrival = () => {
      const top = track.getBoundingClientRect().top + window.scrollY;
      const y = top + ARRIVE_AT * (track.offsetHeight - window.innerHeight);
      const lenis = getLenis();
      if (lenis) lenis.scrollTo(y, { duration: 1.2 });
      else window.scrollTo({ top: y });
    };

    return () => {
      toArrival = null;
      arrived = true;
      track.removeAttribute("data-animating");
      track.removeAttribute("data-arrived");
      steering?.();
      plane.style.opacity = "";
      plane.style.transform = "";
    };
  });

  mm.add(STACKED, () => {
    track.setAttribute("data-flying", "");
    const shown = greetings.map((_, i) => i).filter(onPhones);
    const render = createCorridor({
      world,
      plate,
      words: shown.map((i) => words[i]),
      depths: shown.map((i) => depths[i]),
      gates,
      useBlur: false,
    });
    render(0);

    gsap.set(plane, { opacity: 0 });
    gsap.set(headline, { yPercent: 110 });
    const stopDrift = createFloat([[steer, 6]]);
    const flight = { progress: 0 };

    ScrollTrigger.create({
      trigger: track,
      start: "top 65%",
      once: true,
      onEnter: () => {
        gsap
          .timeline()
          .to(flight, {
            progress: 1,
            duration: CORRIDOR.autoplay,
            ease: "power1.inOut",
            onUpdate: () => render(flight.progress),
          })
          .to(plane, { opacity: 1, duration: DUR.fast }, "-=0.3")
          .to(headline, { yPercent: 0, duration: DUR.slow, ease: EASE }, "<");
      },
    });

    return () => {
      track.removeAttribute("data-flying");
      stopDrift();
    };
  });

  mm.add(REDUCED_MOTION, () => {
    gsap.fromTo(
      q("[data-fade]"),
      { opacity: 0 },
      { opacity: 1, duration: FADE.duration, stagger: 0.1, scrollTrigger: { trigger: track, start: "top 80%", once: true } },
    );
  });

  return {
    /** Focus inside the plane before the camera has arrived */
    focusPlane: () => {
      if (!arrived) toArrival?.();
    },
    cleanup: () => mm.revert(),
  };
}

export type ContactMotion = ReturnType<typeof initContact>;
