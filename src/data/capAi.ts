/**
 * AI & Automation capability page — Figma 647:6302, 1440 x 6671:
 * Hero (707), What we do (1386), dark project rows (803 + 607 + 607),
 * Where can we help (812), How we engineer it (895), CTA + footer.
 *
 * The AI Agents and Intelligent Workflow cards animate through the state
 * boards 647:7514 and 647:7155; their geometry lives here so the static
 * render and the script agree.
 */
import type { Shot } from "./capProductDesign";
import requirements from "../assets/images/cap-design/aster-feature-5.jpg";

/* --- hero ------------------------------------------------------------------ */

export const hero = {
  height: 707,
  eyebrow: "NULYFT STUDIO · AI & automation",
  title: "Make AI part of how your",
  emphasis: "business works",
  body: "We engineer AI agents, intelligent workflows, and connected automation that take work beyond experimentation into systems your teams can actually use.",
  primary: { label: "Build Your AI Workflow", href: "#contact" },
  secondary: { label: "Explore Our Work", href: "#ai-work" },
  /** Logo discs on the 460px target, top-left positions and disc size. */
  logos: [
    { icon: "icons/ai/logo-n8n", x: 77.05, y: 26.45, d: 73.6, w: 36.8, h: 36.8 },
    { icon: "icons/ai/logo-gemini", x: 342.7, y: 39.1, d: 55.2, w: 27.6, h: 27.6 },
    { icon: "icons/ai/logo-make", x: 238.05, y: 100.05, d: 46, w: 23, h: 23 },
    { icon: "icons/ai/logo-openai", x: 100.05, y: 167.9, d: 46, w: 23, h: 23 },
    { icon: "icons/ai/logo-pinecone", x: 334.65, y: 173.65, d: 64.4, w: 32.46, h: 36.51 },
    { icon: "icons/ai/logo-langchain", x: 6.9, y: 257.6, d: 55.2, w: 27.6, h: 27.6 },
    { icon: "icons/ai/logo-eleven", x: 204.7, y: 301.3, d: 46, w: 13.8, h: 23 },
    { icon: "icons/ai/logo-llama", x: 354.2, y: 319.7, d: 73.6, w: 36.8, h: 36.8 },
    { icon: "icons/ai/logo-postgres", x: 106.95, y: 361.1, d: 64.4, w: 32.2, h: 32.2 },
  ],
};

/* --- what we do (bento) ---------------------------------------------------- */

export const services = {
  eyebrow: "WHAT WE DO",
  title: "AI that moves work forward",
  body: "From answering questions to executing workflows, we build AI systems around the work your business already does.",
  agents: {
    kicker: "AI AGENTS",
    title: "Give AI a role, not just a prompt",
    body: "Agents that understand context, make decisions, use tools, and take action across everyday business workflows.",
    role: "Sales Ops Assistant",
    goal: "Qualify new leads and book demos",
    // Each task is done by the tool of the same index lighting up.
    tasks: ["Read 3 new leads in CRM", "Sent tailored replies", "Book demo - Thu, 3 PM", "Pipeline sheet uploaded"],
    tools: [
      { icon: "icons/ai/tool-people", label: "CRM" },
      { icon: "icons/ai/tool-email", label: "E-Mail" },
      { icon: "icons/ai/tool-calendar", label: "Calendar" },
      { icon: "icons/ai/tool-sheets", label: "Sheets" },
    ],
    /** The page frame shows state 4 of 5: Sheets in progress. */
    restState: 4,
  },
  workflow: {
    kicker: "INTELLIGENT WORKFLOW AUTOMATION",
    title: "Connect the steps. Remove the repetition",
    body: "We orchestrate apps, data, APIs, and AI to turn manual processes into connected workflows that keep moving.",
    perInvoice: "30 min per invoice",
    steps: [
      { icon: "icons/ai/wf-email", title: "New invoice email", time: "You - 6 min", kind: "Trigger" },
      { icon: "icons/ai/wf-agent", title: "Extract the fields", time: "You - 8 min", kind: "AI" },
      { icon: "icons/ai/wf-check", title: "Match to purchase ", time: "You - 12 min", kind: "Rules" },
      { icon: "icons/ai/wf-update", title: "Update Accounts", time: "You - 4 min", kind: "Trigger" },
    ],
    /**
     * Card centres in the 460 x 300 panel. Manual: scattered and tilted
     * (647:6476). Automated: one column, 50.75 apart (647:7461).
     */
    manual: [
      { x: 195.5, y: 101.25, r: 0 },
      { x: 246.49, y: 140.55, r: 2 },
      { x: 197.81, y: 201.4, r: 1 },
      { x: 232.54, y: 238.0, r: -3 },
    ],
    automated: [0, 1, 2, 3].map((i) => ({ x: 225.5, y: 101.25 + i * 50.75, r: 0 })),
  },
  doc: {
    kicker: "DOCUMENT & DATA INTELLIGENCE",
    title: "Turn business information to usable intelligence",
    body: "Extract, classify, & reason across documents & structured data to make information easier to access & act on.",
    caption: "Document → Usable Data",
    /** Each field is read from the document line its number marks. */
    fields: [
      { label: "Vendor", value: "Northwind Supplies" },
      { label: "Due Date", value: "30 Nov 2026" },
      { label: "Total", value: "₹ 1,85,999" },
    ],
  },
  voice: {
    kicker: "VOICE & CONVERSATIONAL AI",
    title: "Make every conversation part of the workflow",
    body: "AI voice and chat systems that handle enquiries, follow-ups, qualification, and customer interactions with the right context.",
    channels: [
      { icon: "icons/ai/voice-call", label: "Voice Call" },
      { icon: "icons/ai/voice-chat", label: "Chat" },
    ],
    role: "AI VOice & chat",
    /** Rendered word by word so each can light as the agent does it. */
    actions: ["Understands", "replies", "records"],
    outcomes: ["Lead Qualified", "Demo booked", "CRM Updated"],
    /** Figma's 53 waveform bars (647:6622), heights in px. */
    bars: [
      2, 3, 3.5, 3.99, 4, 4.5, 8, 8, 6, 5, 4.78, 12, 12, 8, 3, 0.7, 3, 10, 6, 8, 8.32, 13, 13.6, 9, 6, 5, 3,
      3.7, 9, 10, 12, 13, 14, 13.6, 14.8, 9, 9, 9, 8, 7, 6, 7, 5, 3, 2, 0.67, 7, 8, 14.8, 9, 5, 2, 0.67,
    ],
  },
};

