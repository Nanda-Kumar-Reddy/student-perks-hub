import { useNavigate } from "react-router-dom";
import {
  DollarSign, Users, ShieldCheck, Activity, ArrowUpRight, TrendingUp,
  Store, AlertTriangle, ChevronRight, CheckCircle2, Server, CreditCard,
} from "lucide-react";
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid,
  BarChart, Bar, Legend,
} from "recharts";

const metrics = [
  { label: "Total Revenue (30d)", value: "₹18.4L", delta: "+18.2% MoM", icon: DollarSign, tone: "text-success", bg: "bg-success/10" },
  { label: "Active Users", value: "2,543", delta: "+124 this week", icon: Users, tone: "text-primary", bg: "bg-primary/10" },
  { label: "Pending Approvals", value: "27", delta: "8 high priority", icon: ShieldCheck, tone: "text-warning", bg: "bg-warning/10" },
  { label: "Transactions (30d)", value: "8,420", delta: "+342 today", icon: Activity, tone: "text-accent", bg: "bg-accent/10" },
];

const growth = [
  { m: "Oct", revenue: 920000, users: 1820 },
  { m: "Nov", revenue: 1080000, users: 1980 },
  { m: "Dec", revenue: 1240000, users: 2150 },
  { m: "Jan", revenue: 1410000, users: 2310 },
  { m: "Feb", revenue: 1620000, users: 2440 },
  { m: "Mar", revenue: 1840000, users: 2543 },
];

const serviceHealth = [
  { service: "Accommodation", uses: 412 },
  { service: "Cars", uses: 318 },
  { service: "Pickup", uses: 286 },
  { service: "Jobs", uses: 240 },
  { service: "Consult.", uses: 198 },
  { service: "Events", uses: 156 },
  { service: "Loans", uses: 92 },
];

const moderation = [
  { type: "Vendor", name: "DriveRight School", time: "30m", tone: "bg-primary/10 text-primary" },
  { type: "Listing", name: "Studio near UNSW", time: "1h", tone: "bg-accent/10 text-accent" },
  { type: "Loan", name: "₹40k education loan", time: "2h", tone: "bg-warning/10 text-warning" },
  { type: "Pickup", name: "Airport — SYD T2", time: "3h", tone: "bg-primary/10 text-primary" },
  { type: "Vendor", name: "TaxEasy Accounting", time: "5h", tone: "bg-primary/10 text-primary" },
];

const topVendors = [
  { name: "Bean Counter Café", cat: "F&B", rev: "₹84,200", growth: "+24%" },
  { name: "DriveRight School", cat: "Driving", rev: "₹62,800", growth: "+18%" },
  { name: "TaxEasy", cat: "Accounting", rev: "₹54,100", growth: "+12%" },
  { name: "CityStays", cat: "Accommodation", rev: "₹48,900", growth: "+9%" },
  { name: "QuickRide", cat: "Cars", rev: "₹41,200", growth: "+6%" },
];

const activity = [
  { icon: CheckCircle2, color: "text-success", text: "Vendor DriveRight School approved", time: "12m" },
  { icon: Users, color: "text-primary", text: "5 new student signups today", time: "1h" },
  { icon: CreditCard, color: "text-accent", text: "₹2,400 reward payout processed", time: "2h" },
  { icon: AlertTriangle, color: "text-warning", text: "Listing flagged: Accommodation #L48", time: "3h" },
  { icon: Store, color: "text-primary", text: "Vendor TaxEasy enabled Loans service", time: "5h" },
];

const alerts = [
  { level: "high", text: "Payment gateway latency >800ms", icon: Server },
  { level: "med", text: "3 vendors with KYC documents expiring soon", icon: AlertTriangle },
  { level: "low", text: "Coupon WELCOME20 budget 85% used", icon: AlertTriangle },
];

