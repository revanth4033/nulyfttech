import type { ChallengeCard } from "../components/case/challenge-art";
import heroPhones from "../assets/images/case-auto/hero-phones.png";
import overviewPhone from "../assets/images/case-auto/overview-phone.png";
import phase02 from "../assets/images/case-auto/phase-02.png";
import phase03 from "../assets/images/case-auto/phase-03.png";
import typographyFigure from "../assets/images/case-auto/typography.png";
import typographyFigureA from "../assets/images/case-auto/typography-m1.png";
import typographyFigureB from "../assets/images/case-auto/typography-m2.png";
import screensRowA from "../assets/images/case-auto/screens-row-a.png";
import screensRowC from "../assets/images/case-auto/screens-row-c.png";
import screenStock from "../assets/images/case-auto/screen-stock.png";
import screenDetails from "../assets/images/case-auto/screen-details.png";

/**
 * Automotive Marketplace case study — Figma 510:5689.
 *
 * **The Figma frame is named "AI Powered Recruitment Platform" and that name
 * is wrong.** Every word inside it is the bike-dealer marketplace: the hero
 * reads "AI Reel Creator", the fact row says "Automotive Marketplace", and the
 * screens are a vehicle stock and listing app. It is a stray name from
 * duplicating a frame, the same way the Careers frame carries the Talent
 * Intelligence CTA copy. Confirmed with the user, who had this page wired to
 * the Automotive Marketplace card rather than the recruitment one.
 *
 * Copy is reproduced as drawn, typos included — "OUR APPROCH" and "Invidual"
 * are Figma's, not ours, and are flagged rather than silently corrected.
 */

export const hero = {
  eyebrow: "NxtDealer",
  title: "Turn bike stock into real ",
  /** Italic accent tail, set on its own line in the frame. */
  titleTail: "opportunities",
  body: "A digital marketplace designed to simplify the way dealers showcase and sell bikes. From AI-powered content creation to inventory management and dealer-to-dealer connections, everything comes together in one seamless experience.",
  /**
   * The three phones ship as one flattened export rather than three images.
   * The side pair is faded in the frame and that fade is baked into the
   * pixels, so they cannot be separated without rebuilding the fade by eye.
   *
   * Placed at the Figma container's own origin. The export is 1123x772.5, not
   * the container's 1123x673 — the phones overflow the bottom of their frame
   * and Figma grew the export downward to fit them. Content measured at
   * x 156..989, y 137..766 against phone boxes at x 161.7..983.5,
   * y 158.9..766.8, so the extra is shadow bleed and the origin is unmoved.
   */
  phones: { src: heroPhones, x: 158, y: 352.6286, w: 1123, h: 772.5 },
};


export const overview = {
  eyebrow: "About the project",
  title: "A marketplace built around every bike",
  body: "We designed a mobile platform that helps dealers easily manage, showcase, and sell bikes using AI-powered posts, stock management, and direct buyer connections all in one place.",
  modules: ["Stock feature", "Marketplace feature", "Dashboard analytics", "Content creation"],
  facts: [
    { label: "Technology", value: "NxtDealer" },
    { label: "Scope", value: "Automotive Marketplace" },
    { label: "Business Type", value: "B2B" },
  ],
  /** Node 228.78x496.44 at (834, 0); the export carries 5.61/5.78 of bleed. */
  phone: { src: overviewPhone, x: 828.39, y: -5.78, w: 240, h: 508 },
};

export const challenge = {
  eyebrow: "The challenge",
  title: "Challenges in the current bike selling ecosystem",
  body: "The bike buying and selling process for dealers is still fragmented, time-consuming, and lacks digital efficiency, especially when managing inventory and reaching potential buyers.",
  /**
   * The four challenges as cards (`CaseChallenge`), each with a small UI
   * picture and what it cost the dealer. Replaces the frame's red ✕ list and
   * AI-generated photos (user's request). The `body` lines are ours.
   */
  cards: [
    { art: "stock", title: "Disorganized inventory tracking", body: "No reliable view of which bikes were in stock or already sold." },
    { art: "listing", title: "No easy content creation for listings", body: "Every listing's photos and description were made by hand." },
    { art: "reach", title: "Low marketplace visibility", body: "Listings rarely reached buyers beyond the dealer's own circle." },
    { art: "channels", title: "Fragmented dealer communication channels", body: "Buyer conversations were split across calls, chats and messages." },
  ] satisfies ChallengeCard[],
};

export interface PhaseItem {
  title: string;
  body: string;
}

