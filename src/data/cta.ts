/**
 * CTA card fan — three product screens stacked on a diagonal.
 *
 * Coordinates are the fan's own 662.945 x 333.954 box, which Figma centres at
 * calc(50% + 517.47px) inside the 1240-wide CTA, 59px down.
 *
 * The slots run up and to the right in an even diagonal: each is ~106px right
 * and ~43px higher than the last. (get_metadata reports the back slot at
 * y=45.38, which would make the fan a zigzag — that is wrong; the design
 * context has it at -40.22.)
 */
export const FAN_W = 662.945;
export const FAN_H = 333.954;
export const CARD_W = 450.236;
export const CARD_H = 288.576;

/** Front, middle, back. Paint order is the reverse. */
export const SLOTS = [
  { x: 0, y: 45.38 },
  { x: 106.34, y: 0 },
  { x: 213, y: -40.22 },
];

export interface Screen {
  /** Import key under src/assets/images/cta. */
  src: string;
  alt: string;
  /** Each raster is pre-cropped slightly differently by Figma. */
  crop: { w: number; h: number; x: number; y: number };
}

export const screens: Screen[] = [
  {
    src: "screen-1",
    alt: "nuLyftTrack requirement view with hiring pipeline and requisition detail",
    crop: { w: 125.98, h: 135.92, x: -11.65, y: -17.94 },
  },
  {
    src: "screen-2",
    alt: "nuLyftTrack candidate list for a UI/UX designer requisition",
    crop: { w: 125.59, h: 135.92, x: -11.77, y: -18.43 },
  },
  {
    src: "screen-3",
    alt: "nuLyftTrack SLA and exception monitoring dashboard",
    crop: { w: 125.98, h: 135.26, x: -11.5, y: -17.85 },
  },
];

/**
 * Step and hold. The front card retires to the back, arcing up over the other
 * two, and they each step forward a slot. ~11.4s a lap — slow enough that it
 * reads as ambient beside the button rather than competing with it.
 */
const PACE = 1;
export const TIMING = {
  hold: 2.9 * PACE,
  move: 0.9 * PACE,
};
export const LAP = SLOTS.length * (TIMING.hold + TIMING.move);

/**
 * Apex of the retiring card's hop. This has to clear the *destination*, not
 * the chord: the back slot is already at y=-40.22, so anything less negative
 * than that produces a straight climb with no arc at all. -85 puts the apex
 * ~45px above the back card, which reads as going over the stack.
 */
export const ARC_PEAK = -85;
/** And a touch of lift toward the viewer at the top of the arc. */
export const ARC_SCALE = 1.04;
