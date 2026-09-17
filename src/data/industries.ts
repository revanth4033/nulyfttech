/**
 * Industries We Serve — a hub-and-constellation.
 *
 * The nuLyft sphere sits at the centre of four concentric dashed rings, with
 * six industry pills scattered around it. Coordinates are the 396.25 square
 * Figma places at (742, 0) inside the 1240 content column.
 *
 * The pills sit at six genuinely different radii (196 to 246) and the
 * composition is deliberately asymmetric, so nothing here may rotate as a
 * group — it would only be correct at the drawn angle. The motion is a pulse
 * travelling outward instead, which the layout choreographs for free.
 */
export const BOX = 396.25;
export const CX = BOX / 2;
export const CY = BOX / 2;

/** Ring radii, from the exported SVG. */
export const RINGS = [110, 150, 200, 260];
export const R_OUTER = 260;

/** Crisp dashed set, and the same four radii again as 11px strokes under a
 *  30px blur — the lavender halo. Both centre on the square's centre. */
export const RING_A = { size: 522, offset: -63 };
export const RING_B = { size: 651, offset: -127.5 };

/* Mobile — Figma 493:2737. The constellation box is the same 396.25 square;
   what changes is that the rings tighten, the hub halves, and the six pills
   are re-scattered to fit a 361 column instead of overflowing a 1240 one. */
export const M_RING_A = { size: 361, offset: 18 };
export const M_RING_B = { size: 477, offsetX: -40.5, offsetY: -19 };
export const M_SPHERE = 96;
export const M_PILL_H = 34;

export const SPHERE = 170;
export const SPHERE_R = SPHERE / 2;

export interface Pill {
  icon: string;
  label: string;
  /** Figma's top-left within the square. */
  x: number;
  y: number;
  /** Figma's measured width; the anchor maths needs it before render. */
  w: number;
  /** Mobile placement inside the same square (493:2745). */
  mx: number;
  my: number;
  mw: number;
}

export const pills: Pill[] = [
  { icon: "icons/ind/technology", label: "Technology", x: -14.88, y: 32, w: 146, mx: 15, my: 164, mw: 117 },
  { icon: "icons/ind/retail", label: "Retail & Commerce", x: 295.13, y: 71, w: 201, mx: 213, my: 100, mw: 159 },
  { icon: "icons/ind/financial", label: "Financial Services", x: -144.88, y: 167, w: 195, mx: 15, my: 77, mw: 154 },
  { icon: "icons/ind/automotive", label: "Automotive", x: 322, y: 185, w: 145, mx: 258, my: 188, mw: 117 },
  { icon: "icons/ind/enterprise", label: "Enterprise Operations", x: -104.88, y: 301, w: 224, mx: 18, my: 262, mw: 176 },
  { icon: "icons/ind/hr", label: "HR & Recruitment", x: 256.13, y: 358, w: 191, mx: 225, my: 290, mw: 151 },
];

export const PILL_H = 40;

/** Distance from the hub to a pill's centre — what decides when the pulse
 *  reaches it, and so the order they respond in. */
export function radiusOf(p: Pill): number {
  return Math.hypot(p.x + p.w / 2 - CX, p.y + PILL_H / 2 - CY);
}

/** The same, for the mobile scatter — the pulse order differs there. */
export function radiusOfM(p: Pill): number {
  return Math.hypot(p.mx + p.mw / 2 - CX, p.my + M_PILL_H / 2 - CY);
}

/** The edge of a pill facing the hub, where its connector lands. */
export function anchorOf(p: Pill): { x: number; y: number } {
  const mid = p.x + p.w / 2;
  return { x: mid < CX ? p.x + p.w : p.x, y: p.y + PILL_H / 2 };
}

/** Where a connector leaves the sphere, heading for that pill. */
export function originOf(p: Pill): { x: number; y: number } {
  const a = anchorOf(p);
  const d = Math.hypot(a.x - CX, a.y - CY) || 1;
  const r = SPHERE_R + 3;
  return { x: CX + ((a.x - CX) / d) * r, y: CY + ((a.y - CY) / d) * r };
}

/**
 * The pulse starts at the sphere's edge and runs out past the last ring.
 * A pill pings as the wavefront crosses its own radius, so the six land
 * across roughly half a second in an uneven order the layout dictates —
 * rather than a mechanical one-two-three.
 */
export const PULSE_FROM = SPHERE_R / R_OUTER;
export const PULSE_TO = 1.2;

export function pingAt(p: Pill, mobile = false): number {
  const s = (mobile ? radiusOfM(p) : radiusOf(p)) / R_OUTER;
  return (s - PULSE_FROM) / (PULSE_TO - PULSE_FROM);
}

export const TIMING = {
  /** One wavefront, edge to beyond the outer ring. */
  pulse: 2.4,
  /** Gap before the next one. */
  rest: 2.1,
  /** A pill's lift-and-settle as the wave passes. */
  ping: 0.45,
  /** Dashed rings drift; the blurred halo is rotationally symmetric so
   *  turning it would show nothing. */
  spinA: 60,
  spinB: 80,
};
