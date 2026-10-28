/**
 * The legal pages — Privacy Policy now, Terms & Conditions next. No Figma
 * frames: both are the site's centred page hero over one long-form document
 * (`sections/LegalDoc.astro`), copy supplied by the user.
 *
 * Headings are set in sentence case like every other heading on the site;
 * the supplied text is otherwise reproduced as given.
 */

/**
 * A paragraph, or a list whose items may open on a bold lead. Text may carry
 * `[[label|/href]]` for a link and "[Insert …]" for a detail still to come,
 * which renders visibly until it is filled in.
 */
export type LegalBlock =
  | { p: string }
  | { list: (string | { lead: string; text: string })[] }
  /** The company's contact card, built from `company` below. Each policy
      names its email differently. */
  | { contact: "privacy" | "terms" };

export interface LegalSection {
  id: string;
  title: string;
  body: LegalBlock[];
  subs?: { title: string; body: LegalBlock[] }[];
}

export interface LegalDoc {
  effective: string | null;
  updated: string | null;
  sections: LegalSection[];
  note?: string;
}

/**
 * Details the supplied copy leaves as "[Insert …]". Each `null` renders as a
 * visible placeholder until it is filled in here — one place for both pages.
 */
export const company = {
  name: "nuLyft Technologies Private Limited",
  registeredOffice: "WorkFlo Hitex Bizness Square, 4th Floor, Jubilee Enclave, HITEC City, Hyderabad." as string | null,
  privacyEmail: "contact@nulyfttech.com" as string | null,
  /** The Terms' general contact address. */
  contactEmail: "contact@nulyfttech.com" as string | null,
  website: "nulyfttech.com" as string | null,
  cin: "U62013TS2026PTC209466" as string | null,
  /** The city and state whose courts hear disputes under the Terms. */
  jurisdiction: "Hyderabad" as string | null,
};

/** Both policies take effect, and were last updated, on publication. */
const PUBLISHED = "28 October 2026";

/* --- Privacy Policy ------------------------------------------------------- */

export const privacyHero = {
  eyebrow: "Privacy policy",
  title: { lead: "nuLyft Privacy Policy" },
  body: [
    "Learn how nuLyft Technologies Private Limited collects, uses, and protects your",
    "personal information when you visit our website or contact us.",
  ],
};

