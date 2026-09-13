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
    work/lms-education-saas.astro
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
`pill + cursor click` -> `card scene 1` -> `card scene 2` -> `summary card`,
then the whole thing repeats from the click. ~16.4s per cycle.

Every beat lives inside one `repeat: -1` timeline, so each cycle is identical.
If you add a beat, make sure it hands the stage back in a neutral state — the
summary card fades the glow back to the card-scene position and opacity 0 for
exactly this reason, otherwise the glow snaps at the loop seam.

Scene copy lives in `src/data/hero.ts`, not in markup — add a scene there and
`HeroStage.astro` renders it and the timeline picks it up.

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


## Studio page

`src/pages/studio.astro` — Figma 493:2801. Three parts: a static centred hero,
the filtered project grid, and the home page's `CtaFooter` reused unchanged.
Data in `src/data/studio.ts`, tab behaviour in `src/scripts/studio-tabs.ts`.
Nothing here animates beyond `reveal.ts`.

**The hero height is the one deliberate departure from Figma.** The frame is
816 tall; `--studio-hero-h` ships 700. At 816 there are 252px of bare grid
under the copy and the filter tabs land at y=916 — below the fold on a laptop,
which the user flagged. Only the bottom is available to cut: the copy is pinned
by the mask behind it, and the mask is pinned to the grid, because the hatched
square at (91, 163) fills exactly one 126px cell and the mask's top edge at 289
sits on that square's bottom. Raise the copy and the mask rides up over the
square; raise the square and it falls off the rules. 700 leaves 95px under the
mask's lowest edge (605), so ~660 is the practical floor before it crowds.

**The Figma frame is a "show everything" mock, not the first tab's state.** It
draws every card under *Product Design & Engineering*, but the tabs are
real filters. Each tab's grid is therefore *derived* from the data, not copied
off the frame: cards flow in data order, a `full` card takes a row of its own,
and a leftover `half` sits alone on the left — the pattern the frame's own last
row already uses. The phone card is placed mid-list in Product Design so the
odd card lands last instead of leaving a hole in the middle of the grid.

**Each project's meta line opens with its own tab's name**, which is how the
two stay legible together — "Product Design & Engineering · SaaS Platform ·
2025", "Narrative Intelligence · Branding · 2026". The one exception is the
automation tab, whose supplied copy reads "AI Intelligent & Automation" against
the tab's "AI & Intelligent Automation"; that is the client's wording and is
left as given. Talent Intelligence has no projects yet and renders an empty
state — that copy is ours, not Figma's.

**The card button names what it opens.** `ProjectCard` derives the label from
the media — a deck reads "View Pitch Deck", anything else "Full Case Study" —
with a per-project `ctaLabel` to override. Narrative's three cards are the only
decks today, so the rule and the tab happen to coincide; the derivation is on
the media so a deck filed under another tab still reads correctly.

**The meta line must not wrap.** Figma marks the node `nowrap` and it needs to
be: the longest line, "PRODUCT DESIGN & ENGINEERING · HR RECRUITMENT · 2025",
measures 582.5px against the 580px the caption leaves it, so without `nowrap`
it drops "2025" onto a second row and knocks that one card 19px taller than its
neighbour. A negative right margin reclaims the trailing letter-space CSS adds
after the final glyph, and the caption's 16px padding absorbs the remainder.

**Each card is its own `data-section`.** One trigger for the whole 3,400px grid
would fire every card at once with most of them still far below the fold.
`reveal.ts` picks up per-card triggers for free.

**`text-wrap: normal` is not a value the `text-wrap` shorthand accepts** —
it is `wrap | nowrap | balance | stable | pretty`, so `normal` is parsed out
and silently dropped. `global.css` sets `text-wrap: balance` on every heading,
which moved the Studio headline's break a word early; the reset is
`text-wrap: wrap`. Symptom: the declaration is present in the served CSS, at
winning specificity, and the computed value is still `balance`.

**A descendant `span` selector also catches `<Icon>`.** `Icon.astro` renders
`<span class="icon">`, so `.deck__title span { flex: 1 }` applied to the icon
as well and the toolbar split itself evenly down the middle — a 16px icon came
out 64px wide. Target a class, never a bare `span`, inside anything holding an
`<Icon>`.

