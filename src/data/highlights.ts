/** Key Highlights stats — Figma node 435:156. */
export interface Highlight {
  value: string;
  label: string;
  illustration: string;
  /** Natural size of the exported illustration, in px. */
  width: number;
  height: number;
}

export const highlights: Highlight[] = [
  {
    value: "8+",
    label: "Products Shaped",
    illustration: "illustrations/products-shaped",
    width: 77,
    height: 78,
  },
  {
    value: "10+",
    label: "Industries Reached",
    illustration: "illustrations/industries-reached",
    width: 86,
    height: 78,
  },
  {
    value: "25+",
    label: "Features Launched",
    illustration: "illustrations/features-launched",
    width: 73,
    height: 78,
  },
];
