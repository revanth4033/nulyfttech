/**
 * Cloud & Infrastructure card — a provisioning checklist with a scrubber.
 *
 * A progress bar sweeps left to right; as its handle crosses each quarter,
 * that row slides in from the left and stays. The four Figma frames are
 * cumulative states, like Engineering, not a rotation.
 *
 * Coordinates are card space: Figma lays the whole card out as one 355x447
 * flex column at (24, 24) — header 80, gap 32, bar 20, gap 32, rows 283.
 */
export const CARD_W = 403;
export const CARD_H = 495;
export const BODY_X = 24;

/** Top of the bar and of the rows block, resolved from that column. */
export const BAR_Y = 136;
export const ROWS_Y = 188;

export const BAR_W = 355;
export const BAR_H = 20;
/** Track inset from the bar's outer edge: 1px border + 3px. */
export const TRACK_X = 4;
export const TRACK_Y = 4;
export const TRACK_W = 347;
export const TRACK_H = 12;

/** The rows block is 360 wide inside a 355 column, so it bleeds 2.5px a side. */
export const ROWS_W = 360;
export const ROWS_H = 283;
export const ROW_H = 50;
export const INDENT = 64;
export const TILE = 50;
export const TILE_INNER = 47.048;
export const GLYPH = 28;

export interface Stage {
  icon: string;
  label: string;
  /** Rows alternate flush-left and indented, giving the list a stepped read. */
  indent: boolean;
}

export const stages: Stage[] = [
  { icon: "icons/cloud/aws", label: "Amazon AWS", indent: false },
  { icon: "icons/cloud/azure", label: "Microsoft Azure", indent: true },
  { icon: "icons/cloud/docker", label: "Docker Containers", indent: false },
  { icon: "icons/cloud/kubernetes", label: "Kubernetes", indent: true },
];

/**
 * Fill after stage `i`, in px of the track.
 *
 * Figma's own widths are 91.5 / 183 / 274.5 / 347 — the first three are
 * multiples of 91.5 (366/4) while the track is only 347, so its last step is
 * 72.5 against 91.5 for the rest. Under even timing the handle would visibly
 * drag on the final hop, so these are true quarters instead; the largest
 * departure from the frames is 14px, at stage 3.
 */
export const fillAt = (i: number) => (TRACK_W * (i + 1)) / stages.length;

/** How far a row travels in, matching the handle's direction. Far enough to
 *  read as arriving from the left, short enough not to get repetitive. */
export const SLIDE = 40;

/**
 * Step and hold, then a straight fade back to the start.
 *
 * An earlier pass had the handle rewind — running it back to zero while the
 * rows cleared under it. It read as an undo rather than a restart, so the
 * reset now carries no lateral motion at all: everything fades out together,
 * the bar is zeroed while nothing is on screen, and the handle fades back in
 * at the start line. Nothing ever travels right to left. ~10.3s a lap.
 */
const PACE = 1;
export const TIMING = {
  move: 0.8 * PACE,
  hold: 1.4 * PACE,
  reveal: 0.5 * PACE,
  /** Extra beat on the completed bar before it clears. */
  settle: 0.6 * PACE,
  /** Fill, handle and rows all fade out together. */
  clear: 0.45 * PACE,
  /** Empty beat with the bar blank. */
  gap: 0.1 * PACE,
  /** Handle fades back in at zero, ready to set off again. */
  arm: 0.35 * PACE,
};
export const LAP =
  stages.length * (TIMING.move + TIMING.hold) +
  TIMING.settle +
  TIMING.clear +
  TIMING.gap +
  TIMING.arm;
