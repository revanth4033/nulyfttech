/**
 * Geometry for the "AI & Automation" orbit.
 *
 * All coordinates are in the card's own stage space: a 1240x1258 box pinned
 * 128px below the card's top edge, exactly as Figma lays it out. The card is
 * only 391px tall, so the stage is clipped at y = 263 and just the crown of
 * the circle is ever on screen.
 *
 * The three orbs in the Figma frame sit at (299.38, 209.68), (578.92, 115.32)
 * and (855.90, 169.54). Measured off the rendered frame, those fall on a
 * circle centred (620.15, 666.15) to within +/-4px, and 30.8 / 29.7 degrees
 * apart -- i.e. one evenly-spaced ring, not three hand-placed dots. That
 * radius (553.57) is also the centreline of the drawn ring, whose outer and
 * inner radii are 620 and 487.13.
 */

/** Stage box, and where it sits inside the card. */
export const STAGE_W = 1240;
export const STAGE_H = 1258;
export const STAGE_TOP = 128;
export const CARD_H = 391;

/** Centre of the drawn ring, and the radius of its centreline. */
export const CX = 620.15;
export const CY = 666.15;
export const R = 553.57;

/** Every orb is the same 60px disc -- the varying sizes in the Figma export
 *  are the axis-aligned bounding boxes of one 60x60 node at three rotations. */
export const ORB = 60;

/** The comet trail, offset from the orb's centre in the orb's own frame.
 *  Constant across all three Figma orbs to within 0.01px. */
export const TRAIL_W = 165.253;
export const TRAIL_H = 106.288;
export const TRAIL_X = 73.3;
export const TRAIL_Y = 12.81;

/** Label centre, also in the orb's frame: straight out along the radius.
 *  Capped in width so a long name stacks instead of running out along the
 *  tangent -- "Workflow Orchestration" set on one line is 245px, and near the
 *  edges of the arc that length projects almost vertically. */
export const LABEL_Y = -98;
export const LABEL_MAX_W = 160;

/**
 * The disc leaves the card at |theta| = 43.2; fade the whole orb out across
 * the next 12.3 degrees, so it dissolves as it sinks rather than being cut
 * off by the card edge.
 *
 * This is also what makes the wrap safe. An orb's trail and label hang out
 * to one side of it, and at the exit (-57.6) that side points back up into
 * the frame -- the trail by 50px, and a long label by more. Both are clear
 * of the clip on the entry side, so without the fade they would blink out of
 * the bottom-left corner on every lap. Fading to zero by 55.5 means there is
 * nothing left to see at the seam, whatever a label is named.
 */
export const FADE_FROM = 43.2;
export const FADE_TO = 55.5;

export function orbOpacity(deg: number): number {
  const t = (Math.abs(deg) - FADE_FROM) / (FADE_TO - FADE_FROM);
  return t <= 0 ? 1 : t >= 1 ? 0 : 1 - t;
}

/**
 * The card clips the stage at y = 263, which is |theta| = 43.2 degrees: an
 * 86.4 degree window onto the ring. Spacing the four orbs at a third of that
 * keeps exactly three on the visible arc while the fourth crosses the hidden
 * stretch below, and lands within 1.5 degrees of the 30 degree pitch Figma
 * drew. The train therefore wraps at +/-57.6 degrees, ~107px below the clip.
 */
export const SPACING = 28.8;
export const SPAN = SPACING * 4;

export interface Orb {
  icon: string;
  label: string;
  /** Glyph edge in px -- the robot exports on a 28.17 viewBox, the rest on 32. */
  glyph: number;
  /** Resting angle from the apex, degrees, positive clockwise. */
  base: number;
}

/** Ordered along the direction of travel: RPA leads, orchestration brings up
 *  the rear. The bases are spaced so the fourth rests at FADE_TO -- the
 *  resting frame is then the three orbs Figma draws, and nothing else. */
export const orbs: Orb[] = [
  { icon: "icons/tech/rpa", label: "RPA", glyph: 28.17, base: -30.9 },
  { icon: "icons/tech/n8n", label: "n8n", glyph: 32, base: -2.1 },
  { icon: "icons/tech/api", label: "API's", glyph: 32, base: 26.7 },
  { icon: "icons/tech/orchestration", label: "Workflow Orchestration", glyph: 32, base: 55.5 },
];

/** Where an orb sits, and how it banks, at `deg` from the apex. */
export function place(deg: number) {
  const t = (deg * Math.PI) / 180;
  return { x: CX + R * Math.sin(t), y: CY - R * Math.cos(t), rotation: deg };
}
