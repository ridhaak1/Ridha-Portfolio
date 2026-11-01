import { CORRIDOR } from "./tokens";

const { nearZ, farZ, gateCount, gateNear, gateFar } = CORRIDOR;

/** Word size per position in the list (vw), cycled */
const SIZES = [16, 13, 20, 22];
/** Height offset per position (vh), cycled; the side alternates */
const HEIGHTS = [15, -19, -15, 17];
/** An average letter's width in em, enough to keep a word's inner edge off the center line */
const LETTER_WIDTH = 0.29;

/**
 * Where each word floats. The first is nearest, so the list is flown past in order, and each sits
 * at least half its width off-center, so the camera always passes beside it, never through it.
 */
export function corridorLayout(words: readonly { word: string }[]) {
  return words.map(({ word }, i) => {
    const size = SIZES[i % SIZES.length];
    const side = i % 2 === 0 ? -1 : 1;
    const t = words.length > 1 ? i / (words.length - 1) : 0;
    return {
      z: nearZ + (farZ - nearZ) * t,
      size,
      x: side * (word.length * LETTER_WIDTH * size + 4),
      y: HEIGHTS[i % HEIGHTS.length],
    };
  });
}

/** The hairline frames that make the space read as a corridor, nearest first */
export const GATE_DEPTHS = Array.from(
  { length: gateCount },
  (_, i) => gateNear + ((gateFar - gateNear) * i) / (gateCount - 1),
);
