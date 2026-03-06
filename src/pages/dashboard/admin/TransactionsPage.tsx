import { useState } from "react";
import { Activity, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";

const transactions = [
  { id: 1, date: "Mar 6, 2026", time: "10:30 AM", user: "Rahul S.", vendor: "Bean Counter Café", amount: "₹250" },
  { id: 2, date: "Mar 6, 2026", time: "9:15 AM", user: "Priya K.", vendor: "The Green Bowl", amount: "₹350" },
  { id: 3, date: "Mar 5, 2026", time: "2:45 PM", user: "Amit D.", vendor: "FitZone Gym", amount: "₹1,200" },
  { id: 4, date: "Mar 5, 2026", time: "11:00 AM", user: "Sara M.", vendor: "Quick Print", amount: "₹80" },
  { id: 5, date: "Mar 4, 2026", time: "4:20 PM", user: "John L.", vendor: "Campus Bites", amount: "₹420" },
  { id: 6, date: "Mar 4, 2026", time: "1:30 PM", user: "Nina R.", vendor: "Bean Counter Café", amount: "₹180" },
  { id: 7, date: "Mar 3, 2026", time: "10:00 AM", user: "Dev P.", vendor: "The Green Bowl", amount: "₹290" },
  { id: 8, date: "Mar 3, 2026", time: "3:15 PM", user: "Lisa T.", vendor: "FitZone Gym", amount: "₹1,200" },
];

export default function TransactionsPage() {
  const [search, setSearch] = useState("");
  const filtered = transactions.filter(t =>
    t.user.toLowerCase().includes(search.toLowerCase()) || t.vendor.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold flex items-center gap-2"><Activity className="h-6 w-6 text-primary" /> Transactions</h1>
        <p className="text-sm text-muted-foreground mt-1">View all platform transactions</p>
      </div>
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input className="pl-9" placeholder="Search by user or vendor..." value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      <div className="rounded-xl border border-border bg-card shadow-card overflow-hidden">
        <div className="hidden sm:grid grid-cols-5 gap-4 px-4 py-3 bg-secondary/50 text-xs font-medium text-muted-foreground">
          <span>Date</span><span>Time</span><span>User</span><span>Vendor</span><span className="text-right">Amount</span>
        </div>
        {filtered.map((t, i) => (
          <motion.div key={t.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}
            className="grid grid-cols-2 sm:grid-cols-5 gap-2 sm:gap-4 px-4 py-3 border-t border-border text-sm">
            <span className="text-muted-foreground">{t.date}</span>
            <span className="text-muted-foreground">{t.time}</span>
            <span className="font-medium">{t.user}</span>
            <span>{t.vendor}</span>
            <span className="text-right font-medium">{t.amount}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
