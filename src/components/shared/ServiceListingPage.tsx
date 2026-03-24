/**
 * ServiceListingPage — Unified listing page used by Student My Listings tab
 * Simplified version - main service pages now use their own specialized implementations
 */
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Package, ClipboardList, History, Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import ListingCard, { ListingCardItem, ListingRole } from "./ListingCard";
import AddEditListingModal, { ServiceCategory, ListingFormData } from "./AddEditListingModal";
import RejectReasonDialog from "./RejectReasonDialog";
import RequestsListTab, { RequestItem } from "./RequestsListTab";

interface ServiceListingPageProps {
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  role: ListingRole;
  serviceCategory: ServiceCategory;
  listings: ListingCardItem[];
  requests?: RequestItem[];
  pendingRequests?: { id: string; name: string; message: string; date: string; status: string }[];
  historyRequests?: { id: string; name: string; message: string; date: string; status: string }[];
  showListingsTab?: boolean;
  showRequestsTab?: boolean;
  showHistoryTab?: boolean;
  defaultTab?: string;
  onItemClick?: (id: string) => void;
}

export default function ServiceListingPage({
  title, subtitle, icon, role, serviceCategory, listings,
  requests = [], pendingRequests = [], historyRequests = [],
  showListingsTab = true, showRequestsTab = false, showHistoryTab = false,
  defaultTab = "listings", onItemClick,
}: ServiceListingPageProps) {
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  const [createOpen, setCreateOpen] = useState(false);
  const [editData, setEditData] = useState<Partial<ListingFormData> | null>(null);
  const [rejectOpen, setRejectOpen] = useState(false);

  const filtered = listings.filter((l) =>
    l.title.toLowerCase().includes(search.toLowerCase())
  );

  const handleCreate = (data: ListingFormData) => {
    toast({ title: "Submitted for approval", description: `Your ${title.toLowerCase()} listing has been submitted.` });
  };

  const handleEdit = (item: ListingCardItem) => {
    setEditData({ title: item.title, description: item.description, price: String(item.price || "") });
    setCreateOpen(true);
  };

  const handleDelete = (id: string) => {
    toast({ title: "Delete request submitted", description: "Admin will review the deletion request." });
  };

  const handleApprove = (id: string) => {
    toast({ title: "Approved", description: "The listing has been approved and is now visible." });
  };

  const handleReject = (reason: string) => {
    toast({ title: "Rejected", description: "The requester has been notified." });
  };

  const handleRequestApprove = (id: string) => {
    toast({ title: "Request approved", description: "Student has been notified." });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold flex items-center gap-2">{icon} {title}</h1>
          <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>
        </div>
        {(role === "student" || role === "vendor") && showListingsTab && (
          <Button onClick={() => { setEditData(null); setCreateOpen(true); }} className="gap-1">
            <Plus className="h-4 w-4" /> Add Listing
          </Button>
        )}
      </div>

      <Tabs defaultValue={defaultTab} className="w-full">
        <TabsList>
          {showListingsTab && <TabsTrigger value="listings"><Package className="h-3.5 w-3.5 mr-1" /> Listings</TabsTrigger>}
          {showRequestsTab && <TabsTrigger value="requests"><ClipboardList className="h-3.5 w-3.5 mr-1" /> Requests</TabsTrigger>}
          {showHistoryTab && <TabsTrigger value="history"><History className="h-3.5 w-3.5 mr-1" /> History</TabsTrigger>}
          {requests.length > 0 && !showRequestsTab && <TabsTrigger value="my-requests">My Requests</TabsTrigger>}
        </TabsList>

        {showListingsTab && (
          <TabsContent value="listings" className="mt-4 space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Search listings..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {filtered.map((item, i) => (
                <ListingCard
                  key={item.id}
                  item={item}
                  index={i}
                  role={role}
                  onClick={onItemClick ? () => onItemClick(item.id) : undefined}
                  onEdit={role !== "admin" ? () => handleEdit(item) : undefined}
                  onDelete={role !== "admin" ? () => handleDelete(item.id) : undefined}
                  onApprove={role === "admin" ? () => handleApprove(item.id) : undefined}
                  onReject={role === "admin" ? () => { setRejectOpen(true); } : undefined}
                />
              ))}
              {filtered.length === 0 && (
                <div className="col-span-2 text-center py-12 text-muted-foreground">
                  <Package className="h-12 w-12 mx-auto mb-3 opacity-30" />
                  <p>No listings found.</p>
                </div>
              )}
            </div>
          </TabsContent>
        )}

        {showRequestsTab && (
          <TabsContent value="requests" className="mt-4 space-y-3">
            {pendingRequests.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <ClipboardList className="h-12 w-12 mx-auto mb-3 opacity-30" />
                <p>No pending requests.</p>
              </div>
            ) : (
              pendingRequests.map((req) => (
                <div key={req.id} className="rounded-xl border border-border bg-card p-4 shadow-card">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div>
                      <div className="text-sm font-medium">{req.name}</div>
                      <div className="text-xs text-muted-foreground">{req.message}</div>
                      <div className="text-xs text-muted-foreground mt-1">{req.date}</div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" className="gap-1" onClick={() => handleRequestApprove(req.id)}>Approve</Button>
                      <Button size="sm" variant="outline" className="gap-1 text-destructive hover:bg-destructive/10"
                        onClick={() => setRejectOpen(true)}>Reject</Button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </TabsContent>
        )}

        {showHistoryTab && (
          <TabsContent value="history" className="mt-4 space-y-3">
            {historyRequests.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <History className="h-12 w-12 mx-auto mb-3 opacity-30" />
                <p>No history yet.</p>
              </div>
            ) : (
              <RequestsListTab
                requests={historyRequests.map((h, i) => ({
                  id: i + 1, title: h.name, subtitle: h.message, date: h.date, status: h.status,
                }))}
                emptyMessage="No history."
              />
            )}
          </TabsContent>
        )}

        {requests.length > 0 && !showRequestsTab && (
          <TabsContent value="my-requests" className="mt-4">
            <RequestsListTab requests={requests} emptyMessage="No requests yet." />
          </TabsContent>
        )}
      </Tabs>

      <AddEditListingModal
        open={createOpen}
        onOpenChange={setCreateOpen}
        serviceCategory={serviceCategory}
        editData={editData}
        onSubmit={handleCreate}
      />
      <RejectReasonDialog open={rejectOpen} onOpenChange={setRejectOpen} onReject={handleReject} />
    </div>
  );
}
