/**
 * AI Agents card — steps through the five states of Figma 647:7514.
 *
 *   state k (1-4): tool k is working (ring + dashed line), tasks 1..k are
 *                  listed, the newest still open
 *   state 5:       every task ticked, no tool lit
 *
 * then loops back to 1. Plain class toggles on a GSAP timeline; the
 * transitions live in AgentsArt.astro. Paused off screen; under reduced
 * motion the card keeps the page frame's state (4).
 */
import { gsap, ScrollTrigger, prefersReducedMotion } from "./gsap";

const STEP = 1.8; // seconds per state
const HOLD_DONE = 2.4; // linger on the finished card before starting over

const root = document.querySelector<HTMLElement>("[data-agents]");

if (root && !prefersReducedMotion()) {
  const tools = [...root.querySelectorAll<HTMLElement>("[data-ag-tool]")];
  const lines = [...root.querySelectorAll<SVGElement>("[data-ag-line]")];
  const tasks = [...root.querySelectorAll<HTMLElement>("[data-ag-task]")];
  const n = tasks.length; // 4 tools / tasks, 5 states

  // Tools and lines are in DOM order CRM, E-Mail, Calendar, Sheets — the
  // same order as the tasks they complete.
  const setState = (k: number) => {
    root.dataset.state = String(k);
    tools.forEach((t, i) => t.classList.toggle("is-live", i === k - 1));
    lines.forEach((l, i) => l.classList.toggle("is-live", i === k - 1));
    tasks.forEach((t, i) => {
      t.classList.toggle("is-shown", i < k);
      t.classList.toggle("is-done", k > n ? true : i < k - 1);
    });
  };

  const tl = gsap.timeline({ repeat: -1, paused: true });
  for (let k = 1; k <= n + 1; k++) tl.call(setState, [k], (k - 1) * STEP);
  tl.to({}, { duration: HOLD_DONE }, n * STEP);

  setState(1);

  ScrollTrigger.create({
    trigger: root,
    start: "top bottom",
    end: "bottom top",
    onToggle: (self) => (self.isActive ? tl.play() : tl.pause()),
  });

  if (import.meta.env.DEV) Object.assign(window as unknown as Record<string, unknown>, { agentsTimeline: tl });
}
