/**
 * Admin Approvals Page — handles global approval workflow
 */
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ShieldCheck, CheckCircle, XCircle, Clock, Package, FileText } from "lucide-react";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import StatusBadge from "@/components/shared/StatusBadge";

const demoPending = [
  { id: "a1", entityType: "vendor_listing", action: "CREATE", requestedByName: "Desi Dhaba", entityTitle: "New Accommodation Listing", createdAt: "2026-03-20T10:00:00Z" },
  { id: "a2", entityType: "vendor_listing", action: "UPDATE", requestedByName: "TaxEasy", entityTitle: "Update Accounting Service", createdAt: "2026-03-19T14:00:00Z" },
  { id: "a3", entityType: "student_accommodation", action: "CREATE", requestedByName: "Student: Rahul S.", entityTitle: "Room near UNSW", createdAt: "2026-03-18T09:00:00Z" },
  { id: "a4", entityType: "community_task_edit", action: "UPDATE", requestedByName: "Student: Priya K.", entityTitle: "Community Task Edit", createdAt: "2026-03-17T16:00:00Z" },
];

const demoHistory = [
  { id: "h1", entityType: "vendor_listing", action: "CREATE", requestedByName: "DriveRight", entityTitle: "Driving Package", status: "APPROVED", reviewedAt: "2026-03-16" },
  { id: "h2", entityType: "vendor_listing", action: "DELETE", requestedByName: "CertPro", entityTitle: "Certification Course", status: "REJECTED", reason: "Insufficient details", reviewedAt: "2026-03-15" },
];

export default function ApprovalsPage() {
  const { toast } = useToast();
  const [rejectOpen, setRejectOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState("");

  const handleApprove = (id: string) => {
    toast({ title: "Approved", description: "The request has been approved and the requester notified." });
  };

  const handleReject = () => {
    if (!rejectReason.trim()) {
      toast({ title: "Reason required", variant: "destructive" });
      return;
    }
    toast({ title: "Rejected", description: "The requester has been notified with the reason." });
    setRejectOpen(false);
    setRejectReason("");
    setSelectedId(null);
  };

  const getTypeIcon = (type: string) => {
    if (type === "vendor_listing") return <Package className="h-4 w-4 text-primary" />;
    if (type === "student_accommodation") return <FileText className="h-4 w-4 text-accent" />;
    return <Clock className="h-4 w-4 text-muted-foreground" />;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold flex items-center gap-2">
          <ShieldCheck className="h-6 w-6 text-primary" /> Approvals
        </h1>
        <p className="text-sm text-muted-foreground mt-1">Review and manage pending approval requests</p>
      </div>

      <Tabs defaultValue="pending" className="w-full">
        <TabsList>
          <TabsTrigger value="pending">Pending ({demoPending.length})</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="mt-4 space-y-3">
          {demoPending.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="rounded-xl border border-border bg-card p-4 shadow-card"
            >
              <div className="flex items-center justify-between flex-wrap gap-3">
                <div className="flex items-start gap-3">
                  {getTypeIcon(item.entityType)}
                  <div>
                    <div className="text-sm font-medium">{item.entityTitle}</div>
                    <div className="text-xs text-muted-foreground">
                      By {item.requestedByName} · {item.action} · {item.entityType.replace(/_/g, " ")}
                    </div>
                    <div className="text-xs text-muted-foreground mt-0.5">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" className="gap-1" onClick={() => handleApprove(item.id)}>
                    <CheckCircle className="h-3 w-3" /> Approve
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="gap-1 text-destructive hover:bg-destructive/10"
                    onClick={() => { setSelectedId(item.id); setRejectOpen(true); }}
                  >
                    <XCircle className="h-3 w-3" /> Reject
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </TabsContent>

        <TabsContent value="history" className="mt-4 space-y-3">
          {demoHistory.map((item) => (
            <div key={item.id} className="rounded-xl border border-border bg-card p-4 shadow-card">
              <div className="flex items-center justify-between">
                <div className="flex items-start gap-3">
                  {getTypeIcon(item.entityType)}
                  <div>
                    <div className="text-sm font-medium">{item.entityTitle}</div>
                    <div className="text-xs text-muted-foreground">
                      By {item.requestedByName} · {item.action} · {item.reviewedAt}
                    </div>
                    {item.reason && (
                      <div className="text-xs text-destructive mt-0.5">Reason: {item.reason}</div>
                    )}
                  </div>
                </div>
                <StatusBadge status={item.status === "APPROVED" ? "Approved" : "Rejected"} />
              </div>
            </div>
          ))}
        </TabsContent>
      </Tabs>

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
