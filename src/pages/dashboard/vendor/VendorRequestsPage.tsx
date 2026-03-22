/**
 * Vendor Requests Page — Shows all requests across services
 */
import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Check, X, Clock, History } from "lucide-react";
import StatusBadge from "@/components/shared/StatusBadge";
import { apiGetVendorRequests, apiGetVendorRequestHistory, apiApproveVendorRequest, apiRejectVendorRequest } from "@/services/api";

export default function VendorRequestsPage() {
  const { toast } = useToast();
  const [requests, setRequests] = useState<any[]>([]);
  const [history, setHistory] = useState<any[]>([]);
  const [rejectOpen, setRejectOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [reason, setReason] = useState("");

  useEffect(() => {
    loadRequests();
    loadHistory();
  }, []);

  async function loadRequests() {
    try {
      const res = await apiGetVendorRequests(undefined, "pending");
      setRequests(res.data || []);
    } catch { setRequests([]); }
  }

  async function loadHistory() {
    try {
      const res = await apiGetVendorRequestHistory();
      setHistory(res.data || []);
    } catch { setHistory([]); }
  }

  async function handleApprove(id: string) {
    try {
      await apiApproveVendorRequest(id);
      toast({ title: "Request approved" });
      loadRequests();
      loadHistory();
    } catch (e: any) {
      toast({ title: "Error", description: e.message, variant: "destructive" });
    }
  }

  async function handleReject() {
    if (!selectedId || !reason.trim()) return;
    try {
      await apiRejectVendorRequest(selectedId, reason);
      toast({ title: "Request rejected" });
      setRejectOpen(false);
      setReason("");
      loadRequests();
      loadHistory();
    } catch (e: any) {
      toast({ title: "Error", description: e.message, variant: "destructive" });
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-display font-bold">All Requests</h1>

      <Tabs defaultValue="pending">
        <TabsList>
          <TabsTrigger value="pending" className="gap-1.5"><Clock className="h-3.5 w-3.5" /> Pending ({requests.length})</TabsTrigger>
          <TabsTrigger value="history" className="gap-1.5"><History className="h-3.5 w-3.5" /> History</TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="space-y-3 mt-4">
          {requests.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">No pending requests.</div>
          ) : requests.map((r) => (
            <div key={r.id} className="rounded-xl border border-border bg-card p-4 shadow-card flex items-center justify-between flex-wrap gap-3">
              <div className="min-w-0">
                <p className="text-sm font-medium">{r.student?.profile?.fullName || r.student?.email || "Student"}</p>
                <p className="text-xs text-muted-foreground capitalize">{(r.serviceType || "").replace(/_/g, " ")}</p>
                {r.message && <p className="text-xs text-muted-foreground mt-1 line-clamp-1">{r.message}</p>}
              </div>
              <div className="flex gap-2">
                <Button size="sm" onClick={() => handleApprove(r.id)}>
                  <Check className="h-3 w-3 mr-1" /> Approve
                </Button>
                <Button variant="destructive" size="sm" onClick={() => { setSelectedId(r.id); setRejectOpen(true); }}>
                  <X className="h-3 w-3 mr-1" /> Reject
                </Button>
              </div>
            </div>
          ))}
        </TabsContent>

        <TabsContent value="history" className="space-y-3 mt-4">
          {history.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">No history.</div>
          ) : history.map((r) => (
            <div key={r.id} className="rounded-xl border border-border bg-card p-4 shadow-card flex items-center justify-between flex-wrap gap-3">
              <div className="min-w-0">
                <p className="text-sm font-medium">{r.student?.profile?.fullName || r.student?.email || "Student"}</p>
                <p className="text-xs text-muted-foreground capitalize">{(r.serviceType || "").replace(/_/g, " ")}</p>
              </div>
              <StatusBadge status={r.status === "approved" ? "Approved" : r.status === "rejected" ? "Rejected" : "Completed"} />
            </div>
          ))}
        </TabsContent>
      </Tabs>

      <Dialog open={rejectOpen} onOpenChange={setRejectOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader><DialogTitle>Reject Request</DialogTitle></DialogHeader>
          <Textarea value={reason} onChange={(e) => setReason(e.target.value)} placeholder="Reason for rejection (required)" />
          <DialogFooter>
            <Button variant="outline" onClick={() => setRejectOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleReject} disabled={!reason.trim()}>Reject</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
