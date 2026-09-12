/**
 * Cursor-following 3D tilt for the What We Do media panels.
 *
 * The side under the cursor pushes AWAY from the viewer: hover the top-left
 * and that corner recedes. This is a rigid plane rotation, so the opposite
 * corner necessarily comes forward — the card stays flat and simply sits at
 * an angle.
 *
 *   rotateX = -ny * max   cursor above centre -> top edge recedes
 *   rotateY = +nx * max   cursor left of centre -> left edge recedes
 *
 * (In CSS, +rotateX sends the top back and +rotateY sends the right back,
 * hence the signs.)
 */
import { gsap, prefersReducedMotion } from "./gsap";

/** Beyond ~12deg the raster screenshots visibly resample and small UI text softens. */
const DEFAULT_MAX_DEG = 7;

const clamp = (v: number) => Math.max(-1, Math.min(1, v));

function setupTilt(el: HTMLElement) {
  const max = Number(el.dataset.tilt) || DEFAULT_MAX_DEG;

  const rotateX = gsap.quickTo(el, "rotationX", { duration: 0.5, ease: "power3.out" });
  const rotateY = gsap.quickTo(el, "rotationY", { duration: 0.5, ease: "power3.out" });

  const onEnter = () => {
    el.style.willChange = "transform";
  };

  const onMove = (e: PointerEvent) => {
    const r = el.getBoundingClientRect();
    const nx = clamp((e.clientX - (r.left + r.width / 2)) / (r.width / 2));
    const ny = clamp((e.clientY - (r.top + r.height / 2)) / (r.height / 2));
    rotateX(-ny * max);
    rotateY(nx * max);
  };

  const onLeave = () => {
    // Settle flat, then stop promoting the layer.
    gsap.to(el, {
      rotationX: 0,
      rotationY: 0,
      duration: 0.7,
      ease: "power3.out",
      onComplete: () => {
        el.style.willChange = "";
      },
    });
  };

  el.addEventListener("pointerenter", onEnter);
  el.addEventListener("pointermove", onMove);
  el.addEventListener("pointerleave", onLeave);

  return () => {
    el.removeEventListener("pointerenter", onEnter);
    el.removeEventListener("pointermove", onMove);
    el.removeEventListener("pointerleave", onLeave);
  };
}

// No hover target, or the visitor asked for less motion -> leave the panels flat.
const canHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

if (canHover && !prefersReducedMotion()) {
  const teardown = [...document.querySelectorAll<HTMLElement>("[data-tilt]")].map(setupTilt);
  if (import.meta.hot) import.meta.hot.dispose(() => teardown.forEach((fn) => fn()));
}
