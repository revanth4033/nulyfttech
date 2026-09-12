/**
 * "AI & Automation" card -- four technologies riding the ring.
 *
 * A continuous loop, not scroll-driven: the train travels right to left over
 * the crown of the circle, which is the direction each orb's comet trail is
 * drawn pointing. Because the card clips the stage at |theta| = 43.2deg and
 * the four orbs are spaced a third of that apart, three are always on the
 * visible arc while the fourth crosses below -- and the wrap from +57.6 back
 * round happens ~107px under the clip, so it is never seen.
 *
 * Every orb advances one SPAN per cycle, which is four spacings, so each one
 * lands exactly where it started and the seam is invisible.
 */
import { gsap, ScrollTrigger, registerSection } from "./gsap";
import { CX, CY, R, SPAN, orbOpacity, orbs } from "../data/technology";

/** One full trip per orb. Slow enough to read the labels on the way past. */
const CYCLE = 18;

const HALF = SPAN / 2;
const DEG = Math.PI / 180;

/** Fold an angle back into the loop's [-HALF, HALF) window. */
const wrap = (v: number) => ((((v + HALF) % SPAN) + SPAN) % SPAN) - HALF;

registerSection(".tech", ({ root }) => {
  const stage = root.querySelector<HTMLElement>("[data-orbit]");
  if (!stage) return;

  const els = Array.from(stage.querySelectorAll<HTMLElement>("[data-orb]"));
  if (els.length !== orbs.length) return;

  const state = { p: 0 };

  const loop = gsap.to(state, {
    p: 1,
    duration: CYCLE,
    ease: "none",
    repeat: -1,
    onUpdate() {
      const travelled = state.p * SPAN;
      for (let i = 0; i < els.length; i++) {
        const deg = wrap(orbs[i].base - travelled);
        const t = deg * DEG;
        gsap.set(els[i], {
          x: CX + R * Math.sin(t),
          y: CY - R * Math.cos(t),
          rotation: deg,
          opacity: orbOpacity(deg),
        });
      }
    },
  });

  // Nothing to see while the card is off screen, so stop ticking.
  const st = ScrollTrigger.create({
    trigger: stage,
    start: "top bottom",
    end: "bottom top",
    onToggle: (self) => (self.isActive ? loop.play() : loop.pause()),
  });

  if (!st.isActive) loop.pause();
});
