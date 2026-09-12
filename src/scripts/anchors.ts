/**
 * Same-page anchor navigation.
 *
 * ScrollSmoother drives scrolling through a transformed wrapper, so a native
 * hash jump lands in the wrong place and fights the smoother on the way. Every
 * in-page link is handled here instead.
 *
 * Links whose target does not exist yet are swallowed rather than followed —
 * a bare `#studio` would otherwise send the browser to the top of the page.
 */
import { ScrollSmoother } from "./gsap";

/** Clear the fixed nav, plus a little air. */
const OFFSET = 100;

const find = (hash: string): HTMLElement | null => {
  if (!hash || hash === "#") return null;
  try {
    return document.querySelector<HTMLElement>(hash);
  } catch {
    return null; // not a valid selector
  }
};

function goTo(el: HTMLElement, smooth: boolean) {
  const smoother = ScrollSmoother.get();
  if (smoother) {
    smoother.scrollTo(el, smooth, `top ${OFFSET}px`);
    return;
  }
  // Reduced motion, or the smoother never booted.
  const y = el.getBoundingClientRect().top + window.scrollY - OFFSET;
  window.scrollTo({ top: y, behavior: smooth ? "smooth" : "auto" });
}

document.addEventListener("click", (e) => {
  if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;

  const link = (e.target as Element | null)?.closest?.<HTMLAnchorElement>('a[href*="#"]');
  if (!link || link.target === "_blank") return;

  // Only same-document links.
  const url = new URL(link.href, location.href);
  if (url.pathname !== location.pathname || url.origin !== location.origin) return;
  if (!url.hash) return;

  e.preventDefault();

  const el = find(url.hash);
  if (!el) return; // nothing to go to yet

  goTo(el, true);
  history.replaceState(null, "", url.hash);
});

/* Landing on /#work should also resolve, and only once the smoother has
   measured — otherwise the browser's own jump leaves it out of sync. */
if (location.hash) {
  const el = find(location.hash);
  if (el) {
    requestAnimationFrame(() => requestAnimationFrame(() => goTo(el, false)));
  }
}
