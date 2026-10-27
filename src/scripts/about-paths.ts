/**
 * About Us — "the next step". Each dot travels its line from the starting
 * point on the left into the nuLyft mark, and the mark glows as it lands.
 *
 * The dots go one after another — top, middle, bottom, half a second apart —
 * so the mark pulses three times a lap, then the stage rests before the next.
 * Each dot fades in at the head of its line and out as it reaches the mark,
 * so a lap starts and ends with nothing on screen and the loop has no seam.
 *
 * Positions are read off the routes' own SVG paths with getPointAtLength, so
 * the dots ride the drawn curves exactly. Under reduced motion
 * `registerSection` skips all of this and the dots rest where Figma puts them.
 */
import { gsap, ScrollTrigger, registerSection } from "./gsap";
import { routes, BRANCH_H } from "../data/about";

/** Seconds a dot takes to cross its line. */
const TRAVEL = 1.6;
/** Gap between one dot setting off and the next. */
const STAGGER = 0.5;
/** One full lap, rest included. */
const CYCLE = 5;
/** The glow: up quickly, back slowly — and done before the next dot lands. */
const GLOW_IN = 0.15;
const GLOW_OUT = 0.35;

const DOT = 8;

/** Fade in over the first 12% of the line, out over the last 10%. */
const fade = (p: number) => Math.min(1, p / 0.12, (1 - p) / 0.1);

registerSection(".paths", ({ root }) => {
  const paths = Array.from(root.querySelectorAll<SVGPathElement>("[data-route]"));
  const dots = Array.from(root.querySelectorAll<HTMLElement>("[data-dot]"));
  const pulse = root.querySelector<HTMLElement>("[data-pulse]");
  if (!pulse || paths.length !== routes.length || dots.length !== routes.length) return;

  // Some engines refuse to measure an unrendered path; leave the static
  // layout alone rather than animate from nonsense.
  let lengths: number[];
  try {
    lengths = paths.map((p) => p.getTotalLength());
  } catch {
    return;
  }
  if (lengths.some((l) => !(l > 0))) return;

  /** Stage coordinates of the dot's centre at progress p along route i. */
  const at = (i: number, p: number) => {
    const r = routes[i];
    const pt = paths[i].getPointAtLength(p * lengths[i]);
    return { x: r.x + pt.x, y: r.y + (r.flip ? BRANCH_H - pt.y : pt.y) };
  };

  const place = (i: number, p: number) => {
    const { x, y } = at(i, p);
    gsap.set(dots[i], { x: x - DOT / 2, y: y - DOT / 2, opacity: fade(p) });
  };

  // Hand the dots over from their Figma resting spots to the routes.
  gsap.set(dots, { left: 0, top: 0 });
  dots.forEach((_, i) => place(i, 0));
  gsap.set(pulse, { opacity: 0, scale: 1 });

  const tl = gsap.timeline({ repeat: -1 });

  dots.forEach((_, i) => {
    const state = { p: 0 };
    const start = i * STAGGER;

    // Pin the opening state: on the second lap nothing else resets it.
    tl.set(state, { p: 0 }, 0);
    tl.to(
      state,
      { p: 1, duration: TRAVEL, ease: "sine.inOut", onUpdate: () => place(i, state.p) },
      start,
    );

    tl.to(pulse, { opacity: 1, scale: 1.15, duration: GLOW_IN, ease: "power2.out" }, start + TRAVEL);
    tl.to(pulse, { opacity: 0, scale: 1, duration: GLOW_OUT, ease: "power2.in" }, start + TRAVEL + GLOW_IN);
  });

  // Rest, then go again.
  tl.set({}, {}, CYCLE);

  // Nothing to see while the section is off screen, so stop ticking.
  const st = ScrollTrigger.create({
    trigger: root,
    start: "top bottom",
    end: "bottom top",
    onToggle: (self) => (self.isActive ? tl.play() : tl.pause()),
  });

  if (!st.isActive) tl.pause();
});
