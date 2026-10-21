/**
 * Product Engineering hero — the "engineering layer" diagram comes alive.
 *
 *   - A pulse leaves the hub along each connector and runs out to its card;
 *     the card's chip glows as it lands. Five lines, staggered, so the hub
 *     reads as feeding every layer in turn rather than flashing at once.
 *   - The dashed ring turns slowly (CSS, see PeHero.astro).
 *
 * Above 560 the lines are Figma's connector exports, each drawn hub -> card,
 * so the pulse simply follows the path forward. On a phone the diagram is
 * re-proportioned and that art no longer meets anything, so the wires are
 * drawn here from the laid-out hub and cards (and redrawn on resize): out of
 * the hub's halo on a lane of their own, a rounded elbow, then across to the
 * card's inner edge. Same pulse, same glow.
 *
 * Paused off screen. Under reduced motion there is no pulse, but the phone
 * wires are still drawn — they are part of the picture, not the motion.
 */
import { gsap, ScrollTrigger, prefersReducedMotion } from "./gsap";

const SVG_NS = "http://www.w3.org/2000/svg";
const TRAVEL = 1.4; // seconds along one line
const STAGGER = 0.9; // between lines
const PAUSE = 1.2; // after the last line lands, before the next round

const diagram = document.querySelector<HTMLElement>("[data-pe-diagram]");

/** A soft halo under a bright core, appended to the path's own SVG. */
function makePulse(svg: SVGSVGElement) {
  const halo = document.createElementNS(SVG_NS, "circle");
  halo.setAttribute("r", "5");
  halo.setAttribute("fill", "rgba(131, 77, 251, 0.25)");
  const core = document.createElementNS(SVG_NS, "circle");
  core.setAttribute("r", "2.6");
  core.setAttribute("fill", "#834dfb");
  const pulse = document.createElementNS(SVG_NS, "g");
  pulse.append(halo, core);
  pulse.setAttribute("opacity", "0");
  svg.setAttribute("overflow", "visible");
  svg.append(pulse);
  return pulse;
}

/** One round: a pulse down each path in turn, its chip glowing on arrival. */
function buildRound(paths: SVGPathElement[], chips: HTMLElement[]) {
  const round = gsap.timeline({ repeat: -1, paused: true, repeatDelay: PAUSE });
  const pulses: SVGGElement[] = [];

  paths.forEach((path, i) => {
    const pulse = makePulse(path.ownerSVGElement!);
    pulses.push(pulse);
    const state = { t: 0 };
    const place = () => {
      // Length read live: the phone wires are redrawn on resize.
      let len = 0;
      try {
        len = path.getTotalLength();
      } catch {
        return; // not rendered
      }
      const p = path.getPointAtLength(state.t * len);
      pulse.setAttribute("transform", `translate(${p.x} ${p.y})`);
    };

    const at = i * STAGGER;
    round
      .set(state, { t: 0, onComplete: place }, at)
      .to(pulse, { attr: { opacity: 1 }, duration: 0.2, ease: "none" }, at)
      .to(state, { t: 1, duration: TRAVEL, ease: "power1.inOut", onUpdate: place }, at)
      .to(pulse, { attr: { opacity: 0 }, duration: 0.25, ease: "none" }, at + TRAVEL - 0.15);

    const chip = chips[i];
    if (chip) {
      round
        .to(chip, { "--glow": 1, duration: 0.25, ease: "power2.out" }, at + TRAVEL - 0.1)
        .to(chip, { "--glow": 0, duration: 0.9, ease: "power2.in" }, at + TRAVEL + 0.25);
    }
  });

  const st = ScrollTrigger.create({
    trigger: diagram,
    start: "top bottom",
    end: "bottom top",
    onToggle: (self) => (self.isActive ? round.play() : round.pause()),
  });

  return () => {
    round.kill();
    st.kill();
    pulses.forEach((p) => p.remove());
    chips.forEach((c) => c.style.removeProperty("--glow"));
  };
}

if (diagram) {
  const chips = [...diagram.querySelectorAll<HTMLElement>("[data-pe-chip]")];
  const still = prefersReducedMotion();
  const mm = gsap.matchMedia();

  mm.add("(min-width: 561px)", () => {
    if (still) return;
    const paths = [...diagram.querySelectorAll<HTMLElement>("[data-pe-conn]")]
      .map((conn) => conn.querySelector<SVGPathElement>("svg path[stroke]"))
      .filter((p): p is SVGPathElement => !!p);
    return buildRound(paths, chips);
  });

  mm.add("(max-width: 560px)", () => {
    const svg = diagram.querySelector<SVGSVGElement>("[data-pe-wires]")!;
    const halo = diagram.querySelector<HTMLElement>(".peh__hub-halo")!;
    const cards = [...diagram.querySelectorAll<HTMLElement>("[data-pe-card]")];

    // Each wire leaves the halo on its own vertical lane (an offset from the
    // hub's centre line), so wires on the same side never run on top of one
    // another. Order: Architecture, AI, Infrastructure, Integrations, Data.
    const LANES = [18, -38, 52, -28, 36];

    const wires = cards.map(() => {
      const path = document.createElementNS(SVG_NS, "path");
      path.setAttribute("class", "peh__wire");
      const end = document.createElementNS(SVG_NS, "circle");
      end.setAttribute("r", "2.5");
      end.setAttribute("class", "peh__wire-end");
      svg.append(path, end);
      return { path, end };
    });

    const draw = () => {
      const box = diagram.getBoundingClientRect();
      const h = halo.getBoundingClientRect();
      const cx = h.left + h.width / 2 - box.left;
      const cy = h.top + h.height / 2 - box.top;
      const R = h.width / 2;
      svg.setAttribute("viewBox", `0 0 ${box.width} ${box.height}`);

      cards.forEach((card, i) => {
        const c = card.getBoundingClientRect();
        const right = c.left + c.width / 2 - box.left > cx;
        const ex = right ? c.left - box.left : c.right - box.left; // card's inner edge
        const ey = c.top + c.height / 2 - box.top;
        const lx = cx + LANES[i];
        const up = ey < cy;
        const sy = cy + (up ? -1 : 1) * Math.sqrt(Math.max(0, R * R - LANES[i] * LANES[i]));
        const r = 8; // elbow radius
        const dx = right ? 1 : -1;
        const dy = up ? -1 : 1;
        const d = `M${lx} ${sy}V${ey - dy * r}Q${lx} ${ey} ${lx + dx * r} ${ey}H${ex}`;
        wires[i].path.setAttribute("d", d);
        wires[i].end.setAttribute("cx", String(ex));
        wires[i].end.setAttribute("cy", String(ey));
      });
    };

    draw();
    const ro = new ResizeObserver(draw);
    ro.observe(diagram);
    const stop = still
      ? () => {}
      : buildRound(
          wires.map((w) => w.path),
          chips,
        );

    return () => {
      ro.disconnect();
      stop();
      svg.replaceChildren();
    };
  });
}
