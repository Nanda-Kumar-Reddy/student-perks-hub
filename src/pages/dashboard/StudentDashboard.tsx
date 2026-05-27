import { useNavigate } from "react-router-dom";
import {
  Calendar, ClipboardList, Briefcase, Wallet, ArrowUpRight, CheckCircle2,
  Clock, AlertCircle, Bell, Sparkles, MapPin, ChevronRight,
} from "lucide-react";
import CouponCarousel from "@/components/CouponCarousel";

const metrics = [
  { label: "Active Bookings", value: "4", delta: "+2 this week", icon: Calendar, tone: "text-primary", bg: "bg-primary/10" },
  { label: "Pending Requests", value: "3", delta: "1 needs action", icon: ClipboardList, tone: "text-warning", bg: "bg-warning/10" },
  { label: "Applied Jobs", value: "7", delta: "2 shortlisted", icon: Briefcase, tone: "text-accent", bg: "bg-accent/10" },
  { label: "Saved via Coupons", value: "₹3,280", delta: "+₹420 this month", icon: Wallet, tone: "text-success", bg: "bg-success/10" },
];

const recentActivity = [
  { icon: CheckCircle2, color: "text-success", title: "Pickup confirmed", meta: "Airport Pickup · Mar 10", time: "2h" },
  { icon: Briefcase, color: "text-accent", title: "Application shortlisted", meta: "Barista @ Bean Counter", time: "5h" },
  { icon: AlertCircle, color: "text-warning", title: "Document required", meta: "Accommodation enquiry #A12", time: "1d" },
  { icon: CheckCircle2, color: "text-success", title: "Consultation booked", meta: "Dr. Williams · Tomorrow 2 PM", time: "1d" },
  { icon: Bell, color: "text-primary", title: "Event registered", meta: "Welcome Week BBQ", time: "2d" },
];

const upcoming = [
  { date: "Mar 10", title: "Airport Pickup", meta: "SYD T1 · 14:30", tag: "Confirmed", tone: "bg-success/10 text-success" },
  { date: "Mar 11", title: "Consultation — Dr. Williams", meta: "Online · 2:00 PM", tag: "Booked", tone: "bg-primary/10 text-primary" },
  { date: "Mar 14", title: "Welcome Week BBQ", meta: "Campus Lawn", tag: "Event", tone: "bg-accent/10 text-accent" },
  { date: "Mar 18", title: "Driving Lesson #3", meta: "DriveRight School", tone: "bg-warning/10 text-warning", tag: "Lesson" },
];

const requests = [
  { service: "Accommodation", title: "Studio near UNSW", status: "Pending", tone: "bg-warning/10 text-warning" },
  { service: "Car Rent", title: "Toyota Corolla · 3 days", status: "Approved", tone: "bg-success/10 text-success" },
  { service: "Loan", title: "Education loan enquiry", status: "Review", tone: "bg-primary/10 text-primary" },
  { service: "Certification", title: "RSA Course", status: "Pending", tone: "bg-warning/10 text-warning" },
];

const recommended = [
  { emoji: "🏠", name: "Premium Sharing — Kensington", meta: "₹680/wk · 4.8★", href: "/student/accommodations" },
  { emoji: "💼", name: "Part-time Cashier — IGA", meta: "₹28/hr · Today", href: "/student/jobs" },
  { emoji: "🚗", name: "Weekend Car Rental Deal", meta: "20% off · Until Sun", href: "/student/cars" },
  { emoji: "🎓", name: "First-Aid Certification", meta: "Starts Mar 20", href: "/student/certifications" },
];

const notifs = [
  { title: "Pickup Confirmed", meta: "Airport Pickup · 2h ago", dot: "bg-success" },
  { title: "New Discount: 20% off rentals", meta: "Coupons · 5h ago", dot: "bg-accent" },
  { title: "Consultation reminder", meta: "Tomorrow 2 PM", dot: "bg-primary" },
];

