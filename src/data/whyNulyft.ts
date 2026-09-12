/** Why nuLyft conveyor items — Figma section 445:785, frames 1-4. */
export interface WhyItem {
  icon: string;
  title: string;
  body: string;
}

/**
 * Order matters: this is the order they ride through the active slot.
 * Item 0 starts in the middle, item 1 to its right, items 2-3 wait below.
 */
export const whyItems: WhyItem[] = [
  {
    icon: "icons/why/ai-native",
    title: "AI-Native Engineering",
    body: "AI is designed into the architecture from day one, not bolted on after launch.",
  },
  {
    icon: "icons/why/product",
    title: "Product Thinking",
    body: "Every engagement is measured against business outcomes, not just technical delivery.",
  },
  {
    icon: "icons/why/engineering",
    title: "Engineering Depth",
    body: "Strong capability across frontend, backend, cloud, data, and AI one accountable team.",
  },
  {
    icon: "icons/why/scale",
    title: "Built to Scale",
    body: "Architecture designed for production load, integration, and growth from the outset.",
  },
];
