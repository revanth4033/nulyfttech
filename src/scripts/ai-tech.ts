/**
 * AI & Automation — the technology ecosystem: an ambient float, and a hover
 * (tap on touch).
 *
 * Float: a CSS animation on each tile (see AiTechnology.astro — it moved off
 * GSAP for performance). This script only marks the section `.is-idle` while
 * it is off screen so the 24 animations stop; hovering pauses a tile through
 * `.is-on` in CSS.
 *
 * Pointing at a tile lifts it, lights it and shows its name, and brightens
 * the ring it sits on. All of that is CSS (`.is-on` on the tile, `.is-lit`
 * on the ring); this only decides which tile is active. A line from the tile
 * to the hub with a travelling dot was tried and removed at the user's
 * request.
 *
 * On devices without a fine hover pointer a tap toggles a tile, and a tap
 * anywhere else clears it. The float is the only thing that runs on its own;
 * the highlight never does.
 */
const root = document.querySelector<HTMLElement>(".atech");

if (root) {
  const tiles = Array.from(root.querySelectorAll<HTMLElement>("[data-tile]"));
  const rings = Array.from(root.querySelectorAll<SVGCircleElement>(".atech__ring"));
  const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
  let active: HTMLElement | null = null;

  // Stop the float while the section is off screen.
  root.classList.add("is-idle");
  new IntersectionObserver(([entry]) => root.classList.toggle("is-idle", !entry.isIntersecting)).observe(root);

  const activate = (tile: HTMLElement) => {
    if (active === tile) return;
    active?.classList.remove("is-on");
    active = tile;
    tile.classList.add("is-on");
    rings.forEach((r) => r.classList.toggle("is-lit", r.dataset.ring === tile.dataset.ring));
  };

  const deactivate = () => {
    if (!active) return;
    active.classList.remove("is-on");
    active = null;
    rings.forEach((r) => r.classList.remove("is-lit"));
  };

  tiles.forEach((tile) => {
    tile.addEventListener("pointerenter", (e) => {
      if (e.pointerType === "mouse" && fine.matches) activate(tile);
    });
    tile.addEventListener("pointerleave", (e) => {
      if (e.pointerType === "mouse" && fine.matches && active === tile) deactivate();
    });
    // Touch and pen: a tap toggles.
    tile.addEventListener("click", (e) => {
      if (fine.matches) return;
      e.stopPropagation();
      if (active === tile) deactivate();
      else activate(tile);
    });
  });

  document.addEventListener("click", (e) => {
    if (!fine.matches && active && !(e.target as Element).closest?.("[data-tile]")) deactivate();
  });
}
