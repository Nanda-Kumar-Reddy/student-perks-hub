import { useNavigate } from "react-router-dom";
import {
  DollarSign, CalendarCheck, ClipboardList, Package, ArrowUpRight, TrendingUp,
  Eye, Star, Gift, ChevronRight, AlertCircle, MessageSquare,
} from "lucide-react";
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid,
  BarChart, Bar,
} from "recharts";

const metrics = [
  { label: "Revenue (30d)", value: "₹1.24L", delta: "+12.4% vs prev", icon: DollarSign, tone: "text-success", bg: "bg-success/10" },
  { label: "Bookings", value: "86", delta: "+9 this week", icon: CalendarCheck, tone: "text-primary", bg: "bg-primary/10" },
  { label: "Pending Requests", value: "7", delta: "3 high priority", icon: ClipboardList, tone: "text-warning", bg: "bg-warning/10" },
  { label: "Active Listings", value: "14", delta: "2 awaiting approval", icon: Package, tone: "text-accent", bg: "bg-accent/10" },
];

const revenue = [
  { d: "W1", revenue: 18200, bookings: 14 },
  { d: "W2", revenue: 22400, bookings: 19 },
  { d: "W3", revenue: 19800, bookings: 16 },
  { d: "W4", revenue: 28600, bookings: 22 },
  { d: "W5", revenue: 24100, bookings: 18 },
  { d: "W6", revenue: 31200, bookings: 25 },
];

const pending = [
  { name: "Rahul S.", req: "Airport Pickup · SYD T1", time: "10m", priority: "high" },
  { name: "Priya K.", req: "Accommodation enquiry — Studio", time: "1h", priority: "med" },
  { name: "Amit D.", req: "Car rent — 4 days", time: "2h", priority: "high" },
  { name: "Neha P.", req: "Consultation booking", time: "4h", priority: "low" },
];

const listings = [
  { name: "Studio near UNSW", views: 1240, books: 22, rev: "₹48,000" },
  { name: "Toyota Corolla Rental", views: 980, books: 18, rev: "₹36,400" },
  { name: "Airport Pickup — Sedan", views: 820, books: 31, rev: "₹24,800" },
  { name: "Tax Consultation 30min", views: 410, books: 9, rev: "₹13,500" },
];

const customers = [
  { name: "Rahul Sharma", note: "Repeat customer · 4 bookings", amt: "₹4,820" },
  { name: "Priya Kumar", note: "New booking · Accommodation", amt: "₹2,400" },
  { name: "Amit Desai", note: "Left 5★ review", amt: "₹1,180" },
];

const coupons = [
  { code: "WELCOME20", uses: 48, conv: "62%", rev: "₹18,400" },
  { code: "WEEKEND15", uses: 31, conv: "44%", rev: "₹9,200" },
  { code: "STUDENT10", uses: 22, conv: "38%", rev: "₹6,100" },
];

