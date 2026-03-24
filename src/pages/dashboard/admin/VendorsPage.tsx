import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Store, CheckCircle2, XCircle, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import VendorDetailsDialog from "@/components/admin/VendorDetailsDialog";

const vendors = [
  { id: "1", name: "Bean Counter Café", joined: 45, customers: 320, transactions: 890, revenue: 24000, avatar: "BC", email: "bean@counter.com", startDate: "2026-01-10",
    services: [
      { id: "s1", serviceType: "ACCOMMODATION", isActive: true },
      { id: "s2", serviceType: "CONSULTATIONS", isActive: true },
    ] },
  { id: "2", name: "The Green Bowl", joined: 30, customers: 210, transactions: 560, revenue: 18000, avatar: "GB", email: "green@bowl.com", startDate: "2026-02-01",
    services: [{ id: "s3", serviceType: "EVENTS", isActive: true }] },
  { id: "3", name: "FitZone Gym", joined: 60, customers: 450, transactions: 1200, revenue: 52000, avatar: "FZ", email: "fit@zone.com", startDate: "2025-12-15",
    services: [
      { id: "s4", serviceType: "CERTIFICATIONS", isActive: true },
      { id: "s5", serviceType: "DRIVING_LICENCE", isActive: true },
      { id: "s6", serviceType: "CAR_RENT_SALE", isActive: true },
    ] },
  { id: "4", name: "Quick Print", joined: 90, customers: 180, transactions: 420, revenue: 11000, avatar: "QP", email: "quick@print.com", startDate: "2025-11-25",
    services: [{ id: "s7", serviceType: "JOBS", isActive: true }] },
  { id: "5", name: "Campus Bites", joined: 20, customers: 150, transactions: 340, revenue: 9000, avatar: "CB", email: "campus@bites.com", startDate: "2026-03-01",
    services: [] },
];

const pendingVendors = [
  { id: 10, name: "Desi Dhaba", category: "Restaurant", applied: "2d ago" },
  { id: 11, name: "Clip & Style", category: "Services", applied: "3d ago" },
  { id: 12, name: "TechFix Hub", category: "Electronics", applied: "5d ago" },
];

export default function AdminVendorsPage() {
  const [searchParams] = useSearchParams();
  const [search, setSearch] = useState("");
  const [approvalStatus, setApprovalStatus] = useState<Record<number, "approved" | "rejected">>({});
  const [activeTab, setActiveTab] = useState("vendors");
  const [selectedVendor, setSelectedVendor] = useState<typeof vendors[0] | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);

  useEffect(() => {
    if (searchParams.get("tab") === "approvals") setActiveTab("approvals");
  }, [searchParams]);

  const filteredVendors = vendors.filter(v => v.name.toLowerCase().includes(search.toLowerCase()));

  const openVendorDetail = (v: typeof vendors[0]) => {
    setSelectedVendor(v);
    setDetailOpen(true);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold flex items-center gap-2"><Store className="h-6 w-6 text-primary" /> Vendors</h1>
        <p className="text-sm text-muted-foreground mt-1">Manage vendors and approvals</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList><TabsTrigger value="vendors">Vendors</TabsTrigger><TabsTrigger value="approvals">Vendor Approvals</TabsTrigger></TabsList>

        <TabsContent value="vendors" className="mt-4 space-y-4">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input className="pl-9" placeholder="Search vendors..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          
          {/* Desktop list view */}
          <div className="hidden sm:block rounded-xl border border-border bg-card shadow-card overflow-hidden">
            <div className="grid grid-cols-5 gap-4 p-4 border-b border-border text-xs font-medium text-muted-foreground">
              <span>Vendor</span>
              <span className="text-center">Duration</span>
              <span className="text-center">Customers</span>
              <span className="text-center">Transactions</span>
              <span className="text-right">Revenue</span>
            </div>
            {filteredVendors.map((v, i) => (
              <motion.div
                key={v.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                onClick={() => openVendorDetail(v)}
                className="grid grid-cols-5 gap-4 p-4 border-b border-border last:border-0 hover:bg-secondary/30 transition-colors items-center cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent/10 text-xs font-bold text-accent">{v.avatar}</div>
                  <span className="text-sm font-medium">{v.name}</span>
                </div>
                <div className="text-xs text-muted-foreground text-center">{v.joined} days</div>
                <div className="text-sm font-medium text-center">{v.customers}</div>
                <div className="text-sm font-medium text-center">{v.transactions}</div>
                <div className="text-sm font-medium text-right">${(v.revenue / 1000).toFixed(1)}k</div>
              </motion.div>
            ))}
          </div>

          {/* Mobile card view */}
          <div className="sm:hidden grid gap-3">
            {filteredVendors.map((v, i) => (
              <motion.div
                key={v.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                onClick={() => openVendorDetail(v)}
                className="rounded-xl border border-border bg-card p-4 shadow-card space-y-3 cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/10 text-xs font-bold text-accent">{v.avatar}</div>
                  <div>
                    <div className="text-sm font-medium">{v.name}</div>
                    <div className="text-xs text-muted-foreground">{v.joined} days</div>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div className="rounded-lg bg-secondary/50 p-2"><span className="text-muted-foreground">Customers</span><div className="font-medium">{v.customers}</div></div>
                  <div className="rounded-lg bg-secondary/50 p-2"><span className="text-muted-foreground">Txns</span><div className="font-medium">{v.transactions}</div></div>
                  <div className="rounded-lg bg-secondary/50 p-2"><span className="text-muted-foreground">Revenue</span><div className="font-medium">${(v.revenue / 1000).toFixed(1)}k</div></div>
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

      {selectedVendor && (
        <VendorDetailsDialog
          open={detailOpen}
          onOpenChange={setDetailOpen}
          vendor={{
            ...selectedVendor,
            durationDays: selectedVendor.joined,
            customersServed: selectedVendor.customers,
            totalTransactions: selectedVendor.transactions,
          }}
        />
      )}
    </div>
  );
}