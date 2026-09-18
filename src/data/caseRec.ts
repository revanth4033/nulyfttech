import type { ImageMetadata } from "astro";

import heroCard from "../assets/images/case-rec/hero-card.png";
import overviewReq from "../assets/images/case-rec/overview-req.png";
import overviewCand from "../assets/images/case-rec/overview-cand.png";
import problemPhotos from "../assets/images/case-rec/problem-photos.png";
import approachP02 from "../assets/images/case-rec/approach-p02.png";
import approachP03 from "../assets/images/case-rec/approach-p03.png";
import typographyFigure from "../assets/images/case-rec/typography.png";
import typographyFigureA from "../assets/images/case-rec/typography-m1.png";
import typographyFigureB from "../assets/images/case-rec/typography-m2.png";
import screen1 from "../assets/images/case-rec/screen-1.png";
import screenJd from "../assets/images/case-rec/screen-jd.png";
import screenReq from "../assets/images/case-rec/screen-req.png";
import screen4 from "../assets/images/case-rec/screen-4.png";
import screen5 from "../assets/images/case-rec/screen-5.png";

/**
 * AI Powered Recruitment Platform case study — Figma 514:6633.
 *
 * Built on the same template as the LMS case study (505:4185): the two frames
 * are section-for-section identical, and seven of the eight sections are the
 * same height to the pixel. Only UI Screens differs — 3475 here against the
 * LMS's 3632 — because this one's blocks are shorter. So the components are
 * the LMS ones duplicated and re-pointed at this data, with the handful of
 * geometry differences noted where they occur.
 *
 * Copy is reproduced as drawn. Two things in the frame are stray pastes from
 * the LMS page and are flagged rather than silently rewritten: the Challenge
 * title still reads "Learning was happening everywhere", and the eyebrow on
 * the approach section is spelled "our approch".
 */

export const hero = {
  eyebrow: "AI powered recruitment platform - Case Study",
  /** Roman lead, then an italic tail. */
  title: "Every Requirement. Every Candidate. ",
  titleTail: "One Hiring Engine.",
  body: "From client requirements to final hiring decisions, every step moves through one intelligent system. Built to keep hiring faster, clearer, and connected.",
  /**
   * Figma parks two overlapping cards here and draws five carousel dots, the
   * same way the LMS frame did. That page ships one static card with no dots
   * at the user's request, and this one follows it — the front card only.
   */
  media: { src: heroCard, w: 568.5, alt: "The recruitment platform requirements dashboard in a browser" },
};

export const overview = {
  eyebrow: "About The Project",
  title: "Making Recruitment Easier to Manage, From Start to Finish",
  body: "A recruitment platform built to help teams handle client requirements, manage candidates, track hiring progress, and stay on top of everything through reports and dashboards all in one place.",
  modules: ["Requirements Module", "Candidates Module", "Reports Module", "Dashboard Mobile"],
  facts: [
    { label: "Technology", value: "HR Recruitment" },
    { label: "Scope", value: "Web & Mobile" },
    { label: "Business Type", value: "B2B" },
  ],
  /** Same two-card stack as the LMS overview — identical 634x523 box, the
      back card 500x307 turned 7 degrees, so the swap animation carries over. */
  screens: [
    { src: overviewReq, alt: "The requirements list screen" },
    { src: overviewCand, alt: "The candidate pipeline screen" },
  ],
  stage: { w: 634, h: 523, card: { w: 500, h: 307 } },
  slots: [
    { cx: 311.8435, cy: 243.7577, rotate: -7 },
    { cx: 383.859375, cy: 369.8232421875, rotate: 0 },
  ],
};

export const challenge = {
  eyebrow: "The Challenge",
  /** Figma's own text, a stray paste from the LMS frame. Flagged, not fixed. */
  title: "Learning was happening everywhere - except in one connected place.",
  body: "Managing client requirements, candidates, follow-ups, and hiring progress across different workflows made it harder for teams to stay aligned and keep track of what was happening.",
  points: [
    "Scattered Excel Tracking",
    "Manual Candidate Updates",
    "Manual Follow-ups",
    "Limited Hiring Visibility",
  ],
  /** All three photos in one 651x461 export, no bleed. */
  photos: { src: problemPhotos, alt: "Recruiters tracking candidates across spreadsheets and email" },
};

export interface Phase {
  title: string;
  items: { title: string; body: string }[];
  media?: { src: ImageMetadata; alt: string };
  mediaSide?: "left" | "right";
}

export const approach = {
  eyebrow: "our approch",
  title: "From Chaos to Intelligent Automation",
  body: "We tackled this project by diving deep into the day-to-day friction of recruiters, hiring managers, and clients transforming scattered workflows into a single, cohesive experience.",
  phases: [
    {
      title: "Phase 01 - Discover & Uncover",
      items: [
        {
          title: "Map Recruitment Bottlenecks",
          body: "Uncovered pipeline friction to eliminate communication gaps and drop-offs.",
        },
        {
          title: "Decode User & Client Needs",
          body: "Synthesized client intake, candidate submissions, and reporting needs.",
        },
        {
          title: "Frame the Architecture",
          body: "Mapped core journeys for requirement tracking, sourcing, and analytics.",
        },
      ],
    },
    {
      title: "Phase 02 - Wireframe & Systemize",
      items: [
        {
          title: "Blueprint the Core Flows",
          body: "Wireframed master data hubs, global candidate screens, and funnels.",
        },
        {
          title: "Build a Scalable Design System",
          body: "Created modular UI components and data visualization patterns.",
        },
        {
          title: "Integrate Smart AI Interactions",
          body: "Designed seamless patterns for automated JD matching and scoring.",
        },
      ],
      media: { src: approachP02, alt: "The candidate scoring screen" },
      /** node 568.4x406.6, export 690.5x527.5 — 61.05/60.45 of shadow. */
      mediaSide: "left",
    },
    {
      title: "Phase 03 - Build, Test & Refine",
      items: [
        {
          title: "Craft High-Fidelity Experience",
          body: "Designed polished UI screens covering the full recruitment lifecycle.",
        },
        {
          title: "Test & Validate With Users",
          body: "Tested bulk actions and filtering to streamline recruiter workflows.",
        },
        {
          title: "Deliver a Launch-Ready Platform",
          body: "Finalized a scalable recruitment ecosystem ready for deployment.",
        },
      ],
      media: { src: approachP03, alt: "The requirements management screen" },
      mediaSide: "right",
    },
  ] satisfies Phase[],
};

