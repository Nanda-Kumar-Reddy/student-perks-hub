import { useState } from "react";
import { QrCode, Search, Calendar, CheckCircle2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const transactions = [
  { id: 1, student: "Rahul S.", amount: "₹250", time: "10:30 AM", date: "Mar 6, 2026", verified: true },
  { id: 2, student: "Priya K.", amount: "₹180", time: "9:15 AM", date: "Mar 6, 2026", verified: true },
  { id: 3, student: "Amit D.", amount: "₹420", time: "2:45 PM", date: "Mar 5, 2026", verified: true },
  { id: 4, student: "Sara M.", amount: "₹350", time: "11:00 AM", date: "Mar 5, 2026", verified: true },
  { id: 5, student: "John L.", amount: "₹150", time: "4:20 PM", date: "Mar 4, 2026", verified: true },
  { id: 6, student: "Nina R.", amount: "₹280", time: "1:30 PM", date: "Mar 3, 2026", verified: true },
  { id: 7, student: "Dev P.", amount: "₹520", time: "10:00 AM", date: "Feb 28, 2026", verified: true },
  { id: 8, student: "Lisa T.", amount: "₹190", time: "3:15 PM", date: "Feb 27, 2026", verified: true },
];

const filters = ["All", "Yesterday", "This Week", "This Month", "Custom"];

export default function VerifyTransactionPage() {
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");

  const filtered = transactions.filter(t => t.student.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold flex items-center gap-2"><QrCode className="h-6 w-6 text-primary" /> Verify Transactions</h1>
        <p className="text-sm text-muted-foreground mt-1">View and verify student transactions</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input className="pl-9" placeholder="Search by student name..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <div className="flex gap-1.5 flex-wrap">
          {filters.map(f => (
            <Button key={f} variant={activeFilter === f ? "default" : "outline"} size="sm" onClick={() => setActiveFilter(f)}>{f}</Button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        {filtered.map((t, i) => (
          <motion.div key={t.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}
            className="flex items-center justify-between rounded-xl border border-border bg-card p-4 shadow-card">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">{t.student.charAt(0)}</div>
              <div>
                <div className="text-sm font-medium">{t.student}</div>
                <div className="text-xs text-muted-foreground">{t.date} · {t.time}</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm font-medium">{t.amount}</div>
              <span className="inline-flex items-center gap-1 rounded-full bg-success/10 px-2 py-0.5 text-[10px] font-medium text-success">
                <CheckCircle2 className="h-3 w-3" /> Verified
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
