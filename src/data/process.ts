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
}

export const processSteps: ProcessStep[] = [
  {
    n: 1,
    icon: "icons/process/discover",
    title: "Discover",
    body: "Understand the business, users, and existing systems before any solution is proposed.",
    cx: 202, cy: 397,
    tx: 29, ty: 141, tw: 316,
  },
  {
    n: 2,
    icon: "icons/process/architect",
    title: "Architect",
    body: "Define product, AI, and technology architecture built for where the product needs to go.",
    cx: 650, cy: 100,
    tx: 468, ty: 258, tw: 316,
  },
  {
    n: 3,
    icon: "icons/process/build",
    title: "Build",
    body: "Integrate and launch into production environments with monitoring in place.",
    cx: 1180, cy: 233,
    tx: 1004, ty: 1, tw: 316,
  },
  {
    n: 4,
    icon: "icons/process/deploy",
    title: "Deploy",
    body: "Integrate and launch into production environments with monitoring in place.",
    cx: 1724, cy: 270,
    tx: 1640, ty: 327, tw: 316,
  },
  {
    n: 5,
    icon: "icons/process/scale",
    title: "Scale",
    body: "Optimize, automate, and continuously improve post-launch.",
    cx: 2297, cy: 272,
    tx: 2080, ty: 1, tw: 316,
  },
];

export const TRACK_W = 2482;
export const TRACK_H = 514;
export const VIEW_W = 1240;
