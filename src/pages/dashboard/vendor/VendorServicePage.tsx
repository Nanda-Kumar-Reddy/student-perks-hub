/**
 * Vendor Service Page — Dynamic page for each vendor service
 * Shows Listings, Requests, History tabs based on service type
 */
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Plus, Edit2, Trash2, Check, X, Clock, Package, FileText, History } from "lucide-react";
import StatusBadge from "@/components/shared/StatusBadge";
import {
  apiGetVendorListings, apiCreateVendorListing, apiUpdateVendorListing,
  apiDeleteVendorListing, apiGetVendorRequests, apiGetVendorRequestHistory,
  apiApproveVendorRequest, apiRejectVendorRequest,
} from "@/services/api";

const SERVICE_LABELS: Record<string, string> = {
  accommodation: "Accommodation",
  car_rent_sale: "Car Rent/Sale",
  consultations: "Consultations",
  accounting: "Accounting",
  driving_licence: "Driving Licence",
  loans: "Loans",
  airport_pickup: "Airport Pickup",
  certifications: "Certifications",
  events: "Events",
  jobs: "Jobs",
};

// Services that have listings
const HAS_LISTINGS = ["accommodation", "car_rent_sale", "consultations", "accounting", "driving_licence", "certifications", "events", "jobs"];
// Services with only requests (no listings)
const REQUEST_ONLY = ["loans", "airport_pickup"];

