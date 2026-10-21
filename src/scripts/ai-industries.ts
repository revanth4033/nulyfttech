/**
 * Where can we help — the industry row steps along on its own.
 *
 * Every HOLD seconds the row slides one card left; the highlight follows
 * whichever card is nearest the column's centre, so it passes from one card
 * to the next mid-slide rather than waiting for the row to stop. The set is
 * rendered three times: once the centred card reaches the third copy, the
 * row jumps back exactly one set — the same picture — between slides.
 *
 * Paused off screen; under reduced motion the row keeps Figma's frame.
 */
import { gsap, ScrollTrigger, prefersReducedMotion } from "./gsap";

const HOLD = 2.4; // seconds on each centred card
const SLIDE = 0.8;

const row = document.querySelector<HTMLElement>("[data-aind-row]");

if (row && !prefersReducedMotion()) {
  const cards = [...row.querySelectorAll<HTMLElement>("[data-aind-card]")];
  const n = cards.length / 3;
  const start = Number(getComputedStyle(row).getPropertyValue("--start"));
  const step = () => cards[1].offsetLeft - cards[0].offsetLeft; // 316 — card + gap

  let k = start; // index of the centred card
  let active = cards[start];

  // Nearest card to the centre, from the row's live offset.
  const follow = () => {
    const x = gsap.getProperty(row, "x") as number;
    const i = start + Math.round(-x / step());
    const next = cards[Math.max(0, Math.min(cards.length - 1, i))];
    if (next !== active) {
      active.classList.remove("is-active");
      next.classList.add("is-active");
      active = next;
    }
  };

  const advance = () => {
    // Past the middle copy: drop back one whole set, which looks identical.
    if (k >= start + n) {
      k -= n;
      gsap.set(row, { x: -(k - start) * step() });
      follow();
    }
    k += 1;
    gsap.to(row, { x: -(k - start) * step(), duration: SLIDE, ease: "power2.inOut", onUpdate: follow });
  };

  // The delay runs from the start of each slide, so it covers the slide too.
  const loop = gsap.delayedCall(HOLD + SLIDE, function tick() {
    advance();
    loop.restart(true);
  }).pause();

  ScrollTrigger.create({
    trigger: row,
    start: "top bottom",
    end: "bottom top",
    onToggle: (self) => (self.isActive ? loop.resume() : loop.pause()),
  });

  if (import.meta.env.DEV) Object.assign(window as unknown as Record<string, unknown>, { industriesAdvance: advance });
}
