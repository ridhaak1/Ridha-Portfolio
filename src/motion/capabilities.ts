import { REDUCED_MOTION } from "./media";

/**
 * Hero state, decided before first paint by an inline script and stored on
 * <html data-hero="…">, so the CSS intro can start without waiting for JS:
 *  - intro:   first visit this session → play the cinematic intro
 *  - rest:    intro already played → show the final state
 *  - reduced: prefers-reduced-motion → plain fade, no motion
 */
export type HeroMode = "intro" | "rest" | "reduced";

export const HERO_MODE_SCRIPT = `(function(){try{
var m="intro";if(matchMedia("${REDUCED_MOTION}").matches)m="reduced";
else{try{if(sessionStorage.getItem("intro-played")==="1")m="rest"}catch(e){}}
document.documentElement.dataset.hero=m}catch(e){}})()`;
