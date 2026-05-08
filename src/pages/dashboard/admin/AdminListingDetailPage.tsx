/**
 * AdminListingDetailPage — renders the canonical (student) detail UI via the
 * registry with a sticky admin moderation bar (Approve / Reject + reason).
 * No placeholder content — full real listing UI is rendered.
 */
import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import RejectReasonDialog from "@/components/shared/RejectReasonDialog";
import ListingDetailRenderer from "@/components/shared/ListingDetailRenderer";

const serviceBackLabels: Record<string, { url: string; label: string }> = {
  accommodation: { url: "/admin/services/accommodation", label: "Back to Accommodation" },
  "car-rent-sale": { url: "/admin/services/car-rent-sale", label: "Back to Car Rent/Sale" },
  consultations: { url: "/admin/services/consultations", label: "Back to Consultations" },
  accounting: { url: "/admin/services/accounting", label: "Back to Accounting" },
  "driving-licence": { url: "/admin/services/driving-licence", label: "Back to Driving Licence" },
  certifications: { url: "/admin/services/certifications", label: "Back to Certifications" },
  events: { url: "/admin/services/events", label: "Back to Events" },
  jobs: { url: "/admin/services/jobs", label: "Back to Jobs" },
};

export default function AdminListingDetailPage() {
  const { serviceSlug = "", id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [rejectOpen, setRejectOpen] = useState(false);

  const back = serviceBackLabels[serviceSlug] ?? { url: "/admin/services", label: "Back to Services" };

  const handleApprove = () => {
    toast({ title: "Approved", description: "The listing is now visible to students." });
    navigate(back.url);
  };

  const handleReject = (reason: string) => {
    toast({ title: "Rejected", description: `Reason: ${reason}` });
    navigate(back.url);
  };

  return (
    <div className="space-y-4">
      {/* Sticky admin moderation bar */}
      <div className="sticky top-0 z-10 -mx-4 sm:mx-0 flex items-center justify-between flex-wrap gap-3 border-b border-border bg-background/95 px-4 sm:px-0 py-3 backdrop-blur">
        <div className="text-xs text-muted-foreground hidden sm:flex items-center gap-2">
          <span className="rounded-full bg-primary/10 px-2 py-0.5 font-medium text-primary">Admin Moderation</span>
          <span>Listing #{id}</span>
        </div>
        <div className="flex gap-2 ml-auto">
          <Button size="sm" className="gap-1" onClick={handleApprove}>
            <CheckCircle className="h-3.5 w-3.5" /> Approve
          </Button>
          <Button size="sm" variant="outline" className="gap-1 text-destructive hover:bg-destructive/10" onClick={() => setRejectOpen(true)}>
            <XCircle className="h-3.5 w-3.5" /> Reject
          </Button>
        </div>
      </div>

      <ListingDetailRenderer
        serviceSlug={serviceSlug}
        role="admin"
        backUrl={back.url}
        backLabel={back.label}
        hideStudentActions
      />

      <RejectReasonDialog open={rejectOpen} onOpenChange={setRejectOpen} onReject={handleReject} />
    </div>
  );
}
