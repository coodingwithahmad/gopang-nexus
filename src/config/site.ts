export const siteConfig = {
  name: "GOPANG IT SOLUTION",
  shortName: "GOPANG",
  description:
    "Practical web development, business applications, and IT support for companies that need reliable software without unnecessary complexity.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  contactEmail: "hello@gopangit.com",
  // Social links — update when accounts are ready
  social: {
    linkedin: "",
    twitter: "",
  },
} as const;
