import type { ImageMetadata } from "astro";
import type { ChallengeCard } from "../components/case/challenge-art";

import heroCard1 from "../assets/images/case-lms/hero-card-1.png";
import screenBooking from "../assets/images/case-lms/overview-screen-booking.png";
import screenLeads from "../assets/images/case-lms/overview-screen-leads.png";
import approachP02 from "../assets/images/case-lms/approach-p02.jpg";
import approachP03 from "../assets/images/case-lms/approach-p03.jpg";
import typoTable from "../assets/images/case-lms/typo-table.png";
import showcaseHero from "../assets/images/case-lms/showcase-hero.jpg";
import showcaseCourses from "../assets/images/case-lms/showcase-courses.jpg";
import showcaseEnrollments from "../assets/images/case-lms/showcase-enrollments.jpg";
import showcaseTablets from "../assets/images/case-lms/showcase-tablets.jpg";
import showcasePair from "../assets/images/case-lms/showcase-pair.jpg";

/**
 * LMS / Education SaaS case study — Figma 505:4185.
 *
 * The first case study page. Every section below the hero shares one header
 * shape: eyebrow + title on the left, a single intro paragraph on the right.
 *
 * The product screenshots ship as flattened exports rather than rebuilt DOM.
 * They are fixed compositions — tilted stacks, browser frames with shadows, a
 * phone overlaid on a desktop — that carry no interaction and no text of ours,
 * so re-deriving them in markup would add weight without adding anything.
 */

export const hero = {
  eyebrow: "LMS Platform (in home) - Case Study",
  /** Italic accent lead, then the roman remainder. */
  titleLead: "Skill Wagon",
  title: " - Redefining the Learning Experience",
  body: "Skill Wagon is a scalable SaaS-based learning platform that brings courses, learners, assessments, and insights together in one seamless experience making learning management simpler, smarter, and more connected.",
  /**
   * One card, not a carousel. Figma parks two overlapping slides here, but the
   * second is an Aster Data recruitment site — a placeholder on a Skill Wagon
   * case study — so the user had it removed along with the indicator dots.
   *
   * `w` is the display width that puts the export's *card* at its Figma size;
   * the export itself carries 6.5px of shadow bleed on top of that.
   */
  media: { src: heroCard1, w: 569, alt: "Skill Wagon course curriculum builder in a browser" },
};

export const overview = {
  eyebrow: "About The Project",
  title: "Where Learning Becomes Seamless, Scalable, and Smart",
  body: "Skill Wagon is a modern SaaS-based Learning Management System that unifies courses, learners, instructors, and assessments into one powerful platform. It removes complexity from learning operations and delivers a smooth, engaging experience for both administrators and learners.",
  modules: ["Student Module", "Mentor Module", "Admin Module", "Desktop + Mobile"],
  facts: [
    { label: "Client", value: "SKillwagon" },
    { label: "Technology", value: "EDTech" },
    { label: "Scope", value: "Web & Mobile" },
    { label: "Business Type", value: "B2B" },
  ],
  /**
   * The two screens of the About The Project stack, and the two slots they
   * trade places between — Figma 505:4396, a 634x523 box.
   *
   * Figma ships this as one flattened export with both screens baked in. That
   * is fine for a static figure and useless for a moving one, so the screens
   * are separate here and the composition is rebuilt in DOM.
   *
   * Both cards are the same 500x307. The metadata only gives axis-aligned
   * bounding boxes — 533.69x365.65 for the back one — but 500·cos7 + 307·sin7
   * = 533.69 and 500·sin7 + 307·cos7 = 365.66, and the render's long edges
   * measure -7.000 degrees, so the back card is that same box turned 7deg.
   * Slots are stored as the *centre* for that reason: the rotated card's
   * top-left is not what Figma reports.
   */
  screens: [
    { src: screenBooking, alt: "Skill Wagon booking and wagon pricing screen" },
    { src: screenLeads, alt: "Skill Wagon lead detail screen with status history" },
  ],
  stage: { w: 634, h: 523, card: { w: 500, h: 307 } },
  slots: [
    { cx: 311.8435, cy: 243.7577, rotate: -7 },
    { cx: 383.859375, cy: 369.8232421875, rotate: 0 },
  ],
};