**The card plate is three nested frosted shells**, not one: 32px radius over
24px over 16px, each with a 1px white border and its own padding, the outer two
with `backdrop-filter: blur(10px)`. The screenshot is `object-fit: cover`
anchored `center top`, except the e-learning shot which Figma anchors right so
its empty left rail falls away — that override lives per-project in
`studio.ts`.

**The phone exports overflow their Figma slot.** The frames read 250x542 in
metadata, but the artwork's true render bounds are 261.33x553.33 — 5.67px of
bleed on every side. Export at scale 1 to confirm (262x554) before trusting a
scaled export's arithmetic. The export also bakes `#f5f3ff` into the rounded
corners, which is exactly the ground it sits on, so it composites cleanly.


## Studio — Talent Intelligence

The one tab that is not a project grid. Figma 501:3477 gives it a pitch
instead: a split intro over a live scorecard, a four-step process beside a
photo collage, and its own stat band. Copy and geometry in
`src/data/talent.ts`; markup in `sections/TalentIntelligence.astro` and
`talent/Scorecard.astro`. Nothing here animates beyond `reveal.ts`.

**A panel is either a grid or a bespoke section.** `StudioProjects.astro`
branches on the tab id, and the panels had to move *outside* the tab bar's
`.container` to do it — the Talent sections are full-bleed siblings in the
frame, each with its own gutter, so nesting them inside one gave double
gutters. The section's bottom padding moved onto the panel for the same
reason: a grid needs one, the Talent panel ends on a stat band that has one.

**The step rail is a grid, not the frame's offsets.** Figma spaces the
numbered discs 135.25px apart while the copy steps sit 137px apart, so by step
four its own artwork is 5px out of true. Putting the disc and its copy in one
grid row locks them together and makes the connector a line between rows. For
the same reason there is no optical nudge on the label — a 2px pad costs 8px
over four steps, which drifts the collage beside it off centre.

**The scorecard's meters are not `score / 10`.** Figma draws each fill as an
overlong bar clipped by its track, landing at 94.7 / 98 / 88.1 percent for
scores of 8.5 / 9.0 / 8.0. The measured values are stored so the card matches
the frame; `talent.ts` says so, because the numbers look like a bug otherwise.

**The scorecard overhang has to be claimed.** It is absolutely positioned and
hangs ~40px below the photo, so it adds no height; Figma reserves the space by
making the row 550 against a 500 photo. Without a matching 50px on the media
box the next section rides up into the card.

**The collage drifts; Figma draws it static.** The frame fades 240 of the
collage's 630px away top and bottom, which is a "content continues" cue, and
the user confirmed the columns should scroll behind those veils.
`scripts/talent-collage.ts` runs them at 30px/s in opposite directions — left
up, right down. The drift is deliberately non-interactive and ignores the
cursor: a hover pause was built and the user asked for it out. It still stops
while off screen, and is skipped entirely under reduced motion.

**The lap must equal the rendered distance, not the sum of the heights.**
`COLLAGE_LOOP` is 1292: the four cell heights (1228) *plus all four gaps*. The
fourth gap is the one that closes the first set onto its duplicate, and
leaving it out puts the reset 64px early — which reads as a stutter, not a
seam, so it is easy to miss. Verify by measuring cell 1's top against cell 5's
and checking it equals `COLLAGE_LOOP`.

**Each column carries the whole photo set, not Figma's two.** Four photos in a
different order per column means the two never show the same shot side by side
and a photo only returns after a full lap. More photos in `talent.ts` lengthen
the cycle with no change to the script — but `COLLAGE_LOOP` is hardcoded from
the heights, so update it too.

**Refresh ScrollTrigger on every tab switch.** Panels differ enormously in
height — the Talent pitch is several times a card grid — so every trigger below
the panel is measured against the wrong page height until it re-measures.
`studio-tabs.ts` does this; the collage's own off-screen trigger depends on it,
because on load the panel is `display: none` and measures nothing.

**The Talent tab carries its own CTA copy** (501:3810). The CTA sits outside
the tab panel, so `CtaFooter` takes `title`/`body` props and `studio-tabs.ts`
swaps the text on selection, capturing the default on load to restore it.

