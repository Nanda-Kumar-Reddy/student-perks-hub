import { Gift, TrendingUp, Clock, Star } from "lucide-react";
import CouponCarousel from "@/components/CouponCarousel";

const recentTx = [
  { vendor: "Bean Counter Café", amount: "₹180", points: "+18", time: "2h ago", emoji: "☕" },
  { vendor: "The Green Bowl", amount: "₹350", points: "+35", time: "1d ago", emoji: "🥗" },
  { vendor: "FitZone Gym", amount: "₹1,200", points: "+120", time: "3d ago", emoji: "🏋️" },
];

const recommended = [
  { name: "Campus Bites", offer: "Buy 1 Get 1 Free", emoji: "🍔" },
  { name: "Quick Print", offer: "Free binding", emoji: "🖨️" },
];

export default function StudentDashboard() {
  return (
    <div className="space-y-6">
      <CouponCarousel />

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { icon: <Gift className="h-5 w-5" />, label: "Reward Points", value: "1,240", color: "text-primary" },
          { icon: <TrendingUp className="h-5 w-5" />, label: "Total Spent", value: "₹8,450", color: "text-accent" },
          { icon: <Clock className="h-5 w-5" />, label: "Transactions", value: "23", color: "text-success" },
          { icon: <Star className="h-5 w-5" />, label: "Vendors Visited", value: "8", color: "text-warning" },
        ].map((s) => (
          <div key={s.label} className="rounded-xl border border-border bg-card p-5 shadow-card">
            <div className={`mb-2 ${s.color}`}>{s.icon}</div>
            <div className="text-2xl font-display font-bold">{s.value}</div>
            <div className="text-xs text-muted-foreground">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 rounded-xl border border-border bg-card p-5 shadow-card">
          <h2 className="font-display font-bold">Recent Transactions</h2>
          <div className="mt-4 space-y-3">
            {recentTx.map((tx) => (
              <div key={tx.vendor} className="flex items-center justify-between rounded-lg bg-secondary/50 p-3">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{tx.emoji}</span>
                  <div>
                    <div className="text-sm font-medium">{tx.vendor}</div>
                    <div className="text-xs text-muted-foreground">{tx.time}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium">{tx.amount}</div>
                  <div className="text-xs font-medium text-primary">{tx.points} pts</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-5 shadow-card">
          <h2 className="font-display font-bold">Recommended</h2>
          <div className="mt-4 space-y-3">
            {recommended.map((v) => (
              <div key={v.name} className="flex items-center gap-3 rounded-lg bg-secondary/50 p-3">
                <span className="text-2xl">{v.emoji}</span>
                <div>
                  <div className="text-sm font-medium">{v.name}</div>
                  <div className="text-xs text-accent font-medium">🎁 {v.offer}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
