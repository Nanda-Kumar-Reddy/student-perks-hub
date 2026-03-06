import { BarChart3, TrendingUp, Users, Star, Tag } from "lucide-react";
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

const revenueData = [
  { month: "Oct", revenue: 32000 }, { month: "Nov", revenue: 41000 }, { month: "Dec", revenue: 38000 },
  { month: "Jan", revenue: 45000 }, { month: "Feb", revenue: 52000 }, { month: "Mar", revenue: 48000 },
];

const customerData = [
  { month: "Oct", customers: 120 }, { month: "Nov", customers: 145 }, { month: "Dec", customers: 130 },
  { month: "Jan", customers: 160 }, { month: "Feb", customers: 185 }, { month: "Mar", customers: 170 },
];

const ratingData = [
  { month: "Oct", rating: 4.2 }, { month: "Nov", rating: 4.4 }, { month: "Dec", rating: 4.3 },
  { month: "Jan", rating: 4.5 }, { month: "Feb", rating: 4.7 }, { month: "Mar", rating: 4.6 },
];

const couponUsage = [
  { name: "20% Off Coffee", value: 340 }, { name: "BOGO Pastries", value: 210 },
  { name: "Student Special", value: 180 }, { name: "Weekend Deal", value: 120 },
];

const COLORS = ["hsl(160,84%,39%)", "hsl(12,90%,62%)", "hsl(38,92%,50%)", "hsl(220,14%,50%)"];

export default function AnalyticsPage() {
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
          <h2 className="font-display font-bold mb-4">Revenue Trend</h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={revenueData}><CartesianGrid strokeDasharray="3 3" stroke="hsl(220,13%,91%)" /><XAxis dataKey="month" tick={{ fontSize: 12 }} /><YAxis tick={{ fontSize: 12 }} /><Tooltip /><Bar dataKey="revenue" fill="hsl(160,84%,39%)" radius={[4, 4, 0, 0]} /></BarChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-xl border border-border bg-card p-5 shadow-card">
          <h2 className="font-display font-bold mb-4">Customer Visits</h2>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={customerData}><CartesianGrid strokeDasharray="3 3" stroke="hsl(220,13%,91%)" /><XAxis dataKey="month" tick={{ fontSize: 12 }} /><YAxis tick={{ fontSize: 12 }} /><Tooltip /><Line type="monotone" dataKey="customers" stroke="hsl(12,90%,62%)" strokeWidth={2} dot={{ fill: "hsl(12,90%,62%)" }} /></LineChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-xl border border-border bg-card p-5 shadow-card">
          <h2 className="font-display font-bold mb-4">Rating Trend</h2>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={ratingData}><CartesianGrid strokeDasharray="3 3" stroke="hsl(220,13%,91%)" /><XAxis dataKey="month" tick={{ fontSize: 12 }} /><YAxis domain={[3.5, 5]} tick={{ fontSize: 12 }} /><Tooltip /><Line type="monotone" dataKey="rating" stroke="hsl(38,92%,50%)" strokeWidth={2} dot={{ fill: "hsl(38,92%,50%)" }} /></LineChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-xl border border-border bg-card p-5 shadow-card">
          <h2 className="font-display font-bold mb-4">Coupon Usage</h2>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart><Pie data={couponUsage} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={false}>
              {couponUsage.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
            </Pie><Tooltip /></PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
