/**
 * Boots the site-wide animation layer.
 * Loaded once from BaseLayout.astro.
 */
import { gsap, ScrollTrigger, ScrollSmoother, prefersReducedMotion, revealAll } from "./gsap";

const html = document.documentElement;
html.classList.remove("no-js");

let smoother: ScrollSmoother | null = null;

function boot() {
  if (prefersReducedMotion()) {
    html.classList.add("reduced-motion");
    revealAll();
    return;
  }

  html.classList.add("gsap-ready");

  smoother = ScrollSmoother.create({
    wrapper: "#smooth-wrapper",
    content: "#smooth-content",
    smooth: 1.2,          // seconds it takes to "catch up" to native scroll
    effects: true,        // enables data-speed / data-lag attributes
    smoothTouch: false,   // native scrolling on touch feels better + is accessible
    // Mouse and trackpad only. On a touch-only device it takes over the
    // finger scroll in a way the smoother never hears: the page moves, but
    // `scrollTop()` stays at 0, so no ScrollTrigger below the first screen
    // ever fires and every section past it stays at its hidden reveal state
    // (seen on a phone on the live site). Touch already scrolls natively
    // here (`smoothTouch: false`), so turning it off there loses nothing.
    normalizeScroll: ScrollTrigger.isTouch !== 1,
  });

  // Re-measure once webfonts land — line heights shift and would otherwise
  // leave every ScrollTrigger start/end a few pixels off.
  document.fonts?.ready.then(() => ScrollTrigger.refresh());
}

boot();

/* Keep triggers honest when the viewport resizes (debounced by ScrollTrigger). */
window.addEventListener("resize", () => ScrollTrigger.refresh());

/* Expose for debugging in the browser console during development. */
if (import.meta.env.DEV) {
  Object.assign(window as never, { gsap, ScrollTrigger, smoother: () => smoother });
}

export { smoother };
