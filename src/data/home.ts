/**
 * The redesigned home page — Figma 664:2977 ("Home"), 1440 x 4881.
 *
 * Copy and geometry for its five sections; the CTA + footer is the shared
 * `CtaFooter`. Coordinates are the frame's own, read off `get_design_context`.
 */

/* --- Hero (664:2978) ------------------------------------------------------ */

import type { ImageMetadata } from "astro";
import heroDesign from "../assets/images/home/hero-photo.jpg";
// Pexels 3861972 and 34804018 — free for commercial use, no attribution
// required (pexels.com/license). The AI slide first used a robot-arm photo
// (3913031); the user rejected it — nuLyft builds AI features into software,
// not robots — so it shows an AI assistant menu inside a code editor.
import heroEngineering from "../assets/images/home/hero-engineering.jpg";
import heroAi from "../assets/images/home/hero-ai.jpg";

/**
 * Three slides, one per capability. They advance on their own every 3s and
 * the dots jump to one. Slide 1 is the Figma frame; slides 2 and 3 come from
 * the user's "Hero - product engineering" / "Hero - ai & automation" mocks,
 * with Pexels photos the user chose.
 */
export interface HeroSlide {
  id: string;
  title: { lead: string; em: string };
  body: string;
  cta: { label: string; href: string };
  photo: ImageMetadata;
  photoAlt: string;
  /** `object-position` for the cover crop; centred unless set. */
  photoPosition?: string;
}

export const heroSlides: HeroSlide[] = [
  {
    id: "product-design",
    title: { lead: "Design that makes products ", em: "work better" },
    body: "We look at how people use your product, where they get stuck, and what can be improved to make the experience better.",
    cta: { label: "Our design approach", href: "/product-design" },
    photo: heroDesign,
    photoAlt: "A designer sketching wireframes on paper at a desk beside a keyboard",
  },
  {
    id: "product-engineering",
    title: { lead: "From idea to ", em: "finished product" },
    body: "We build web applications, mobile apps, and software products around what your business needs, turning ideas and requirements into products people can actually use.",
    // As written in the mock ("Build", not "Built") — flagged to the user.
    cta: { label: "Products we\u2019ve built", href: "/product-engineering" },
    photo: heroEngineering,
    photoAlt: "A developer's desk from above: a laptop and two monitors showing code, a hand on the keyboard",
  },
  {
    id: "ai-automation",
    title: { lead: "Improve the way your ", em: "business operates" },
    body: "We build AI-powered automation solutions that connect business processes, reduce manual work, and help teams manage their operations more efficiently.",
    cta: { label: "Discover our capabilities", href: "/ai-automation" },
    photo: heroAi,
    photoAlt: "An AI assistant menu in a code editor offering Explain Code, Suggest Refactoring, Find Problems and Generate Code",
    // A touch above centre so the menu's first row, "Explain Code", is in.
    photoPosition: "50% 30%",
  },
];

/**
 * The four blurred light shafts behind the hero. Each is a rounded bar laid
 * out in a box (`x`/`y`/`w`/`h`, the frame's own coordinates) and turned
 * inside it; the two on the right are the left pair mirrored.
 */
export const shafts = [
  { x: 1110.19, y: -50.22, w: 338.996, h: 501.496, barW: 72, rotate: -149.18, flip: true },
  { x: -87, y: -70, w: 338.996, h: 501.496, barW: 72, rotate: -30.82, flip: false },
  { x: -17, y: -160.78, w: 320.183, h: 490.273, barW: 50.094, rotate: -30.82, flip: false },
  { x: 1059, y: -141, w: 320.183, h: 490.273, barW: 50.094, rotate: -149.18, flip: true },
];

/* --- A little about nuLyft ------------------------------------------------- */

/**
 * The home page's one-section answer to "what is nuLyft". Figma's version
 * (664:3024, three idea / challenge / direction cards) was replaced at the
 * user's request, and so was a first rebuild that set the About page's two
 * sections side by side — the brief is the About page's *idea* in one simple
 * section, not its layout. The words are the About page's own (its hero and
 * its partner pitch), condensed:
 *
 *   every business reaches a point where it needs to move forward —
 *   a new idea, a challenge, a new direction — and nuLyft is the partner
 *   that helps it take that next step, starting from understanding.
 */
export const about = {
  eyebrow: "About nuLyft",
  title: {
    lead: "Every business reaches a point where it needs to move forward. ",
    em: "We help you take that next step.",
  },
  lede: "More than a project, a technology partner. We work closely with our clients to understand what they need, explore the options, and develop solutions that fit their business.",
  cta: { label: "Get to know us", href: "/about" },
  /** The three starting points the About page draws, leading to the mark. */
  starts: ["A new idea to explore", "A challenge to overcome", "A new direction to take"],
  goal: "The next step",
};

/* --- Great products don't happen by accident (664:3065) ------------------- */