export const privacy: LegalDoc = {
  effective: PUBLISHED,
  updated: PUBLISHED,
  sections: [
    {
      id: "introduction",
      title: "Introduction",
      body: [
        { p: "nuLyft Technologies Private Limited (“nuLyft”, “we”, “us”, or “our”) respects your privacy and is committed to handling personal information responsibly." },
        { p: "This Privacy Policy explains how we collect, use, store, disclose, and protect information when you visit our website, explore our services, contact us, submit a business enquiry, apply for a position, or otherwise communicate with us through our website." },
        { p: "nuLyft provides services including digital product design, UX and UI design, product engineering, software development, AI-powered solutions, intelligent automation, and related technology services." },
        { p: "By using our website, you acknowledge that you have read this Privacy Policy. Where applicable law requires consent for a particular activity, we will seek that consent separately." },
      ],
    },
    {
      id: "information-we-collect",
      title: "Information we collect",
      body: [{ p: "The information we collect depends on how you interact with our website and services." }],
      subs: [
        {
          title: "Information you provide",
          body: [
            { p: "When you contact us, request information, discuss a project, or submit an enquiry, we may collect:" },
            {
              list: [
                "Your name.",
                "Your business email address and telephone number.",
                "Your company name, job title, or professional role.",
                "Details about your project, business requirements, or requested services.",
                "Messages, documents, attachments, or other information you choose to share.",
                "Any other information you voluntarily provide through our communication channels.",
              ],
            },
            { p: "Please avoid sharing sensitive, confidential, or unnecessary personal information through the website unless it is specifically required and appropriate safeguards have been agreed." },
          ],
        },
        {
          title: "Career and recruitment information",
          body: [
            { p: "If you apply for a position or contact us about employment opportunities, we may collect information contained in your application, résumé, portfolio, qualifications, professional experience, and contact details." },
            { p: "We use this information to review your application, communicate with you, and manage the recruitment process." },
          ],
        },
        {
          title: "Technical and usage information",
          body: [
            { p: "When you visit our website, certain technical information may be collected automatically by our website infrastructure or the tools we use. Depending on the configuration, this may include:" },
            {
              list: [
                "Internet Protocol (IP) address.",
                "Browser type, operating system, and device information.",
                "Pages visited, referring pages, and navigation activity.",
                "Visit timestamps and general usage information.",
                "Server logs, diagnostics, and security-related information.",
                "Cookie identifiers or similar technologies, where enabled.",
              ],
            },
            { p: "We use this information, where applicable, to maintain website functionality, protect the website, identify technical issues, and understand how visitors interact with our content." },
          ],
        },
        {
          title: "Information from other sources",
          body: [
            { p: "We may receive relevant business contact information through referrals, professional interactions, publicly available business sources, or service providers, where permitted by applicable law." },
          ],
        },
      ],
    },
    {
      id: "how-we-use-information",
      title: "How we use information",
      body: [
        { p: "We may use the information collected for the following purposes:" },
        {
          list: [
            { lead: "Responding to enquiries:", text: "To answer questions, discuss requirements, arrange meetings, and respond to requests." },
            { lead: "Providing services:", text: "To evaluate project needs, prepare proposals, communicate with clients, and perform agreed services." },
            { lead: "Business communication:", text: "To manage client relationships, contracts, project coordination, and related administration." },
            { lead: "Recruitment:", text: "To review applications and communicate with candidates." },
            { lead: "Website operations:", text: "To maintain, troubleshoot, improve, and secure our website." },
            { lead: "Analytics and improvement:", text: "To understand website usage and improve content and functionality, where appropriate tools are enabled and their use is permitted." },
            { lead: "Legal and compliance requirements:", text: "To comply with applicable law, protect our legal rights, prevent misuse, and respond to lawful requests." },
          ],
        },
        { p: "We seek to use personal information only for specified, relevant purposes and in accordance with applicable legal requirements." },
        { p: "We will not use your information for unrelated purposes in a manner inconsistent with applicable law or the information provided to you." },
      ],
    },
    {
      id: "legal-grounds",
      title: "Legal grounds for processing",
      body: [
        { p: "Depending on the purpose and applicable law, we may process personal information with your consent, to respond to a request or establish or perform a business arrangement, to meet legal obligations, or on another basis permitted by applicable law." },
        { p: "Where consent is required, you may withdraw it using the method provided to you or by contacting us, subject to applicable legal requirements and any consequences explained at the time." },
        { p: "We will review and update our data-handling procedures as relevant provisions of India's Digital Personal Data Protection Act, 2023, and associated rules come into force and apply to our activities." },
      ],
    },
    {
      id: "cookies",
      title: "Cookies and similar technologies",
      body: [
        { p: "Our website may use cookies or similar technologies to support essential website functionality, maintain security, remember preferences, or understand website performance." },
        { p: "The specific technologies used depend on the website configuration and the third-party tools enabled." },
        { p: "Where analytics, advertising, or other non-essential technologies are used, we will provide applicable information and choices as required by law." },
        { p: "You may be able to manage or disable cookies through your browser settings. Disabling certain cookies may affect website functionality." },
        { p: "This section will be updated if our use of cookies or tracking technologies changes materially." },
      ],
    },
    {
      id: "sharing",
      title: "When we share information",
      body: [
        { p: "We do not sell personal information as a standalone commercial data product." },
        { p: "We may disclose relevant information in the following circumstances:" },
      ],
      subs: [
        {
          title: "Service providers",
          body: [
            { p: "We may share information with service providers that support our operations, such as website hosting, cloud infrastructure, business email, file storage, security, communications, analytics, and customer relationship management providers, where those services are used." },
            { p: "Such providers may process information on our behalf or under their applicable service terms. Access should be limited to what is reasonably necessary for the relevant purpose." },
          ],
        },
        {
          title: "Clients and business partners",
          body: [
            { p: "Where necessary for a project, service, referral, or other business arrangement, we may share information with a client, partner, or other party involved in that arrangement, in accordance with the relevant instructions and applicable law." },
          ],
        },
        {
          title: "Legal and regulatory requirements",
          body: [
            { p: "We may disclose information where required by law, a valid legal process, or a lawful request from a competent authority, or where reasonably necessary to protect our rights, security, or property." },
          ],
        },
        {
          title: "Business transactions",
          body: [
            { p: "If the company undergoes a merger, restructuring, acquisition, or transfer of business assets, relevant information may be transferred as part of that transaction, subject to applicable law and appropriate safeguards." },
          ],
        },
        {
          title: "With your direction or consent",
          body: [
            { p: "We may share information in other circumstances where you direct us to do so or where we have obtained consent when required." },
          ],
        },
      ],
    },
    {
      id: "international-processing",
      title: "International processing",
      body: [
        { p: "Some technology or infrastructure providers may process or store information in locations outside India." },
        { p: "Where such processing or transfer occurs, we will handle it in accordance with applicable legal requirements and any relevant contractual or other safeguards." },
        { p: "The locations and providers involved may depend on the services and infrastructure used." },
      ],
    },
    {
      id: "data-retention",
      title: "Data retention",
      body: [
        { p: "We retain personal information only for as long as reasonably necessary for the purpose for which it was collected, including responding to enquiries, maintaining business records, providing services, managing recruitment, resolving disputes, and meeting legal requirements." },
        { p: "Retention periods vary according to the type of information, the nature of the relationship, and applicable obligations." },
        { p: "When information is no longer required, we will take appropriate steps to delete it, anonymise it, or securely dispose of it, subject to applicable law and legitimate record-retention requirements." },
      ],
    },
    {
      id: "data-security",
      title: "Data security",
      body: [
        { p: "We take reasonable technical and organisational measures intended to protect information against unauthorised access, disclosure, alteration, loss, and misuse." },
        { p: "These measures may include access controls, secure infrastructure, appropriate handling procedures, and other safeguards relevant to our operations." },
        { p: "No website, transmission method, or electronic storage system can be guaranteed to be completely secure. We therefore cannot guarantee absolute security, but we aim to handle information responsibly and address security issues appropriately." },
      ],
    },
    {
      id: "your-rights",
      title: "Your privacy choices and rights",
      body: [
        { p: "Depending on applicable law and the circumstances of the processing, you may be entitled to request access to information about how your personal data is handled, request correction or deletion, withdraw consent, or exercise other applicable rights." },
        { p: "You may also request that we stop sending non-essential promotional communications where applicable." },
        { p: "To submit a privacy-related request, contact us using the details in the Contact Us section below. We may need to verify your identity before responding." },
        { p: "We will review and respond to requests in accordance with applicable law. Certain records may need to be retained where required by law or where another lawful basis applies." },
      ],
    },
    {
      id: "third-parties",
      title: "Third-party websites and services",
      body: [
        { p: "Our website may contain links to third-party websites, platforms, or services." },
        { p: "Those third parties operate under their own privacy policies and practices. We do not control their websites or assume responsibility for their independent data-handling practices." },
        { p: "We encourage you to review the relevant privacy policies before providing personal information to third-party services." },
      ],
    },
    {
      id: "childrens-privacy",
      title: "Children's privacy",
      body: [
        { p: "Our website is intended primarily for businesses, professionals, prospective clients, and individuals exploring our services. It is not designed to solicit personal information from children." },
        { p: "If we become aware that personal information has been collected from a child in circumstances where appropriate authorisation is required, we will take appropriate steps in accordance with applicable law." },
      ],
    },
    {
      id: "client-projects",
      title: "Client projects and other services",
      body: [
        { p: "This Privacy Policy principally concerns information collected through our corporate website and related communications." },
        { p: "When nuLyft provides product engineering, AI, automation, software development, or other services to a client, the handling of information within that engagement may also be governed by the applicable service agreement, confidentiality terms, data processing agreement, or other project-specific documentation." },
        { p: "Where nuLyft processes personal data on behalf of a client, the respective roles and responsibilities of the parties will be determined by the applicable arrangement and law." },
        { p: "This Privacy Policy does not replace any separate contractual privacy or data-processing terms." },
      ],
    },
    {
      id: "changes",
      title: "Changes to this policy",
      body: [
        { p: "We may update this Privacy Policy from time to time to reflect changes in our operations, website functionality, technology providers, or legal requirements." },
        { p: "The updated version will be published on this page with a revised “Last Updated” date. Where required by law, we will provide additional notice or obtain consent for relevant changes." },
        { p: "We encourage you to review this page periodically." },
      ],
    },
    {
      id: "contact-us",
      title: "Contact us",
      body: [
        { p: "For questions, concerns, or requests concerning this Privacy Policy or our handling of personal information, please contact:" },
        { contact: "privacy" },
        { p: "Please provide sufficient details about your request so that we can understand and respond to it." },
      ],
    },
  ],
  note: "This Privacy Policy should be read alongside any applicable service agreement or other contractual terms.",
};

