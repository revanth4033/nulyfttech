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
 *
 * Below 900 the section is a serpentine vertical timeline instead (Figma
 * 536:13470). There is no pin, no ball and no track to slide — the page
 * simply scrolls past it — so all this does is light each step as it is
 * reached, which is the behaviour the mobile frame was signed off with.
 */
import { gsap, ScrollTrigger, prefersReducedMotion } from "./gsap";
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

  /** The mobile timeline: one trigger per step, lit once it is reached. */
  function mobileSetup() {
    const triggers = steps.map((step, i) =>
      ScrollTrigger.create({
        trigger: step,
        start: "top 85%",
        // `once`: a step you have already read stays lit. Toggling it back off
        // as it left the viewport made the whole section read as dim.
        once: true,
        onEnter: () => {
          step.style.opacity = "1";
          const chip = chips[i];
          if (chip) {
            chip.style.opacity = "1";
            chip.style.scale = "1";
          }
        },
      }),
    );
    return () => triggers.forEach((t) => t.kill());
  }

  /** Clear every inline style the other layout left behind. */
  function reset() {
    [...steps, ...chips].forEach((el) => {
      el.style.opacity = "";
      el.style.scale = "";
    });
    ball!.style.transform = "";
    track!.style.transform = "";
    trail!.style.strokeDashoffset = "";
  }

  /**
   * The breakpoint is re-evaluated on resize rather than read once at load: a
   * page opened wide and then narrowed kept the pinned horizontal track at
   * mobile widths. `gsap.matchMedia` reverts each context on the way out.
   */
  const mm = gsap.matchMedia();

  mm.add("(max-width: 900px)", () => {
    reset();
    if (prefersReducedMotion()) return reset;

    // Start dim; each step lights as it is reached and stays lit.
    steps.forEach((el) => (el.style.opacity = "0.4"));
    chips.forEach((c) => {
      c.style.opacity = "0.55";
      c.style.scale = "1";
    });

    const kill = mobileSetup();
    return () => {
      kill();
      reset();
    };
  });

  mm.add("(min-width: 901px)", () => {
    if (prefersReducedMotion()) {
      render(moves); // the finished state, no pin
      return reset;
    }
    render(0);
    ScrollTrigger.create({
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
    return reset;
  });

  if (import.meta.env.DEV) {
    Object.assign(window as unknown as Record<string, unknown>, {
      processRender: render,
      processMoves: moves,
      processStations: stations,
    });
  }
}
