/**
 * About Us — Figma 669:3594, 1440 x 2843.
 *
 * A centred hero, a "next step" diagram (three starting points converging on
 * the nuLyft mark), a photo beside a partner pitch with three cards, then the
 * shared CTA + footer with this page's own copy.
 */

export const hero = {
  eyebrow: "About nuLyft",
  // Figma sets a straight apostrophe here.
  title: { lead: "A new lift for ", em: "what's next" },
  body: [
    "Every business reaches a point where it needs to move forward a new idea to explore, a challenge to overcome, or a new direction to take.",
    "NuLyft exists to help businesses take that next step.",
  ],
};

/* --- The next step (669:3634) --------------------------------------------- */

/** The diagram's own 1240 x 504 box; coordinates below are inside it. */
export const PATHS_STAGE = { w: 1240, h: 504 };

export const starts = [
  {
    title: "A new idea to explore",
    body: "Turn possibilities into something worth pursuing.",
    x: 64, y: 0,
  },
  {
    title: "A challenge to overcome",
    body: "Find better ways through what’s holding you back.",
    x: 0, y: 208,
  },
  {
    title: "A new direction to take",
    body: "Bring clarity to where the business needs to go next.",
    x: 64, y: 416,
  },
];

/**
 * The two curved branches are one export, the lower one flipped. Each export
 * carries 0.6px of stroke above its node, hence the fractional tops.
 */
export const branches = [
  { x: 414, y: 44.4, flip: false },
  { x: 414, y: 249.4, flip: true },
];
export const trunk = { x: 350, y: 248.4 };

/**
 * The three lines as routes for the travelling dots, in the stage's own
 * coordinates, top to bottom. Each is the export's own path data placed at
 * its export box; the lower branch is the same curve mirrored in its
 * 204.2-high box. All three end at x=1045, under the mark.
 */
const BRANCH_D =
  "M0 0.6H74.0072C149.071 0.6 219.493 36.9302 263 98.1C317.42 164.859 398.982 203.6 485.111 203.6H631";
export const BRANCH_H = 204.2;

export const routes = [
  { d: BRANCH_D, x: 414, y: 44.4, flip: false },
  { d: "M0 0.6H695.012", x: 350, y: 248.4, flip: false },
  { d: BRANCH_D, x: 414, y: 249.4, flip: true },
];

/** Where Figma parks a dot on each line — the resting state, top to bottom. */
export const pathDots = [
  { x: 700, y: 167 },
  { x: 559, y: 245 },
  { x: 455, y: 449 },
];

export const nextStep = { label: "The Next Step", markX: 1026, markY: 228, labelX: 1106, labelY: 236 };

/* --- More than a project (669:3672) ---------------------------------------- */

export const partner = {
  photo: {
    alt: "Three colleagues reviewing printed charts together at a meeting table",
    caption: "Better work begins with understanding",
  },
  title: "More than a project. A technology partner",
  body: [
    "Every business has different goals and challenges. Understanding them is what helps us find the right way forward.",
    "We work closely with our clients to understand what they need, explore the options, and develop solutions that fit their business.",
  ],
  cta: { label: "Get To Know nuLyft", href: "/contact" },
  cards: [
    {
      tag: "Business understanding",
      title: "Start with the real need",
      // "Look" is capitalised in the frame; reproduced as drawn.
      body: "We Look beyond the brief to understand what the business actually needs.",
    },
    {
      tag: "Thoughtful decisions",
      title: "Find the right way forward",
      body: "Consider the following possibilities before settling on a solution.",
    },
    {
      tag: "Solutions with purpose",
      title: "Make it fit the business",
      body: "Develop solutions shaped around real goals, needs, and ways of working.",
    },
  ],
};

/* --- CTA (669:3778) -------------------------------------------------------- */

export const cta = {
  title: "Let’s start a conversation",
  body: "Have a business challenge, a product idea, or a technology initiative you’d like to discuss? We’d be glad to understand what you’re working toward.",
};
