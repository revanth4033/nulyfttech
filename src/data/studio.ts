import type { ImageMetadata } from "astro";

import elearning from "../assets/images/studio/elearning-platform.jpg";
import rpaDashboard from "../assets/images/studio/rpa-dashboard.png";
import aiRecruitment from "../assets/images/studio/ai-recruitment.jpg";
import deckSkillwagon from "../assets/images/studio/deck-skillwagon.png";
import deckAiEngineer from "../assets/images/studio/deck-ai-engineer.png";
import deckAsterData from "../assets/images/studio/deck-aster-data.jpg";
import automotive1 from "../assets/images/studio/automotive-1.png";
import automotive2 from "../assets/images/studio/automotive-2.png";
import automotive3 from "../assets/images/studio/automotive-3.png";
import automotive4 from "../assets/images/studio/automotive-4.png";

/**
 * Studio page — Figma 493:2801.
 *
 * The filter tabs are real: each project belongs to exactly one tab, and the
 * Figma frame draws all of them at once only because it is a "show everything"
 * mock. Each project's meta line opens with its own tab's name, so the two
 * stay legible together — the AI one is worded "AI Intelligent & Automation"
 * in the supplied copy against the tab's "AI & Intelligent Automation", which
 * is the client's wording and is left as given.
 */
export interface StudioTab {
  id: string;
  label: string;
}

export const studioTabs: StudioTab[] = [
  { id: "product-design", label: "Product Design & Engineering" },
  { id: "ai-automation", label: "AI & Intelligent Automation" },
  { id: "narrative", label: "Narrative Intelligence" },
  { id: "talent", label: "Talent Intelligence" },
];

export type ProjectMedia =
  /** A screenshot behind the Chrome browser bar. */
  | {
      kind: "browser";
      src: ImageMetadata;
      alt: string;
      /**
       * How the shot is cropped into the 564x298.33 window. Figma scales each
       * fill to cover and then anchors it; most anchor top-centre, but the
       * LMS shot is anchored right so its empty left rail falls away.
       */
      position?: string;
    }
  /** A deck page behind the dark PDF-viewer toolbar. */
  | {
      kind: "deck";
      src: ImageMetadata;
      alt: string;
      /** Filename shown in the toolbar — not the project title. */
      file: string;
      pages: number;
      position?: string;
    }
  /**
   * Four free-standing phones on the page ground. Each export's true bounds
   * are 261.33 x 553.33 — the artwork overflows its 250x542 Figma slot by
   * 5.67px on every side — so they are placed, not flowed.
   */
  | { kind: "phones"; alt: string; shots: ImageMetadata[] };

export interface Project {
  id: string;
  /** Matches a `studioTabs` id. */
  tab: string;
  title: string;
  meta: string;
  /** The case-study page does not exist yet; the button renders inert. */
  href?: string;
  /**
   * Overrides the button label. Left unset it follows the media: a deck opens
   * a pitch deck, anything else a case study — the button names what it opens.
   */
  ctaLabel?: string;
  /** `full` spans the 1240 column; `half` is 612 and pairs up. */
  span: "half" | "full";
  media: ProjectMedia;
}

/**
 * Order matters — cards flow in this order within their tab, a `full` card
 * takes a row of its own, and a leftover `half` sits alone on the left.
 */
export const projects: Project[] = [
  {
    id: "lms-education-saas",
    tab: "product-design",
    title: "LMS / Education SaaS",
    meta: "Product Design & Engineering · SaaS Platform · 2025",
    href: "/work/lms-education-saas",
    span: "half",
    media: {
      kind: "browser",
      src: elearning,
      alt: "LMS dashboard showing revenue trend, course metrics and student counts",
      position: "right top",
    },
  },
  {
    id: "ai-recruitment-platform",
    tab: "product-design",
    title: "AI Powered Recruitment Platform",
    meta: "Product Design & Engineering · HR Recruitment · 2025",
    span: "half",
    media: {
      kind: "browser",
      src: aiRecruitment,
      alt: "AI recruitment platform showing a hiring pipeline and candidate list",
    },
  },
  {
    id: "automotive-marketplace",
    tab: "product-design",
    title: "Automotive Marketplace",
    meta: "Product Design & Engineering · E - Commerce · 2025",
    span: "full",
    media: {
      kind: "phones",
      alt: "Automotive marketplace app: vehicle listings, reel view, brand picker and template chooser",
      shots: [automotive1, automotive2, automotive3, automotive4],
    },
  },

  {
    id: "automation-technology",
    tab: "ai-automation",
    title: "Automation Technology",
    meta: "AI Intelligent & Automation · RPA · 2025",
    span: "half",
    media: {
      kind: "browser",
      src: rpaDashboard,
      alt: "RPA dashboard showing SLA compliance, breach trends and failure analysis",
    },
  },

  {
    id: "learning-platform-showcase",
    tab: "narrative",
    title: "Learning Platform Showcase",
    meta: "Narrative Intelligence · SaaS Platform · 2026",
    span: "half",
    media: {
      kind: "deck",
      src: deckSkillwagon,
      alt: "Skillwagon pitch deck onboarding slide",
      file: "Skillwagon Pitchdeck",
      pages: 2,
    },
  },
  {
    id: "ai-workflow-engineering",
    tab: "narrative",
    title: "AI Workflow Engineering",
    meta: "Narrative Intelligence · AI Automation · 2026",
    span: "half",
    media: {
      kind: "deck",
      src: deckAiEngineer,
      alt: "AI Automation Engineer deck slide on the problem and AI action solution",
      file: "AI Automation Engineer",
      pages: 2,
    },
  },
  {
    id: "corporate-identity",
    tab: "narrative",
    title: "Corporate Identity",
    meta: "Narrative Intelligence · Branding · 2026",
    span: "half",
    media: {
      kind: "deck",
      src: deckAsterData,
      alt: "Aster Data company profile deck slide",
      file: "Aster Data Company Profile",
      pages: 2,
    },
  },
];

export const projectsByTab = (tab: string): Project[] =>
  projects.filter((p) => p.tab === tab);
