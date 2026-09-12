/**
 * Focus interaction for the three-phone case study.
 *
 * Pointing at a phone brings it forward while the other two settle back and
 * lose saturation, so each screen can be read on its own. The purple glow
 * behind them drifts toward the cursor at the same time.
 *
 * The phones are three independently placed layers (not one flat image), and
 * their boxes don't overlap horizontally — 0.5–198, 219.5–356, 377–575 — so
 * "which phone" is decided by whichever centre is nearest the cursor. Using
 * ranges instead would leave dead zones in the ~21px gaps and make the focus
 * flicker as the pointer crossed them.
 */
import { gsap, prefersReducedMotion } from "./gsap";

const FOCUSED = { y: -10, scale: 1.03, opacity: 1, saturate: 1 };
const DIMMED = { y: 0, scale: 0.97, opacity: 0.5, saturate: 0.65 };
const REST = { y: 0, scale: 1, opacity: 1, saturate: 1 };

/** How far the glow may drift from its resting position. */
const GLOW_X = 45;
const GLOW_Y = 28;

function setupStage(stage: HTMLElement) {
  const phones = [...stage.querySelectorAll<HTMLElement>("[data-phone]")];
  const glow = stage.querySelector<HTMLElement>("[data-phone-glow]");
  if (phones.length < 2) return () => {};

  // Animating `filter` as a string is brittle, so drive a number per phone
  // and write the property ourselves.
  const sat = phones.map(() => ({ v: 1 }));

  const setPhone = (i: number, to: typeof REST, duration: number) => {
    gsap.to(phones[i], {
      y: to.y,
      scale: to.scale,
      opacity: to.opacity,
      duration,
      ease: "power3.out",
      overwrite: "auto",
    });
    gsap.to(sat[i], {
      v: to.saturate,
      duration,
      ease: "power3.out",
      overwrite: "auto",
      onUpdate: () => {
        phones[i].style.filter = sat[i].v >= 0.999 ? "" : `saturate(${sat[i].v})`;
      },
    });
  };

  const glowX = glow ? gsap.quickTo(glow, "x", { duration: 0.7, ease: "power3.out" }) : null;
  const glowY = glow ? gsap.quickTo(glow, "y", { duration: 0.7, ease: "power3.out" }) : null;

  let active = -1;

  const onMove = (e: PointerEvent) => {
    const r = stage.getBoundingClientRect();
    const x = e.clientX - r.left;

    // nearest phone centre
    let nearest = 0;
    let best = Infinity;
    phones.forEach((p, i) => {
      const pr = p.getBoundingClientRect();
      const d = Math.abs(x - (pr.left - r.left + pr.width / 2));
      if (d < best) {
        best = d;
        nearest = i;
      }
    });

    if (nearest !== active) {
      active = nearest;
      phones.forEach((_, i) => setPhone(i, i === active ? FOCUSED : DIMMED, 0.45));
    }

    if (glowX && glowY) {
      const nx = gsap.utils.clamp(-1, 1, (x - r.width / 2) / (r.width / 2));
      const ny = gsap.utils.clamp(-1, 1, (e.clientY - r.top - r.height / 2) / (r.height / 2));
      glowX(nx * GLOW_X);
      glowY(ny * GLOW_Y);
    }
  };

  const onEnter = () => {
    if (glow) gsap.to(glow, { opacity: 0.92, duration: 0.5, ease: "power2.out" });
  };

  const onLeave = () => {
    active = -1;
    phones.forEach((_, i) => setPhone(i, REST, 0.6));
    if (glow) {
      gsap.to(glow, { opacity: 0.75, duration: 0.6, ease: "power2.out" });
      glowX?.(0);
      glowY?.(0);
    }
  };

  stage.addEventListener("pointerenter", onEnter);
  stage.addEventListener("pointermove", onMove);
  stage.addEventListener("pointerleave", onLeave);

  return () => {
    stage.removeEventListener("pointerenter", onEnter);
    stage.removeEventListener("pointermove", onMove);
    stage.removeEventListener("pointerleave", onLeave);
  };
}

const canHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

if (canHover && !prefersReducedMotion()) {
  const teardown = [...document.querySelectorAll<HTMLElement>("[data-phone-stage]")].map(setupStage);
  if (import.meta.hot) import.meta.hot.dispose(() => teardown.forEach((fn) => fn()));
}
