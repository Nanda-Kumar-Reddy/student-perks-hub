/**
 * VendorListingDetailPage — wraps student detail pages with Edit/Delete actions
 * Renders the appropriate student detail page content but replaces action buttons
 */
import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Pencil, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import AddEditListingModal, { ListingFormData, ServiceCategory } from "@/components/shared/AddEditListingModal";

// Import data from student pages inline — in production this would come from API
const serviceBackLabels: Record<string, string> = {
  accommodation: "/vendor/services/accommodation",
  "car-rent-sale": "/vendor/services/car-rent-sale",
  consultations: "/vendor/services/consultations",
  accounting: "/vendor/services/accounting",
  "driving-licence": "/vendor/services/driving-licence",
  certifications: "/vendor/services/certifications",
  events: "/vendor/services/events",
  jobs: "/vendor/services/jobs",
};

export default function VendorListingDetailPage() {
  const { serviceSlug, id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [editOpen, setEditOpen] = useState(false);

  const backUrl = serviceBackLabels[serviceSlug || ""] || "/vendor/services";
  const category = (serviceSlug || "accommodation") as ServiceCategory;

  const handleDelete = () => {
    toast({ title: "Delete request submitted", description: "Admin will review the deletion request." });
    navigate(backUrl);
  };

  const handleEdit = (data: ListingFormData) => {
    toast({ title: "Edit submitted", description: "Your changes have been submitted for admin approval." });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <Button variant="ghost" size="sm" onClick={() => navigate(backUrl)} className="gap-1 text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Back to Listings
        </Button>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" className="gap-1" onClick={() => setEditOpen(true)}>
            <Pencil className="h-3.5 w-3.5" /> Edit
          </Button>
          <Button size="sm" variant="outline" className="gap-1 text-destructive hover:bg-destructive/10" onClick={handleDelete}>
            <Trash2 className="h-3.5 w-3.5" /> Delete
          </Button>
        </div>
      </div>

      {/* Render the student detail page content inline based on service type */}
      <DetailContent serviceSlug={serviceSlug || ""} id={id || ""} />

      <AddEditListingModal
        open={editOpen}
        onOpenChange={setEditOpen}
        serviceCategory={category}
        editData={{ title: "Listing " + id }}
        onSubmit={handleEdit}
      />
    </div>
  );
}

/** Lazy-render detail content based on service slug */
import { lazy, Suspense } from "react";

const AccommodationDetailPage = lazy(() => import("@/pages/dashboard/student/AccommodationDetailPage"));
const CarDetailPage = lazy(() => import("@/pages/dashboard/student/CarDetailPage"));
const ConsultantDetailPage = lazy(() => import("@/pages/dashboard/student/ConsultantDetailPage"));
const AccountingDetailPage = lazy(() => import("@/pages/dashboard/student/AccountingDetailPage"));
const DrivingLicenceDetailPage = lazy(() => import("@/pages/dashboard/student/DrivingLicenceDetailPage"));
const CertificationDetailPage = lazy(() => import("@/pages/dashboard/student/CertificationDetailPage"));
const EventDetailPage = lazy(() => import("@/pages/dashboard/student/EventDetailPage"));
const JobDetailPage = lazy(() => import("@/pages/dashboard/student/JobDetailPage"));

function DetailContent({ serviceSlug, id }: { serviceSlug: string; id: string }) {
  // For vendor detail pages, we show an inline preview of the listing
  // In production, this would fetch from API. For now, show a message with the student page structure.
  const detailMap: Record<string, string> = {
    accommodation: "Accommodation",
    "car-rent-sale": "Car Rent/Sale",
    consultations: "Consultation",
    accounting: "Accounting",
    "driving-licence": "Driving Licence",
    certifications: "Certification",
    events: "Event",
    jobs: "Job",
  };

  const label = detailMap[serviceSlug] || serviceSlug;

  return (
    <div className="rounded-xl border border-border bg-card p-6 shadow-card text-center">
      <p className="text-lg font-display font-bold">{label} Listing #{id}</p>
      <p className="text-sm text-muted-foreground mt-2">
        Full detail view — same layout as the student portal detail page.
        <br />
        Use the Edit and Delete buttons above to manage this listing.
      </p>
    </div>
  );
}
