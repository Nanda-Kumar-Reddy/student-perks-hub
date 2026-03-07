import { useNavigate } from "react-router-dom";
import { Users, TrendingUp, DollarSign, Gift } from "lucide-react";

const todayTx = [
  { student: "Rahul S.", amount: "₹250", time: "10 min ago", verified: true },
  { student: "Priya K.", amount: "₹180", time: "1h ago", verified: true },
  { student: "Amit D.", amount: "₹420", time: "2h ago", verified: true },
];

export default function VendorDashboard() {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { icon: <Users className="h-5 w-5" />, label: "Today's Customers", value: "12", color: "text-primary" },
          { icon: <Gift className="h-5 w-5" />, label: "Coupons Used", value: "15", color: "text-accent" },
          { icon: <DollarSign className="h-5 w-5" />, label: "Today's Revenue", value: "₹4,850", color: "text-success" },
          { icon: <TrendingUp className="h-5 w-5" />, label: "This Month", value: "₹1.2L", color: "text-warning" },
        ].map((s) => (
          <div key={s.label} className="rounded-xl border border-border bg-card p-5 shadow-card">
            <div className={`mb-2 ${s.color}`}>{s.icon}</div>
            <div className="text-2xl font-display font-bold">{s.value}</div>
            <div className="text-xs text-muted-foreground">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-border bg-card p-5 shadow-card">
          <h2 className="font-display font-bold">Today's Transactions</h2>
          <div className="mt-4 space-y-3">
            {todayTx.map((tx) => (
              <div key={tx.student} className="flex items-center justify-between rounded-lg bg-secondary/50 p-3">
                <div>
                  <div className="text-sm font-medium">{tx.student}</div>
                  <div className="text-xs text-muted-foreground">{tx.time}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium">{tx.amount}</div>
                  <span className="inline-flex rounded-full bg-success/10 px-2 py-0.5 text-xs font-medium text-success">Verified</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-5 shadow-card">
          <h2 className="font-display font-bold">Quick Actions</h2>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <button
              onClick={() => navigate("/vendor/offers?tab=create")}
              className="flex flex-col items-center gap-2 rounded-xl border border-border bg-secondary/50 p-6 text-center transition-colors hover:bg-secondary"
            >
              <Gift className="h-8 w-8 text-primary" />
              <span className="text-sm font-medium">Create Coupon</span>
            </button>
            <button
              onClick={() => navigate("/vendor/analytics")}
              className="flex flex-col items-center gap-2 rounded-xl border border-border bg-secondary/50 p-6 text-center transition-colors hover:bg-secondary"
            >
              <TrendingUp className="h-8 w-8 text-accent" />
              <span className="text-sm font-medium">View Analytics</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
