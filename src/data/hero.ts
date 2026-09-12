/**
 * Hero animation scenes — transcribed from the Figma keyframes
 * "Hero 1" .. "Hero 4" (node 438:784).
 */

export interface CapabilityCard {
  icon: string;
  title: string;
  items: string[];
  href: string;
}

export interface CardScene {
  id: string;
  /** Two cards, staggered: the first sits higher and further left. */
  cards: [CapabilityCard, CapabilityCard];
}

/** Hero 2 and Hero 3. */
export const cardScenes: CardScene[] = [
  {
    id: "scene-1",
    cards: [
      {
        icon: "icons/card-ai-automation",
        title: "AI & Intelligent Automation",
        items: [
          "AI Agents",
          "Workflow Automation",
          "RAG",
          "Document Intelligence",
          "Enterprise AI",
        ],
        href: "#capabilities",
      },
      {
        icon: "icons/card-product-design",
        title: "Product Design & Engineering",
        items: [
          "UX Strategy",
          "Product Design",
          "Design Systems",
          "Prototyping",
          "MVP Development",
        ],
        href: "#capabilities",
      },
    ],
  },
  {
    id: "scene-2",
    cards: [
      {
        icon: "icons/card-narrative",
        title: "Narrative Intelligence",
        items: ["Data Storytelling", "Investor Narratives", "Presentation Systems"],
        href: "#capabilities",
      },
      {
        icon: "icons/card-talent",
        title: "Talent Intelligence",
        items: [
          "Candidate Screening",
          "Structured Interviews",
          "Hiring Workflows",
          "Recruitment Automation",
        ],
        href: "#capabilities",
      },
    ],
  },
];

/** Hero 4 — the browser-framed summary card that closes the loop. */
export const statScene = {
  url: "https://nulyfttech.com/",
  tab: "nuLyft T",
  figure: "3x",
  title: "Faster Product Delivery",
  body: "From idea to launch with focused design & development.",
  stats: [
    { value: "8+", label: "Products Shaped" },
    { value: "10+", label: "Industries Reached" },
    { value: "25+", label: "Features Launched" },
  ],
};
