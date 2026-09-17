# nuLyft website — handoff

You are picking up an in-progress build. This document is the narrative and
the current state. **`AGENTS.md` (symlinked as `CLAUDE.md`) is loaded into
your context automatically** and carries the stack, conventions, and a
per-section index of hard-won technical gotchas — do not duplicate it here,
read it and trust it.

Read this file once at the start of the session, then work from `AGENTS.md`.

**Where things stand right now:** the home page, three inner pages and **all
three case studies** are built and pushed. Every Studio card that has a design
now routes to a real page. The live thread is micro-interactions: three are
built (the Overview stack swap, and the Colorography draw-in + hover on all
three case studies) and the rest of the case-study sections are still static,
awaiting the user's notes section by section. The LMS media-sizing bug is
fixed; what is left of that audit is spacing, not media, and is listed in
section 7. One thing to raise unprompted: the mobile frames the user still
owes (section 6).

---

## 1. What the project is

A static marketing site for **nuLyft Technologies Pvt Ltd**, built
section-by-section from a Figma design, with heavy GSAP animation. Astro 7,
no UI framework, scoped CSS + tokens. The **home page is structurally
complete** — eleven sections, all animated, all verified against Figma — and
three inner pages are built: **Studio** (`/studio`), **Careers**
(`/careers`) and the first **case study**
(`/work/lms-education-saas`).

Working directory: `/Users/revanthb-3905/Downloads/Revanth/nulyft-website`

```
npm run dev      # http://localhost:4321
npm run build    # static output to dist/
npx astro check  # typecheck
npm run optimize:svg   # run after adding any icon
```

---

## 2. How the user works — read this before doing anything

This matters more than any technical detail. The user has a consistent
process and expects it followed:

- **One section at a time.** Never build ahead. They will hand over the next
  section when they are ready.
- **For anything animated: explain first, build second.** The user describes
  the micro-interaction in their own words (Figma carries no motion data),
  then expects you to write back *what you understood* and wait for approval.
  Building before that approval is the one thing they have pushed back on.
- **"Just observe" / "don't do anything" means exactly that.** Inspect,
  produce no code, and do not volunteer your interpretation until asked.
- **Verify against Figma before moving on.** They notice sub-pixel and
  colour differences and will send a screenshot when something is off.
- They are happy for you to make structural/engineering calls (file layout,
  data modules, tokens) without asking. They are not happy for you to invent
  motion or layout that the design does not imply.
- They write quickly and with typos; read for intent, and if two readings
  would produce materially different work, ask.

### Things they have corrected, worth not repeating
- Building an animation before explaining it.
- Claiming something was fixed when only part of it was (the "Workflow
  Orchestration" label — fixed at the wrap and at rest, still visible
  mid-motion). Verify the whole cycle, not the resting frame.
- A scrubber that rewound right-to-left on loop; they wanted the restart to
  carry no backwards motion.

---

## 3. Figma

File key: `ZmUyOEk5OTAT1F6WTRw00a` (named "Dump").
The user supplies a node link per section. Access is via the Figma MCP tools.

**`get_design_context` is authoritative. `get_metadata` has been wrong in
four separate sections** (wrong coordinates, wrong y-values, self-inconsistent
group bounds). When the two disagree, measure the render — take a
`get_screenshot` and detect positions in the image. `AGENTS.md` documents
each instance.

Also: `download_assets` and `get_design_context` can return **different
artwork for the same node** — the client logos came back flat grey from one
and in full colour from the other.

---

## 4. What is built

Page order is in `src/pages/index.astro`. Every animation script is imported
there; every section owns its geometry in `src/data/` and its motion in
`src/scripts/`.

| # | Section | Component | Motion | Script |
|---|---|---|---|---|
| 1 | Hero | `sections/Hero.astro` | scripted loop: pill + cursor click → four card pairs, ~22.3s | `hero.ts` |
| 2 | Key Highlights | `sections/KeyHighlights.astro` | scroll reveal | `reveal.ts` |
| 3 | What We Do (light) | `sections/WhatWeDo.astro` + `wwd/CapabilityRow.astro` | 3D tilt on media | `tilt.ts` |
| 4 | What We Do (dark) | `sections/WhatWeDoDark.astro` | same rows, dark tone | — |
| 5 | Featured Case Studies | `sections/SelectedWork.astro` | tilt + 3-phone focus | `tilt.ts`, `phone-focus.ts` |
| 6 | Why nuLyft | `sections/WhyNulyft.astro` | scroll-driven arc conveyor, snaps between states | `why-orbit.ts` |
| 7 | Our Process | `sections/OurProcess.astro` | pinned horizontal scroll, ball rides an SVG curve | `process-scroll.ts` |
| 8 | Technology | `sections/Technology.astro` + `tech/*` | four cards, see below | four scripts |
| 9 | Industries We Serve | `sections/Industries.astro` | pulse from hub + pill pings + hover connectors | `industries.ts` |
| 10 | Our Clients | `sections/Clients.astro` | grey → colour logo hover (CSS only) | — |
| 11 | CTA + footer | `sections/CtaFooter.astro` | card fan cycles; footer static | `cta-fan.ts` |

