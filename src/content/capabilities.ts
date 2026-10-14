export interface Capability {
    number: string;
    title: string;
    description: string;
    includes: string[];
}

export const capabilities: Capability[] = [
    {
        number: "01",
        title: "PERFORMANCE MARKETING",
        description:
            "Campaigns that make the path from spend to outcome easier to see. B2B and B2C, from first lead to closed deal.",
        includes: [
            "B2B and B2C sales, lead generation",
            "Market and competitive research",
            "Digital campaigns across LinkedIn, Instagram, X",
            "Deal closure and conversion ownership",
        ],
    },
    {
        number: "02",
        title: "MARKETING OPERATIONS",
        description:
            "The tracking, reporting, and automation layer behind consistent execution — built so numbers can be trusted, not just produced.",
        includes: [
            "MIS reporting and KPI dashboards",
            "Process optimization, SLA compliance",
            "Cross-functional project coordination",
            "Excel VBA and AI-assisted workflow automation",
        ],
    },
    {
        number: "03",
        title: "CUSTOMER SUCCESS & REVENUE",
        description:
            "Clearer systems for account health, escalations, and cross-functional momentum — the handoff between a deal and the person it's for.",
        includes: [
            "Client relationship management",
            "Negotiation and deal closure",
            "Escalation management within strict SLAs",
            "Revenue assurance and stakeholder communication",
        ],
    },
];
