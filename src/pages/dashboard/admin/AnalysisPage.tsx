import { FileText, TrendingUp, Users, Store } from "lucide-react";
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const revenueData = [
  { month: "Oct", revenue: 120000 }, { month: "Nov", revenue: 145000 }, { month: "Dec", revenue: 132000 },
  { month: "Jan", revenue: 168000 }, { month: "Feb", revenue: 185000 }, { month: "Mar", revenue: 175000 },
];

const vendorPerf = [
  { name: "Bean Counter", score: 92 }, { name: "Green Bowl", score: 88 }, { name: "FitZone", score: 95 },
  { name: "Quick Print", score: 78 }, { name: "Campus Bites", score: 85 },
];

const engagement = [
  { week: "W1", active: 420 }, { week: "W2", active: 480 }, { week: "W3", active: 510 },
  { week: "W4", active: 550 }, { week: "W5", active: 490 }, { week: "W6", active: 580 },
];

const categoryDist = [
  { name: "Food & Drinks", value: 45 }, { name: "Services", value: 25 },
  { name: "Education", value: 18 }, { name: "Health", value: 12 },
];

const COLORS = ["hsl(160,84%,39%)", "hsl(12,90%,62%)", "hsl(38,92%,50%)", "hsl(220,14%,50%)"];

export default function AnalysisPage() {
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
          <h2 className="font-display font-bold mb-4">Platform Revenue</h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={revenueData}><CartesianGrid strokeDasharray="3 3" stroke="hsl(220,13%,91%)" /><XAxis dataKey="month" tick={{ fontSize: 12 }} /><YAxis tick={{ fontSize: 12 }} /><Tooltip /><Bar dataKey="revenue" fill="hsl(160,84%,39%)" radius={[4, 4, 0, 0]} /></BarChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-xl border border-border bg-card p-5 shadow-card">
          <h2 className="font-display font-bold mb-4">Student Engagement</h2>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={engagement}><CartesianGrid strokeDasharray="3 3" stroke="hsl(220,13%,91%)" /><XAxis dataKey="week" tick={{ fontSize: 12 }} /><YAxis tick={{ fontSize: 12 }} /><Tooltip /><Line type="monotone" dataKey="active" stroke="hsl(12,90%,62%)" strokeWidth={2} dot={{ fill: "hsl(12,90%,62%)" }} /></LineChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-xl border border-border bg-card p-5 shadow-card">
          <h2 className="font-display font-bold mb-4">Vendor Performance</h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={vendorPerf} layout="vertical"><CartesianGrid strokeDasharray="3 3" stroke="hsl(220,13%,91%)" /><XAxis type="number" domain={[0, 100]} tick={{ fontSize: 12 }} /><YAxis type="category" dataKey="name" tick={{ fontSize: 11 }} width={90} /><Tooltip /><Bar dataKey="score" fill="hsl(38,92%,50%)" radius={[0, 4, 4, 0]} /></BarChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-xl border border-border bg-card p-5 shadow-card">
          <h2 className="font-display font-bold mb-4">Category Distribution</h2>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart><Pie data={categoryDist} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={false}>
              {categoryDist.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
            </Pie><Tooltip /></PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