### The four Technology cards
| card | motion | lap |
|---|---|---|
| AI & Automation | four orbs ride a ring, right to left, continuous | 18s |
| Engineering | five stages light top-to-bottom, then un-light the same way | 9.3s |
| AI & Data | five technologies step round an ellipse, label strip slides in lockstep | 15s |
| Cloud & Infrastructure | progress scrubber, rows slide in from the left, fade reset | 10.3s |

All four pause when off-screen and are skipped under `prefers-reduced-motion`.

### Navigation
`src/scripts/anchors.ts` routes every same-page `#` link through
ScrollSmoother with a 100px nav offset. Section links are now **root-relative**
(`/#work`, `/#capabilities`, …) so they resolve from any page — the handler
already ignores links whose pathname differs from the current page, so those
navigate natively and the hash is resolved on load. `Studio` points at
`/studio`. **`#careers`, `#contact` and `#blogs` are still deliberately
swallowed** so they do not jump to the top. "About" was removed from the footer
at the user's request, and the Studio page inherits that by reusing the same
`CtaFooter` component.

### The hero's four card pairs (most recent work)
Figma 528:9020, "Hero new frames" — four frames read in canvas order top to
bottom. The user redesigned the cards and handed over the frames; the loop now
runs `click → Experience Simulation / Product Design → Product Engineering /
Scalable Infrastructure → AI & Intelligent Automation / Autonomous Operations →
Knowledge Systems / Narrative Intelligence`, then repeats from the click.

The old three-beat loop's closing dashboard is **gone** — the user asked for
the third pair to take its slot — so `StatCard.astro` and `CapabilityCard.astro`
are deleted (recoverable from git), along with the four `icons/card-*.svg` the
old cards used. The flight-in, drift and flight-out per pair are untouched;
there is simply one more pair, which is why the cycle grew from 16.4s to 22.3s.
The user approved both the order and the longer cycle.

Two card shapes now: `hero/PreviewCard.astro` (title / illustration / caption)
and `hero/PipelineCard.astro` (title over three steps on a rail). The six
illustration panels are flattened 3x PNG exports; the pipeline is real DOM,
because its copy belongs in `data/hero.ts` like every other hero scene.
Verified against the frames — all eight cards land within 0.02px of their node
in position and size. `AGENTS.md` carries the per-card gotchas.

### The Studio page — `/studio`
Figma 493:2801. Three parts:

| part | component | notes |
|---|---|---|
| Hero | `sections/StudioHero.astro` + `studio/StudioPattern.astro` | static, centred; scroll reveal only |
| Projects | `sections/StudioProjects.astro` + `studio/ProjectCard.astro` | four real filter tabs over a project grid |
| CTA + footer | `sections/CtaFooter.astro` | reused from home, unchanged |

Seven case studies live in `src/data/studio.ts`, keyed by tab — Product Design
3, AI & Automation 1, Narrative 3. Each project's meta line opens with its own
tab's name, which is how the categorisation stays honest.

**Talent Intelligence is not a grid.** Figma 501:3477 gives that tab a pitch
instead — a split intro over a live scorecard, a four-step process beside a
photo collage, and its own stat band — plus its own CTA copy. It lives in
`sections/TalentIntelligence.astro` + `data/talent.ts`, and the empty state it
used to show is gone. `AGENTS.md` carries the per-section gotchas.

The hero is **700px tall, not Figma's 816** — trimmed at the user's request so
the filter tabs clear the fold. Only the bottom was available to cut; the note
in `AGENTS.md` explains why.

### The Careers page — `/careers`
Figma 503:3819. A culture bento (two cards, two photos) over "Currently Open
Positions" (six role cards), then the shared `CtaFooter`. Copy and geometry in
`src/data/careers.ts`. Static; `reveal.ts` only.

Both inner heroes now share `components/PageHero.astro` — they differ only in
copy and height. The case study's hero is a split (copy left, card right) so
it has its own component and shares only the pattern.

