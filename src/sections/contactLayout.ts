import { site } from "@/config/site";
import { CORRIDOR } from "@/motion/tokens";

/** Pinned, scrubbed flight (matches the pinned layout in Contact.module.css) */
export const CONTACT_PINNED = "(min-width: 900px) and (prefers-reduced-motion: no-preference)";
/** Share of the pin at which the camera arrives; the rest is a still hold */
export const ARRIVE_AT = 1 / (1 + CORRIDOR.hold);
/** Phones fly past fewer words: every other one, always ending on the last */
export const onPhones = (i: number) => i % 2 === 0 || i === site.greetings.length - 1;
