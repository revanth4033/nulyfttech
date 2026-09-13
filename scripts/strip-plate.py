"""
Strip the flat background plate Figma bakes into a node export.

Figma exports carry the parent section's background rect, so the PNG arrives
fully opaque with the page ground painted behind the art. Anything the page
puts *behind* that image — here the lavender glow in the About The Project
section — is then masked by a hard-edged rectangle the size of the image.

The plate is one exact flat colour, so the background region can be found by
flooding inward from the border across pixels that are no lighter than it
(the artwork and its edges are lighter; only the drop shadows are darker).
Those pixels are re-expressed as black at partial alpha:

    a = 1 - min(p_i / bg_i)

which re-composites over the original ground to within a couple of levels and,
unlike the plate, lets whatever is behind it show through.

Usage:  python3 scripts/strip-plate.py <png> [--bg R,G,B] [--write]
Without --write it only reports the error of the round trip.
"""

import sys
from collections import deque

from PIL import Image


def strip(path: str, bg: tuple[int, int, int], write: bool, exact: bool = False) -> None:
    im = Image.open(path).convert("RGB")
    w, h = im.size
    px = im.load()
    br, bgr, bb = bg

    # Candidate = no lighter than the plate in red/green, AND still carrying
    # the plate's blue cast. The artwork is white-ish so the first test drops
    # it; the second drops neutral greys — a 242/242/242 card border passes
    # "no lighter than the plate" but is art, not shadow. A black shadow over
    # the plate scales all three channels equally, so b/g and b/r are
    # preserved at any depth.
    hue_g = bb / bgr - 0.02
    hue_r = bb / br - 0.02

    def candidate(x: int, y: int) -> bool:
        r, g, b = px[x, y]
        if exact:
            # Strict: only the plate itself, no shadow ramp. Needed whenever the
            # artwork has large areas within a few levels of the plate — a faded
            # phone screen at (243,241,252) passes the tolerant test and the
            # flood then eats the whole picture (seen: 99.8% of one export).
            return abs(r - br) <= 1 and abs(g - bgr) <= 1 and abs(b - bb) <= 1
        if r > br + 1 or g > bgr + 1:
            return False
        return b >= g * hue_g and b >= r * hue_r

    seen = bytearray(w * h)
    q: deque[tuple[int, int]] = deque()

    def push(x: int, y: int) -> None:
        if 0 <= x < w and 0 <= y < h and not seen[y * w + x] and candidate(x, y):
            seen[y * w + x] = 1
            q.append((x, y))

    for x in range(w):
        push(x, 0)
        push(x, h - 1)
    for y in range(h):
        push(0, y)
        push(w - 1, y)

    while q:
        x, y = q.popleft()
        push(x - 1, y)
        push(x + 1, y)
        push(x, y - 1)
        push(x, y + 1)

    out = Image.new("RGBA", (w, h))
    op = out.load()
    worst = 0
    total = 0
    n = 0
    for y in range(h):
        row = y * w
        for x in range(w):
            r, g, b = px[x, y]
            if not seen[row + x]:
                op[x, y] = (r, g, b, 255)
                continue
            a = 1.0 - min(r / br, g / bgr, b / bb)
            a = 0.0 if a < 0 else (1.0 if a > 1 else a)
            ai = int(round(a * 255))
            op[x, y] = (0, 0, 0, ai)
            # round-trip error: black at ai/255 over the plate vs the original
            k = 1 - ai / 255
            err = max(abs(br * k - r), abs(bgr * k - g), abs(bb * k - b))
            worst = max(worst, err)
            total += err
            n += 1

    cleared = sum(seen)
    print(f"{path}: {w}x{h}")
    print(f"  plate pixels re-expressed : {cleared} ({cleared / (w * h):.1%})")
    print(f"  fully transparent         : {sum(1 for y in range(h) for x in range(w) if op[x, y][3] == 0)}")
    print(f"  round-trip error          : max {worst:.2f}, mean {total / max(n, 1):.3f} levels")
    if write:
        out.save(path)
        print("  written")


if __name__ == "__main__":
    args = [a for a in sys.argv[1:]]
    write = "--write" in args
    exact = "--exact" in args
    args = [a for a in args if a not in ("--write", "--exact")]
    bg = (245, 243, 255)
    if "--bg" in args:
        i = args.index("--bg")
        bg = tuple(int(v) for v in args[i + 1].split(","))  # type: ignore[assignment]
        del args[i : i + 2]
    strip(args[0], bg, write, exact)
