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
  title: "We design digital products around",
  emphasis: "business and user needs",
  body:
    "We combine an understanding of business objectives and user needs to design digital products that are practical, intuitive, and easy to use.",
  cta: { label: "Talk To Our Design Team", href: "/contact" },

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
  title: "A structured approach to better product experiences",
  cards: [
    { kind: "photo", src: approachFront, alt: "Designer sketching wireframes on a whiteboard", crop: "cover" },
    { kind: "photo", src: approachBack, alt: "User-flow diagram drawn on a whiteboard", crop: { w: 100, h: 106.95, left: -0.05, top: 0.08 } },
    { kind: "browser", src: approach3, alt: "Mobile wireframes", crop: { w: 100, h: 101.57, left: -0.02, top: -0.39 } },
    { kind: "browser", src: approach4, alt: "Design-system components", crop: { w: 100, h: 151.64, left: 0.12, top: -0.25 } },
    { kind: "browser", src: approach5, alt: "Polished dashboard interface", crop: { w: 114.35, h: 415.93, left: -14.58, top: -0.29 } },
    { kind: "browser", src: approach6, alt: "Prototype flow map", crop: { w: 100, h: 178.02, left: -0.07, top: -0.03 } },
  ] satisfies StackCard[],
  // The redesign drops the per-step tag line; CapApproach renders it only
  // when a step carries one.
  steps: [
    {
      n: "01",
      title: "Understand the Problem",
      body: "We identify the underlying problem, understand user needs, and align the design approach with business objectives.",
    },
    {
      n: "02",
      title: "Map the User Journey",
      body: "We organize information and define clear user journeys around the tasks people need to complete.",
    },
    {
      n: "03",
      title: "Define the Structure",
      body: "We establish the layout, content hierarchy, and interaction flow before developing the visual design.",
    },
    {
      n: "04",
      title: "Establish the Design Language",
      body: "We define the visual elements, typography, colors, and components that create a consistent experience across the product.",
    },
    {
      n: "05",
      title: "Design the Interface",
      body: "We translate the structure and design language into clear interfaces and interactions across devices.",
    },
    {
      n: "06",
      title: "Test and Refine",
      body: "We evaluate the experience with users, identify areas for improvement, and refine the design based on feedback.",
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
  /** Optional line under the name (Skill Wagon, Automotive). */
  tagline?: string;
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
      eyebrow: "WHAT WE DESIGN",
      title: "Digital products built around real needs",
      body: "We design digital products that make tasks easier for users and help businesses meet their objectives. From simplifying complex workflows to improving everyday interactions, our focus is on making products more useful, intuitive, and effective.",
    },
    name: "AI-Powered Recruitment Platform",
    body: "An AI-powered recruitment platform that connects job requirements with relevant candidates and brings recruitment activities into one place. From candidate discovery and interview management to hiring workflows and analytics, it gives recruitment teams a clearer view of the process and helps them work more efficiently.",
    // The redesign swaps these two values between the labels; as drawn.
    facts: [
      { label: "Technology", value: "Web & Mobile" },
      { label: "Scope", value: "HR Tech" },
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
      title: "A more connected hiring process",
      listW: 472,
      kind: "browser",
      items: [
        {
          icon: "icons/cap/feat-ai-search",
          title: "AI-Powered Candidate Search",
          sub: "Find relevant candidates without starting from scratch",
          shot: { src: asterFeature, alt: "Ranked candidates matched against a job description", crop: { w: 100, h: 171.55, left: 0.15, top: 0.05 } },
          caption: "Match job descriptions against the existing candidate database to identify profiles with relevant skills and experience, making candidate discovery and shortlisting more efficient.",
        },
        {
          icon: "icons/cap/feat-id-management",
          title: "Centralized Candidate Management",
          sub: "Every candidate, organized in one place",
          shot: { src: asterFeature2, alt: "Candidate list with profiles and stages", crop: { w: 100, h: 148.36, left: 0.02, top: 0.09 } },
          caption: "Keep candidate profiles, details, and recruitment activity organized in one place.",
        },
        {
          icon: "icons/cap/feat-job-status",
          title: "Interview & Hiring Workflow",
          sub: "Keep every hiring stage connected",
          shot: { src: asterFeature3, alt: "Hiring pipeline for a requirement", crop: { w: 100, h: 138.26, left: 0, top: 0.1 } },
          caption: "Manage interview stages and track candidate progress throughout the hiring process.",
        },
        {
          icon: "icons/cap/feat-analytics",
          title: "Recruitment Analytics & Reporting",
          sub: "Turn hiring activity into actionable insights",
          shot: { src: asterHero, alt: "Recruitment dashboard with hiring pipeline chart", crop: { w: 100, h: 230.88, left: 0.06, top: -0.01 } },
          caption: "Monitor recruitment activity and access insights to support hiring decisions.",
        },
        {
          icon: "icons/cap/feat-batch-job",
          title: "Job Posting & Requirement Management",
          sub: "Keep every hiring requirement organized",
          shot: { src: asterFeature5, alt: "Requirement editor", crop: { w: 100, h: 154.27, left: 0.11, top: 0.11 } },
          caption: "Create and manage job postings and keep hiring requirements organized across open positions.",
        },
      ],
    },
    outcomes: {
      title: "Less manual effort. Better hiring decisions",
      body: "By connecting candidate discovery, recruitment workflows, and analytics, the platform helps hiring teams reduce repetitive work, manage the hiring process more effectively, and make informed decisions.",
      bodyW: 787,
      hub: { icon: "icons/cap/hub-recruitment", w: 42.42, h: 39.91 },
      items: [
        { icon: "icons/cap/out-podium", title: "Faster Candidate Shortlisting", body: "AI-powered candidate search helps recruiters to get relevant profiles from their existing database, reducing the need for repetitive manual searches." },
        { icon: "icons/cap/out-eye-spark", title: "Better Recruitment Visibility", body: "Centralized candidate information and pipeline tracking give hiring teams a clearer view of recruitment progress and pending actions." },
        { icon: "icons/cap/out-process", title: "A More Connected Hiring Process", body: "Integrated interview coordination and workflow management help teams manage each stage of recruitment with greater continuity." },
        { icon: "icons/cap/out-job-search", title: "More Informed Hiring Decisions", body: "Recruitment analytics help teams assess pipeline performance, understand progress, and prioritize their next steps." },
      ],
    },
  },
  {
    id: "skillwagon",
    theme: "dark",
    name: "Skill Wagon",
    tagline: "A unified learning platform",
    body: "SkillWagon is a student-focused learning platform that brings courses, live and recorded sessions, assessments, progress tracking, projects, and learning resources into one place. It gives students a structured environment to learn, practice, track their progress, and apply their knowledge.",
    facts: [
      { label: "Technology", value: "Web & Mobile" },
      { label: "Scope", value: "Learning Platform" },
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
      title: "Designed around every learning need",
      listW: 470,
      kind: "browser",
      items: [
        {
          icon: "icons/cap/feat-dashboard",
          title: "Personalized Learning Dashboard",
          sub: "Your Entire Learning Journey, at a Glance",
          shot: { src: skillFeature, alt: "Learner dashboard with weekly activity and course progress", crop: { w: 113.61, h: 251.92, left: -13.21, top: 0.11 } },
          caption: "A central view of courses, learning activity, progress, assessments, and upcoming tasks.",
        },
        {
          icon: "icons/cap/feat-play-lesson",
          title: "Course and Content Management",
          sub: "Every Lesson Has Its Place",
          shot: { src: skillFeature2, alt: "Course player with lesson modules", crop: { w: 100, h: 261.43, left: 0.51, top: 0.14 } },
          caption: "Organized course materials and learning resources that make it easier for students to navigate their learning.",
        },
        {
          icon: "icons/cap/feat-live-tv",
          title: "Live & Recorded Learning",
          sub: "Learning That Goes Beyond the Classroom",
          shot: { src: skillFeature3, alt: "Live and recorded sessions", crop: { w: 100.24, h: 98.48, left: -0.06, top: 0.17 } },
          caption: "Access live sessions and recorded content to support different learning schedules and needs.",
        },
        {
          icon: "icons/cap/feat-chart-performance",
          title: "Progress & Performance Tracking",
          sub: "Every Milestone, Clearly in View",
          shot: { src: skillFeature4, alt: "Progress and performance charts", crop: { w: 100, h: 321.11, left: 0.06, top: -1.37 } },
          caption: "Track course completion, assessment results, and learning activity to understand progress over time.",
        },
        {
          icon: "icons/cap/feat-exam",
          title: "Assessments Experience",
          sub: "Quick Quizzes, Meaningful Progress",
          shot: { src: skillFeature5, alt: "Assessment question screen", crop: { w: 100.15, h: 93.98, left: 0.03, top: 2.04 } },
          caption: "Complete assessments and quizzes to test understanding and evaluate learning progress.",
        },
      ],
    },
    outcomes: {
      title: "A more connected learning experience",
      body: "SkillWagon brings learning content, assessments, and practical activities together in one platform, helping students manage their learning journey with greater clarity.",
      bodyW: 628,
      hub: { icon: "icons/cap/hub-learning", w: 40, h: 40 },
      items: [
        { icon: "icons/cap/out-connected", title: "One Connected Learning Journey", body: "Courses, live sessions, assessments, and projects are available within one platform, reducing the need to move between disconnected learning tools." },
        { icon: "icons/cap/out-navigation-person", title: "Clearer Next Steps", body: "Structured navigation and visible learning activities help students identify what to complete and where to focus next." },
        { icon: "icons/cap/out-progress-check", title: "Visible Learning Progress", body: "Course completion, assessment results, and learning activity help students understand how far they have progressed." },
        { icon: "icons/cap/out-online-course", title: "Learning Applied Through Projects", body: "Practical projects give students opportunities to apply the course concepts through the hands-on work." },
      ],
    },
  },
  {
    id: "automotive",
    theme: "light",
    name: "Automotive Marketplace",
    tagline: "A Visual-First Motorcycle Marketplace",
    body: "An automotive marketplace designed to help users discover motorcycles through image-rich listings, detailed vehicle information, and intuitive search. The mobile experience also incorporates AI-powered reel creation, giving listings an additional way to present motorcycles through engaging visual content.",
    facts: [
      { label: "Technology", value: "Mobile App" },
      { label: "Scope", value: "Automotive Marketplace" },
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
      title: "More than listings. A better way to discover bikes",
      listW: 472,
      kind: "phone",
      items: [
        {
          icon: "icons/cap/feat-phone-person",
          title: "Visual Bike Discovery",
          sub: "Find your next ride in a scroll",
          shot: { src: autoFeature, alt: "Marketplace feed of motorcycle listings", crop: { w: 100, h: 194.09, left: 0.42, top: 0.03 } },
          caption: "Browse image-rich motorcycle listings that make it easier to explore available bikes and compare options.",
        },
        {
          icon: "icons/cap/feat-ai-search-2",
          title: "Smart Search & Filtering",
          sub: "Narrow the search. Find your kind of ride",
          shot: { src: autoFeature2, alt: "Brand and category filters", crop: { w: 100, h: 113.21, left: 0.18, top: 0.08 } },
          caption: "Refine motorcycle listings based on relevant criteria to find bikes that match individual preferences.",
        },
        {
          icon: "icons/cap/feat-info-feed",
          title: "Immersive Bike Details",
          sub: "Every vehicle has a story. Get the full picture",
          shot: { src: autoPhone2, alt: "Bike detail page", crop: { w: 100, h: 140.16, left: 0, top: 0 } },
          caption: "Explore dedicated vehicle pages with essential details and imagery to support informed consideration.",
        },
        {
          icon: "icons/cap/feat-movie-ai",
          title: "AI-Powered Reel Creation",
          sub: "Turn every vehicle into a story worth watching",
          shot: { src: autoFeature4, alt: "AI reel creator", crop: { w: 100, h: 113.21, left: 0.24, top: 0.12 } },
          caption: "Turn motorcycle images into reel-style promotional content to present listings in a more engaging format.",
        },
        {
          icon: "icons/cap/feat-gui-management",
          title: "Listing Management",
          sub: "From adding a bike to putting it in the spotlight",
          shot: { src: autoFeature5, alt: "Add a listing form", crop: { w: 100, h: 194.09, left: 0.15, top: 0.12 } },
          caption: "Create and manage motorcycle listings, bringing vehicle details and visual content together in one place.",
        },
      ],
    },
    outcomes: {
      title: "A more engaging motorcycle discovery experience",
      body: "The platform brings motorcycle discovery, vehicle information, and visual content together in one mobile experience, helping users explore available inventory and evaluate listings more easily.",
      bodyW: 791,
      hub: { icon: "icons/cap/hub-motorcycle", w: 40, h: 40 },
      items: [
        { icon: "icons/cap/out-discovery", title: "Simplified Motorcycle Discovery", body: "Image-led browsing and search filters help users navigate available motorcycles and narrow their options." },
        { icon: "icons/cap/out-data-exploration", title: "Better-Informed Vehicle Exploration", body: "Detailed vehicle pages combine key information and imagery, helping users assess motorcycles before taking the next step." },
        { icon: "icons/cap/out-search-visual", title: "More Engaging Listing Presentation", body: "AI-powered reel creation gives motorcycle listings another way to showcase vehicles through dynamic visual content." },
        { icon: "icons/cap/out-rds", title: "A More Connected Marketplace", body: "Listings, vehicle details, and the listing management are brought together within a single mobile experience." },
      ],
    },
  },
];

