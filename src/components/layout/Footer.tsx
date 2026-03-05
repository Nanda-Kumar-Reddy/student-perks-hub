import { Link } from "react-router-dom";
import { Zap } from "lucide-react";

const footerLinks = {
  Platform: [
    { label: "How It Works", href: "/how-it-works" },
    { label: "Vendors", href: "/vendors" },
    { label: "Student Benefits", href: "/students" },
    { label: "FAQ", href: "/faq" },
  ],
  Company: [
    { label: "About", href: "/about" },
    { label: "Blog", href: "/blog" },
    { label: "Contact", href: "/contact" },
    { label: "Careers", href: "/careers" },
  ],
  "For Vendors": [
    { label: "Why Partner?", href: "/for-vendors" },
    { label: "Vendor Signup", href: "/vendor-signup" },
    { label: "Pricing", href: "/pricing" },
  ],
};

export default function Footer() {
  return (
    <footer className="border-t border-border bg-secondary/50">
      <div className="container py-12">
        <div className="grid gap-8 md:grid-cols-4">
          <div>
            <Link to="/" className="flex items-center gap-2 font-display text-lg font-bold">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary">
                <Zap className="h-3.5 w-3.5 text-primary-foreground" />
              </div>
              LifelineAustralia
            </Link>
            <p className="mt-3 text-sm text-muted-foreground">
              Connecting students with local businesses. Earn rewards on every purchase.
            </p>
          </div>
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="mb-3 text-sm font-semibold">{category}</h4>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      to={link.href}
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-10 border-t border-border pt-6 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} LifelineAustralia. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
