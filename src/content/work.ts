export interface WorkItem {
    slug: string;
    title: string;
    group: string;
    description: string;
    tools: string[];
}

export const work: WorkItem[] = [
    {
        slug: "lead-gen-enrichment",
        title: "AI-Powered Lead Generation & Prospect Enrichment",
        group: "ACQUISITION LIFECYCLE",
        description:
            "Workflows to organize B2B prospects, enrich lead records, and identify relevant decision-makers — automating categorization, research, and follow-up task creation to improve pipeline management.",
        tools: ["n8n", "Zapier", "LinkedIn", "Apollo", "Claude", "Google Sheets"],
    },
    {
        slug: "billing-validation-automation",
        title: "Billing Validation & Revenue Assurance Automation",
        group: "AUTOMATION & DATA QUALITY",
        description:
            "Automated validation workflows comparing billing records, operational data, and commercial terms — data quality checks that catch discrepancies and cut manual processing.",
        tools: ["Advanced Excel", "Excel VBA", "AI-Assisted Automation"],
    },
    {
        slug: "mis-kpi-dashboard",
        title: "Automated MIS Reporting & KPI Dashboard",
        group: "AUTOMATION & DATA QUALITY",
        description:
            "Automated data consolidation and recurring reporting for operational KPIs, account performance, and retention metrics — weekly, monthly, and annual MIS structured for management visibility.",
        tools: ["Microsoft Excel", "VBA", "PivotTables", "Microsoft Office"],
    },
    {
        slug: "email-followup-automation",
        title: "AI-Powered Email & Client Follow-Up Automation",
        group: "CLIENT OPERATIONS",
        description:
            "Workflows to capture inquiries, organize client information, and trigger follow-up reminders based on lead status — streamlined communication tracking so responses stay timely.",
        tools: ["n8n", "Zapier", "Gmail", "CRM Tools", "Claude Code"],
    },
    {
        slug: "social-content-automation",
        title: "AI-Assisted Social Media Content Automation",
        group: "ACQUISITION LIFECYCLE",
        description:
            "AI-assisted workflows for content ideation, caption generation, and platform-specific adaptation — content calendars, approval stages, and publishing organized end to end.",
        tools: ["Claude", "n8n", "LinkedIn", "Instagram", "X"],
    },
    {
        slug: "crm-marketing-automation",
        title: "CRM & Marketing Automation Workflow",
        group: "ACQUISITION LIFECYCLE",
        description:
            "Mapped lead capture, segmentation, nurturing, and sales handoff — workflow logic for lead-status updates, engagement tracking, and follow-up triggers to improve pipeline visibility.",
        tools: ["Marketo", "n8n", "Zapier", "CRM Tools"],
    },
];
