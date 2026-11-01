import { gsap } from "./gsap";
import { GATE_DEPTHS } from "./corridorLayout";
import { CORRIDOR } from "./tokens";

const {
  travel,
  perspective,
  nearZ,
  farZ,
  planeZ,
  passAt,
  goneAt,
  blur,
  passScale,
  farOpacity,
  plateStart,
  plateEnd,
  gateOpacity,
} = CORRIDOR;

const clamp01 = gsap.utils.clamp(0, 1);
const between = (value: number, from: number, to: number) => clamp01((value - from) / (to - from));
/** Eases in and out: the words pass at an even rhythm, and the camera stops rather than hits a wall */
const cameraEase = gsap.parseEase("sine.inOut");

interface CorridorEls {
  world: Element;
  plate: HTMLElement;
  /** Each word's inner element, nearest first */
  words: HTMLElement[];
  /** The same words' depths */
  depths: number[];
  gates: HTMLElement[];
  /** The final plane, which grows into place as if it were at planeZ (pinned layout) */
  plane?: HTMLElement | null;
  /** Called when the word being flown past changes */
  onWord?: (index: number) => void;
  /** Off on phones: it's the one expensive thing here */
  useBlur?: boolean;
}

/**
 * Returns `render(progress)`, which puts the camera at 0–1 along the corridor. It's a pure function
 * of progress with no timeline state, so scrubbing backwards lands exactly where it was.
 */
export function createCorridor({ world, plate, words, depths, gates, plane, onWord, useBlur = true }: CorridorEls) {
  const setCamera = gsap.quickSetter(world, "z", "px");
  let current = -1;

  return (progress: number) => {
    const eased = cameraEase(progress);
    const camera = travel * eased;
    setCamera(camera);

    words.forEach((word, i) => {
      const eff = depths[i] + camera;
      const pass = between(eff, passAt, goneAt);
      word.style.visibility = pass < 1 ? "" : "hidden";
      if (pass === 1) {
        word.style.filter = "";
        return;
      }
      const near = between(eff, farZ, nearZ);
      word.style.opacity = String((farOpacity + (1 - farOpacity) * near) * (1 - pass));
      word.style.transform = pass ? `scale(${1 + (passScale - 1) * pass})` : "";
      // Words are further apart than this range, so only one is ever blurred
      if (useBlur) word.style.filter = pass ? `blur(${(blur * pass).toFixed(2)}px)` : "";
    });

    // The frames clear away on arrival, so they never run through the plane's text
    const arriving = between(planeZ + camera, CORRIDOR.planeFrom, CORRIDOR.planeTo);
    gates.forEach((gate, i) => {
      const eff = GATE_DEPTHS[i] + camera;
      gate.style.visibility = eff < 0 && arriving < 1 ? "" : "hidden";
      // A variable, because opacity on the gate itself would flatten its strips into one layer
      gate.style.setProperty("--gate-opacity", String(gateOpacity * between(eff, -5000, -800) * (1 - arriving)));
    });

    // A warm light far away that grows until it fills the frame at low opacity
    plate.style.opacity = String(plateStart + (plateEnd - plateStart) * eased);

    if (plane) {
      const eff = planeZ + camera;
      plane.style.opacity = String(arriving);
      plane.style.transform = eff < 0 ? `scale(${perspective / (perspective - eff)})` : "";
    }

    const next = depths.findIndex((z) => z + camera < goneAt);
    const word = next === -1 ? words.length - 1 : next;
    if (word !== current) {
      current = word;
      onWord?.(word);
    }
  };
}
