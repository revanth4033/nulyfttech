/**
 * Talent Intelligence — the drifting photo collage.
 *
 * Two columns scroll behind the gradient veils at a slow constant speed, in
 * opposite directions. Figma draws the composition static, but fading 240 of
 * its 630px away top and bottom is a "content continues" cue; the user
 * confirmed it should move.
 *
 * Each strip holds its photo set twice, so translating by exactly one lap
 * lands on an identical frame and the reset is invisible. `COLLAGE_LOOP` is
 * that distance — the four cell heights plus the four gaps, the last of which
 * is what closes the first set onto the duplicate.
 *
 * The wrap is doubly hidden: a cell is already faded into the page ground by
 * the time it reaches either edge, so even a mistimed seam would not show.
 *
 * The drift is deliberately non-interactive: it runs at one constant speed and
 * ignores the pointer.
 */
import { gsap, ScrollTrigger, registerSection } from "./gsap";
import { COLLAGE_LOOP, COLLAGE_SPEED } from "../data/talent";

registerSection(".talent", ({ root }) => {
  const stage = root.querySelector<HTMLElement>("[data-collage]");
  if (!stage) return;

  const strips = Array.from(stage.querySelectorAll<HTMLElement>("[data-collage-strip]"));
  if (!strips.length) return;

  const duration = COLLAGE_LOOP / COLLAGE_SPEED;

  const loops = strips.map((strip) => {
    // -1 travels up, +1 down. The downward strip starts a lap high so it has
    // somewhere to fall from; both cover the same ground either way.
    const up = Number(strip.dataset.dir ?? -1) < 0;
    return gsap.fromTo(
      strip,
      { y: up ? 0 : -COLLAGE_LOOP },
      { y: up ? -COLLAGE_LOOP : 0, duration, ease: "none", repeat: -1 },
    );
  });

  /* The drift is uninterrupted by design — it does not react to the cursor.
     The only thing that stops it is being off screen. */
  ScrollTrigger.create({
    trigger: stage,
    start: "top bottom",
    end: "bottom top",
    onToggle: (self) => loops.forEach((l) => (self.isActive ? l.play() : l.pause())),
  });

  /* This lives inside a tab panel, so on load it is display:none and measures
     nothing. `studio-tabs.ts` refreshes ScrollTrigger on every switch, which is
     what gives the trigger above its real start/end. */
});
