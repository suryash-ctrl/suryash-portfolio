export type ExperienceCategory = "marketing" | "operations" | "customer-success";

export interface ExperienceEntry {
    type: "work" | "milestone";
    company: string;
    role?: string;
    startDate: { month: number; year: number };
    endDate?: { month: number; year: number };
    badges?: string[];
    categories?: ExperienceCategory[];
    active?: boolean;
    bullets?: string[];
    barColor: "accent" | "gray" | "green";
    barLabel?: string;
}

export const TIMELINE_START_YEAR = 2018;
export const TIMELINE_END_YEAR = 2026;
export const YEAR_HEIGHT = 80;
export const PRESENT = { month: 12, year: TIMELINE_END_YEAR } as const;

export const experience: ExperienceEntry[] = [
    {
        type: "work",
        company: "United Parcel Service (Global Business Solution, Pune 1)",
        role: "Senior Marketing",
        startDate: { month: 1, year: 2026 },
        endDate: { month: 7, year: 2026 },
        badges: ["SENIOR MARKETING", "PUNE", "20 GLOBAL ACCOUNTS"],
        categories: ["marketing", "operations"],
        barColor: "accent",
        bullets: [
            "managed workflows and **revenue assurance** for **20 global enterprise accounts** — including **Amazon**, **Apple**, **Louis Vuitton** and **Nike** — across **EMEA**, **AMER** and **APAC**",
            "coordinated cross-functional teams across **India**, **APAC** and **Europe**, keeping operations and project delivery on schedule",
            "managed global client communication and resolved escalations across **15+ key accounts**, holding every case inside a strict **2-hour SLA**",
            "built **Excel VBA** and **AI-assisted automation** workflows that cut processing time by **1 hour per contract** while holding **99% data accuracy**",
            "shipped weekly, monthly and annual **MIS reports** and **KPI dashboards** tracking performance, account health and retention",
            "validated billing data across a **$50M+ portfolio** and audited **SLAs** and commercial terms to cut revenue leakage and hold compliance",
        ],
    },
    {
        type: "work",
        company: "NoBroker Interiors",
        role: "Client Manager",
        startDate: { month: 10, year: 2025 },
        endDate: { month: 1, year: 2026 },
        badges: ["CLIENT MANAGER", "PUNE", "CUSTOMER LIFECYCLE"],
        categories: ["marketing", "customer-success"],
        barColor: "gray",
        bullets: [
            "owned the end-to-end sales cycle for residential interior projects — first call, requirement analysis, negotiation, deal closure, handover",
            "worked toward a monthly revenue target of **₹70 lakh**, converting qualified leads and negotiating commercial terms to close interior design projects",
            "stayed the single point of contact through the customer journey, managing expectations and project updates for a smooth client experience",
            "coordinated with design teams, vendors and project managers to align requirements, pricing, timelines and execution",
            "resolved client escalations, vendor issues and project delays through cross-team coordination to protect delivery and satisfaction",
        ],
    },
    {
        type: "work",
        company: "Botmatic Solutions",
        role: "Business Development Intern",
        startDate: { month: 5, year: 2024 },
        endDate: { month: 7, year: 2024 },
        badges: ["BD INTERN", "PUNE", "B2B GROWTH"],
        categories: ["marketing", "customer-success"],
        barColor: "gray",
        barLabel: "INTERNSHIP",
        bullets: [
            "identified and qualified **B2B prospects** — particularly **CFOs** and finance decision-makers — using **MCA**, **LinkedIn** and **Apollo** to build a targeted pipeline",
            "supported business development with **SaaS product demos**, communicating value propositions aligned to prospect needs",
            "built presentations, sales collateral and whitepapers to support prospect engagement and outreach",
            "supported brand awareness and lead generation through content across **LinkedIn**, **Instagram** and **X**",
            "researched target industries, prospects and competitors to identify opportunities for targeted outreach",
        ],
    },
    {
        type: "milestone",
        company: "PGDM, Marketing & Finance — Mulshi Institute of Business Management",
        startDate: { month: 6, year: 2023 },
        endDate: { month: 5, year: 2025 },
        barColor: "green",
        barLabel: "Education",
    },
    {
        type: "milestone",
        company: "Bachelor of Commerce — Allahabad University",
        startDate: { month: 6, year: 2020 },
        endDate: { month: 5, year: 2023 },
        barColor: "green",
    },
    {
        type: "milestone",
        company: "Higher Secondary (12th) — St. Joseph's College",
        startDate: { month: 5, year: 2020 },
        endDate: { month: 5, year: 2020 },
        barColor: "green",
    },
    {
        type: "milestone",
        company: "Secondary School (10th) — St. Joseph's College",
        startDate: { month: 5, year: 2018 },
        endDate: { month: 5, year: 2018 },
        barColor: "green",
    },
];

export function dateToY(month: number, year: number): number {
    const totalMonths = (year - TIMELINE_START_YEAR) * 12 + (month - 1);
    const totalTimelineMonths = (TIMELINE_END_YEAR - TIMELINE_START_YEAR) * 12;
    return ((totalTimelineMonths - totalMonths) / 12) * YEAR_HEIGHT;
}

export function getBarHeight(start: { month: number; year: number }, end?: { month: number; year: number }): number {
    const endDate = end ?? PRESENT;
    const months = (endDate.year - start.year) * 12 + (endDate.month - start.month);
    return Math.max(8, (months / 12) * YEAR_HEIGHT);
}

export function formatDate(d: { month: number; year: number }): string {
    const months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
    return `${months[d.month - 1]} ${d.year}`;
}
