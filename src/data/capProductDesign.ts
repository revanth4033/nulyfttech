/**
 * Product Design capability page — Figma 637:2093 ("Product Design
 * Capabilities"), 1440 x 11529 over eight sections.
 *
 * Copy and geometry live here; markup in `components/sections/Cap*.astro`.
 * Every coordinate is read off the frame and measured from the hero's top
 * edge, which includes the 83px nav.
 */
import shot1 from "../assets/images/cap-design/hero-shot-1.jpg";
import shot2 from "../assets/images/cap-design/hero-shot-2.jpg";
import shot3 from "../assets/images/cap-design/hero-shot-3.jpg";
import shot4 from "../assets/images/cap-design/hero-shot-4.jpg";
import type { ImageMetadata } from "astro";

export interface HeroPill {
  label: string;
  icon: string;
  /** Which edge the pill is anchored to, and its offset from that edge. */
  side: "left" | "right";
  top: number;
  /** Figma fixes two of the four widths; the other two hug their label. */
  w?: number;
}

export interface HeroTool {
  name: string;
  icon: string;
  /** Centre's offset from the stage's centre line. */
  dx: number;
  top: number;
  rotate: number;
}

/**
 * A tilted product screen. Figma fills each card with an image transform,
 * not a cover fit, so the crop is reproduced as the image's own box inside
 * the card — percentages of the card, exactly as the frame states them.
 */
export interface HeroScreen {
  src: ImageMetadata;
  alt: string;
  /** Top-left of the 327.955 x 236.484 rotated wrapper inside its group. */
  x: number;
  y: number;
  rotate: number;
  crop: { w: number; h: number; left: number; top: number } | "cover";
}

export const hero = {
  height: 1024,
  title: "We design products around how people",
  emphasis: "actually work",
  body:
    "We turn business goals, user behaviour, and product complexity into digital experiences that feel clear, purposeful, and effortless—from the first interaction to everyday use.",
  cta: { label: "Talk To Our Design Team", href: "#contact" },

  pills: [
    { label: "Recruitment Tech", icon: "icons/cap/ind-recruitment", side: "left", top: 150 },
    { label: "E-Commerce", icon: "icons/cap/ind-ecommerce", side: "right", top: 150, w: 193 },
    { label: "ED Tech", icon: "icons/cap/ind-edtech", side: "left", top: 367, w: 189 },
    { label: "Financial Services", icon: "icons/cap/ind-financial", side: "right", top: 367 },
  ] satisfies HeroPill[],

  // Alternating low / high, tilted the opposite way on each row.
  tools: [
    { name: "Claude", icon: "icons/cap/tool-claude", dx: -200.05, top: 42.69, rotate: -12 },
    { name: "Framer", icon: "icons/cap/tool-framer", dx: -100.14, top: 0, rotate: 12 },
    { name: "Figma", icon: "icons/cap/tool-figma", dx: -0.23, top: 42.69, rotate: -12 },
    { name: "Miro", icon: "icons/cap/tool-miro", dx: 99.68, top: 0, rotate: 12 },
    { name: "ChatGPT", icon: "icons/cap/tool-openai", dx: 199.59, top: 42.69, rotate: -12 },
  ] satisfies HeroTool[],

  /** Left group: 492 x 356 at (-78, 558). Later entries paint on top. */
  screensLeft: [
    {
      src: shot1,
      alt: "Recruitment pipeline view",
      x: 0.21,
      y: 0.38,
      rotate: 10,
      crop: { w: 100, h: 156.6, left: -0.03, top: 0.09 },
    },
    {
      src: shot2,
      alt: "Tenant dashboard with revenue trend",
      x: 164,
      y: 119,
      rotate: -10,
      crop: { w: 134.19, h: 100, left: -17.41, top: 0.17 },
    },
  ] satisfies HeroScreen[],

  /** Right group: 493 x 355, its right edge 79px past the frame. */
  screensRight: [
    {
      src: shot3,
      alt: "Requirements list with candidate actions",
      x: 0,
      y: 118,
      rotate: 10,
      crop: "cover",
    },
    {
      src: shot4,
      alt: "Requirement management table",
      x: 164.27,
      y: 0,
      rotate: -10,
      crop: { w: 100, h: 145.87, left: -0.13, top: -0.22 },
    },
  ] satisfies HeroScreen[],
};

