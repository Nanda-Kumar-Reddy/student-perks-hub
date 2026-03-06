import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import PublicLayout from "./components/layout/PublicLayout";
import DashboardLayout from "./components/layout/DashboardLayout";
import HomePage from "./pages/HomePage";
import VendorsPage from "./pages/VendorsPage";
import HowItWorksPage from "./pages/HowItWorksPage";
import AboutPage from "./pages/AboutPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import StudentDashboard from "./pages/dashboard/StudentDashboard";
import VendorDashboard from "./pages/dashboard/VendorDashboard";
import AdminDashboard from "./pages/dashboard/AdminDashboard";
import NotFound from "./pages/NotFound";
import {
  LayoutDashboard, Plane, Home, Car, Briefcase, FileText, DollarSign,
  Users, Calculator, CarFront, CalendarDays, CalendarCheck, User,
  Award, QrCode, BarChart3, Gift, Settings, Store, Activity
} from "lucide-react";

// Lazy load student feature pages
const AirportPickupPage = lazy(() => import("./pages/dashboard/student/AirportPickupPage"));
const AccommodationsPage = lazy(() => import("./pages/dashboard/student/AccommodationsPage"));
const AccommodationDetailPage = lazy(() => import("./pages/dashboard/student/AccommodationDetailPage"));
const CarRentPage = lazy(() => import("./pages/dashboard/student/CarRentPage"));
const CarDetailPage = lazy(() => import("./pages/dashboard/student/CarDetailPage"));
const JobsPage = lazy(() => import("./pages/dashboard/student/JobsPage"));
const JobDetailPage = lazy(() => import("./pages/dashboard/student/JobDetailPage"));
const ResumeBuilderPage = lazy(() => import("./pages/dashboard/student/ResumeBuilderPage"));
const LoansPage = lazy(() => import("./pages/dashboard/student/LoansPage"));
const ConsultationsPage = lazy(() => import("./pages/dashboard/student/ConsultationsPage"));
const ConsultantDetailPage = lazy(() => import("./pages/dashboard/student/ConsultantDetailPage"));
const AccountingPage = lazy(() => import("./pages/dashboard/student/AccountingPage"));
const AccountingDetailPage = lazy(() => import("./pages/dashboard/student/AccountingDetailPage"));
const DrivingLicencePage = lazy(() => import("./pages/dashboard/student/DrivingLicencePage"));
const DrivingLicenceDetailPage = lazy(() => import("./pages/dashboard/student/DrivingLicenceDetailPage"));
const EventsPage = lazy(() => import("./pages/dashboard/student/EventsPage"));
const EventDetailPage = lazy(() => import("./pages/dashboard/student/EventDetailPage"));
const MyBookingsPage = lazy(() => import("./pages/dashboard/student/MyBookingsPage"));
const ProfilePage = lazy(() => import("./pages/dashboard/student/ProfilePage"));
const CertificationsPage = lazy(() => import("./pages/dashboard/student/CertificationsPage"));
const CertificationDetailPage = lazy(() => import("./pages/dashboard/student/CertificationDetailPage"));

// Lazy load vendor pages
const VerifyTransactionPage = lazy(() => import("./pages/dashboard/vendor/VerifyTransactionPage"));
const ManageOffersPage = lazy(() => import("./pages/dashboard/vendor/ManageOffersPage"));
const VendorAnalyticsPage = lazy(() => import("./pages/dashboard/vendor/AnalyticsPage"));
const VendorSettingsPage = lazy(() => import("./pages/dashboard/vendor/SettingsPage"));

// Lazy load admin pages
const AdminUsersPage = lazy(() => import("./pages/dashboard/admin/UsersPage"));
const AdminVendorsPage = lazy(() => import("./pages/dashboard/admin/VendorsPage"));
const AdminTransactionsPage = lazy(() => import("./pages/dashboard/admin/TransactionsPage"));
const AdminAnalysisPage = lazy(() => import("./pages/dashboard/admin/AnalysisPage"));

