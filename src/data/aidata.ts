/**
 * AI & Data card — five technologies riding an ellipse, with a label strip
 * that names whichever one is currently on top.
 *
 * Coordinates are the orbit frame's own space: the 436x275 box Figma places
 * at (-17, 194) inside the 402x495 card, so it is deliberately wider than the
 * card and clipped on both sides.
 *
 * The five Figma frames are five steps of one rotation — the same five items
 * each advancing one station — not five cumulative states like Engineering.
 */
export const ORBIT_W = 436;
export const ORBIT_H = 275;
export const ORBIT_X = -17;
export const ORBIT_Y = 194;
export const CARD_W = 402;
export const CARD_H = 495;

/**
 * All five station centres fall on one ellipse to within 0.7%, so this is a
 * real orbit rather than five placed dots. Fitted from the Figma positions
 * (401,205) (331,134) (218,111) (105,134) (34,205).
 */
export const CX = 217.5;
export const CY = 224.2;
export const RX = 186.2;
export const RY = 113.2;

/**
 * Stations in travel order: an item enters bottom-right, rises, peaks at the
 * hub, descends, and leaves bottom-left — right to left over the top, the
 * same direction as the AI & Automation orbit. Angles are measured from the
 * top and reproduce Figma's positions to within 0.7px.
 */
export const STATIONS = [80.2, 37.3, 0, -37.3, -80.2];
export const HUB = 2;

/**
 * The wrap. An item leaving the exit carries on under the left-hand blur
 * veil to -105 degrees, jumps to the mirrored +105 (also under a veil), and
 * slides in to the entry. Both ends sit inside the 60x104 veils, so the jump
 * itself is never on screen — the alternative, carrying it the long way round
 * the bottom of the ellipse, would have it visibly racing the other four.
 */
export const WRAP_OUT = -105;
export const WRAP_IN = 105;

/** Badge and glyph scale up only at the hub. */
export const BADGE = 70;
export const BADGE_HUB = 100;
export const GLYPH = 32;
export const GLYPH_HUB = 40;

/** Halo, vertical rule and dots are fixed to the hub station, not to an item. */
export const HALO = 130;
export const AXIS_X = 216;

/** Label strip: a 418x40 row at card (-8, 130), pills centred on x = 209. */
export const STRIP_W = 418;
export const STRIP_H = 40;
export const STRIP_CX = 209;
export const GHOST_W = 81;
export const GHOST_H = 36;
export const PILL_GAP = 16;
/** Slots either side of centre. Figma draws two; three guarantees the row
 *  stays covered mid-slide and the spares are off-card either way. */
export const SLOT_REACH = 3;

export interface Tech {
  icon: string;
  label: string;
  /** Figma's pill width, used until the real one is measured on boot. */
  w: number;
}

/** Rotation order — the sequence each one reaches the hub in. */
export const techs: Tech[] = [
  { icon: "icons/aidata/agents", label: "AI Agents", w: 109 },
  { icon: "icons/aidata/vision", label: "Computer Vision", w: 162 },
  { icon: "icons/aidata/rag", label: "RAG", w: 69 },
  { icon: "icons/aidata/llm", label: "LLM", w: 69 },
  { icon: "icons/aidata/python", label: "Python", w: 90 },
];

/** Step and hold: an item slides into the hub, rests while its name is
 *  readable, then moves on. One lap is 5 x (hold + move) = 15s. */
const PACE = 1;
export const TIMING = {
  hold: 2.1 * PACE,
  move: 0.9 * PACE,
};
export const LAP = techs.length * (TIMING.hold + TIMING.move);

/** Where an item sits, and how big it is, at `deg` from the top. */
export function place(deg: number) {
  const t = (deg * Math.PI) / 180;
  return { x: CX + RX * Math.sin(t), y: CY - RY * Math.cos(t) };
}

/**
 * Hub falloff: 1 on top, 0 by the time an item reaches its neighbours, with a
 * flat derivative at both ends so the grow and shrink have no corner in them.
 */
export function hubness(deg: number): number {
  const span = STATIONS[HUB - 1];
  const a = Math.abs(deg);
  if (a >= span) return 0;
  return (1 + Math.cos((Math.PI * a) / span)) / 2;
}

export const badgeAt = (deg: number) => BADGE + (BADGE_HUB - BADGE) * hubness(deg);
export const glyphAt = (deg: number) => GLYPH + (GLYPH_HUB - GLYPH) * hubness(deg);

/** Slot x for a given offset from the centred active pill. Reproduces every
 *  Figma frame's pill positions exactly. */
export function slotX(offset: number, activeW: number): number {
  if (offset === 0) return STRIP_CX - activeW / 2;
  const k = Math.abs(offset);
  const outer = activeW / 2 + k * PILL_GAP + (k - 1) * GHOST_W;
  return offset > 0 ? STRIP_CX + outer : STRIP_CX - outer - GHOST_W;
}
