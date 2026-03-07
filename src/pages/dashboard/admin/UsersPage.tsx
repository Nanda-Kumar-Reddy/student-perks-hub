import { useState } from "react";
import { Users, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";

const users = [
  { id: 1, name: "Rahul Sharma", joined: "Jan 15, 2026", vendors: 8, transactions: 45, revenue: "₹12,400", points: 1240, avatar: "RS" },
  { id: 2, name: "Priya Kumar", joined: "Feb 2, 2026", vendors: 5, transactions: 23, revenue: "₹6,800", points: 680, avatar: "PK" },
  { id: 3, name: "Amit Das", joined: "Dec 10, 2025", vendors: 12, transactions: 67, revenue: "₹18,900", points: 1890, avatar: "AD" },
  { id: 4, name: "Sara Miller", joined: "Mar 1, 2026", vendors: 3, transactions: 8, revenue: "₹2,100", points: 210, avatar: "SM" },
  { id: 5, name: "John Lee", joined: "Nov 20, 2025", vendors: 15, transactions: 89, revenue: "₹24,500", points: 2450, avatar: "JL" },
  { id: 6, name: "Nina Rao", joined: "Jan 28, 2026", vendors: 6, transactions: 31, revenue: "₹8,700", points: 870, avatar: "NR" },
];

export default function UsersPage() {
  const [search, setSearch] = useState("");
  const filtered = users.filter(u => u.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold flex items-center gap-2"><Users className="h-6 w-6 text-primary" /> Users</h1>
        <p className="text-sm text-muted-foreground mt-1">Manage registered students</p>
      </div>
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input className="pl-9" placeholder="Search users..." value={search} onChange={e => setSearch(e.target.value)} />
      </div>
      
      {/* List view */}
      <div className="rounded-xl border border-border bg-card shadow-card overflow-hidden">
        <div className="hidden sm:grid grid-cols-6 gap-4 p-4 border-b border-border text-xs font-medium text-muted-foreground">
          <span>Name</span>
          <span>Joined</span>
          <span className="text-center">Vendors</span>
          <span className="text-center">Transactions</span>
          <span className="text-right">Revenue</span>
          <span className="text-right">Points</span>
        </div>
        {filtered.map((u, i) => (
          <motion.div
            key={u.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="grid grid-cols-1 sm:grid-cols-6 gap-2 sm:gap-4 p-4 border-b border-border last:border-0 hover:bg-secondary/30 transition-colors items-center"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">{u.avatar}</div>
              <span className="text-sm font-medium">{u.name}</span>
            </div>
            <div className="text-xs text-muted-foreground">{u.joined}</div>
            <div className="text-sm font-medium text-center">{u.vendors}</div>
            <div className="text-sm font-medium text-center">{u.transactions}</div>
            <div className="text-sm font-medium text-right">{u.revenue}</div>
            <div className="text-sm font-medium text-right">{u.points}</div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
