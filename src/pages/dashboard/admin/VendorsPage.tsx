import { useState } from "react";
import { Store, CheckCircle2, XCircle, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";

const vendors = [
  { id: 1, name: "Bean Counter Café", joined: 45, customers: 320, transactions: 890, revenue: "₹2.4L", avatar: "BC" },
  { id: 2, name: "The Green Bowl", joined: 30, customers: 210, transactions: 560, revenue: "₹1.8L", avatar: "GB" },
  { id: 3, name: "FitZone Gym", joined: 60, customers: 450, transactions: 1200, revenue: "₹5.2L", avatar: "FZ" },
  { id: 4, name: "Quick Print", joined: 90, customers: 180, transactions: 420, revenue: "₹1.1L", avatar: "QP" },
  { id: 5, name: "Campus Bites", joined: 20, customers: 150, transactions: 340, revenue: "₹0.9L", avatar: "CB" },
];

const pendingVendors = [
  { id: 10, name: "Desi Dhaba", category: "Restaurant", applied: "2d ago" },
  { id: 11, name: "Clip & Style", category: "Services", applied: "3d ago" },
  { id: 12, name: "TechFix Hub", category: "Electronics", applied: "5d ago" },
];

export default function AdminVendorsPage() {
  const [search, setSearch] = useState("");
  const [approvalStatus, setApprovalStatus] = useState<Record<number, "approved" | "rejected">>({});

  const filteredVendors = vendors.filter(v => v.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold flex items-center gap-2"><Store className="h-6 w-6 text-primary" /> Vendors</h1>
        <p className="text-sm text-muted-foreground mt-1">Manage vendors and approvals</p>
      </div>

      <Tabs defaultValue="vendors" className="w-full">
        <TabsList><TabsTrigger value="vendors">Vendors</TabsTrigger><TabsTrigger value="approvals">Vendor Approvals</TabsTrigger></TabsList>

        <TabsContent value="vendors" className="mt-4 space-y-4">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input className="pl-9" placeholder="Search vendors..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {filteredVendors.map((v, i) => (
              <motion.div key={v.id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                className="rounded-xl border border-border bg-card p-5 shadow-card">
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/10 text-sm font-bold text-accent">{v.avatar}</div>
                  <div><div className="text-sm font-medium">{v.name}</div><div className="text-[10px] text-muted-foreground">{v.joined} days since registration</div></div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="rounded-lg bg-secondary/50 p-2"><div className="text-xs text-muted-foreground">Customers</div><div className="text-sm font-bold">{v.customers}</div></div>
                  <div className="rounded-lg bg-secondary/50 p-2"><div className="text-xs text-muted-foreground">Transactions</div><div className="text-sm font-bold">{v.transactions}</div></div>
                  <div className="rounded-lg bg-secondary/50 p-2 col-span-2"><div className="text-xs text-muted-foreground">Revenue</div><div className="text-sm font-bold">{v.revenue}</div></div>
                </div>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="approvals" className="mt-4">
          <div className="space-y-3">
            {pendingVendors.map((v, i) => (
              <motion.div key={v.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                className="flex items-center justify-between rounded-xl border border-border bg-card p-4 shadow-card">
                <div>
                  <div className="text-sm font-medium">{v.name}</div>
                  <div className="text-xs text-muted-foreground">{v.category} · Applied {v.applied}</div>
                </div>
                {approvalStatus[v.id] ? (
                  <div className="flex items-center gap-1.5">
                    {approvalStatus[v.id] === "approved" ? (
                      <span className="flex items-center gap-1 text-success text-sm font-medium"><CheckCircle2 className="h-4 w-4" /> Approved</span>
                    ) : (
                      <span className="flex items-center gap-1 text-destructive text-sm font-medium"><XCircle className="h-4 w-4" /> Rejected</span>
                    )}
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <Button size="sm" onClick={() => setApprovalStatus(p => ({ ...p, [v.id]: "approved" }))} className="bg-success hover:bg-success/90 text-success-foreground">Approve</Button>
                    <Button size="sm" variant="destructive" onClick={() => setApprovalStatus(p => ({ ...p, [v.id]: "rejected" }))}>Reject</Button>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
