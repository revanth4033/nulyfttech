import type { ImageMetadata } from "astro";

import elearning from "../assets/images/studio/elearning-platform.jpg";
import aiRecruitment from "../assets/images/studio/ai-recruitment.jpg";
import automotive1 from "../assets/images/studio/automotive-1.png";
import automotive2 from "../assets/images/studio/automotive-2.png";
import automotive3 from "../assets/images/studio/automotive-3.png";
import automotive4 from "../assets/images/studio/automotive-4.png";

/**
 * Studio page ("Work" in the nav) — Figma 667:3302.
 *
 * The redesign drops the filter tabs, the Talent Intelligence pitch and the
 * Narrative decks: the page is a hero over the three case studies that have
 * pages, then the shared CTA + footer.
 */
export const hero = {
  eyebrow: "Our work",
  title: { lead: "Turning business needs ", em: "into solutions" },
  body: [
    "Every project begins with understanding the business context, defining the right approach, and identifying what the solution needs to achieve. We bring together product thinking, design, and engineering to deliver solutions shaped by real requirements and built for practical use.",
  ],
};

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
  /**
   * Four free-standing phones on the page ground. Each export's true bounds
   * are 261.33 x 553.33 — the artwork overflows its 250x542 Figma slot by
   * 5.67px on every side — so they are placed, not flowed.
   */
  | { kind: "phones"; alt: string; shots: ImageMetadata[] };

export interface Project {
  id: string;
  title: string;
  meta: string;
  href: string;
  /** `full` spans the 1240 column; `half` is 612 and pairs up. */
  span: "half" | "full";
  media: ProjectMedia;
}

/** In grid order: two halves side by side, then a full-width row. */
export const projects: Project[] = [
  {
    id: "lms-education-saas",
    title: "LMS / education SaaS",
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
    title: "AI powered recruitment platform",
    meta: "Product Design & Engineering · HR Recruitment · 2026",
    href: "/work/ai-recruitment-platform",
    span: "half",
    media: {
      kind: "browser",
      src: aiRecruitment,
      alt: "AI recruitment platform showing a hiring pipeline and candidate list",
    },
  },
  {
    id: "nxtdealer",
    title: "NxtDealer",
    meta: "Product Design & Engineering · E - Commerce · 2026",
    href: "/work/nxtdealer",
    span: "full",
    media: {
      kind: "phones",
      alt: "NxtDealer app: vehicle listings, reel view, brand picker and template chooser",
      shots: [automotive1, automotive2, automotive3, automotive4],
    },
  },
];
