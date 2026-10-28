# Nulyft — Astro + GSAP

Static marketing site built section-by-section from a Figma design.
Every section must match the Figma frame exactly, including its animation.

> **New to this project? Read `HANDOFF.md` first.** It carries the history,
> how the user works, what is built, what is parked, and where the live thread
> of work is. This file is the technical reference; that one is the context.
> Neither is optional — most of the expensive mistakes in this build were
> things one of them already warned about.

## Reading a Figma frame

Three rules, each learned the hard way and each documented again per section
below:

1. **Reproduce the box, do not infer a layout.** If a frame's children are
   absolutely positioned, place them at those coordinates. Building the
   typography section with flex looked plausible and was wrong in every gap.
2. **Check what a node actually contains before exporting it.** The case-study
   hero's "card" frame is the whole row, copy included; exporting it put the
   headline on the page twice.
3. **Subtract shadow bleed.** Exports are routinely larger than their node —
   6.5px, 40px and 62px all appear in this build. Compare export size against
   node size before positioning anything by its frame coordinate.

## Stack

- **Astro 7** — static output, zero UI framework (no React/Vue). Plain `.astro` components.
- **GSAP 3.15** — all plugins are free in this version. Registered centrally in
  `src/scripts/gsap.ts`: ScrollTrigger, ScrollSmoother, SplitText, CustomEase,
  Flip, DrawSVG, MotionPath, Observer.
- **Styling** — Astro scoped `<style>` blocks per component + CSS custom
  properties in `src/styles/tokens.css`. No Tailwind, no CSS-in-JS.

## Structure

```
src/
  layouts/BaseLayout.astro   # <head>, ScrollSmoother wrapper, boots main.ts
  components/
    sections/                # one .astro file per Figma section
    ui/                      # buttons, marquees, shared bits
  scripts/
    gsap.ts                  # plugin registration + helpers — import from HERE, never "gsap"
    main.ts                  # boots ScrollSmoother, reduced-motion handling
  styles/
    tokens.css               # Figma variables → CSS custom properties
    global.css               # reset, layout primitives, animation base state
  pages/
    index.astro
    studio.astro
    careers.astro
    product-design.astro       # capability pages — see "Capability pages"
    product-engineering.astro
    ai-automation.astro
    work/lms-education-saas.astro
    work/ai-recruitment-platform.astro
    work/automotive-marketplace.astro
```

## Conventions

**Importing GSAP.** Always `import { gsap, ... } from "../../scripts/gsap"`.
Importing `"gsap"` directly gives you an unregistered instance and the plugins
silently no-op.

**Section animations.** Each section component owns its animation in its own
`<script>` block, wrapped in `registerSection()`:

```astro
<script>
  import { gsap, registerSection } from "../../scripts/gsap";

  registerSection(".hero", ({ root }) => {
    // gsap.context is already applied — string selectors are scoped to root,
    // and everything is auto-reverted on HMR.
  });
</script>
```

`registerSection` skips setup entirely under `prefers-reduced-motion` and
reveals the content instead.

**No flash of un-animated content.** Anything that animates in gets
`data-animate`. `global.css` hides those elements once `<html>` has
`.gsap-ready`; the tween must `gsap.set(..., { visibility: "visible" })` (or
use `gsap.from`, which does it via the base state) before playing. If JS never
boots, `html.no-js` keeps everything visible.

**Fixed / overlay UI** (nav, custom cursor, menu) goes in the `overlay` slot of
`BaseLayout`, outside `#smooth-content` — ScrollSmoother transforms that
container and would break `position: fixed`.

**SplitText + webfonts.** Use `splitWhenReady()` from `scripts/gsap.ts`.
Splitting before `document.fonts.ready` measures the fallback font and produces
wrong line breaks.

**Eases.** Named eases (`"smooth"`, `"swift"`, `"expo"`) are registered in
`gsap.ts` and `"smooth"` is the global default. Add new ones there rather than
inlining cubic-beziers per tween.

**Tokens.** Pull colors, type sizes, and spacing from Figma into
`src/styles/tokens.css` as you build each section — don't hardcode hex values
or px sizes in component styles.

## Hero animation

`src/scripts/hero.ts` drives the whole hero loop. Beats:
`pill + cursor click` -> four card pairs, one per beat, then the whole thing
repeats from the click. ~22.3s per cycle (2.25 for the click, 5.02 per pair).

Every beat lives inside one `repeat: -1` timeline, so each cycle is identical.
If you add a beat, make sure it hands the stage back in a neutral state — the
*last* pair fades the glow to opacity 0 for exactly this reason, otherwise the
glow is still lit at the loop seam and snaps. `cardSceneTl(scene, isLast)`
carries that, so moving a pair to the end moves the hand-back with it.

Scene copy lives in `src/data/hero.ts`, not in markup — add a scene there and
`HeroStage.astro` renders it and the timeline picks it up.

**The cards are Figma 528:9020 ("Hero new frames"), four frames read in canvas
order top to bottom.** They replaced an earlier three-beat loop whose closing
beat was a browser-framed summary dashboard; `CapabilityCard.astro` and
`StatCard.astro` are deleted and recoverable from git. Two card shapes now
share the stage — `PreviewCard` (title / illustration / caption) for pairs 1, 2
and 4, and `PipelineCard` (title over three steps on a rail) for pair 3.

**The diagonal runs lower-left to upper-right.** The old pair ran the other
way. Both cards still fly in from the right, so only the slots changed.

**Card slots are per scene, not per stage.** The automation pair is 271.5 wide
and sits 31px further left than the three preview pairs, so `right`/`top`/`w`
live beside the copy in `data/hero.ts` and reach the CSS as custom properties.
One `.stage__card` rule reads them; there is no `--a`/`--b` geometry any more
except in the stacked layout below 1080.

**Figma strokes these card frames on the inside, so the 1.5px ring must not be
a `border`.** As a border it lands outside the content box — the cards
measured 276.5 against the frame's 273.5, +3 on all eight. It ships as
`box-shadow: inset 0 0 0 1.5px`, the same trick the Engineering chips use. The
cards carry no drop shadow at all; probing the frame's own render at a card
edge gives background one pixel outside the ring.

**The captions carry hard line breaks.** Figma emits `<br>` inside two of
them, and natural wrapping at the 165.5px text column breaks a word later —
"Interactive prototypes with real time / feedback" against the frame's
"...with / real time feedback". They are `\n` in the data with
`white-space: pre-line` on the element, so the captions that *do* wrap
naturally still do.

**The Experience Simulation export is wider than its node and that is drawn.**
The art runs 11px past its 220px panel on the right, so the export is 231 wide.
The media box stays at the node size and the image hangs out of it, anchored
left — squeezing it back in would shrink the whole illustration.

**The first pipeline step is not a muted state.** Its disc SVG is byte-
identical to the other two — the grey comes from a 30px white veil over the top
of the card body, with a second at the bottom. The veils are what make three
steps read as a longer sequence running past the card, so they are load-bearing
rather than decoration.

**Figma sets the pipeline step titles in Sora.** The site does not load Sora
and a third webfont for twelve short labels of decorative UI is not worth the
bytes, so they ship in Inter SemiBold — same call as the deck viewer's Open
Sans. The caption names really are IBM Plex Sans, which the site has.

**Motion blur.** DOM has no real motion blur, and `filter: blur()` just looks
out of focus. `createMotionBlur()` gives each moving group its own SVG
`feGaussianBlur` with a horizontal-only `stdDeviation`, attached during flight
and removed on landing so idle frames cost nothing.

**Stage coordinates.** Figma tops are measured from the hero top, which
includes the 83px nav. `.stage` is inset inside `.hero__frame`, which already
starts below the nav — so every `top` in `HeroStage.astro` is the Figma value
minus 83. Elements are anchored from the **right** edge so the composition
holds as the viewport narrows while the copy stays anchored left.

**Scrubbing during development.** The timeline is exposed in dev:

```js
heroSeek(3.05)   // jump to a beat and force a synchronous render
heroTimeline     // the master timeline
```

`heroSeek` also settles the intro, so a screenshot shows finished copy. This is
how each beat gets compared against its Figma frame — and it works even when
Chrome has backgrounded the tab and suspended requestAnimationFrame.

## Technology — the AI & Automation orbit

Four technologies ride the crown of a huge circle whose centre sits far below
the card. Geometry lives in `src/data/technology.ts`, the loop in
`src/scripts/tech-orbit.ts`.

**Figma's three orbs are one evenly-spaced ring, not three placed dots.** They
fall on a circle centred (620.15, 666.15) to within +/-4px, 30.8 and 29.7
degrees apart — and that radius, 553.57, is the centreline of the drawn ring
(outer 620, inner 487.13). Derive positions from the circle; don't hardcode
the three coordinates.

**Every orb is the same 60px disc.** The Figma export reports them at 84.76,
75.0 and 66.06 — those are the *axis-aligned bounding boxes* of one 60x60 node
at three rotations (60 x (cos + sin) of the angle). There is no depth scaling.
The same trap explains the "different" trail sizes.

**`get_design_context` and `get_metadata` disagree here, and metadata is
wrong.** Metadata put the ring centre 47px off and the API's orb 18px off, and
its group bounds were self-inconsistent. Blob-detecting the purple discs in
`get_screenshot` matched design-context x to 0.2px and y to 1px. When the two
sources conflict, measure the render — and note the screenshot's bleed is not
symmetric (the card's `0 8px 8px` shadow gives 8 left/right, 0 top, 16 bottom).

**The clip sets the spacing.** The card is 391 tall and the stage starts at
128, so the ring is cut at y = 263 — |theta| = 43.2, an 86.4 degree window.
Four orbs at a third of that (28.8) keep three on the arc with the fourth
below, which is the brief. That makes the loop 115.2 degrees, wrapping at
+/-57.6.

**Fade the orb out before it wraps, or the seam shows.** The trail and label
hang to one side of the disc; at the exit (-57.6) that side points back *up*
into the frame — the trail by 50px, and "Workflow Orchestration" by 65px —
while both are clear on the entry side. Without the fade they blink out of the
bottom-left corner every lap. `orbOpacity()` ramps 1 -> 0 across 43.2 -> 55.5,
which is also exactly the stretch over which a short label leaves the frame,
so the fade is invisible in itself. Resting angles put the fourth orb at 55.5
so the static frame is the three orbs Figma draws and nothing else.

**Verifying it.** The tween is not exposed on `window`; find it with
`gsap.globalTimeline.getChildren(true,true,false)` and match on
`duration() === 18` plus a plain-object target with `p`. Drive it with
`.progress(x)` — **`.pause(t)` seeks without firing `onUpdate`**, so the orbs
never move and every sample silently returns the resting frame.


## Technology — the Engineering pipeline

A spine down the centre of the card's purple panel with five nodes on it, each
carrying a chip that hangs off alternating sides. Geometry in
`src/data/engineering.ts`, timeline in `src/scripts/eng-pipeline.ts`.

**The five Figma frames are cumulative states, not five moments.** Frame 1 has
Figma lit, frame 2 has Figma *and* React, frame 5 has all five. Read the
`Frame 2147239993` wrapper in the metadata to tell lit from unlit — it is the
2px ring, and it is present on every stage up to the frame's namesake.

**The spine fills, and metadata will not tell you.** The `Vector 3760` node is
byte-identical in geometry across all five frames, so a metadata diff says the
spine is static. It is not: the stroke's *gradient stops* move, and the bright
section always ends at the active node — 47/50, 96/109, 170/171, 228/229, and
frame 5 drops the dim stop entirely. Download the vector per frame and compare
`offset=` to see it.

**Nothing on the way to a glow layer may open a stacking context.** The lit
node is two blurred ellipses in `plus-lighter` and `color-dodge` that have to
composite against the purple panel. A `transform`, `filter`, or `opacity` on
any ancestor between them and the panel groups them and they blend against
nothing. Offsets there use plain `left`/`top` and margins, and the fade is on
the blended layers themselves — an element's own opacity still blends with its
backdrop, a parent's does not. (`.tcard` does open one, via the reveal's
leftover transform, but the panel is inside it so the blend still lands.)

**Chips must not reflow when they light.** In Figma the ring is padding, so
the whole row shifts 1-3px between states. Here the inactive border is an
`inset` box-shadow and the active ring an outset one, so the box is identical
in both states and only paint changes.

**Figma gradient angles do not survive codegen.** The panel came out as
`linear-gradient(129.68deg, #834dfb 0%, #6624fa 100%)`, but Figma's handle runs
well past the panel — only the first ~48% of the ramp lands on it. CSS
normalises the ramp to the box, so that value renders ~15 levels too dark.
Fitting the corners gives `#834dfb 43.4%, #6624fa 161.4%`. Check any gradient
by sampling all four corners against the export, not by trusting the emitted
angle.

**Screenshots shift saturated colour; near-white is fine.** A flat
`rgb(131,77,251)` swatch captures as `(121,86,242)` through the browser tool's
JPEG. White and `#f5f3ff` come back exact, so a spot-check on those proves
nothing. Put a known swatch on the page and read it back before concluding a
colour is wrong — this session nearly "fixed" a panel twice over it.


## Technology — the AI & Data orbit

Five technologies step round an ellipse while a strip under the header names
whichever is on the hub. Geometry in `src/data/aidata.ts`, motion in
`src/scripts/aidata-orbit.ts`.

**The five frames are five steps of one rotation**, not five cumulative
states like Engineering. Track an icon across them and the cycle falls out:
entry (bottom-right) -> right -> hub -> left -> exit (bottom-left) -> wrap.
Right to left over the top, same direction as the AI & Automation orbit.
`stationOf(i, active) = (HUB + active - i) mod 5` reproduces every frame.

**All five stations sit on one ellipse** — centre (217.5, 224.2), semi-axes
186.2 x 113.2, fitting the Figma centres to within 0.7%. Angles are *not*
evenly spaced (37.3 and 42.9 degree gaps), so interpolate station-to-station
pairwise rather than mapping a fractional index onto one sweep.

