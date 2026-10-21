/**
 * Websites Featured Work — two rows drifting in opposite directions.
 *
 * Each track carries its card set four times (see CapWebWork.astro) and
 * moves by exactly one set per loop, so the wrap lands on an identical
 * frame and never shows a seam. Top row drifts left, bottom row right.
 * Constant speed, no easing; paused while the section is off screen, and
 * skipped under reduced motion (the rows rest where Figma draws them).
 *
 * The lap is measured — card n's offset from card 0 — since the card size
 * changes on a phone; the tweens are rebuilt when the breakpoint flips.
 */
import { gsap, ScrollTrigger, prefersReducedMotion } from "./gsap";

const SPEED = 40; // px per second

const tracks = [...document.querySelectorAll<HTMLElement>("[data-ww-track]")];
const section = tracks[0]?.closest<HTMLElement>("section") ?? null;

if (section && tracks.length && !prefersReducedMotion()) {
  const build = () => {
    const tweens = tracks.map((track) => {
      const cards = track.children as HTMLCollectionOf<HTMLElement>;
      const lap = cards[Number(track.dataset.set)].offsetLeft - cards[0].offsetLeft;
      const left = track.dataset.dir === "left";
      return gsap.fromTo(
        track,
        { x: 0 },
        { x: left ? -lap : lap, duration: lap / SPEED, ease: "none", repeat: -1, paused: true },
      );
    });

    ScrollTrigger.create({
      trigger: section,
      start: "top bottom",
      end: "bottom top",
      onToggle: (self) => tweens.forEach((t) => (self.isActive ? t.play() : t.pause())),
    });
  };

  const mm = gsap.matchMedia();
  mm.add("(max-width: 560px)", build);
  mm.add("(min-width: 561px)", build);
}
