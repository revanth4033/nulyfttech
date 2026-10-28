import type { ImageMetadata } from "astro";

import aiAutomation from "../assets/images/wwd/ai-automation.jpg";
import productDesign from "../assets/images/wwd/product-design.jpg";
import narrative from "../assets/images/wwd/narrative.jpg";
import talent1 from "../assets/images/wwd/talent-1.jpg";
import talent2 from "../assets/images/wwd/talent-2.jpg";
import talent3 from "../assets/images/wwd/talent-3.jpg";

export interface Tag {
  icon: string;
  label: string;
}

/**
 * `browser` wraps the shot in Chrome-style chrome (rows 1–2).
 * `plain` is a single image that already carries its own chrome (row 3).
 * `collage` is the three-photo grid (row 4).
 */
export type Media =
  | { kind: "browser"; src: ImageMetadata; alt: string }
  | { kind: "plain"; src: ImageMetadata; alt: string }
  | { kind: "collage"; images: { src: ImageMetadata; alt: string }[] };

export interface CapabilityRow {
  id: string;
  title: string;
  body: string;
  tags: Tag[];
  media: Media;
  /** Media on the left instead of the right. */
  reverse?: boolean;
  /**
   * Fixed height for the tag block, in px. Narrative Intelligence has a
   * single row of tags but Figma reserves 88px there, which lifts the whole
   * centred copy block by 22px. Without this the row sits too low.
   */
  tagsHeight?: number;
}

/** Figma 435:249 + 435:355 — the light band. */
export const lightRows: CapabilityRow[] = [
  {
    id: "ai-automation",
    title: "AI & intelligent automation",
    body: "AI agents, RAG, and automation turn complex operations into systems that think, adapt, and act.",
    tags: [
      { icon: "icons/wwd/ai-agents", label: "AI Agents" },
      { icon: "icons/wwd/workflow-automation", label: "Workflow Automation" },
      { icon: "icons/wwd/rag", label: "RAG" },
      { icon: "icons/wwd/document-intelligence", label: "Document Intelligence" },
      { icon: "icons/wwd/enterprise-ai", label: "Enterprise AI" },
    ],
    media: { kind: "browser", src: aiAutomation, alt: "nuLyft job execution analytics dashboard" },
  },
  {
    id: "product-design",
    title: "Product design & engineering",
    body: "We turn complex ideas into intuitive, scalable products—from first interaction to full-cycle delivery.",
    tags: [
      { icon: "icons/wwd/ux-strategy", label: "UX Strategy" },
      { icon: "icons/wwd/product-design", label: "Product Design" },
      { icon: "icons/wwd/design-systems", label: "Design Systems" },
      { icon: "icons/wwd/prototyping", label: "Prototyping" },
      { icon: "icons/wwd/mvp-development", label: "MVP Development" },
      { icon: "icons/wwd/full-cycle-delivery", label: "Full-Cycle Delivery" },
    ],
    media: { kind: "browser", src: productDesign, alt: "nuLyft tenant revenue dashboard" },
    reverse: true,
  },
];

/** Figma 435:462 + 435:544 — the dark band. */
export const darkRows: CapabilityRow[] = [
  {
    id: "narrative",
    title: "Narrative intelligence",
    body: "We turn data, strategy, and ideas into visual stories that capture attention and drive decisions.",
    tags: [
      { icon: "icons/wwd/data-storytelling", label: "Data Storytelling" },
      { icon: "icons/wwd/investor-narratives", label: "Investor Narratives" },
      { icon: "icons/wwd/presentation-systems", label: "Presentation Systems" },
    ],
    media: { kind: "plain", src: narrative, alt: "Skillwagon onboarding pitch deck" },
    tagsHeight: 88,
  },
  {
    id: "talent",
    title: "Talent intelligence",
    body: "We help teams hire smarter structured interviews, automated screening, and workflows that surface the right candidate faster, with less manual review.",
    tags: [
      { icon: "icons/wwd/talent", label: "Candidate Screening" },
      { icon: "icons/wwd/talent", label: "Structured Interviews" },
      { icon: "icons/wwd/talent", label: "Hiring Workflows" },
      { icon: "icons/wwd/talent", label: "Recruitment Automation" },
    ],
    media: {
      kind: "collage",
      images: [
        { src: talent1, alt: "Candidate in a remote video interview" },
        { src: talent2, alt: "Interviewer reviewing candidate profiles" },
        { src: talent3, alt: "Candidate receiving an offer letter" },
      ],
    },
    reverse: true,
  },
];
