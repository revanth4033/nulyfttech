/**
 * The legal pages' contents rail — `sections/LegalDoc.astro`.
 *
 * Lights the entry for the section being read, keeps the rail in view while
 * the document scrolls past, and closes the phone disclosure once a link in
 * it is chosen. None of it is motion, so it runs under reduced motion too;
 * there the smoother is absent and the rail's own `position: sticky` holds
 * it instead of the pin.
 */
import { gsap, ScrollTrigger, prefersReducedMotion } from "./gsap";
import { NAV_H } from "./cap-pin";

const root = document.querySelector<HTMLElement>("[data-legal]");

if (root) {
  const rail = root.querySelector<HTMLElement>("[data-legal-toc]")!;
  const doc = root.querySelector<HTMLElement>("[data-legal-doc]")!;
  const links = [...rail.querySelectorAll<HTMLAnchorElement>("a")];
  const sections = links.map((a) => document.getElementById(a.hash.slice(1)));

  const light = (i: number) =>
    links.forEach((a, j) => {
      a.classList.toggle("is-active", i === j);
      if (i === j) a.setAttribute("aria-current", "location");
      else a.removeAttribute("aria-current");
    });

  light(0);
  sections.forEach((section, i) => {
    if (!section) return;
    ScrollTrigger.create({
      trigger: section,
      start: "top 40%",
      end: "bottom 40%",
      onToggle: (self) => self.isActive && light(i),
    });
  });

  /* Under the nav card when the rail fits beneath it, otherwise just clear
     of the top edge — the nav slides away on the way down anyway. */
  const top = () => (window.innerHeight - NAV_H - 48 >= rail.offsetHeight ? NAV_H + 24 : 24);

  if (!prefersReducedMotion()) {
    gsap.matchMedia().add("(min-width: 1081px)", () => {
      ScrollTrigger.create({
        trigger: rail,
        pin: true,
        pinSpacing: false,
        start: () => `top ${top()}px`,
        // The rail and the card both start at the top of the grid row, so
        // the rail runs out of card after exactly the difference in height.
        end: () => `+=${Math.max(0, doc.offsetHeight - rail.offsetHeight)}`,
        invalidateOnRefresh: true,
      });
    });
  }

  /* The document is ~7,000px of text, and it settles a little after the
     first measure (late webfont faces rewrap it — 21px at 1440), which left
     the pin releasing past the card's foot. Re-measure whenever it changes. */
  let pending = 0;
  new ResizeObserver(() => {
    clearTimeout(pending);
    pending = window.setTimeout(() => ScrollTrigger.refresh(), 150);
  }).observe(doc);

  const disclosure = root.querySelector<HTMLDetailsElement>("[data-legal-toc-m]");
  disclosure?.addEventListener("click", (e) => {
    if ((e.target as Element).closest("a")) disclosure.open = false;
  });
}
