export interface ToolkitGroup {
    label: string;
    items: string[];
}

// Straight from the CV's four skill groups.
export const toolkit: ToolkitGroup[] = [
    {
        label: "SALES & CLIENT MANAGEMENT",
        items: ["B2B & B2C Sales", "Lead Generation", "Client Relationship Management", "Negotiation", "Deal Closure", "Client Escalation Management"],
    },
    {
        label: "DATA ANALYTICS & REPORTING",
        items: ["MIS Reporting", "KPI Dashboards", "Data Validation", "Operational Performance Analysis", "Market Research"],
    },
    {
        label: "BUSINESS OPERATIONS",
        items: ["Project Coordination", "Cross-Functional Collaboration", "Stakeholder Communication", "Revenue Assurance", "SLA Compliance", "Process Optimization"],
    },
    {
        label: "TECHNOLOGY & AUTOMATION",
        items: ["Microsoft Office Suite", "Advanced Excel", "Excel VBA", "AI-Assisted Workflow Automation", "CRM Tools", "n8n", "Zapier", "Marketo", "Brezo", "Claude Code"],
    },
];