### The LMS case study — `/work/lms-education-saas`
Figma 505:4185, eight sections over ~9,800px: hero, overview, challenge,
approach (three phases), typography, colorography, UI screens, CTA. Copy and
assets in `src/data/caseLms.ts`; reached from the Studio grid's first card.

The hero **was** a carousel — two slides cross-fading in place at one second
each, with indicator dots — but the user had the second slide removed (it was
an Aster Data recruitment site, a placeholder on a Skill Wagon case study) and
the dots with it. The hero is now one static card; `scripts/case-hero.ts` and
`hero-card-2.png` are deleted, recoverable from git.

**Overview ("About The Project") is the one section with motion.** Its two
screens trade places every two seconds — `scripts/overview-stack.ts`. That
meant rebuilding the stack as real DOM: Figma ships it as one flattened export
with both screens baked in, which cannot move. The screens are now separate
assets and the composition is reproduced from the frame's own coordinates
(verified to 0.01px). Everything below it is still static.

**Every Figma node export here has an opaque plate of the section background
baked into it**, and it is invisible until something sits behind the image —
at which point it masks it in a hard-edged rectangle. That is what the user
saw as "a white bg behind the images". `scripts/strip-plate.py` keys it out;
run it on any new export and read the round-trip error it reports.

**Typography was rebuilt after the user flagged it.** It had been laid out
with flex; Figma places every piece at its own coordinate inside a 1240x543
box. See the warning at the top of "Not done yet" — the same mistake may be
sitting in the other sections.

---

## 5. How to verify work in this repo

The user expects claims to be backed by measurement, not by eyeballing.

- **Numbers beat screenshots.** Chrome backgrounds the tab and freezes rAF, so
  captures are routinely taken mid-animation or mid-image-decode. Several
  "bugs" in this build were capture artefacts. Measure
  `getBoundingClientRect` against the Figma coordinates.
- **Seek GSAP timelines with `.progress()`, never `.pause(t)`** — `pause(t)`
  seeks without firing `onUpdate`, so callback-driven properties silently
  report the resting frame. This wasted real time twice.
- **The screenshot tool shifts saturated colour** by roughly (−10, +9, −9) on
  purples while reproducing white exactly. Put a known swatch on the page and
  read it back before concluding a colour is wrong.
- Settle reveal animations by completing the real tween
  (`gsap.getTweensOf(targets).forEach(t => t.progress(1))`), not by
  force-setting visibility — force-setting once masked a genuine bug.
- **A section that screenshots blank is almost always still painting.** This
  happened perhaps five times in one session — every time, the elements
  measured correct size, position and `opacity: 1`. Before believing a
  screenshot, measure. Force-decode with
  `await Promise.all([...imgs].map(i => i.decode()))` and wait ~1s.
- The dev server serves **stale CSS often enough to plan for it** — it bit
  three times in one session, once returning a whole set of old measurements
  that nearly got acted on. `touch` the component first; if the rule is in the
  file and in `dist/` but not in the page, restart clean:
  `npx astro dev stop && rm -rf node_modules/.vite && npm run dev`. An iframe
  also holds its own cached copy — reload it with a cache-busting query, not
  `location.reload()`.
- **`download_assets` can return the same image for different nodes.** Three
  sibling image rects each gave a byte-identical `rawImages[0]`. Use the
  per-node `export` for anything in a shared frame, and `md5` the results —
  identical file sizes are the tell.
- **To check a 1440px viewport**, the OS will not shrink the window below the
  screen width, so load the page in a **1440px iframe**. Put the harness in
  `public/` (a plain HTML file with no HMR client) rather than rewriting the
  page's own DOM — otherwise Vite's HMR reloads the harness out from under you.
  Delete it when you are done.

---

## 6. Parked — mobile responsiveness

The user asked for a responsiveness audit of the home page. **The audit is
done; no responsive work has been started.** It is now **parked at the user's
request** — designing four mobile frames in Figma was taking them too long, so
they moved on to the Studio page and will hand over those frames later:

> "After some time, I will design all those four sections manually in Figma so
> that I can give you all of those four sections, and you can replicate them in
> the mobile version."

So the open question below is **answered**: they design the hard four. Resume
when the frames arrive.

Audit method: the site was loaded inside a **390px iframe** (the OS will not
let the browser window shrink that far, and an iframe gets its own viewport
so media queries fire correctly). Effective viewport 371px.

### Already correct, needs nothing
Nav (hamburger + drawer already built), Key Highlights, What We Do (dark),
Our Clients. The global gutter already steps 100 → 32 (≤900) → 20 (≤560), and
**no section causes horizontal page scroll** — they all clip rather than push.