/* --- Terms and Conditions --------------------------------------------------- */

export const termsHero = {
  eyebrow: "Terms and conditions",
  title: { lead: "nuLyft Terms of Use" },
  body: [
    "These terms outline the conditions for accessing and using the nuLyft Tech website",
    "and explain the rules that apply to its visitors.",
  ],
};

export const terms: LegalDoc = {
  effective: PUBLISHED,
  updated: PUBLISHED,
  sections: [
    {
      id: "introduction",
      title: "Introduction",
      body: [
        { p: "Welcome to nuLyft Technologies Private Limited (“nuLyft”, “we”, “us”, or “our”)." },
        { p: "These Terms and Conditions (“Terms”) govern your access to and use of our website, including its pages, content, visual materials, and information about our services." },
        { p: "nuLyft provides services including digital product design, UX and UI design, product engineering, software development, AI-powered solutions, intelligent automation, and related technology services." },
        { p: "By accessing or using this website, you agree to these Terms. If you do not agree, please discontinue use of the website." },
        { p: "These Terms govern website use. The delivery of professional services is also subject to any separate proposal, statement of work, service agreement, or other contract agreed between nuLyft and the relevant client." },
      ],
    },
    {
      id: "about-the-website",
      title: "About the website",
      body: [
        { p: "The website provides general information about nuLyft, our capabilities, services, projects, and business activities." },
        { p: "We aim to keep the information accurate and current. However, website content is provided for general informational purposes and may be updated, changed, or removed without prior notice." },
        { p: "The presence of a service description, portfolio item, or project example does not itself constitute an offer to provide services, a promise of availability, or a binding commitment to enter into a contract." },
        { p: "A professional engagement begins only when the relevant terms have been agreed through the appropriate business documentation or other legally valid arrangement." },
      ],
    },
    {
      id: "permitted-use",
      title: "Eligibility and permitted use",
      body: [
        { p: "You may use the website for lawful purposes, including learning about our services, reviewing our work, and contacting us regarding a potential business engagement." },
        { p: "When using the website, you agree not to:" },
        {
          list: [
            "Use the website in violation of applicable law.",
            "Attempt to gain unauthorised access to any system, account, server, or restricted area.",
            "Interfere with the operation, performance, or security of the website.",
            "Introduce malicious code, harmful files, or other material intended to disrupt systems.",
            "Scrape, harvest, or collect personal information through unauthorised means.",
            "Use automated tools to access the website in a manner that places unreasonable demands on the service or violates applicable restrictions.",
            "Misrepresent your identity, authority, or affiliation.",
            "Copy, reproduce, redistribute, or exploit website materials in violation of these Terms or applicable intellectual property rights.",
          ],
        },
        { p: "We may take reasonable action to protect the website, our users, our systems, and our legal rights against misuse." },
      ],
    },
    {
      id: "our-services",
      title: "Our services",
      body: [
        { p: "nuLyft may provide services relating to product strategy, product design, software development, application engineering, AI implementation, workflow automation, technical consulting, and related activities." },
        { p: "The exact scope, deliverables, milestones, fees, timelines, responsibilities, confidentiality requirements, intellectual property ownership, and other engagement terms will be established in the applicable proposal or agreement." },
        { p: "Information on this website should not be interpreted as a guarantee that a particular service, technology, feature, or engagement is available in every case." },
        { p: "Any estimates, schedules, proposals, or deliverables discussed during preliminary communications remain subject to the terms ultimately agreed by the parties." },
      ],
    },
    {
      id: "intellectual-property",
      title: "Intellectual property",
      body: [
        { p: "Unless otherwise stated, the original content and materials on this website, including text, graphics, layouts, visual compositions, branding, logos, and other materials, are owned by nuLyft or used under appropriate permission or licence." },
        { p: "These materials are protected by applicable intellectual property laws." },
        { p: "You may access and view website content for personal, informational, and legitimate business-evaluation purposes. You may not reproduce, modify, distribute, publish, commercially exploit, or create derivative works from protected materials without the necessary permission, except where such use is permitted by applicable law." },
        { p: "The nuLyft name, logo, and brand assets may not be used in a manner that suggests endorsement, affiliation, or permission without appropriate authorisation." },
        { p: "Third-party names, trademarks, logos, and other materials displayed on the website remain the property of their respective owners. Their inclusion does not, by itself, imply sponsorship, endorsement, or ownership by nuLyft." },
      ],
    },
    {
      id: "client-materials",
      title: "Client materials and project deliverables",
      body: [
        { p: "The ownership and permitted use of materials supplied by a client, materials created during an engagement, source code, designs, documentation, inventions, and other deliverables will be governed by the applicable service agreement." },
        { p: "These Terms do not independently transfer ownership of client materials or project deliverables to either party." },
        { p: "If you submit an enquiry or share preliminary project information through the website, you confirm that you are authorised to share that information." },
        { p: "Please do not submit highly confidential information, trade secrets, credentials, or sensitive personal data through a general website enquiry unless an appropriate arrangement has been established." },
        { p: "A website enquiry alone does not create a confidentiality agreement, non-disclosure agreement, or professional engagement. Any such obligations must arise from an applicable agreement or other legally binding basis." },
      ],
    },
    {
      id: "portfolio",
      title: "Portfolio, case studies, and project information",
      body: [
        { p: "The website may display portfolio examples, case studies, project descriptions, mockups, screenshots, and other materials intended to illustrate our capabilities and work." },
        { p: "These examples may represent particular projects, configurations, or stages of development. They are provided to explain our experience and are not a guarantee that another project will achieve the same outcomes or use the same approach." },
        { p: "Any performance figures, metrics, outcomes, or client-related statements displayed on the website should be understood in the context in which they are presented and should not be treated as a universal guarantee." },
        { p: "Project results depend on multiple factors, including requirements, resources, implementation, usage, and operating conditions." },
      ],
    },
    {
      id: "ai-and-technology",
      title: "AI-generated outputs and technology information",
      body: [
        { p: "Our website may describe or illustrate AI systems, intelligent automation, software, and related technologies." },
        { p: "Information about AI and technology is provided for general informational purposes. AI-generated outputs can be inaccurate, incomplete, or unsuitable for a particular use. Any implementation or use of such outputs should include appropriate review, testing, and human judgement based on the relevant context." },
        { p: "Descriptions of technologies, features, or potential use cases do not guarantee a particular technical result, level of accuracy, commercial outcome, or performance." },
        { p: "The actual performance, limitations, responsibilities, and permitted use of any technology delivered by nuLyft will depend on the agreed scope and applicable contractual terms." },
      ],
    },
    {
      id: "third-parties",
      title: "Third-party links and services",
      body: [
        { p: "Our website may contain links to third-party websites, platforms, tools, or services." },
        { p: "These links are provided for convenience or informational purposes. nuLyft does not control all third-party content, availability, policies, or practices and is not responsible for the independent operation of those services." },
        { p: "Accessing a third-party website or service is at your discretion and may be subject to its own terms and privacy policy." },
      ],
    },
    {
      id: "availability",
      title: "Website availability and accuracy",
      body: [
        { p: "We aim to keep the website accessible, useful, and accurate. However, we do not guarantee that the website will always be available, uninterrupted, error-free, or compatible with every device or browser." },
        { p: "Content may contain errors, omissions, outdated information, or technical limitations. We may modify, suspend, restrict, or discontinue website content or functionality at any time where reasonably necessary." },
        { p: "We do not guarantee that every defect will be corrected or that the website will always be free from security threats, although we take reasonable steps to maintain and protect it." },
      ],
    },
    {
      id: "warranties",
      title: "Disclaimer of warranties",
      body: [
        { p: "To the maximum extent permitted by applicable law, the website and its general informational content are provided on an “as is” and “as available” basis." },
        { p: "We make no general warranty that the website or its content will satisfy every user's requirements, produce a particular business outcome, or remain available without interruption." },
        { p: "Nothing in these Terms excludes a warranty, representation, right, or remedy that cannot lawfully be excluded under applicable law." },
        { p: "Any warranties or commitments specifically agreed for professional services will be governed by the relevant service agreement." },
      ],
    },
    {
      id: "liability",
      title: "Limitation of liability",
      body: [
        { p: "To the extent permitted by applicable law, nuLyft will not be liable for indirect, incidental, special, exemplary, or consequential loss arising from the use of, inability to use, or reliance on the general informational content of the website." },
        { p: "This may include loss of anticipated profits, business opportunities, data, goodwill, or business interruption, where such exclusion is legally permissible." },
        { p: "We are not responsible for interruptions or failures caused by circumstances beyond our reasonable control, including third-party service failures, network disruptions, or other external events." },
        { p: "Nothing in these Terms excludes or limits liability where such exclusion or limitation is prohibited by law. Nothing in this section limits any rights or remedies that applicable consumer protection laws make non-excludable." },
        { p: "Liability arising from a professional engagement will be governed by the relevant service agreement and applicable law." },
      ],
    },
    {
      id: "indemnity",
      title: "Indemnity",
      body: [
        { p: "To the extent permitted by applicable law, you are responsible for losses, claims, liabilities, and reasonable costs arising directly from your unlawful use of the website, your material breach of these Terms, or your infringement of another person's rights." },
        { p: "This clause does not apply to the extent that a loss results from nuLyft's own unlawful conduct or where such allocation of responsibility is prohibited by law." },
      ],
    },
    {
      id: "privacy",
      title: "Privacy",
      body: [
        { p: "Your use of the website is also subject to our [[Privacy Policy|/privacy-policy]], which describes how we handle personal information collected through the website and related communications." },
        { p: "Please review the Privacy Policy to understand our data-handling practices and the choices available to you." },
        { p: "The Privacy Policy forms part of the website's policy framework but does not replace any separate privacy, confidentiality, or data-processing terms applicable to a client engagement." },
      ],
    },
    {
      id: "suspension",
      title: "Suspension or restriction of access",
      body: [
        { p: "We may suspend or restrict access to the website, or take other reasonable protective measures, where necessary to address suspected misuse, security risks, unlawful activity, or material violations of these Terms." },
        { p: "Where appropriate and legally permissible, we may take steps to preserve evidence or cooperate with lawful requests from competent authorities." },
      ],
    },
    {
      id: "changes",
      title: "Changes to these terms",
      body: [
        { p: "We may revise these Terms to reflect changes in our website, services, operations, or legal requirements." },
        { p: "The updated version will be published on this page with a revised “Last Updated” date." },
        { p: "Changes will apply prospectively from the stated effective date or publication date, as appropriate, subject to applicable law. Where a separate notice or consent is legally required, we will provide it." },
        { p: "We encourage you to review these Terms periodically." },
      ],
    },
    {
      id: "governing-law",
      title: "Governing law and disputes",
      body: [
        { p: "These Terms are governed by the laws of India, subject to any mandatory legal provisions that apply." },
        { p: "The parties will endeavour to resolve concerns arising from website use through good-faith communication." },
        { p: `Subject to applicable law and any mandatory jurisdictional requirements, the competent courts at ${company.jurisdiction ?? "[Insert agreed city and state in India]"} shall have jurisdiction over disputes relating to these Terms.` },
        { p: "Nothing in this section limits any non-waivable statutory rights or remedies." },
      ],
    },
    {
      id: "contact-information",
      title: "Contact information",
      body: [
        { p: "For questions about these Terms or the website, please contact:" },
        { contact: "terms" },
      ],
    },
  ],
  note: "These Terms govern the use of the nuLyft website. Any separately agreed professional services are subject to their applicable contract and supporting documentation.",
};
