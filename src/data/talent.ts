import type { ImageMetadata } from "astro";

import interviewRoom from "../assets/images/talent/interview-room.png";
import panelTable from "../assets/images/talent/panel-table.png";
import notesCloseup from "../assets/images/talent/notes-closeup.png";
import signing from "../assets/images/talent/signing.png";
import twoPeople from "../assets/images/talent/two-people.png";

/**
 * Studio → Talent Intelligence — Figma 501:3477.
 *
 * The only tab that is not a project grid. Where the other three list case
 * study cards, this one is a pitch: a split intro over a live scorecard, a
 * four-step process, and its own stat band.
 */

/* --- Intro -------------------------------------------------------------- */

export const intro = {
  title: "Interviews that produce decisions, not debates",
  body: "Talent Intelligence is nuLyft’s interview layer, where vetted practitioners conduct structured, rubric-scored interviews and deliver decision-ready reports before your next stand-up.",
  points: ["Practitioner - led", "One rubric, every round", "Report in - 40 minutes"],
  cta: { label: "Request a Pilot Interview", href: "#contact" },
  photo: {
    src: interviewRoom,
    alt: "Two people mid-interview at a desk in a studio meeting room",
  },
};

/**
 * The floating scorecard that overlaps the photo.
 *
 * `bar` is not `score / 10`. Figma draws each fill as an overlong bar clipped
 * by its track, landing at 94.7% / 98% / 88.1% for scores of 8.5 / 9.0 / 8.0 —
 * eyeballed rather than plotted. The measured values are kept so the card
 * matches the frame; change them here if the bars should become proportional.
 */
export const scorecard = {
  role: "Senior Backend Engineer",
  status: "Round 2 · Live",
  rows: [
    { label: "System Design", score: "8.5", bar: 94.7 },
    { label: "Problem Solving", score: "9.0", bar: 98.0 },
    { label: "Communication", score: "8.0", bar: 88.1 },
  ],
  verdict: "Strong Hire",
  overall: "8.5",
};

/* --- Process ------------------------------------------------------------ */

export interface Step {
  label: string;
  body: string;
}

export const process = {
  title: "From open role to hire signal",
  body: "Four steps, most of it happening off your team's calendar. You define the bar once; every candidate after that is measured against it the same way.",
  steps: [
    {
      label: "Share the role",
      body: "Send the JD or sync your ATS, then flag must-have skills, seniority, and completed rounds.",
    },
    {
      label: "We match an interviewer",
      body: "A practitioner from the exact stack or discipline is assigned and conflict-checked.",
    },
    {
      label: "The interview runs",
      body: "A live, recorded interview follows a role-specific rubric for consistent, fair evaluation.",
    },
    {
      label: "Your scorecard arrives",
      body: "Competency ratings, hire recommendations, recordings, and notes land in your inbox or ATS automatically.",
    },
  ] satisfies Step[],
};

/**
 * The photo collage beside the process.
 *
 * Two 292-wide columns in a 630-tall window, with a 120px gradient veil over
 * the top and bottom edges. The columns drift continuously in opposite
 * directions behind those veils (`scripts/talent-collage.ts`), so each one
 * carries the full set rather than Figma's two, and the strip is duplicated in
 * the markup to make the wrap seamless.
 *
 * Each column runs the same four photos in a different order, at alternating
 * tall/short heights, so the two never show the same shot side by side and a
 * given photo only comes back around after a full 1,292px lap. Adding more
 * photos here lengthens the cycle with no change to the script.
 */
export interface CollageShot {
  src: ImageMetadata;
  alt: string;
  /** Figma's two slot sizes; the columns alternate between them. */
  h: 398 | 216;
}

export const collage: { left: CollageShot[]; right: CollageShot[] } = {
  left: [
    { src: panelTable, alt: "A hiring panel reviewing candidates around a table", h: 398 },
    { src: notesCloseup, alt: "Interviewers comparing written notes", h: 216 },
    { src: twoPeople, alt: "Two colleagues in conversation over coffee", h: 398 },
    { src: signing, alt: "A candidate signing an offer letter", h: 216 },
  ],
  right: [
    { src: signing, alt: "A candidate signing an offer letter", h: 216 },
    { src: twoPeople, alt: "Two colleagues in conversation over coffee", h: 398 },
    { src: notesCloseup, alt: "Interviewers comparing written notes", h: 216 },
    { src: panelTable, alt: "A hiring panel reviewing candidates around a table", h: 398 },
  ],
};

/** One lap: the four cells plus the gap that closes back onto the duplicate. */
export const COLLAGE_LOOP = 398 + 216 + 398 + 216 + 4 * 16;

/** Ambient, not a carousel — a photo crosses the 630px window in ~21s. */
export const COLLAGE_SPEED = 30; // px per second

/* --- Stat band ----------------------------------------------------------- */

export const highlights = {
  title: "Built to Make Hiring Move Faster",
  body: "A stronger interview layer, measured by the outcomes that matter expertise, speed, coverage, and consistency.",
  stats: [
    { value: "3+", label: "Clients", illustration: "illustrations/talent-clients", width: 86, height: 78 },
    { value: "200+", label: "Interviews", illustration: "illustrations/talent-interviews", width: 78, height: 78 },
    {
      value: "100+",
      label: "Candidates Selected",
      illustration: "illustrations/talent-selected",
      width: 78,
      height: 78,
    },
  ],
};
