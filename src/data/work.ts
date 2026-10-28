import type { ImageMetadata } from "astro";

import lms from "../assets/images/work/lms.jpg";
import automotive1 from "../assets/images/work/automotive-1.png";
import automotive2 from "../assets/images/work/automotive-2.png";
import automotive3 from "../assets/images/work/automotive-3.png";
import recruitment from "../assets/images/work/recruitment.jpg";

export type WorkMedia =
  | { kind: "browser"; src: ImageMetadata; alt: string }
  /**
   * Free-standing artwork over a glow. Each piece is placed absolutely, in the
   * coordinate space of the Figma group (575.16 x 317.48), so the purple glow
   * shows through the gaps between them.
   */
  | {
      kind: "device";
      alt: string;
      pieces: { src: ImageMetadata; left: number; top: number; width: number }[];
    };

export interface CaseStudy {
  id: string;
  category: string;
  title: string;
  body: string;
  outcomes: string[];
  href: string;
  media: WorkMedia;
  /** Media on the left instead of the right. */
  reverse?: boolean;
}

/** Figma 435:600 — three case studies, alternating sides. */
export const caseStudies: CaseStudy[] = [
  {
    id: "lms",
    category: "Education · SaaS",
    title: "LMS / education SaaS",
    body: "A scalable learning platform that brings course creation, learner management, and engagement into one connected experience.",
    outcomes: [
      "Smart Course Management",
      "Seamless Student Enrollment",
      "Progress & Performance Tracking",
    ],
    href: "#work",
    media: { kind: "browser", src: lms, alt: "Course curriculum builder in the learning platform" },
  },
  {
    id: "automotive",
    category: "Automotive · E-Commerce",
    title: "NxtDealer",
    body: "A connected vehicle marketplace that helps dealers showcase inventory, discover opportunities, and move vehicles from stock to sale.",
    outcomes: ["Smart Stock Management", "AI Content Creation", "Dealer Marketplace Network"],
    href: "#work",
    media: {
      kind: "device",
      alt: "NxtDealer app across three phone screens",
      // Measured off the Figma composite render. The child frames' own
      // coordinates don't work here — phone 3's bounding box overflows the
      // group by 73px because the frames are rotated.
      pieces: [
        { src: automotive1, left: 0.5, top: 14.5, width: 197.5 },
        { src: automotive2, left: 219.5, top: 0, width: 136.5 },
        { src: automotive3, left: 377, top: 15, width: 198 },
      ],
    },
    reverse: true,
  },
  {
    id: "recruitment",
    category: "HR · Recruitment · AI",
    title: "AI-powered recruitment platform",
    body: "An intelligent recruitment experience that helps teams discover, evaluate, and move the right talent through a more connected hiring journey.",
    outcomes: [
      "45% faster candidate screening",
      "38% reduction in recruitment effort",
      "30% improvement in hiring workflow efficiency",
    ],
    href: "#work",
    media: { kind: "browser", src: recruitment, alt: "Hiring pipeline view in the recruitment platform" },
  },
];