/* ==========================================================================
   Shared shapes for sections 2-7
   ========================================================================== */

/** Figma image-fill crop, as percentages of the frame the image fills. */
export type Crop = { w: number; h: number; left: number; top: number } | "cover";

export interface Shot {
  src: ImageMetadata;
  alt: string;
  crop: Crop;
}

/* ==========================================================================
   Design Approach — 637:2196, dark, 750 tall. Six steps ride a 1200px ring
   centred 480px off the left edge; the frame draws step 01 at the hub.
   ========================================================================== */

import approachBack from "../assets/images/cap-design/approach-back.jpg";
import approachFront from "../assets/images/cap-design/approach-front.jpg";
import approach3 from "../assets/images/cap-design/approach-3.png";
import approach4 from "../assets/images/cap-design/web-back-1.jpg";
import approach5 from "../assets/images/cap-design/skill-feature-4.jpg";
import approach6 from "../assets/images/cap-design/approach-6.jpg";

/**
 * One card per step. The stack is a queue: in state k the step-k card is in
 * front, step k-1 sits back-left and step k+1 back-right (637:4316). The
 * first two are photos; the rest are screens in a browser frame. Crops are
 * the front-slot crops — the same card shrinks into the side slots.
 */
export interface StackCard extends Shot {
  kind: "photo" | "browser";
}

export const approach = {
  eyebrow: "OUR DESIGN APPROACH",
  title: "Every detail has a purpose. Every decision moves the product forward",
  cards: [
    { kind: "photo", src: approachFront, alt: "Designer sketching wireframes on a whiteboard", crop: "cover" },
    { kind: "photo", src: approachBack, alt: "User-flow diagram drawn on a whiteboard", crop: { w: 100, h: 106.95, left: -0.05, top: 0.08 } },
    { kind: "browser", src: approach3, alt: "Mobile wireframes", crop: { w: 100, h: 101.57, left: -0.02, top: -0.39 } },
    { kind: "browser", src: approach4, alt: "Design-system components", crop: { w: 100, h: 151.64, left: 0.12, top: -0.25 } },
    { kind: "browser", src: approach5, alt: "Polished dashboard interface", crop: { w: 114.35, h: 415.93, left: -14.58, top: -0.29 } },
    { kind: "browser", src: approach6, alt: "Prototype flow map", crop: { w: 100, h: 178.02, left: -0.07, top: -0.03 } },
  ] satisfies StackCard[],
  steps: [
    {
      n: "01",
      title: "Discover the Why",
      tags: "Research · Business Goals · User Needs",
      body: "We uncover the real problem, understand the people behind it, and align the product experience with business objectives.",
    },
    {
      n: "02",
      title: "Map the Experience",
      tags: "User Journeys · Information Architecture",
      body: "We turn complex requirements into clear pathways, organizing information around what users need to accomplish.",
    },
    {
      n: "03",
      title: "Structure Before Style",
      tags: "Wireframes · Layouts · Functional Hierarchy",
      body: "We define the placement, priority, and flow of every element before bringing the interface to life.",
    },
    {
      n: "04",
      title: "Build a Design Language",
      tags: "Design Systems · Components · Visual Foundation",
      body: "We define the placement, priority, and flow of every element before bringing the interface to life.",
    },
    {
      n: "05",
      title: "Bring the Interface to Life",
      tags: "UI Design · Interaction Design · Responsive Design",
      body: "We transform structure into polished interfaces, thoughtful interactions, and responsive experiences that feel natural to use.",
    },
    {
      n: "06",
      title: "Test, Refine, Evolve",
      tags: "Prototyping · Usability Testing · Iteration",
      body: "We test ideas through realistic interactions, learn from feedback, and refine the experience before and beyond launch.",
    },
  ],
};