export const craft = {
  title: "Great products don't happen by accident",
  services: [
    {
      icon: "icons/home/start",
      title: "Make complexity feel simple",
      body: "We design products around how people think and work, making complex tasks easier to understand and use.",
    },
    {
      icon: "icons/home/workflow",
      title: "Turn ideas into products that perform",
      body: "We build web applications, mobile apps, and software systems that meet business needs and work reliably as they grow.",
    },
    {
      icon: "icons/home/devops-control",
      title: "Make products and processes work smarter",
      body: "We use AI, data, and automation to reduce manual work, improve workflows, and help businesses make better decisions.",
    },
  ],
  belief: {
    title: "Technology matters when it makes a real difference",
    body: "We bring together people, business needs, and technology to create solutions that work in the real world.",
    points: ["Grounded in people", "Driven by purpose", "Built for progress"],
  },
  photo: {
    alt: "Two colleagues smiling at a laptop together at a shared table",
    eyebrow: "From complexity to clarity",
    title: "Make better things possible",
    cta: { label: "Let’s build together", href: "/contact" },
  },
};

/* --- Why businesses choose nuLyft (664:3136) ------------------------------ */

export const why = {
  // The uppercase pill hid the casing; the index shows it, so the brand
  // is spelt as it is everywhere else.
  eyebrow: "Why businesses choose nuLyft",
  title: "More than a technology partner. A partner invested in the outcome",
  body: "We look beyond the brief to understand the business, make informed decisions, and drive meaningful change.",
};

/** The diagram's own 1240 x 635.169 box. */
export const WHY_STAGE = { w: 1240, h: 635.169 };

/**
 * Four cards wired to the brand mark on the platform. `side` is which way the
 * card's ring fades: Figma strokes each with a horizontal gradient that runs
 * out to nothing on the side facing away from the mark.
 */
export const whyCards = [
  {
    title: "Business needs come first",
    body: "We understand your objectives, challenges before recommending right approach.",
    // Figma sets this body 330 wide in a 324 column; it overhangs the padding.
    x: 0, y: 219, w: 364, bodyW: 330, side: "left",
  },
  {
    title: "Clear thinking, better decisions",
    body: "We identify the right problems to solve and the most practical way forward.",
    x: 101, y: 61, w: 364, side: "left",
  },
  {
    title: "Quality at every stage",
    body: "We focus on usability, performance, and reliability to deliver solutions businesses can depend on.",
    x: 749, y: 0, w: 418, side: "right",
  },
  {
    title: "Solutions built for growth",
    body: "We build with future needs in mind, creating solutions that can evolve as your business grows.",
    x: 858, y: 166, w: 382, side: "right",
  },
] as const;

/**
 * Connector exports, placed by their SVG box. Each export carries its 2px
 * stroke's half-width outside the node, so these are the node coordinates
 * less that bleed (the `inset-[-0.42%_…]` in the design context).
 */
export const whyLinks = [
  { name: "c-recognition", x: 364, y: 279, w: 136, h: 195 },
  { name: "c-smooth", x: 465, y: 120.86, w: 107.688, h: 278.792 },
  { name: "c-onboarding", x: 643.155, y: 60.47, w: 105.675, h: 335.156 },
  { name: "c-insights", x: 710, y: 236, w: 148, h: 238 },
];

export const whyPlatform = { x: 305.97, y: 361.4, w: 609.935, h: 273.766 };
export const whyMark = { x: 569, y: 388, size: 80 };

/* --- Shaping what businesses can do with technology (664:3173) ----------- */

export const shaping = {
  title: "Shaping what businesses can do with technology",
  body: "The right solutions can change how a business operates, how people experience its products, and what it can achieve. We bring business understanding and technology together to turn those opportunities into reality.",
  cta: { label: "Explore our work", href: "/studio" },
  core: { lead: "Possibility into", title: "progress" },
  steps: [
    {
      icon: "icons/home/scan",
      title: "Understand the challenge",
      body: "Identify real business needs and opportunities for improvement.",
      x: 0, y: 0, w: 377, align: "left",
    },
    {
      icon: "icons/home/stack",
      title: "Bring ideas together",
      body: "Connect design, engineering, and intelligence with purpose.",
      x: 92, y: 144, w: 354, align: "right",
    },
    {
      icon: "icons/home/growth",
      title: "Create meaningful progress",
      body: "Turn opportunities into practical solutions that move businesses forward",
      x: 0, y: 288, w: 377, align: "left",
    },
  ],
};

/**
 * The orbit around the "Progress" disc, in its 291 x 295 box: one full ring,
 * an inner ring, an open arc, and ten dots in three tints.
 */
export const orbitDots = [
  { x: 144, y: 31, s: 4, c: "#ba9bfd" },
  { x: 245, y: 196, s: 6, c: "#834dfb" },
  { x: 48, y: 208, s: 4, c: "#ba9bfd" },
  { x: 144, y: 291, s: 4, c: "#e3d7fe" },
  { x: 144, y: 0, s: 4, c: "#e3d7fe" },
  { x: 229, y: 69, s: 4, c: "#834dfb" },
  { x: 22, y: 60, s: 8, c: "#834dfb" },
  { x: 36, y: 243, s: 4, c: "#834dfb" },
  { x: 57, y: 262, s: 2, c: "#834dfb" },
];