/**
 * Specimen, the requirements grid card and all three leader labels ship as one
 * flattened export, not rebuilt DOM.
 *
 * The LMS page draws its leaders as inline SVG at hand-measured coordinates.
 * That does not transfer: this frame puts its card at (656, 129) against the
 * LMS's (632, 111) and its callouts somewhere else again, so every path would
 * have to be re-derived. Exporting the figure whole keeps the geometry exact.
 *
 * Taken from the *container* (514:7010), not the body (514:7019) — the
 * "Heading - Medium" callout is a sibling of the body, so a body export drops
 * it. The header band is cropped back off, leaving exactly the 1240x543 box.
 */
export const typography = {
  eyebrow: "Typography",
  title: "A Type System Built for Speed & Precision",
  body: "Roboto provides a flexible foundation for the platform, supporting a consistent hierarchy across candidate profiles, dashboards, analytics, navigation, and system messages.",
  figure: {
    src: typographyFigure,
    w: 1240,
    alt: "Roboto specimen in Light, Regular, Medium, Semibold and Bold, beside the requirements grid labelling its heading and body text styles",
  },
  /**
   * The same figure as two panels, for phones.
   *
   * It is one flattened 1240-wide export, so on a phone it can only shrink —
   * at 339 it lands at 0.27x and the card's labels go sub-pixel. The export
   * has exactly one clean vertical gap in it (device x 980-1096), so the two
   * halves crop apart without cutting any artwork, and stacking them roughly
   * doubles the scale. Cropped by hand from the same source; regenerate both
   * if `typography.png` is ever re-exported.
   */
  split: [
    {
      src: typographyFigureA,
      w: 496,
      alt: "Roboto specimen in Light, Regular, Medium, Semibold and Bold",
    },
    {
      src: typographyFigureB,
      w: 698,
      alt: "A requirements card with leaders labelling its heading and body text styles",
    },
  ],
};

/** Exported whole: the figure, its four leader lines and their labels. */
export const palette = {
  eyebrow: "Colorography",
  title: "A Color System Built for Focus & Clarity",
  body: "Provides a cohesive foundation using functional accents and neutral tones to ensure clear hierarchy across dashboards, statuses, and workflows.",
  /**
   * Inlined as SVG, not a flattened export — the draw-in and the hover both
   * need the leaders and labels to be addressable. Tagged on the way in with
   * `pal__group` / `pal__leader` / `pal__label`, `data-hex`, and `--pal-line`.
   *
   * 858x410 at (191, 148) in the 1240 container.
   */
  art: {
    name: "illustrations/rec-palette",
    w: 858,
    x: 191,
    alt: "The recruitment palette: primary #DD185A, primary dark #B0184B, text #1F2024 and background #F7F7F7",
  },
};

export interface Screen {
  src: ImageMetadata;
  alt: string;
  title?: string;
  body?: string;
  layout: "full" | "left" | "right";
  /** The Figma node's box, which is what the layout must reserve. */
  node: { w: number; h: number };
  /** The export's box. Larger than the node by its baked shadow, which must
      overflow rather than push the block taller — Figma's frames do not grow
      for a shadow, and letting ours do it made this section 300px tall. */
  exp: { w: number; h: number };
}

export const screens = {
  eyebrow: "UI Screens",
  title: "An Intuitive Interface Built for Seamless Hiring",
  body: "Presents an end-to-end visual experience designed to streamline candidate tracking, simplify complex requirements, and deliver actionable hiring insights.",
  blocks: [
    { src: screen1, alt: "The recruitment dashboard on desktop and mobile", layout: "full", node: { w: 1240, h: 700 }, exp: { w: 1354, h: 865 } },
    {
      src: screenJd,
      alt: "The JD Search and candidate ranking screen",
      title: "JD Search & Candidates Ranking",
      body: "JD Search automatically matches client job descriptions against your database to score and rank candidates instantly. It cuts out manual resume screening, letting recruiters spot and prioritize top talent in seconds.",
      layout: "left",
      node: { w: 608, h: 394 },
      exp: { w: 730, h: 516 },
    },
    {
      src: screenReq,
      alt: "The requirements management screen",
      title: "Requirements Management",
      body: "The Requirements hub lets teams easily post new roles, track open positions, & manage candidate pipelines. It gives recruiters a clean view to monitor hiring progress & instantly jump into candidate details for any active role.",
      layout: "right",
      node: { w: 608, h: 394 },
      exp: { w: 730, h: 516 },
    },
    { src: screen4, alt: "Two further recruitment platform screens", layout: "full", node: { w: 1240, h: 765 }, exp: { w: 1347, h: 896 } },
    { src: screen5, alt: "The reports and analytics screens", layout: "full", node: { w: 1240, h: 394 }, exp: { w: 1362, h: 516 } },
  ] satisfies Screen[],
};