**The edge wash is two static veils, not a per-item effect.** 60x104 boxes at
the left and right extremes, each a white gradient. Anything passing under
them washes out, which is what makes the wrap free: an item carries on to
-105 degrees under one veil, hands over at zero opacity, and slides in from
+105 under the other. Carrying it the long way round the bottom of the
ellipse instead would have it visibly racing the other four through the
lower corners — and it can never simply slide off, because the ellipse's
leftmost point is still 49px inside the card.

**Figma's PNG export does not rasterise background blur — do not verify a
`backdrop-filter` against one.** The veil layers carry a 2.5px background
blur, and reproducing it looked wrong next to the frames. Measuring settled
it: in the export a veiled badge's edge steps 46 -> 243 in 2px, *exactly* as
sharp as an unveiled badge, so the export renders no blur at all. The real
blur smeared the 2px glyph strokes and dropped their contrast to 0.60 of
Figma's, against 0.82 with it off. The white gradient alone already matches
(0.52 white over the badge versus Figma's 0.49), so the veils ship without
the blur. Mean colour hid this completely — both versions matched Figma's
mean to within 11; only per-patch contrast and peak white exposed it.

**The halo belongs to the hub, not to the item.** It is a fixed 130px disc at
(153, 46) in orbit space. Only the badge scales, 70 -> 100, and its glyph
32 -> 40 (not proportional — the glyph is relatively smaller on top).

**One badge SVG serves both sizes.** The 100px export's radii are exactly the
70px one's x 10/7. Two of the three exports have a glyph baked in; the clean
one is the export with no `fill="white"` in it. Its disc centre sits at 50%
across and 30% down its own box, the rest being drop shadow.

**Pin the phase at the head of a repeating timeline.** The opening hold has
no tween covering it, so on the second lap `p` keeps whatever the previous
lap left and the ring sits a whole station ahead of the strip. A
`tl.set(state, { p: 0 }, 0)` fixes it. Symptom: state 0 desynced, states 1-4
fine.

**Card shells must not live in the section's scoped styles.** Astro scopes
per component, so a card rendered from its own file never picks up
Technology.astro's `.tcard` rules and silently loses its background. The
shell is `src/components/tech/TechCard.astro`; use it for every card.


## Technology — the Cloud & Infrastructure scrubber

A progress bar sweeps left to right; as its handle crosses each quarter, that
row slides in from the left and stays. Geometry in `src/data/cloud.ts`,
motion in `src/scripts/cloud-progress.ts`. Four cumulative frames, like
Engineering.

**Read the render, not the metadata, to tell which rows are showing.** Each
pending row still carries its named icon child while a revealed row's tile
becomes a flattened fill — so a metadata diff says icons are being *removed*
one per frame, which is backwards. The screenshot settles it in seconds.

**Figma's fill widths are not even quarters.** They run 91.5 / 183 / 274.5 /
347 — the first three are multiples of 366/4 while the track is only 347, so
the last step is 72.5 against 91.5 for the rest and the handle visibly drags
on the final hop under even timing. `fillAt()` uses true quarters instead;
worst departure from the frames is 14px, at stage 3.

**The restart carries no lateral motion — do not rewind it.** The first pass
ran the handle back to zero with the rows clearing under it, timed off
`fillAt(j)` so the wipe stayed under the handle. It was accurate and it read
as an undo. It now fades instead: fill, handle and rows go out together where
they stand, `--p` is zeroed while nothing is on screen, and the handle fades
back in at the start line. No stagger and no slide on the way out either —
any ordering there reads as the sequence unwinding. Check with a sweep for
`--p` decreasing while the handle is visible; it should never happen.

**A repeating timeline needs its opening state pinned.** Same trap as the AI
& Data phase: the beat before the first tween has nothing covering it, so lap
two inherits lap one's end state. `tl.set(...)` at time 0 for both the bar and
the rows.


## Industries We Serve — the constellation

Copy on the left, hub-and-satellites on the right: the nuLyft sphere ringed
by four dashed circles with six industry pills scattered around it. Geometry
in `src/data/industries.ts`, motion in `src/scripts/industries.ts`.

**Nothing here may rotate as a group.** The six pills sit at six different
radii (196 to 246) and the composition is deliberately asymmetric, so a group
rotation is only correct at the drawn angle. The motion is a wavefront
leaving the sphere instead, and each pill pings as it is crossed — which
means the layout choreographs the cascade for free. The order comes out
196 / 202 / 225 / 227 / 236 / 246, landing across ~0.53s in two loose pairs
rather than a mechanical one-two-three.

**The duplicated ring group is not a mistake.** Figma stacks two copies of
the four rings at the same place. They are different exports: set A is the
crisp dashed art (2px stroke, `18 18` dash, 10% opacity) and set B is the
same four radii as 11px strokes under a 30px blur — the lavender halo. Only
A is worth rotating; B is rotationally symmetric so turning it shows nothing.

**Tie the ping to the wave's position, not to an index.** `pingAt()` converts
a pill's radius into pulse progress, so the two cannot drift if the timing
changes. Expect the lift to *peak* ~17px of travel after the wavefront
crosses the pill — that is the rise time, not an error.

**`<Icon>` is inline-flex.** Wrappers that position it need `line-height: 0`,
or they measure taller than their art by a descender and any box-based check
reports the wrong height.


## Our Clients

Header over three logos at 120px gaps — `src/components/sections/Clients.astro`.
No bespoke script: the shared `reveal.ts` staggers the logos via `data-animate`,
and the hover is a CSS transition, so it works with JS off. Grey at rest, the
client's real colours on hover.

**`get_design_context` flattened these logos to grey; `download_assets` did
not.** Both were pointed at the same nodes. The design context returned every
fill as `#B7B7B7`, which is genuinely the resting state Figma draws — but the
colour artwork is there, and only the asset download surfaces it. If an export
looks suspiciously monochrome, pull it the other way before believing it.

**Two SVGs per logo, not one filtered copy.** The resting state is a *flat*
`#B7B7B7`, which no CSS filter can produce from the coloured art —
`grayscale()` would leave Automatorr's navy nearly black and its lime nearly
white. The grey copies are normalised to `currentColor`; the colour copies
ship as-is and cross-fade over them.

`global.css` already kills transitions under reduced motion, so the swap
becomes instant on its own; only the lift needs suppressing there.


## CTA + footer

One region, `src/components/sections/CtaFooter.astro`: Figma overlaps them, so
the CTA card runs y 0–416 while the footer starts at 258. Footer is static;
the card fan cycles via `src/scripts/cta-fan.ts`.

**The overlap needs a BFC, not padding.** The footer's 258px top margin is
what positions it, and without `display: flow-root` on the wrapper that
margin collapses out and drags the whole block down. Padding would contain it
too, but an absolutely positioned child resolves `top` against the *padding*
box — so the CTA would move down with it.

**Base the CTA on the tint colour, not the page's.** Figma builds the ground
from a luminosity starfield over a `mix-blend-mode: color` layer of #18102b.
Luminosity takes the source's luminance either way, so a light or dark base
both resolve correctly — but with a light base the card renders *light* until
the lazy starfield decodes, and the colour layer alone cannot darken it.
Basing it on #18102b makes the resting state already right.

**An arc has to clear its destination, not its chord.** The retiring card
travels from y=45.38 to y=-40.22. A first pass set the apex at -38, reasoning
from the chord midpoint (y≈2.6) — but -38 is *below* the destination, so the
card just climbed straight there with no arc at all. The apex has to be more
negative than the back slot; -85 puts it ~45px over the stack.

**`<Image>` keeps the source's intrinsic height.** The Facebook mark is a
512x512 raster shown at 14px. `max-width: 100%` clamped its width to the 32px
button but left the height at 512, rendering a 32x512 sliver straight down
the footer. Give raster icons an explicit `width`/`height`, and constrain them
in CSS as well.

**And `<Image widths={…}>` still emits the full-size original as `src`.** The
srcset was correct (580w/1160w) while `src` pointed at a 1348KB 3702px file.
Pass an explicit `width` to cap the fallback. The three screenshots plus the
starfield came to 29MB of source PNG; at 2x a viewer now pulls 404KB.

**get_metadata put the fan's back slot at y=45.38**, which would make the
stack a zigzag. The design context has it at -40.22 — an even diagonal, which
is what the render shows.

**The copy is anchored by its left edge between 901 and 1240.** On desktop it
is placed from the card's centre (`50% - 280.5px`, translate -50%), which only
holds while the card is 1240; once the card goes fluid the copy slid off its
left edge (-120 at 1024) on every page. Below 1240 it is `left: 87.5px` —
where its left edge sits at 1240 — with `translate: 0 -50%`. Pages pass
`title`, `body` and `copyWidth` (AI & Automation: 642, same left edge); the
title is `white-space: pre-line`, so a `\n` in it is a deliberate break.


**The mobile drawer's CTA is an `<a>`, so `.nav__drawer a` caught it.**
`PillButton` renders an anchor whenever it carries an `href`, and the drawer's
link rule — `display: block; padding: 10px 0; color: var(--c-ink)` — applied to
the "Build With Us" pill as well. `display: block` killed its `justify-content:
center` (a block is not a flex container), the zero horizontal padding put the
label hard against the left edge of the pill, and the ink colour overrode the
outline variant's accent. The rules are `.nav__drawer ul a` now. Same trap as
`.deck__title span` catching `<Icon>` on the Studio page: **never select a bare
element inside a container that also holds a component.**

## Section spacing — one rhythm, `--section-y`

**Every section pads top and bottom by `--section-y` (by request — the 100px
a side Figma draws made ~200px gaps between sections).** 64px on desktop, 48
at <=900, 40 at <=560 (tokens.css, stepped in global.css), so any two
neighbouring sections sit 2x apart: 128 / 96 / 80 of visible space. Never hard
-code a section's vertical padding, and never add a per-breakpoint override —
the token steps by itself; 72 such overrides were deleted.

Where a section's own content carries space (a figure with empty pixels at
its foot, media hanging past the padding), it is corrected by the *measured*
amount next to the rule, e.g. `calc(var(--section-y) - 22px)`. Fixed-height
Figma frames (heroes, NxtDealer's Overview / Typography / Colorography,
Skill Wagon's typography box) are trimmed to "content end + token"; absolute
art inside them is placed `calc(y + var(--section-y))`, not `y + 100`.
The centred page heroes are padded, not fixed-height. The CTA card gets
`margin-top: var(--section-y)` on `.outro` (a margin — the card is placed
against the padding box). The AI tech section sizes to its fitted stage
below 1240, where it used to keep its desktop height and leave 460-730px of
empty band.

**Measure the visible gap, not the boxes.** `vgaps.mjs` (scratchpad) renders
each page, hides the nav, and counts the run of empty pixel rows (nearly
every pixel within 14 levels of the row's commonest colour) at each section
boundary — DOM content extents miss inline-SVG figures and positioned art.
Two traps found doing it: an override on a section whose padding actually
lives on its inner container *adds* space; and where media overlaps across a
seam (Product Engineering's proof rows), fit the correction from several
measured settings, not one.

## Home page (redesign) — Figma 664:2977

`src/pages/index.astro` is the redesigned home page; the previous one lives on
at `/home-old` (`pages/home-old.astro`, untouched). Five sections plus the
shared CTA + footer — `sections/HomeHero`, `HomeAbout`, `HomeCraft`,
`HomeWhy`, `HomeShaping` — with copy and geometry in `src/data/home.ts`.
Built desktop-first, then adapted in code down to 320 (no Figma mobile frames) — see "Home — mobile" below.

**The nav and footer changed with it, site-wide.** `Nav.astro` is now the
floating 1240 x 72 card 48px down (Figma 664:2984) on every page; inner-page
heroes were checked and nothing sits under it. `--nav-h` (83) is kept because
those heroes still offset their copy by the old bar. The Capabilities menu is
ours — Figma draws only the chevron. `CtaFooter`'s columns are now
Capabilities / Company / Contact (664:3250); "UX Capabilities" links to
`/product-design`, Work to `/studio`, About Us to `/about`.

**The hero photo is masked, not exported.** Figma's subtract bakes the photo
into the notched shape; here the photo is a normal `<Image>` and the notch is
a 320 x 110 corner region (now two vector pieces, see below) pinned
bottom-right, unioned with two plain fills — so the fillets are Figma's and
the notch keeps its size as the card narrows. The three dots are drawn as
Figma has them over one photo.

**Never ship a big SVG blur — the hero's glow is a raster for this reason.**
Figma exports the glow as a 1947 x 745 ellipse under a 302px
`feGaussianBlur`. As an `<img>` it looked right and cost the hero its frame
rate: Chrome re-ran the filter whenever it repainted, so scrolling there
dropped to ~30fps (p95 33ms) while every other section held 60. Disabling
layers one at a time pinned it — the shafts' CSS `blur(32px)`, the clouds and
the photo mask made no difference. `hero-glow.png` is that SVG rendered once
at quarter scale and drawn at full size: within 4 levels of the live filter.
Stack order is Figma's, set by `z-index` — first shaft 0, glow 1, other
shafts 2, clouds 3. Check any future decorative export for a large blur
before using it as-is.

**The hero is three slides** (product design / engineering / AI &
automation), copy in `heroSlides` in `data/home.ts`; slides 2-3 came from the
user's mocks, photos from Pexels (3861972, 34804018 — free, no attribution).
Each slide's title, body and button share one grid cell, so the photo never
moves. **The slides should show AI built into software, not robots** — a
robot-arm photo on slide 3 was rejected outright ("we are not creating
robots"); it is now an AI assistant menu in a code editor, framed with a
per-slide `photoPosition`. Pick future imagery the same way.
It advances every 3s and a dot click restarts the clock. It pauses on mouse
hover over the photo, on keyboard focus, off screen and in a hidden tab, and
never auto-plays under reduced motion. **The focus pause must test
`:focus-visible`** — a mouse click on a dot focuses it too, and a plain
`focusin` pause then froze the carousel for good after the first click.
**The photo's notch stretches** to fit a longer button: the corner is two
vector pieces (`piece()` in `HomeHero.astro`) with a 36px band between, widened by
`--notch-e` (a registered `@property`, so it eases). Slide 1 renders
pixel-identical to the single-piece mask it replaced. **`mask-position` has
no three-value form** (`right 20px bottom` is invalid there, unlike
`background-position`), and one bad value drops the whole list to `0% 0%` —
use four values.

**"A little about nuLyft" is not Figma's any more — and it is not the About
page either.** The frame's three idea / challenge / direction cards
(664:3024) read as cards placed at random, so the user had it replaced. A
first rebuild set the About page's two sections side by side (its diagram and
its partner cards) and was rejected outright: the brief is the About page's
*idea* in one simple section, not its layout. It is now a statement ("Every
business reaches a point where it needs to move forward. *We help you take
that next step.*"), the partner line and the button, over one quiet line —
the three starting points running into the nuLyft mark. Copy in `about` in
`data/home.ts`, condensed from the About page's own words. One dot runs the
line and the mark glows as it lands: CSS only (a track-wide runner translated
-100% -> 0), paused off screen, hidden under reduced motion; below 900 the
line turns and runs down the left.

**The nav hides on scroll down and returns on scroll up (by request)** —
script and `.nav.is-hidden` in `Nav.astro`, on every page. Always shown in
the first 120px; moves under 6px are ignored. A mouse within 96px of the
top, or over the bar, reveals it, and the reveal lasts while the pointer
stays there — scroll events re-check the last pointer position, or the bar
slid away from under the cursor. It is held while any `aria-expanded` in it
is true (phone drawer, Capabilities) or keyboard focus is inside — and that
must be `:focus-visible`, not `:focus-within`: a mouse click leaves focus on
the clicked button and pinned the bar after any click. ScrollSmoother keeps
the native scroll position, so `window` scroll events drive it.

**The notch corner is drawn, not cut from the export — Figma's own shape is
off.** The subtract's notch rectangle overhangs the card (0.68px right, 6px
bottom), so its rounds land partly outside the photo and get sliced into a
squashed near-diagonal above the button (the user spotted it). The corner is
now two inline SVG mask pieces in which every notch corner is a 32px round:
the photo's corner above the button and beside it round outward, the
notch's top-left curves inward. A first redraw followed the rectangle's own
rounds instead (inverted curves into the notch) and left two sharp tips —
rejected; keep all three corners rounded.

**The why-section rings are gradient strokes, and the design context says
they are not.** It reports a flat 2px #834dfb; the render fades each ring to
nothing on the side facing away from the mark. Ring = `border-box` gradient
under a `padding-box` fill. Padding is 18, not Figma's 20: Figma's inside
stroke takes no room, and at 20 two bodies wrap a line early.

**Figma's logo frame in the nav clips its "technologies / Pvt Ltd" lockup**
(it sits at 102.33% across), so it is not shown; the footer logo is wider and
does show it.

**Buttons have brand hover / pressed / focus states (by request)**, replacing
the old 2px lift — all in `PillButton` (plus `CtaFooter`'s own button and the
dark-band override in `CapProject`). Purples only: hover deepens the fill
(#7437fb -> #5a14f4 gradient, or #6c2cfa flat) with a soft purple glow and
steps the arrow 3px right; outline hover fills with the chip tint and
deepens border and label to #6624fa; pressed goes darkest (#4e05ef) with a
deeper inset shadow and `scale: 0.97`; keyboard focus is a 2px accent ring.
A gradient cannot transition, so each state fill is a `::before` layer under
the label (`isolation: isolate` on the pill). Hover is fine-pointer only.
**Never put `data-animate` on a button itself** — GSAP's reveal leaves
`scale: none` (and folds `rotate` into `transform`) inline, which cancelled
the CTA button's press; the reveal is on a wrapper (`.cta__action`). The
outline arrow icon now draws in `currentColor` so it deepens with the label.

**Every eyebrow has 8px corners, not Figma's full pill (by request; 4px was tried first and read too sharp).** A
reviewer read the round tinted uppercase pill as the mark of an
AI-generated site; a numbered "01 / …" index and an outlined tag were tried
on the home page first and dropped. The change is the two tokens —
`--r-eyebrow` and `--r-eyebrow-sm` are both 8px — which `EyebrowBadge` and
the capability pages' own section eyebrows read; three eyebrows that
hard-coded an 88px pill (`CaseHeader`, Automotive's challenge label,
`CapProject`'s kicker) now read the token too. The case studies' own
eyebrows — `CaseHeader` and the three Overview/Challenge labels, a pale
untracked-padding pill or bare tracked text in the frames — are now the
shared `EyebrowBadge` itself (class `case-eyebrow`, pinned
`align-self: flex-start` so it hugs rather than stretching in their column
layouts). That moved desktop heights a little: LMS 9,750, Recruitment
9,594, Automotive 10,063. A scan of every page for
boxed uppercase labels found every one on the token. **And every eyebrow is the shared `EyebrowBadge`** — the capability pages
drew their own copies (`proj__eyebrow`, `pes__`, `pep__`, `pf__`, `ais__`,
`aind__`, `aen__`, `web__eyebrow`) and the project "Key Features" / "Product
Outcomes" labels were bare tracked capitals; all now render the badge,
`section` on light bands and `dark` on dark ones (Product Engineering's
process band, the Skill Wagon project), with the hand-made styles deleted.
Don't style a section label by hand: pass `<EyebrowBadge variant>`.

**Every heading on the site is sentence case (by request)** — first word,
the first word after a full stop, proper names (nuLyft, NxtDealer, Skill
Wagon, Asterdata) and acronyms (AI, HR, CRM, JD, LMS, SaaS) keep their
capitals; nothing else. Done twice over: the ten `text-transform:
capitalize` rules on heading classes are gone (the nav links, job meta and
project fact values keep theirs — not headings), and ~130 heading strings
typed in Title Case in the data were rewritten. Intended exceptions: a
subtitle after a dash keeps its first capital ("Phase 01 - Discover &
define", "Skill Wagon - Redefining…"), illustration labels stay as drawn
("Update Accounts", the old home's mock automation steps), and "Invidiual"
stays a flagged Figma typo. New copy from Figma arrives in Title Case — set
it in sentence case when it lands. Check with a crawl of `h1`–`h6` plus any
`[class*=title]`, `[class*=__name]` text, not `h1`–`h4` alone: tab titles,
step titles and diagram cards are styled headings without heading tags.

**The nav labels are untracked, by request.** Figma sets them at 2px
(`--tr-nav`); the user asked for it removed, so the nav departs from the
frame there (the token stays — two capability sections use it).

**Trailing tracking.** CSS adds letter-spacing after the last glyph too. The
craft card bodies hand back their -0.16 with a margin — one line measured
391.13 in a 391 column and dropped a word.

**Footer leading is 19, not 24.** The links step 35 apart in Figma; at the
body line-height the footer came out 16 tall. The bottom bar's rule is an
inside stroke too (39 + 1, not 40 + 1). Desktop page height is 4881, the
frame's.

**The Why section has an entrance (user-approved), once, on first sight** —
the script is in `HomeWhy.astro`. Desktop: a hole opens in the platform's
top disc, the nuLyft mark rises through it (`back.out`, ~0.8s) and lands
with a flare, the hole closes; then the connectors grow *out of the mark*
to the cards — inner pair (Clear thinking, Quality) at 1.0s, outer pair at
1.35s — and each card appears as its line lands (~2.3s in all). Tablet and
phone: the stacked cards are never hidden (the reader has scrolled past
them before the platform is on screen); the mark rises the same way, then
a glow climbs the line from the mark to the top card, lighting each card
as it passes. Every hidden state is set by the script, so JS off or
reduced motion shows the finished diagram.

- The connector exports run card -> mark, so they are drawn from the far
  end: `dasharray L L`, offset `-L` (hidden) -> `0`.
- The mark rises through a `clip-path: path(...)` on a wrapper that does not
  move (`.hwhy__lift`) — clip on the moving element would travel with it.
  The clip is the region above the hole's front arc; it is removed once the
  mark is clear, so its drop shadow lands whole.
- **GSAP's `scale` writes `transform`.** The hole was hidden with the CSS
  `scale: 0` property and GSAP's tween never touched it, so it stayed shut —
  hide with `transform: scale(0)`.
- At rest everything is handed back to the stylesheet (`clearProps`). A
  motion-on capture still differs from a reduced-motion one by edge
  anti-aliasing (469px, max 31 levels) — that is ScrollSmoother's page
  layer, which reduced motion turns off: an untouched section differs more.

**The Shaping section ("Possibility into Progress") has three motion layers
(user-approved)**, all in `HomeShaping.astro`:

- **Connectors** — not in Figma, added because the orbit and the steps read
  as separate pieces: a curve from the outer ring (r 145) to each step's
  icon, leaving the ring on the line towards its icon; on a phone, one curve
  from the ring's foot to the first icon, the timeline rail carrying on.
  Drawn from layout offsets (the orbit carries a reveal transform) and
  redrawn on resize, outside `registerSection` so they exist under reduced
  motion.
- **Entrance, once** — an arc sweeps the ring's right half, 12 to 6 o'clock,
  in 1.5s (`power1.inOut`); each connector draws out when the sweep reaches
  its root (the ease is inverted to find that moment) and its step goes from
  0.3 to full; the disc pulses. On a phone the steps are never dimmed — each
  icon pops as it scrolls in.
- **Ambient** — the nine ring dots turn about the orbit's centre (they sit
  on two circles, r 114.5 and 145.5, so a rotation with the centre as
  transform-origin keeps each on its ring), 60-110s a lap, alternate dots
  reversed; the open arc turns in 120s; a halo breathes behind the disc.
  CSS, paused off screen, `animation: none` under reduced motion.

Two traps: **`clearProps: "all"` wipes the inline custom properties too** —
the steps carry `--top`/`--w`, so only the props the entrance set are
cleared. And **CSS animations beat inline styles**, so the entrance pulses the
disc, not the halo, which is under a running animation. The orbit's phone
step-down is now `scale` + negative margins rather than `zoom`, so layout
offsets stay true for the connector maths.

### Home — mobile

No Figma frames; each section re-designed for the width, not scaled. 1440 is
pixel-identical to before the pass (diffed). Swept 1440 -> 320 with no
sideways scroll and no text past the viewport.

| section | 1241-1439 | <= 1240 / 1180 | <= 900 | phone |
| --- | --- | --- | --- | --- |
| Hero | as drawn | as drawn | copy stacks, notched photo kept (notch < half the photo) | no notch — a 320 notch would eat a 343 photo; button moves under the copy, photo last, dots stay on it |
| About | as drawn | path runs down the left | statement stacks | type steps down |
| Craft | columns give way; caption anchored right (its `left: 357` ran off at 1280) | <= 1180 stacks: three upright service cards, belief, photo + overlaid caption | one service per row, icon beside | caption leaves the photo and becomes its footer — no overlap |
| Why | diagram fitted (`fit.ts`, >= 0.84) | cards in a column, a line running down through them into the mark on the platform | header stacks | — |
| Shaping | copy gives way, steps hold >= 377 | copy on top, orbit beside the zig-zag | — | < 768 orbit, then the steps as a timeline through their icons |

Traps found on the way, each a real bug:

- **The CTA headline was invisible on every phone and tablet, site-wide.**
  `CtaFooter`'s mobile copy went `position: static`, and a static block paints
  *under* the card's absolutely placed starfield and tint. The button showed
  through only because its `rotate` opens a stacking context. Now `relative`.
- **The CTA copy ran under the screenshot fan at 901-1010.** The fan's left
  edge is 50% + 186 of the card; the copy is capped at that minus 24.
- **A second copy of an inlined icon renders blank if the first is under
  `display: none`.** `<Icon>` prefixes ids per icon *name*, so both copies
  share gradient ids and `url(#…)` resolves to the hidden one. The Why
  platform's stacked copy came out as a mark floating on nothing. Pass
  `uid` for any second copy.
- **A wrapping flex row breaks on the basis, before anything shrinks.** The
  steps' 446 basis dropped them under the orbit at 960 with 50px to spare;
  the basis is the 377 minimum now, capped at 446.
- **`sizes` cannot hold `var()`.** The hero's `calc(100vw - 2 * var(--gutter))`
  was dropped as invalid and the browser fell through to `1240px` at every
  width. The sizes now step with the gutter.
- **Fit wrappers re-raster at scale 1.** The Why stage's `transform` is
  switched off from 1440 so the design width renders untouched.
- **Nav**: the card sits 24 down at <= 900 and 12 down (60 tall) on phones;
  the drawer keeps Capabilities as a labelled group.

## In-page navigation

`src/scripts/anchors.ts` handles every same-page `#` link. ScrollSmoother
scrolls a transformed wrapper, so a native hash jump lands in the wrong place
and then fights the smoother — the click is intercepted and routed through
`smoother.scrollTo(el, true, "top 100px")` instead, which clears the 83px
fixed nav. It falls back to `window.scrollTo` when the smoother is absent
(reduced motion).

**Unresolved hashes are swallowed, not followed.** Several nav and footer
links point at sections that do not exist yet (`#studio`, `#careers`,
`#contact`, `#blogs`). Left to the browser, those send the reader to the top
of the page; the handler calls `preventDefault` and then does nothing, so
they are simply inert until their target is built.

Targets currently wired:

| link | href | lands on |
| --- | --- | --- |
| nav Work, footer Case Studies | `/#work` | Featured Case Studies |
| hero View Our Work | `#work` | Featured Case Studies |
| nav Capabilities | `/#capabilities` | What We Do |
| nav Process | `/#process` | Our Process |
| nav Studio, footer Studio | `/studio` | the Studio page |
| footer AI & Automation | `/#ai-automation` | What We Do row 1 |
| footer Product Design & Engineering | `/#product-design` | What We Do row 2 |
| footer Narrative Intelligence | `/#narrative` | What We Do (dark) row 1 |
| footer Talent Intelligence | `/#talent` | What We Do (dark) row 2 |

**Cross-page section links need no new code, only a leading `/`.** The click
handler already bails when `url.pathname !== location.pathname`, so `/#work`
from `/studio` navigates natively and the block at the foot of `anchors.ts`
resolves the hash on load, once the smoother has measured. Keeping these as
bare `#work` would have made them inert on every page but the home page —
`find()` returns null there and the click is swallowed.

The four row anchors come from `row.id` in `src/data/whatWeDo.ts`, applied by
`CapabilityRow.astro` — add a row there and its anchor comes with it.


## Studio page ("Work")

`src/pages/studio.astro` — Figma 667:3302, the redesign. The nav's "Work"
lands here. Three parts: `sections/CentredHero` (600 tall, centred copy over
the shared `ui/HeroBackdrop`), `sections/StudioProjects` (the three case
studies as `studio/ProjectCard`s) and the shared `CtaFooter`. Data in
`src/data/studio.ts`. Nothing animates beyond `reveal.ts`.

**The redesign removed the filter tabs, the Talent Intelligence pitch and the
Narrative decks.** All of it is deleted — `studio-tabs.ts`,
`talent-collage.ts`, `TalentIntelligence.astro`, `talent/Scorecard.astro`,
`data/talent.ts`, `studio/DeckChrome.astro`, the deck and talent images and
icons, and the tokens only they used. Recover from git (before the
`home-redesign` branch) if a tab ever comes back. Every remaining card has a
case-study page, so `ProjectCard` lost its disabled-button branch too.

**The frame's footer is stale.** It still draws the old columns (About /
Blogs / Case Studies); the page uses the shared redesign footer, like every
other page.

**The hero is `sections/CentredHero`, shared with About Us.** Same frame,
different copy; it sits on `ui/HeroBackdrop` with `variant="page"`.

**The browser bars here draw a Google favicon and a photo avatar.**
`BrowserChrome` takes them as `favicon`/`avatar`; other pages keep the nuLyft
mark and the gradient disc.

**Size the phone row by its slots, not its artwork.** The row is 1240 x 542 —
four 250-wide slots at 0/330/660/990 — and each phone export hangs 5.67 past
its slot on every side (true bounds 261.33 x 553.33; export at scale 1 to
confirm). Sizing the stage to the artwork, 1251.33 wide, left the row 5px
short.

**The caption row is 50.06, not 48** — Figma sizes it by the tilted pill's
bounding box — and the meta line is 19. Together with the phone row that was
the 7px the section measured short of its 1528.

**The meta line must not wrap.** Figma marks the node `nowrap` and it needs to
be: "PRODUCT DESIGN & ENGINEERING · HR RECRUITMENT · 2026" measures ~582.5px
against the 580 the caption leaves it, so without `nowrap` the year drops a
row and that card grows 19px. A negative right margin reclaims the trailing
letter-space CSS adds after the final glyph.

**Each card is its own `data-section`**, so `reveal.ts` gives each its own
trigger instead of firing the whole grid at once.

**The card plate is three nested frosted shells**, not one: 32px radius over
24px over 16px, each with a 1px white border and its own padding, the outer two
with `backdrop-filter: blur(10px)`. The screenshot is `object-fit: cover`
anchored `center top`, except the e-learning shot which Figma anchors right so
its empty left rail falls away — that override lives per-project in
`studio.ts`.

**`text-wrap: normal` is not a value the `text-wrap` shorthand accepts** —
it is `wrap | nowrap | balance | stable | pretty`, so `normal` is parsed out
and silently dropped. `global.css` sets `text-wrap: balance` on every heading;
the reset is `text-wrap: wrap`.

**A descendant `span` selector also catches `<Icon>`.** `Icon.astro` renders
`<span class="icon">`, so a bare `span` rule inside anything holding an icon
hits the icon too. Target a class.

**The dev server served `BrowserChrome`'s pre-fix CSS during this rebuild** —
the old `.chrome__url span { flex: 1 }` that centres the URL, long since
replaced in the source and absent from `npm run build`. If a browser bar
centres its URL, `touch` the component before debugging it.


## About Us page

`src/pages/about.astro` — Figma 669:3594, 2843 tall and matched to it. "About
Us" in the nav and footer, and the home page's "Get To Know Us", land here.
`CentredHero` (copy in `data/about.ts`), `sections/AboutPaths` (the "next
step" diagram), `sections/AboutPartner` (photo + pitch + three cards), then
`CtaFooter` with this page's own title and body. Static; `reveal.ts` only.

**The frame's nav is a different variant** — Work / Capabilities / About Us /
Careers / Contact Us, no Home and no chevron. The page uses the shared
redesign nav like every other page; flagged to the user.

**One cloud bitmap, three looks.** Home, Studio and About all fill their
clouds from the same raw image, adjusted differently per frame. `download_assets`
returns the raw, unadjusted file for every one of them (byte-identical), so
it is the wrong source; `get_design_context`'s image URL has the adjustments
baked in. Studio's and About's adjusted images are byte-identical, which is
`HeroBackdrop`'s `page` variant; home's is `home`.

**The diagram is placed, not laid out.** Figma positions every piece inside
a 1240 x 504 box. The two curved branches are one export, the lower flipped
about its own centre; each export carries 0.6px of stroke above its node.
The "next step" mark's halo is a 20px *outside* stroke on a 40px disc —
`box-shadow: 0 0 0 20px`, not a border.

**An `<Icon>` in an absolutely placed wrapper needs a flex wrapper, not
`display: block` + `line-height: 0`.** The inline icon still sat on a text
baseline: the 1.2px trunk line dropped 4.8px inside a 6px box and smeared
grey over two rows, reading as a different line from Figma's.

**The diagram moves** (`scripts/about-paths.ts`, approved by the user): each
dot travels its line into the mark — top, middle, bottom, 0.5s apart, 1.6s
each — and the mark glows as it lands (`.paths__pulse`, a brighter ring over
the static one). A 5s loop that pauses off screen. Dots fade in at the head
of their line and out before the ring, so the lap starts and ends empty and
has no seam. Positions come from `getPointAtLength` on a hidden copy of the
three routes (`routes` in `data/about.ts`, stage coordinates) — MotionPath is
*not* registered in `gsap.ts`, whatever the plugin list above says. Without
JS or under reduced motion the dots rest at Figma's spots. Verify by finding
the timeline (`repeat() === -1`, `duration() === 5`) and stepping it with
`.progress()`.

**Give a measuring-only SVG `width="0" height="0" fill="none"` attributes**,
not just a class: when the dev server served stale CSS, the hidden routes
rendered at the default 300 x 150 with black fill over the copy.

**The card tags are tilted -0.65deg like the pills** — Figma rotates the
label, not the row, so the shield icon stays level. The row is 21.58 tall,
the label's rotated bounding box.

**Copy reproduced as drawn**: "We Look beyond the brief" (capital L), and the
hero's straight apostrophe in "what's".


## Contact Us page

`src/pages/contact.astro` — Figma 672:3795, 2474 tall and matched to it. The
nav's "Get Started" lands here, and so does every "talk to us" button that
used to point at an inert `#contact` (the CTA card's "Start a Conversation",
the capability heroes' primaries, home and About CTAs, the old home hero).
`CentredHero` (554 tall, copy 29.8 below centre, no italic tail),
`sections/ContactDiscuss`, `sections/ContactForm`, then `CtaFooter
cta={false}`. Copy in `data/contact.ts`.

**The page ends on the footer alone.** `CtaFooter`'s `cta={false}` drops the
card and its 258px overlap; the footer content sits 141 down (1px rule + 140)
instead of 241.

**The form has no backend yet.** The site is static, so submitting validates
natively and then opens the visitor's mail client addressed to
`contact@nulyfttech.com`, pre-filled. `deliver()` in the component's script
is the one function to swap for a real endpoint. "Book a Call" scrolls to the
form (`#contact-form`) until there is a booking link.

**Field heights are Figma's with an inside stroke:** 51 and 214 including the
1px border, so the padding is 15 rather than 16; labels set at a 19px line or
the field stack runs 3px long.

**Both decorative pieces are rasters, on purpose.** The form's line pattern
was an SVG export of 23 curves, each 2,000+px long, under an alpha mask; the
discuss band's curves a 14-path group at 10% opacity. As inline SVG they made
this the one page the user found dragging while scrolling — the same failure
as the home hero's blurred glow. Each is now rendered once at 2x over its
section's own flat ground (`images/contact/form-lines.png`,
`abstract-curves.png`) and served through `<Image>` as WebP. Headless Chrome
could not reproduce the lag (it rasterises differently), so the fix was made
on the cause, and pixel-diffed against the frame afterwards. Keep large
masked, filtered or group-opacity SVG art off the page; rasterise it.

**Placeholders are as drawn**, including "John Doe" on the company and
message fields — a stray copy in the frame, flagged to the user. The frame's
nav is the five-link variant again; the shared nav is used.


### About Us and Contact Us — mobile

No Figma frames; adapted in code, 1440 untouched (the frames' 2843 / 2474).

- **`CentredHero` (also Studio and Careers)** stops being a fixed frame at
  900: the copy joins the flow under the nav (`relative`, so it still paints
  over the backdrop, with its `translate: -50%` reset — the old `PageHero`
  trap) and the section sizes to it. Figma's hand-set `<br>`s give way to
  normal wrapping there; each carries a following space so the words do not
  fuse, which collapses at desktop (a space at the start of a line).
- **About's "next step" diagram**: fitted 1181-1439; at 1180 and below it is
  rebuilt in flow — starts in a column, lines converging on the mark beside
  them (tablet) or out into a right-hand lane and down one trunk into the
  mark below (phone, under 700). Those lines are drawn by `about-paths.ts`
  from layout **offsets, not rects**: the starts carry `data-animate`, so on
  load they are still translated by the reveal and a rect-measured line lands
  where the copy *was* — and a transform never fires the ResizeObserver to
  correct it. The drawing runs outside `registerSection`, since that bails
  under reduced motion and the lines are part of the picture. The dots ride
  the drawn paths in a `gsap.matchMedia` context per layout.
- **About's partner section** moves the three cards out from under the pitch
  to a full-width row below photo + pitch from **1320**, not lower: beside
  the photo a card's content box falls under the 166 its widest tag
  ("Business understanding") needs at ~1300. They stack under 720 for the
  same reason. On a phone the pitch comes first and the photo is cropped
  landscape.
- **Contact**: the discuss band's curves step down (448 -> 360 -> 300) before
  stacking at 900; the form heading drops its `nowrap`; the two-up fields
  stack on a phone. **Inputs stay 16px at every width** — iOS zooms the page
  into any field set smaller. With no CTA card above it, the footer's 140 top
  padding drops to 80 / 56 — through `.outro--plain .foot__top`, since that
  selector outranks the plain mobile rule.
- **The curves raster's baked ground showed as a box** once the picture sat
  in open space on a tablet: WebP lifts the plate a level above the real
  ground. `mix-blend-mode: darken` keeps the ground wherever the plate is
  and the (always darker) curves elsewhere — sampled seamless at 1440 and
  768. Same fix for any raster that carries its section's ground.

1440 was diffed against the last commit's build, built-versus-built: About,
Studio and Careers identical; Contact differs only by that plate (63px,
at most 5 levels).

## Page heroes

**No hero sets its emphasis italic any more, by request.** Every frame draws
the headline's `<em>` tail in italic (most at weight 500); all nine hero
components — home, the centred page hero, the three capability heroes, the
three case studies and `/home-old` — now set it `font-style: normal` at the
headline's own weight. Colour is kept where a frame tints it (LMS and
Automotive's accent). The home page's "A little about nuLyft" statement
follows the same rule: upright, still purple. One knock-on: the upright "One Hiring Engine." is
wider than the italic, and the Recruitment headline dropped "Engine." to a
third line at 1440 — its title takes 24px of the gap before the card there.
Check line counts against the last build whenever emphasis styling changes.

Studio, About Us, Careers and Contact Us all use `sections/CentredHero` — the
redesign's 600-tall centred hero over `ui/HeroBackdrop` (`page` clouds).
Careers has no redesigned frame; the user asked for it to match the other two,
so it carries its existing copy ("Join Our Journey" / "Shape Your Future with
*nuLyft*"). Copy is centred on the frame, so a shorter block sits lower.

The old grid-and-mask `PageHero` is deleted. Its pattern,
`PageHeroPattern.astro`, lives on behind the LMS and Recruitment case-study
heroes, which still clear the old 83px bar via `--nav-h`.


## Careers page

`src/pages/careers.astro` — Figma 503:3819. A culture bento over the open
roles, then the shared `CtaFooter`. Data in `src/data/careers.ts`. Nothing
animates beyond `reveal.ts`.

**The bento is a 3-column grid, not the frame's nested rows.** Figma builds it
as a 795 column beside a 429 one; here the tall photo spans two grid rows so
its height comes from the left column instead of being hardcoded to 470.

**The job grid is 1200 wide inside a 1240 column.** Two 551 cards with a 98px
gutter leave 40px unused at the right — that is what the frame draws, and it
is reproduced rather than stretched to fill. Almost certainly unintended in
the design; flagged to the user.

**The role listing ships empty, by request.** Figma's six cards are one
placeholder repeated six times, and the user asked for the section to be
hidden. `jobs` in `data/careers.ts` is `[]`, and `CareersJobs.astro` branches
on it: empty renders the "No Openings Right Now" state, and putting real roles
back in the array restores the grid with no code change. The "Currently Open
Positions" heading is suppressed alongside the grid — it would be a lie over
an empty state.

**`illustrations/no-openings.svg` is hand-drawn, not a Figma export.** The
design has no empty state. It follows the house palette the other
illustrations use — flat fills in `#834DFB` and `#D5C3FE`, no outlines — with
one concession: the magnifier is stroked rather than drawn as an annulus,
which is easier to author and renders identically. Its lens is `#F0EBFE` so it
reads as glass over the board rather than a hole.

**The Careers frame's CTA carries the Talent Intelligence copy** ("Send us your
next open role"), which addresses employers on a page built for candidates —
a stray paste from duplicating that frame. The page ships the site's default
CTA instead; flagged to the user.

**Two icons export as inner groups, not whole boxes.** Figma nests the
briefcase at inset 9.38%/6.25% of a 20px box and the rupee at 3.12% of 24, so
each export arrives at the *group's* size (17.5x16.25 and 22.5x22.5). Re-wrap
them in the box the layout reserves, or `<Icon size={20}>` silently scales the
glyph up to fill it.


## Legal pages — Privacy Policy and Terms and Conditions

`src/pages/privacy-policy.astro` and `terms-and-conditions.astro` — no Figma
frames; copy supplied by the user. `CentredHero` (`privacyHero` /
`termsHero`) over `sections/LegalDoc.astro`, then
`CtaFooter cta={false}` like Contact. Everything is data in `src/data/legal.ts`
— sections of paragraphs / lists (with optional bold leads) / subsections,
numbered at render (01, 2.1). Running text takes `[[label|/href]]` for a
link (Terms links the Privacy Policy). The footer's "Support" link is
removed; "Terms" and "Privacy" land on the two pages. Both carry the same
effective and last-updated date, `PUBLISHED` in the data (28 October 2026,
by request) — change it there when either policy is revised.

**The supplied copy leaves "[Insert …]" placeholders** — registered office,
privacy email, the Terms' contact email, website, CIN and the Terms'
jurisdiction city. They live once in `company` — all filled in now by the
user (office, `contact@nulyfttech.com` for both emails, `nulyfttech.com`,
the CIN, courts at Hyderabad). Set any of them back to `null` and it renders
visibly as "[Insert …]" in italics again (inside running text too).

**The contents rail is pinned, not sticky** (`scripts/legal-toc.ts`).
ScrollSmoother scrolls a transformed wrapper, so `position: sticky` does not
engage — and left on under the pin it *doubled* the offset (the rail sat at
288 instead of 144). Sticky is the reduced-motion path only (no smoother);
`html.gsap-ready` turns it off. The pin runs for `doc height - rail height`
rather than to an `endTrigger` position: the 7,000px document rewraps a
little after first measure, which left the rail releasing 21px past the
card, and a `ResizeObserver` on the card refreshes on any change. The active
entry follows the section crossing 40% of the viewport. Below 1081 the rail
becomes an "On this page" disclosure that closes when a link is chosen.

## Case study — LMS / Education SaaS

`src/pages/work/lms-education-saas.astro` — Figma 505:4185, ~9,800px over
eight sections. Copy and assets in `src/data/caseLms.ts`. Reached from the
Studio grid's first card (`href` in `studio.ts`). Static; `reveal.ts` only.

**Every section below the hero shares one header shape** — a 1240x84 row:
eyebrow over title on the left, a single intro paragraph on the right, the two
vertically centred. That is `components/case/CaseHeader.astro`.

**That header is not the site's usual section heading.** It is Inter SemiBold
24/32 in the body ink over a 525px column, with a pale `#f8f5ff` pill behind
the eyebrow and a 503px intro — not the 32px IBM Plex heading the rest of the
site uses. Getting this from the frame rather than assuming cost a correction
across all four sections that use it.

**The typography body is a placed layout, not a flex row.** Figma positions
each piece inside a 1240x543 box: specimen at (0, 157.25), table card at
(632, 111), leaders at their own coordinates. Building it with flex put the
specimen and table on one centre line and threw every gap out — which is what
the user saw. When a Figma frame has absolutely positioned children, reproduce
the box; do not infer a flex layout from how it looks.

**Screenshot exports carry shadow bleed that has to be subtracted.** The
typography table's export is 40px larger on every side than its card, so it is
placed at the card's coordinate *minus* 40 and sized to the export. Check the
export size against the node size before positioning anything by its frame
coordinate.

**Product screenshots ship as flattened exports, not rebuilt DOM** — until one
has to move. They are fixed compositions — tilted stacks, browser frames with
baked shadows, a phone overlaid on a desktop — carrying no interaction and
none of our text, so re-deriving them in markup adds weight and nothing else.
Text that *is* ours (captions, phase lists, callouts) stays in the DOM. The
one exception is the Overview stack, whose two screens now swap places; a
baked-in picture cannot do that, so it is real DOM (see below).

**Media is sized by its node, never by its export — and the export is not
centred on it.** Every screenshot here arrives larger than the node it came
from, because the card's drop shadow is baked into the raster. Sizing a figure
to its export inflated this page badly: Approach ran +48 and UI Screens +293
against their own frames. Each figure now reserves `node` in flow with
`aspect-ratio` and the export overflows it at `off`, both in `caseLms.ts`.

The shadow runs `0 32px` with ~61px of spread, so an export hangs ~29px above
its card and ~93px below. **Centring it drops every card ~32px** — which is why
the Recruitment and Automotive pages, which do centre, match on height and
still sit low. Measure `off` instead: locate the card's edge in an isolated
node render (`get_screenshot` returns the export's exact bounds as
`original_width`/`original_height`) and again in the full-section render, and
take the difference. Cross-correlating the two renders' first-ink-per-row
profiles gives the same answer and catches blocks with no card edge to find.

Three traps inside that:

- **Metadata's node positions are not reliable here, its sizes are.** It puts
  the Approach media at phase-relative y=11.9 where the render says ~34, and
  its x at 2.7 where the render says flush. Anchor `off` to a box you can see
  in the render — the phase frame, the section column — not to a reported
  coordinate. The block sizes it gives (1200x700, 608x394, 1240x922, 1240x394)
  all check out against the render exactly.
- **UI Screens block 1 is a 1200 node in the 1240 column**, with the phone
  hanging off its right edge — the one asymmetric bleed here that is artwork
  (57 left, 139 right) rather than shadow.
- **That export carried a baked 1px dark column down its right edge.** Inside
  the frame it lands on the 1440 canvas boundary and is invisible; on the page
  it was a hairline 100px clear of the column. `showcase-hero.jpg` is trimmed
  by it, so `exp.w` is 1396 and not the 1397 Figma reports. Check the last row
  and column of any export you are about to hang outside its box.

Section heights now: UI Screens 3632, exactly the frame. Approach is 1438.3
against 1450.11 — the remaining -11.8 is all in phase 01, and is spacing, not
media (see the audit note in `HANDOFF.md`).

**Figma bakes the section ground into node exports, and it is not harmless.**
Every export here arrives fully opaque with a flat plate of the parent
section's background painted behind the art — the raster cousin of the
`<rect fill="#1E1E1E">` trap above. It hides for as long as nothing sits
behind the image. Put anything there — the Overview's lavender glow — and the
plate masks it everywhere inside the image's box while it still shows in the
halo bleeding outside, drawing a hard-edged rectangle exactly the size of the
image that reads as a white panel. The user caught this one.

`scripts/strip-plate.py` keys the plate out. It floods inward from the border
across pixels that are no lighter than the plate **and** still carry its blue
cast (`b/g = 255/243`); the hue test is the part that matters, because a
neutral `#f2f2f2` card border passes "no lighter than the plate" but is
artwork — without it 2.6% of pixels came out ~11 levels wrong, with it the
worst is 3.7 and the mean 0.001. Run it on any new export that will have
something behind it, and check the reported round-trip error rather than
trusting the eye.

**`rawImages` returned the same photo for three different nodes.** The
Challenge section's three sibling image rects each gave a byte-identical
`rawImages[0]` — verified by md5, and plainly wrong against the render. The
per-node `export` rendered all three correctly. **When several image nodes sit
in one frame, trust `export`, not `rawImages`**, and checksum the results
before believing them.

**Export the card, not the band.** The hero's `Frame 2147240491` is the whole
row — copy *and* card. Exporting it and rendering the copy in DOM as well put
the headline on the page twice. Check what a frame actually contains before
exporting it as "the image".

**The hero carousel is gone; the hero is one static card.** Figma draws two
overlapping slides over a row of indicator dots — a carousel parked in a
static mock — and it was built that way, cross-fading at one second per
slide. The second slide was a *different product*, an Aster Data recruitment
site standing in on a Skill Wagon case study, so the user had it removed. The
dots went with it: with one card there is nothing to indicate. `hero.media`
in `caseLms.ts` replaced `hero.slides`, and `scripts/case-hero.ts` and
`hero-card-2.png` are deleted — recover them from git if a second Skill Wagon
screen ever turns up.

**Size the card by its card, not its export.** `hero.media.w` is 569, the
width that puts the export's *card* at its Figma size; the export carries
6.5px of shadow bleed on top of that, baked in, so the media box must not
clip. (The removed second export carried 62px — sizing stacked slides by
their export widths would have left the two cards visibly different sizes.)

**The fact labels and the eyebrow above them are tracked differently, and
the difference is load-bearing.** Both are 14px uppercase, so the eyebrow's
`--tr-eyebrow-lg` (2.4px) looks like the obvious choice for the labels too —
but at 2.4 "Business Type" measures 140.55px against its 139.5px column,
wraps, and drops its value a line below the other three. Figma sets the
labels at 1.8px (`--tr-eyebrow-md`): measured off the frame, its label ink is
131px for "Business Type" and 113px for "Technology", against 138.15 and
121.2 at 2.4. The eyebrow really is 2.4 — ours is 190.8 wide against Figma's
188 node, which is the trailing letter-space CSS adds and nothing more. Check
the tracking before reaching for the font size; the size was never wrong.

### The Overview stack — two screens that trade places

`src/scripts/overview-stack.ts`, geometry in `overview` in `data/caseLms.ts`.
Every two seconds the back screen hops into the front slot and the front one
drops back. Figma 505:4396, a 634x523 box.

**Both cards are the same 500x307.** Metadata reports only axis-aligned
bounding boxes — 533.69x365.65 for the back one — which looks like two
differently sized cards. It is one size at two rotations:
`500·cos7 + 307·sin7 = 533.69` and `500·sin7 + 307·cos7 = 365.66`, both
matching to 0.01, and the render's long edges measure -7.000 degrees. Same
trap as the AI & Automation orbs, where three "different" orb sizes were one
60px disc at three angles.

**Slots are stored as centres, not top-lefts.** The back card is rotated, so
the `x`/`y` Figma reports for it is the corner of its bounding box and not the
corner of the card. Centre plus rotation is the only description that survives
the transform.

**Figma runs the copy and this box edge to edge — 0-606 and 606-1240, no
gutter.** The breathing room between them is the cards' own inset inside the
box. The section shipped with a 48px flex gap, which squeezed the stage to 586
and scaled the whole composition down 7.6%; `.cover__inner` now sets `gap: 0`.

**Mirror the two arcs or the cards vanish into each other.** Both travel the
same line between the two slots, in opposite directions, so an identical arc
puts them at precisely the same place at the halfway point — measured, both
landed on (88.9, 112.3, -3.5deg) and the upper one hid the other completely.
The riser now arcs over the top and the retiring card dips under it, which
also reads as a shuffle rather than two things sliding through each other.

**The cards are placed by CSS, and the script only ever writes the offset from
home.** `left`/`top`/`--sr` come from the data as percentages baked into the
markup, so the resting composition is correct with JS off and under reduced
motion; `--sx`/`--sy` default to 0 and are percentages of the *card's* own box,
which is what `translate()` resolves against. Everything else is a percentage
of the stage, so the composition scales as one piece — verified at 1100, 900
and 390 with no horizontal overflow and the 634/523 ratio held.

**`flex: 0 1 634px` has to become `flex: none` once the row stacks**, or the
basis is read as a height and fights the `aspect-ratio` that gives the stage
its size.

Verify it with `overviewStackSeek(p)` (phase 0-2) and `overviewStackTimeline`,
both exposed in DEV. Swaps complete at t=2.0 and t=4.0 of a 4s lap.

**Two figures are SVG exports on purpose.** The type specimen would otherwise
need five weights of Open Sans, a face this site does not load, for one
decorative block; the palette figure is a drawing with four leader lines whose
geometry only works at its drawn size. Both carry the meaning in `alt`.

**Absolute children of `.container` resolve against its padding box.** The
typography callouts are placed at Figma's offsets *plus* `var(--gutter)`,
because `.container` carries the gutter as padding rather than as a margin.
Without it every callout sits 100px left of where the frame puts it.


### The Colorography figure — draws itself, then answers the pointer

**Shared by all three case studies.** `components/case/PaletteFigure.astro`
renders it, `scripts/tag-palette.py` prepares the SVG, `scripts/palette-figure.ts`
drives the entry, and the hover lives in the component's styles. Nothing is
page-specific: LMS and Recruitment have four colours, Automotive six, and both
the reading order and the drift direction fall out of the geometry.

`src/scripts/palette-figure.ts` + the styles in `CaseRecSystem.astro`. Two
interactions the user chose: on scroll-in the illustration fades up and each
leader draws outward to its label, the label arriving as its line lands
(reading order, ~1.31s, once); and hovering or focusing a group dims the other
three and lights that group's leader in its own hex.

**These are the only figures that are NOT flattened exports.** They are inlined
SVG via `<Icon>`, because a flat PNG has nothing to address. `tag-palette.py`
adds `pal__group` / `pal__leader` / `pal__label`, `data-hex` and a `--pal-line`
per group. `npm run optimize:svg` strips unreferenced *ids* — which is exactly
why every hook is a class or data attribute; verified to survive, but re-check
the counts after running it.

**Find the wrappers structurally, not by id.** Figma reuses `Frame 2147240601`
for both a leader wrapper and the figure's own root, so matching on the name
tags the entire figure as one colour group. A wrapper is any element that
directly contains both a `…595` (leader) and a `…596` (label) frame.

**The illustration is the largest group containing no colour group.** Taking
"the first group that is not a wrapper" lands on the export's outermost page
group — which wraps the leaders and labels too, so the entry would fade the
whole diagram as though it were the art.

**Figma dedupes a repeated layer name with `_2`.** The LMS palette uses
`#4A4A59` twice, so the second arrives as `#4A4A59_2`; an exact-length id check
missed it and that leader fell back to grey, unable to light.

**A near-white swatch cannot light in its own hex** — `#F7F7F7`, `#E5F2E9`,
`#FAEFF5` and `#F4F4F4` are invisible against the lavender ground. The tagger
substitutes a readable `#8A8A93` for the *line* only; the label still shows the
true hex.

**`:global()` inside `:has()` is emitted literally and kills the rule.** Astro
does not process it there, so `.x:has(:global(.y:hover))` ships as invalid CSS
and the browser drops the whole rule. Wrap the *entire* selector instead:
`:global(.x:has(.y:hover) .z)`. The classes come from the inlined SVG and carry
no scope attribute anyway.

**`<Icon>` renders a block `<span>`, and the svg stretches to fill it.** In a
1240 column that scaled an 858-wide figure to 1049 and made the section 849
tall against the frame's 758. Pin the width on the span *and* on `> svg`.

**A transitioned property cannot be verified in a backgrounded tab.**
`getComputedStyle(line).stroke` returns the *pre-transition* value if read
synchronously, and waiting does not help either when Chrome has backgrounded
the tab and suspended rAF — the transition never advances, so the reading stays
at the start value forever. Five separate "the CSS is broken" diagnoses here
were this. Verify by injecting `transition: none !important` first, then read.

**Hit areas are built outside `registerSection`**, which bails before its
callback under `prefers-reduced-motion`. The hover is colour, not motion, and
should survive — otherwise reduced-motion visitors hover glyph outlines and
fall through the gaps between letters.

### Text must sit above the screenshots

The case-study exports carry ~60px of baked drop shadow per side, painted
over a plate of the section ground, and the figures are positioned
(`absolute`) while the copy beside them was not — so the overhang painted
over the first words of the neighbouring text (the user caught "JD search &
candidates ranking" cut at its start). `CaseHeader`, both Approach
`.phase__copy`, both Screens `.shot__copy`, both case heroes' `.chero__copy`
and Automotive's `.ahero__copy` now carry `position: relative; z-index: 1`.
Check with `elementFromPoint` at each text line's two ends — if it lands on
an `<img>`, the text is covered — on every page at several widths; a
screenshot alone missed most of the twenty cases.

### The challenge section — redesigned for all three case studies

Every frame draws the challenge as a red uppercase ✕ list beside a collage
of AI-generated photos; the user judged that off-brand against the rest of
the site. Two layouts were tried on the Recruitment page and **B** was
chosen: `case/CaseChallenge.astro` — the case header (eyebrow and title left,
intro right) over one panel split into four columns by hairlines (the
panel's fill through a 1px grid gap, so the lines hold at 4 / 2 / 1
columns). Each column opens on a small UI picture of the pain
(`case/ChallengeArt.astro`, twelve of them, typed in `challenge-art.ts`),
then the number, the challenge in sentence case and what it cost — those
lines are our copy, written from each page's story. Data: `challenge.cards`
in `caseLms` / `caseRec` / `caseAuto`. The old markup and styles were cut out
of the three Overview components (shared selectors such as
`.cover__title, .chal__title` kept their other half) and the five photos are
deleted. The pictures were checked for overlapping or escaping labels at 11
widths per page — a candidate-row caption collided at 1181 and now wraps.

## Case study — AI Powered Recruitment Platform

`src/pages/work/ai-recruitment-platform.astro` — Figma 514:6633, ~9,650px.
Copy and geometry in `src/data/caseRec.ts`. Reached from the Studio grid's
AI Powered Recruitment Platform card. Static apart from the Overview stack,
which reuses `overview-stack.ts`.

**It is the LMS template.** The two frames are section-for-section identical
and seven of the eight sections are the same height to the pixel — only UI
Screens differs (3475 against 3632). So the components are the LMS ones
duplicated and re-pointed at this data. Check that before assuming a new case
study needs new components; compare the top-level section list first.

**Size media by its card, not its export.** Every screenshot export here
carries 53-61px of baked shadow per side, and sizing the figure to the export
pushes each block taller than its frame. These components reserve the node's
box with `aspect-ratio` and let the export overflow it, centred, which lands
all five screen blocks exactly (700/394/394/765/394) and the phases at 407
against 406.6.

**The centring is an approximation, and the LMS page measures the real
offsets.** These shadows are not centred on their node — they run `0 32px`
with ~61px of spread, so an export hangs ~29 above its card and ~93 below.
Centring it therefore drops every card ~32px. It does not change any height,
which is why this page still measures right; see the LMS note below for how
the offsets were measured, and port them here when this page is next opened.

**The emphasis runs the other way from the LMS hero.** There the *lead* is
italic in the accent purple; here the *tail* is italic and stays in the
heading ink. Reproduced as drawn rather than normalised.

**Typography ships as one flattened figure here, unlike the LMS page**, which
places its specimen, card and callouts individually and draws the dashed
leaders as inline SVG. None of those coordinates transfer — this frame puts
its card at (656, 129) against the LMS's (632, 111). Exported from the
container (514:7010), not the body, because the "Heading - Medium" callout is
a sibling of the body node; the header band is cropped back off.

**The Challenge title is ours, not the frame's.** Figma still carries the
LMS frame's "Learning was happening everywhere - except in one connected
place" there, a stray paste; at the user's request it reads "Every
requirement had its own spreadsheet. No one had the full picture." — the
pains listed under it, echoing the hero. The approach eyebrow is still
spelled "our approch" as drawn; flagged, not fixed.

## Case study — Automotive Marketplace

`src/pages/work/automotive-marketplace.astro` — Figma 510:5689, ~10,100px over
eight sections. Copy and geometry in `src/data/caseAuto.ts`. Reached from the
Studio grid's Automotive Marketplace card. Static; `reveal.ts` only.

**The Figma frame is named "AI Powered Recruitment Platform" and that name is
wrong.** Every word inside it is the bike-dealer marketplace — the hero says
"AI Reel Creator", the fact row says "Automotive Marketplace", the screens are
a vehicle stock app. A stray name from duplicating a frame, like the Careers
frame carrying the Talent Intelligence CTA. Confirmed with the user, who had
it wired to the Automotive Marketplace card. There is no separate recruitment
frame in the file, and no separate automotive one.

**Everything inside the hero's `Pattern` frame is offset by -55.** The frame
sits at y=-55 and metadata reports its children relative to it, so the rules
Figma lists at 35.5/161.5 land at -19.5/106.5, and the Union it puts at y=154
really starts at 99. Verified four edges against the render: left shoulder
predicted 227 / measured 229, right 203 / 206, foot 1011 / 1011. `AutoHeroPattern`
carries the corrected numbers.

**The hero headline tracks at -3px, not the -2 every other hero uses.** At -2
our ink is 511.2 against Figma's 488 on line one; at -3 it is 487.2 and line
two lands at 255.6 against 256. A narrower face would explain line one but
predicts 254.5 for line two, so it is tracking, not the font. `--tr-h2-tight`.

**`strip-plate.py --exact` exists because the tolerant flood eats faded
artwork.** The Phase-02 phone's own screen is `(243,241,252)` — three levels
off the plate — so the default test flooded 99.8% of that export and destroyed
it. Strict mode keys only pixels within 1 level of the plate. Use it for any
export whose artwork has large near-plate areas; the tolerant mode is for
exports with real soft shadows to recover.

**An absolute child of these section frames must add the 100px container
inset back.** The 1240 container is the frame's *padding*, and an absolutely
positioned child resolves `top` against the border box — so every piece of
media sat 100px high until an explicit `INSET` was added. The flowed sections
(Approach, UI Screens) are unaffected because their bodies are in normal flow.

**An inline `top` beats the class rule.** Row C of UI Screens is positioned
from data like every other shot, and a `.ascr__shot--c { top: 2541.25px }`
rule was silently overridden by the element's own inline `top`, parking the
row at the top of the section. Its offset lives in `caseAuto.ts` now.

**Export the container, not the body, for the typography figure.** Only the
"Body Text" leader is a child of the body node (510:5924); "Heading - Semi
bold" and "Button label - Regular" are siblings of it, so a body export
silently drops two of the three labels. It is exported from 510:5915 with the
header band cropped back off.

**Phase spacing: 16px between a phase title and its items, not 48.** Figma
runs the title 0-32 and the items 48-169; confusing that gap with the 64 that
separates section blocks made the section 33px tall against the frame's 1638.
Each item is a 121 box — 24 above the label, paragraph 49 from the top, 24
below before the rule.

**Copy is reproduced as drawn, typos included** — "OUR APPROCH", "Invidiual",
and a UI Screens intro that still says "learning experience". Flagged, not
silently corrected.

## Capability pages

Three routes, one per capability — `/product-design` (Figma 637:2092),
`/product-engineering` (646:5614) and `/ai-automation` (647:6301, with the
AI Agents and Workflow state boards 647:7514 / 647:7155). **Nav, footer
links and routes are deliberately not wired to them yet** — the user will
say how; do not touch the header or footer for these pages.

| page | data | components | scripts |
| --- | --- | --- | --- |
| Product Design | `data/capProductDesign.ts` | `sections/Cap*.astro`, `cap/*` | `cap-features.ts`, `cap-outcomes.ts`, `cap-webwork.ts`, `cap-pin.ts` |
| Product Engineering | `data/capProductEngineering.ts` | `sections/Pe*.astro` | `pe-hero.ts`, `pe-services.ts` |
| AI & Automation | `data/capAi.ts` | `sections/Ai*.astro`, `ai/*Art.astro` | `ai-hero.ts`, `ai-agents.ts`, `ai-workflow.ts`, `ai-doc.ts`, `ai-voice.ts`, `ai-industries.ts` |

All three end on the shared `CtaFooter` with page copy (`title`/`body`
props; AI passes `copyWidth={642}` so its longer body sets in two lines).

### Shared pieces

**`fit.ts` scales a fixed composition to its column** — a tilted browser
card, a browser fan, a phone row, a diagram with no text. `<div class="fit"
data-fit="W" style="--fit-w:W;--fit-h:H"><div class="fit__inner">`; the
script writes `--fit` and CSS in `global.css` does the rest. Two traps
found the hard way:

- **Measure with `getBoundingClientRect().width`, not `clientWidth`.**
  `clientWidth` rounds, so a 568.419 box measured 568 and scaled by 0.9993 —
  invisible, but it re-rasterised a desktop picture. Anything within 0.2% of
  1 snaps to 1.
- **Never put `data-animate` on the `.fit__inner`.** The reveal writes an
  inline transform that fights the scale. It goes on the `.fit` wrapper.

Text is never fitted. If scaling a composition would put its text under
~11px, re-proportion it for the phone instead (see each page below).

**Pins start centred under the nav** (`pinStart()` in `cap-pin.ts`) — at
`top top` the 83px nav covered the first line and the frame sat high. The
user asked for this explicitly.

**`PillButton` has `flat` (solid accent, no gradient) and `arrowIcon`.**
The headline italics on all three heroes are **Inter 3.19 Medium Italic**,
self-hosted (`public/fonts/inter-latin-500-italic.woff2`) — Google's Inter 4
italic set 5px wider with a single-storey "a" and did not match Figma.

**Inside strokes are `box-shadow: inset`, not `border`,** on every eyebrow,
icon chip and bento card here; as borders they grew each box 1-2px and
pushed every label out of place (eyebrows 33 tall against 32, AI cards 473
against 471).

**`BrowserChrome`'s URL is `.chrome__url-text`.** It was a bare `span`
selector, which also caught the lock `<Icon>` and gave it `flex: 1` — every
browser frame on the site centred its URL. Same trap as the two below.

### Breakpoints

`>= 1440` is Figma. **1280-1439 is fitted, not redesigned** — every page
had sections cut off at 1280 (Approach copy, project screenshots, right-hand
Outcomes cards, Website card, PE hero diagram and Process ladder, AI hero
target, Engineer zig-zag). Each now gives way: copy columns shrink
(`flex: 0 1 W; min-width: 0`), right-hand pieces anchor right instead of
taking Figma's left offset, and placed compositions fit. Below 1280 each
section is redesigned (tablet), and again at 560 (phone). The AI
illustrations add a third step at 700, where their panels drop under their
drawn width.

**Pins and hover exist only from 1280.** Below, `gsap.matchMedia` swaps
them for tap: Key Features rows, Outcomes cards and PE service cards become
`role="button"` with Enter/Space, and the desktop's lit default is the
starting state. **The user rejected auto-advancing / auto-cycling as the
mobile replacement** — nothing may change on its own where desktop needs a
scroll or hover to change it.

### Product Design

**Design Approach is a film now (`sections/CapFilm.astro`), not the pinned
ring.** The user replaced the six-step scroll pin with a 60s motion film of
the process (`public/videos/nulyft-ux-capabilities.mp4`, 1920 x 1080 H.264
+ AAC, 8.4MB, moov at the front so it streams); most visitors never stepped
through six pinned states. `CapApproach.astro`, `cap-approach.ts`,
`cap-approach-geometry.ts` and the four stack images that only it used are
deleted — recover from git if the ring ever comes back. The six steps stay
in `approach.steps` and render as a visually hidden list.

Laid out to the user's reference: the dark band, the eyebrow and title
centred in white, the film as a 16px-radius lavender card 1094 wide at
1440 (the reference's box is ~2.4:1; the film keeps 16:9 rather than be
cropped), and play/pause + sound buttons in a row under it — on the film
they covered its own captions on a phone. The card is also capped at
`(100svh - 360px) * 16/9` so eyebrow-to-buttons fits under the nav on a
laptop. Playback: muted autoplay + loop while 40% on screen and the tab is
visible; `preload="none"` until 600px away; a visitor's pause sticks
through scrolling; unmuting starts it. Under reduced motion it never
starts itself and shows the poster (the 56.3s collage frame, "One design
mindset…"); autoplaying, the poster is removed because the film opens on
an empty lavender frame and the collage would flash first. Without JS the
native controls stay. Verify in full Chrome for Testing — the headless
shell needs the metadata-ready check made before the listener, or it
waits forever.

**Key Features must fit the window while pinned.** The section is ~990
tall; a 16" MacBook's window holds it, a 13-14" one does not, and the fifth
tab sat below the fold for the whole pin (the user caught it).
`cap-features.ts` `fit()` trims the 100px padding (to 24 at least), then
scales `.proj__inner` about its top centre only if it still does not fit,
giving the saved height back with a negative margin so the pin measures the
scaled box; re-run on `refreshInit`. Measured: 1728x1000 untouched, 1512x860
padding only, 1440x780 0.96, 1366x680 0.80-0.83, 1280x640 0.77 — all five
rows on screen for every tab. `cap-pin.ts`'s `NAV_H` is 120 now (the
floating card's foot); 83 was the old bar.

**Key Features** pins one tab per scroll band on desktop; below 1280 the
screen sits on top and a tap selects a row. The rail fills to the measured
bottom of the active row there, since rows wrap to different heights.

**Product Outcomes**: hover via `:has()` on desktop, tap below 1280
(`cap-outcomes.ts`, class `is-tap`). Cards and connectors are anchored to
the centre (`50% + 188px`, `50% + 35px`, `50% - 190/192px`) rather than
Figma's left offsets, which only hold at a 1240 column; the lit connector
art is 2px wider than the idle one.

**Websites Featured (marquee)**: the lap is measured from the DOM, not baked
in — phones run 280x194 cards. **`--lap` is declared on the track, not the
section**, because `--n` is set on the track and a custom property resolves
where it is declared; on `.ww` it was silently invalid and the rows lost
their Figma offsets.

**The hero's tool chips must not sit over the screen fans on mobile** — the
user caught it. They stack under the fans (`--vs` / `--ts` / `--gap`).

**Copy update — Figma 673:3980 (Oct 2026).** Content only; the layout is
untouched apart from what the new copy needed: the hero copy column 654 -> 694
(the headline sets in two lines), the Asterdata lead body 788 -> 964 and its
outcomes body 695 -> 787 (both two lines in the frame), the lead title's
`capitalize` dropped (every heading here is now set as typed — only the two
website headings stay Title Case), the Design Approach tag lines removed (the
new steps have none — and the section is now the film, see above), and
an optional `tagline` under the Skill Wagon and Automotive names. The page CTA
carries its own copy. Desktop height is still the frame's 11,519.

Read the copy with `use_figma` (`characters` of every visible TEXT node), not
`get_metadata` — layer names here are stale ("Three core product categories
engineered for enter" names half the paragraphs). The frame and its state
boards disagree in three places; the page frame wins: approach title, Skill
Wagon tab 5 ("Assessments Experience" vs board "Assessments and Quizzes") and
Automotive tab 3 ("Immersive Bike Details" vs board "Detailed Vehicle
Information"). The facts swap Technology and Scope values against the old
copy — as drawn. Two Figma paragraphs break mid-word ("corpo / rate"): the
text carries non-breaking spaces; the site wraps normally.

### Product Engineering

**Hero diagram.** Desktop: Figma's five connector exports, each drawn hub ->
card, carry a pulse that makes the card's chip glow. 1280-1439: the diagram
anchors right and fits. Tablet: under the copy at full size. **Phone: the
same composition re-proportioned, not scaled** (scaled, the card text was
6px) — 150 halo, compact title-only cards in their desktop places, and
elbow wires drawn by `pe-hero.ts` from the laid-out positions (redrawn on
resize). The user asked for the desktop pattern here after a grid version;
that preference is in `HANDOFF.md`. Every phone width 320-560 was checked
for card/halo overlap — Infrastructure sits at top 90, and <= 360 the hub
steps down.

**`.peh__diagram > *` outranks a plain card rule**, and the cards' inline
`left`/`top` still offset a `position: relative` box — phone overrides are
`.peh__diagram > .peh__card` with `!important` on the offsets.

**`getTotalLength()` is guarded** — engines may refuse to measure a path
under `display: none`.

**What We Do** keeps three columns down to 901; 900-561 turns each card
sideways (screen left, copy right) so no card sits orphaned in a 2-up
grid; phones stack upright. **Process** becomes stacked boxes joined by a
line through their icon chips. **Proof** is copy over media.

**Copy update — Figma 673:9086 (Oct 2026).** Content only. What the copy
needed: hero copy column 481 -> 518 (two-line headline), the proof intro 788
-> 892, `capitalize` dropped from the What We Do and proof titles (every
heading is set as typed now), the hero's second button removed (`secondary:
null`, rendered only when set) and the CTA button relabelled "Discuss Your
Project" (`CtaFooter` takes `button`). The Automotive proof entry is now
"Motorcycle Discovery Platform". Left as built, and flagged: the new frame's
hero is 799 tall against our 931, and its proof section 2,347 against our
2,155 — spacing changes, not copy.

### AI & Automation

**Hero burst.** Dashed lines shoot from the hub to all nine logos at once
and run *forward* through them — never drawing back, by request. A dashed
stroke cannot be drawn on by dash offset, so each line is masked by a solid
copy whose dasharray is `L L`: offset L hides it, 0 shows it, -L has slid it
past the far end, so one tween L -> 0 -> -L is out-and-through.

**The four What We Do illustrations are live DOM**, and below 700 each has
its own phone composition at full text size:

| art | phone version |
| --- | --- |
| Agents | elbows 120 -> 24 via `preserveAspectRatio="none"` + `vector-effect: non-scaling-stroke`; right-hand tools and labels follow |
| Workflow | every x is Figma's from the 460 panel's left edge; `--ox: calc(50% - 230px)` re-centres it (0 at 460) |
| Document | page drawn at 0.76 from its left-middle; the links SVG **translates** 41px (a translate keeps the pulse dots round), fields 191 -> 150 |
| Voice | the flow turned 90 degrees — channels on top, card, outcomes in a row — with a second path set `data-vo-links="m"`; `ai-voice.ts` builds per breakpoint in `gsap.matchMedia` and rebuilds on change |

They are laid out for a 330 panel; under 375 they `zoom: 0.86`. On phones
the panel runs to the card's edges.

**Industries carousel** renders the set three times and steps one card
every 3.2s, dropping back a whole set at the wrap; the highlight follows the
card nearest centre mid-slide. Dots and arrows were removed by request. It
auto-plays on desktop too, so it is not a hover replacement.

**How We Engineer It**: 1280-1439 fits the 1240x455 stage; below 1280 the
zig-zag runs down — cards at 82% alternating sides, joined by a dashed
S-elbow drawn in the card's own width units (18% of the column is 21.95% of
a card).

**Copy update — Figma 673:9776 (Oct 2026).** Content only, read line by line
off the frame's 148 text layers. Changed: the hero (eyebrow "AI & automation",
"Turning AI into practical solutions", new body, primary "Discuss Your AI
Project" and no second button — `secondary: null`, rendered only when set);
the four What We Do cards' kickers (now technology lists, set as typed:
"LangChain · LLMs · Tool Calling · RAG", …), titles and bodies; the Where
can we help title and body; the How we engineer it title, body and all four
step bodies; the CTA title and body. Unchanged: every illustration label,
the technology section, the seven industry cards. The What We Do title lost
its `capitalize` — Figma sets every heading here as typed. Two lines are
kept as drawn and flagged: "information that can searched" and
"infrastructure that needed to bring".

**The technology ecosystem replaced "What we've been building"** (Figma
673:10175, Oct 2026). `sections/AiTechnology.astro`, data `technology` in
`capAi.ts`, logos in `icons/ai-tech/`, hub `brand/ai/tech-hub.svg`;
`AiProjects.astro` and its data are deleted. 24 tiles at Figma's stage
coordinates, read per tile with `use_figma` (they sit in nested, offset
groups). The rings are SVG circles with a vertical white gradient stroke at
0.36 — the design context reports that stroke as flat transparent white, so
it reads as "no rings" unless you check `strokes` directly. Below 1240 the
stage scales via `fit.ts` (no text in it); its mobile layout is still to do.
The AI hero's "Explore Our Work" pointed at `#ai-work`, which went with the
old section — it now opens `/studio`.

**Its hover (`scripts/ai-tech.ts`):** the tile lifts, glows and names
itself, and its ring brightens — CSS classes the script toggles; touch
devices toggle with a tap. A line to the hub with a travelling dot and a hub
pulse was built first and removed at the user's request, so don't bring it
back. The dev server once served this component's CSS stale (labels showed
inline beside every logo) — `touch` the component before believing it.

**The tiles float (user-approved), as a CSS animation — not GSAP.** Each bobs
4-6px over a 4-7s cycle, a third also 1-2px sideways, phases spread by a
seeded hash so no two move together; vars are set per tile at build time.
Paused under hover (`.is-on`), off screen (`.is-idle`, an IntersectionObserver
in `ai-tech.ts`) and reduced motion — which needs `animation: none`, because
the global reduced-motion rule only shortens animations and would park every
tile at the end of its drift. The first version drove the same motion from
GSAP: on a 2x, 4x-throttled run it pushed long frames from ~12% to 30-44%,
because 24 main-thread transform writes repainted the inline logos. As a
compositor animation it costs ~21% in the same test (software compositing);
on a GPU the layers are close to free.

### Testing these pages

- **Never return a GSAP timeline from `page.evaluate`.** `tl.pause(0)` and
  `tl.seek(t)` return the timeline, Playwright tries to serialise its cyclic
  graph and the call hangs forever — two "frozen page" diagnoses here were
  this. Wrap the call in braces.
- The widths swept: 1440 1366 1280 1279 1260 1240 1200 1180 1160 1100 1060
  1024 1000 960 920 901 900 880 840 834 800 768 700 640 600 561 560 500 460
  430 414 390 375 360 340 320 — `scrollWidth === clientWidth`, and no
  heading or paragraph past the viewport.
- 1440 must stay pixel-identical: diff each section against a capture taken
  before the change. A `scale(1)` fit wrapper still changes text
  anti-aliasing in the strip it covers; that is the only accepted residue.

## Mobile

The five sections the user designed mobile frames for are built from Figma
section **538:13647** ("mobile"), all 393 wide: Why nuLyft (493:2503),
Technologies (493:2524), Industries (493:2737), Our Process (536:13470) and
CTA + footer (539:705). Everything else on the page is adapted in code.

**The breakpoint is 900 for layout and 560 for type.** Every mobile frame is
393 with a 16px gutter, which is what puts its content column at 361 — the
global gutter steps 100 -> 32 (<=900) -> 16 (<=560). Every mobile section runs
40px of block padding.

**Read the breakpoint through `gsap.matchMedia`, never once at load.** Four
scripts (`why-orbit`, `process-scroll`, `industries`, `cta-fan`) checked
`matchMedia(...).matches` a single time when the module ran. A page opened wide
and then narrowed — which is exactly what device mode does, and what a rotation
does — kept the desktop behaviour at phone widths: Why nuLyft's chips stayed
out on the ellipse at (705, 48), and Our Process stayed pinned. `gsap.matchMedia`
re-evaluates on resize and reverts each context on the way out. Anything those
callbacks write as inline style has to be cleared by hand; GSAP only reverts
what it created.

**An inline `left`/`top` beats a media query.** Both Our Process and Industries
emitted their desktop coordinates as inline styles, so the mobile layout could
never take over however specific the rule was. Both coordinate sets now reach
the CSS as custom properties and the media query re-points them.

**`define:vars` sets its variables on the elements themselves.** Redefining
one further up the tree therefore does not reach them — Industries' mobile ring
offsets, hub size and pill height all had to be written as concrete properties
rather than by re-pointing `--ringAOff` and friends on an ancestor.

**Scale a card's art only after centring it.** The Technology cards' bodies are
placed from a desktop left offset, so `transform-origin: top center` pivots
about the element's own centre and leaves it where it was — Engineering came
out 31px right of its card. `left: 50%` plus a negative half-width margin
first, then `scale`.

### Our Process — the mobile timeline

A serpentine vertical timeline (536:13470), not the pinned horizontal track
scaled down. No pin, no ball, no trail; `process-scroll.ts` only lights each
step as it is reached, and `once: true` so a step you have read stays lit.

**Figma turns the Timeline vector 180 degrees and the SVG export carries no
transform.** Drawn as exported, every bend is on the wrong side *and* half a
period out. A horizontal mirror alone fixes the left/right alternation — which
makes the chips look right — and leaves the vertical phase wrong, so each bend
peaks above its step instead of beside it. The test that settles it: measure
the frame's own render for the curve's x at each title row (347-361 / 33-42 /
347-362 / 31-46 / 349-360) and check which transform predicts all five. Only
`rotate(180deg)` does.

**Metadata reports a bounding box for that vector that is not its box** (it
gives x=347, y=1512 for a 328x1512 node). The placement came off the render:
ink at frame x 31..362, y 267..1724.

### Technology — the mobile stack

`repeat(3, 1fr)` had no breakpoint at all, so below ~900 it produced three
100px columns holding content built for 403. The four cards now stack at the
column width with the frame's 24px gap, each taking its own drawn height
(291 / 404 / 440 / 413.71) via `mHeight` on `TechCard`.

The interiors are fitted by scale rather than re-derived, because none of them
is a clean ratio of its desktop self. What each scale is pinned to:

| card | scale | why that number |
| --- | --- | --- |
| AI & Automation | 0.33 | puts the ring radius at 182 against the frame's 180.5 |
| Engineering | 0.774 | the pipeline is 341 tall and the card leaves it 264 — below this the fifth chip falls off the bottom |
| AI & Data | 0.8 | badges render 101 against the frame's 88 hub / 64 sides |
| Cloud | 0.85 | tiles render 50 against the frame's 41.4 |

**Cloud's card is 453 rather than the frame's 413.71.** Four rows at a scale
that keeps the tiles near the frame's 41.4 need 429 of card, so at 413.71 the
fourth (Kubernetes) was cut off. The user chose the taller card over smaller
tiles. Its rows alternate their tile indent 0 / 64 / 0 / 64 — that is the
frame, not a centring error.

**The AI & Data edge veils must reach the card's edge.** Figma insets the left
one 6px, which is invisible on desktop where the orbit runs far wider than the
card. Centred and scaled to a phone those 6px are a gap, and an item can slide
past un-washed — the one thing the veils exist to prevent.

### The case studies — mobile

No Figma frames; adapted in code. All three share one pass, and four of its
findings are shared with them:

**Exports overflow their box on purpose, and below 1240 there is no gutter
left to absorb it.** Every screenshot here carries 53-84px of baked drop
shadow. `.appr` / `.scr` / `.typo` / `.pal` / `.aph` / `.ascr` / `.asys` /
`.acol` carry `overflow-x: clip` — `clip` rather than `hidden`, so no scroll
container is created and `position: sticky` elsewhere still works. Without it
the page scrolled sideways at 1100, 900, 768, 560 and 375 alike.

**A hero band that goes `position: static` loses its gutter.** `left` and
`right` stop applying the moment it does; `translate` does not. Both
`CaseLmsHero` / `CaseRecHero` (`.chero__band`, static at 980) and
`CaseAutoHero` (`.ahero__copy`, static at 1180) need the gutter back as
`padding-inline`. This is the third place in the build this has bitten —
`PageHero` was the first.

**`CaseHeader`'s two columns are rigid.** 525 + 32 + 503 = 1060 against an 896
content width at 1100, so the intro ran 64px past its section between 1080 and
1240. It scrolled the page before the sections clipped; after, it would have
truncated the paragraph silently. Both columns are `flex: 1 1 0; min-width: 0`
below 1240, and the row's fixed `height: 84px` becomes `min-height` because a
narrower title takes a second line.

**Tracking does not scale with the font size.** `--tr-h2` is -2px, which is a
40px heading's tracking; left on a 20px mobile heading it closes the words up
by a tenth of their width and the line reads as one word. Same for a 13px
label still carrying a 14px eyebrow's 2.4px. Every mobile size here sets its
own `letter-spacing`.

**The hero badge has to be sized per page.** It is one line of uppercase in a
339px column: LMS's label is 35 characters and fits at 10px/1px, Recruitment's
is 44 and needs 9px/0.6px. The tell that it does not fit is the pill measuring
the full column width rather than hugging — `getClientRects().length` and the
element's height both report one line while the render shows two.

**Scale steps at 900 then 560**, which is the site's existing convention (see
`SectionHeader`). Without the 900 step the tablet band runs desktop type in a
single narrow column — it was ~3,400px taller than the phone layout.

**`white-space: nowrap` on a fact row survives into the mobile grid.** All
three fact rows set it so a label holds one line in a wide desktop column.
Dropped into a 171px mobile track, "Automotive Marketplace" is simply wider
than its cell and paints straight over the next one — the grid was correct,
the nowrap was not. Every mobile block resets `dt`/`dd` to `white-space:
normal`. Symptom: the columns measure right and the text still overlaps.

**Media placed by `left` needs `margin-inline: auto` once it joins the flow.**
Automotive's phase phones, overview phone and challenge photos are absolutely
positioned on desktop; below 1280 they go static with a capped `max-width`,
and without an auto margin a 240px phone sits hard against the left gutter
under centred copy. Same for `.ascr__shot`. This is the companion to the
`left` / `translate` note above — `left` stops applying, so nothing is
centring them any more.

#### Recruitment and Automotive — the typography figure is flattened

Both pages ship their type specimen as one 1240-wide export, unlike the LMS
page which places its specimen, table and callouts individually. A flat export
cannot reflow, so on a phone it can only shrink: 0.27x, with the card's labels
sub-pixel and the whole block reading as blank against the ground.

Each export has **exactly one clean vertical gap** in it (device x 980-1096 on
Recruitment, 968-1232 on Automotive), found by counting alpha coverage per
column. The halves crop apart there without cutting any artwork, including the
leader labels, and stacking them below 900 roughly doubles the scale. They are
`typography-m1.png` / `typography-m2.png` beside the original, declared as
`typography.split` in the data, and swapped by CSS alone — both pairs are in
the markup and one is always `display: none`. **Regenerate both crops if the
source figure is ever re-exported.**

#### Automotive — `width: 100% !important` is wrong when the width is inline

`.ascr__shot` carries its size inline per shot: 1387 for the three-phone rows,
311.5 for a single phone. The `≤1280` rule forced all of them to the column
width, which blew one phone mockup to 836px at 900 and left it soft at every
width under 1280. Dropping the override and clamping with `max-width: 100%`
lets the inline width stand where it is small enough — inline beats a
stylesheet `width`, so nothing else is needed — and took 3,100px off the page
at 1280.

Note that **Automotive stacks at 1280, not 900**: its section frames are
absolute compositions, so below the design width everything goes static at
once and the page grows from 10,119 to 12,912. That is inherent to the page,
not this pass.

#### Two things left as they are

**The Colorography figures' hex labels are ~8px on a phone.** The figure
scales to the column and its leaders reach both edges, so there is no slack.
The fixes are a horizontal scroller — which `normalizeScroll: true` swallows,
the same reason the Studio tabs became a dropdown — or rebuilding it as a
swatch list from data that currently lives inside the SVG. Flagged to the
user.

**Desktop product screenshots are illegible at 375.** Their captions carry the
meaning there.

#### Verifying

1440 / 1280 / 1240 / 1100 / 1000 / 900 / 768 / 600 / 560 / 430 / 375 / 320,
checking `documentElement.scrollWidth === clientWidth` and that every
`.chead__body`'s right edge is inside its section. Desktop heights must stay
9,776 (LMS) / 9,622 (Recruitment) / 10,119 (Automotive).

**Screenshots of these pages need two captures.** Images here are `lazy` with
`decoding="async"`, and the first shot after a scroll routinely comes back
blank for an image that measures as loaded with `opacity: 1`. Several "the
figure is not rendering" diagnoses in this pass were that. Sample the pixels
(`drawImage` to a canvas) before believing a blank — but note a transparent
PNG reads as black on a fresh canvas, so count alpha, not luminance.

### Studio page — mobile

No Figma frame; adapted in code before the redesign, and the card rules carry
over. The new hero has not had a mobile pass yet. What still applies:

- **`.pcard__meta` is `nowrap` on desktop on purpose** (see above). At 341 it
  has 572px of text in a 311 box, so below 1240 it wraps at 11px.
- **The phone row is a flex row below 900** instead of the slotted stage, so
  the shots fill the card.

**`.cta` is a fixed 1240 centred with `translate: -50%`,** so under that width
it overhangs both edges — at 1100 it sat at left -70 and scrolled the page
sideways on *every* page that uses `CtaFooter`. It is fluid below 1240 now.
The 900-1240 band is the one nobody audits; check it.

**An absolutely placed, `translate`-centred block that goes static on mobile
keeps its translate** — `left` stops applying, `translate: -50%` does not, and
drags it off the left edge. Bit the old `PageHero`; `CentredHero` will need
the same reset in its mobile pass.

### Careers page — mobile

No Figma frame; adapted in code. It inherited the `PageHero`, `SectionHeader`,
`EyebrowBadge`, gutter and `CtaFooter` fixes for free, so it never scrolled
sideways — the work was scale and rhythm:

- **The cards read larger than the section they sat in.** Card titles were 24
  against a 20px section heading and bodies 16 against 12. 18/14 with a 40px
  chip restores the hierarchy.
- **The empty state's heading was 32** — the one thing on the page, shouting.
- Block rhythm was still the desktop's 100 (perks) and 120 (jobs); both are 40.
- **The photos lose their fixed grid rows when the bento restacks** and fall
  back to the image's own aspect ratio, which ran the portrait shot to **1252
  tall at 900** — again in the band nobody audits. `.shot` takes 16/9 from
  1080 down and 4/3 below 560; `object-fit: cover` is already on, so a ratio
  crops rather than distorts.

### Sections adapted in code, no frame

Hero (eyebrow hugs at 11/0.4 or it wraps and fills the column; the stage is
sized to its composition, 300 at <=620, not the 520 that left 260px of dead
air), Key Highlights (illustrations capped at 64 high), What We Do (one
capability per line below 560 — wrapping two left a short label stranded
beside a long one), Selected Work (the phone pieces were absolute px inside a
fixed 575x317 stage and ran ~230px off screen; they are percentages of that
box now, so the stage scales with its column).

**A pinned section is expensive on a phone.** Why nuLyft is the only one left
pinned, and its throw is 55% per step there against 90% on desktop — at 90% it
was 2.7 screens of sticky scrolling for four items, which reads as the page
having jammed.

## Assets from Figma

Export icons individually (`download_assets` on the icon node, `svg`) rather
than exporting a whole frame — frame exports embed rasters and the Figma canvas
background. The hero pattern and browser chrome were both rebuilt/split for
this reason (208KB and 135KB exports respectively).

Exported SVGs carry `preserveAspectRatio="none"` and an inline `display:block`
style; strip both. `<Icon>` inlines from `src/assets` at build time so CSS can
recolour paths and GSAP can target them, and namespaces internal ids per icon
(Figma reuses `filter0_d_0_4`, `clip0_…` across exports, which collide once
several icons share a document).

**Two export traps, both seen already:**

- *A parent frame's clip is not part of the child's export.* The eyebrow avatar
  came out as a square because its circular mask lived on the Figma frame
  (`overflow-clip rounded-[300px]`), not the vector. If a shape exports the
  wrong silhouette, this is why — ask for the SVG directly.
- *Frame exports drag the canvas in.* Node exports arrive with Figma's
  `#1E1E1E` canvas rect and the parent section's background rect on top. Strip
  any `<rect>` filled `#1E1E1E` or sized to the frame, or the asset carries an
  opaque background. **But only outside `<defs>`.** Figma's standard export
  wraps content in `<g clip-path="url(#clip0…)">` whose `<clipPath>` holds a
  frame-sized `<rect fill="white">` — that rect *is* the clip shape, and
  stripping it empties the clip and makes the whole graphic invisible while
  the element keeps its box and computed styles. The acroplans client logo
  disappeared exactly this way. Check `clipPath` contents are non-empty after
  any rect surgery, and confirm ink with `svg.getBBox()` rather than the
  element's own rect.

**`download_assets` returns every raster twice.** Each `rawImages` entry is
followed by a ~512px thumbnail of itself — the studio screenshots came back as
4096x1905 *and* 512x239. Take the larger of each pair; the count being double
what you expect is the tell, not a sign you grabbed the wrong node.

**Both `get_design_context` and `download_assets` hand back the original
uploaded bitmap, not a scaled export.** The studio shots arrive at 4096px for a
564px slot, so there is never a reason to ask the user to re-export a photo
that is already placed in the file.

**`download_assets` does not return `svgAssets` in document order.** Exporting
a group of icons gives you an unordered array — pairing them by position
silently mislabels every icon. Figma preserves the layer name as the SVG's
first `id`, so verify with:

```
grep -oE 'id="[^"]+"' icon.svg | head -1
```

This bit once already: six What We Do icons came back in a five-way
permutation. Prefer `get_design_context`, which returns URLs already labelled.

**Photos and screenshots** go in `src/assets/images/` and render through
`astro:assets` `<Image>` with `widths={[w, w*2]}` — sharp emits WebP at both
densities. The six What We Do panels are 150KB served vs 1,032KB of source
JPEG. Never put them in `public/`, which ships the original bytes untouched.

After adding icons, run `npm run optimize:svg`. It rounds coordinates to 2dp
(Figma writes 4–5, far below a device pixel) and drops unreferenced layer ids —
worth ~30% per file, and it compounds because repeated icons are inlined per
instance (`badge-check` appears 17x on the home page today).

## Development

```
npm run dev       # http://localhost:4321
npm run build     # static output to dist/
npx astro check   # typecheck .astro files
```

Dev server debugging: in DEV, `window.gsap`, `window.ScrollTrigger`, and
`window.smoother()` are exposed on the page for console inspection.

**Restart the dev server after any `npm install` / `uninstall` — or an
`astro.config.mjs` edit.** Adding the NxtDealer redirect did exactly this:
the config change restarted the server, every script 504ed ("Outdated
Optimize Dep") and the home hero sat on slide 1 with nothing else running. Mutating
node_modules under a running server invalidates Vite's pre-bundled deps; it
rebuilds the cache without GSAP while still serving the old chunk hashes, so
every module 504s and the page silently falls back to its no-JS state:

```
npx astro dev stop && rm -rf node_modules/.vite && npm run dev
```

The dev server also occasionally serves a **stale CSS transform** after an
edit — a declaration will be missing from the served stylesheet while present
in the source and in `npm run build`. `touch` the component to invalidate it.
When something looks wrong, check the built output before debugging the CSS.

## Docs

- Astro: https://docs.astro.build
- GSAP: https://gsap.com/docs/v3/
- ScrollTrigger: https://gsap.com/docs/v3/Plugins/ScrollTrigger/
- ScrollSmoother: https://gsap.com/docs/v3/Plugins/ScrollSmoother/