export default function StudentDashboard() {
  const navigate = useNavigate();

  return (
    <div className="space-y-5">
      {/* Metrics */}
      <div className="grid gap-3 grid-cols-2 lg:grid-cols-4">
        {metrics.map((m) => (
          <div key={m.label} className="rounded-xl border border-border bg-card p-4 shadow-card">
            <div className="flex items-start justify-between">
              <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${m.bg} ${m.tone}`}>
                <m.icon className="h-4 w-4" />
              </div>
              <ArrowUpRight className="h-3.5 w-3.5 text-muted-foreground" />
            </div>
            <div className="mt-3 font-display text-2xl font-bold leading-none">{m.value}</div>
            <div className="mt-1 text-xs text-muted-foreground">{m.label}</div>
            <div className="mt-2 text-[11px] font-medium text-success">{m.delta}</div>
          </div>
        ))}
      </div>

      {/* Coupons */}
      <div className="rounded-xl border border-border bg-card p-4 shadow-card">
        <CouponCarousel />
      </div>

      {/* 3-col grid */}
      <div className="grid gap-4 lg:grid-cols-3">
        {/* Upcoming */}
        <div className="lg:col-span-2 rounded-xl border border-border bg-card p-5 shadow-card">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-display font-bold">Upcoming</h2>
              <p className="text-xs text-muted-foreground">Bookings, events & lessons in your next 14 days</p>
            </div>
            <button onClick={() => navigate("/student/bookings")} className="text-xs font-medium text-primary hover:underline flex items-center gap-1">
              View all <ChevronRight className="h-3 w-3" />
            </button>
          </div>
          <div className="space-y-2">
            {upcoming.map((u) => (
              <div key={u.title} className="flex items-center gap-3 rounded-lg border border-border/60 bg-secondary/30 p-3 hover:bg-secondary/60 transition-colors">
                <div className="flex h-11 w-11 flex-col items-center justify-center rounded-lg bg-card border border-border">
                  <span className="text-[10px] uppercase text-muted-foreground leading-none">{u.date.split(" ")[0]}</span>
                  <span className="font-display text-sm font-bold leading-tight">{u.date.split(" ")[1]}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate">{u.title}</div>
                  <div className="text-xs text-muted-foreground flex items-center gap-1"><MapPin className="h-3 w-3" />{u.meta}</div>
                </div>
                <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-medium ${u.tone}`}>{u.tag}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Notifications */}
        <div className="rounded-xl border border-border bg-card p-5 shadow-card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display font-bold flex items-center gap-1.5"><Bell className="h-4 w-4 text-primary" /> Notifications</h2>
            <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary">3 NEW</span>
          </div>
          <div className="space-y-2.5">
            {notifs.map((n) => (
              <div key={n.title} className="flex gap-3 rounded-lg p-2 hover:bg-secondary/50 transition-colors">
                <div className={`mt-1.5 h-2 w-2 rounded-full ${n.dot} flex-shrink-0`} />
                <div className="min-w-0">
                  <div className="text-sm font-medium truncate">{n.title}</div>
                  <div className="text-xs text-muted-foreground">{n.meta}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Activity + Requests */}
      <div className="grid gap-4 lg:grid-cols-5">
        <div className="lg:col-span-3 rounded-xl border border-border bg-card p-5 shadow-card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display font-bold flex items-center gap-1.5"><Clock className="h-4 w-4 text-primary" /> Recent Activity</h2>
          </div>
          <div className="space-y-1">
            {recentActivity.map((a, i) => (
              <div key={i} className="flex items-center gap-3 rounded-lg px-2 py-2.5 hover:bg-secondary/50 transition-colors">
                <div className={`flex h-8 w-8 items-center justify-center rounded-full bg-secondary ${a.color}`}>
                  <a.icon className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate">{a.title}</div>
                  <div className="text-xs text-muted-foreground truncate">{a.meta}</div>
                </div>
                <span className="text-xs text-muted-foreground">{a.time}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-2 rounded-xl border border-border bg-card p-5 shadow-card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display font-bold">Active Requests</h2>
            <button onClick={() => navigate("/student/bookings")} className="text-xs font-medium text-primary hover:underline">All</button>
          </div>
          <div className="space-y-2">
            {requests.map((r) => (
              <div key={r.title} className="rounded-lg border border-border/60 bg-secondary/30 p-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground">{r.service}</span>
                  <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${r.tone}`}>{r.status}</span>
                </div>
                <div className="text-sm font-medium">{r.title}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recommended */}
      <div className="rounded-xl border border-border bg-card p-5 shadow-card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display font-bold flex items-center gap-1.5"><Sparkles className="h-4 w-4 text-accent" /> Recommended for you</h2>
          <span className="text-xs text-muted-foreground">Based on your activity</span>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {recommended.map((r) => (
            <button
              key={r.name}
              onClick={() => navigate(r.href)}
              className="text-left rounded-xl border border-border bg-secondary/30 p-4 transition-all hover:border-primary/40 hover:shadow-card-hover"
            >
              <div className="text-2xl mb-2">{r.emoji}</div>
              <div className="text-sm font-medium leading-snug line-clamp-2">{r.name}</div>
              <div className="mt-1 text-xs text-muted-foreground">{r.meta}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
