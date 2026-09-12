/**
 * Industries We Serve — the constellation.
 *
 * Three layers:
 *   entrance  the pills arrive outward from the hub, nearest first
 *   ambient   a wavefront leaves the sphere every few seconds and each pill
 *             pings as it is crossed; the dashed rings drift meanwhile
 *   hover     the pill lifts, a connector draws from the sphere, the rest dim
 *
 * Nothing rotates as a group. The six pills sit at six different radii and
 * the composition is asymmetric, so a group rotation would only be correct at
 * the drawn angle — the pulse is what the layout actually supports, and the
 * spread of radii does the choreography.
 */
import { gsap, ScrollTrigger, prefersReducedMotion, registerSection } from "./gsap";
import { PULSE_FROM, PULSE_TO, TIMING, pills, pingAt } from "../data/industries";

const FINE = "(hover: hover) and (pointer: fine)";

registerSection(".ind", ({ root }) => {
  const stage = root.querySelector<HTMLElement>("[data-ind]");
  if (!stage) return;

  const pulse = stage.querySelector<HTMLElement>("[data-pulse]");
  const rings = stage.querySelector<HTMLElement>("[data-rings]");
  const els = Array.from(stage.querySelectorAll<HTMLElement>("[data-pill]"));
  const links = Array.from(stage.querySelectorAll<SVGLineElement>("[data-link]"));
  if (!pulse || els.length !== pills.length) return;

  /* ---- entrance ------------------------------------------------------- */

  // Out from the hub, nearest pill first, so the constellation assembles
  // rather than simply fading up.
  const order = pills
    .map((p, i) => ({ i, at: pingAt(p) }))
    .sort((a, b) => a.at - b.at);

  gsap.set(els, { opacity: 0, scale: 0.82 });
  gsap.to(
    order.map((o) => els[o.i]),
    {
      opacity: 1,
      scale: 1,
      duration: 0.7,
      ease: "expo",
      stagger: 0.07,
      scrollTrigger: { trigger: stage, start: "top 78%", once: true },
    },
  );

  /* ---- ambient -------------------------------------------------------- */

  if (rings) {
    gsap.to(rings, { rotation: 360, duration: TIMING.spinA, ease: "none", repeat: -1 });
  }

  const lap = TIMING.pulse + TIMING.rest;
  const tl = gsap.timeline({ repeat: -1, paused: true });

  // Scale carries the wavefront; opacity is tweened separately so it fades
  // up leaving the sphere and back out before the last ring, rather than
  // simply stopping. Keeping them on one tween would have the fromTo fight
  // the fades.
  tl.fromTo(
    pulse,
    { scale: PULSE_FROM },
    { scale: PULSE_TO, duration: TIMING.pulse, ease: "none" },
    0,
  );
  tl.fromTo(pulse, { opacity: 0 }, { opacity: 0.55, duration: TIMING.pulse * 0.25, ease: "none" }, 0);
  tl.to(pulse, { opacity: 0, duration: TIMING.pulse * 0.55, ease: "none" }, TIMING.pulse * 0.45);

  pills.forEach((p, i) => {
    const at = pingAt(p) * TIMING.pulse;
    tl.to(els[i], { y: -4, duration: TIMING.ping * 0.4, ease: "power2.out" }, at)
      .to(els[i], { y: 0, duration: TIMING.ping * 0.6, ease: "power2.inOut" }, at + TIMING.ping * 0.4);
  });

  tl.set({}, {}, lap);

  const st = ScrollTrigger.create({
    trigger: stage,
    start: "top bottom",
    end: "bottom top",
    onToggle: (self) => (self.isActive ? tl.play() : tl.pause()),
  });
  if (st.isActive) tl.play();

  /* ---- hover ---------------------------------------------------------- */

  if (prefersReducedMotion() || !window.matchMedia(FINE).matches) return;

  links.forEach((l) => {
    const len = l.getTotalLength();
    gsap.set(l, { strokeDasharray: len, strokeDashoffset: len });
  });

  els.forEach((el, i) => {
    const others = els.filter((_, j) => j !== i);
    const line = links[i];

    el.addEventListener("pointerenter", () => {
      gsap.to(el, { scale: 1.04, duration: 0.3, ease: "swift" });
      gsap.to(others, { opacity: 0.55, duration: 0.3, ease: "swift" });
      if (line) gsap.to(line, { strokeDashoffset: 0, opacity: 0.5, duration: 0.4, ease: "swift" });
    });

    el.addEventListener("pointerleave", () => {
      gsap.to(el, { scale: 1, duration: 0.35, ease: "swift" });
      gsap.to(others, { opacity: 1, duration: 0.35, ease: "swift" });
      if (line) {
        const len = line.getTotalLength();
        gsap.to(line, { strokeDashoffset: len, opacity: 0, duration: 0.3, ease: "swift" });
      }
    });
  });
});