/* ==========================================================================
   Project showcases — Asterdata 637:2261, Skill Wagon 637:2490,
   Automotive 637:2699. One template, three entries; Skill Wagon is the
   dark one. Each is an intro row, Key Features and Product Outcomes.
   ========================================================================== */

import asterHero from "../assets/images/cap-design/aster-hero.jpg";
import asterFeature from "../assets/images/cap-design/aster-feature.jpg";
import skillHero from "../assets/images/cap-design/skill-hero.jpg";
import skillFeature from "../assets/images/cap-design/skill-feature.jpg";
import autoPhone1 from "../assets/images/cap-design/auto-phone-1.jpg";
import autoPhone2 from "../assets/images/cap-design/auto-phone-2.jpg";
import autoPhone3 from "../assets/images/cap-design/auto-phone-3.jpg";
import autoFeature from "../assets/images/cap-design/auto-feature.jpg";
import asterFeature2 from "../assets/images/cap-design/aster-feature-2.jpg";
import asterFeature3 from "../assets/images/cap-design/aster-feature-3.jpg";
import asterFeature5 from "../assets/images/cap-design/aster-feature-5.jpg";
import skillFeature2 from "../assets/images/cap-design/skill-feature-2.jpg";
import skillFeature3 from "../assets/images/cap-design/skill-feature-3.jpg";
import skillFeature4 from "../assets/images/cap-design/skill-feature-4.jpg";
import skillFeature5 from "../assets/images/cap-design/skill-feature-5.jpg";
import autoFeature2 from "../assets/images/cap-design/auto-feature-2.jpg";
import autoFeature4 from "../assets/images/cap-design/auto-feature-4.jpg";
import autoFeature5 from "../assets/images/cap-design/auto-feature-5.jpg";

export interface Feature {
  icon: string;
  title: string;
  sub: string;
  /** What the right-hand panel shows while this tab is active. */
  shot: Shot;
  caption: string;
}

export interface Outcome {
  icon: string;
  title: string;
  body: string;
}

export interface Phone extends Shot {
  dim?: boolean;
}

export interface Project {
  id: string;
  theme: "light" | "dark";
  /** Asterdata opens the run, so it carries the section header. */
  lead?: { eyebrow: string; title: string; body: string };
  name: string;
  body: string;
  facts: { label: string; value: string }[];
  href: string;
  /** Intro media: a browser screen, or a row of three phones. */
  media: { kind: "browser"; shot: Shot } | { kind: "phones"; phones: Phone[] };
  features: {
    title: string;
    /** Width of the tab list; it sets where the rail falls. */
    listW: number;
    /** Browser frame or a single phone — the same for every tab. */
    kind: "browser" | "phone";
    items: Feature[];
  };
  outcomes: {
    title: string;
    body: string;
    bodyW: number;
    hub: { icon: string; w: number; h: number };
    /** Clockwise from the top right; the first is the highlighted card. */
    items: Outcome[];
  };
}

