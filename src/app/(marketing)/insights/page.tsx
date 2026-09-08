import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Insights | GOPANG IT SOLUTION",
  description: "Read our latest thoughts on software engineering, business tools, and technology.",
};

const insights = [
  {
    id: 1,
    title: "Why You Need a Client Portal (and How to Build One)",
    date: "March 12, 2024",
    category: "Business Strategy",
    summary: "A client portal reduces support emails by 60% and gives your customers a professional dashboard to track progress. Here is the technical breakdown of how we build them securely.",
    slug: "why-you-need-a-client-portal",
  },
  {
    id: 2,
    title: "Choosing the Right Database for Your Project",
    date: "February 28, 2024",
    category: "Engineering",
    summary: "PostgreSQL vs NoSQL? We explore real-world scenarios to help you understand which database architecture makes sense for your application's specific scaling needs.",
    slug: "choosing-right-database",
  },
  {
    id: 3,
    title: "Securing Your API: Best Practices",
    date: "February 10, 2024",
    category: "Security",
    summary: "Authentication is only the first step. Learn how to implement proper Row Level Security, rate limiting, and input validation to protect your digital infrastructure.",
    slug: "securing-your-api-best-practices",
  },
];

export default function InsightsPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 py-16 lg:py-24">
      <div className="max-w-2xl mb-16">
        <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
          Insights
        </h1>
        <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
          Technical breakdowns, engineering strategies, and thoughts on building software that solves actual business problems.
        </p>
      </div>

      {insights.length === 0 ? (
        <div className="rounded-lg border border-border bg-muted/30 p-12 text-center">
          <p className="text-muted-foreground">
            We're writing about our work. Check back soon for updates.
          </p>
        </div>
      ) : (
        <div className="grid gap-8 lg:grid-cols-2">
          {insights.map((post) => (
            <article 
              key={post.id} 
              className="group relative flex flex-col items-start justify-between rounded-2xl border border-border bg-background p-6 sm:p-8 shadow-sm transition-all hover:shadow-md hover:border-primary/20"
            >
              <div className="flex items-center gap-x-4 text-xs">
                <time dateTime={post.date} className="text-muted-foreground">
                  {post.date}
                </time>
                <span className="relative z-10 rounded-full bg-muted px-3 py-1.5 font-medium text-foreground">
                  {post.category}
                </span>
              </div>
              
              <div className="group relative mt-6">
                <h3 className="text-xl font-semibold leading-tight text-foreground group-hover:text-primary transition-colors">
                  <Link href={`/insights#`}>
                    <span className="absolute inset-0" />
                    {post.title}
                  </Link>
                </h3>
                <p className="mt-4 line-clamp-3 text-sm leading-relaxed text-muted-foreground">
                  {post.summary}
                </p>
              </div>
              
              <div className="mt-8 flex items-center text-sm font-medium text-primary">
                Read full article <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
