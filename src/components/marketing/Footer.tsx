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
    <footer className="border-t border-border bg-muted/20 mt-auto">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-8">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
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
              Websites, business applications, and IT support for companies
              that need practical systems built with care.
            </p>
            <p className="mt-3 text-sm text-muted-foreground">
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
              <ul className="space-y-1.5">
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

        <div className="mt-8 pt-5 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
          <p>&copy; {year} GOPANG.</p>
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
