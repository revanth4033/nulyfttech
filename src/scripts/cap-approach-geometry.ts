/**
 * Design Approach geometry — pure functions, shared by the server render
 * (so state 01 is right with JS off) and the scroll script.
 *
 * Every position is a function of `s`, a step's offset from the active one:
 * 0 is active, +1 the next step, -1 the previous, fractional mid-transition.
 *
 * THE RING. Figma's six state frames (637:4316) place the numbers and dots
 * at five slots, s = -2..2. The dots sit on the 1200px ring (centre (120,
 * 375), r 598.8) at -33.1 / -15.8 / 0 / 15.8 / 33.0 degrees — not evenly
 * spaced. So positions are interpolated as an angle on the ring, and each
 * number keeps a polar offset from its dot (radial, tangential) plus a tilt,
 * all interpolated slot to slot. Travel therefore follows the curve rather
 * than cutting the chord, which would sag ~7px inside the ring between slots.
 *
 * THE STACK. A queue of three slots in a 469 x 250 box: step k in front,
 * k-1 back-left, k+1 back-right. Further steps wait behind a side slot at
 * zero opacity.
 */

const CX = 120;
const CY = 375;
const R = 598.8;
const DEG = Math.PI / 180;

/** Figma's slots, section coordinates. Number centres are box centres. */
const SLOTS = [
  { s: -2, dot: [622, 48], num: [655.89, 28.55], rot: -26.87 },
  { s: -1, dot: [697, 212], num: [733.11, 197.91], rot: -22.76 },
  // The active number is unrotated at (743, 354); "0x" in Plex 600/32 is
  // ~36.5 wide and 41.6 tall, so its centre is (761.25, 374.8).
  { s: 0, dot: [719, 375], num: [761.25, 374.8], rot: 0 },
  { s: 1, dot: [696, 538], num: [727.11, 547.91], rot: 22.76 },
  { s: 2, dot: [622, 701], num: [656.89, 714.55], rot: 26.87 },
].map((k) => {
  const ang = Math.atan2(k.dot[1] - CY, k.dot[0] - CX);
  const dx = k.num[0] - k.dot[0];
  const dy = k.num[1] - k.dot[1];
  // Number offset in the dot's own frame: along the radius and along the
  // tangent, so it rides round with the dot.
  const rad = dx * Math.cos(ang) + dy * Math.sin(ang);
  const tan = -dx * Math.sin(ang) + dy * Math.cos(ang);
  return { s: k.s, ang, rad, tan, rot: k.rot };
});

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const clamp = (v: number, lo: number, hi: number) => (v < lo ? lo : v > hi ? hi : v);

/** Piecewise-linear lookup across the five slots, extrapolating past ±2. */
function slotAt(s: number) {
  const i = clamp(Math.floor(s + 2), 0, SLOTS.length - 2);
  const a = SLOTS[i];
  const b = SLOTS[i + 1];
  const t = s + 2 - i; // may run past [0,1] at the ends: extrapolates
  return {
    ang: lerp(a.ang, b.ang, t),
    rad: lerp(a.rad, b.rad, clamp(t, 0, 1)),
    tan: lerp(a.tan, b.tan, clamp(t, 0, 1)),
    rot: lerp(a.rot, b.rot, clamp(t, 0, 1)),
  };
}

export interface MarkPose {
  dot: { x: number; y: number; color: string };
  num: { x: number; y: number; rot: number; alpha: number };
  opacity: number;
}

/** Dot and number for a step at offset `s`. Coordinates are centres. */
export function markPose(s: number): MarkPose {
  const { ang, rad, tan, rot } = slotAt(s);
  const dx = CX + R * Math.cos(ang);
  const dy = CY + R * Math.sin(ang);
  const nx = dx + rad * Math.cos(ang) - tan * Math.sin(ang);
  const ny = dy + rad * Math.sin(ang) + tan * Math.cos(ang);

  const a = Math.min(1, Math.abs(s));
  // White -> #342d44 for the dot; white -> 12% white for the number.
  const c = (from: number, to: number) => Math.round(lerp(from, to, a));
  return {
    dot: { x: dx, y: dy, color: `rgb(${c(255, 52)}, ${c(255, 45)}, ${c(255, 68)})` },
    num: { x: nx, y: ny, rot, alpha: lerp(1, 0.12, a) },
    // Past the outer slots a mark is leaving the frame: fade it out.
    opacity: 1 - clamp((Math.abs(s) - 2) / 0.6, 0, 1),
  };
}

/* --- stack ----------------------------------------------------------------- */

const FRONT = { x: 32, y: 0, w: 400, h: 249.645, r: 11.348 };
const LEFT = { x: 0, y: 25, w: 320.455, h: 200, r: 9.091 };
const RIGHT = { x: 148.995, y: 25, w: 320.455, h: 200, r: 9.091 };

export interface CardPose {
  x: number;
  y: number;
  w: number;
  h: number;
  /** Corner radius for a photo card; browser cards stay at 9.091. */
  r: number;
  /** 1 in front, 0 in a side slot — scales the front card's drop shadow. */
  lift: number;
  opacity: number;
  z: number;
}

export function cardPose(s: number): CardPose {
  const side = s < 0 ? LEFT : RIGHT;
  const t = clamp(Math.abs(s), 0, 1);
  return {
    x: lerp(FRONT.x, side.x, t),
    y: lerp(FRONT.y, side.y, t),
    w: lerp(FRONT.w, side.w, t),
    h: lerp(FRONT.h, side.h, t),
    r: lerp(FRONT.r, side.r, t),
    lift: 1 - t,
    // A step two away waits behind its side slot.
    opacity: 1 - clamp((Math.abs(s) - 1) / 0.6, 0, 1),
    // Nearest the front paints on top; at a tie the back-left card wins,
    // which is Figma's order (it draws back-right first).
    z: Math.round(1000 - Math.abs(s) * 100) + (s < 0 ? 1 : 0),
  };
}