export const challenge = {
  eyebrow: "The Challenge",
  title: "Learning was happening everywhere - except in one connected place.",
  body: "Skill Wagon was designed to address the growing complexity of managing learning, learners, and training operations in a single ecosystem.",
  /**
   * The four challenges as cards (`CaseChallenge`), each with a small UI
   * picture and what it cost the team. Replaces the frame's red ✕ list and
   * AI-generated photos (user's request). The `body` lines are ours.
   */
  cards: [
    { art: "tabs", title: "Fragmented learning experience", body: "Courses, quizzes and materials sat in different tools." },
    { art: "approvals", title: "Complex management", body: "Learners, batches and instructors were managed by hand." },
    { art: "insights", title: "Limited insights", body: "Progress and completion were hard to see or measure." },
    { art: "capacity", title: "Scaling challenges", body: "Every new course or batch added more manual work." },
  ] satisfies ChallengeCard[],
};

/**
 * A screenshot placed by its Figma node rather than by its own size.
 *
 * Every export on this page arrives larger than the node it came from, because
 * the card's drop shadow is baked into the raster. The shadow is `0 32px` with
 * ~61px of spread, so the export hangs ~29px above the card and ~93px below —
 * it is **not** centred on the node. Sizing a figure to its export therefore
 * inflates the block: this page rendered its Approach +48 and its UI Screens
 * +293 against their own frames before these numbers existed.
 *
 * So the figure reserves `node` in flow and the export overflows it, placed at
 * `off`. Each `off` was measured, not assumed: the card's edge was located in
 * an isolated node render and again in the full-section render, and the
 * difference taken. Symmetric centring puts every card ~30px low.
 */
export interface Media {
  src: ImageMetadata;
  alt: string;
  /** The box the frame reserves — what the figure occupies in flow. */
  node: { w: number; h: number };
  /** The export's own size, shadow included. */
  exp: { w: number; h: number };
  /** The export's top-left in node space. */
  off: { x: number; y: number };
}

/** Both phase screenshots are the same card at the same size. */
const PHASE_MEDIA = {
  node: { w: 568.42, h: 406.56 },
  exp: { w: 690.5, h: 527.5 },
  off: { x: -61.04, y: -28.3 },
} as const;

export interface Phase {
  title: string;
  items: { title: string; body: string }[];
  media?: Media;
  /** Which side the screenshot sits on; the phases alternate. */
  mediaSide?: "left" | "right";
}

export const approach = {
  eyebrow: "Our Approach",
  title: "From Understanding to Experience",
  body: "We approached Skill Wagon by deeply understanding users, workflows, and LMS challenges, then translating them into a scalable product experience.",
  phases: [
    {
      title: "Phase 01 - Discover & Define",
      items: [
        {
          title: "Understand the Problem",
          body: "Identified challenges across learners, instructors, and admins.",
        },
        {
          title: "Research & Discover",
          body: "Studied users, workflows, and existing LMS experiences.",
        },
        {
          title: "Define the Experience",
          body: "Mapped journeys, requirements, and core product flows.",
        },
      ],
    },
    {
      title: "Phase 02 - Structure & Design",
      items: [
        {
          title: "Wireframe the Flow",
          body: "Built low-fidelity wireframes to establish structure and navigation.",
        },
        {
          title: "Build the Design System",
          body: "Created reusable components, styles, and interaction patterns.",
        },
        {
          title: "Shape the Experience",
          body: "Transformed wireframes into a consistent and visual language.",
        },
      ],
      media: { src: approachP02, alt: "The Skill Wagon revenue dashboard", ...PHASE_MEDIA },
      mediaSide: "left",
    },
    {
      title: "Phase 03 - Build & Refine",
      items: [
        {
          title: "Design the Product",
          body: "Designed complete LMS experience across key features & workflows.",
        },
        {
          title: "Refine & Validate",
          body: "Reviewed flows & refined the experience through usability feedback.",
        },
        {
          title: "Deliver the Final Product",
          body: "Brought everything together into a scalable, seamless SaaS platform.",
        },
      ],
      media: { src: approachP03, alt: "The Skill Wagon course library", ...PHASE_MEDIA },
      mediaSide: "right",
    },
  ] satisfies Phase[],
};

