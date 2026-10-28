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

export const jobsEmpty = {
  illustration: "illustrations/no-openings",
  title: "No openings right now",
  body: "We don’t have any roles open at the moment. Check back soon — new positions are posted here as soon as they go live.",
};
