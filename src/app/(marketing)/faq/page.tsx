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
      "We work on websites, business web applications, client portals, internal tools, and technical support for existing systems. The best fit is a project with a clear business problem, a real workflow, and a need for reliable implementation.",
  },
  {
    question: "Do you only build custom software?",
    answer:
      "Not always. If an existing tool is the right choice, we will recommend it. Custom development makes sense when your workflow, access rules, reporting, or integrations cannot be handled properly by off-the-shelf software.",
  },
  {
    question: "How do you price projects?",
    answer:
      "Most projects are quoted after a scoping conversation. Smaller projects can often be priced as a fixed package. Larger systems may be split into phases so the budget, timeline, and deliverables stay clear.",
  },
  {
    question: "How long does a typical project take?",
    answer:
      "A focused business website may take a few weeks. A custom portal or internal system can take longer depending on roles, data, integrations, and approval steps. We give a realistic timeline before work begins.",
  },
  {
    question: "Can you improve or take over an existing system?",
    answer:
      "Yes, if the system is maintainable. We usually start with a technical review so we can understand the codebase, hosting, database, security, and current issues before recommending changes.",
  },
  {
    question: "What happens after launch?",
    answer:
      "We hand over credentials, documentation, and guidance for using the system. If you want ongoing support, we can provide maintenance, updates, bug fixes, monitoring, and small improvements after launch.",
  },
  {
    question: "Do you work remotely?",
    answer:
      "Yes. Most project communication can happen through email, calls, shared documents, and the client portal. We keep updates organized so clients can follow progress without constant meetings.",
  },
  {
    question: "How does the client portal work?",
    answer:
      "Active clients can use the portal to view project information, tickets, invoices, and shared updates. It keeps project communication more organized than scattered email threads.",
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
          Straight answers about scope, pricing, support, and how projects are
          handled.
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
          Have a question that is not answered here?{" "}
          <a
            href="mailto:hello@gopangit.com"
            className="text-primary hover:underline font-medium"
          >
            Send us an email.
          </a>
        </p>
      </div>
    </div>
  );
}
