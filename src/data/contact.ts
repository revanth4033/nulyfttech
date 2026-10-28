/**
 * Contact Us — Figma 672:3795, 1440 x 2474. "Get Started" in the nav and
 * every "talk to us" button across the site land here.
 */

export const CONTACT_EMAIL = "contact@nulyfttech.com";

export const hero = {
  eyebrow: "Get in touch",
  title: { lead: "Ready when you are" },
  body: ["Whether it’s a question or a concrete plan, we’re happy to talk."],
};

/* --- Let's discuss (672:3835) ---------------------------------------------- */

export const discuss = {
  // The spaced hyphen is the frame's own.
  title: "Let’s discuss your use - case together",
  body: "Whether it’s a product idea or an operational challenge, we’re happy to discuss what makes sense for you.",
  cta: { label: "Book a Call", href: "#contact-form" },
};

/* --- The form (672:3866) ---------------------------------------------------- */

export const form = {
  title: "Let's build something together",
  body: "Tell us about your project, challenge, or idea. We'll respond within 24 hours.",
  submit: "Send Message",
  /**
   * Placeholders as drawn. Figma reuses "John Doe" for the company and
   * message fields too — a stray copy, flagged to the user.
   */
  fields: {
    name: { label: "Your Name", placeholder: "John Doe" },
    email: { label: "Email Address", placeholder: "john@company.com" },
    company: { label: "Company / Organization", placeholder: "John Doe" },
    message: {
      label: "What are you looking to build? What challenges are you facing?",
      placeholder: "John Doe",
    },
  },
};
