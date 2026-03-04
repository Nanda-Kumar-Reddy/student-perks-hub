import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import PublicLayout from "./components/layout/PublicLayout";
import DashboardLayout from "./components/layout/DashboardLayout";
import HomePage from "./pages/HomePage";
import VendorsPage from "./pages/VendorsPage";
import HowItWorksPage from "./pages/HowItWorksPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import StudentDashboard from "./pages/dashboard/StudentDashboard";
import VendorDashboard from "./pages/dashboard/VendorDashboard";
import AdminDashboard from "./pages/dashboard/AdminDashboard";
import NotFound from "./pages/NotFound";
import {
  LayoutDashboard, Compass, History, Gift, Settings, Users,
  QrCode, BarChart3, Store, ShieldCheck, FileText, Activity
} from "lucide-react";

const queryClient = new QueryClient();

const studentNav = [
  { label: "Dashboard", href: "/student", icon: <LayoutDashboard className="h-4 w-4" /> },
  { label: "Discover", href: "/student/discover", icon: <Compass className="h-4 w-4" /> },
  { label: "Transactions", href: "/student/transactions", icon: <History className="h-4 w-4" /> },
  { label: "Rewards", href: "/student/rewards", icon: <Gift className="h-4 w-4" /> },
  { label: "Settings", href: "/student/settings", icon: <Settings className="h-4 w-4" /> },
];

const vendorNav = [
  { label: "Dashboard", href: "/vendor", icon: <LayoutDashboard className="h-4 w-4" /> },
  { label: "Verify Transaction", href: "/vendor/verify", icon: <QrCode className="h-4 w-4" /> },
  { label: "Manage Offers", href: "/vendor/offers", icon: <Gift className="h-4 w-4" /> },
  { label: "Analytics", href: "/vendor/analytics", icon: <BarChart3 className="h-4 w-4" /> },
  { label: "Settings", href: "/vendor/settings", icon: <Settings className="h-4 w-4" /> },
];

const adminNav = [
  { label: "Dashboard", href: "/admin", icon: <LayoutDashboard className="h-4 w-4" /> },
  { label: "Vendor Approvals", href: "/admin/approvals", icon: <ShieldCheck className="h-4 w-4" /> },
  { label: "Users", href: "/admin/users", icon: <Users className="h-4 w-4" /> },
  { label: "Vendors", href: "/admin/vendors", icon: <Store className="h-4 w-4" /> },
  { label: "Transactions", href: "/admin/transactions", icon: <Activity className="h-4 w-4" /> },
  { label: "Reports", href: "/admin/reports", icon: <FileText className="h-4 w-4" /> },
];

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Public */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/vendors" element={<VendorsPage />} />
            <Route path="/how-it-works" element={<HowItWorksPage />} />
          </Route>

          {/* Auth */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />

          {/* Student Dashboard */}
          <Route element={<DashboardLayout title="Student Portal" navItems={studentNav} />}>
            <Route path="/student" element={<StudentDashboard />} />
          </Route>

          {/* Vendor Dashboard */}
          <Route element={<DashboardLayout title="Vendor Portal" navItems={vendorNav} />}>
            <Route path="/vendor" element={<VendorDashboard />} />
          </Route>

          {/* Admin Dashboard */}
          <Route element={<DashboardLayout title="Admin Panel" navItems={adminNav} />}>
            <Route path="/admin" element={<AdminDashboard />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