/* --- CTA (673:4923) ------------------------------------------------------- */

export const cta = {
  // Figma breaks the line after "shape it", and sets straight apostrophes.
  title: "Have a product idea? Let's shape it\ntogether",
  body: "Tell us what you're planning, what your users need, or what you're looking to create. We'll help turn your vision into a clear product experience.",
};

/* ==========================================================================
   Websites — 637:2843. Three stacked browsers beside a description card,
   with five pager dots. The frame draws the first slide.
   ========================================================================== */

import webBack1 from "../assets/images/cap-design/web-back-1.jpg";
import webBack2 from "../assets/images/cap-design/web-back-2.jpg";
import webFront from "../assets/images/cap-design/web-front.png";

export const websites = {
  eyebrow: "Website Capability",
  title: "Websites built around business needs",
  body: "We design and develop websites that reflect each business, its industry, and its audience \u2014 from corporate websites to SaaS platforms and product-led digital experiences.",
  slides: 5,
  stack: {
    back1: { src: webBack1, alt: "", crop: { w: 100, h: 157.06, left: -0.04, top: -8.07 } },
    back2: { src: webBack2, alt: "", crop: { w: 116.1, h: 100, left: 0, top: 0 } },
    front: { src: webFront, alt: "Smart AI Resume Builder template picker", crop: { w: 100, h: 127.89, left: 0, top: 0.05 } },
  } satisfies Record<string, Shot>,
  card: {
    title: "AI Resume Builder",
    body: "A resume-building tool that helps users create tailored resumes, check ATS compatibility, and manage multiple resume versions. It combines customizable templates, resume scoring, and organized storage in one interface.",
    points: ["Customizable Resume Templates", "ATS Compatibility Check", "Resume Version Management"],
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
  title: "Digital Experiences Built for Business",
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