export default function VendorServicePage() {
  const { serviceType } = useParams<{ serviceType: string }>();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("listings");
  const [listings, setListings] = useState<any[]>([]);
  const [requests, setRequests] = useState<any[]>([]);
  const [history, setHistory] = useState<any[]>([]);
  const [createOpen, setCreateOpen] = useState(false);
  const [rejectOpen, setRejectOpen] = useState(false);
  const [selectedRequestId, setSelectedRequestId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [formData, setFormData] = useState({ title: "", description: "", price: "" });

  const label = SERVICE_LABELS[serviceType || ""] || serviceType || "";
  const hasListings = HAS_LISTINGS.includes(serviceType || "");

  useEffect(() => {
    if (!serviceType) return;
    if (hasListings) loadListings();
    loadRequests();
    loadHistory();
  }, [serviceType]);

  async function loadListings() {
    try {
      const res = await apiGetVendorListings(serviceType);
      setListings(res.data || []);
    } catch { setListings([]); }
  }

  async function loadRequests() {
    try {
      const res = await apiGetVendorRequests(serviceType, "pending");
      setRequests(res.data || []);
    } catch { setRequests([]); }
  }

  async function loadHistory() {
    try {
      const res = await apiGetVendorRequestHistory(serviceType);
      setHistory(res.data || []);
    } catch { setHistory([]); }
  }

  async function handleCreateListing() {
    try {
      await apiCreateVendorListing({
        serviceType,
        title: formData.title,
        description: formData.description,
        price: formData.price ? parseFloat(formData.price) : undefined,
      });
      toast({ title: "Listing submitted for approval" });
      setCreateOpen(false);
      setFormData({ title: "", description: "", price: "" });
      loadListings();
    } catch (e: any) {
      toast({ title: "Error", description: e.message, variant: "destructive" });
    }
  }

  async function handleDeleteListing(id: string) {
    try {
      await apiDeleteVendorListing(id);
      toast({ title: "Deletion request submitted" });
      loadListings();
    } catch (e: any) {
      toast({ title: "Error", description: e.message, variant: "destructive" });
    }
  }

  async function handleApproveRequest(id: string) {
    try {
      await apiApproveVendorRequest(id);
      toast({ title: "Request approved" });
      loadRequests();
      loadHistory();
    } catch (e: any) {
      toast({ title: "Error", description: e.message, variant: "destructive" });
    }
  }

  async function handleRejectRequest() {
    if (!selectedRequestId || !rejectReason.trim()) return;
    try {
      await apiRejectVendorRequest(selectedRequestId, rejectReason);
      toast({ title: "Request rejected" });
      setRejectOpen(false);
      setRejectReason("");
      loadRequests();
      loadHistory();
    } catch (e: any) {
      toast({ title: "Error", description: e.message, variant: "destructive" });
    }
  }

  const defaultTab = hasListings ? "listings" : "requests";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-display font-bold">{label}</h1>
        {hasListings && (
          <Button onClick={() => setCreateOpen(true)} size="sm">
            <Plus className="h-4 w-4 mr-1" /> Add Listing
          </Button>
        )}
      </div>

      <Tabs defaultValue={defaultTab} value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          {hasListings && (
            <TabsTrigger value="listings" className="gap-1.5">
              <Package className="h-3.5 w-3.5" /> Listings
            </TabsTrigger>
          )}
          <TabsTrigger value="requests" className="gap-1.5">
            <FileText className="h-3.5 w-3.5" /> Requests
          </TabsTrigger>
          <TabsTrigger value="history" className="gap-1.5">
            <History className="h-3.5 w-3.5" /> History
          </TabsTrigger>
        </TabsList>

        {hasListings && (
          <TabsContent value="listings" className="space-y-4">
            {listings.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                No listings yet. Click "Add Listing" to create one.
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {listings.map((l) => (
                  <div key={l.id} className="rounded-xl border border-border bg-card p-4 shadow-card">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-medium text-sm">{l.title}</h3>
                      <StatusBadge status={l.status === "approved" ? "Approved" : l.status === "pending_approval" ? "Pending" : "Rejected"} />
                    </div>
                    {l.description && <p className="text-xs text-muted-foreground mb-2 line-clamp-2">{l.description}</p>}
                    {l.price && <p className="text-sm font-semibold text-primary">${Number(l.price).toFixed(2)}</p>}
                    <div className="flex gap-2 mt-3">
                      <Button variant="outline" size="sm" onClick={() => {
                        setFormData({ title: l.title, description: l.description || "", price: l.price?.toString() || "" });
                        setCreateOpen(true);
                      }}>
                        <Edit2 className="h-3 w-3 mr-1" /> Edit
                      </Button>
                      <Button variant="destructive" size="sm" onClick={() => handleDeleteListing(l.id)}>
                        <Trash2 className="h-3 w-3 mr-1" /> Delete
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
        )}

        <TabsContent value="requests" className="space-y-4">
          {requests.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">No pending requests.</div>
          ) : (
            <div className="space-y-3">
              {requests.map((r) => (
                <div key={r.id} className="rounded-xl border border-border bg-card p-4 shadow-card">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">{r.student?.profile?.fullName || r.student?.email || "Student"}</p>
                      <p className="text-xs text-muted-foreground">{r.listing?.title || r.serviceType}</p>
                      {r.message && <p className="text-xs text-muted-foreground mt-1">{r.message}</p>}
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" onClick={() => handleApproveRequest(r.id)}>
                        <Check className="h-3 w-3 mr-1" /> Approve
                      </Button>
                      <Button variant="destructive" size="sm" onClick={() => {
                        setSelectedRequestId(r.id);
                        setRejectOpen(true);
                      }}>
                        <X className="h-3 w-3 mr-1" /> Reject
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          {history.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">No history yet.</div>
          ) : (
            <div className="space-y-3">
              {history.map((r) => (
                <div key={r.id} className="rounded-xl border border-border bg-card p-4 shadow-card">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">{r.student?.profile?.fullName || r.student?.email || "Student"}</p>
                      <p className="text-xs text-muted-foreground">{r.listing?.title || r.serviceType}</p>
                    </div>
                    <StatusBadge status={r.status === "approved" ? "Approved" : r.status === "rejected" ? "Rejected" : "Completed"} />
                  </div>
                  {r.rejectionReason && (
                    <p className="text-xs text-destructive mt-2">Reason: {r.rejectionReason}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Create/Edit Listing Dialog */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add {label} Listing</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Title</label>
              <Input value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} placeholder="Listing title" />
            </div>
            <div>
              <label className="text-sm font-medium">Description</label>
              <Textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} placeholder="Description" />
            </div>
            <div>
              <label className="text-sm font-medium">Price (AUD)</label>
              <Input type="number" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} placeholder="0.00" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateOpen(false)}>Cancel</Button>
            <Button onClick={handleCreateListing} disabled={!formData.title.trim()}>Submit for Approval</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reject Dialog */}
      <Dialog open={rejectOpen} onOpenChange={setRejectOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Reject Request</DialogTitle>
          </DialogHeader>
          <Textarea value={rejectReason} onChange={(e) => setRejectReason(e.target.value)} placeholder="Reason for rejection (required)" />
          <DialogFooter>
            <Button variant="outline" onClick={() => setRejectOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleRejectRequest} disabled={!rejectReason.trim()}>Reject</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
