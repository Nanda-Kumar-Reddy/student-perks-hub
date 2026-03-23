/**
 * Generic Vendor Service Page — renders listings + requests for any vendor service type
 */
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Plus, Package, ClipboardList, History, Search, CheckCircle, XCircle, Pencil, Trash2 } from "lucide-react";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import StatusBadge from "@/components/shared/StatusBadge";

interface VendorServicePageProps {
  serviceType: string;
  serviceLabel: string;
  icon: React.ReactNode;
}

// Demo data generators
function getDemoListings(serviceType: string) {
  const demos: Record<string, any[]> = {
    ACCOMMODATION: [
      { id: "1", title: "Modern Studio CBD", description: "Bright studio near campus", price: 280, approvalStatus: "APPROVED", isActive: true, createdAt: "2026-03-10" },
      { id: "2", title: "Shared 2BR Apartment", description: "Affordable shared living", price: 180, approvalStatus: "PENDING", isActive: false, createdAt: "2026-03-15" },
    ],
    CAR_RENT_SALE: [
      { id: "1", title: "Toyota Corolla 2024", description: "Reliable sedan, low mileage", price: 45, approvalStatus: "APPROVED", isActive: true, createdAt: "2026-03-08" },
      { id: "2", title: "Honda Civic 2023", description: "Great condition, fuel efficient", price: 55, approvalStatus: "PENDING", isActive: false, createdAt: "2026-03-12" },
    ],
    CONSULTATIONS: [
      { id: "1", title: "Career Counseling Session", description: "1-hour career guidance", price: 120, approvalStatus: "APPROVED", isActive: true, createdAt: "2026-03-05" },
    ],
    DRIVING_LICENCE: [
      { id: "1", title: "Standard Package", description: "10 lessons + test booking", price: 650, approvalStatus: "APPROVED", isActive: true, createdAt: "2026-03-01" },
      { id: "2", title: "Premium Package", description: "20 lessons + 2 test bookings", price: 1100, approvalStatus: "APPROVED", isActive: true, createdAt: "2026-02-20" },
    ],
  };
  return demos[serviceType] || [
    { id: "1", title: `${serviceType} Listing 1`, description: "Sample listing", price: 100, approvalStatus: "APPROVED", isActive: true, createdAt: "2026-03-10" },
  ];
}

function getDemoRequests(serviceType: string) {
  return [
    { id: "r1", studentName: "Rahul S.", message: "Interested in this service", status: "pending", createdAt: "2026-03-18", serviceType },
    { id: "r2", studentName: "Priya K.", message: "Can I get more details?", status: "approved", createdAt: "2026-03-15", serviceType },
    { id: "r3", studentName: "Amit D.", message: "Would like to book", status: "rejected", createdAt: "2026-03-10", serviceType },
  ];
}