export const projects: Project[] = [
  {
    id: "asterdata",
    theme: "light",
    lead: {
      eyebrow: "THE WORK WE BUILD",
      title: "Products designed to make complexity feel simpler",
      body: "We create digital experiences that help users accomplish more while giving businesses a stronger product foundation to grow on.",
    },
    name: "AI-Powered Recruitment Platform",
    body: "An AI-powered recruitment platform designed to simplify hiring by connecting job requirements with relevant candidates, centralizing recruitment workflows, and improving visibility across the hiring process. From candidate discovery to interview management and recruitment analytics, the platform helps hiring teams work more efficiently.",
    facts: [
      { label: "Technology", value: "HR Tech" },
      { label: "Scope", value: "Web & Mobile" },
      { label: "Business Type", value: "B2B" },
    ],
    href: "/work/ai-recruitment-platform",
    media: {
      kind: "browser",
      shot: {
        src: asterHero,
        alt: "Recruitment dashboard with hiring pipeline chart",
        crop: { w: 100, h: 230.88, left: 0.01, top: 0.04 },
      },
    },
    features: {
      title: "Everything Hiring Takes, All in One Place",
      listW: 472,
      kind: "browser",
      items: [
        {
          icon: "icons/cap/feat-ai-search",
          title: "AI-Powered JD Search",
          sub: "Find relevant candidates without starting from scratch",
          shot: { src: asterFeature, alt: "Ranked candidates matched against a job description", crop: { w: 100, h: 171.55, left: 0.15, top: 0.05 } },
          caption: "AI matches JD’s against the existing candidate database, identifying profiles with relevant skills & experience to accelerate candidate discovery & shortlisting.",
        },
        {
          icon: "icons/cap/feat-id-management",
          title: "Centralized Candidate Management",
          sub: "Every candidate, organized in one place",
          shot: { src: asterFeature2, alt: "Candidate list with profiles and stages", crop: { w: 100, h: 148.36, left: 0.02, top: 0.09 } },
          caption: "Manage candidate profiles, skills, applications, and recruitment stages through a unified workspace, making candidate information easier to access and track.",
        },
        {
          icon: "icons/cap/feat-job-status",
          title: "Interview & Hiring Workflow",
          sub: "Keep every hiring stage connected",
          shot: { src: asterFeature3, alt: "Hiring pipeline for a requirement", crop: { w: 100, h: 138.26, left: 0, top: 0.1 } },
          caption: "Coordinate interviews, track progress, & manage hiring activities in one workflow, helping recruiters & hiring teams stay aligned throughout the process.",
        },
        {
          icon: "icons/cap/feat-analytics",
          title: "Recruitment Analytics & Reporting",
          sub: "Turn hiring activity into actionable insights",
          shot: { src: asterHero, alt: "Recruitment dashboard with hiring pipeline chart", crop: { w: 100, h: 230.88, left: 0.06, top: -0.01 } },
          caption: "Monitor recruitment pipelines, candidate progress, and hiring metrics through dashboards that help teams identify bottlenecks and make informed decisions.",
        },
        {
          icon: "icons/cap/feat-batch-job",
          title: "Job Posting & Requirement Management",
          sub: "Keep every hiring requirement organized",
          shot: { src: asterFeature5, alt: "Requirement editor", crop: { w: 100, h: 154.27, left: 0.11, top: 0.11 } },
          caption: "Create & manage job openings, maintain role requirements, & track recruitment for each position, giving hiring teams a way to manage multiple vacancies.",
        },
      ],
    },
    outcomes: {
      title: "Less Friction. Better Hiring",
      body: "By connecting candidate discovery, hiring workflows, and recruitment insights, the platform reduces manual effort and helps teams make faster, more informed hiring decisions.",
      bodyW: 695,
      hub: { icon: "icons/cap/hub-recruitment", w: 42.42, h: 39.91 },
      items: [
        { icon: "icons/cap/out-podium", title: "Faster Candidate Shortlisting", body: "AI-powered JD search helps recruiters discover relevant candidates already in their database, reducing reliance on repetitive manual searches." },
        { icon: "icons/cap/out-eye-spark", title: "Better Recruitment Visibility", body: "Centralized candidate information and pipeline tracking make it easier to understand hiring progress and identify pending actions." },
        { icon: "icons/cap/out-process", title: "A More Connected Hiring Process", body: "Interview coordination and workflow management bring recruitment activities together, improving continuity between hiring stages." },
        { icon: "icons/cap/out-job-search", title: "More Informed Hiring Decisions", body: "Recruitment analytics provide clearer insights into pipeline performance, helping teams evaluate progress and prioritize their next steps." },
      ],
    },
  },
  {
    id: "skillwagon",
    theme: "dark",
    name: "Skill Wagon",
    body: "Skill Wagon is a student-focused learning platform designed to bring the complete learning journey into one connected experience. It combines structured courses, live and recorded learning, assessments, progress tracking, project work, and learning resources giving students a clear environment to learn, practise, measure their progress, and move toward their goals.",
    facts: [
      { label: "Technology", value: "EDTech" },
      { label: "Scope", value: "Web & Mobile" },
      { label: "Business Type", value: "B2B" },
    ],
    href: "/work/lms-education-saas",
    media: {
      kind: "browser",
      shot: {
        src: skillHero,
        alt: "Course builder with module and section editor",
        crop: { w: 100.04, h: 93.42, left: -0.01, top: -1.16 },
      },
    },
    features: {
      title: "Designed Around Every Learning Need",
      listW: 470,
      kind: "browser",
      items: [
        {
          icon: "icons/cap/feat-dashboard",
          title: "Personalized Learning Dashboard",
          sub: "Your Entire Learning Journey, at a Glance",
          shot: { src: skillFeature, alt: "Learner dashboard with weekly activity and course progress", crop: { w: 113.61, h: 251.92, left: -13.21, top: 0.11 } },
          caption: "A centralized workspace that gives students visibility into their courses, learning activity, progress, assessments, and upcoming actions.",
        },
        {
          icon: "icons/cap/feat-play-lesson",
          title: "Course & Content Experience",
          sub: "Every Lesson Has Its Place",
          shot: { src: skillFeature2, alt: "Course player with lesson modules", crop: { w: 100, h: 261.43, left: 0.51, top: 0.14 } },
          caption: "A structured environment for accessing lessons, learning materials, videos, and course modules without losing context across the learning journey.",
        },
        {
          icon: "icons/cap/feat-live-tv",
          title: "Live & Recorded Learning",
          sub: "Learning That Goes Beyond the Classroom",
          shot: { src: skillFeature3, alt: "Live and recorded sessions", crop: { w: 100.24, h: 98.48, left: -0.06, top: 0.17 } },
          caption: "Brings instructor-led sessions and recorded learning together, allowing students to continue learning beyond scheduled sessions.",
        },
        {
          icon: "icons/cap/feat-chart-performance",
          title: "Progress & Performance Tracking",
          sub: "Every Milestone, Clearly in View",
          shot: { src: skillFeature4, alt: "Progress and performance charts", crop: { w: 100, h: 321.11, left: 0.06, top: -1.37 } },
          caption: "Makes learning progress visible through course completion, assessment performance, and activity tracking so students always know where they stand.",
        },
        {
          icon: "icons/cap/feat-exam",
          title: "Assessments Experience",
          sub: "Quick Quizzes, Meaningful Progress",
          shot: { src: skillFeature5, alt: "Assessment question screen", crop: { w: 100.15, h: 93.98, left: 0.03, top: 2.04 } },
          caption: "Integrates assessments directly into the learning flow, helping students test their understanding and track their performance alongside their learning.",
        },
      ],
    },
    outcomes: {
      title: "A learning experience built to move students forward",
      body: "Skill Wagon brings learning, practice, and performance into one connected platform making the learning journey easier to navigate and manage.",
      bodyW: 628,
      hub: { icon: "icons/cap/hub-learning", w: 40, h: 40 },
      items: [
        { icon: "icons/cap/out-connected", title: "One Connected Learning Journey", body: "Courses, live sessions, assessments, and projects come together in one platform, reducing disconnected learning experiences." },
        { icon: "icons/cap/out-navigation-person", title: "Clarity at Every Step", body: "Structured navigation and clear next actions help students understand their progress and what to focus on next." },
        { icon: "icons/cap/out-progress-check", title: "Progress You Can See", body: "Course completion, assessment results, and learning activity make student progress easier to track." },
        { icon: "icons/cap/out-online-course", title: "Learning That Leads to Application", body: "Practical projects help students apply course knowledge through hands-on work, beyond simply consuming content." },
      ],
    },
  },
  {
    id: "automotive",
    theme: "light",
    name: "Automotive Marketplace",
    body: "An automotive marketplace designed to help users discover motorcycles through rich visual listings, explore detailed vehicle information, and connect with the right buying opportunities. The experience also brings visual storytelling into the journey, helping make motorcycle discovery more engaging through immersive imagery and reel-style content.",
    facts: [
      { label: "Technology", value: "Automotive" },
      { label: "Scope", value: "Mobile App" },
      { label: "Business Type", value: "B2C" },
    ],
    href: "/work/automotive-marketplace",
    media: {
      kind: "phones",
      phones: [
        { src: autoPhone1, alt: "", crop: { w: 100, h: 110.09, left: 0, top: -10.08 }, dim: true },
        { src: autoPhone2, alt: "Reel view of a listed motorcycle", crop: { w: 100, h: 123.65, left: 0.13, top: 0.09 } },
        { src: autoPhone3, alt: "", crop: { w: 100, h: 110.09, left: 0, top: -10.15 }, dim: true },
      ],
    },
    features: {
      title: "More Than Listings. A Better Way to Discover Bikes",
      listW: 472,
      kind: "phone",
      items: [
        {
          icon: "icons/cap/feat-phone-person",
          title: "Visual Bike Discovery",
          sub: "Find your next ride in a scroll",
          shot: { src: autoFeature, alt: "Marketplace feed of motorcycle listings", crop: { w: 100, h: 194.09, left: 0.42, top: 0.03 } },
          caption: "Explore image-rich motorcycle listings that bring bikes and key details together, making it easier to browse the marketplace and discover interesting rides.",
        },
        {
          icon: "icons/cap/feat-ai-search-2",
          title: "Smart Search & Filtering",
          sub: "Narrow the search. Find your kind of ride",
          shot: { src: autoFeature2, alt: "Brand and category filters", crop: { w: 100, h: 113.21, left: 0.18, top: 0.08 } },
          caption: "Explore motorcycles by relevant categories and preferences to move from a broad selection to bikes worth considering.",
        },
        {
          icon: "icons/cap/feat-info-feed",
          title: "Immersive Bike Details",
          sub: "Every bike has a story. Get the full picture",
          shot: { src: autoPhone2, alt: "Bike detail page", crop: { w: 100, h: 140.16, left: 0, top: 0 } },
          caption: "Explore dedicated bike pages featuring prominent imagery and essential vehicle information to make more informed comparisons.",
        },
        {
          icon: "icons/cap/feat-movie-ai",
          title: "AI-Powered Reel Creation",
          sub: "Turn every bike into a story worth watching",
          shot: { src: autoFeature4, alt: "AI reel creator", crop: { w: 100, h: 113.21, left: 0.24, top: 0.12 } },
          caption: "Use AI to turn motorcycle images and listing details into engaging reels. Create compelling showcases with less editing and help every listing capture attention.",
        },
        {
          icon: "icons/cap/feat-gui-management",
          title: "Streamlined Listing Management",
          sub: "From adding a bike to putting it in the spotlight",
          shot: { src: autoFeature5, alt: "Add a listing form", crop: { w: 100, h: 194.09, left: 0.15, top: 0.12 } },
          caption: "Add motorcycle details, upload images, and organize vehicle information to make inventory easier to present and discover.",
        },
      ],
    },
    outcomes: {
      title: "Less Searching. More Reasons to Buy",
      body: "A visual-first marketplace experience brings motorcycle discovery, detailed listings, and engaging content together helping users explore inventory with greater ease and giving each bike more room to stand out.",
      bodyW: 791,
      hub: { icon: "icons/cap/hub-motorcycle", w: 40, h: 40 },
      items: [
        { icon: "icons/cap/out-discovery", title: "Discovery That Feels Natural", body: "Image-led browsing helps users explore available motorcycles intuitively, making the marketplace easier to scan and navigate." },
        { icon: "icons/cap/out-data-exploration", title: "More Informed Exploration", body: "Detailed vehicle pages bring essential information and imagery together, helping users evaluate bikes with greater context." },
        { icon: "icons/cap/out-search-visual", title: "Stronger Visual Engagement", body: "AI-powered reel creation turns motorcycle imagery into dynamic promotional content, giving listings a more engaging way to capture attention." },
        { icon: "icons/cap/out-rds", title: "A More Connected Marketplace", body: "Discovery, vehicle details, and listing workflows come together in one mobile experience, creating a smoother journey from browsing to consideration." },
      ],
    },
  },
];

