/**
 * About Us — "the next step". Each dot travels its line from the starting
 * point on the left into the nuLyft mark, and the mark glows as it lands.
 *
 * The dots go one after another — top, middle, bottom, half a second apart —
 * so the mark pulses three times a lap, then the stage rests before the next.
 * Each dot fades in at the head of its line and out as it reaches the mark,
 * so a lap starts and ends with nothing on screen and the loop has no seam.
 *
 * Two layouts share the beat (see AboutPaths.astro):
 *
 * - Desktop (>= 1181): Figma's placed stage. Positions are read off the
 *   routes' own SVG paths with getPointAtLength, so the dots ride the drawn
 *   curves exactly. Under reduced motion the dots rest where Figma puts them.
 * - 1180 and below: the flow layout. Its lines depend on where the copy
 *   wrapped, so they are drawn here from the laid-out boxes and redrawn on
 *   resize — outside `registerSection`, because that bails under reduced
 *   motion and the lines are part of the picture, not motion. The dots then
 *   ride those same paths.
 */
import { gsap, ScrollTrigger, registerSection } from "./gsap";
import { routes, BRANCH_H } from "../data/about";

/** Seconds a dot takes to cross its line. */
const TRAVEL = 1.6;
/** Gap between one dot setting off and the next. */
const STAGGER = 0.5;
/** One full lap, rest included. */
const CYCLE = 5;
/** The glow: up quickly, back slowly — and done before the next dot lands. */
const GLOW_IN = 0.15;
const GLOW_OUT = 0.35;

const DOT = 8;
const DESKTOP = "(min-width: 1181px)";
const FLOW = "(max-width: 1180px)";

/** Fade in over the first 12% of the line, out over the last 10%. */
const fade = (p: number) => Math.min(1, p / 0.12, (1 - p) / 0.1);

/* --- the flow layout's lines --------------------------------------------- */

const flow = document.querySelector<HTMLElement>("[data-flow]");
const flowPaths = flow ? Array.from(flow.querySelectorAll<SVGPathElement>("[data-flow-route]")) : [];
/** Current length of each flow path; 0 until drawn. */
const flowLengths = flowPaths.map(() => 0);

/**
 * Draw each line from its starting point to the mark, in the flow box's own
 * coordinates.
 *
 * Tablet (mark beside the column): out from the column's right edge, a short
 * level run, an S-curve to the mark's height, and level into the mark — the
 * desktop branch's shape. Phone (mark below): out into the right-hand lane,
 * a quarter turn down, and one shared trunk straight into the mark.
 */
function drawFlow(): void {
  if (!flow || !flowPaths.length || flow.offsetParent === null || !flow.offsetWidth) return;

  const starts = Array.from(flow.querySelectorAll<HTMLElement>("[data-flow-start]"));
  const list = flow.querySelector<HTMLElement>(".flow__starts");
  const goal = flow.querySelector<HTMLElement>(".flow__goal");
  const mark = flow.querySelector<HTMLElement>("[data-flow-mark]");
  const grad = flow.querySelector<SVGLinearGradientElement>("[data-flow-grad]");
  if (!list || !goal || !mark || starts.length !== flowPaths.length) return;

  // Layout positions (offset*), never getBoundingClientRect: the starting
  // points and the mark carry `data-animate`, so on load they are still
  // translated by the reveal, and a transform does not fire the resize
  // observer — lines measured from the rects stayed where the copy *was*.
  // Offsets: the items and the goal are positioned, so each chain ends at
  // `.flow`; the list is static, so its own offsetParent is `.flow` too.
  const mx = goal.offsetLeft + mark.offsetLeft + mark.offsetWidth / 2;
  const my = goal.offsetTop + mark.offsetTop + mark.offsetHeight / 2;
  const below = goal.offsetTop >= list.offsetTop + list.offsetHeight - 1;

  // The column's right edge, not each item's: every line leaves from the
  // same x, as Figma's do. On a phone that edge is the lane's.
  const colRight = list.offsetLeft + list.offsetWidth - (below ? parseFloat(getComputedStyle(list).paddingRight) : 0);
  const x0 = colRight + 12;

  starts.forEach((s, i) => {
    const chip = s.querySelector<HTMLElement>(".paths__chip")!;
    const y0 = s.offsetTop + chip.offsetTop + chip.offsetHeight / 2;
    let d: string;
    if (below) {
      const r = Math.min(16, (mx - x0) / 2);
      d = `M${x0} ${y0}H${mx - r}Q${mx} ${y0} ${mx} ${y0 + r}V${my}`;
    } else {
      const run = 24;
      const end = mx - 40; // level for the last stretch under the ring
      const a = x0 + run;
      const k = Math.max(0, (end - a) / 2);
      d = Math.abs(y0 - my) < 0.5 ? `M${x0} ${y0}H${mx}` : `M${x0} ${y0}H${a}C${a + k} ${y0} ${end - k} ${my} ${end} ${my}H${mx}`;
    }
    flowPaths[i].setAttribute("d", d);
    try {
      flowLengths[i] = flowPaths[i].getTotalLength();
    } catch {
      flowLengths[i] = 0;
    }
  });

  grad?.setAttribute("x1", String(x0));
  grad?.setAttribute("x2", String(mx));
}

