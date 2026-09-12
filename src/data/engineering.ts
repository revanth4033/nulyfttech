/**
 * Engineering card — the build pipeline.
 *
 * Coordinates are the panel's own space: the 355x341 body frame Figma places
 * at (24, 128) inside the 403x493 card. A spine runs down the centre with
 * five nodes on it, and each node's chip hangs off one side, alternating.
 *
 * The five Figma frames are cumulative states, not five separate moments:
 * frame 1 has Figma lit, frame 2 has Figma *and* React, frame 5 has all five.
 */
export const BODY_W = 355;
export const BODY_H = 341;
export const PANEL_W = 370;

/** Spine centre. Figma puts it at calc(50% + 0.53px) of the 355 body. */
export const SPINE_X = 178;

/**
 * Every chip sits exactly 25px clear of the spine centre on its own side:
 * the node's 7px half, a 16px gap, and the 2px ring the active state adds.
 * Holding that constant is what stops the chip twitching as it lights — in
 * the Figma frames the whole row shifts 1-3px, because there the ring is
 * padding. Here it is an outset box-shadow, so nothing reflows.
 */
export const CHIP_GAP = 25;

export interface Stage {
  icon: string;
  label: string;
  /** Which side of the spine the chip hangs on. */
  side: "left" | "right";
  /** Node centre, measured down the spine. */
  y: number;
  /**
   * How far the lit spine reaches once this stage is up. Frames 1-4 stop the
   * fill at the active node (47/50, 96/109, 170/171, 228/229 — the designer's
   * stops, against the node centres). Frame 5 drops the dim stop entirely and
   * lights the whole line, so the last stage runs the fill off the bottom.
   */
  fill: number;
}

export const stages: Stage[] = [
  { icon: "icons/eng/figma", label: "Figma", side: "left", y: 50, fill: 50 },
  { icon: "icons/eng/react", label: "React.js", side: "right", y: 109, fill: 109 },
  { icon: "icons/eng/nodejs", label: "Node.js", side: "left", y: 171, fill: 171 },
  { icon: "icons/eng/database", label: "My SQL", side: "right", y: 229, fill: 229 },
  { icon: "icons/eng/cloud", label: "AWS", side: "left", y: 288, fill: BODY_H },
];

/**
 * One lap: the stages light top to bottom, hold complete, then un-light in
 * the same top-to-bottom order so a wave passes through rather than the
 * pipeline appearing to undo itself.
 *
 * `PACE` scales every beat together, so the rhythm between them is preserved
 * and there is one number to turn. 1 is the original 6.4s lap.
 */
const PACE = 1.45;

export const TIMING = {
  /** Gap between one stage lighting and the next starting. */
  step: 0.5 * PACE,
  /** How long a single stage takes to light. */
  on: 0.45 * PACE,
  /** Beat on the completed pipeline before the wave moves off. */
  hold: 1.55 * PACE,
  /** The out-wave runs a little tighter than the in-wave. */
  outStep: 0.38 * PACE,
  off: 0.4 * PACE,
  /** Empty beat before the next lap. */
  tail: 0.5 * PACE,
};

/** Length of one lap, for reference: ~9.3s at PACE 1.45. */
export const LAP =
  4 * TIMING.step + TIMING.on + TIMING.hold + 4 * TIMING.outStep + TIMING.off + TIMING.tail;

/**
 * The stage that is lit before the timeline takes over. Figma's own
 * Technology frame draws this card in state 1, so that is what no-JS and
 * reduced-motion should show. The loop resets to empty on boot, but the card
 * sits far below the fold so that never lands on screen.
 */
export const RESTING = 0;

/** Node centres the spine's lit segment steps through on the way out. The
 *  last one matches `fill` so the segment empties instead of leaving a stub
 *  below the final node. */
export const outFill = [50, 109, 171, 229, BODY_H];