const queryClient = new QueryClient();

const studentNav = [
  { label: "Dashboard", href: "/student", icon: <LayoutDashboard className="h-4 w-4" /> },
  { label: "Airport Pickup", href: "/student/airport-pickup", icon: <Plane className="h-4 w-4" /> },
  { label: "Accommodations", href: "/student/accommodations", icon: <Home className="h-4 w-4" /> },
  { label: "Car Rent/Sale", href: "/student/cars", icon: <Car className="h-4 w-4" /> },
  { label: "Jobs", href: "/student/jobs", icon: <Briefcase className="h-4 w-4" /> },
  { label: "Resume Builder", href: "/student/resume-builder", icon: <FileText className="h-4 w-4" /> },
  { label: "Loans", href: "/student/loans", icon: <DollarSign className="h-4 w-4" /> },
  { label: "1:1 Consultations", href: "/student/consultations", icon: <Users className="h-4 w-4" /> },
  { label: "Accounting Service", href: "/student/accounting", icon: <Calculator className="h-4 w-4" /> },
  { label: "Driving Licence", href: "/student/driving-licence", icon: <CarFront className="h-4 w-4" /> },
  { label: "Events", href: "/student/events", icon: <CalendarDays className="h-4 w-4" /> },
  { label: "My Bookings", href: "/student/bookings", icon: <CalendarCheck className="h-4 w-4" /> },
  { label: "Certifications", href: "/student/certifications", icon: <Award className="h-4 w-4" /> },
  { label: "Profile", href: "/student/profile", icon: <User className="h-4 w-4" /> },
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
  { label: "Users", href: "/admin/users", icon: <Users className="h-4 w-4" /> },
  { label: "Vendors", href: "/admin/vendors", icon: <Store className="h-4 w-4" /> },
  { label: "Transactions", href: "/admin/transactions", icon: <Activity className="h-4 w-4" /> },
  { label: "Analysis", href: "/admin/analysis", icon: <BarChart3 className="h-4 w-4" /> },
];

const studentNotifications = [
  { id: "1", title: "Pickup Confirmed", message: "Your airport pickup for March 10 has been confirmed.", time: "2h ago", read: false },
  { id: "2", title: "New Discount!", message: "20% off car rentals this week — check it out!", time: "5h ago", read: false },
  { id: "3", title: "Consultation Reminder", message: "Your session with Dr. Williams is tomorrow at 2 PM.", time: "1d ago", read: true },
  { id: "4", title: "Event Coming Up", message: "Welcome Week BBQ is this Saturday!", time: "2d ago", read: true },
];

const vendorNotifications = [
  { id: "1", title: "New Booking", message: "A student has booked a consultation session.", time: "1h ago", read: false },
  { id: "2", title: "Service Request", message: "New airport pickup request submitted.", time: "3h ago", read: false },
  { id: "3", title: "Customer Inquiry", message: "Question about your tax return service.", time: "1d ago", read: true },
];

const adminNotifications = [
  { id: "1", title: "New Vendor Registration", message: "DriveRight School has applied to join the platform.", time: "30m ago", read: false },
  { id: "2", title: "System Alert", message: "347 transactions processed today — all clear.", time: "2h ago", read: false },
  { id: "3", title: "Activity Spike", message: "Unusual activity detected on vendor TaxEasy.", time: "1d ago", read: true },
];

