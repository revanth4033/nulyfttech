/**
 * Case-study hero carousel.
 *
 * Two slides sit stacked in the same box and cross-fade in place, cycling
 * continuously, with the dots tracking whichever is showing.
 *
 * The user asked for a one-second cadence and confirmed it after being told
 * that is fast for a hero. So `HOLD + FADE` is one second per slide — most of
 * it hold, so the swap still reads as a fade rather than a flicker. Both
 * constants are here if it wants slowing down later.
 *
 * Slides are stacked, not laid side by side, so nothing scrolls and there is
 * no seam to hide: the outgoing slide is at opacity 0 before the next lap.
 */
import { gsap, ScrollTrigger, registerSection } from "./gsap";

/** One second per slide, split between the hold and the cross-fade. */
const FADE = 0.3;
const HOLD = 0.7;

registerSection(".chero", ({ root }) => {
  const slides = Array.from(root.querySelectorAll<HTMLElement>("[data-slide]"));
  const dots = Array.from(root.querySelectorAll<HTMLElement>("[data-dot]"));
  if (slides.length < 2) return;

  const tl = gsap.timeline({ repeat: -1 });

  slides.forEach((_, i) => {
    const next = (i + 1) % slides.length;
    const at = i * (HOLD + FADE) + HOLD;

    tl.to(slides[i], { opacity: 0, duration: FADE, ease: "none" }, at);
    tl.to(slides[next], { opacity: 1, duration: FADE, ease: "none" }, at);

    if (dots[next]) {
      tl.to(dots[i], { width: 20, backgroundColor: "#c7affd", duration: FADE }, at);
      tl.to(dots[next], { width: 36, backgroundColor: "#834dfb", duration: FADE }, at);
    }
  });

  /* Nothing to see while the hero is off screen, so stop ticking. */
  ScrollTrigger.create({
    trigger: root,
    start: "top bottom",
    end: "bottom top",
    onToggle: (self) => (self.isActive ? tl.play() : tl.pause()),
  });
});