/* ==========================================================================
   Websites — 637:2843. Three stacked browsers beside a description card,
   with five pager dots. The frame draws the first slide.
   ========================================================================== */

import webBack1 from "../assets/images/cap-design/web-back-1.jpg";
import webBack2 from "../assets/images/cap-design/web-back-2.jpg";
import webFront from "../assets/images/cap-design/web-front.png";

export const websites = {
  eyebrow: "Website Capability",
  title: "Not every digital experience needs to be a product",
  body: "We also build interactive websites designed around the business, industry, and audience from corporate experiences to SaaS and product-led websites.",
  slides: 5,
  stack: {
    back1: { src: webBack1, alt: "", crop: { w: 100, h: 157.06, left: -0.04, top: -8.07 } },
    back2: { src: webBack2, alt: "", crop: { w: 116.1, h: 100, left: 0, top: 0 } },
    front: { src: webFront, alt: "Smart AI Resume Builder template picker", crop: { w: 100, h: 127.89, left: 0, top: 0.05 } },
  } satisfies Record<string, Shot>,
  card: {
    title: "Smart AI Resume Builder",
    body: "A smart resume builder that brings scalable templates, ATS score checks, and organized resume folders into one seamless experience. Create tailored resumes, refine them for applicant tracking systems, and manage multiple versions with ease.",
    points: ["Scalable Templates", "ATS Score Check", "Resume Folders"],
  },
};

