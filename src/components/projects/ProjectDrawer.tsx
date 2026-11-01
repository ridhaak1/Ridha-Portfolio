import { useEffect, useLayoutEffect, useRef, type CSSProperties } from "react";
import { createPortal } from "react-dom";
import type { SelectedProject } from "@/data/projects";
import { gsap } from "@/motion/gsap";
import { getLenis } from "@/motion/lenis";
import { matches, REDUCED_MOTION } from "@/motion/media";
import { DUR, EASE, FADE } from "@/motion/tokens";
import { grainUrl } from "@/sections/heroAssets";
import { frameSize, frameSrc, frameSrcSet } from "@/sections/workAssets";
import styles from "./ProjectDrawer.module.css";

const IMAGE_SIZES = "(min-width: 900px) min(48vw, 800px), 100vw";
const FOCUSABLE = "a[href], button:not([disabled])";

/** All of them: the scenes' frames are stacked, so hiding one alone would reveal the one below */
const setFramesHidden = (hidden: boolean) =>
  document.querySelectorAll<HTMLElement>("[data-frame]").forEach((frame) => {
    frame.style.visibility = hidden ? "hidden" : "";
  });

/** Moves a flat copy of the screenshot between two rectangles, above the panel's clipping */
function flyImage(flyer: HTMLElement, from: DOMRect, to: DOMRect, vars: gsap.TweenVars) {
  gsap.set(flyer, { display: "block", left: to.left, top: to.top, width: to.width, height: to.height });
  return gsap.fromTo(
    flyer,
    { x: from.left - to.left, y: from.top - to.top, scaleX: from.width / to.width, scaleY: from.height / to.height },
    { x: 0, y: 0, scaleX: 1, scaleY: 1, duration: DUR.base, ease: EASE, ...vars },
  );
}

interface ProjectDrawerProps {
  project: SelectedProject;
  /** The frame that was clicked: it grows into the drawer, and takes focus back afterwards */
  origin: HTMLElement;
  onClosed: () => void;
}

