/**
 * AI & Automation capability page — Figma 647:6302, 1440 x 6671; copy
 * updated to 673:9776 (Oct 2026).
 * Hero (707), What we do (1386), dark project rows (803 + 607 + 607),
 * Where can we help (812), How we engineer it (895), CTA + footer.
 *
 * The AI Agents and Intelligent Workflow cards animate through the state
 * boards 647:7514 and 647:7155; their geometry lives here so the static
 * render and the script agree.
 */

/* --- hero ------------------------------------------------------------------ */

export const hero = {
  height: 707,
  eyebrow: "AI & automation",
  title: "Turning AI into ",
  emphasis: "practical solutions",
  body: "We build AI agents, intelligent workflows, and AI-powered applications that simplify complex tasks, connect systems, and bring AI into everyday operations.",
  primary: { label: "Discuss your AI project", href: "/contact" },
  // The copy update (673:9776) drops the second button; rendered only when set.
  secondary: null as { label: string; href: string } | null,
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
  eyebrow: "What we do",
  title: "AI that moves work forward",
  body: "From answering questions to executing workflows, we build AI systems around the work your business already does.",
  agents: {
    kicker: "LangChain · LLMs · Tool calling · RAG",
    title: "AI agents & custom solutions",
    body: "Build AI agents and custom AI applications that understand context, retrieve relevant information, use tools, and carry out tasks.",
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
    kicker: "n8n · Make · Microsoft Power Automate · RPA",
    title: "Workflow automation",
    body: "Connect applications, automate repetitive processes, & move information across business systems with less manual effort.",
    perInvoice: "30 min per invoice",
    steps: [
      { icon: "icons/ai/wf-email", title: "New invoice email", time: "You - 6 min", kind: "Trigger" },
      { icon: "icons/ai/wf-agent", title: "Extract the fields", time: "You - 8 min", kind: "AI" },
      { icon: "icons/ai/wf-check", title: "Match to purchase ", time: "You - 12 min", kind: "Rules" },
      { icon: "icons/ai/wf-update", title: "Update accounts", time: "You - 4 min", kind: "Trigger" },
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
    kicker: "Document processing · Data extraction · Intelligent search",
    title: "Document & data intelligence",
    // "can searched" is the frame's own wording, kept as drawn — flagged.
    body: "Turn documents & business data into structured information that can be searched, analyzed, & used in business processes.",
    caption: "Document → usable data",
    /** Each field is read from the document line its number marks. */
    fields: [
      { label: "Vendor", value: "Northwind Supplies" },
      { label: "Due date", value: "30 Nov 2026" },
      { label: "Total", value: "₹ 1,85,999" },
    ],
  },
  voice: {
    kicker: "AI voice agents · Chatbots · Speech integration",
    title: "Voice & conversational AI",
    body: "Develop AI-powered voice and chat experiences for customer enquiries, lead qualification, follow-ups, and other interactions.",
    channels: [
      { icon: "icons/ai/voice-call", label: "Voice call" },
      { icon: "icons/ai/voice-chat", label: "Chat" },
    ],
    role: "AI VOice & chat",
    /** Rendered word by word so each can light as the agent does it. */
    actions: ["Understands", "replies", "records"],
    outcomes: ["Lead qualified", "Demo booked", "CRM Updated"],
    /** Figma's 53 waveform bars (647:6622), heights in px. */
    bars: [
      2, 3, 3.5, 3.99, 4, 4.5, 8, 8, 6, 5, 4.78, 12, 12, 8, 3, 0.7, 3, 10, 6, 8, 8.32, 13, 13.6, 9, 6, 5, 3,
      3.7, 9, 10, 12, 13, 14, 13.6, 14.8, 9, 9, 9, 8, 7, 6, 7, 5, 3, 2, 0.67, 7, 8, 14.8, 9, 5, 2, 0.67,
    ],
  },
};

/* --- the technology ecosystem (dark) — Figma 673:10175 ------------------ */

/**
 * Replaces "What we've been building". Twenty-four technology tiles placed
 * around three concentric rings, the nuLyft mark at their shared centre.
 * Coordinates are the 1240-wide stage's own (673:10176), read per tile off
 * the file — the tiles sit in several nested, offset groups, so the group
 * coordinates alone would place them wrong. `w`/`h` is the logo's drawn
 * size inside its 64px tile; most are 32 square.
 */
export const technology = {
  eyebrow: "The technology ecosystem",
  title: "Different technologies. One solution",
  // Copy as drawn, including "Automation. Integrations".
  body: "We bring together the best in AI, automation, integrations and modern infrastructure to build solutions that work for your business.",
  stage: { w: 1240, h: 1183.771, top: 136 },
  /** All three share the hub's centre. */
  center: { x: 616.546, y: 591.886 },
  rings: [591.885, 887.828, 1183.771],
  hub: 147.971,
  tiles: [
    { name: "Slack", icon: "slack", x: 334, y: 406.89 },
    { name: "PostgreSQL", icon: "postgresql", x: 291, y: 553.89 },
    { name: "Twilio", icon: "twilio", x: 334, y: 713.89 },
    { name: "MongoDB", icon: "mongodb", x: 204, y: 328 },
    { name: "LlamaIndex", icon: "llamaindex", x: 155, y: 482.89 },
    { name: "Vapi", icon: "vapi", x: 143, y: 637.89 },
    { name: "Claude", icon: "claude", x: 204, y: 793 },
    { name: "LangChain", icon: "langchain", x: 966, y: 327.89 },
    { name: "Media playback", icon: "play-circle", x: 1015, y: 481.89 },
    { name: "IoT", icon: "iot", x: 1027, y: 634.89 },
    { name: "Pinecone", icon: "pinecone", x: 966, y: 792.89, w: 29 },
    { name: "n8n", icon: "n8n", x: 836, y: 406.89 },
    { name: "Make", icon: "make", x: 879, y: 553.89 },
    { name: "Power Automate", icon: "power-automate", x: 836, y: 713.89 },
    { name: "Database search", icon: "database-search", x: 96, y: 230.89 },
    { name: "ElevenLabs", icon: "elevenlabs", x: 28, y: 721.89, w: 19 },
    { name: "Salesforce", icon: "salesforce", x: 24, y: 386.89 },
    { name: "Gemini", icon: "gemini", x: 0, y: 542.89 },
    { name: "Microsoft Teams", icon: "teams", x: 96, y: 885.89, w: 31 },
    { name: "Meta", icon: "meta", x: 1079, y: 231, h: 21 },
    { name: "Redis", icon: "redis", x: 1147, y: 721.89 },
    { name: "Jira", icon: "jira", x: 1158, y: 386.89 },
    { name: "OpenAI", icon: "openai", x: 1175, y: 542.89 },
    { name: "Mistral AI", icon: "mistral", x: 1079, y: 885.89, w: 35 },
  ] as { name: string; icon: string; x: number; y: number; w?: number; h?: number }[],
  /**
   * The phone layout (<= 700) — not in Figma, chosen by the user: the orbit
   * at phone scale was 24 unlabelled 26px squares. The same tiles, named and
   * grouped; every tile above appears in exactly one group, by `name`.
   */
  groups: [
    { title: "AI models", tiles: ["Claude", "OpenAI", "Gemini", "Mistral AI", "Meta"] },
    { title: "Agents & retrieval", tiles: ["LangChain", "LlamaIndex", "Pinecone", "Database search"] },
    { title: "Data & infrastructure", tiles: ["PostgreSQL", "MongoDB", "Redis", "IoT"] },
    { title: "Automation", tiles: ["n8n", "Make", "Power Automate"] },
    { title: "Voice & media", tiles: ["Vapi", "ElevenLabs", "Twilio", "Media playback"] },
    { title: "Business apps", tiles: ["Slack", "Microsoft Teams", "Salesforce", "Jira"] },
  ],
};

/* --- where can we help ------------------------------------------------------ */

export const industries = {
  eyebrow: "Where can we help",
  title: "AI solutions for everyday business challenges",
  body: "AI creates value when it solves a real operational problem. We identify repetitive tasks, information-heavy processes, and decisions that can be improved with AI, automation, and connected systems.",
  cards: [
    { icon: "icons/ai/ind-finance", size: 20, title: "Finance & accounting", items: ["Invoice processing", "Reconciliation", "Payment follow-ups", "Expense auditing"] },
    { icon: "icons/ai/ind-supply", size: 20, title: "Supply chain & logistics", items: ["Inventory monitoring", "Supplier coordination", "Order tracking", "Delay detection"] },
    { icon: "icons/ai/ind-health", size: 20, title: "Healthcare", items: ["Appointment handling", "Patient enquiries", "Document processing", "Claims workflows"] },
    { icon: "icons/ai/ind-hr", size: 24, title: "HR & recruitment", items: ["Resume intelligence", "AI interviews", "Interview scheduling", "Candidate workflows"] },
    { icon: "icons/ai/ind-sales", size: 20, title: "Sales & marketing", items: ["Lead qualification", "AI calling", "CRM Updates", "Sales follow-ups"] },
    { icon: "icons/ai/ind-manuf", size: 20, title: "Manufacturing", items: ["Quality monitoring", "Maintenance alerts", "Production reporting", "Operations support"] },
    { icon: "icons/ai/ind-enterprise", size: 20, title: "Enterprise & IT", items: ["IT support agents", "Incident triage", "Access workflows", "Operational automation"] },
  ],
  /** Figma centres HR & Recruitment (index 3) and lifts it. */
  active: 3,
};

/* --- how we engineer it ---------------------------------------------------- */

export const engineer = {
  eyebrow: "How we engineer it",
  title: "From problem to practical solution",
  body: "We start by understanding the work that needs to change. Then we design, build, and integrate the right combination of AI, automation, and systems to make it happen.",
  // Zig-zag: x, y inside the 1240 x 455 stage.
  steps: [
    { icon: "icons/ai/eng-find", title: "Understand", body: "We map the workflow, identify repetitive tasks and decisions, understand the data involved, and find where AI can make a meaningful difference.", x: 0, y: 0 },
    { icon: "icons/ai/eng-model", title: "Architect", body: "We determine how AI models, agents, automation, APIs, knowledge systems, and human decisions should work together to solve the problem.", x: 316, y: 228 },
    { icon: "icons/ai/eng-board", title: "Engineer", body: "We build the agents, retrieval systems, integrations, and the supporting infrastructure needed to bring the solutions to life.", x: 632, y: 0 },
    { icon: "icons/ai/eng-rocket", title: "Deploy & evolve", body: "We integrate the solution into your existing environment, monitor its performance, and refine it over time based on real-world results.", x: 948, y: 228 },
  ],
  // Dashed arrows: the art is a 115 x 170 vertical run turned on its side.
  arrows: [
    { x: 146, y: 227, flip: "rotate(90deg) scaleY(-1)" },
    { x: 462, y: 113, flip: "rotate(-90deg)" },
    { x: 778, y: 227, flip: "rotate(90deg) scaleY(-1)" },
  ],
};

export const cta = {
  title: "Have an AI opportunity in mind?",
  body: "Tell us what you're trying to improve, what takes up too much of your team's time, or where your current systems fall short. We'll help you explore the right solution.",
};
