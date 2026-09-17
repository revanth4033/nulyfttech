/**
 * Our Process — Figma 449:903.
 *
 * All coordinates are in the track's own space: 2482 x 514, which scrolls
 * horizontally inside a 1240-wide viewport (so 1242px of travel).
 */
export interface ProcessStep {
  n: number;
  icon: string;
  title: string;
  body: string;
  /** Chip centre on the curve. */
  cx: number;
  cy: number;
  /** Text block top-left. */
  tx: number;
  ty: number;
  /** Text column width; the big numeral sits to its right. */
  tw: number;
  /** Mobile (Figma 536:13470): step box top-left, and the chip centre. */
  mx: number;
  my: number;
  mcx: number;
  mcy: number;
}

export const processSteps: ProcessStep[] = [
  {
    n: 1,
    icon: "icons/process/discover",
    title: "Discover",
    body: "Understand the business, users, and existing systems before any solution is proposed.",
    cx: 202, cy: 397,
    tx: 29, ty: 141, tw: 316,
    mx: 0, my: 57,
    mcx: 339, mcy: 187,
  },
  {
    n: 2,
    icon: "icons/process/architect",
    title: "Architect",
    body: "Define product, AI, and technology architecture built for where the product needs to go.",
    cx: 650, cy: 100,
    tx: 468, ty: 258, tw: 316,
    mx: 45, my: 333,
    mcx: 22, mcy: 469,
  },
  {
    n: 3,
    icon: "icons/process/build",
    title: "Build",
    body: "Integrate and launch into production environments with monitoring in place.",
    cx: 1180, cy: 233,
    tx: 1004, ty: 1, tw: 316,
    mx: 0, my: 613,
    mcx: 339, mcy: 731,
  },
  {
    n: 4,
    icon: "icons/process/deploy",
    title: "Deploy",
    body: "Integrate and launch into production environments with monitoring in place.",
    cx: 1724, cy: 270,
    tx: 1640, ty: 327, tw: 316,
    mx: 45, my: 921,
    mcx: 22, mcy: 1042,
  },
  {
    n: 5,
    icon: "icons/process/scale",
    title: "Scale",
    body: "Optimize, automate, and continuously improve post-launch.",
    cx: 2297, cy: 272,
    tx: 2080, ty: 1, tw: 316,
    mx: 0, my: 1238,
    mcx: 339, mcy: 1363,
  },
];

export const TRACK_W = 2482;
export const TRACK_H = 514;
export const VIEW_W = 1240;

/* --------------------------------------------------------------------------
   Mobile — Figma 536:13470

   A different structure, not a squeezed one: the pinned horizontal track
   becomes a serpentine vertical timeline, 361 wide by 1512.49 tall, with the
   five steps alternating left and right and a chip on the curve at each turn.

   Coordinates are the frame's, measured against the body frame at (16, 211).
   The curve's placement was taken off the render rather than the metadata,
   which reports a bounding box for the vector that is not its box.
   -------------------------------------------------------------------------- */
export const M_TRACK_W = 361;
export const M_TRACK_H = 1512.49;
export const M_STEP_W = 316;

/** The curve's own box inside the track. Figma stretches it ~2% wide. */
export const M_CURVE = { x: 15, y: 56, w: 331, h: 1457.56, vbW: 324.537, vbH: 1457.56 };

export const M_CURVE_D =
  "M176.952 1447.79C93.066 1479.66 3.23748 1417.69 3.23748 1327.96V1296.82C3.23748 1241.88 47.7794 1197.34 102.725 1197.34H188.335C262.218 1197.34 322.112 1137.44 322.113 1063.56C322.114 989.675 262.219 929.78 188.335 929.78H147.991C69.288 929.78 4.60974 867.67 1.42285 789.031C-1.95195 705.755 64.6473 636.402 147.991 636.402H177.373C257.932 636.402 323.237 571.096 323.237 490.537C323.237 409.979 257.932 344.673 177.373 344.673H163.801C75.7461 344.673 4.36381 273.29 4.36381 185.236V167.674C4.36381 75.7881 78.8518 1.3 170.737 1.3";
