import { useState } from "react";
import { BarChart3, TrendingUp, Users, Star, Tag } from "lucide-react";
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { Button } from "@/components/ui/button";

const revenueMonthly = [
  { month: "Oct", revenue: 32000 }, { month: "Nov", revenue: 41000 }, { month: "Dec", revenue: 38000 },
  { month: "Jan", revenue: 45000 }, { month: "Feb", revenue: 52000 }, { month: "Mar", revenue: 48000 },
];
const revenueYearly = [
  { year: "2022", revenue: 320000 }, { year: "2023", revenue: 410000 }, { year: "2024", revenue: 480000 },
  { year: "2025", revenue: 520000 }, { year: "2026", revenue: 175000 },
];

const customerMonthly = [
  { month: "Oct", customers: 120 }, { month: "Nov", customers: 145 }, { month: "Dec", customers: 130 },
  { month: "Jan", customers: 160 }, { month: "Feb", customers: 185 }, { month: "Mar", customers: 170 },
];
const customerYearly = [
  { year: "2022", customers: 980 }, { year: "2023", customers: 1200 }, { year: "2024", customers: 1500 },
  { year: "2025", customers: 1800 }, { year: "2026", customers: 680 },
];

const ratingMonthly = [
  { month: "Oct", rating: 4.2 }, { month: "Nov", rating: 4.4 }, { month: "Dec", rating: 4.3 },
  { month: "Jan", rating: 4.5 }, { month: "Feb", rating: 4.7 }, { month: "Mar", rating: 4.6 },
];
const ratingYearly = [
  { year: "2022", rating: 4.0 }, { year: "2023", rating: 4.2 }, { year: "2024", rating: 4.4 },
  { year: "2025", rating: 4.5 }, { year: "2026", rating: 4.6 },
];

const couponUsage = [
  { name: "20% Off Coffee", value: 340 }, { name: "BOGO Pastries", value: 210 },
  { name: "Student Special", value: 180 }, { name: "Weekend Deal", value: 120 },
];

const COLORS = ["hsl(189,100%,23%)", "hsl(20,94%,55%)", "hsl(40,95%,53%)", "hsl(142,71%,45%)"];

type Period = "monthly" | "yearly";

function PeriodToggle({ period, setPeriod }: { period: Period; setPeriod: (p: Period) => void }) {
  return (
    <div className="flex gap-1">
      <Button variant={period === "monthly" ? "default" : "outline"} size="sm" onClick={() => setPeriod("monthly")} className="text-xs h-7">Monthly</Button>
      <Button variant={period === "yearly" ? "default" : "outline"} size="sm" onClick={() => setPeriod("yearly")} className="text-xs h-7">Yearly</Button>
    </div>
  );
}

export default function AnalyticsPage() {
  const [revPeriod, setRevPeriod] = useState<Period>("monthly");
  const [custPeriod, setCustPeriod] = useState<Period>("monthly");
  const [ratePeriod, setRatePeriod] = useState<Period>("monthly");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold flex items-center gap-2"><BarChart3 className="h-6 w-6 text-primary" /> Analytics</h1>
        <p className="text-sm text-muted-foreground mt-1">Track your business performance</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { icon: <TrendingUp className="h-5 w-5" />, label: "Monthly Revenue", value: "₹48,000", color: "text-primary" },
          { icon: <Users className="h-5 w-5" />, label: "Total Customers", value: "170", color: "text-accent" },
          { icon: <Star className="h-5 w-5" />, label: "Avg Rating", value: "4.6", color: "text-warning" },
          { icon: <Tag className="h-5 w-5" />, label: "Coupons Used", value: "850", color: "text-success" },
        ].map(s => (
          <div key={s.label} className="rounded-xl border border-border bg-card p-5 shadow-card">
            <div className={`mb-2 ${s.color}`}>{s.icon}</div>
            <div className="text-2xl font-display font-bold">{s.value}</div>
            <div className="text-xs text-muted-foreground">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-border bg-card p-5 shadow-card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display font-bold">Revenue</h2>
            <PeriodToggle period={revPeriod} setPeriod={setRevPeriod} />
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={revPeriod === "monthly" ? revenueMonthly : revenueYearly}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(24,20%,88%)" />
              <XAxis dataKey={revPeriod === "monthly" ? "month" : "year"} tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} /><Tooltip />
              <Bar dataKey="revenue" fill="hsl(189,100%,23%)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-xl border border-border bg-card p-5 shadow-card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display font-bold">Customer Visits</h2>
            <PeriodToggle period={custPeriod} setPeriod={setCustPeriod} />
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={custPeriod === "monthly" ? customerMonthly : customerYearly}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(24,20%,88%)" />
              <XAxis dataKey={custPeriod === "monthly" ? "month" : "year"} tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} /><Tooltip />
              <Line type="monotone" dataKey="customers" stroke="hsl(20,94%,55%)" strokeWidth={2} dot={{ fill: "hsl(20,94%,55%)" }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-xl border border-border bg-card p-5 shadow-card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display font-bold">Rating Trend</h2>
            <PeriodToggle period={ratePeriod} setPeriod={setRatePeriod} />
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={ratePeriod === "monthly" ? ratingMonthly : ratingYearly}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(24,20%,88%)" />
              <XAxis dataKey={ratePeriod === "monthly" ? "month" : "year"} tick={{ fontSize: 12 }} />
              <YAxis domain={[3.5, 5]} tick={{ fontSize: 12 }} /><Tooltip />
              <Line type="monotone" dataKey="rating" stroke="hsl(40,95%,53%)" strokeWidth={2} dot={{ fill: "hsl(40,95%,53%)" }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-xl border border-border bg-card p-5 shadow-card">
          <h2 className="font-display font-bold mb-4">Coupon Usage</h2>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={couponUsage} cx="50%" cy="50%" outerRadius={70} dataKey="value" labelLine={false}>
                {couponUsage.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip />
              <Legend wrapperStyle={{ fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