### Can be fixed in code, no new design needed
| section | problem |
|---|---|
| Hero | layout stacks correctly, but the headline is **sliced horizontally** — SplitText line masks are 39px with `overflow: clip` and never re-measure. `splitWhenReady()` in `gsap.ts` splits once, with no resize re-split |
| What We Do (light), Selected Work | media panels / phone mockups overflow ~917px; copy already reflows |
| Technology cards 2–4 | `.tech__row` is `repeat(3, 1fr)` with **no breakpoint at all** → three **100px-wide** cards, each ~494px tall, holding content built for 403px |
| CTA | card still 1240px and centred, so it sits at x=−434: copy block entirely off-screen left, card fan entirely off-screen right |
| Footer | link columns at x=291, width 598 — overflow 517px; only the brand column visible |

### Needs a mobile design decision — scaling makes text illegible
| section | why |
|---|---|
| **Our Process** | 2482px track in a pinned scroll; **13% visible** at 371px. Scaling to fit puts station labels at ~4px. Wants a different structure (vertical stepper) |
| **Industries We Serve** | constellation spans ~642px (pills from −145 to 497); 0.52× makes 16px labels 8px |
| **Technology → AI & Automation** | 553px orbit radius in a 1240px card; 0.27× makes labels ~6px |
| **Why nuLyft** | arc conveyor built on a 1240-wide ellipse; 20 clipped elements |

### Settled: the user is designing the hard four
They will supply mobile Figma frames for the four sections above. Do not
improvise those layouts. The code-only fixes in the previous table can be done
at any time and need no new design.

**The Studio page's own mobile behaviour is equally unfinished** — the grid
collapses to one column at 900px and the gutter steps down with the global
token, but nothing beyond that has been designed or verified.

---

## 7. Not done yet

- **Audit the LMS case study's sections against their frame coordinates.**
  Typography was built with flex and had to be rebuilt once the user saw it —
  Figma places its children absolutely inside a fixed box. Its Overview,
  Challenge, Approach and UI Screens were built the same flex/grid way and have
  never been checked. The Automotive and Recruitment pages were built against
  measured coordinates and match to the pixel.

  **The media-sizing half of this is now done** (see below): UI Screens lands
  at 3632, exactly its frame, and Approach came from +48 to -11.8. Three
  layout findings turned up while measuring and are *not* fixed, because they
  move copy rather than media and the rule here is not to change layout the
  user has not asked about:

  | where | frame | ours |
  | --- | --- | --- |
  | Approach: gap between a phase title and its items | 16 | 28 |
  | Approach: each item box in the phase-01 row | 121 (24 above the label, 24 below the rule) | 98, no space above the label |
  | Approach: copy column beside the media | 541 wide, gap ~130, top-aligned | 613, gap 58, vertically centred |
  | UI Screens: copy beside a captioned shot | bottom-aligned in the 394 row | centred, ~137px high |

  The first two together are the whole -11.8 on Approach: phase 01 renders
  157.2 against the frame's 169. None of the others change a height, so the
  section totals stay right either way. Challenge was -23 and is unmeasured
  since.
- Everything above under mobile responsiveness, including the Studio page.
- **Micro-interactions.** Built so far: the Overview stack swap (LMS and
  Recruitment) and the Colorography draw-in + hover (all three). Every other
  case-study section is static; the user describes each one's motion, and the
  rule is *explain first, build second*.
- ~~**The LMS page still sizes its media by the export, not the node.**~~
  **Done.** Every LMS figure now reserves its Figma node's box and lets the
  export overflow; UI Screens measures 3632 against a 3632 frame and both split
  phases measure 406.55 against 406.556. Measuring it turned up something the
  other two pages get wrong as well: **these shadows are not centred on their
  node** — `0 32px` with ~61px of spread, so an export hangs ~29 above its card
  and ~93 below, and centring it drops the card ~32px. The LMS page uses
  measured offsets; Recruitment and Automotive still centre. It costs them no
  height, which is why they measure correct, but their cards sit low. Porting
  the measured offsets over is the obvious next contained fix. `AGENTS.md`
  carries the method.
- **The three new case studies add ~16MB of PNG source** to a repo that was
  already 62MB of images. They are real sources — Astro makes the WebP from
  them — but they are photographic *with alpha*, so they cannot become JPEG.
  Re-sourcing them as lossless WebP would roughly halve it; worth doing before
  the repo grows further, since history is permanent.
