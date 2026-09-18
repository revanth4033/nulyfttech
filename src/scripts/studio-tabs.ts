/**
 * Studio filter tabs.
 *
 * Swaps which project panel is shown and slides the underline onto the active
 * tab. The panel swap itself is deliberately instantaneous — the design has no
 * transition for it, and inventing one is not ours to do.
 *
 * The underline is measured from the live tab rather than the Figma widths,
 * because its width is the rendered text's width: hard-coding it would drift
 * the moment a label changes or a fallback font paints.
 */
import { gsap, ScrollTrigger, prefersReducedMotion } from "./gsap";

const tablist = document.querySelector<HTMLElement>('[role="tablist"]');
const indicator = document.querySelector<HTMLElement>("[data-tab-indicator]");

if (tablist && indicator) {
  const tabs = [...tablist.querySelectorAll<HTMLButtonElement>('[role="tab"]')];
  const panels = new Map(
    [...document.querySelectorAll<HTMLElement>("[data-panel]")].map((p) => [p.dataset.panel, p]),
  );

  /** Tab offsets are measured against the track, which shares the tablist's box. */
  const measure = (tab: HTMLElement) => {
    const base = tablist.getBoundingClientRect();
    const box = tab.getBoundingClientRect();
    return { x: box.left - base.left, w: box.width };
  };

  function moveIndicator(tab: HTMLElement, animate: boolean) {
    const { x, w } = measure(tab);
    const to = { x, width: w };

    if (!animate || prefersReducedMotion()) {
      gsap.set(indicator!, to);
      return;
    }
    gsap.to(indicator!, { ...to, duration: 0.4, ease: "expo", overwrite: true });
  }

  /**
   * The Talent tab carries its own CTA copy (Figma 501:3810). The CTA lives
   * outside the tab panel, so the text is swapped here rather than rendered
   * twice; the default is captured on load so switching back restores it.
   */
  const ctaTitle = document.querySelector<HTMLElement>("[data-cta-title]");
  const ctaBody = document.querySelector<HTMLElement>("[data-cta-body]");
  const defaultCta = { title: ctaTitle?.textContent ?? "", body: ctaBody?.textContent ?? "" };
  const talentCta = {
    title: "Send us your next open role",
    body: "We\u2019ll match an interviewer, run the round, and have a scorecard in your inbox before your next stand-up.",
  };

  function setCta(tabId: string | undefined) {
    const copy = tabId === "talent" ? talentCta : defaultCta;
    if (ctaTitle) ctaTitle.textContent = copy.title;
    if (ctaBody) ctaBody.textContent = copy.body;
  }

  function select(id: string | undefined, { animate = true, focus = false } = {}) {
    const next = tabs.find((t) => t.dataset.tab === id);
    if (!next) return;

    tabs.forEach((tab) => {
      const on = tab === next;
      tab.setAttribute("aria-selected", String(on));
      tab.tabIndex = on ? 0 : -1;

      const panel = panels.get(tab.dataset.tab);
      if (panel) panel.hidden = !on;
    });

    setCta(next.dataset.tab);
    moveIndicator(next, animate);
    if (focus) next.focus();

    /* Below 900 the bar scrolls and the tab you just chose can be off screen —
       bring it into view. `nearest` so a tab already visible does not jump. */
    if (window.matchMedia("(max-width: 900px)").matches) {
      next.scrollIntoView({ behavior: prefersReducedMotion() ? "auto" : "smooth", inline: "nearest", block: "nearest" });
    }

    /* Panels differ enormously in height — the Talent pitch is several times a
       card grid — so every trigger below this point is wrong until ScrollTrigger
       re-measures. */
    ScrollTrigger.refresh();
  }

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => select(tab.dataset.tab));
  });

  /* Arrow keys move between tabs, which is what a tablist is expected to do. */
  tablist.addEventListener("keydown", (e) => {
    const step = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
    if (!step) return;

    const i = tabs.findIndex((t) => t.getAttribute("aria-selected") === "true");
    e.preventDefault();
    select(tabs[(i + step + tabs.length) % tabs.length]?.dataset.tab, { focus: true });
  });

  /* The seeded width comes from Figma and assumes the webfont; correct it
     once the real one has painted, and again whenever the row reflows. */
  const sync = () => {
    const active = tabs.find((t) => t.getAttribute("aria-selected") === "true");
    if (active) moveIndicator(active, false);
  };

  document.fonts?.ready.then(sync);
  window.addEventListener("resize", sync);
  sync();
}
