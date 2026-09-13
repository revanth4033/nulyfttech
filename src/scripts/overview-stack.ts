/**
 * About The Project — the two screens trade places.
 *
 * Two slots, two cards, and every two seconds they swap: the back card hops
 * up and over into the front slot while the front card drops back into the
 * rotated one. The user asked for the change of position to read as a jump,
 * so the move carries an arc — without it the pair just slides past each
 * other and reads as a cross-fade of positions rather than a hop.
 *
 * Geometry is in `data/caseLms.ts`. The two slots are stored as centres
 * because the back card is rotated 7 degrees and its top-left is not where
 * Figma reports it.
 *
 * The cards are placed by CSS at their *home* slot, so the resting frame is
 * correct with no JS and under reduced motion. This only ever writes the
 * offset from home (`--sx`/`--sy`, percentages of the card's own box, which
 * is what `translate()` resolves against) plus an absolute `--sr`.
 */
import { gsap, ScrollTrigger, registerSection } from "./gsap";
import { overview } from "../data/caseLms";

/** One swap every two seconds: most of it held, the rest in flight. */
const HOLD = 1.5;
const HOP = 0.5;

/**
 * Apex of each arc, in Figma px, and the reason the two arcs are mirrored.
 *
 * Both cards travel the same line between the two slots, just in opposite
 * directions, so an identical arc puts them at exactly the same place at the
 * halfway point — measured, not guessed: both landed on (88.9, 112.3, -3.5deg)
 * and the upper one hid the other completely, which reads as a card vanishing.
 * Mirroring the arc swings them around each other instead: the one rising to
 * the front goes over the top, the one retiring dips under it.
 */
const LIFT = 30;

const { slots, stage } = overview;

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

registerSection(".cover", ({ root }) => {
  const cards = Array.from(root.querySelectorAll<HTMLElement>("[data-screen]"));
  if (cards.length !== slots.length) return;

  const state = { p: 0 };

  const render = () => {
    const base = Math.floor(state.p);
    const t = state.p - base;
    const moving = t > 0;

    cards.forEach((card, i) => {
      const from = slots[(base + i) % slots.length];
      const to = slots[(base + 1 + i) % slots.length];
      const home = slots[i];

      const front = to === slots[slots.length - 1];
      const cx = lerp(from.cx, to.cx, t);
      const cy =
        lerp(from.cy, to.cy, t) + (front ? -LIFT : LIFT) * Math.sin(Math.PI * t);

      card.style.setProperty("--sx", `${((cx - home.cx) / stage.card.w) * 100}%`);
      card.style.setProperty("--sy", `${((cy - home.cy) / stage.card.h) * 100}%`);
      card.style.setProperty("--sr", `${lerp(from.rotate, to.rotate, t)}deg`);

      /* Whoever is in — or on the way to — the front slot paints on top, so
         the riser passes over rather than under. Slot 1 is the front one. */
      const slot = moving ? to : from;
      card.style.zIndex = slot === slots[slots.length - 1] ? (moving ? "3" : "2") : "1";
    });
  };

  /* Two swaps per lap, so the cards end the lap in the slots they started in
     and `p` can simply wrap. The `set` at time 0 is not redundant: the opening
     hold has no tween covering it, so without it lap two inherits lap one's
     final `p` and the stack sits a swap ahead. */
  const tl = gsap.timeline({ repeat: -1, paused: true });
  tl.set(state, { p: 0 }, 0);
  for (let n = 0; n < slots.length; n += 1) {
    tl.to(
      state,
      { p: n + 1, duration: HOP, ease: "power2.inOut", onUpdate: render },
      HOLD * (n + 1) + HOP * n,
    );
  }

  render();

  /* Nothing to watch while it is off screen, so stop ticking. */
  ScrollTrigger.create({
    trigger: root,
    start: "top bottom",
    end: "bottom top",
    onToggle: (self) => (self.isActive ? tl.play() : tl.pause()),
  });

  if (import.meta.env.DEV) {
    Object.assign(window as unknown as Record<string, unknown>, {
      overviewStackTimeline: tl,
      /** Seek by phase, 0-2, and force a synchronous render. */
      overviewStackSeek: (p: number) => {
        state.p = p;
        render();
      },
    });
  }
});
