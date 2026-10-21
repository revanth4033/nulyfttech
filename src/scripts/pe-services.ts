/**
 * What we do (Product Engineering) below 1280 — tap a card to lift it.
 *
 * On desktop the middle card is lifted and hovering another moves the lift
 * (pure CSS, PeServices.astro). A touch screen cannot hover, so below 1280
 * the cards become buttons: a tap lifts that card and settles the others.
 * It starts on the card Figma lifts. Nothing changes on its own.
 */
import { gsap } from "./gsap";

const row = document.querySelector<HTMLElement>("[data-pes-cards]");

if (row) {
  const cards = [...row.querySelectorAll<HTMLElement>("[data-pes-card]")];
  const start = cards.find((c) => c.classList.contains("pes__card--featured")) ?? cards[0];
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

    row.classList.add("is-tap");
    light(start);

    return () => {
      row.classList.remove("is-tap");
      cards.forEach((c, k) => {
        c.classList.remove("is-lit");
        ["role", "tabindex", "aria-pressed"].forEach((a) => c.removeAttribute(a));
        c.removeEventListener("click", handlers[k].onClick);
        c.removeEventListener("keydown", handlers[k].onKey);
      });
    };
  });
}
