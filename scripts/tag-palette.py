"""
Prepare a Colorography figure exported from Figma for the palette interaction.

The figures are annotated diagrams — an illustration, a leader line per colour
and a label at the end of each. Flattened they are inert, so they ship as
inlined SVG and this adds the hooks `scripts/palette-figure.ts` and the shared
styles need:

  .pal__art      the illustration
  .pal__group    one colour: its leader and its label, plus data-hex
  .pal__leader   the dot and the two line segments
  .pal__label    the name and the hex
  --pal-line     the colour that leader lights in on hover

It also strips Figma's `#1E1E1E` canvas rect and the page/section ground rects
the export drags in — opaque plates that would hide the lavender ground. Rects
inside `<defs>`/`<clipPath>` are left alone: they are the clip shapes, and
emptying one makes the whole graphic invisible.

**Wrappers are found structurally, not by name.** Figma reuses `Frame
2147240601` for both a leader wrapper and the figure's own root, so matching on
the id tags the whole figure as a colour group. A wrapper is instead any element
that directly contains both a leader frame (`…595`) and a label frame (`…596`).

Run before `npm run optimize:svg`. That pass drops unreferenced layer *ids*,
which is why every hook here is a class or data attribute — verified to survive.

Usage:  python3 scripts/tag-palette.py <in.svg> <out.svg>
"""

import re
import sys
import xml.etree.ElementTree as ET

SVG = "http://www.w3.org/2000/svg"
ET.register_namespace("", SVG)

LEADER = re.compile(r"^Frame 2147240595(_\d+)?$")
LABEL = re.compile(r"^Frame 2147240596(_\d+)?$")
HEX = re.compile(r"^#[0-9A-Fa-f]{6}(_\d+)?$")


def luminance(hex_: str) -> float:
    r, g, b = (int(hex_[i : i + 2], 16) for i in (1, 3, 5))
    return (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255


def tag(src: str, dst: str) -> None:
    tree = ET.parse(src)
    root = tree.getroot()
    parents = {c: p for p in root.iter() for c in p}

    # --- strip the canvas and the ground plates -----------------------------
    defs = {e for d in root.iter(f"{{{SVG}}}defs") for e in d.iter()}
    dropped = 0
    for rect in list(root.iter(f"{{{SVG}}}rect")):
        if rect in defs:
            continue
        fill = (rect.get("fill") or "").upper()
        wide = (rect.get("width") or "") == "1440"
        if fill == "#1E1E1E" or (wide and fill == "#F5F3FF"):
            parents[rect].remove(rect)
            dropped += 1

    # --- a wrapper directly contains one leader frame and one label frame ----
    groups = 0
    for el in root.iter():
        kids = list(el)
        lead = next((k for k in kids if LEADER.match(k.get("id") or "")), None)
        lab = next((k for k in kids if LABEL.match(k.get("id") or "")), None)
        if lead is None or lab is None:
            continue
        # Figma dedupes a repeated layer name by appending _2, so the same
        # colour used twice arrives as "#4A4A59" and "#4A4A59_2". Matching on
        # an exact 7-character id silently missed the second one and fell back
        # to grey, leaving that leader unable to light.
        hexes = [
            (p.get("id") or "")[:7]
            for p in lab.iter()
            if HEX.match(p.get("id") or "")
        ]
        hex_ = hexes[0] if hexes else "#979797"
        # A near-white swatch is invisible on the page ground, so it lights in a
        # readable grey; the label still shows its true hex.
        line = "#8A8A93" if luminance(hex_) > 0.85 else hex_
        el.set("class", "pal__group")
        el.set("data-hex", hex_)
        el.set("style", f"--pal-line:{line}")
        el.set("tabindex", "0")
        el.set("role", "group")
        el.set("aria-label", hex_)
        lead.set("class", "pal__leader")
        lab.set("class", "pal__label")
        groups += 1

    # --- the illustration -----------------------------------------------------
    # The largest group that contains no colour group and sits inside none.
    # Taking "the first group that is not a wrapper" instead lands on the
    # export's outermost page group, which wraps the leaders and labels too —
    # the entry would then fade the whole diagram as though it were the art.
    inside = {e for g in root.iter() if g.get("class") == "pal__group" for e in g.iter()}
    art = None
    best = -1
    for g in root.iter(f"{{{SVG}}}g"):
        if g in inside:
            continue
        if any(d.get("class") == "pal__group" for d in g.iter()):
            continue
        size = sum(1 for _ in g.iter())
        if size > best:
            best, art = size, g
    if art is not None:
        art.set("class", "pal__art")

    tree.write(dst, encoding="unicode", xml_declaration=False)
    out = open(dst).read()
    print(
        f"{dst}: groups={groups} rectsDropped={dropped} "
        f"art={out.count('pal__art')} leaders={out.count('pal__leader')} "
        f"labels={out.count('pal__label')} canvas={out.count('#1E1E1E')}"
    )


if __name__ == "__main__":
    tag(sys.argv[1], sys.argv[2])
