/**
 * AdminListingDetailPage — wraps student detail pages with Approve/Reject actions
 */
import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CheckCircle, XCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import RejectReasonDialog from "@/components/shared/RejectReasonDialog";

const serviceBackLabels: Record<string, string> = {
  accommodation: "/admin/services/accommodation",
  "car-rent-sale": "/admin/services/car-rent-sale",
  consultations: "/admin/services/consultations",
  accounting: "/admin/services/accounting",
  "driving-licence": "/admin/services/driving-licence",
  certifications: "/admin/services/certifications",
  events: "/admin/services/events",
  jobs: "/admin/services/jobs",
  loans: "/admin/services/loans",
  "airport-pickup": "/admin/services/airport-pickup",
};

export default function AdminListingDetailPage() {
  const { serviceSlug, id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [rejectOpen, setRejectOpen] = useState(false);

  const backUrl = serviceBackLabels[serviceSlug || ""] || "/admin/services";

  const handleApprove = () => {
    toast({ title: "Approved", description: "The listing is now visible to students." });
    navigate(backUrl);
  };

  const handleReject = (reason: string) => {
    toast({ title: "Rejected", description: `Reason: ${reason}` });
    navigate(backUrl);
  };

  const detailMap: Record<string, string> = {
    accommodation: "Accommodation",
    "car-rent-sale": "Car Rent/Sale",
    consultations: "Consultation",
    accounting: "Accounting",
    "driving-licence": "Driving Licence",
    certifications: "Certification",
    events: "Event",
    jobs: "Job",
    loans: "Loan Request",
    "airport-pickup": "Airport Pickup Request",
  };

  const label = detailMap[serviceSlug || ""] || serviceSlug;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <Button variant="ghost" size="sm" onClick={() => navigate(backUrl)} className="gap-1 text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Back to {label}s
        </Button>
        <div className="flex gap-2">
          <Button size="sm" className="gap-1" onClick={handleApprove}>
            <CheckCircle className="h-3.5 w-3.5" /> Approve
          </Button>
          <Button size="sm" variant="outline" className="gap-1 text-destructive hover:bg-destructive/10" onClick={() => setRejectOpen(true)}>
            <XCircle className="h-3.5 w-3.5" /> Reject
          </Button>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card p-6 shadow-card text-center">
        <p className="text-lg font-display font-bold">{label} #{id}</p>
        <p className="text-sm text-muted-foreground mt-2">
          Full detail view — same layout as the student portal detail page.
          <br />
          Use the Approve and Reject buttons above to manage this listing.
        </p>
      </div>

      <RejectReasonDialog open={rejectOpen} onOpenChange={setRejectOpen} onReject={handleReject} />
    </div>
  );
}
