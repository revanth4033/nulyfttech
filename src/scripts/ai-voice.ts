/**
 * Voice & Conversational card — a live conversation over the VoiceArt figure.
 *
 * Each lap, one channel takes the call: it lights and a pulse runs in along
 * its line, the waveform comes alive, "Understands, replies, records" lights
 * word by word, then a pulse runs out to each outcome and it ticks — Lead
 * Qualified, Demo booked, CRM Updated. The next lap starts from the other
 * channel.
 *
 * The waveform is driven off the ticker rather than tweened per bar: every
 * bar keeps its Figma height and is scaled by a pair of travelling sines
 * whose amplitude the timeline raises and lowers, so it idles quietly
 * between turns instead of freezing. Paused off screen; static (Figma's
 * frame, every outcome ticked) under reduced motion.
 *
 * The connector paths and their pulses come from whichever wiring is on
 * screen: the desktop flow, or the vertical phone one (VoiceArt.astro),
 * so the timeline is built per breakpoint and rebuilt when it flips.
 */
import { gsap, ScrollTrigger, prefersReducedMotion } from "./gsap";

const PULSE = 0.6;
const WORD = 0.55; // between action words
const OUT = 0.5; // between outcomes
const HOLD = 1.4;
const IDLE = 0.18; // waveform amplitude between turns
const DIM = 0.3;

const root = document.querySelector<HTMLElement>("[data-voice]");

const build = (root: HTMLElement, set: "d" | "m") => {
  const links = root.querySelector<SVGSVGElement>(`[data-vo-links="${set}"]`)!;
  const channels = [...root.querySelectorAll<HTMLElement>("[data-vo-channel]")];
  const ins = [...links.querySelectorAll<SVGPathElement>("[data-vo-in]")];
  const outs = [...links.querySelectorAll<SVGPathElement>("[data-vo-out]")];
  const pulses = [...links.querySelectorAll<SVGCircleElement>("[data-vo-pulse]")];
  const words = [...root.querySelectorAll<HTMLElement>("[data-vo-word]")];
  const pills = [...root.querySelectorAll<HTMLElement>("[data-vo-out-pill]")];
  const bars = [...root.querySelectorAll<HTMLElement>("[data-vo-bar]")];

  root.classList.add("is-live");

  /* --- waveform ----------------------------------------------------------- */

  const wave = { amp: IDLE };
  let clock = 0;
  const drawWave = (_t: number, dt: number) => {
    clock += dt / 1000;
    bars.forEach((b, i) => {
      const f = 0.5 + 0.5 * Math.sin(clock * 7.1 - i * 0.55) * Math.sin(clock * 2.6 + i * 0.21);
      // Tops out at the drawn height, so the live wave never outgrows Figma's.
      b.style.transform = `scaleY(${(0.3 + 0.7 * wave.amp * f + 0.06 * (1 - wave.amp) * f).toFixed(3)})`;
    });
  };

  /* --- one turn ----------------------------------------------------------- */

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

  const reset = () => {
    channels.forEach((c) => c.classList.remove("is-live"));
    words.forEach((w) => w.classList.remove("is-on"));
    pills.forEach((p) => p.classList.remove("is-done"));
  };

  const turn = (c: number) => {
    const t = gsap.timeline();
    t.call(() => channels[c].classList.add("is-live"), [], 0);
    t.to(ins[c], { opacity: 1, duration: 0.3 }, 0);
    t.add(along(ins[c], pulses[c]), 0.2);

    const talk = 0.2 + PULSE;
    t.to(wave, { amp: 1, duration: 0.5, ease: "power2.out" }, talk);
    words.forEach((w, i) => t.call(() => w.classList.add("is-on"), [], talk + 0.2 + i * WORD));

    const act = talk + 0.2 + words.length * WORD;
    outs.forEach((o, i) => {
      const at = act + i * OUT;
      t.to(o, { opacity: 1, duration: 0.25 }, at);
      t.add(along(o, pulses[ins.length + i]), at);
      t.call(() => pills[i].classList.add("is-done"), [], at + PULSE - 0.05);
    });

    const end = act + (outs.length - 1) * OUT + PULSE;
    t.to(wave, { amp: IDLE, duration: 0.8, ease: "power2.inOut" }, end);
    t.call(() => channels[c].classList.remove("is-live"), [], end + HOLD);
    t.to([ins[c], ...outs], { opacity: DIM, duration: 0.4 }, end + HOLD);
    t.call(() => words.forEach((w) => w.classList.remove("is-on")), [], end + HOLD);
    t.call(() => pills.forEach((p) => p.classList.remove("is-done")), [], end + HOLD);
    t.to({}, { duration: 0.6 }, end + HOLD);
    return t;
  };

  const tl = gsap.timeline({ repeat: -1, paused: true });
  // Opening state, pinned at t=0 so lap two cannot inherit lap one's end.
  tl.set([...ins, ...outs], { opacity: DIM }, 0)
    .set(pulses, { opacity: 0 }, 0)
    .set(wave, { amp: IDLE }, 0)
    .call(reset, [], 0);
  tl.add(turn(0), 0.3);
  tl.add(turn(1));

  tl.progress(0).pause();
  drawWave(0, 0);

  const st = ScrollTrigger.create({
    trigger: root,
    start: "top bottom",
    end: "bottom top",
    onToggle: (self) => {
      if (self.isActive) {
        tl.play();
        gsap.ticker.add(drawWave);
      } else {
        tl.pause();
        gsap.ticker.remove(drawWave);
      }
    },
  });

  if (import.meta.env.DEV) Object.assign(window as unknown as Record<string, unknown>, { voiceTimeline: tl });

  return () => {
    tl.kill();
    st.kill();
    gsap.ticker.remove(drawWave);
    reset();
    root.classList.remove("is-live");
    gsap.set([...ins, ...outs, ...pulses], { clearProps: "opacity" });
    bars.forEach((b) => (b.style.transform = ""));
  };
};

if (root && !prefersReducedMotion()) {
  const mm = gsap.matchMedia();
  mm.add("(min-width: 701px)", () => build(root, "d"));
  mm.add("(max-width: 700px)", () => build(root, "m"));
}
