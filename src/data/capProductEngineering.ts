/**
 * Product Engineering capability page — Figma 646:5614, 1440 x 5866:
 * Hero (931), What we do (817), process (1109), proof (2155), CTA + footer.
 *
 * Copy and geometry live here; markup in `components/sections/Pe*.astro`.
 * Screens reuse the Product Design page's assets wherever Figma placed the
 * same bitmap (checked by checksum), so nothing is shipped twice.
 */
import type { Shot } from "./capProductDesign";

import skillDashboard from "../assets/images/cap-design/skill-feature.jpg";
import asterDashboard from "../assets/images/cap-design/aster-hero.jpg";
import webBack1 from "../assets/images/cap-design/web-back-1.jpg";
import asterRequirements from "../assets/images/cap-design/aster-feature-5.jpg";
import skillCourse from "../assets/images/cap-design/pe-proof-skill.jpg";
import autoPhone1 from "../assets/images/cap-design/auto-phone-1.jpg";
import autoPhone2 from "../assets/images/cap-design/auto-phone-2.jpg";
import autoPhone3 from "../assets/images/cap-design/auto-phone-3.jpg";

/* --- hero ------------------------------------------------------------------ */

export interface LayerCard {
  icon: string;
  title: string;
  sub: string;
  /** Top-left inside the 690 x 545 diagram (Figma 646:5656). */
  x: number;
  y: number;
}

export interface Connector {
  src: string;
  x: number;
  y: number;
  w: number;
  h: number;
}

export const hero = {
  height: 931,
  eyebrow: "PRODUCT ENGINEERING",
  title: "Building products around",
  emphasis: "business requirements",
  body: "We take products from initial design through development and delivery, with each stage guided by the business\u2019s needs.",
  primary: { label: "Discuss Your Project", href: "/contact" },
  // The 673:9086 copy update drops the second button; PeHero renders one
  // only when it is set.
  secondary: null as { label: string; href: string } | null,

  hub: { title: "The Engineering Layer", flow: "idea → Product →impact" },

  cards: [
    { icon: "icons/pe/layer-arch", title: "Architecture", sub: "Scalable systems built for growth", x: 429, y: 0 },
    { icon: "icons/pe/layer-ai", title: "AI & Automation", sub: "Smarter process, real intelligence", x: 4, y: 111 },
    { icon: "icons/pe/layer-infra", title: "Infrastructure", sub: "Reliaable, secure, always on", x: 443, y: 139 },
    { icon: "icons/pe/layer-integ", title: "Integrations", sub: "Connected tools, seamless workflows", x: 0, y: 407 },
    { icon: "icons/pe/layer-data", title: "Data Intelligence", sub: "Better data, better decisions", x: 463, y: 464 },
  ] satisfies LayerCard[],

  // Elbow lines from each card to the rings; exports carry their own dots.
  connectors: [
    { src: "brand/pe/conn-arch", x: 366, y: 37, w: 63, h: 127 },
    { src: "brand/pe/conn-ai", x: 234.5, y: 151.8, w: 96.7, h: 63.7 },
    { src: "brand/pe/conn-infra", x: 487, y: 221, w: 76, h: 84 },
    { src: "brand/pe/conn-integ", x: 228, y: 383, w: 74, h: 71 },
    { src: "brand/pe/conn-data", x: 466, y: 367, w: 122.7, h: 96.5 },
  ] satisfies Connector[],

  /** Loose 6px dots scattered on the rings. */
  dots: [
    { x: 496, y: 392, c: "#834dfb" },
    { x: 243, y: 193, c: "#dacbfe" },
    { x: 223, y: 296, c: "#834dfb" },
    { x: 544, y: 196, c: "#834dfb" },
    { x: 187, y: 395, c: "#eae1fe" },
    { x: 607, y: 405.5, c: "#834dfb" },
    { x: 232, y: 150, c: "#834dfb" },
    { x: 327, y: 215, c: "#834dfb" },
  ],
};

/* --- what we do -------------------------------------------------------------- */

export const services = {
  eyebrow: "WHAT WE DO",
  title: "From business challenges to products that work",
  body: "Whether you're building a new product, improving existing systems, or exploring AI, we bring together design and engineering to develop practical solutions around your business needs.",
  cards: [
    {
      title: "Product Development",
      tags: "SaaS Platforms · Web Applications · Mobile Applications",
      body: "From initial concept to launch, we design and build products around your requirements, with a focus on usability, functionality, and long-term growth.",
      shot: { src: skillDashboard, alt: "Learner dashboard", crop: { w: 112.2, h: 306.61, left: -12.1, top: -0.58 } },
    },
    {
      title: "Custom Solutions",
      tags: "Business Applications · System Integrations · API Development",
      body: "We develop solutions tailored to your business processes, helping simplify complex workflows and connect the systems your teams rely on.",
      shot: { src: asterDashboard, alt: "Recruitment dashboard", crop: { w: 100, h: 284.54, left: -0.16, top: -0.29 } },
      // Figma draws the middle card lifted: accent border and glow.
      featured: true,
    },
    {
      title: "AI & Automation",
      tags: "AI Integration · RAG & Intelligent Search · Workflow Automation",
      body: "We integrate AI into products & business workflows to automate repetitive tasks, make information easier to access, and support better decisions.",
      shot: { src: webBack1, alt: "Component library", crop: { w: 100, h: 157.06, left: -0.04, top: -8.07 } },
    },
  ] as { title: string; tags: string; body: string; shot: Shot; featured?: boolean }[],
};

