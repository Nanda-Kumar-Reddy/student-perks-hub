import { useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { Zap, LogOut, Menu, Sun, Moon, Tag, ChevronDown, User, Store, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useTheme } from "@/hooks/useTheme";
import NotificationDropdown, { type Notification } from "@/components/NotificationDropdown";
import DiscountsModal from "@/components/DiscountsModal";
import FloatingButtons from "@/components/FloatingButtons";

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
}

interface DashboardLayoutProps {
  title: string;
  navItems: NavItem[];
  notifications?: Notification[];
  showDiscounts?: boolean;
  showFloatingButtons?: boolean;
}

const discountCategories = [
  "Lifeline Liquor",
  "Lifeline Airport",
  "Lifeline Car",
  "Lifeline Accounting",
];

// Derive role from title
function getRoleInfo(title: string) {
  if (title.toLowerCase().includes("vendor")) return { role: "vendor", icon: <Store className="h-4 w-4" />, name: "Joe" };
  if (title.toLowerCase().includes("admin")) return { role: "admin", icon: <ShieldCheck className="h-4 w-4" />, name: "Admin" };
  return { role: "student", icon: <User className="h-4 w-4" />, name: "John" };
}

export default function DashboardLayout({ title, navItems, notifications = [], showDiscounts = false, showFloatingButtons = false }: DashboardLayoutProps) {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const [discountDropdown, setDiscountDropdown] = useState(false);
  const [discountsModalOpen, setDiscountsModalOpen] = useState(false);
  const [selectedDiscountCategory, setSelectedDiscountCategory] = useState("Lifeline Liquor");
  const [profileDropdown, setProfileDropdown] = useState(false);

  const roleInfo = getRoleInfo(title);

  const openDiscountModal = (category: string) => {
    setSelectedDiscountCategory(category);
    setDiscountDropdown(false);
    setDiscountsModalOpen(true);
  };

  const NavLinks = () => (
    <>
      {navItems.map((item) => (
        <Link
          key={item.href}
          to={item.href}
          onClick={() => setSidebarOpen(false)}
          className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
            location.pathname === item.href
              ? "bg-primary/10 text-primary"
              : "text-muted-foreground hover:bg-secondary hover:text-foreground"
          }`}
        >
          {item.icon}
          {item.label}
        </Link>
      ))}
    </>
  );

  return (
    <div className="flex h-screen overflow-hidden">
      <DiscountsModal
        open={discountsModalOpen}
        onOpenChange={setDiscountsModalOpen}
        initialCategory={selectedDiscountCategory}
      />

      {/* Desktop Sidebar */}
      <aside className="hidden w-64 flex-shrink-0 border-r border-border bg-card lg:flex lg:flex-col h-screen">
        <div className="flex h-16 items-center gap-2 border-b border-border px-6 flex-shrink-0">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary">
            <Zap className="h-3.5 w-3.5 text-primary-foreground" />
          </div>
          <span className="font-display text-sm font-bold">{title}</span>
        </div>
        <nav className="flex-1 space-y-1 overflow-y-auto p-3">
          <NavLinks />
        </nav>
        {/* Bottom user display */}
        <div className="border-t border-border p-3 flex-shrink-0">
          <div className="flex items-center gap-3 rounded-lg px-3 py-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
              {roleInfo.icon}
            </div>
            <span className="text-sm font-medium">{roleInfo.name}</span>
          </div>
        </div>
      </aside>

      {/* Mobile Sidebar Sheet */}
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetContent side="left" className="w-64 p-0">
          <SheetHeader className="flex h-16 flex-row items-center gap-2 border-b border-border px-6">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary">
              <Zap className="h-3.5 w-3.5 text-primary-foreground" />
            </div>
            <SheetTitle className="font-display text-sm font-bold">{title}</SheetTitle>
          </SheetHeader>
          <nav className="flex-1 space-y-1 overflow-y-auto p-3">
            <NavLinks />
          </nav>
          <div className="border-t border-border p-3">
            <div className="flex items-center gap-3 rounded-lg px-3 py-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                {roleInfo.icon}
              </div>
              <span className="text-sm font-medium">{roleInfo.name}</span>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Main content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="flex h-16 items-center justify-between border-b border-border bg-card px-6 flex-shrink-0">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="rounded-lg p-2 text-muted-foreground hover:bg-secondary lg:hidden"
              aria-label="Open sidebar"
            >
              <Menu className="h-5 w-5" />
            </button>
            <h1 className="font-display text-lg font-bold">{title}</h1>
          </div>
          <div className="flex items-center gap-2">
            {showDiscounts && (
              <div className="relative">
                <button
                  onClick={() => setDiscountDropdown(!discountDropdown)}
                  className="flex items-center gap-1 rounded-lg px-2.5 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                >
                  <Tag className="h-4 w-4" />
                  <span className="hidden sm:inline">Discounts</span>
                  <ChevronDown className={`h-3 w-3 transition-transform ${discountDropdown ? "rotate-180" : ""}`} />
                </button>
                {discountDropdown && (
                  <div className="absolute right-0 top-full mt-1 w-52 rounded-xl border border-border bg-card p-1.5 shadow-card-hover z-50 animate-scale-in">
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
            )}

            <NotificationDropdown notifications={notifications} />

            <button
              onClick={toggleTheme}
              className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>

            {/* Profile icon only - dropdown */}
            <div className="relative">
              <button
                onClick={() => setProfileDropdown(!profileDropdown)}
                className="flex items-center rounded-lg p-1 transition-colors hover:bg-secondary"
              >
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
                  <User className="h-4 w-4" />
                </div>
              </button>
              {profileDropdown && (
                <div className="absolute right-0 top-full mt-1 w-40 rounded-xl border border-border bg-card p-1.5 shadow-card-hover z-50 animate-scale-in">
                  <Link
                    to="/"
                    onClick={() => setProfileDropdown(false)}
                    className="flex items-center gap-2 w-full rounded-lg px-3 py-2 text-left text-sm font-medium text-destructive transition-colors hover:bg-destructive/10"
                  >
                    <LogOut className="h-4 w-4" />
                    Sign Out
                  </Link>
                </div>
              )}
            </div>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto overflow-x-hidden bg-secondary/30 p-6">
          <Outlet />
        </main>
      </div>

      {showFloatingButtons && <FloatingButtons />}
    </div>
  );
}