if (flow) {
  const redraw = () => requestAnimationFrame(drawFlow);
  new ResizeObserver(redraw).observe(flow);
  document.fonts?.ready.then(redraw);
  window.matchMedia(FLOW).addEventListener("change", redraw);
}

/* --- motion ---------------------------------------------------------------- */

/** One lap: each dot crosses its line in turn, the mark glowing as it lands. */
function lap(dots: HTMLElement[], pulse: HTMLElement, place: (i: number, p: number) => void) {
  const tl = gsap.timeline({ repeat: -1 });

  dots.forEach((_, i) => {
    const state = { p: 0 };
    const start = i * STAGGER;

    // Pin the opening state: on the second lap nothing else resets it.
    tl.set(state, { p: 0 }, 0);
    tl.to(
      state,
      { p: 1, duration: TRAVEL, ease: "sine.inOut", onUpdate: () => place(i, state.p) },
      start,
    );

    tl.to(pulse, { opacity: 1, scale: 1.15, duration: GLOW_IN, ease: "power2.out" }, start + TRAVEL);
    tl.to(pulse, { opacity: 0, scale: 1, duration: GLOW_OUT, ease: "power2.in" }, start + TRAVEL + GLOW_IN);
  });

  // Rest, then go again.
  tl.set({}, {}, CYCLE);
  return tl;
}

/** Nothing to see while the section is off screen, so stop ticking. */
function pauseOffScreen(root: HTMLElement, tl: gsap.core.Timeline) {
  const st = ScrollTrigger.create({
    trigger: root,
    start: "top bottom",
    end: "bottom top",
    onToggle: (self) => (self.isActive ? tl.play() : tl.pause()),
  });
  if (!st.isActive) tl.pause();
}

registerSection(".paths", ({ root }) => {
  const mm = gsap.matchMedia();

  mm.add(DESKTOP, () => {
    const stage = root.querySelector<HTMLElement>(".paths__stage");
    if (!stage) return;
    const paths = Array.from(stage.querySelectorAll<SVGPathElement>("[data-route]"));
    const dots = Array.from(stage.querySelectorAll<HTMLElement>("[data-dot]"));
    const pulse = stage.querySelector<HTMLElement>("[data-pulse]");
    if (!pulse || paths.length !== routes.length || dots.length !== routes.length) return;

    // Some engines refuse to measure an unrendered path; leave the static
    // layout alone rather than animate from nonsense.
    let lengths: number[];
    try {
      lengths = paths.map((p) => p.getTotalLength());
    } catch {
      return;
    }
    if (lengths.some((l) => !(l > 0))) return;

    /** Stage coordinates of the dot's centre at progress p along route i. */
    const at = (i: number, p: number) => {
      const r = routes[i];
      const pt = paths[i].getPointAtLength(p * lengths[i]);
      return { x: r.x + pt.x, y: r.y + (r.flip ? BRANCH_H - pt.y : pt.y) };
    };

    const place = (i: number, p: number) => {
      const { x, y } = at(i, p);
      gsap.set(dots[i], { x: x - DOT / 2, y: y - DOT / 2, opacity: fade(p) });
    };

    // Hand the dots over from their Figma resting spots to the routes.
    gsap.set(dots, { left: 0, top: 0 });
    dots.forEach((_, i) => place(i, 0));
    gsap.set(pulse, { opacity: 0, scale: 1 });

    pauseOffScreen(root, lap(dots, pulse, place));
  });

  mm.add(FLOW, () => {
    if (!flow) return;
    const dots = Array.from(flow.querySelectorAll<HTMLElement>("[data-flow-dot]"));
    const pulse = flow.querySelector<HTMLElement>("[data-flow-pulse]");
    if (!pulse || dots.length !== flowPaths.length) return;

    drawFlow();

    const place = (i: number, p: number) => {
      const len = flowLengths[i];
      if (!(len > 0)) return gsap.set(dots[i], { opacity: 0 });
      const pt = flowPaths[i].getPointAtLength(p * len);
      gsap.set(dots[i], { x: pt.x - DOT / 2, y: pt.y - DOT / 2, opacity: fade(p) });
    };

    gsap.set(pulse, { opacity: 0, scale: 1 });
    pauseOffScreen(root, lap(dots, pulse, place));

    // matchMedia reverts the tweens; the inline styles they left are cleared
    // with them, but the dots' resting opacity is the stylesheet's.
    return () => gsap.set(dots, { clearProps: "transform,opacity" });
  });
});
