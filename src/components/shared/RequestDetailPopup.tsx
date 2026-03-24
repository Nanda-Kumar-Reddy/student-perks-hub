/**
 * RequestDetailPopup — shows full request details with Approve/Reject (Loans, Airport Pickup, etc.)
 */
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CheckCircle, XCircle } from "lucide-react";
import StatusBadge from "./StatusBadge";
import RejectReasonDialog from "./RejectReasonDialog";
import { useState } from "react";

export interface RequestDetailField {
  label: string;
  value: string;
}

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  status?: string;
  fields: RequestDetailField[];
  showActions?: boolean;
  onApprove?: () => void;
  onReject?: (reason: string) => void;
}

export default function RequestDetailPopup({ open, onOpenChange, title, status, fields, showActions = true, onApprove, onReject }: Props) {
  const [rejectOpen, setRejectOpen] = useState(false);

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-md max-h-[85vh]">
          <DialogHeader>
            <div className="flex items-center gap-2">
              <DialogTitle className="flex-1">{title}</DialogTitle>
              {status && <StatusBadge status={status} />}
            </div>
          </DialogHeader>
          <ScrollArea className="max-h-[55vh]">
            <div className="space-y-3 pr-2">
              {fields.map((f) => (
                <div key={f.label} className="flex justify-between items-start gap-2 rounded-lg border border-border bg-secondary/30 p-3">
                  <span className="text-xs font-medium text-muted-foreground">{f.label}</span>
                  <span className="text-sm font-medium text-right max-w-[60%]">{f.value}</span>
                </div>
              ))}
            </div>
          </ScrollArea>
          {showActions && (onApprove || onReject) && (
            <DialogFooter className="flex gap-2">
              {onApprove && (
                <Button className="gap-1" onClick={() => { onApprove(); onOpenChange(false); }}>
                  <CheckCircle className="h-3.5 w-3.5" /> Approve
                </Button>
              )}
              {onReject && (
                <Button variant="outline" className="gap-1 text-destructive hover:bg-destructive/10" onClick={() => setRejectOpen(true)}>
                  <XCircle className="h-3.5 w-3.5" /> Reject
                </Button>
              )}
            </DialogFooter>
          )}
        </DialogContent>
      </Dialog>
      <RejectReasonDialog
        open={rejectOpen}
        onOpenChange={setRejectOpen}
        onReject={(reason) => { onReject?.(reason); onOpenChange(false); }}
      />
    </>
  );
}
