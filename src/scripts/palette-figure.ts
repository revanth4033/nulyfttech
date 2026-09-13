/**
 * Colorography figure — the diagram draws itself, then answers the pointer.
 *
 * Two interactions, agreed with the user:
 *
 *  1. On scroll-in, once: the illustration fades up, then each leader draws
 *     outward from its anchor dot toward its label, and the label arrives as
 *     its own line lands, in reading order.
 *  2. Hovering (or focusing) a group dims the other three and lights that
 *     group's leader in its own hex. That half is pure CSS; see the section's
 *     styles. Only the hit targets are built here.
 *
 * Shared by all three case studies. The figure is an inlined SVG rather than a
 * flattened export, which is what makes any of this addressable; its groups are
 * tagged by `scripts/tag-palette.py` and rendered by `case/PaletteFigure.astro`.
 * Nothing here is page-specific — the colour count (four, four and six) and the
 * reading order both fall out of the geometry.
 *
 * **No DrawSVG.** The leaders are plain `<line>` elements, so a dash offset
 * animates them in two lines of code; registering the plugin would pin it into
 * every page's bundle for this one section.
 */
import { gsap, ScrollTrigger, registerSection } from "./gsap";

/** Rows within this many units count as the same band when ordering. */
const BAND = 60;
const DRIFT = 8;

const ART = 0.5;
const LEAD_AT = 0.25;
const STAGGER = 0.12;
const SEG1 = 0.25;
const SEG2 = 0.2;
const LABEL_AFTER = 0.3;
const LABEL = 0.4;

/** A transparent rect over the label, so the whole block is hoverable rather
    than only the glyph outlines — the text is paths, and the gaps between
    letters would otherwise drop the hover. */
function addHitArea(group: SVGGElement): void {
  const label = group.querySelector<SVGGElement>(".pal__label");
  if (!label) return;
  const b = label.getBBox();
  const pad = 8;
  const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
  rect.setAttribute("x", `${b.x - pad}`);
  rect.setAttribute("y", `${b.y - pad}`);
  rect.setAttribute("width", `${b.width + pad * 2}`);
  rect.setAttribute("height", `${b.height + pad * 2}`);
  rect.setAttribute("fill", "transparent");
  rect.setAttribute("class", "pal__hit");
  group.insertBefore(rect, group.firstChild);
}

/* The hit areas are built outside `registerSection`, which bails before its
   callback under `prefers-reduced-motion`. The hover is not motion and should
   survive that — without this, reduced-motion visitors would be left hovering
   the glyph outlines and falling through the gaps between letters. */
document.querySelectorAll<SVGGElement>(".palfig .pal__group").forEach(addHitArea);

registerSection(".palfig", ({ root }) => {
  const art = root.querySelector<SVGGElement>(".pal__art");
  const all = Array.from(root.querySelectorAll<SVGGElement>(".pal__group"));
  if (!art || all.length === 0) return;

  /* Order and drift are read off the geometry rather than a list of keys, so
     this serves all three case studies — two with four colours and one with
     six — without knowing any of their names. */
  const artMid = art.getBBox().x + art.getBBox().width / 2;
  const labelBox = (g: SVGGElement) =>
    g.querySelector<SVGGElement>(".pal__label")?.getBBox() ?? new DOMRect();

  const groups = all.slice().sort((a, b) => {
    const p = labelBox(a);
    const q = labelBox(b);
    return Math.round(p.y / BAND) - Math.round(q.y / BAND) || p.x - q.x;
  });

  const tl = gsap.timeline({ paused: true });

  tl.from(art, { autoAlpha: 0, y: 12, duration: ART, ease: "smooth" }, 0);

  groups.forEach((group, i) => {
    const at = LEAD_AT + i * STAGGER;
    const dot = group.querySelector<SVGGElement>(".pal__leader > g");
    const lines = Array.from(group.querySelectorAll<SVGLineElement>(".pal__leader line"));
    const label = group.querySelector<SVGGElement>(".pal__label");

    if (dot) {
      tl.from(dot, { scale: 0, transformOrigin: "50% 50%", duration: 0.25, ease: "back.out(2)" }, at);
    }

    /* Dash the line out and pull the offset back to zero — each line's own
       start point is the end nearest the dot, so they draw outward. */
    lines.forEach((line, n) => {
      const len = line.getTotalLength();
      gsap.set(line, { strokeDasharray: len, strokeDashoffset: len });
      tl.to(
        line,
        { strokeDashoffset: 0, duration: n === 0 ? SEG1 : SEG2, ease: "none" },
        at + (n === 0 ? 0 : SEG1),
      );
    });

    if (label) {
      /* A label left of the illustration is reached by a line travelling
         leftward, so it follows that line in — and vice versa. */
      const box = labelBox(group);
      const drift = box.x + box.width / 2 < artMid ? DRIFT : -DRIFT;
      tl.from(label, { autoAlpha: 0, x: drift, duration: LABEL, ease: "smooth" }, at + LABEL_AFTER);
    }
  });

  /* Plays once. Scrolling back up does not rewind it — the diagram has been
     drawn, and redrawing it every pass would read as a glitch. */
  ScrollTrigger.create({
    trigger: root,
    start: "top 75%",
    once: true,
    onEnter: () => tl.play(),
  });
});