export const approach = {
  eyebrow: "Our approach",
  title: "From inventory to opportunity",
  intro:
    "We designed a simple, end-to-end experience for bike dealers to manage stock, create engaging content, and connect with buyers making the entire selling process faster, easier, and more effective.",
  phase1: {
    title: "Phase 01 - Discover & strategize",
    items: [
      {
        title: "Understand the dealer journey",
        body: "Mapped the key challenges dealers face while managing and selling bikes.",
      },
      {
        title: "Define the core experience",
        body: "Identified essential features across stock, marketplace, content, and communication.",
      },
      {
        title: "Plan the user flow",
        body: "Structured a simple journey from adding a bike to showcasing and connecting.",
      },
    ] as PhaseItem[],
  },
  phase2: {
    title: "Phase 02 - Structure & design",
    items: [
      {
        title: "Create the design system",
        body: "Developed reusable components, typography, colors, and interaction patterns.",
      },
      {
        title: "Design for clarity",
        body: "Focused on clean layouts and strong visual hierarchy for everyday use.",
      },
      {
        title: "Keep it consistent",
        body: "Applied a unified visual language across the entire application.",
      },
    ] as PhaseItem[],
    phone: { src: phase02, x: 170.61, y: -5.78, w: 240, h: 508 },
  },
  phase3: {
    title: "Phase 03 - Refine the experience",
    items: [
      {
        title: "Design smart interactions",
        body: "Made key actions like adding stock, publishing, and connecting feel effortless.",
      },
      {
        title: "Optimize the UI",
        body: "Refined spacing, hierarchy, and interactions for a smoother experience.",
      },
      {
        title: "Shape the final product",
        body: "Turned the complete design into a polished, modern mobile experience.",
      },
    ] as PhaseItem[],
    phone: { src: phase03, x: 829.39, y: -5.78, w: 240, h: 508 },
  },
};

export const typography = {
  eyebrow: "Typography",
  title: "Designed for clarity in every ride",
  intro:
    "We chose DM Sans as the primary typeface for its clean, modern, and highly readable style, ensuring a simple and consistent experience across the app.",
  /**
   * Specimen, dialog card and all three leader lines in one flattened export.
   * The specimen is set in DM Sans, a face this site does not load, and the
   * leaders only make sense at their drawn size — the same reasoning that put
   * the LMS type specimen out to an asset.
   *
   * Exported from the *container* (510:5915), not the body (510:5924). Only
   * the "Body Text" leader is inside the body; "Heading - Semi bold" and
   * "Button label - Regular" are siblings of it, so a body export silently
   * drops two of the three labels. The header band is cropped back off, and
   * the 479 height against the body's 447 is the leaders overhanging.
   */
  figure: { src: typographyFigure, x: 0, y: 148, w: 1240, h: 479 },
  /**
   * The same figure as two panels, for phones — see the note on the
   * Recruitment page's `typography.split`. The clean gap here is at device
   * x 968-1232.
   */
  split: [
    {
      src: typographyFigureA,
      w: 490,
      alt: "DM Sans specimen in Light, Regular, Medium, Semibold and Bold",
    },
    {
      src: typographyFigureB,
      w: 630,
      alt: "A Ready To Go Live dialog with leaders labelling its heading, body text and button label styles",
    },
  ],
};

export const colorography = {
  eyebrow: "Colorography",
  title: "A palette built to stand out",
  intro:
    "From marketplace listings to everyday actions, every color was chosen to create hierarchy, guide attention, and give the experience its own distinctive character.",
  /**
   * Inlined as SVG, not a flattened export — the draw-in and the hover need
   * the six leaders and labels to be addressable. Tagged by
   * `scripts/tag-palette.py`; node 510:5974, 890.9x366 at (174.55, 174).
   */
  figure: {
    name: "illustrations/auto-palette",
    x: 174.55,
    w: 890.9,
    alt: "Two riders beside a scooter, with leader lines to the palette: primary #B51B75, primary dark #91165E, primary text #111212, secondary text #3C3C43, accent #FAEFF5 and background #F4F4F4",
  },
};

export const screens = {
  eyebrow: "UI screens",
  title: "Designed for every automobile user",
  intro:
    "Explore the core screens of Application, designed to simplify navigation and create a seamless experience for users.",
  /**
   * Row A's three phones carry a much larger shadow than the rest: the export
   * is 1387x1263 for a 1240x1111 node, and its content measures x 18..1369
   * against phones spanning 0..1240 — so 73.5px of bleed on every side, not
   * the 5.75 the other phone exports carry. Placed at minus that.
   */
  rowA: { src: screensRowA, x: -73.5, y: -73.5, w: 1387, h: 1263 },
  /** Node at y=2547 in the body; minus the 5.75 bleed. */
  rowC: { src: screensRowC, x: -5.75, y: 2541.25, w: 1251.5, h: 662.5 },
  features: [
    {
      title: "Individual stock view screen",
      body: "Once a bike is added to stock, dealers get a dedicated view to manage all key actions in one place. They can edit details, share listings, create reels, and publish to the marketplace for better visibility.",
      phone: { src: screenStock, x: 170.25, y: -5.75, w: 311.5, h: 662.5 },
      copyX: 587,
      copyY: 0,
      glowX: 126,
      mediaFirst: true,
    },
    {
      title: "Marketplace individual bike details screen",
      body: "Explore bikes from other dealers with key details like price, model, and condition at a glance. Save listings and connect instantly via WhatsApp or call for faster decisions.",
      phone: { src: screenDetails, x: 758.25, y: -5.75, w: 311.5, h: 662.5 },
      copyX: 0,
      copyY: 277.5,
      glowX: 714,
      mediaFirst: false,
    },
  ],
};
