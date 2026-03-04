import { Users, Store, Activity, ShieldCheck, Clock } from "lucide-react";

const pendingVendors = [
  { name: "Desi Dhaba", cat: "Restaurant", applied: "2d ago" },
  { name: "Clip & Style", cat: "Services", applied: "3d ago" },
];

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { icon: <Users className="h-5 w-5" />, label: "Total Students", value: "2,543", color: "text-primary" },
          { icon: <Store className="h-5 w-5" />, label: "Active Vendors", value: "182", color: "text-accent" },
          { icon: <Activity className="h-5 w-5" />, label: "Today's Transactions", value: "347", color: "text-success" },
          { icon: <ShieldCheck className="h-5 w-5" />, label: "Pending Approvals", value: "2", color: "text-warning" },
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
          <h2 className="font-display font-bold">Vendor Approval Queue</h2>
          <div className="mt-4 space-y-3">
            {pendingVendors.map((v) => (
              <div key={v.name} className="flex items-center justify-between rounded-lg bg-secondary/50 p-3">
                <div>
                  <div className="text-sm font-medium">{v.name}</div>
                  <div className="text-xs text-muted-foreground">{v.cat} · Applied {v.applied}</div>
                </div>
                <div className="flex gap-2">
                  <button className="rounded-lg bg-success px-3 py-1.5 text-xs font-medium text-success-foreground">Approve</button>
                  <button className="rounded-lg bg-destructive px-3 py-1.5 text-xs font-medium text-destructive-foreground">Reject</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-5 shadow-card">
          <h2 className="font-display font-bold">Recent Activity</h2>
          <div className="mt-4 space-y-3">
            {[
              "New vendor registration: Desi Dhaba",
              "347 transactions processed today",
              "5 new student signups",
              "Reward payout: ₹2,400",
            ].map((a, i) => (
              <div key={i} className="flex items-center gap-3 rounded-lg bg-secondary/50 p-3">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{a}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