export default function VendorDashboard() {
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

      {/* Revenue + Pending */}
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2 rounded-xl border border-border bg-card p-5 shadow-card">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-display font-bold flex items-center gap-1.5"><TrendingUp className="h-4 w-4 text-success" /> Revenue & Bookings</h2>
              <p className="text-xs text-muted-foreground">Last 6 weeks</p>
            </div>
            <div className="flex gap-2 text-xs">
              <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-primary" /> Revenue</span>
              <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-accent" /> Bookings</span>
            </div>
          </div>
          <div className="h-56">
            <ResponsiveContainer>
              <AreaChart data={revenue} margin={{ top: 5, right: 10, left: -15, bottom: 0 }}>
                <defs>
                  <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                <XAxis dataKey="d" stroke="hsl(var(--muted-foreground))" fontSize={11} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} />
                <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }} />
                <Area type="monotone" dataKey="revenue" stroke="hsl(var(--primary))" fill="url(#rev)" strokeWidth={2} />
                <Area type="monotone" dataKey="bookings" stroke="hsl(var(--accent))" fill="transparent" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-5 shadow-card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display font-bold flex items-center gap-1.5"><AlertCircle className="h-4 w-4 text-warning" /> Pending Actions</h2>
            <button onClick={() => navigate("/vendor/requests")} className="text-xs font-medium text-primary hover:underline flex items-center gap-1">
              All <ChevronRight className="h-3 w-3" />
            </button>
          </div>
          <div className="space-y-2">
            {pending.map((p) => (
              <div key={p.name} className="rounded-lg border border-border/60 bg-secondary/30 p-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium truncate">{p.name}</span>
                  <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${
                    p.priority === "high" ? "bg-destructive/10 text-destructive" :
                    p.priority === "med" ? "bg-warning/10 text-warning" : "bg-muted text-muted-foreground"
                  }`}>{p.priority}</span>
                </div>
                <div className="text-xs text-muted-foreground truncate">{p.req}</div>
                <div className="mt-2 flex gap-2">
                  <button className="flex-1 rounded-md bg-primary px-2 py-1 text-[11px] font-medium text-primary-foreground hover:bg-primary/90">Accept</button>
                  <button className="flex-1 rounded-md border border-border bg-card px-2 py-1 text-[11px] font-medium hover:bg-secondary">Reject</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Listing performance + Customers */}
      <div className="grid gap-4 lg:grid-cols-5">
        <div className="lg:col-span-3 rounded-xl border border-border bg-card p-5 shadow-card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display font-bold">Listing Performance</h2>
            <button onClick={() => navigate("/vendor/services")} className="text-xs font-medium text-primary hover:underline">Manage</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-xs text-muted-foreground border-b border-border">
                  <th className="text-left font-medium py-2">Listing</th>
                  <th className="text-right font-medium py-2"><Eye className="h-3 w-3 inline mr-1" />Views</th>
                  <th className="text-right font-medium py-2">Bookings</th>
                  <th className="text-right font-medium py-2">Revenue</th>
                </tr>
              </thead>
              <tbody>
                {listings.map((l) => (
                  <tr key={l.name} className="border-b border-border/40 last:border-0 hover:bg-secondary/40">
                    <td className="py-2.5 font-medium truncate max-w-[180px]">{l.name}</td>
                    <td className="py-2.5 text-right text-muted-foreground">{l.views.toLocaleString()}</td>
                    <td className="py-2.5 text-right">{l.books}</td>
                    <td className="py-2.5 text-right font-medium text-success">{l.rev}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="lg:col-span-2 rounded-xl border border-border bg-card p-5 shadow-card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display font-bold flex items-center gap-1.5"><MessageSquare className="h-4 w-4 text-primary" /> Recent Customers</h2>
          </div>
          <div className="space-y-3">
            {customers.map((c) => (
              <div key={c.name} className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-bold">
                  {c.name.split(" ").map((n) => n[0]).join("")}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate">{c.name}</div>
                  <div className="text-xs text-muted-foreground truncate">{c.note}</div>
                </div>
                <div className="text-sm font-medium">{c.amt}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Coupon performance */}
      <div className="rounded-xl border border-border bg-card p-5 shadow-card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display font-bold flex items-center gap-1.5"><Gift className="h-4 w-4 text-accent" /> Coupon Performance</h2>
          <button onClick={() => navigate("/vendor/offers")} className="text-xs font-medium text-primary hover:underline">Manage coupons</button>
        </div>
        <div className="grid gap-4 lg:grid-cols-3">
          <div className="lg:col-span-2 h-44">
            <ResponsiveContainer>
              <BarChart data={coupons.map((c) => ({ code: c.code, uses: c.uses }))} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                <XAxis dataKey="code" stroke="hsl(var(--muted-foreground))" fontSize={11} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} />
                <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }} />
                <Bar dataKey="uses" fill="hsl(var(--accent))" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-2">
            {coupons.map((c) => (
              <div key={c.code} className="rounded-lg border border-border/60 bg-secondary/30 p-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold">{c.code}</span>
                  <Star className="h-3 w-3 text-warning fill-warning" />
                </div>
                <div className="mt-1 flex justify-between text-xs text-muted-foreground">
                  <span>{c.uses} uses · {c.conv}</span>
                  <span className="font-medium text-success">{c.rev}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
