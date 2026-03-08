import { useState } from "react";
import { FileText, TrendingUp, Users, Store } from "lucide-react";
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { Button } from "@/components/ui/button";

const revenueMonthly = [
  { month: "Oct", revenue: 120000 }, { month: "Nov", revenue: 145000 }, { month: "Dec", revenue: 132000 },
  { month: "Jan", revenue: 168000 }, { month: "Feb", revenue: 185000 }, { month: "Mar", revenue: 175000 },
];
const revenueYearly = [
  { year: "2022", revenue: 980000 }, { year: "2023", revenue: 1200000 }, { year: "2024", revenue: 1500000 },
  { year: "2025", revenue: 1800000 }, { year: "2026", revenue: 750000 },
];

const usersMonthly = [
  { month: "Oct", users: 420 }, { month: "Nov", users: 480 }, { month: "Dec", users: 510 },
  { month: "Jan", users: 550 }, { month: "Feb", users: 490 }, { month: "Mar", users: 580 },
];
const usersYearly = [
  { year: "2022", users: 800 }, { year: "2023", users: 1200 }, { year: "2024", users: 1800 },
  { year: "2025", users: 2200 }, { year: "2026", users: 2543 },
];

const vendorsMonthly = [
  { month: "Oct", vendors: 120 }, { month: "Nov", vendors: 135 }, { month: "Dec", vendors: 150 },
  { month: "Jan", vendors: 160 }, { month: "Feb", vendors: 172 }, { month: "Mar", vendors: 182 },
];
const vendorsYearly = [
  { year: "2022", vendors: 40 }, { year: "2023", vendors: 75 }, { year: "2024", vendors: 110 },
  { year: "2025", vendors: 155 }, { year: "2026", vendors: 182 },
];

const categoryDist = [
  { name: "Food & Drinks", value: 45 }, { name: "Services", value: 25 },
  { name: "Education", value: 18 }, { name: "Health", value: 12 },
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

export default function AnalysisPage() {
  const [revPeriod, setRevPeriod] = useState<Period>("monthly");
  const [userPeriod, setUserPeriod] = useState<Period>("monthly");
  const [vendorPeriod, setVendorPeriod] = useState<Period>("monthly");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold flex items-center gap-2"><FileText className="h-6 w-6 text-primary" /> Analysis</h1>
        <p className="text-sm text-muted-foreground mt-1">Platform performance insights</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { icon: <TrendingUp className="h-5 w-5" />, label: "Platform Revenue", value: "₹1.75L", color: "text-primary" },
          { icon: <Users className="h-5 w-5" />, label: "Active Students", value: "580", color: "text-accent" },
          { icon: <Store className="h-5 w-5" />, label: "Active Vendors", value: "182", color: "text-success" },
          { icon: <FileText className="h-5 w-5" />, label: "Daily Transactions", value: "347", color: "text-warning" },
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
            <h2 className="font-display font-bold">Platform Revenue</h2>
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
            <h2 className="font-display font-bold">Number of Users</h2>
            <PeriodToggle period={userPeriod} setPeriod={setUserPeriod} />
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={userPeriod === "monthly" ? usersMonthly : usersYearly}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(24,20%,88%)" />
              <XAxis dataKey={userPeriod === "monthly" ? "month" : "year"} tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} /><Tooltip />
              <Line type="monotone" dataKey="users" stroke="hsl(20,94%,55%)" strokeWidth={2} dot={{ fill: "hsl(20,94%,55%)" }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-xl border border-border bg-card p-5 shadow-card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display font-bold">Number of Vendors</h2>
            <PeriodToggle period={vendorPeriod} setPeriod={setVendorPeriod} />
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={vendorPeriod === "monthly" ? vendorsMonthly : vendorsYearly}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(24,20%,88%)" />
              <XAxis dataKey={vendorPeriod === "monthly" ? "month" : "year"} tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} /><Tooltip />
              <Line type="monotone" dataKey="vendors" stroke="hsl(40,95%,53%)" strokeWidth={2} dot={{ fill: "hsl(40,95%,53%)" }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-xl border border-border bg-card p-5 shadow-card">
          <h2 className="font-display font-bold mb-4">Category Distribution</h2>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={categoryDist} cx="50%" cy="50%" outerRadius={70} dataKey="value" labelLine={false}>
                {categoryDist.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
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
