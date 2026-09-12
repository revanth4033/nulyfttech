/**
 * Generic scroll reveal.
 *
 * Any section marked `data-section` gets its `[data-animate]` descendants
 * staggered in as it enters the viewport. This is the baseline every section
 * starts with; sections that need bespoke motion (the hero) own their own
 * timeline and simply don't carry `data-section`.
 */
import { gsap, ScrollTrigger, prefersReducedMotion, revealAll } from "./gsap";

const sections = document.querySelectorAll<HTMLElement>("[data-section]");

sections.forEach((section) => {
  const targets = section.querySelectorAll<HTMLElement>("[data-animate]");
  if (!targets.length) return;

  if (prefersReducedMotion()) {
    revealAll(section);
    return;
  }

  const ctx = gsap.context(() => {
    gsap.set(targets, { visibility: "visible" });

    gsap.from(targets, {
      y: 32,
      opacity: 0,
      duration: 0.9,
      ease: "expo",
      stagger: 0.08,
      scrollTrigger: {
        trigger: section,
        // Far enough in that the reveal reads as a response to scrolling,
        // not something that already happened off-screen.
        start: "top 78%",
        once: true,
      },
    });
  }, section);

  if (import.meta.hot) import.meta.hot.dispose(() => ctx.revert());
});

// Sections settle at slightly different heights once webfonts land.
document.fonts?.ready.then(() => ScrollTrigger.refresh());
