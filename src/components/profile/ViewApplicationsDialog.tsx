import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import {
  User, Star, Clock, MapPin, CheckCircle2, XCircle, MessageCircle,
} from "lucide-react";

export interface TaskApplication {
  id: string;
  applicantName: string;
  rating: number;
  completedTasks: number;
  location: string;
  appliedAt: string;
  message: string;
  status: "pending" | "accepted" | "rejected";
}

interface ViewApplicationsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  taskTitle: string;
  applications: TaskApplication[];
  onAccept?: (applicationId: string) => void;
  onReject?: (applicationId: string) => void;
}

const statusStyles: Record<string, string> = {
  pending: "bg-warning/10 text-warning",
  accepted: "bg-success/10 text-success",
  rejected: "bg-destructive/10 text-destructive",
};

export default function ViewApplicationsDialog({
  open,
  onOpenChange,
  taskTitle,
  applications,
  onAccept,
  onReject,
}: ViewApplicationsDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[85vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-base font-display">Applications</DialogTitle>
          <p className="text-xs text-muted-foreground truncate">{taskTitle}</p>
        </DialogHeader>

        <ScrollArea className="flex-1 -mx-6 px-6">
          {applications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <User className="h-10 w-10 text-muted-foreground/40 mb-3" />
              <p className="text-sm text-muted-foreground">No applications yet</p>
            </div>
          ) : (
            <div className="space-y-3 pb-2">
              {applications.map((app) => (
                <div
                  key={app.id}
                  className="rounded-xl border border-border bg-card p-4 shadow-card"
                >
                  {/* Applicant Header */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary shrink-0">
                        <User className="h-5 w-5" />
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold">{app.applicantName}</h4>
                        <div className="flex flex-wrap items-center gap-2 mt-0.5 text-xs text-muted-foreground">
                          <span className="flex items-center gap-0.5 text-warning">
                            <Star className="h-3 w-3 fill-warning" /> {app.rating}
                          </span>
                          <span>·</span>
                          <span>{app.completedTasks} tasks done</span>
                        </div>
                      </div>
                    </div>
                    <Badge
                      variant="secondary"
                      className={`text-[10px] capitalize ${statusStyles[app.status]}`}
                    >
                      {app.status}
                    </Badge>
                  </div>

                  {/* Details */}
                  <div className="flex flex-wrap items-center gap-3 mt-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {app.location}</span>
                    <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> Applied {app.appliedAt}</span>
                  </div>

                  {/* Application Message */}
                  <div className="mt-3 rounded-lg bg-secondary/50 p-3">
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      <span className="font-medium text-foreground">Message:</span> {app.message}
                    </p>
                  </div>

                  {/* Action Buttons */}
                  {app.status === "pending" && (
                    <div className="flex gap-2 mt-3">
                      <Button
                        size="sm"
                        className="text-xs gap-1 flex-1"
                        onClick={() => onAccept?.(app.id)}
                      >
                        <CheckCircle2 className="h-3 w-3" /> Accept
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-xs gap-1 flex-1 text-destructive hover:text-destructive"
                        onClick={() => onReject?.(app.id)}
                      >
                        <XCircle className="h-3 w-3" /> Reject
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-xs gap-1"
                      >
                        <MessageCircle className="h-3 w-3" /> Chat
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
