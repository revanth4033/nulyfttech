/**
 * Intelligent Workflow card — Figma 647:7155, played as one loop:
 *
 *   manual      scattered, tilted cards, a dashed hand-off, "30 min" pill
 *   automate    the toggle's thumb slides across; the cards straighten into
 *               one column, the spine draws down behind them, and the
 *               manual-only pieces fade
 *   complete    step by step: the chip fills, the time gives way to a tick,
 *               and one dot travels down the spine to the next hand-off
 *   reset       the spine retracts and the cards scatter back to manual
 *
 * Cards are positioned by --x/--y/--r (centre + tilt, see WorkflowArt), so
 * moving between the layouts is one tween per card. Paused off screen;
 * under reduced motion the card stays in its manual frame.
 */
import { gsap, ScrollTrigger, prefersReducedMotion } from "./gsap";
import { services } from "../data/capAi";

const HOLD_MANUAL = 1.8;
const MOVE = 1.0;
const STEP = 0.9;
const HOLD_DONE = 2;

const root = document.querySelector<HTMLElement>("[data-workflow]");

if (root && !prefersReducedMotion()) {
  const { manual, automated } = services.workflow;
  const cards = [...root.querySelectorAll<HTMLElement>("[data-wf-card]")];
  const opts = [...root.querySelectorAll<HTMLElement>("[data-wf-opt]")];
  const thumb = root.querySelector<HTMLElement>("[data-wf-thumb]");
  const pill = root.querySelector<HTMLElement>("[data-wf-pill]");
  const loop = root.querySelector<SVGElement>("[data-wf-loop]");
  const spine = root.querySelector<HTMLElement>("[data-wf-spine]");
  const runner = root.querySelector<HTMLElement>("[data-wf-runner]");

  /** Where the runner sits: the gap under card i, on the spine. */
  const junction = (i: number) => (automated[i].y + automated[i + 1].y) / 2 - 3;

  // The thumb tracks the active option's box; measured, since the labels
  // set their own widths.
  const thumbTo = (m: string) => {
    const opt = opts.find((o) => o.dataset.wfOpt === m);
    return opt ? { x: opt.offsetLeft, width: opt.offsetWidth } : {};
  };
  root.classList.add("has-thumb");
  gsap.set(thumb, thumbTo("manual"));

  const mode = (m: "manual" | "automated") => {
    root.dataset.mode = m;
    opts.forEach((o) => o.classList.toggle("is-on", o.dataset.wfOpt === m));
  };
  const done = (i: number, on: boolean) => cards[i]?.classList.toggle("is-done", on);
  const to = (p: { x: number; y: number; r: number }) => ({ "--x": `${p.x}px`, "--y": `${p.y}px`, "--r": `${p.r}deg` });

  const tl = gsap.timeline({ repeat: -1, paused: true });

  // --- pin the opening state ---------------------------------------------
  // A repeating timeline has no tween covering its first beat, so each lap
  // would otherwise inherit the last one's classes (see CLAUDE.md, AI & Data).
  tl.call(mode, ["manual"], 0);
  cards.forEach((c, i) => {
    tl.call(done, [i, false], 0);
    tl.set(c, to(manual[i]), 0);
  });
  tl.set(thumb, thumbTo("manual"), 0);
  tl.set(spine, { opacity: 0, scaleY: 0, transformOrigin: "50% 0%" }, 0);
  tl.set(runner, { opacity: 0, y: junction(0) }, 0);
  tl.set([pill, loop], { opacity: 1 }, 0);

  // --- automate ---------------------------------------------------------
  let t = HOLD_MANUAL;
  tl.to(thumb, { ...thumbTo("automated"), duration: 0.45, ease: "power3.inOut" }, t);
  tl.call(mode, ["automated"], t + 0.2);
  tl.to([pill, loop], { opacity: 0, duration: 0.35, ease: "power1.out" }, t);
  cards.forEach((c, i) => tl.to(c, { ...to(automated[i]), duration: MOVE, ease: "power3.inOut" }, t + 0.15 + i * 0.07));
  tl.to(spine, { opacity: 1, scaleY: 1, duration: 0.7, ease: "power2.out" }, t + MOVE * 0.75);

  // --- complete, one step at a time --------------------------------------
  t += MOVE + 0.5;
  cards.forEach((_, i) => {
    const at = t + i * STEP;
    tl.call(done, [i, true], at);
    if (i === 0) tl.to(runner, { opacity: 1, duration: 0.3, ease: "power1.out" }, at + 0.15);
    else if (i < cards.length - 1)
      tl.to(runner, { y: junction(i), duration: 0.55, ease: "power2.inOut" }, at + 0.05);
    else tl.to(runner, { y: automated[i].y - 3, opacity: 0, duration: 0.5, ease: "power2.in" }, at);
  });

  // --- reset to manual ---------------------------------------------------
  t += cards.length * STEP + HOLD_DONE;
  cards.forEach((_, i) => tl.call(done, [i, false], t + i * 0.06));
  tl.to(thumb, { ...thumbTo("manual"), duration: 0.45, ease: "power3.inOut" }, t + 0.2);
  tl.call(mode, ["manual"], t + 0.4);
  tl.to(spine, { scaleY: 0, opacity: 0, transformOrigin: "50% 100%", duration: 0.45, ease: "power2.in" }, t + 0.1);
  cards.forEach((c, i) => tl.to(c, { ...to(manual[i]), duration: MOVE, ease: "power3.inOut" }, t + 0.4 + i * 0.07));
  tl.to([pill, loop], { opacity: 1, duration: 0.45, ease: "power1.out" }, t + 0.4 + MOVE * 0.7);
  tl.to({}, { duration: 0.6 }, t + 0.4 + MOVE);

  ScrollTrigger.create({
    trigger: root,
    start: "top bottom",
    end: "bottom top",
    onToggle: (self) => (self.isActive ? tl.play() : tl.pause()),
  });

  if (import.meta.env.DEV) Object.assign(window as unknown as Record<string, unknown>, { workflowTimeline: tl });
}
