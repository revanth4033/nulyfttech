/**
 * Central GSAP entry point.
 *
 * Import from here (never from "gsap" directly) so that plugins are
 * registered exactly once and every section shares one instance/ticker.
 */
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollSmoother } from "gsap/ScrollSmoother";
import { SplitText } from "gsap/SplitText";
import { CustomEase } from "gsap/CustomEase";

// Only register what is actually in use — registerPlugin holds a reference,
// so anything listed here is pinned into the bundle whether a section uses it
// or not. Add plugins as the sections that need them arrive:
//   Our Process  -> DrawSVGPlugin  (drawing the wave)
//   Why nuLyft / Industries -> MotionPathPlugin (the orbits)
gsap.registerPlugin(ScrollTrigger, ScrollSmoother, SplitText, CustomEase);

/* --------------------------------------------------------------------------
   Named eases — keep motion consistent with the Figma prototype.
   Add more here as the design calls for them.
   -------------------------------------------------------------------------- */
CustomEase.create("smooth", "0.22, 1, 0.36, 1");
CustomEase.create("swift", "0.65, 0, 0.35, 1");
CustomEase.create("expo", "0.16, 1, 0.3, 1");

gsap.defaults({ ease: "smooth", duration: 0.9 });

/** True when the visitor has asked the OS to reduce motion. */
export const prefersReducedMotion = (): boolean =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * Register a section's animations.
 *
 * Wraps the setup in a gsap.context() scoped to `root`, so every tween and
 * ScrollTrigger created inside is automatically cleaned up on teardown
 * (needed for HMR and, later, view transitions).
 *
 * When reduced motion is on, the setup is skipped entirely and the section's
 * [data-animate] elements are simply made visible.
 */
export function registerSection(
  selector: string,
  setup: (ctx: { root: HTMLElement; self: gsap.Context }) => void,
): void {
  const root = document.querySelector<HTMLElement>(selector);
  if (!root) return;

  if (prefersReducedMotion()) {
    revealAll(root);
    return;
  }

  const ctx = gsap.context((self) => setup({ root, self: self as gsap.Context }), root);

  // Clean up on Astro HMR so triggers don't stack up during development.
  if (import.meta.hot) {
    import.meta.hot.dispose(() => ctx.revert());
  }
}

/** Fallback: strip the hidden base state so content is always readable. */
export function revealAll(root: ParentNode = document): void {
  gsap.set(root.querySelectorAll("[data-animate]"), {
    visibility: "visible",
    opacity: 1,
    clearProps: "transform",
  });
}

/**
 * SplitText helper that is safe to use before webfonts have loaded —
 * splitting too early measures the fallback font and produces wrong line
 * breaks. Returns a promise resolving to the SplitText instance.
 */
export async function splitWhenReady(
  target: Element | Element[],
  vars: SplitText.Vars = { type: "lines", linesClass: "split-line-inner" },
): Promise<SplitText> {
  if (document.fonts?.ready) await document.fonts.ready;
  return new SplitText(target as never, vars);
}

export { gsap, ScrollTrigger, ScrollSmoother, SplitText, CustomEase };
