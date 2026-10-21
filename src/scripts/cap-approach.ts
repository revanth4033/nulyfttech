/**
 * Design Approach — pinned, one state per scroll step.
 *
 * The section pins centred under the nav (see cap-pin.ts) and its scroll distance is
 * split into six equal bands. Crossing into a band tweens the whole stage to
 * that state — ring, copy and photo stack together — rather than scrubbing:
 * the scroll picks the state, the tween owns the motion. Scrolling back up
 * plays the same transitions in reverse. After state 06 the pin releases.
 *
 * Geometry is in `cap-approach-geometry.ts`; `p` here is the fractional
 * active step, and every element is placed from `i - p`.
 */
import { gsap, ScrollTrigger, prefersReducedMotion } from "./gsap";
import { pinStart } from "./cap-pin";
import { cardPose, markPose } from "./cap-approach-geometry";

/** Scroll per state, as a percentage of the viewport height. */
const STEP_VH = 55;
const TWEEN = { duration: 0.7, ease: "power2.inOut" };

const section = document.querySelector<HTMLElement>("[data-approach]");

if (section) {
  const marks = [...section.querySelectorAll<HTMLElement>("[data-mark]")];
  const cards = [...section.querySelectorAll<HTMLElement>("[data-card]")];
  const steps = [...section.querySelectorAll<HTMLElement>("[data-step]")];
  const n = steps.length;
  const state = { p: 0 };
  let active = 0;

  function render() {
    const { p } = state;

    marks.forEach((mark, i) => {
      const pose = markPose(i - p);
      const dot = mark.querySelector<HTMLElement>("[data-dot]")!;
      const num = mark.querySelector<HTMLElement>("[data-num]")!;
      mark.style.opacity = `${pose.opacity}`;
      dot.style.transform = `translate(${pose.dot.x}px, ${pose.dot.y}px) translate(-50%, -50%)`;
      dot.style.background = pose.dot.color;
      num.style.transform = `translate(${pose.num.x}px, ${pose.num.y}px) translate(-50%, -50%) rotate(${pose.num.rot}deg)`;
      num.style.color = `rgba(255, 255, 255, ${pose.num.alpha})`;
    });

    cards.forEach((card, i) => {
      const c = cardPose(i - p);
      card.style.left = `${c.x}px`;
      card.style.top = `${c.y}px`;
      card.style.width = `${c.w}px`;
      card.style.height = `${c.h}px`;
      card.style.setProperty("--r", `${c.r}px`);
      card.style.setProperty("--lift", `${c.lift}`);
      card.style.opacity = `${c.opacity}`;
      card.style.zIndex = `${c.z}`;
    });

    // Copy: a hand-off, not a cross-fade — the outgoing block is gone by the
    // midpoint and the incoming one rises in after it. Overlapping them read
    // as two paragraphs printed over each other.
    steps.forEach((step, i) => {
      const d = i - p;
      const o = Math.max(0, 1 - Math.abs(d) * 2);
      step.style.opacity = `${o}`;
      step.style.visibility = o > 0.001 ? "visible" : "hidden";
      step.style.transform = `translateY(${d * 24}px)`;
    });
  }

  function goTo(k: number) {
    if (k === active) return;
    active = k;
    steps.forEach((s, i) => s.setAttribute("aria-hidden", i === k ? "false" : "true"));
    gsap.to(state, { p: k, ...TWEEN, overwrite: true, onUpdate: render });
  }

  const mm = gsap.matchMedia();

  mm.add("(min-width: 1280px)", () => {
    if (prefersReducedMotion()) return;
    render();

    ScrollTrigger.create({
      trigger: section,
      start: pinStart(section),
      invalidateOnRefresh: true,
      end: `+=${n * STEP_VH}%`,
      pin: true,
      onUpdate: (self) => goTo(Math.min(n - 1, Math.floor(self.progress * n))),
    });

    return () => {
      gsap.killTweensOf(state);
      state.p = 0;
      active = 0;
      render();
      // The steps carry no inline style on the server; leaving render()'s
      // would keep five of the six hidden in the timeline below.
      steps.forEach((s) => s.removeAttribute("style"));
    };
  });

  // Below 1280: a timeline. Every step is readable; each lights as it
  // reaches the middle of the screen and stays lit once read.
  mm.add("(max-width: 1279px)", () => {
    const list = section.querySelector<HTMLElement>("[data-approach-steps]")!;
    steps.forEach((s) => s.removeAttribute("aria-hidden"));
    if (prefersReducedMotion()) return;

    list.classList.add("is-scroll");
    steps.forEach((step) =>
      ScrollTrigger.create({
        trigger: step,
        start: "top 65%",
        once: true,
        onEnter: () => step.classList.add("is-lit"),
      }),
    );

    return () => {
      list.classList.remove("is-scroll");
      steps.forEach((s, i) => {
        s.classList.remove("is-lit");
        s.setAttribute("aria-hidden", i === 0 ? "false" : "true");
      });
    };
  });

  if (import.meta.env.DEV) {
    Object.assign(window as unknown as Record<string, unknown>, {
      approachSeek: (p: number) => {
        state.p = p;
        render();
      },
    });
  }
}