export default function ProjectDrawer({ project, origin, onClosed }: ProjectDrawerProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const flyerRef = useRef<HTMLImageElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const closingRef = useRef(false);

  const { id, description, github, demo, screenshots, scene } = project;
  const { width, height } = frameSize(id);
  const meta = [scene.kind, scene.year, scene.status, scene.stack.join(", ")].join(" · ");
  const titleId = `drawer-title-${id}`;

  useEffect(() => {
    document.body.style.overflow = "hidden";
    getLenis()?.stop();
    return () => {
      document.body.style.overflow = "";
      getLenis()?.start();
    };
  }, []);

  useLayoutEffect(() => {
    const panel = panelRef.current;
    const image = imageRef.current;
    const flyer = flyerRef.current;
    if (!panel || !image || !flyer) return;
    closeRef.current?.focus({ preventScroll: true });

    const q = gsap.utils.selector(panel);
    const backdrop = backdropRef.current;
    const ctx = gsap.context(() => {
      if (matches(REDUCED_MOTION)) {
        gsap.fromTo([backdrop, panel], { opacity: 0 }, { opacity: 1, duration: FADE.duration });
        return;
      }
      const from = origin.getBoundingClientRect();
      const to = image.getBoundingClientRect();
      const source = origin.querySelector("img");
      if (source) flyer.src = source.currentSrc || source.src;
      setFramesHidden(true);
      gsap.set(image, { visibility: "hidden" });

      gsap.fromTo(backdrop, { opacity: 0 }, { opacity: 1, duration: DUR.fast });
      gsap.fromTo(panel, { opacity: 0 }, { opacity: 1, duration: DUR.fast });
      flyImage(flyer, from, to, {
        onComplete: () => {
          gsap.set(image, { visibility: "visible" });
          gsap.set(flyer, { display: "none" });
        },
      });
      gsap.fromTo(
        q("[data-rise]"),
        { yPercent: 110 },
        {
          yPercent: 0,
          duration: DUR.base,
          ease: EASE,
          stagger: 0.06,
          delay: 0.25,
          // Masks off, so focus outlines aren't clipped
          onComplete: () => panel.setAttribute("data-revealed", ""),
        },
      );
    }, rootRef);
    return () => ctx.kill();
  }, [origin]);

  const close = () => {
    if (closingRef.current) return;
    closingRef.current = true;
    const panel = panelRef.current;
    const image = imageRef.current;
    const flyer = flyerRef.current;
    const backdrop = backdropRef.current;
    const finish = () => {
      setFramesHidden(false);
      onClosed();
    };
    if (!panel || !image || !flyer || matches(REDUCED_MOTION)) {
      gsap.to([backdrop, panel], { opacity: 0, duration: FADE.duration, onComplete: finish });
      return;
    }
    document.body.style.overflow = ""; // The frame's rect is measured with the scrollbar back
    const from = image.getBoundingClientRect();
    gsap.killTweensOf([panel, flyer, backdrop]);
    gsap.set(image, { visibility: "hidden" });
    gsap.to(panel, { opacity: 0, duration: DUR.fast * 0.6 });
    gsap.to(backdrop, { opacity: 0, duration: DUR.fast });
    // Flown in reverse: from the panel's picture back onto the frame
    gsap.set(flyer, { display: "block", left: from.left, top: from.top, width: from.width, height: from.height, x: 0, y: 0, scaleX: 1, scaleY: 1 });
    const to = origin.getBoundingClientRect();
    gsap.to(flyer, {
      x: to.left - from.left,
      y: to.top - from.top,
      scaleX: to.width / from.width,
      scaleY: to.height / from.height,
      duration: DUR.fast,
      ease: EASE,
      onComplete: finish,
    });
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      e.stopPropagation();
      close();
      return;
    }
    if (e.key !== "Tab" || !panelRef.current) return;
    const focusables = [...panelRef.current.querySelectorAll<HTMLElement>(FOCUSABLE)];
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  };

  // Portalled: it must sit above the fixed HUD and notice, outside the section's stacking context
  return createPortal(
    <div ref={rootRef} className={styles.root} onKeyDown={onKeyDown}>
      <div ref={backdropRef} className={styles.backdrop} data-cursor="Close" onClick={close} aria-hidden="true" />

      <div
        ref={panelRef}
        className={styles.panel}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        data-lenis-prevent
      >
        <div className={styles.grain} style={{ "--grain": `url(${grainUrl})` } as CSSProperties} aria-hidden="true" />

        <div className={styles.bar}>
          <button ref={closeRef} type="button" className={styles.close} data-cursor="Close" onClick={close}>
            Close <span aria-hidden="true">✕</span>
          </button>
        </div>

        <div className={styles.content}>
          <div className={styles.mask}>
            <h2 id={titleId} className={styles.title} data-rise>
              {scene.title}
            </h2>
          </div>
          <div className={styles.mask}>
            <p className={styles.meta} data-rise>
              {meta}
            </p>
          </div>
          <div className={styles.mask}>
            <p className={styles.description} data-rise>
              {description}
            </p>
          </div>

          <ul className={styles.gallery}>
            <li>
              <div ref={imageRef} className={styles.shot}>
                <picture>
                  <source type="image/avif" srcSet={frameSrcSet(id, "avif")} sizes={IMAGE_SIZES} />
                  <source type="image/webp" srcSet={frameSrcSet(id, "webp")} sizes={IMAGE_SIZES} />
                  <img src={frameSrc(id)} alt={`${scene.title} — screenshot`} width={width} height={height} decoding="async" />
                </picture>
              </div>
            </li>
            {screenshots?.map(({ src, alt }) => (
              <li key={src}>
                <div className={styles.shot}>
                  <img src={src} alt={alt} loading="lazy" decoding="async" />
                </div>
              </li>
            ))}
          </ul>

          {(demo || github) && (
            <ul className={styles.links}>
              {demo && (
                <li className={styles.mask}>
                  <a href={demo} className={styles.link} target="_blank" rel="noopener noreferrer" data-cursor="Open" data-rise>
                    Live <span aria-hidden="true">↗</span>
                    <span className={styles.srOnly}> (opens in a new tab)</span>
                  </a>
                </li>
              )}
              {github && (
                <li className={styles.mask}>
                  <a href={github} className={styles.link} target="_blank" rel="noopener noreferrer" data-cursor="Open" data-rise>
                    GitHub <span aria-hidden="true">↗</span>
                    <span className={styles.srOnly}> (opens in a new tab)</span>
                  </a>
                </li>
              )}
            </ul>
          )}
        </div>
      </div>

      {/* The screenshot in flight; aria-hidden, the panel has the real one */}
      <img ref={flyerRef} className={styles.flyer} alt="" aria-hidden="true" />
    </div>,
    document.body,
  );
}
