/**
 * Hero animation.
 *
 * Reference: the Globant hero loop. That one is a pre-rendered MP4, so the
 * beats are reproduced here as a GSAP timeline:
 *
 *   intro      copy resolves in
 *   pill       the CTA flies in, a cursor arrives and clicks it   (plays once)
 *   scene 1    two capability cards fly in, settle, drift
 *   scene 2    they blur out, the next pair flies in
 *   stat       the pair clears and the summary card builds itself
 *   -> loops back to scene 1
 *
 * The cursor click is the narrative hinge: everything after it reads as the
 * consequence of pressing the button, so it only plays on the first pass.
 */
import { gsap, ScrollTrigger, registerSection, splitWhenReady } from "./gsap";

/* --------------------------------------------------------------------------
   Directional motion blur

   DOM has no real motion blur. An isotropic `filter: blur()` just looks
   out of focus; blurring along the axis of travel is what reads as speed.
   So each moving group gets its own SVG feGaussianBlur with a horizontal-only
   stdDeviation, attached during flight and removed the moment it lands.
   -------------------------------------------------------------------------- */
let filterSeq = 0;

function createMotionBlur(el: HTMLElement) {
  const id = `hero-mb-${filterSeq++}`;
  const ns = "http://www.w3.org/2000/svg";

  const svg = document.createElementNS(ns, "svg");
  svg.setAttribute("width", "0");
  svg.setAttribute("height", "0");
  svg.style.cssText = "position:absolute;width:0;height:0";

  const filter = document.createElementNS(ns, "filter");
  filter.setAttribute("id", id);
  filter.setAttribute("x", "-50%");
  filter.setAttribute("y", "-25%");
  filter.setAttribute("width", "200%");
  filter.setAttribute("height", "150%");
  filter.setAttribute("color-interpolation-filters", "sRGB");

  const blur = document.createElementNS(ns, "feGaussianBlur");
  blur.setAttribute("in", "SourceGraphic");
  blur.setAttribute("stdDeviation", "0 0");

  filter.appendChild(blur);
  const defs = document.createElementNS(ns, "defs");
  defs.appendChild(filter);
  svg.appendChild(defs);
  el.parentElement?.appendChild(svg);

  const state = { amount: 0 };

  return {
    /** Tween-friendly: 0 removes the filter entirely so idle frames are cheap. */
    set(amount: number) {
      state.amount = amount;
      if (amount <= 0.05) {
        el.style.filter = "";
        blur.setAttribute("stdDeviation", "0 0");
      } else {
        blur.setAttribute("stdDeviation", `${amount} 0`);
        el.style.filter = `url(#${id})`;
      }
    },
    get amount() {
      return state.amount;
    },
    proxy: state,
  };
}

/** Tween a group's blur from `from` to `to` over `duration`. */
function blurTween(
  tl: gsap.core.Timeline,
  mb: ReturnType<typeof createMotionBlur>,
  from: number,
  to: number,
  duration: number,
  position: gsap.Position,
) {
  const o = { v: from };
  mb.set(from);
  tl.to(
    o,
    {
      v: to,
      duration,
      ease: "power2.out",
      onUpdate: () => mb.set(o.v),
      onComplete: () => mb.set(to),
    },
    position,
  );
}

/* -------------------------------------------------------------------------- */

