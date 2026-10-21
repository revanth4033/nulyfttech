/**
 * AI & Automation hero — the hub sends work out to every tool at once.
 *
 * One beat, repeated: a dashed line shoots from the hub to all nine logos
 * together, each logo lighting as its line arrives. The lines then carry on
 * *forward* — the tail runs out after the head and disappears into the
 * logo — so each reads like a shot fired outward, never drawing back in.
 *
 * Underneath, every logo drifts on its own slow path. The drift only moves
 * the disc a few px, and the lines run centre to centre, so a line's end
 * always stays hidden under the disc it reaches.
 *
 * Dashed lines cannot be drawn on with a dash offset (the dash pattern *is*
 * the dasharray), so each line is the dashed stroke masked by a solid copy
 * of itself, and it is the mask that moves. With the mask's dasharray at
 * `L L`, offset L hides it, 0 shows it whole and -L has slid the visible
 * run past the far end — so one tween L -> 0 -> -L is out-and-through.
 *
 * Paused off screen; under reduced motion the target is Figma's still frame.
 */
import { gsap, ScrollTrigger, prefersReducedMotion } from "./gsap";

const OUT = 0.8; // head: hub to logo
const HOLD = 0.4; // whole line showing
const THROUGH = 0.85; // tail: hub to logo
const REST = 0.7; // empty stage before the next burst
const HUB = { x: 230, y: 230 };
const NS = "http://www.w3.org/2000/svg";

const root = document.querySelector<HTMLElement>("[data-ai-target]");

if (root && !prefersReducedMotion()) {
  const svg = root.querySelector<SVGSVGElement>("[data-ai-links]")!;
  const logos = [...root.querySelectorAll<HTMLElement>("[data-ai-logo]")];

  const el = <K extends keyof SVGElementTagNameMap>(tag: K, attrs: Record<string, string | number>) => {
    const node = document.createElementNS(NS, tag);
    for (const [k, v] of Object.entries(attrs)) node.setAttribute(k, String(v));
    return node;
  };

  const defs = el("defs", {});
  svg.append(defs);

  const rays = logos.map((logo, i) => {
    const d = `M${HUB.x} ${HUB.y}L${logo.dataset.cx} ${logo.dataset.cy}`;
    const id = `aih-ray-${i}`;
    const mask = el("mask", { id, maskUnits: "userSpaceOnUse", x: -20, y: -20, width: 500, height: 500 });
    const reveal = el("path", { d, fill: "none", stroke: "#fff", "stroke-width": 6 });
    mask.append(reveal);
    defs.append(mask);
    svg.append(el("path", { d, class: "aih__link", mask: `url(#${id})` }));
    const len = reveal.getTotalLength();
    reveal.style.strokeDasharray = `${len} ${len}`;
    return { reveal, len, logo };
  });

  /* --- the burst ----------------------------------------------------------- */

  const tl = gsap.timeline({ repeat: -1, paused: true });

  // Opening state, pinned at t=0 so every lap starts on an empty stage.
  rays.forEach((r) => tl.set(r.reveal, { strokeDashoffset: r.len }, 0));
  tl.call(() => logos.forEach((l) => l.classList.remove("is-live")), [], 0);

  rays.forEach((r) => {
    tl.to(r.reveal, { strokeDashoffset: 0, duration: OUT, ease: "power2.out" }, 0);
    tl.to(r.reveal, { strokeDashoffset: -r.len, duration: THROUGH, ease: "sine.inOut" }, OUT + HOLD);
  });
  tl.call(() => logos.forEach((l) => l.classList.add("is-live")), [], OUT - 0.15);
  // Release as the tails reach the logos.
  tl.call(() => logos.forEach((l) => l.classList.remove("is-live")), [], OUT + HOLD + THROUGH * 0.85);
  tl.to({}, { duration: REST }, OUT + HOLD + THROUGH);

  /* --- ambient drift ------------------------------------------------------- */

  // Each logo its own small ellipse, period and phase, so nothing moves in
  // step. Seeded from the index so the motion is the same on every load.
  // Each tween is started part-way through (totalTime) rather than placed
  // at a negative time, which a timeline will not honour.
  const drift = logos.flatMap((logo, i) => {
    const amp = 3 + ((i * 7) % 4) * 0.6; // 3 - 4.8px
    const period = 3.2 + ((i * 5) % 7) * 0.35; // 3.2 - 5.3s
    const phase = ((i * 0.37) % 1) * period;
    return [
      gsap.to(logo, { y: -amp, duration: period / 2, ease: "sine.inOut", yoyo: true, repeat: -1, paused: true }).totalTime(phase),
      gsap.to(logo, { x: amp * 0.5, duration: period * 0.62, ease: "sine.inOut", yoyo: true, repeat: -1, paused: true }).totalTime(phase * 1.3),
    ];
  });

  ScrollTrigger.create({
    trigger: root,
    start: "top bottom",
    end: "bottom top",
    onToggle: (self) => {
      const on = self.isActive;
      on ? tl.play() : tl.pause();
      drift.forEach((d) => (on ? d.play() : d.pause()));
    },
  });

  if (import.meta.env.DEV) Object.assign(window as unknown as Record<string, unknown>, { aiHeroTimeline: tl });
}