**All three case studies now share the Colorography interaction** — the figure
draws itself in on scroll and answers hover/focus by dimming the other colours
and lighting one leader in its own hex. `case/PaletteFigure.astro` +
`scripts/palette-figure.ts` + `scripts/tag-palette.py`. Four colours on LMS and
Recruitment, six on Automotive; the script derives everything from geometry.

### The AI Powered Recruitment Platform case study — `/work/ai-recruitment-platform`
Figma 514:6633, ~9,650px. **Built on the LMS template** — the two frames are
section-for-section identical and seven of eight sections match to the pixel,
so the components are the LMS ones duplicated and re-pointed at
`src/data/caseRec.ts`. Static apart from the Overview stack, which reuses the
swap animation.

**The media-sizing bug this page fixed is now fixed on the LMS page too** —
and the traffic runs back the other way now. This page *centres* each export on
its node box, and these shadows are not centred: they hang ~29px above the card
and ~93 below, so every card here sits ~32px low. It costs no height, so the
section measurements still hold. The LMS page carries the measured offsets and
`AGENTS.md` has the method; port them here.

### The Automotive Marketplace case study — `/work/automotive-marketplace`
Figma 510:5689, eight sections over ~10,100px: hero, overview, challenge,
approach (three phases), typography, colorography, UI screens, CTA. Copy and
geometry in `src/data/caseAuto.ts`; reached from the Studio grid's Automotive
Marketplace card. Static throughout — no micro-interactions yet.

**The frame is named "AI Powered Recruitment Platform" and the name is wrong** —
its content is entirely the bike marketplace. The user confirmed it belongs to
the Automotive Marketplace card. `AI Powered Recruitment Platform` still has no
destination.

Every section height matches the frame exactly (1130 / 698 / 677 / 1639 / 795 /
758 / 3546) and no width from 1440 down to 390 scrolls horizontally.

- **Case study pages.** The card button renders on the remaining five Studio cards
  ("View Pitch Deck" on Narrative's decks, "Full Case Study" elsewhere) but has
  no destination — `href` is omitted in `src/data/studio.ts` and the
  button renders `disabled`. The user has the designs and will hand them over.
  Wiring is one `href` per entry.
- Nav links with no destination: Contact Us, Blogs.
- **The Careers role listing ships empty**, at the user's request — the six
  Figma cards were one placeholder repeated. It shows a "No Openings Right Now"
  empty state instead. Adding entries to `jobs` in `data/careers.ts` brings the
  grid back with no code change; `href` per entry makes each card clickable.
- **The Careers CTA.** The frame carries the Talent Intelligence copy ("Send us
  your next open role"), which addresses employers on a candidate-facing page —
  a stray paste. The page ships the site's default CTA; asked, not answered.
- **The Careers job grid sits 40px short of the right edge** (two 551 cards +
  98 gutter = 1200 in a 1240 column). Reproduced as drawn; asked whether it
  should fill instead.
- The Talent Intelligence empty-state copy is **ours, not Figma's** — the
  design has no empty state. Worth confirming with the user.
- The tab **panel swap is instantaneous** by design: Figma shows no transition
  for it and inventing one was not ours to do. Only the underline slides
  (0.4s). Offer it if the swap reads as abrupt.
- Safari has not been checked — in particular the 3D-transformed rounded
  cards in What We Do / Selected Work, and the Studio plate's nested
  `backdrop-filter`.

---

## 8. Git and deployment

Pushed to **github.com/revanth4033/nulyfttech** (private), `main`, tracking
`origin/main`. One commit on top of the original Astro scaffold.

`references/` is **gitignored on purpose** — it holds a 34MB screen recording,
and git history is permanent. The file is still on the user's disk. `.vercel/`
is ignored too.

The repo is 62MB, almost all `src/assets/images`. Those are needed: Astro
generates the WebP variants from them at build time.

**Vercel is not set up yet** — no project linked, nothing deployed. Two things
will matter when it is:
- **Node 22.** `package.json` pins `>=22.12.0`; Vercel's default may be older
  and the build will fail the engine check.
- **First build is slow** — WebP at two densities for ~40 source images.
  Astro's image cache is not committed, so every cold CI build redoes it.
  Cache `node_modules/.astro` between builds if it becomes annoying.

---

## 9. One standing content note

Every section heading uses `text-transform: capitalize`, which Figma also
does. It renders the brand as **"NuLyft"** rather than "nuLyft" in the Clients
and CTA headings. This was flagged to the user twice and left as-is to match
the design — do not silently change it, but it is a one-word fix if they ask.
