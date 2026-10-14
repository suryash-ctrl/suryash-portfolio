import { SOCIAL } from "@/config/links";

/** Everything the on-page assistant is allowed to say, taken from the CV
 *  (SURYASH_RAJ_FlowCV_Resume_2026-10-14). It answers in third person on
 *  Suryash's behalf and says so plainly when something isn't on the CV. */

interface Intent {
    id: string;
    test: RegExp;
    answer: string;
}

const UPS = "United Parcel Service (Global Business Solution, Pune 1)";

const INTENTS: Intent[] = [
    {
        id: "greeting",
        test: /^\s*(hi|hello|hey|namaste|yo|good (morning|afternoon|evening))\b/i,
        answer: "Hey! I'm Suryash's AI assistant. Ask me about his experience, projects, skills, or how to hire him: full-time or on a project.",
    },
    {
        id: "fulltime",
        test: /full[\s-]?time|hire|hiring|recruit|job offer|open to work|available|availability|join (us|the team)|role|opening/i,
        answer: `Suryash is open to work. He's a Pune-based Senior Marketing and operations professional with 6+ months at ${UPS} and a Client Manager stint at NoBroker Interiors. Best way in: ${SOCIAL.email} or ${SOCIAL.phone}. I'll take you to the contact desk if you tap "Full-time".`,
    },
    {
        id: "project",
        test: /project work|freelanc|contract|consult|gig|collaborat|automation for (me|us)|build (me|us)|work together|start a project/i,
        answer: "Yes, he takes on project work, mainly workflow automation (n8n, Zapier, Excel VBA, AI-assisted flows), MIS and KPI reporting, and CRM and lead-follow-up setups. Scope and rates aren't something I can quote. Write to Suryash and he'll reply himself.",
    },
    {
        id: "ups",
        test: /\bups\b|united parcel|global business|pune 1|senior marketing/i,
        answer: `At ${UPS} (Jan to Jul 2026) he managed workflows and revenue assurance for 20 global enterprise accounts, including Amazon, Apple, Louis Vuitton and Nike, across EMEA, AMER and APAC. He resolved escalations across 15+ key accounts inside strict two-hour SLAs, built Excel VBA and AI-assisted automations that saved an hour per contract at 99% data accuracy, produced weekly, monthly and annual MIS reports, and validated billing data across a $50M+ portfolio.`,
    },
    {
        id: "nobroker",
        test: /no\s?broker|interior|client manager|70\s?(l|lakh)/i,
        answer: "At NoBroker Interiors (Oct 2025 to Jan 2026) he ran the end-to-end sales cycle for residential interior projects, from first call and requirement analysis to negotiation, closure and handover, while working toward a monthly revenue target of ₹70 lakh. He was the single point of contact for clients and coordinated design teams, vendors and project managers.",
    },
    {
        id: "botmatic",
        test: /botmatic|intern|internship|b2b prospect|cfo/i,
        answer: "At Botmatic Solution Pvt. Ltd. (May to Jul 2024) he was a Business Development Intern. He qualified B2B prospects, mainly CFOs and finance decision-makers, using MCA, LinkedIn and Apollo, supported SaaS product demos, built sales collateral and whitepapers, and ran content on LinkedIn, Instagram and X.",
    },
    {
        id: "experience",
        test: /experience|worked|work history|career|background|companies|where (has|did)/i,
        answer: `Three roles on the CV: Senior Marketing at ${UPS} (Jan to Jul 2026), Client Manager at NoBroker Interiors (Oct 2025 to Jan 2026), and Business Development Intern at Botmatic Solution (May to Jul 2024). Ask me about any of them, or tap "Work experience" to see the timeline.`,
    },
    {
        id: "projects",
        test: /projects?\b|built|portfolio|automat|workflow|n8n|zapier|marketo|dashboard|\bmis\b/i,
        answer: "Six personal projects: AI-powered lead generation and prospect enrichment; billing validation and revenue assurance automation; automated MIS reporting and KPI dashboards; AI-powered email and client follow-up automation; AI-assisted social content automation; and a CRM and marketing automation workflow. Tools include n8n, Zapier, Excel VBA, Claude, Marketo and Apollo. Tap \"Projects\" for the cards.",
    },
    {
        id: "skills",
        test: /skills?|tools?|tech(nology)?|stack|excel|vba|crm|claude|strength|good at|expertise/i,
        answer: "Four skill areas on the CV. Sales and client management (B2B and B2C sales, lead generation, negotiation, deal closure, escalations). Data analytics and reporting (MIS, KPI dashboards, data validation). Business operations (revenue assurance, SLA compliance, process optimization). Technology and automation (Advanced Excel, Excel VBA, n8n, Zapier, Marketo, CRM tools, Claude Code).",
    },
    {
        id: "education",
        test: /educat|study|studied|college|university|degree|pgdm|mba|b\.?com|school|qualification/i,
        answer: "PGDM in Marketing and Finance from Mulshi Institute of Business Management, Pune (2023 to 2025); B.Com from Allahabad University (2023); HSC (2020) and SSC (2018) from St. Joseph's College, Prayagraj.",
    },
    {
        id: "awards",
        test: /award|prize|extracurricular|football|debate|presentation|hobby|hobbies|sport/i,
        answer: "From the CV: Captain of the school football team (led it to inter-school wins), 1st Prize in an inter-school presentation competition, and Runner-Up in an intra-school debate.",
    },
    {
        id: "numbers",
        test: /number|result|impact|achiev|metric|stat|accomplish|revenue|accuracy|sla/i,
        answer: "The CV's headline numbers: 20 global enterprise accounts managed, 15+ key accounts' escalations resolved within two-hour SLAs, one hour saved per contract with 99% data accuracy, a $50M+ billing portfolio validated, and a ₹70 lakh monthly revenue target worked toward at NoBroker. They come from his CV, not live reporting.",
    },
    {
        id: "contact",
        test: /contact|email|e-mail|mail|phone|call|number|whatsapp|linkedin|reach|talk|connect|touch/i,
        answer: `Email ${SOCIAL.email}, phone ${SOCIAL.phone}, or LinkedIn (${SOCIAL.linkedin.replace("https://", "")}). There's also a contact form at the bottom of this page.`,
    },
    {
        id: "location",
        test: /where|location|based|city|pune|relocat|remote|india/i,
        answer: "Suryash is based in Pune, Maharashtra. His CV doesn't say anything about relocation or remote preferences, so please ask him directly.",
    },
    {
        id: "cv",
        test: /\bcv\b|resume|résumé|download/i,
        answer: "Here's his one-page CV. It's the Download CV button just below the intro, or /Suryash-Raj-Resume.pdf.",
    },
    {
        id: "who",
        test: /who|about|yourself|summary|tell me|introduc|suryash/i,
        answer: "Suryash Raj is a results-driven professional in B2B and B2C sales, digital marketing, AI-powered workflow automation and data analytics, with a PGDM in Marketing and Finance. He works across cross-functional teams in India, APAC and Europe and cares most about the handoff between a campaign, the data behind it, and the client on the other side.",
    },
    {
        id: "salary",
        test: /salary|ctc|compensation|\bpay\b|\brate\b|price|cost|notice period|expected/i,
        answer: "Compensation and notice period aren't on his CV, and I won't guess. Please raise that with Suryash directly.",
    },
];

export const FALLBACK =
    "I can only speak to what's on Suryash's CV, and I don't have that. Try asking about his experience, projects, skills, education, or how to hire him. For anything else, write to him directly.";

/** Pick the most specific matching answer. Specific roles beat generic ones. */
export function answer(question: string): string {
    const q = question.trim();
    if (!q) return FALLBACK;
    for (const i of INTENTS) if (i.test.test(q)) return i.answer;
    return FALLBACK;
}

export const SUGGESTIONS = ["What did he do at UPS?", "Which tools does he use?", "Tell me about his projects", "How do I contact him?"] as const;
