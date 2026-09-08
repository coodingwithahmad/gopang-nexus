import Link from "next/link";
import { siteConfig } from "@/config/site";
import { marketingNav } from "@/config/nav";

const footerLinks = {
  Services: [
    { label: "Web Development", href: "/services/web-development" },
    { label: "Business Applications", href: "/services/business-applications" },
    { label: "IT Consulting", href: "/services/it-consulting" },
    { label: "Maintenance & Support", href: "/services/maintenance-support" },
  ],
  Company: marketingNav.map((item) => ({
    label: item.label,
    href: item.href,
  })),
  Portal: [
    { label: "Client Login", href: "/login" },
    { label: "Get a Consultation", href: "/consultation" },
    { label: "FAQ", href: "/faq" },
  ],
};

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-muted/30 mt-auto">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-12 lg:py-16">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand column */}
          <div className="lg:col-span-1">
            <Link
              href="/"
              className="font-semibold text-foreground tracking-tight"
            >
              {siteConfig.shortName}
              <span className="text-primary">.</span>
            </Link>
            <p className="mt-3 text-sm text-muted-foreground leading-relaxed max-w-xs">
              IT solutions for businesses that need software they can actually
              use and maintain.
            </p>
            <p className="mt-4 text-sm text-muted-foreground">
              <a
                href={`mailto:${siteConfig.contactEmail}`}
                className="hover:text-foreground transition-colors"
              >
                {siteConfig.contactEmail}
              </a>
            </p>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h3 className="text-sm font-semibold text-foreground mb-3">
                {title}
              </h3>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-muted-foreground">
          <p>
            &copy; {year} {siteConfig.name}. All rights reserved.
          </p>
          <div className="flex gap-4">
            <Link href="/privacy" className="hover:text-foreground transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-foreground transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
