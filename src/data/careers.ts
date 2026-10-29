import type { ImageMetadata } from "astro";

import officeCelebration from "../assets/images/careers/office-celebration.png";
import teamDesk from "../assets/images/careers/team-desk.png";

/**
 * Careers — Figma 503:3819.
 *
 * Two sections under the hero: a bento of culture cards and photos, then the
 * open roles. Both are static; the page carries no motion beyond `reveal.ts`.
 */

/* --- Culture bento -------------------------------------------------------- */

export const perksHeader = {
  title: "A place to grow, a team to thrive",
  body: "Be part of a team that designs, builds, and ships real products. nuLyft offers an environment where learning, ownership, and impact go hand in hand.",
};

export interface Perk {
  icon: string;
  title: string;
  body: string;
}

/**
 * Both cards carry the same briefcase glyph in Figma — one exported icon,
 * referenced twice, not two that happen to look alike.
 */
export const perks: Perk[] = [
  {
    icon: "icons/careers/briefcase",
    title: "Career growth",
    body: "We invest in your journey structured training, mentorship, and global exposure that help you grow as fast as the company does",
  },
  {
    icon: "icons/careers/briefcase",
    title: "Empowering careers",
    body: "At nuLyft, you don’t just work, you grow. We foster an inclusive culture where ideas matter, contributions are valued, and every role makes a global impact.",
  },
];

/** Both photos sit under the same lavender veil Figma lays over them. */
export const perkPhotos: Record<"wide" | "tall", { src: ImageMetadata; alt: string }> = {
  wide: { src: officeCelebration, alt: "The team celebrating together in the studio" },
  tall: { src: teamDesk, alt: "Three colleagues reviewing work together at a desk" },
};

/* --- Open roles ----------------------------------------------------------- */

export interface Job {
  id: string;
  title: string;
  type: string;
  body: string;
  location: string;
  salary: string;
  /** No application destination yet; the card renders inert until there is. */
  href?: string;
}

/**
 * Empty on purpose — there is nothing open at the moment.
 *
 * Figma draws six role cards, but they are one placeholder repeated six times
 * and the user asked for the listing to be hidden. `CareersJobs.astro` renders
 * the empty state below whenever this is empty, so putting real roles here is
 * all it takes to bring the grid back.
 */
export const jobs: Job[] = [];

export const jobsHeader = { title: "Currently open positions" };

/**
 * Open applications — shown instead of the listing while `jobs` is empty
 * (`CareersApply.astro`). Not in Figma: it replaced a "No openings right now"
 * empty state at the user's request, so a quiet month still collects
 * candidates. UI only — `deliver()` in the component is the hook for the
 * backend.
 */
export const apply = {
  /** The old empty state's drawing, kept as the pitch's mark (by request). */
  illustration: "illustrations/no-openings",
  eyebrow: "Open applications",
  title: "No open roles right now, but we’d still like to meet you",
  body: "We’re not hiring for a specific role at the moment. Send us your resume and we’ll keep it on file. When a role that fits your skills opens up, we’ll reach out to you first.",
  pointsTitle: "What to send",
  points: [
    "Your resume or CV",
    "A link to your portfolio or LinkedIn",
    "The kind of role you’re looking for",
  ],
  fields: {
    name: { label: "Full name", placeholder: "John Doe" },
    email: { label: "Email address", placeholder: "john@example.com" },
    interest: {
      label: "Area of interest",
      placeholder: "Select an area",
      options: ["Product design", "Engineering", "AI & automation", "Project management", "Other"],
    },
    link: { label: "LinkedIn or portfolio", placeholder: "linkedin.com/in/yourname", optional: "Optional" },
    resume: {
      label: "Resume",
      prompt: "Drop your resume here or",
      /** Touch screens cannot drag a file in. */
      promptTouch: "Tap to upload your resume",
      browse: "browse",
      hint: "PDF or DOC, up to 5 MB",
      remove: "Remove",
      errors: {
        missing: "Please attach your resume.",
        type: "That file type isn’t supported. Please upload a PDF or DOC.",
        size: "That file is over 5 MB. Please upload a smaller file.",
      },
    },
    note: { label: "A short note", placeholder: "Tell us a little about yourself and what you’d like to work on.", optional: "Optional" },
  },
  submit: "Send my resume",
  privacy: { lead: "We’ll only use your details to consider you for roles at nuLyft. See our", link: "Privacy Policy", href: "/privacy-policy" },
  done: {
    title: "Thanks, {name}",
    body: "We’ve received your resume and will be in touch when a matching role opens up.",
    again: "Send another",
  },
  /** Accepted resume files, checked by extension and size before submit. */
  accept: [".pdf", ".doc", ".docx"],
  maxBytes: 5 * 1024 * 1024,
};
