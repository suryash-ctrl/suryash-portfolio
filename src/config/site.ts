import { SITE_URL, SOCIAL } from "./links";

export const SITE = {
    name: "Suryash Raj",
    url: SITE_URL,
    domain: "suryash.vercel.app",
    title: "Suryash Raj — Digital Marketing, Operations, Customer Success",
    description:
        "I work where performance marketing, reliable data, and customer relationships meet — turning complex operating detail into clearer growth decisions. Experience across United Parcel Service (Global Business Solution, Pune 1), NoBroker Interiors, and Botmatic Solutions. Open to new opportunities.",
    descriptionShort: "Digital marketing · operations · customer success. Open to new opportunities.",
    locale: "en_US",
    jobTitle: "Senior Marketing & Operations Specialist",
    employer: "United Parcel Service (Global Business Solution, Pune 1)",
    location: { city: "Pune", country: "IN" },
    sameAs: [SOCIAL.linkedin],
} as const;