/* ==========================================================================
   Websites Featured Work — 637:3016. Two rows of 450 x 312 cards running
   past both edges under white fades.
   ========================================================================== */

import work2 from "../assets/images/cap-design/work-2.jpg";
import work3 from "../assets/images/cap-design/work-3.jpg";
import work4 from "../assets/images/cap-design/work-4.png";
import work7 from "../assets/images/cap-design/work-7.jpg";

const resumeShot: Shot = { src: webFront, alt: "Resume builder", crop: { w: 100, h: 102.56, left: -0.04, top: 0.68 } };

export const webWork = {
  title: "Not Just Websites. Experiences Worth Exploring",
  rows: [
    [
      resumeShot,
      { src: work2, alt: "Industrial talent website", crop: { w: 100, h: 128.6, left: -0.08, top: -0.02 } },
      { src: work4, alt: "Invisible grills website hero", crop: { w: 100, h: 753.53, left: 0, top: -106.99 } },
      { src: work3, alt: "Resume form", crop: { w: 100, h: 116.48, left: 0.07, top: 0.09 } },
    ],
    [
      resumeShot,
      { src: webBack2, alt: "Industrial automation website", crop: "cover" },
      { src: work4, alt: "Invisible grills website features", crop: { w: 100, h: 753.53, left: -0.11, top: -303.28 } },
      { src: work7, alt: "Recruitment approach website", crop: { w: 100, h: 105.88, left: 0, top: -0.07 } },
      resumeShot,
    ],
  ] satisfies Shot[][],
};