const Loading = () => <div className="flex items-center justify-center py-20 text-muted-foreground">Loading...</div>;

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
            <Route path="/about" element={<AboutPage />} />
          </Route>

          {/* Auth */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />

          {/* Student Dashboard */}
          <Route element={<DashboardLayout title="Student Portal" navItems={studentNav} notifications={studentNotifications} showDiscounts />}>
            <Route path="/student" element={<StudentDashboard />} />
            <Route path="/student/airport-pickup" element={<Suspense fallback={<Loading />}><AirportPickupPage /></Suspense>} />
            <Route path="/student/accommodations" element={<Suspense fallback={<Loading />}><AccommodationsPage /></Suspense>} />
            <Route path="/student/accommodations/:id" element={<Suspense fallback={<Loading />}><AccommodationDetailPage /></Suspense>} />
            <Route path="/student/cars" element={<Suspense fallback={<Loading />}><CarRentPage /></Suspense>} />
            <Route path="/student/cars/:id" element={<Suspense fallback={<Loading />}><CarDetailPage /></Suspense>} />
            <Route path="/student/jobs" element={<Suspense fallback={<Loading />}><JobsPage /></Suspense>} />
            <Route path="/student/jobs/:id" element={<Suspense fallback={<Loading />}><JobDetailPage /></Suspense>} />
            <Route path="/student/resume-builder" element={<Suspense fallback={<Loading />}><ResumeBuilderPage /></Suspense>} />
            <Route path="/student/loans" element={<Suspense fallback={<Loading />}><LoansPage /></Suspense>} />
            <Route path="/student/consultations" element={<Suspense fallback={<Loading />}><ConsultationsPage /></Suspense>} />
            <Route path="/student/consultations/:id" element={<Suspense fallback={<Loading />}><ConsultantDetailPage /></Suspense>} />
            <Route path="/student/accounting" element={<Suspense fallback={<Loading />}><AccountingPage /></Suspense>} />
            <Route path="/student/accounting/:id" element={<Suspense fallback={<Loading />}><AccountingDetailPage /></Suspense>} />
            <Route path="/student/driving-licence" element={<Suspense fallback={<Loading />}><DrivingLicencePage /></Suspense>} />
            <Route path="/student/driving-licence/:id" element={<Suspense fallback={<Loading />}><DrivingLicenceDetailPage /></Suspense>} />
            <Route path="/student/events" element={<Suspense fallback={<Loading />}><EventsPage /></Suspense>} />
            <Route path="/student/events/:id" element={<Suspense fallback={<Loading />}><EventDetailPage /></Suspense>} />
            <Route path="/student/bookings" element={<Suspense fallback={<Loading />}><MyBookingsPage /></Suspense>} />
            <Route path="/student/certifications" element={<Suspense fallback={<Loading />}><CertificationsPage /></Suspense>} />
            <Route path="/student/certifications/:id" element={<Suspense fallback={<Loading />}><CertificationDetailPage /></Suspense>} />
            <Route path="/student/profile" element={<Suspense fallback={<Loading />}><ProfilePage /></Suspense>} />
          </Route>

          {/* Vendor Dashboard */}
          <Route element={<DashboardLayout title="Vendor Portal" navItems={vendorNav} notifications={vendorNotifications} />}>
            <Route path="/vendor" element={<VendorDashboard />} />
            <Route path="/vendor/verify" element={<Suspense fallback={<Loading />}><VerifyTransactionPage /></Suspense>} />
            <Route path="/vendor/offers" element={<Suspense fallback={<Loading />}><ManageOffersPage /></Suspense>} />
            <Route path="/vendor/analytics" element={<Suspense fallback={<Loading />}><VendorAnalyticsPage /></Suspense>} />
            <Route path="/vendor/settings" element={<Suspense fallback={<Loading />}><VendorSettingsPage /></Suspense>} />
          </Route>

          {/* Admin Dashboard */}
          <Route element={<DashboardLayout title="Admin Panel" navItems={adminNav} notifications={adminNotifications} />}>
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/users" element={<Suspense fallback={<Loading />}><AdminUsersPage /></Suspense>} />
            <Route path="/admin/vendors" element={<Suspense fallback={<Loading />}><AdminVendorsPage /></Suspense>} />
            <Route path="/admin/transactions" element={<Suspense fallback={<Loading />}><AdminTransactionsPage /></Suspense>} />
            <Route path="/admin/analysis" element={<Suspense fallback={<Loading />}><AdminAnalysisPage /></Suspense>} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
