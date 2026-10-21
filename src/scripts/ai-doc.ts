/**
 * Document & Data card — an extraction pass over the DocArt figure.
 *
 * A scan band runs down the page. As it crosses each marked passage the
 * passage tints, its connector lights, a pulse carries the read along it,
 * and the field's value types in. When the third lands the caption lights,
 * the card holds, then everything clears together and the pass repeats.
 *
 * The static render is the finished frame (all fields filled), so with JS
 * off or under reduced motion the card is exactly Figma's. Paused off screen.
 */
import { gsap, ScrollTrigger, prefersReducedMotion } from "./gsap";

const SCAN = 2.6; // seconds for the band to cross the page
const PULSE = 0.55; // connector travel
const HOLD = 1.8; // finished card on screen before clearing
const CLEAR = 0.5;
const DIM = 0.3; // resting opacity of an unread connector / field

const root = document.querySelector<HTMLElement>("[data-doc]");

if (root && !prefersReducedMotion()) {
  const page = root.querySelector<HTMLElement>("[data-doc-page]")!;
  const scan = root.querySelector<HTMLElement>("[data-doc-scan]")!;
  const marks = [...root.querySelectorAll<HTMLElement>("[data-doc-mark]")];
  const links = [...root.querySelectorAll<SVGPathElement>("[data-doc-link]")];
  const pulses = [...root.querySelectorAll<SVGCircleElement>("[data-doc-pulse]")];
  const fields = [...root.querySelectorAll<HTMLElement>("[data-doc-field]")];
  const values = [...root.querySelectorAll<HTMLElement>("[data-doc-value]")];
  const caption = root.querySelector<HTMLElement>("[data-doc-caption]")!;

  const pageH = page.clientHeight;
  const bandH = scan.offsetHeight;
  // The band's leading edge is its bottom; it reads a mark when that edge
  // reaches the mark's centre line.
  const travel = pageH + bandH;
  const readAt = marks.map((m) => ((m.offsetTop + m.offsetHeight / 2 + bandH) / travel) * SCAN);

  const along = (path: SVGPathElement, dot: SVGCircleElement) => {
    const len = path.getTotalLength();
    const s = { p: 0 };
    return gsap.to(s, {
      p: 1,
      duration: PULSE,
      ease: "power1.inOut",
      onStart: () => void gsap.set(dot, { opacity: 1 }),
      onUpdate: () => {
        const pt = path.getPointAtLength(s.p * len);
        dot.setAttribute("cx", String(pt.x));
        dot.setAttribute("cy", String(pt.y));
      },
      onComplete: () => void gsap.to(dot, { opacity: 0, duration: 0.2 }),
    });
  };

  const tl = gsap.timeline({ repeat: -1, paused: true });

  // Opening state, pinned at t=0 so every lap starts clean.
  tl.set(scan, { y: -bandH, opacity: 1 }, 0)
    .set(links, { opacity: DIM }, 0)
    .set(fields, { opacity: 0.55 }, 0)
    .set(values, { clipPath: "inset(0 100% 0 0)" }, 0)
    .set(pulses, { opacity: 0 }, 0)
    .set(caption, { opacity: 0.35 }, 0)
    .call(() => marks.forEach((m) => m.classList.remove("is-read")), [], 0);

  tl.to(scan, { y: pageH, duration: SCAN, ease: "none" }, 0);
  tl.to(scan, { opacity: 0, duration: 0.3 }, SCAN - 0.3);

  marks.forEach((m, i) => {
    const t = readAt[i];
    tl.call(() => m.classList.add("is-read"), [], t);
    tl.to(links[i], { opacity: 1, duration: 0.25 }, t);
    tl.add(along(links[i], pulses[i]), t);
    tl.to(fields[i], { opacity: 1, duration: 0.3 }, t + PULSE - 0.15);
    const chars = (values[i].textContent ?? "").trim().length;
    tl.to(values[i], { clipPath: "inset(0 0% 0 0)", duration: chars * 0.035, ease: `steps(${chars})` }, t + PULSE);
  });

  const done = readAt[readAt.length - 1] + PULSE + 0.6;
  tl.to(caption, { opacity: 1, duration: 0.4 }, done);

  // Clear everything at once — staggering the exit reads as an undo.
  const clear = done + HOLD;
  tl.to(values, { clipPath: "inset(0 100% 0 0)", duration: CLEAR, ease: "power2.in" }, clear);
  tl.to(fields, { opacity: 0.55, duration: CLEAR }, clear);
  tl.to(links, { opacity: DIM, duration: CLEAR }, clear);
  tl.to(caption, { opacity: 0.35, duration: CLEAR }, clear);
  tl.call(() => marks.forEach((m) => m.classList.remove("is-read")), [], clear);
  tl.to({}, { duration: 0.4 }, clear + CLEAR);

  tl.progress(0).pause();

  ScrollTrigger.create({
    trigger: root,
    start: "top bottom",
    end: "bottom top",
    onToggle: (self) => (self.isActive ? tl.play() : tl.pause()),
  });

  if (import.meta.env.DEV) Object.assign(window as unknown as Record<string, unknown>, { docTimeline: tl });
}