registerSection(".hero", ({ root }) => {
  const q = gsap.utils.selector(root);

  const stage = q("[data-hero-stage]")[0] as HTMLElement | undefined;
  const glow = q("[data-stage-glow]")[0] as HTMLElement | undefined;
  const pillGroup = q('[data-scene="pill"]')[0] as HTMLElement | undefined;
  const pill = q("[data-stage-pill]")[0] as HTMLElement | undefined;
  const cursor = q("[data-stage-cursor]")[0] as HTMLElement | undefined;
  const cardScenes = q('[data-scene="cards"]') as HTMLElement[];
  const statScene = q('[data-scene="stat"]')[0] as HTMLElement | undefined;

  /* ---------------- intro: the copy resolves in ---------------- */

  const introEls = q("[data-animate]");
  const title = q(".hero__title")[0] as HTMLElement | undefined;

  gsap.set(introEls, { visibility: "visible" });

  const intro = gsap.timeline({ defaults: { ease: "expo", duration: 0.9 } });
  let titleTween: gsap.core.Tween | null = null;

  if (title) {
    // Split after webfonts land — splitting against the fallback face
    // produces the wrong line breaks.
    splitWhenReady(title, { type: "lines", mask: "lines", linesClass: "hero-line" }).then(
      (split) => {
        gsap.set(title, { visibility: "visible" });
        titleTween = gsap.from(split.lines, {
          yPercent: 115,
          duration: 1.1,
          ease: "expo",
          stagger: 0.09,
          delay: 0.15,
        });
        ScrollTrigger.refresh();
      },
    );
  }

  intro
    .from(q(".hero__eyebrow"), { y: 24, opacity: 0 }, 0.1)
    .from(q(".hero__body"), { y: 24, opacity: 0 }, 0.55)
    .from(q(".hero__actions"), { y: 24, opacity: 0 }, 0.7);

  /* ---------------- stage ---------------- */

  if (!stage || !glow || !pillGroup || !pill || !cursor || !statScene) return;

  // Bind to consts so the null-checks above survive into the closures below.
  const glowEl = glow;
  const statEl = statScene;
  const cursorEl = cursor;

  const master = gsap.timeline({ paused: true });

  // Glow geometry, expressed as transforms off its CSS position (the card
  // scene). 1.23 scale lands exactly on the stat scene's 492x400.
  const GLOW = {
    pill: { x: -32, y: 19, scale: 1, opacity: 0.55 },
    cards: { x: 0, y: 0, scale: 1, opacity: 0.6 },
    stat: { x: -52, y: 16.5, scale: 1.23, opacity: 0.5 },
  };

  gsap.set([pillGroup, ...cardScenes, statScene], { opacity: 0 });
  gsap.set(glow, { ...GLOW.cards, opacity: 0 });

  const pillBlur = createMotionBlur(pill);

  /* --- act 1: the pill, and the click that starts everything (once) --- */

  const act1 = gsap.timeline();

  act1
    .set(pillGroup, { opacity: 1 })
    .to(glowEl, { ...GLOW.pill, duration: 0.8, ease: "power2.out" }, 0)
    .fromTo(
      pill,
      { x: 420, scale: 0.55, opacity: 0 },
      { x: 0, scale: 1, opacity: 1, duration: 0.62, ease: "expo" },
      0,
    )
    .fromTo(
      cursorEl,
      { x: -70, y: 80, opacity: 0 },
      { x: 0, y: 0, opacity: 1, duration: 0.5, ease: "power3.out" },
      0.55,
    )
    // the press
    .to(pill, { scale: 0.955, duration: 0.12, ease: "power2.in" }, 1.15)
    .to(cursorEl, { x: -4, y: -4, duration: 0.12, ease: "power2.in" }, 1.15)
    .to(pill, { scale: 1, duration: 0.28, ease: "back.out(3)" }, 1.27)
    .to(cursorEl, { x: 0, y: 0, duration: 0.28, ease: "back.out(3)" }, 1.27)
    // and out
    .to(cursorEl, { x: 60, y: 40, opacity: 0, duration: 0.35, ease: "power2.in" }, 1.75)
    .to(pill, { x: -280, opacity: 0, duration: 0.45, ease: "power2.in" }, 1.8)
    .set(pillGroup, { opacity: 0 });

  blurTween(act1, pillBlur, 26, 0, 0.55, 0);
  blurTween(act1, pillBlur, 0, 30, 0.4, 1.8);

  /* --- act 2: the card pairs --- */

  const cardSceneTl = (scene: HTMLElement) => {
    const cardA = scene.querySelector<HTMLElement>(".stage__card--a")!;
    const cardB = scene.querySelector<HTMLElement>(".stage__card--b")!;
    const blurA = createMotionBlur(cardA);
    const blurB = createMotionBlur(cardB);

    const tl = gsap.timeline();

    tl.set(scene, { opacity: 1 })
      .to(glowEl, { ...GLOW.cards, duration: 0.7, ease: "power2.out" }, 0)
      .fromTo(
        cardA,
        { x: 430, y: -34, scale: 0.82, opacity: 0 },
        { x: 0, y: 0, scale: 1, opacity: 1, duration: 0.66, ease: "expo" },
        0,
      )
      .fromTo(
        cardB,
        { x: 520, y: -12, scale: 0.82, opacity: 0 },
        { x: 0, y: 0, scale: 1, opacity: 1, duration: 0.66, ease: "expo" },
        0.1,
      );

    blurTween(tl, blurA, 30, 0, 0.6, 0);
    blurTween(tl, blurB, 30, 0, 0.6, 0.1);

    // idle drift — the pair breathes independently, like the reference
    tl.to(cardA, { y: -12, duration: 1.5, ease: "sine.inOut", yoyo: true, repeat: 1 }, 0.9)
      .to(cardB, { y: 10, duration: 1.7, ease: "sine.inOut", yoyo: true, repeat: 1 }, 0.75)
      .to({}, { duration: 0.4 }); // hold

    // out
    tl.to([cardA, cardB], {
      x: -170,
      y: -60,
      opacity: 0,
      duration: 0.42,
      ease: "power2.in",
      stagger: 0.05,
    });
    blurTween(tl, blurA, 0, 28, 0.42, "<");
    blurTween(tl, blurB, 0, 28, 0.42, "<");
    tl.set(scene, { opacity: 0 });

    return tl;
  };

  /* --- act 3: the summary card builds itself --- */

  const statSceneTl = () => {
    const parts = statEl.querySelectorAll<HTMLElement>("[data-stat-part]");
    const card = statEl.querySelector<HTMLElement>("[data-hero-stat]")!;
    const tl = gsap.timeline();

    tl.set(statEl, { opacity: 1 })
      .to(glowEl, { ...GLOW.stat, duration: 0.8, ease: "power2.out" }, 0)
      .fromTo(
        card,
        { scale: 0.93, y: 26, opacity: 0 },
        { scale: 1, y: 0, opacity: 1, duration: 0.7, ease: "expo" },
        0,
      )
      .fromTo(
        parts,
        { y: 18, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.55, ease: "power3.out", stagger: 0.13 },
        0.35,
      )
      .to({}, { duration: 2.1 })
      .to(card, { scale: 0.97, opacity: 0, duration: 0.45, ease: "power2.in" })
      // Hand the stage back empty. Without this the glow would still be at the
      // stat position/scale when the loop restarts, and snap on the next pass.
      .to(glowEl, { ...GLOW.cards, opacity: 0, duration: 0.45, ease: "power2.in" }, "<")
      .set(statEl, { opacity: 0 })
      .set(parts, { clearProps: "all" });

    return tl;
  };

  /* --- assemble --- */

  const loop = gsap.timeline({ repeat: -1 });
  loop.add(act1);
  cardScenes.forEach((scene) => loop.add(cardSceneTl(scene)));
  loop.add(statSceneTl());

  master.add(loop);

  /* ---------------- dev: scrub to any beat ---------------- */

  if (import.meta.env.DEV) {
    Object.assign(window as unknown as Record<string, unknown>, {
      heroTimeline: master,
      /**
       * Seek to a time and force a synchronous render, bypassing rAF.
       * Also settles the intro so comparison screenshots show the finished
       * copy rather than whatever frame the intro happened to stop on.
       */
      heroSeek: (t: number) => {
        intro.progress(1);
        titleTween?.progress(1);
        master.pause();
        master.time(t, false);
        gsap.ticker.tick();
        return master.time();
      },
    });
  }

  /* ---------------- playback control ---------------- */

  // Start the stage once the intro copy has had a moment.
  gsap.delayedCall(0.9, () => master.play());

  // Don't animate a hero nobody is looking at.
  ScrollTrigger.create({
    trigger: root,
    start: "top bottom",
    end: "bottom top",
    onToggle: ({ isActive }) => (isActive ? master.play() : master.pause()),
  });

  const onVisibility = () => {
    if (document.hidden) master.pause();
    else if (ScrollTrigger.isInViewport(root)) master.play();
  };
  document.addEventListener("visibilitychange", onVisibility);
  // Run once: a page that *loads* in a background tab never fires the event.
  onVisibility();
});
