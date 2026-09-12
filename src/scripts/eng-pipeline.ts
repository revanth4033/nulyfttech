/**
 * Engineering card — the build pipeline lighting up.
 *
 * The five Figma frames are cumulative: each stage lights and stays lit until
 * the whole pipeline is up. Then the wave keeps going rather than resetting —
 * the stages un-light in the same top-to-bottom order, so what travels down
 * the card is a band, not a pipeline undoing itself.
 *
 * Three things move per stage: the chip cross-fades from glass to white (and
 * its text from white to ink), the node's glow layers fade up, and the lit
 * segment of the spine advances to that node. On the way out the segment's
 * *top* edge advances instead, so the band is eaten from above and leaves
 * nothing behind.
 */
import { gsap, ScrollTrigger, registerSection } from "./gsap";
import { BODY_H, TIMING, outFill, stages } from "../data/engineering";

const INK = "#161320";

registerSection(".tech", ({ root }) => {
  const scope = root.querySelector<HTMLElement>("[data-pipeline]");
  if (!scope) return;

  const spine = scope.querySelector<HTMLElement>("[data-spine]");
  const rows = Array.from(scope.querySelectorAll<HTMLElement>("[data-stage]"));
  if (!spine || rows.length !== stages.length) return;

  const parts = rows.map((row) => ({
    lit: row.querySelector<HTMLElement>("[data-chip-lit]"),
    glow: Array.from(row.querySelectorAll<HTMLElement>("[data-glow] > *")),
    chip: row.querySelector<HTMLElement>("[data-chip]"),
  }));

  // The lit segment is a clip on a full-height white rail: `--lit-a` is the
  // inset from the top, `--lit-b` from the bottom. Growing `--lit-b` down
  // extends the band; growing `--lit-a` eats it from above.
  const top = (y: number) => ({ "--lit-a": `${y}px` });
  const bottom = (y: number) => ({ "--lit-b": `${BODY_H - y}px` });

  const reset = () => {
    gsap.set(spine, { ...top(0), ...bottom(0) });
    parts.forEach((p) => {
      gsap.set([p.lit, p.glow], { opacity: 0 });
      gsap.set(p.chip, { color: "#ffffff" });
    });
  };
  reset();

  const tl = gsap.timeline({ repeat: -1, paused: true });

  // --- the wave arrives -----------------------------------------------
  stages.forEach((st, i) => {
    const at = i * TIMING.step;
    const p = parts[i];
    tl.to(p.lit, { opacity: 1, duration: TIMING.on, ease: "swift" }, at)
      // A short overshoot on the node so the moment of lighting has a flare
      // rather than just arriving at full brightness.
      .fromTo(
        p.glow,
        { opacity: 0 },
        { opacity: 1.35, duration: TIMING.on * 0.45, ease: "power2.out" },
        at,
      )
      .to(p.glow, { opacity: 1, duration: TIMING.on * 0.75, ease: "power1.inOut" }, at + TIMING.on * 0.45)
      .to(p.chip, { color: INK, duration: TIMING.on, ease: "swift" }, at)
      .to(spine, { ...bottom(st.fill), duration: TIMING.on, ease: "swift" }, at);
  });

  // --- and moves on ----------------------------------------------------
  const out = (stages.length - 1) * TIMING.step + TIMING.on + TIMING.hold;

  stages.forEach((_, i) => {
    const at = out + i * TIMING.outStep;
    const p = parts[i];
    tl.to([p.lit, p.glow], { opacity: 0, duration: TIMING.off, ease: "swift" }, at)
      .to(p.chip, { color: "#ffffff", duration: TIMING.off, ease: "swift" }, at)
      .to(spine, { ...top(outFill[i]), duration: TIMING.off, ease: "swift" }, at);
  });

  // Empty beat, then the lap restarts from a clean slate. Both edges have met
  // at the bottom of the rail by now, so resetting them shows nothing.
  tl.set({}, {}, out + (stages.length - 1) * TIMING.outStep + TIMING.off + TIMING.tail);
  tl.eventCallback("onRepeat", reset);

  const st = ScrollTrigger.create({
    trigger: scope,
    start: "top bottom",
    end: "bottom top",
    onToggle: (self) => (self.isActive ? tl.play() : tl.pause()),
  });

  if (st.isActive) tl.play();
});
