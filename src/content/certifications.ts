export interface Certification {
    title: string;
    issuer?: string;
    status: "done" | "in-progress";
}

export const certifications: Certification[] = [
    { title: "Lean Six Sigma Yellow Belt", status: "done" },
    { title: "Artificial Intelligence in Marketing", status: "done" },
    { title: "Power BI Data Analyst (PL-300)", status: "in-progress" },
    { title: "Google Data Analytics Professional Certificate", issuer: "Coursera", status: "in-progress" },
];