**`eyebrow` on `SectionHeader`/`KeyHighlights` is `string | null`, deliberately.**
The Talent stat band has no badge, and `undefined` would fall through to
Astro's default parameter and silently reinstate the home page's eyebrow —
which is exactly what happened first time. Pass `null` to mean "no badge".

**Both Key Highlights bands share one component.** It defaults to the home
copy, so `index.astro` passes nothing; the Talent band overrides the copy,
stats, `gap` (64 against 80) and `size` (`md`, a 32px heading against 40px).

**These illustration exports carried two background plates**, not one: Figma's
`#1E1E1E` canvas rect *and* the section's own `#F5F3FF` ground, the latter
clipped to the icon box so it painted a solid light square behind each glyph.
Strip both, then confirm with `getBBox()` that the ink survived and that no
`clipPath` or `mask` was emptied.


## Deck-viewer chrome

`src/components/studio/DeckChrome.astro` is the counterpart to `BrowserChrome`
for deck screenshots — Figma 493:3116. Figma sets it in Open Sans 9px; it ships
in the site's Inter rather than pulling a third webfont in for ~40 glyphs of
decorative UI. The only visible consequence is that a long filename ellipsises
a little earlier than the frame shows; Figma already truncates the longest one.


## Page heroes

`components/PageHero.astro` + `PageHeroPattern.astro` serve every inner page.
The heroes differ only in copy and height — same grid, same two hatched
squares, same mask — so they are one component with props rather than a copy
per page.

**Only the height varies, and only downwards.** The copy is pinned by the mask
behind it and the mask is pinned to the grid: the hatched square at (91, 163)
fills exactly one 126px cell, and the mask's top edge at 289 lands on that
square's bottom. Raising the copy drags the mask over the square; raising the
square puts it off the rules. So the empty band under the copy is the only
slack, and a hero can only be cut from the bottom.

| page | height | note |
| --- | --- | --- |
| Studio | 700 | Figma draws 816; trimmed so the filter tabs clear the fold |
| Careers | 605 | as drawn — cut exactly at the mask's lowest edge |

**Figma's font name for the Careers headline is wrong.** `get_design_context`
reports `Inter:Semi_Bold` where the render is plainly IBM Plex Sans, same as
every other heading. Check the screenshot before believing a font switch.
Careers also sets its italic tail in the body ink at weight 500, where Studio
sets its tail in the accent purple — hence `emphasisTone`.


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

**Product screenshots ship as flattened exports, not rebuilt DOM.** They are
fixed compositions — tilted stacks, browser frames with baked shadows, a phone
overlaid on a desktop — carrying no interaction and none of our text, so
re-deriving them in markup adds weight and nothing else. Text that *is* ours
(captions, phase lists, callouts) stays in the DOM.

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

**The hero's two cards are carousel slides, not one card behind another.**
They overlap in the frame because that is how a carousel gets parked in a
static mock, and the two screenshots are of different products — the second is
an Aster Data recruitment site, almost certainly a placeholder. Read what the
second image *is* before dismissing it as a duplicate edge; that mistake cost
a round trip here.

**Size stacked slides by their card, not their export.** The two hero exports
carry different shadow bleed — 6.5px against 62px — so matching their export
widths would leave the cards visibly different sizes and the cross-fade would
jump. `slides[].w` in `caseLms.ts` is the width that puts each export's *card*
at the same size; both are then centred on one box, which lands them exactly
on top of each other (verified: both centres at the same point to 0.1px).

**The carousel runs at one second per slide.** That is fast for a hero and the
user was told so; they confirmed it. `HOLD` and `FADE` in
`scripts/case-hero.ts` are the two knobs.

**Two figures are SVG exports on purpose.** The type specimen would otherwise
need five weights of Open Sans, a face this site does not load, for one
decorative block; the palette figure is a drawing with four leader lines whose
geometry only works at its drawn size. Both carry the meaning in `alt`.

**Absolute children of `.container` resolve against its padding box.** The
typography callouts are placed at Figma's offsets *plus* `var(--gutter)`,
because `.container` carries the gutter as padding rather than as a margin.
Without it every callout sits 100px left of where the frame puts it.


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

**Restart the dev server after any `npm install` / `uninstall`.** Mutating
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
