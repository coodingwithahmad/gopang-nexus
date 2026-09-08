export const siteConfig = {
  name: "GOPANG IT SOLUTION",
  shortName: "GOPANG",
  description:
    "We build websites, business applications, and internal tools for companies that need software they can actually use and maintain.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  contactEmail: "hello@gopangit.com",
  // Social links — update when accounts are ready
  social: {
    linkedin: "",
    twitter: "",
  },
} as const;