export default function AdminDashboard() {
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

      {/* Growth + Moderation */}
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2 rounded-xl border border-border bg-card p-5 shadow-card">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-display font-bold flex items-center gap-1.5"><TrendingUp className="h-4 w-4 text-success" /> Platform Growth</h2>
              <p className="text-xs text-muted-foreground">Revenue and user growth · 6 months</p>
            </div>
            <button onClick={() => navigate("/admin/analysis")} className="text-xs font-medium text-primary hover:underline flex items-center gap-1">
              Full analytics <ChevronRight className="h-3 w-3" />
            </button>
          </div>
          <div className="h-60">
            <ResponsiveContainer>
              <AreaChart data={growth} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="adminRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.45} />
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="adminUsr" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--accent))" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="hsl(var(--accent))" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                <XAxis dataKey="m" stroke="hsl(var(--muted-foreground))" fontSize={11} />
                <YAxis yAxisId="l" stroke="hsl(var(--muted-foreground))" fontSize={11} />
                <YAxis yAxisId="r" orientation="right" stroke="hsl(var(--muted-foreground))" fontSize={11} />
                <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Area yAxisId="l" type="monotone" dataKey="revenue" stroke="hsl(var(--primary))" fill="url(#adminRev)" strokeWidth={2} />
                <Area yAxisId="r" type="monotone" dataKey="users" stroke="hsl(var(--accent))" fill="url(#adminUsr)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-5 shadow-card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display font-bold flex items-center gap-1.5"><ShieldCheck className="h-4 w-4 text-warning" /> Moderation Queue</h2>
            <button onClick={() => navigate("/admin/approvals")} className="text-xs font-medium text-primary hover:underline">All</button>
          </div>
          <div className="space-y-2">
            {moderation.map((m) => (
              <div key={m.name} className="flex items-center gap-3 rounded-lg border border-border/60 bg-secondary/30 p-2.5 hover:bg-secondary/60 transition-colors">
                <span className={`rounded-md px-2 py-0.5 text-[10px] font-bold ${m.tone}`}>{m.type}</span>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate">{m.name}</div>
                </div>
                <span className="text-xs text-muted-foreground">{m.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Service Health + Alerts */}
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2 rounded-xl border border-border bg-card p-5 shadow-card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display font-bold">Service Health · Bookings by service (7d)</h2>
          </div>
          <div className="h-48">
            <ResponsiveContainer>
              <BarChart data={serviceHealth} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                <XAxis dataKey="service" stroke="hsl(var(--muted-foreground))" fontSize={11} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} />
                <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }} />
                <Bar dataKey="uses" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-5 shadow-card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display font-bold flex items-center gap-1.5"><AlertTriangle className="h-4 w-4 text-warning" /> System Alerts</h2>
          </div>
          <div className="space-y-2">
            {alerts.map((a) => (
              <div key={a.text} className="flex items-start gap-2.5 rounded-lg border border-border/60 bg-secondary/30 p-3">
                <a.icon className={`h-4 w-4 mt-0.5 flex-shrink-0 ${
                  a.level === "high" ? "text-destructive" : a.level === "med" ? "text-warning" : "text-muted-foreground"
                }`} />
                <div className="text-sm leading-snug">{a.text}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Vendors + Activity */}
      <div className="grid gap-4 lg:grid-cols-5">
        <div className="lg:col-span-3 rounded-xl border border-border bg-card p-5 shadow-card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display font-bold flex items-center gap-1.5"><Store className="h-4 w-4 text-primary" /> Top Vendors</h2>
            <button onClick={() => navigate("/admin/vendors")} className="text-xs font-medium text-primary hover:underline">All</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-xs text-muted-foreground border-b border-border">
                  <th className="text-left font-medium py-2">Vendor</th>
                  <th className="text-left font-medium py-2">Category</th>
                  <th className="text-right font-medium py-2">Revenue</th>
                  <th className="text-right font-medium py-2">Growth</th>
                </tr>
              </thead>
              <tbody>
                {topVendors.map((v) => (
                  <tr key={v.name} className="border-b border-border/40 last:border-0 hover:bg-secondary/40">
                    <td className="py-2.5 font-medium">{v.name}</td>
                    <td className="py-2.5 text-muted-foreground">{v.cat}</td>
                    <td className="py-2.5 text-right font-medium">{v.rev}</td>
                    <td className="py-2.5 text-right text-success font-medium">{v.growth}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="lg:col-span-2 rounded-xl border border-border bg-card p-5 shadow-card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display font-bold">Recent Activity</h2>
          </div>
          <div className="space-y-1">
            {activity.map((a, i) => (
              <div key={i} className="flex items-start gap-3 rounded-lg px-2 py-2 hover:bg-secondary/40 transition-colors">
                <div className={`flex h-7 w-7 items-center justify-center rounded-full bg-secondary flex-shrink-0 ${a.color}`}>
                  <a.icon className="h-3.5 w-3.5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm leading-snug">{a.text}</div>
                  <div className="text-xs text-muted-foreground">{a.time} ago</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
