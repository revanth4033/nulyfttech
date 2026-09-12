/**
 * Shrink the SVGs exported from Figma, in place.
 *
 * Figma writes 4–5 decimal places of coordinate precision and tags every layer
 * with an `id`. On a 20px icon that precision is ~1/1000th of a device pixel,
 * and the ids are dead weight unless something references them. Icons that get
 * inlined many times (badge-check appears 17x on the home page today, and will
 * appear far more once every section is built) pay that cost per instance.
 *
 * Usage: node scripts/optimize-svg.mjs [dir]   (default: src/assets)
 */
import { readdirSync, readFileSync, writeFileSync, statSync } from "node:fs";
import { join, extname } from "node:path";

const DECIMALS = 2;

function walk(dir) {
  return readdirSync(dir).flatMap((entry) => {
    const p = join(dir, entry);
    return statSync(p).isDirectory() ? walk(p) : extname(p) === ".svg" ? [p] : [];
  });
}

const round = (n) => {
  const v = Number.parseFloat(n);
  if (!Number.isFinite(v)) return n;
  return String(Number(v.toFixed(DECIMALS)));
};

/** Round every number inside a path/transform/points string. */
const roundNumbers = (s) => s.replace(/-?\d*\.?\d+(?:e[-+]?\d+)?/gi, round);

const NUMERIC_ATTRS =
  /\b(d|transform|points|x|y|x1|y1|x2|y2|cx|cy|r|rx|ry|width|height|stroke-width|offset|stdDeviation|gradientTransform|patternTransform)="([^"]*)"/g;

let totalBefore = 0;
let totalAfter = 0;
const rows = [];

for (const file of walk(process.argv[2] ?? "src/assets")) {
  const original = readFileSync(file, "utf8");
  let out = original;

  out = out.replace(NUMERIC_ATTRS, (_m, attr, value) => `${attr}="${roundNumbers(value)}"`);

  // Drop ids nothing points at. Keep any that a url(#…) or href="#…" uses —
  // gradients, clip paths and filters all depend on them.
  const referenced = new Set(
    [...out.matchAll(/url\(#([^)]+)\)|href="#([^"]+)"/g)].map((m) => m[1] ?? m[2]),
  );
  out = out.replace(/\s+id="([^"]+)"/g, (m, id) => (referenced.has(id) ? m : ""));

  out = out.replace(/>\s+</g, "><").trim();

  totalBefore += original.length;
  totalAfter += out.length;
  if (out !== original) {
    writeFileSync(file, out);
    rows.push([file, original.length, out.length]);
  }
}

for (const [file, a, b] of rows.sort((x, y) => y[1] - y[2] - (x[1] - x[2]))) {
  const pct = (((a - b) / a) * 100).toFixed(0);
  console.log(`${file.padEnd(48)} ${String(a).padStart(6)} -> ${String(b).padStart(6)}  -${pct}%`);
}
console.log(
  `\n${rows.length} file(s): ${(totalBefore / 1024).toFixed(1)} KB -> ${(totalAfter / 1024).toFixed(1)} KB ` +
    `(-${(((totalBefore - totalAfter) / totalBefore) * 100).toFixed(0)}%)`,
);
