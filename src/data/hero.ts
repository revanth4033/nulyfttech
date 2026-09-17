import type { ImageMetadata } from "astro";

import previewExperience from "../assets/images/hero/card-experience-sim.png";
import previewProductDesign from "../assets/images/hero/card-product-design.png";
import previewProductEng from "../assets/images/hero/card-product-eng.png";
import previewScalableInfra from "../assets/images/hero/card-scalable-infra.png";
import previewKnowledge from "../assets/images/hero/card-knowledge.png";
import previewNarrative from "../assets/images/hero/card-narrative.png";

/**
 * Hero animation scenes — transcribed from the Figma section "Hero new frames"
 * (528:9020), in canvas order top to bottom. Each frame is one beat of the
 * loop, and the four beats replace the previous three (two card pairs plus a
 * summary dashboard).
 *
 * Two card shapes live here. A `preview` card is title / illustration /
 * caption; a `pipeline` card is title over three steps on a rail. Both are
 * hug-content in Figma, so the components set the *parts* and let the card
 * take its height from them — which is what lands 273.5 / 269.86 / 290.25.
 */

/** A step on a pipeline card's rail. */
export interface PipelineStep {
  title: string;
  body: string;
  /** Icon under src/assets, without the extension. */
  icon: string;
}

export interface PreviewCard {
  kind: "preview";
  title: string;
  /**
   * The illustration panel. `w`/`h` are the Figma node's box — what the card
   * measures — while `exp` is the export's own size. The Experience Simulation
   * art runs 11px past its panel on the right and Figma draws that overhang,
   * so the export is wider than the node and must not be squeezed back in.
   */
  media: {
    src: ImageMetadata;
    alt: string;
    w: number;
    h: number;
    exp?: { w: number; h: number };
  };
  /** Caption: the tool or offering, then a two-line description. */
  name: string;
  body: string;
  /** Optional brand mark at the right of the caption. */
  logo?: { icon: string; w: number };
}

export interface PipelineCard {
  kind: "pipeline";
  title: string;
  steps: [PipelineStep, PipelineStep, PipelineStep];
}

export type HeroCard = PreviewCard | PipelineCard;

/**
 * Where a card sits on the stage. `right`/`top` are stage coordinates: Figma's
 * left edge converted to a right offset (1440 - left - w) so the composition
 * holds as the viewport narrows, and Figma's top minus the 83px nav, which the
 * stage already starts below.
 */
export interface HeroSlot {
  w: number;
  right: number;
  top: number;
}

export interface HeroScene {
  id: string;
  /** Lower-left card first, upper-right second — the order they fly in. */
  cards: [HeroCard, HeroCard];
  slots: [HeroSlot, HeroSlot];
}

export const heroScenes: HeroScene[] = [
  {
    id: "design",
    slots: [
      { w: 252, right: 384, top: 313.5 },
      { w: 260.19, right: 99.81, top: 199 },
    ],
    cards: [
      {
        kind: "preview",
        title: "Experience Simulation",
        media: {
          src: previewExperience,
          alt: "A Figma canvas with frames, components and a text panel",
          w: 220,
          h: 137,
          exp: { w: 231, h: 137 },
        },
        name: "Figma",
        // "desin" is the frame's own spelling; reproduced as drawn. The
        // newline is a hard break in the frame — natural wrapping at 165.5px
        // would break a word later.
        body: "For wireframes, UI desin systems\n& prototypes",
        logo: { icon: "icons/hero/logo-figma", w: 20 },
      },
      {
        kind: "preview",
        title: "Product Design",
        media: {
          src: previewProductDesign,
          alt: "Three linked mobile screens on a prototype canvas",
          w: 228.187,
          h: 137,
        },
        name: "Framer",
        body: "Interactive prototypes with\nreal time feedback",
        logo: { icon: "icons/hero/logo-framer", w: 19.676 },
      },
    ],
  },
  {
    id: "engineering",
    slots: [
      { w: 252, right: 384, top: 317.14 },
      { w: 260, right: 100, top: 199 },
    ],
    cards: [
      {
        kind: "preview",
        title: "Product Engineering",
        media: {
          src: previewProductEng,
          alt: "A mobile app screen under construction",
          w: 220,
          h: 133.363,
        },
        name: "Mobile App Development",
        body: "Build high-performing apps that engage users and expand reach.",
      },
      {
        kind: "preview",
        title: "Scalable Infrastructure",
        media: {
          src: previewScalableInfra,
          alt: "Rows of service cards drifting across a cloud dashboard",
          w: 228,
          h: 133,
        },
        name: "SaaS Development",
        body: "Build scalable cloud software for reliable, automated experiences.",
      },
    ],
  },
  {
    id: "automation",
    slots: [
      { w: 271.5, right: 395.5, top: 300 },
      { w: 271.5, right: 100, top: 199 },
    ],
    cards: [
      {
        kind: "pipeline",
        title: "AI & Intelligent Automation",
        steps: [
          {
            title: "Email Trigger",
            body: "When email received",
            icon: "icons/hero/step-email",
          },
          {
            title: "GPT - 4 Analysis",
            body: "Extract Intent & Sentiment",
            icon: "icons/hero/step-gpt",
          },
          {
            title: "Stack Alert",
            body: "Notify # support team",
            icon: "icons/hero/step-alert",
          },
        ],
      },
      {
        kind: "pipeline",
        title: "Autonomous Operations",
        steps: [
          {
            title: "Save To DB",
            body: "Log in postgreSQL",
            icon: "icons/hero/step-db",
          },
          {
            title: "Auto Reply",
            body: "Send confirmation email",
            icon: "icons/hero/step-reply",
          },
          {
            title: "Update CRM",
            body: "Create ticket in salesforce",
            icon: "icons/hero/step-crm",
          },
        ],
      },
    ],
  },
  {
    id: "knowledge",
    slots: [
      { w: 252, right: 384, top: 317.14 },
      { w: 260, right: 100, top: 199 },
    ],
    cards: [
      {
        kind: "preview",
        title: "Knowledge Systems",
        media: {
          src: previewKnowledge,
          alt: "A Skill Wagon course-platform landing page",
          w: 220,
          h: 133.363,
        },
        name: "Course Platform & E-Learning",
        body: "Launch branded learning hubs, monetize content seamlessly, and automate student enrollment end-to-end.",
      },
      {
        kind: "preview",
        title: "Narrative Intelligence",
        media: {
          src: previewNarrative,
          alt: "A candidate-pipeline landing page with a funnel diagram",
          w: 228,
          h: 133,
        },
        name: "Intelligent Candidate Pipelines",
        body: "Streamline your hiring funnel from initial outreach to final placement with data-driven recruitment strategies.",
      },
    ],
  },
];
