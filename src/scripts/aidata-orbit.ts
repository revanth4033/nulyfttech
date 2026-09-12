/**
 * AI & Data card — five technologies stepping round an ellipse, with a label
 * strip that names whichever one is on the hub.
 *
 * Step and hold: an item slides into the hub, rests while its name is
 * readable, then moves on. Both halves run off one phase value, so the strip
 * can never drift out of sync with the ring.
 */
import { gsap, ScrollTrigger, registerSection } from "./gsap";
import {
  GHOST_W,
  HUB,
  SLOT_REACH,
  STATIONS,
  TIMING,
  WRAP_IN,
  WRAP_OUT,
  badgeAt,
  glyphAt,
  place,
  slotX,
  techs,
} from "../data/aidata";

const N = techs.length;
const EXIT = N - 1;
const STEP = TIMING.hold + TIMING.move;

/**
 * Pose of an item at fractional station index `sf`.
 *
 * Stations are not evenly spaced in angle, so this walks them pairwise rather
 * than mapping `sf` onto one continuous sweep. The last leg is the wrap: the
 * item carries on past the exit to WRAP_OUT, hands over at zero opacity, and
 * slides in from WRAP_IN — both of which sit under the blur veils, so the
 * jump is never on screen.
 */
function pose(sf: number): { deg: number; opacity: number } {
  if (sf < EXIT) {
    const i = Math.floor(sf);
    const f = sf - i;
    return { deg: STATIONS[i] + (STATIONS[i + 1] - STATIONS[i]) * f, opacity: 1 };
  }
  // Back-loaded on the way out and front-loaded on the way in, so a badge
  // holds its station pose — which is what the Figma frames show — and does
  // its disappearing deep in the corner where the veil is whitest. A linear
  // fade instead dissolves it in plain sight halfway along the leg.
  const f = sf - EXIT;
  if (f < 0.5) {
    const k = f / 0.5;
    return { deg: STATIONS[EXIT] + (WRAP_OUT - STATIONS[EXIT]) * k, opacity: 1 - k * k };
  }
  const k = (f - 0.5) / 0.5;
  return { deg: WRAP_IN + (STATIONS[0] - WRAP_IN) * k, opacity: k * k };
}

registerSection(".tech", ({ root }) => {
  const orbit = root.querySelector<HTMLElement>("[data-aid-orbit]");
  const strip = root.querySelector<HTMLElement>("[data-strip]");
  if (!orbit || !strip) return;

  const items = Array.from(orbit.querySelectorAll<HTMLElement>("[data-item]"));
  const slots = Array.from(strip.querySelectorAll<HTMLElement>("[data-slot]"));
  if (items.length !== N || slots.length !== SLOT_REACH * 2 + 1) return;

  const part = (el: HTMLElement, sel: string) => el.querySelector<HTMLElement>(sel)!;

  /**
   * Measure the pills rather than trusting Figma's widths, which assume its
   * exact font metrics. Falls back to the design values if the probe reads
   * nonsense (webfont not in yet, element not laid out).
   */
  const probe = document.createElement("span");
  probe.style.cssText = "position:absolute;visibility:hidden;white-space:nowrap;font:inherit";
  part(slots[SLOT_REACH], "[data-label]").appendChild(probe);
  const widths = techs.map((t) => {
    probe.textContent = t.label;
    const w = Math.round(probe.offsetWidth) + 36; // 2x16 padding + 2x2 ring
    return w > 40 && w < 320 ? w : t.w;
  });
  probe.remove();

  /* ---- the ring ------------------------------------------------------- */

  const state = { p: 0 };

  const draw = () => {
    for (let i = 0; i < N; i++) {
      const sf = (((HUB + state.p - i) % N) + N) % N;
      const { deg, opacity } = pose(sf);
      const at = place(deg);
      gsap.set(items[i], {
        x: at.x,
        y: at.y,
        opacity,
        "--d": `${badgeAt(deg).toFixed(2)}px`,
        "--g": `${glyphAt(deg).toFixed(2)}px`,
      });
    }
  };

  /* ---- the strip ------------------------------------------------------ */

  const offsets = slots.map((_, j) => j - SLOT_REACH);

  /** Put every slot back where the markup had it. The visual state at the end
   *  of a lap already matches the start; this only restores which element is
   *  which, so the built timeline stays valid on repeat. */
  const resetStrip = () => {
    slots.forEach((el, j) => {
      const o = j - SLOT_REACH;
      offsets[j] = o;
      gsap.set(el, { left: slotX(o, widths[0]), width: o === 0 ? widths[0] : GHOST_W });
      gsap.set(part(el, "[data-ghost]"), { opacity: o === 0 ? 0 : 1 });
      gsap.set(part(el, "[data-pill]"), { opacity: o === 0 ? 1 : 0 });
      part(el, "[data-label]").textContent = techs[0].label;
      el.toggleAttribute("data-far", Math.abs(o) >= 2);
    });
  };

  const tl = gsap.timeline({ repeat: -1, paused: true, onUpdate: draw });

  // Pin the phase at the head of the lap. Without this, the stretch before
  // the first move has no tween covering it, so `p` keeps whatever value the
  // previous lap left behind and the ring sits a whole station ahead of the
  // strip for the opening hold.
  tl.set(state, { p: 0 }, 0);

  for (let s = 0; s < N; s++) {
    const at = s * STEP + TIMING.hold;
    const next = (s + 1) % N;
    const wFrom = widths[s];
    const wTo = widths[next];

    tl.fromTo(state, { p: s }, { p: s + 1, duration: TIMING.move, ease: "swift" }, at);

    slots.forEach((el, j) => {
      const o = offsets[j];
      const ghost = part(el, "[data-ghost]");
      const pill = part(el, "[data-pill]");

      if (o === -SLOT_REACH) {
        // Recycled to the far right. Ghosts are interchangeable and this one
        // is off-card at both ends, so the jump cannot be seen.
        tl.set(el, { left: slotX(SLOT_REACH + 1, wFrom) }, at);
        tl.to(el, { left: slotX(SLOT_REACH, wTo), duration: TIMING.move, ease: "swift" }, at);
        offsets[j] = SLOT_REACH;
      } else {
        const no = o - 1;
        tl.to(el, { left: slotX(no, wTo), duration: TIMING.move, ease: "swift" }, at);

        if (o === 0) {
          tl.to(el, { width: GHOST_W, duration: TIMING.move, ease: "swift" }, at);
          tl.to(pill, { opacity: 0, duration: TIMING.move * 0.45, ease: "none" }, at);
          tl.to(ghost, { opacity: 1, duration: TIMING.move * 0.45, ease: "none" }, at + TIMING.move * 0.45);
        } else if (o === 1) {
          tl.call(() => void (part(el, "[data-label]").textContent = techs[next].label), [], at);
          tl.to(el, { width: wTo, duration: TIMING.move, ease: "swift" }, at);
          tl.to(ghost, { opacity: 0, duration: TIMING.move * 0.45, ease: "none" }, at);
          tl.to(pill, { opacity: 1, duration: TIMING.move * 0.45, ease: "none" }, at + TIMING.move * 0.45);
        }
        offsets[j] = no;
      }

      const fo = offsets[j];
      tl.call(() => el.toggleAttribute("data-far", Math.abs(fo) >= 2), [], at);
    });
  }

  tl.eventCallback("onRepeat", resetStrip);
  resetStrip();
  draw();

  const st = ScrollTrigger.create({
    trigger: orbit,
    start: "top bottom",
    end: "bottom top",
    onToggle: (self) => (self.isActive ? tl.play() : tl.pause()),
  });

  if (st.isActive) tl.play();
});
