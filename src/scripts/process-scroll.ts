/**
 * Our Process — pinned horizontal scroll with a ball riding the curve.
 *
 * One scroll progress drives three things together:
 *   - the 2482px track slides left (1242px of travel inside a 1240 viewport)
 *   - the ball advances along the curve, stopping at each of the 5 chips
 *   - the trail behind the ball fills in
 *
 * The ball's path positions come from the browser's own
 * SVGGeometryElement.getPointAtLength(), so it follows the real curve
 * exactly — no MotionPathPlugin needed.
 *
 * Six stations: the ball starts where it is drawn (the curve's origin,
 * before Discover) and then visits all five chips, so five scroll moves.
 */
import { ScrollTrigger, prefersReducedMotion } from "./gsap";
import { processSteps, TRACK_W, VIEW_W } from "../data/process";

const section = document.querySelector<HTMLElement>('[data-section="our-process"]');
const track = document.querySelector<HTMLElement>("[data-process-track]");
const path = document.querySelector<SVGPathElement>("[data-process-path]");
const trail = document.querySelector<SVGPathElement>("[data-process-trail]");
const ball = document.querySelector<HTMLElement>("[data-process-ball]");
const chips = [...document.querySelectorAll<HTMLElement>("[data-process-chip]")];
const steps = [...document.querySelectorAll<HTMLElement>("[data-process-step]")];

if (section && track && path && trail && ball) {
  const total = path.getTotalLength();

  /** Path length whose point is nearest a given x — binary search on x. */
  function lengthAtX(targetX: number): number {
    let lo = 0;
    let hi = total;
    for (let i = 0; i < 24; i++) {
      const mid = (lo + hi) / 2;
      if (path!.getPointAtLength(mid).x < targetX) lo = mid;
      else hi = mid;
    }
    return (lo + hi) / 2;
  }

  // Station 0 is the curve origin (where the ball is drawn); 1..5 are the chips.
  const stations = [0, ...processSteps.map((s) => lengthAtX(s.cx))];
  const moves = stations.length - 1;

  trail.style.strokeDasharray = `${total}`;

  function render(k: number) {
    const i = Math.min(Math.floor(k), moves - 1);
    const f = k - i;
    const len = stations[i] + (stations[i + 1] - stations[i]) * f;

    const p = path!.getPointAtLength(len);
    ball!.style.transform = `translate(${p.x}px, ${p.y}px)`;
    trail!.style.strokeDashoffset = `${total - len}`;

    // Slide the track so the ball stays near the middle of the viewport,
    // clamped at both ends so the composition never runs off.
    const offset = Math.max(0, Math.min(TRACK_W - VIEW_W, p.x - VIEW_W / 2));
    track!.style.transform = `translateX(${-offset}px)`;

    // The step the ball has reached (or is closest to) reads as active.
    const nearest = Math.round(k) - 1;
    chips.forEach((c, ci) => {
      const on = ci <= nearest;
      c.style.opacity = on ? "1" : "0.55";
      c.style.scale = ci === nearest ? "1.08" : "1";
    });
    steps.forEach((s, si) => {
      s.style.opacity = si === nearest ? "1" : "0.4";
    });
  }

  if (prefersReducedMotion()) {
    render(moves); // show the finished state, no pin
  } else {
    render(0);
    const st = ScrollTrigger.create({
      trigger: section,
      start: "top top",
      end: `+=${moves * 80}%`,
      pin: true,
      scrub: 0.6,
      snap: {
        snapTo: 1 / moves,
        duration: { min: 0.15, max: 0.4 },
        ease: "power2.inOut",
      },
      onUpdate: (self) => render(self.progress * moves),
    });
    if (import.meta.hot) import.meta.hot.dispose(() => st.kill());
  }

  if (import.meta.env.DEV) {
    Object.assign(window as unknown as Record<string, unknown>, {
      processRender: render,
      processMoves: moves,
      processStations: stations,
    });
  }
}
