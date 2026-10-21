/**
 * Fits a fixed-size composition to its column.
 *
 * Some media on the capability pages are built at Figma's pixel size and
 * have no fluid form — a tilted browser card with its chrome, a fan of
 * three browsers, a phone row. Below their drawn width they are scaled as
 * one picture, which is right for an image (text is never fitted this way).
 *
 *   <div class="fit" data-fit="577.577">   ← takes the column's width
 *     <div class="fit__inner">…</div>      ← laid out at 577.577px
 *   </div>
 *
 * The script writes `--fit` = column width / drawn width, capped at 1, onto
 * the wrapper; CSS scales the inner box by it and sizes the wrapper with
 * `aspect-ratio`. Without JS `--fit` stays 1 and the column clips.
 */
const els = [...document.querySelectorAll<HTMLElement>("[data-fit]")];

if (els.length) {
  // Exact width, not clientWidth: that rounds to whole pixels, so a 568.419
  // box measured 568 and scaled by 0.9993 — invisible, but it re-rasterised
  // a desktop picture that should be untouched. Anything within 0.2% of
  // the drawn size is the drawn size.
  const update = (el: HTMLElement) => {
    const natural = Number(el.dataset.fit);
    let fit = Math.min(1, el.getBoundingClientRect().width / natural);
    if (fit > 0.998) fit = 1;
    el.style.setProperty("--fit", fit.toFixed(4));
  };

  const ro = new ResizeObserver((entries) => entries.forEach((e) => update(e.target as HTMLElement)));
  els.forEach((el) => {
    update(el);
    ro.observe(el);
  });
}
