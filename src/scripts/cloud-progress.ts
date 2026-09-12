/**
 * Cloud & Infrastructure — the scrubber and its checklist.
 *
 * Step and hold: the handle glides to the next quarter, a row slides in from
 * the left as it lands, then it waits. Once complete, everything fades out
 * where it stands, the bar is zeroed off screen, and the handle fades back in
 * at the start line — so the restart carries no backwards motion.
 *
 * Fill and handle are both driven off one `--p` custom property, so they
 * cannot drift apart.
 */
import { gsap, ScrollTrigger, registerSection } from "./gsap";
import { SLIDE, TIMING, fillAt, stages } from "../data/cloud";

const N = stages.length;
const STEP = TIMING.move + TIMING.hold;

registerSection(".tech", ({ root }) => {
  const bar = root.querySelector<HTMLElement>("[data-bar]");
  const rowsEl = root.querySelector<HTMLElement>("[data-rows]");
  if (!bar || !rowsEl) return;

  const rows = Array.from(rowsEl.querySelectorAll<HTMLElement>("[data-row]"));
  if (rows.length !== N) return;

  const hidden = { opacity: 0, x: -SLIDE };
  const shown = { opacity: 1, x: 0 };

  const reset = () => {
    gsap.set(bar, { "--p": "0px" });
    gsap.set(rows, hidden);
    gsap.set(bar.querySelectorAll(".cloud__fill, .cloud__handle"), { opacity: 1 });
  };
  reset();

  const tl = gsap.timeline({ repeat: -1, paused: true });

  // Pin the start: the opening beat has no tween over it, so without this the
  // second lap inherits whatever the first left behind.
  tl.set(bar, { "--p": "0px" }, 0);
  tl.set(rows, hidden, 0);
  tl.set([bar.querySelector(".cloud__fill"), bar.querySelector(".cloud__handle")], { opacity: 1 }, 0);

  stages.forEach((_, i) => {
    const at = i * STEP;
    tl.to(bar, { "--p": `${fillAt(i)}px`, duration: TIMING.move, ease: "swift" }, at);
    // Lands a beat after the handle, so the handle reads as delivering it.
    tl.to(rows[i], { ...shown, duration: TIMING.reveal, ease: "expo" }, at + TIMING.move * 0.5);
  });

  /* ---- back to the start --------------------------------------------- */

  const paint = [bar.querySelector<HTMLElement>(".cloud__fill"), bar.querySelector<HTMLElement>(".cloud__handle")];
  const clearAt = N * STEP + TIMING.settle;

  // Fade out in place. No stagger and no slide: any ordering here reads as
  // the sequence unwinding, which is exactly what we are avoiding.
  tl.to([...paint, ...rows], { opacity: 0, duration: TIMING.clear, ease: "power2.in" }, clearAt);

  // Zeroed while nothing is visible, so the jump back is never seen.
  tl.set(bar, { "--p": "0px" }, clearAt + TIMING.clear);
  tl.set(rows, hidden, clearAt + TIMING.clear);

  tl.to(paint, { opacity: 1, duration: TIMING.arm, ease: "power2.out" }, clearAt + TIMING.clear + TIMING.gap);

  const st = ScrollTrigger.create({
    trigger: bar,
    start: "top bottom",
    end: "bottom top",
    onToggle: (self) => (self.isActive ? tl.play() : tl.pause()),
  });

  if (st.isActive) tl.play();
});
