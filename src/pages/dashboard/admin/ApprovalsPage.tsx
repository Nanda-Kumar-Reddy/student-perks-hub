/**
 * Admin Approvals Page — Shows pending approval queue and history
 */
import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Check, X, Clock, History, ShieldCheck } from "lucide-react";
import StatusBadge from "@/components/shared/StatusBadge";
import { apiGetAdminApprovals, apiAdminApprove, apiAdminReject, apiGetAdminApprovalHistory } from "@/services/api";

export default function AdminApprovalsPage() {
  const { toast } = useToast();
  const [pending, setPending] = useState<any[]>([]);
  const [history, setHistory] = useState<any[]>([]);
  const [rejectOpen, setRejectOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [reason, setReason] = useState("");
  const [notesOpen, setNotesOpen] = useState(false);
  const [notes, setNotes] = useState("");

  useEffect(() => {
    loadPending();
    loadHistory();
  }, []);

  async function loadPending() {
    try {
      const res = await apiGetAdminApprovals();
      setPending(res.data || []);
    } catch { setPending([]); }
  }

  async function loadHistory() {
    try {
      const res = await apiGetAdminApprovalHistory();
      setHistory(res.data || []);
    } catch { setHistory([]); }
  }

  async function handleApprove() {
    if (!selectedId) return;
    try {
      await apiAdminApprove(selectedId, notes || undefined);
      toast({ title: "Approved" });
      setNotesOpen(false);
      setNotes("");
      loadPending();
      loadHistory();
    } catch (e: any) {
      toast({ title: "Error", description: e.message, variant: "destructive" });
    }
  }

  async function handleReject() {
    if (!selectedId || !reason.trim()) return;
    try {
      await apiAdminReject(selectedId, reason);
      toast({ title: "Rejected" });
      setRejectOpen(false);
      setReason("");
      loadPending();
      loadHistory();
    } catch (e: any) {
      toast({ title: "Error", description: e.message, variant: "destructive" });
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <ShieldCheck className="h-6 w-6 text-primary" />
        <h1 className="text-2xl font-display font-bold">Approval Queue</h1>
      </div>

      <Tabs defaultValue="pending">
        <TabsList>
          <TabsTrigger value="pending" className="gap-1.5"><Clock className="h-3.5 w-3.5" /> Pending ({pending.length})</TabsTrigger>
          <TabsTrigger value="history" className="gap-1.5"><History className="h-3.5 w-3.5" /> History</TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="space-y-3 mt-4">
          {pending.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">No pending approvals.</div>
          ) : pending.map((a) => (
            <div key={a.id} className="rounded-xl border border-border bg-card p-4 shadow-card">
              <div className="flex items-center justify-between flex-wrap gap-3">
                <div className="min-w-0">
                  <p className="text-sm font-medium capitalize">{(a.actionType || "").replace(/_/g, " ")}</p>
                  <p className="text-xs text-muted-foreground">
                    By: {a.requester?.vendorProfile?.businessName || a.requester?.profile?.fullName || a.requester?.email || "Unknown"}
                  </p>
                  <p className="text-xs text-muted-foreground capitalize">Type: {(a.entityType || "").replace(/_/g, " ")}</p>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" onClick={() => { setSelectedId(a.id); setNotesOpen(true); }}>
                    <Check className="h-3 w-3 mr-1" /> Approve
                  </Button>
                  <Button variant="destructive" size="sm" onClick={() => { setSelectedId(a.id); setRejectOpen(true); }}>
                    <X className="h-3 w-3 mr-1" /> Reject
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </TabsContent>

        <TabsContent value="history" className="space-y-3 mt-4">
          {history.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">No history.</div>
          ) : history.map((a) => (
            <div key={a.id} className="rounded-xl border border-border bg-card p-4 shadow-card">
              <div className="flex items-center justify-between flex-wrap gap-3">
                <div className="min-w-0">
                  <p className="text-sm font-medium capitalize">{(a.actionType || "").replace(/_/g, " ")}</p>
                  <p className="text-xs text-muted-foreground">
                    By: {a.requester?.vendorProfile?.businessName || a.requester?.profile?.fullName || "Unknown"}
                  </p>
                  {a.admin && <p className="text-xs text-muted-foreground">Handled by: {a.admin?.profile?.fullName || a.admin?.email}</p>}
                </div>
                <StatusBadge status={a.status === "approved" ? "Approved" : "Rejected"} />
              </div>
            </div>
          ))}
        </TabsContent>
      </Tabs>

      {/* Approve Dialog */}
      <Dialog open={notesOpen} onOpenChange={setNotesOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader><DialogTitle>Approve</DialogTitle></DialogHeader>
          <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Admin notes (optional)" />
          <DialogFooter>
            <Button variant="outline" onClick={() => setNotesOpen(false)}>Cancel</Button>
            <Button onClick={handleApprove}>Approve</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reject Dialog */}
      <Dialog open={rejectOpen} onOpenChange={setRejectOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader><DialogTitle>Reject</DialogTitle></DialogHeader>
          <Textarea value={reason} onChange={(e) => setReason(e.target.value)} placeholder="Reason (required)" />
          <DialogFooter>
            <Button variant="outline" onClick={() => setRejectOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleReject} disabled={!reason.trim()}>Reject</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
