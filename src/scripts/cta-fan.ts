/**
 * CTA card fan — three product screens cycling.
 *
 * Step and hold: the front card retires to the back, arcing up and over the
 * other two, while they each step forward one slot. Every card moves to
 * slot (s - 1) mod 3, so one rule covers both the advance and the retire —
 * only the retiring card takes the long way round.
 *
 * The 3D tilt is baked into the rasters, so nothing here rotates: a card that
 * visibly tumbled would read as a flat sticker, its perspective unchanged.
 * The arc and a touch of scale do the work instead.
 */
import { gsap, ScrollTrigger, registerSection } from "./gsap";
import { ARC_PEAK, ARC_SCALE, SLOTS, TIMING } from "../data/cta";

const N = SLOTS.length;
const STEP = TIMING.hold + TIMING.move;

registerSection(".cta", ({ root }) => {
  /* Mobile (539:705) draws the trio static under the copy — the frame carries
     no cycle there. Checked through `gsap.matchMedia` below rather than as an
     early return, so a resize in either direction picks the right behaviour. */

  const fan = root.querySelector<HTMLElement>("[data-fan]");
  if (!fan) return;

  const cards = Array.from(fan.querySelectorAll<HTMLElement>("[data-card]"));
  if (cards.length !== N) return;

  /** Slot 0 is the front, so it paints highest. */
  const depth = (slot: number) => N - slot;

  const place = (el: HTMLElement, slot: number) =>
    gsap.set(el, { x: SLOTS[slot].x, y: SLOTS[slot].y, scale: 1, zIndex: depth(slot) });

  const reset = () => cards.forEach((el, i) => place(el, i));
  reset();

  const tl = gsap.timeline({ repeat: -1, paused: true });

  for (let step = 0; step < N; step++) {
    const at = step * STEP + TIMING.hold;

    cards.forEach((el, i) => {
      const from = (i + step) % N;
      const to = (from - 1 + N) % N;

      if (from === 0) {
        // Retiring. Drops behind everything first, then arcs across two
        // slots — up over the stack and back down into the last one.
        tl.set(el, { zIndex: 0 }, at);
        tl.to(el, { x: SLOTS[to].x, duration: TIMING.move, ease: "none" }, at);
        tl.to(el, { y: ARC_PEAK, duration: TIMING.move * 0.5, ease: "power2.out" }, at);
        tl.to(el, { y: SLOTS[to].y, duration: TIMING.move * 0.5, ease: "power2.in" }, at + TIMING.move * 0.5);
        tl.to(el, { scale: ARC_SCALE, duration: TIMING.move * 0.5, ease: "power2.out" }, at);
        tl.to(el, { scale: 1, duration: TIMING.move * 0.5, ease: "power2.in" }, at + TIMING.move * 0.5);
        tl.set(el, { zIndex: depth(to) }, at + TIMING.move);
      } else {
        // Advancing one slot. Takes its new depth on arrival so it never
        // pops in front of a card it is still behind.
        tl.to(el, { x: SLOTS[to].x, y: SLOTS[to].y, duration: TIMING.move, ease: "swift" }, at);
        tl.set(el, { zIndex: depth(to) }, at + TIMING.move);
      }
    });
  }

  tl.eventCallback("onRepeat", reset);

  const mm = gsap.matchMedia();

  mm.add("(min-width: 901px)", () => {
    const st = ScrollTrigger.create({
      trigger: fan,
      start: "top bottom",
      end: "bottom top",
      onToggle: (self) => (self.isActive ? tl.play() : tl.pause()),
    });
    if (st.isActive) tl.play();

    // Hold while someone is actually looking at a screen.
    const hold = () => tl.pause();
    const resume = () => {
      if (st.isActive) tl.play();
    };
    fan.addEventListener("pointerenter", hold);
    fan.addEventListener("pointerleave", resume);

    return () => {
      tl.pause(0);
      reset();
      fan.removeEventListener("pointerenter", hold);
      fan.removeEventListener("pointerleave", resume);
    };
  });
});
