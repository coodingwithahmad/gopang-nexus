import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "FAQ",
  description:
    "Answers to common questions about working with GOPANG IT SOLUTION.",
};

const faqs = [
  {
    question: "What types of projects do you take on?",
    answer:
      "We mostly work on websites, business web applications, and internal tools. Our work is almost exclusively custom — we don't sell templates or resell off-the-shelf platforms. If your project needs something built specifically for your business, that's where we fit.",
  },
  {
    question: "How do you price projects?",
    answer:
      "Most projects are quoted at a fixed price after we've scoped the work together. For ongoing work or projects where the requirements evolve, we can work on a time-and-materials basis. We'll always be clear about pricing before any work starts.",
  },
  {
    question: "How long does a typical project take?",
    answer:
      "It depends on the scope. A simple website might take 4–6 weeks. A business application with multiple user roles and integrations might take 3–6 months. We'll give you a realistic timeline during the scoping phase and flag any factors that might affect it.",
  },
  {
    question: "Do you work with clients outside your location?",
    answer:
      "Yes. Most of our work is done remotely and we have clients in different cities and countries. We communicate primarily by email and video call, and we keep clients updated regularly throughout a project.",
  },
  {
    question: "What happens after the project is finished?",
    answer:
      "We hand over all code, credentials, documentation, and assets. We offer ongoing maintenance and support agreements for clients who need them, but there's no obligation. If you want to take the project in-house after handover, we'll make sure your team has everything they need to do that.",
  },
  {
    question: "Can you take over a project that someone else built?",
    answer:
      "Sometimes. We'll need to review the existing codebase first to understand what we'd be working with. If it's something we can maintain or extend, we'll tell you. If it's not, we'll explain why and discuss alternatives.",
  },
  {
    question: "Do you sign NDAs?",
    answer:
      "Yes. If your project involves confidential information, we're happy to sign an NDA before discussing details.",
  },
  {
    question: "How does the client portal work?",
    answer:
      "Existing clients get access to a private portal where they can view project status, milestones, files, and invoices. Support tickets can be created and tracked through the portal. If you become a client, we'll set up your account and walk you through it.",
  },
];

export default function FAQPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 py-12 lg:py-16">
      <div className="max-w-2xl mb-12">
        <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Frequently asked questions
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Common questions about working with us.
        </p>
      </div>

      <dl className="max-w-3xl divide-y divide-border">
        {faqs.map((faq) => (
          <div key={faq.question} className="py-6 first:pt-0">
            <dt className="font-semibold text-foreground">{faq.question}</dt>
            <dd className="mt-2 text-sm text-muted-foreground leading-relaxed">
              {faq.answer}
            </dd>
          </div>
        ))}
      </dl>

      <div className="mt-12 pt-8 border-t border-border max-w-3xl">
        <p className="text-sm text-muted-foreground">
          Have a question that isn&apos;t here?{" "}
          <a href="mailto:hello@gopangit.com" className="text-primary hover:underline font-medium">
            Send us an email.
          </a>
        </p>
      </div>
    </div>
  );
}