export default function VendorServicePage({ serviceType, serviceLabel, icon }: VendorServicePageProps) {
  const { toast } = useToast();
  const [createOpen, setCreateOpen] = useState(false);
  const [rejectOpen, setRejectOpen] = useState(false);
  const [selectedRequestId, setSelectedRequestId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [search, setSearch] = useState("");

  const listings = getDemoListings(serviceType);
  const requests = getDemoRequests(serviceType);

  const pendingRequests = requests.filter((r) => r.status === "pending");
  const historyRequests = requests.filter((r) => r.status !== "pending");

  const filteredListings = listings.filter((l) =>
    l.title.toLowerCase().includes(search.toLowerCase())
  );

  const handleApprove = (requestId: string) => {
    toast({ title: "Request approved", description: "Student has been notified." });
  };

  const handleReject = () => {
    if (!rejectReason.trim()) {
      toast({ title: "Reason required", description: "Please provide a rejection reason.", variant: "destructive" });
      return;
    }
    toast({ title: "Request rejected", description: "Student has been notified with the reason." });
    setRejectOpen(false);
    setRejectReason("");
    setSelectedRequestId(null);
  };

  const showTabs = serviceType === "AIRPORT_PICKUP"
    ? ["requests", "history"]
    : serviceType === "LOANS"
    ? ["requests", "history"]
    : ["listings", "requests", "history"];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold flex items-center gap-2">{icon} {serviceLabel}</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage your {serviceLabel.toLowerCase()} listings and requests</p>
        </div>
        {showTabs.includes("listings") && (
          <Button onClick={() => setCreateOpen(true)} className="gap-1">
            <Plus className="h-4 w-4" /> Add Listing
          </Button>
        )}
      </div>

      <Tabs defaultValue={showTabs[0]} className="w-full">
        <TabsList>
          {showTabs.includes("listings") && <TabsTrigger value="listings"><Package className="h-3.5 w-3.5 mr-1" /> Listings</TabsTrigger>}
          <TabsTrigger value="requests"><ClipboardList className="h-3.5 w-3.5 mr-1" /> Requests</TabsTrigger>
          <TabsTrigger value="history"><History className="h-3.5 w-3.5 mr-1" /> History</TabsTrigger>
        </TabsList>

        {showTabs.includes("listings") && (
          <TabsContent value="listings" className="mt-4 space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Search listings..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {filteredListings.map((listing, i) => (
                <motion.div
                  key={listing.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06 }}
                  className="rounded-xl border border-border bg-card p-4 shadow-card space-y-3"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-display text-sm font-bold">{listing.title}</h3>
                      <p className="text-xs text-muted-foreground mt-0.5">{listing.description}</p>
                    </div>
                    <StatusBadge status={listing.approvalStatus === "APPROVED" ? "Approved" : listing.approvalStatus === "PENDING" ? "Pending" : "Rejected"} />
                  </div>
                  {listing.price && (
                    <div className="text-sm font-bold text-primary">${listing.price}</div>
                  )}
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="gap-1" onClick={() => toast({ title: "Edit submitted for approval" })}>
                      <Pencil className="h-3 w-3" /> Edit
                    </Button>
                    <Button size="sm" variant="outline" className="gap-1 text-destructive hover:bg-destructive/10" onClick={() => toast({ title: "Delete request submitted" })}>
                      <Trash2 className="h-3 w-3" /> Delete
                    </Button>
                  </div>
                </motion.div>
              ))}
              {filteredListings.length === 0 && (
                <div className="col-span-2 text-center py-12 text-muted-foreground">
                  <Package className="h-12 w-12 mx-auto mb-3 opacity-30" />
                  <p>No listings yet. Click "Add Listing" to create one.</p>
                </div>
              )}
            </div>
          </TabsContent>
        )}

        <TabsContent value="requests" className="mt-4 space-y-3">
          {pendingRequests.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              <ClipboardList className="h-12 w-12 mx-auto mb-3 opacity-30" />
              <p>No pending requests.</p>
            </div>
          )}
          {pendingRequests.map((req, i) => (
            <motion.div
              key={req.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="rounded-xl border border-border bg-card p-4 shadow-card"
            >
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div>
                  <div className="text-sm font-medium">{req.studentName}</div>
                  <div className="text-xs text-muted-foreground">{req.message}</div>
                  <div className="text-xs text-muted-foreground mt-1">{new Date(req.createdAt).toLocaleDateString()}</div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" className="gap-1" onClick={() => handleApprove(req.id)}>
                    <CheckCircle className="h-3 w-3" /> Approve
                  </Button>
                  <Button size="sm" variant="outline" className="gap-1 text-destructive hover:bg-destructive/10" onClick={() => { setSelectedRequestId(req.id); setRejectOpen(true); }}>
                    <XCircle className="h-3 w-3" /> Reject
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </TabsContent>

        <TabsContent value="history" className="mt-4 space-y-3">
          {historyRequests.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              <History className="h-12 w-12 mx-auto mb-3 opacity-30" />
              <p>No history yet.</p>
            </div>
          )}
          {historyRequests.map((req, i) => (
            <div key={req.id} className="rounded-xl border border-border bg-card p-4 shadow-card">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium">{req.studentName}</div>
                  <div className="text-xs text-muted-foreground">{req.message}</div>
                </div>
                <StatusBadge status={req.status === "approved" ? "Approved" : "Rejected"} />
              </div>
            </div>
          ))}
        </TabsContent>
      </Tabs>

      {/* Create Listing Dialog */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add {serviceLabel} Listing</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Title</label>
              <Input placeholder="Listing title" />
            </div>
            <div>
              <label className="text-sm font-medium">Description</label>
              <Textarea placeholder="Describe your listing..." rows={3} />
            </div>
            <div>
              <label className="text-sm font-medium">Price ($)</label>
              <Input type="number" placeholder="0.00" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateOpen(false)}>Cancel</Button>
            <Button onClick={() => { setCreateOpen(false); toast({ title: "Listing submitted for approval" }); }}>
              Submit for Approval
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reject Reason Dialog */}
      <Dialog open={rejectOpen} onOpenChange={setRejectOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rejection Reason</DialogTitle>
          </DialogHeader>
          <Textarea
            placeholder="Provide a reason for rejection (required)..."
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            rows={3}
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setRejectOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleReject}>Reject</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
