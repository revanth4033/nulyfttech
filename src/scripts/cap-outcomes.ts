/**
 * Product Outcomes below 1280 — tap a card to light it.
 *
 * On desktop the top-right card is lit and hovering another moves the
 * highlight (pure CSS, CapProject.astro). A touch screen has no hover, so
 * below 1280 the cards become buttons: a tap lights that card and returns
 * the others to rest. It starts on the card Figma lights. Nothing changes
 * on its own.
 */
import { gsap } from "./gsap";

document.querySelectorAll<HTMLElement>("[data-outcomes]").forEach((grid) => {
  const cards = [...grid.querySelectorAll<HTMLElement>("[data-out-card]")];
  const mm = gsap.matchMedia();

  mm.add("(max-width: 1279px)", () => {
    const light = (on: HTMLElement) =>
      cards.forEach((c) => {
        c.classList.toggle("is-lit", c === on);
        c.setAttribute("aria-pressed", String(c === on));
      });

    const handlers = cards.map((card) => {
      const onClick = () => light(card);
      const onKey = (e: KeyboardEvent) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          light(card);
        }
      };
      card.setAttribute("role", "button");
      card.setAttribute("tabindex", "0");
      card.addEventListener("click", onClick);
      card.addEventListener("keydown", onKey);
      return { onClick, onKey };
    });

    grid.classList.add("is-tap");
    light(cards[0]);

    return () => {
      grid.classList.remove("is-tap");
      cards.forEach((c, k) => {
        c.classList.remove("is-lit");
        ["role", "tabindex", "aria-pressed"].forEach((a) => c.removeAttribute(a));
        c.removeEventListener("click", handlers[k].onClick);
        c.removeEventListener("keydown", handlers[k].onKey);
      });
    };
  });
});