/**
 * The specimen is an SVG export, not live text. Setting it as markup would
 * mean shipping five weights of Open Sans — a font this site does not
 * otherwise use — for one decorative block. The SVG keeps the letterforms
 * exact at zero font cost; the `alt` carries the meaning.
 */
export const typography = {
  eyebrow: "Typography",
  title: "A Type System for Learning",
  body: "Open Sans provides a flexible foundation for the LMS, supporting a consistent hierarchy across courses, dashboards, analytics, navigation, and system messages.",
  specimen: {
    name: "illustrations/lms-typescale",
    alt: "Open Sans specimen: the alphabet in upper and lower case, in Light, Regular, Medium, Semibold and Bold",
  },
  media: { src: typoTable, alt: "The Skill Wagon student management table" },
  /** Dashed leader labels pointing at parts of the table. */
  callouts: [
    { label: "Heading", weight: "Semi bold" },
    { label: "Button label", weight: "Regular" },
    { label: "Body Text", weight: "Regular" },
  ],
};

/** Exported whole: the figure, its four leader lines and their labels. */
export const palette = {
  eyebrow: "Colorography",
  title: "A Palette With Purpose",
  body: "Every color has a role from highlighting actions and progress to creating hierarchy across dashboards, courses, and learning journeys.",
  art: {
    name: "illustrations/lms-palette",
    alt: "The Skill Wagon palette: primary #2D5652, secondary CTA #4A4A59, background #4A4A59 and accent #E5F2E9",
  },
};

export interface Screen extends Media {
  title?: string;
  body?: string;
  /** `full` spans the column; `pair` is one of a side-by-side row. */
  layout: "full" | "left" | "right" | "pair";
}

/**
 * Three of the five blocks are the same browser card at the same scale, so
 * they carry the same bleed: 61 to each side, 29 above and 93 below.
 */
const CARD_OFF = { x: -61, y: -29 };

export const screens = {
  eyebrow: "UI Screens",
  title: "Designed for Every Learning Journey",
  body: "Explore the core screens of Skill Wagon, designed to simplify navigation and create a seamless learning experience for both admins and learners.",
  blocks: [
    /**
     * The one block the frame does not run full width: a 1200 node in the 1240
     * column, with the phone hanging off its right edge. That overhang is why
     * this export's bleed is 57 left against 139 right — it is the only
     * asymmetry here that is artwork rather than shadow.
     *
     * The export also carried a 1px dark column down its right edge, baked in
     * by Figma. It hides inside the frame, where it lands on the 1440 canvas
     * boundary; on the page it was a hairline hanging 100px clear of the
     * column. The source is trimmed by that column, so this is 1396 and not
     * the 1397 Figma reports — `off.x` anchors from the left, so nothing moved.
     */
    {
      src: showcaseHero,
      alt: "The Skill Wagon marketing site on desktop and mobile",
      layout: "full",
      node: { w: 1200, h: 700 },
      exp: { w: 1396, h: 898.5 },
      off: { x: -57, y: -84 },
    },
    {
      src: showcaseCourses,
      alt: "The All Courses screen",
      title: "All Courses Screen",
      body: "The Courses screen centralizes course creation and management, allowing admins to create, edit, publish, unpublish, and delete courses from one streamlined workspace.",
      layout: "left",
      node: { w: 608, h: 394 },
      exp: { w: 730, h: 516 },
      off: CARD_OFF,
    },
    {
      src: showcaseEnrollments,
      alt: "The Students Enrollments screen",
      title: "Students Enrollments Screen",
      body: "The Student Enrollments screen lets administrators manage enrolled students, view enrollment details, monitor access, and revoke access when needed.",
      layout: "right",
      node: { w: 608, h: 394 },
      exp: { w: 730, h: 516 },
      off: CARD_OFF,
    },
    {
      src: showcaseTablets,
      alt: "Skill Wagon on two tablets",
      layout: "full",
      node: { w: 1240, h: 922 },
      exp: { w: 1347, h: 1053 },
      off: { x: -53, y: -33 },
    },
    {
      src: showcasePair,
      alt: "Two further Skill Wagon admin screens",
      layout: "full",
      node: { w: 1240, h: 394 },
      exp: { w: 1362, h: 516 },
      off: CARD_OFF,
    },
  ] satisfies Screen[],
};
