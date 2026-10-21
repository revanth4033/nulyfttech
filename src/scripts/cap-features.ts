/**
 * Key Features — pinned, one tab per scroll step (every project).
 *
 * Same model as the Design Approach: the section pins, its scroll distance
 * is split into one band per tab, and crossing into a band lights that tab.
 * The scroll picks the state; CSS transitions and one tween carry it.
 *
 *   - the tab list: `is-on` moves to the active row (opacity, purple icon,
 *     ring — transitions in CSS)
 *   - the rail: a progress fill, 106.57px per tab and the full 476 on the
 *     last (Figma 637:3103 / 3574 / 3865)
 *   - the panel: screens and captions cross-fade
 *
 * Tabs are not clickable — scroll is the only driver, by request.
 *
 * Below 1280 there is no pin (a pin is expensive on a phone). The panel
 * sits above the list and a tap on a row selects it — the rows become
 * buttons there, and only there; nothing advances on its own. The rail
 * fills to the bottom of the active row, measured, since the rows wrap to
 * different heights.
 */
import { gsap, ScrollTrigger, prefersReducedMotion } from "./gsap";
import { pinStart } from "./cap-pin";

const STEP_VH = 55;
const RAIL_H = 476;
const STEP_H = 106.57;

const sections = [...document.querySelectorAll<HTMLElement>("[data-features]")];

sections.forEach((section) => {
  const rows = [...section.querySelectorAll<HTMLElement>("[data-feat-row]")];
  const shots = [...section.querySelectorAll<HTMLElement>("[data-feat-shot]")];
  const caps = [...section.querySelectorAll<HTMLElement>("[data-feat-cap]")];
  const bar = section.querySelector<HTMLElement>("[data-feat-bar]");
  const n = rows.length;
  let active = 0;
  let fluid = false;

  const barFor = (k: number) => {
    if (!fluid) return k === n - 1 ? RAIL_H : STEP_H * (k + 1);
    const rail = bar!.parentElement!.getBoundingClientRect();
    if (k === n - 1) return rail.height;
    return rows[k].getBoundingClientRect().bottom - rail.top;
  };

  function show(k: number, instant = false) {
    active = k;
    rows.forEach((r, i) => {
      r.classList.toggle("is-on", i === k);
      if (r.hasAttribute("role")) r.setAttribute("aria-pressed", String(i === k));
    });

    const d = instant ? 0 : 0.5;
    shots.forEach((s, i) => gsap.to(s, { opacity: i === k ? 1 : 0, duration: d, ease: "power2.out", overwrite: true }));
    caps.forEach((c, i) =>
      gsap.to(c, {
        opacity: i === k ? 1 : 0,
        visibility: i === k ? "visible" : "hidden",
        duration: d,
        ease: "power2.out",
        overwrite: true,
      }),
    );
    if (bar) gsap.to(bar, { height: barFor(k), duration: instant ? 0 : 0.6, ease: "power2.inOut", overwrite: true });
  }

  const mm = gsap.matchMedia();

  mm.add("(min-width: 1280px)", () => {
    if (prefersReducedMotion()) return;

    ScrollTrigger.create({
      trigger: section,
      start: pinStart(section),
      invalidateOnRefresh: true,
      end: `+=${n * STEP_VH}%`,
      pin: true,
      onUpdate: (self) => {
        const k = Math.min(n - 1, Math.floor(self.progress * n));
        if (k !== active) show(k);
      },
    });

    return () => show(0, true);
  });

  mm.add("(max-width: 1279px)", () => {
    fluid = true;
    show(active, true);

    const pick = (k: number) => k !== active && show(k);
    const handlers = rows.map((row, k) => {
      const onClick = () => pick(k);
      const onKey = (e: KeyboardEvent) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          pick(k);
        }
      };
      row.setAttribute("role", "button");
      row.setAttribute("tabindex", "0");
      row.addEventListener("click", onClick);
      row.addEventListener("keydown", onKey);
      return { onClick, onKey };
    });

    return () => {
      rows.forEach((row, k) => {
        row.removeAttribute("role");
        row.removeAttribute("tabindex");
        row.removeEventListener("click", handlers[k].onClick);
        row.removeEventListener("keydown", handlers[k].onKey);
      });
      fluid = false;
      show(0, true);
    };
  });
});
