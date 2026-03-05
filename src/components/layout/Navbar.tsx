import { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, Zap, Sun, Moon, Tag, ChevronDown } from "lucide-react";
import { useTheme } from "@/hooks/useTheme";
import DiscountsModal from "@/components/DiscountsModal";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "How It Works", href: "/how-it-works" },
  { label: "Vendors", href: "/vendors" },
  { label: "About Us", href: "/about" },
];

const discountCategories = [
  "Lifeline Liquor",
  "Lifeline Airport",
  "Lifeline Car",
  "Lifeline Accounting",
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [discountDropdown, setDiscountDropdown] = useState(false);
  const [discountsModalOpen, setDiscountsModalOpen] = useState(false);
  const [selectedDiscountCategory, setSelectedDiscountCategory] = useState("Lifeline Liquor");
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDiscountDropdown(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const openDiscountModal = (category: string) => {
    setSelectedDiscountCategory(category);
    setDiscountDropdown(false);
    setDiscountsModalOpen(true);
  };

  return (
    <>
      <DiscountsModal
        open={discountsModalOpen}
        onOpenChange={setDiscountsModalOpen}
        initialCategory={selectedDiscountCategory}
      />
      <header className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
        <div className="container flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-2 font-display text-xl font-bold">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <Zap className="h-4 w-4 text-primary-foreground" />
            </div>
            <span>LifelineAustralia</span>
          </Link>

          <nav className="hidden items-center gap-1 md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-secondary ${
                  location.pathname === link.href
                    ? "text-primary"
                    : "text-muted-foreground"
                }`}
              >
                {link.label}
              </Link>
            ))}
            {/* Discounts Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDiscountDropdown(!discountDropdown)}
                className="flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary"
              >
                <Tag className="h-3.5 w-3.5" />
                Discounts
                <ChevronDown className={`h-3 w-3 transition-transform ${discountDropdown ? "rotate-180" : ""}`} />
              </button>
              {discountDropdown && (
                <div className="absolute right-0 top-full mt-1 w-52 rounded-xl border border-border bg-card p-1.5 shadow-card-hover z-50">
                  {discountCategories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => openDiscountModal(cat)}
                      className="w-full rounded-lg px-3 py-2 text-left text-sm font-medium transition-colors hover:bg-secondary"
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </nav>

          <div className="hidden items-center gap-3 md:flex">
            <button
              onClick={toggleTheme}
              className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/login">Log in</Link>
            </Button>
            <Button size="sm" asChild>
              <Link to="/signup">Get Started</Link>
            </Button>
          </div>

          <div className="flex items-center gap-2 md:hidden">
            <button
              onClick={toggleTheme}
              className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-secondary"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
            <button
              onClick={() => setOpen(!open)}
              aria-label="Toggle menu"
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {open && (
          <div className="border-t border-border bg-background p-4 md:hidden">
            <nav className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  onClick={() => setOpen(false)}
                  className={`rounded-lg px-3 py-2 text-sm font-medium hover:bg-secondary ${
                    location.pathname === link.href ? "text-primary" : ""
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <button
                onClick={() => {
                  setOpen(false);
                  setDiscountsModalOpen(true);
                }}
                className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium hover:bg-secondary text-left"
              >
                <Tag className="h-3.5 w-3.5" /> Discounts
              </button>
              <hr className="my-2 border-border" />
              <Link to="/login" onClick={() => setOpen(false)} className="rounded-lg px-3 py-2 text-sm font-medium hover:bg-secondary">
                Log in
              </Link>
              <Button size="sm" asChild>
                <Link to="/signup" onClick={() => setOpen(false)}>Get Started</Link>
              </Button>
            </nav>
          </div>
        )}
      </header>
    </>
  );
}
