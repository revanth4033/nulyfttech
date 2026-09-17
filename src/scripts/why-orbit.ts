/**
 * Why nuLyft — scroll-driven conveyor.
 *
 * Four items ride an arc. Each scroll step moves every item one station
 * counter-clockwise: middle -> left, right -> middle, below -> right. It is
 * NOT a loop — the queue drains, which is why the left slot is empty on the
 * first state and the right slot is empty on the last.
 *
 *   step 0   [    ] ( 1 ) [ 2 ]      2,3 waiting below right
 *   step 1   [ 1  ] ( 2 ) [ 3 ]
 *   step 2   [ 2  ] ( 3 ) [ 4 ]
 *   step 3   [ 3  ] ( 4 ) [   ]      1,2 gone below left
 *
 * Below 900 the arc carries one station instead of three (Figma 493:2503):
 * the chip sits at the crown and each scroll step swaps which item is in it.
 * The pin and the snap stay, so it is the same interaction — only the
 * geometry is gone, which is why `renderMobile` writes opacity and nothing
 * else and clears whatever the desktop pass left inline.
 *
 * Geometry: the three stations sit at a uniform 53.08deg spacing on one
 * ellipse, so positions are computed parametrically rather than with
 * MotionPathPlugin — same curved travel, ~10KB lighter.
 *
 *   x = CX + A * sin(phi)
 *   y = CY - B * cos(phi)
 *
 * solved so that phi=0 lands the active chip at (620, 88) and phi=53.08
 * lands the right chip at (1035.5, 274.4), both measured off the Figma frame.
 */
import { gsap, ScrollTrigger, prefersReducedMotion } from "./gsap";

const STEP_DEG = 53.08; // one station
const CX = 620;
const CY = 554.9;
const A = 519.8;
const B = 466.9;

/** Active chip is a 96x128 stadium; side chips are 96.8 circles. */
const ACTIVE_W = 96;
const ACTIVE_H = 128;
const SIDE = 96.8;

/**
 * The chip fill stays #21163b at every station — sampling the Figma frames
 * shows an identical (33,22,59) under both the active and the side chips.
 * Only the glyph dims: pure white at the centre, ~(116,112,128) at the sides,
 * which is white at 0.37 over that fill.
 */
const ICON_DIM = 0.37;

const RAD = Math.PI / 180;
const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);

const stage = document.querySelector<HTMLElement>("[data-why-stage]");
const section = stage?.closest<HTMLElement>("section") ?? null;

if (stage && section) {
  const items = [...stage.querySelectorAll<HTMLElement>("[data-why-item]")];
  const captions = [...stage.querySelectorAll<HTMLElement>("[data-why-caption]")];
  const steps = items.length - 1; // 4 items -> 3 transitions

  /** Place every item for a fractional step position. */
  function render(k: number) {
    items.forEach((el, i) => {
      const icon = el.firstElementChild as HTMLElement | null;
      const phi = (i - k) * STEP_DEG;
      const t = clamp01(Math.abs(phi) / STEP_DEG); // 0 at centre, 1 at a side

      const x = CX + A * Math.sin(phi * RAD);
      const y = CY - B * Math.cos(phi * RAD);

      el.style.transform = `translate(-50%, -50%) translate(${x}px, ${y}px) rotate(${phi}deg)`;
      el.style.width = `${ACTIVE_W + (SIDE - ACTIVE_W) * t}px`;
      el.style.height = `${ACTIVE_H + (SIDE - ACTIVE_H) * t}px`;

      // Only the active chip carries the purple rim and the inner highlight.
      const rim = 1 - t;
      el.style.borderColor = `rgba(131, 77, 251, ${rim})`;
      el.style.boxShadow = rim > 0.01 ? `inset 0 2px 6px rgba(255,255,255,${0.16 * rim})` : "none";

      if (icon) icon.style.opacity = `${1 - (1 - ICON_DIM) * t}`;

      // Fade out past the two side stations rather than popping.
      const fade = clamp01((Math.abs(phi) - STEP_DEG) / (STEP_DEG * 0.55));
      el.style.opacity = `${1 - fade}`;

      const cap = captions[i];
      if (cap) {
        const ct = clamp01(Math.abs(phi) / 40);
        cap.style.opacity = `${1 - ct * ct}`;
      }
    });
  }

  /** One station: cross-fade between neighbours, settle on one. */
  function renderMobile(k: number) {
    items.forEach((el, i) => {
      const o = clamp01(1 - Math.abs(i - k));
      el.style.opacity = `${o}`;
      const cap = captions[i];
      if (cap) cap.style.opacity = `${o}`;
    });
  }

  /** Hand the elements back to the stylesheet. */
  function clearInline() {
    items.forEach((el) => {
      const icon = el.firstElementChild as HTMLElement | null;
      el.style.transform = "";
      el.style.width = "";
      el.style.height = "";
      el.style.borderColor = "";
      el.style.boxShadow = "";
      if (icon) icon.style.opacity = "";
    });
  }

  /** Every inline style either pass leaves behind. */
  function clearAll() {
    items.forEach((el) => {
      const icon = el.firstElementChild as HTMLElement | null;
      el.style.cssText = "";
      if (icon) icon.style.opacity = "";
    });
    captions.forEach((c) => (c.style.opacity = ""));
  }

  let draw: (k: number) => void = render;

  /**
   * `gsap.matchMedia` rather than a one-off `matchMedia(...).matches`: the
   * breakpoint has to be re-evaluated when the viewport changes, not just when
   * the script loads. Reading it once meant a page opened wide and then
   * narrowed — which is exactly what a device-mode resize does — kept the
   * desktop conveyor at mobile widths, with the chips still out on the
   * ellipse. Everything created inside a context is reverted on the way out.
   */
  const mm = gsap.matchMedia();

  const build = (mobile: boolean) => () => {
    clearAll();
    draw = mobile ? renderMobile : render;
    if (mobile) clearInline();
    draw(0);

    if (prefersReducedMotion()) return clearAll;

    ScrollTrigger.create({
      trigger: section,
      start: "top top",
      // Shorter throw on a phone: 90% per step was 2.7 screens of pinned
      // scrolling for four items, which reads as the page having stuck.
      end: `+=${steps * (mobile ? 55 : 90)}%`,
      pin: true,
      scrub: 0.6,
      // Settle on a station instead of resting mid-arc.
      snap: {
        snapTo: 1 / steps,
        duration: { min: 0.15, max: 0.4 },
        ease: "power2.inOut",
      },
      onUpdate: (self) => draw(self.progress * steps),
    });

    return clearAll;
  };

  mm.add("(max-width: 900px)", build(true));
  mm.add("(min-width: 901px)", build(false));

  if (import.meta.env.DEV) {
    Object.assign(window as unknown as Record<string, unknown>, {
      whyRender: render,
      whySteps: steps,
    });
  }
}
