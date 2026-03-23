/**
 * Reusable Reject Reason Dialog — used by Vendor and Admin portals
 */
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onReject: (reason: string) => void;
  title?: string;
}

export default function RejectReasonDialog({ open, onOpenChange, onReject, title = "Rejection Reason" }: Props) {
  const { toast } = useToast();
  const [reason, setReason] = useState("");

  const handleReject = () => {
    if (!reason.trim()) {
      toast({ title: "Reason required", description: "Please provide a reason for rejection.", variant: "destructive" });
      return;
    }
    onReject(reason);
    setReason("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <Textarea
          placeholder="Provide a reason for rejection (required)..."
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          rows={3}
        />
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button variant="destructive" onClick={handleReject}>Reject</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