/* --- what we've been building (dark) --------------------------------------- */

const screen: Shot = { src: requirements, alt: "Requirements board", crop: { w: 100, h: 154.27, left: 0.09, top: 0.08 } };

export const projects = {
  eyebrow: "What We've Been Building",
  title: "From AI experiments to working systems",
  body: "A look at practical AI we've engineered around real business problems",
  rows: [
    {
      name: "AI Data Copilot",
      kicker: "Ask the data. Get the answer",
      body: "A RAG-powered copilot that lets recruitment teams query hiring data conversationally from open positions and candidate movement to pipeline delays.",
      tags: ["RAG", "Knowledge AI"],
      shot: screen,
      reverse: false,
    },
    {
      name: "AI Voice Follow-up Agent",
      kicker: "Turn follow-ups into conversations",
      body: "A voice AI agent engineered to handle EMI payment follow-ups, engage customers conversationally, and support structured calling workflows.",
      tags: ["Voice AI", "Calling Workflows"],
      shot: screen,
      reverse: true,
    },
    {
      name: "Intelligent Lead Workflow",
      kicker: "From enquiry to qualified lead",
      body: "A concept for an AI workflow that qualifies real-estate enquiries, captures missing information, updates CRM records, and triggers the next action automatically.",
      tags: ["AI", "Workflow Automation"],
      shot: screen,
      reverse: false,
    },
  ],
};

/* --- where can we help ------------------------------------------------------ */

export const industries = {
  eyebrow: "WHERE CAN WE HELP",
  title: "Start with the workflow. We'll find the AI opportunity",
  body: "AI becomes valuable when it solves a real operational problem. We identify the repetitive, information-heavy, and decision-driven work where intelligent systems can create measurable change.",
  cards: [
    { icon: "icons/ai/ind-finance", size: 20, title: "Finance & Accounting", items: ["Invoice processing", "Reconciliation", "Payment follow-ups", "Expense auditing"] },
    { icon: "icons/ai/ind-supply", size: 20, title: "Supply Chain & Logistics", items: ["Inventory monitoring", "Supplier coordination", "Order tracking", "Delay detection"] },
    { icon: "icons/ai/ind-health", size: 20, title: "Healthcare", items: ["Appointment handling", "Patient enquiries", "Document processing", "Claims workflows"] },
    { icon: "icons/ai/ind-hr", size: 24, title: "HR & Recruitment", items: ["Resume intelligence", "AI interviews", "Interview scheduling", "Candidate workflows"] },
    { icon: "icons/ai/ind-sales", size: 20, title: "Sales & Marketing", items: ["Lead qualification", "AI calling", "CRM Updates", "Sales follow-ups"] },
    { icon: "icons/ai/ind-manuf", size: 20, title: "Manufacturing", items: ["Quality monitoring", "Maintenance alerts", "Production reporting", "Operations support"] },
    { icon: "icons/ai/ind-enterprise", size: 20, title: "Enterprise & IT", items: ["IT support agents", "Incident triage", "Access workflows", "Operational automation"] },
  ],
  /** Figma centres HR & Recruitment (index 3) and lifts it. */
  active: 3,
};

/* --- how we engineer it ---------------------------------------------------- */

export const engineer = {
  eyebrow: "How We Engineer It",
  title: "From business problem to working intelligence",
  body: "We don't start with a model. We start with the work that needs to change.",
  // Zig-zag: x, y inside the 1240 x 455 stage.
  steps: [
    { icon: "icons/ai/eng-find", title: "Understand", body: "We map the workflow, identify repetitive decisions, understand the data involved, and define the opportunity worth solving.", x: 0, y: 0 },
    { icon: "icons/ai/eng-model", title: "Architect", body: "We determine where AI, automation, APIs, knowledge systems, and human decisions should work together.", x: 316, y: 228 },
    { icon: "icons/ai/eng-board", title: "Engineer", body: "We develop agents, retrieval systems, integrations, & supporting infrastructure around the defined workflow.", x: 632, y: 0 },
    { icon: "icons/ai/eng-rocket", title: "Deploy & Evolve", body: "We connect system to your business, monitor how it performs, & continuously refine its intelligence, & impact.", x: 948, y: 228 },
  ],
  // Dashed arrows: the art is a 115 x 170 vertical run turned on its side.
  arrows: [
    { x: 146, y: 227, flip: "rotate(90deg) scaleY(-1)" },
    { x: 462, y: 113, flip: "rotate(-90deg)" },
    { x: 778, y: 227, flip: "rotate(90deg) scaleY(-1)" },
  ],
};

export const cta = {
  title: "Have a workflow worth improving?",
  body: "Tell us what's slowing your team down, what keeps getting repeated, or where your business needs better intelligence. We'll help find where AI can make the difference.",
};
