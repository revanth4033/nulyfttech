/**
 * Where a capability-page section pins.
 *
 * Pinning at "top top" held the section against the top edge with the nav
 * over its first line and empty page below it. These sections pin
 * centred in the space under the nav instead, so the whole frame is in view
 * while its states play. If the viewport is too short to fit the section
 * under the nav, it pins with its top just below the nav.
 *
 * Returned as a function so ScrollTrigger re-evaluates it on resize.
 */
/** The floating nav card's bottom edge (48 down + 72 tall) — the space it
    takes when it is showing. Was 83, the old full-width bar. */
export const NAV_H = 120;

export const pinStart = (section: HTMLElement) => () => {
  const free = window.innerHeight - NAV_H;
  const h = section.offsetHeight;
  return free > h ? `center ${NAV_H + free / 2}px` : `top ${NAV_H}px`;
};