/* --- process (dark) -------------------------------------------------------- */

export const process = {
  eyebrow: "OUR DESIGN",
  title: "From what's broken to what's built",
  body: "Whether you're starting with an idea or bringing us an existing system, we find what needs to change, shape the right solution, and engineer it into a product built to move forward.",
  // Staggered: odd steps sit 64px in. Tops are Figma's.
  steps: [
    { icon: "icons/pe/step-bulb", title: "Understand & Unblock", body: "We explore your business, users, existing systems, and technical challenges to identify what's working, what's holding you back, and what needs solving first.", top: 0, inset: false },
    { icon: "icons/pe/step-design", title: "Define & Design", body: "We translate business needs into clear requirements, define the right scope, and shape product experiences and technical architecture around your goals.", top: 139, inset: true },
    { icon: "icons/pe/step-merge", title: "Build & Integrate", body: "We engineer the application, APIs, data systems, integrations, and AI capabilities, connecting every component into a cohesive product built for real-world use.", top: 277, inset: false },
    { icon: "icons/pe/step-test", title: "Test & Refine", body: "We validate functionality, security, performance, and critical workflows, uncovering weaknesses early and refining the product to deliver reliable, consistent experiences.", top: 415, inset: true },
    { icon: "icons/pe/step-rocket", title: "Launch & Evolve", body: "We deploy the product, monitor real-world performance, address emerging issues, and continuously improve its capabilities as user needs and business priorities evolve.", top: 553, inset: false },
  ],
};

/* --- proof ----------------------------------------------------------------- */

export interface ProofItem {
  label: string;
  text: string;
}

export const proof = {
  eyebrow: "SELECTED PRODUCT ENGINEERING",
  title: "Products we've engineered from concept to delivery",
  body: "A closer look at the products we've built, the engineering behind them, and how we've addressed specific business and user needs.",
  projects: [
    {
      name: "AI Powered Recruitment Platform",
      href: "/work/ai-recruitment-platform",
      items: [
        { label: "Intelligent candidate discovery", text: "Matches job requirements with relevant candidate profiles to support candidate search and shortlisting." },
        { label: "Connected Recruitment Workflows", text: "Brings candidate information and recruitment activities together across hiring stages." },
        { label: "Recruitment Data Intelligence", text: "Helps recruitment teams evaluate candidate profiles, review requirements, and gain insights from recruitment data." },
      ],
      media: {
        kind: "browser" as const,
        shot: { src: asterRequirements, alt: "Requirements board", crop: { w: 100, h: 154.27, left: 0.09, top: 0.08 } } as Shot,
      },
      reverse: false,
    },
    {
      name: "Skillwagon",
      href: "/work/lms-education-saas",
      items: [
        { label: "Flexible Learning Architecture", text: "Brings courses, assessments, projects, and learning resources together in one platform." },
        { label: "Learning Progress Tracking", text: "Gives students and administrators a clear view of learning activity and progress." },
        { label: "Multi-Format Learning", text: "Supports live sessions, recorded lessons, and other learning resources within one platform." },
      ],
      media: {
        kind: "browser" as const,
        shot: { src: skillCourse, alt: "Course analytics", crop: { w: 113.48, h: 364.4, left: -13.23, top: -0.09 } } as Shot,
      },
      reverse: true,
    },
    {
      name: "Motorcycle Discovery Platform",
      href: "/work/automotive-marketplace",
      items: [
        { label: "Structured Vehicle Listings", text: "Organizes vehicle details, specifications, images, and listing information." },
        { label: "AI-Powered Reel Creation", text: "Uses vehicle images and details to generate promotional reels." },
        { label: "Automated Content Generation", text: "Simplifies the process of turning vehicle listings into content for social media." },
      ],
      media: {
        kind: "phones" as const,
        phones: [
          { src: autoPhone1, alt: "", crop: { w: 100, h: 110.09, left: 0, top: -10.08 }, dim: true },
          { src: autoPhone2, alt: "Reel view of a listed motorcycle", crop: { w: 100, h: 123.65, left: 0.13, top: 0.09 } },
          { src: autoPhone3, alt: "", crop: { w: 100, h: 110.09, left: 0, top: -10.15 }, dim: true },
        ] as (Shot & { dim?: boolean })[],
      },
      reverse: false,
    },
  ],
};

export const cta = {
  title: "Have a product to build or improve?",
  body: "Bring us your idea, business challenge, or existing product. We'll help you define the right approach and turn it into a well-engineered solution.",
  button: "Discuss Your Project",
};
