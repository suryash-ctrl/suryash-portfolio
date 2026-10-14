export interface ToolkitGroup {
    label: string;
    items: string[];
}

export const toolkit: ToolkitGroup[] = [
    {
        label: "PLATFORMS",
        items: ["Google Ads", "Meta Ads", "GA4", "GTM", "Salesforce", "Looker Studio"],
    },
    {
        label: "ANALYTICS",
        items: ["CAC", "ROAS", "CPL", "LTV:CAC", "CTR", "CVR", "AOV"],
    },
    {
        label: "SYSTEMS",
        items: ["Excel VBA", "XLOOKUP", "Power BI", "Google Workspace", "MIS", "Data QA"],
    },
    {
        label: "AUTOMATION",
        items: ["n8n", "Zapier", "Marketo", "Claude Code", "CRM Tools", "AI-Assisted Workflows"],
    },
];
