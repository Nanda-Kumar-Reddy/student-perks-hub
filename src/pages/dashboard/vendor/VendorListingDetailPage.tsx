/**
 * VendorListingDetailPage — renders the canonical (student) detail UI for the
 * given service via the registry, with a sticky vendor action bar (Edit / Delete).
 * No placeholder content — full real listing UI is rendered.
 */
import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Pencil, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import AddEditListingModal, { ListingFormData, ServiceCategory } from "@/components/shared/AddEditListingModal";
import ListingDetailRenderer from "@/components/shared/ListingDetailRenderer";

const serviceBackLabels: Record<string, { url: string; label: string }> = {
  accommodation: { url: "/vendor/services/accommodation", label: "Back to Accommodation" },
  "car-rent-sale": { url: "/vendor/services/car-rent-sale", label: "Back to Car Rent/Sale" },
  consultations: { url: "/vendor/services/consultations", label: "Back to Consultations" },
  accounting: { url: "/vendor/services/accounting", label: "Back to Accounting" },
  "driving-licence": { url: "/vendor/services/driving-licence", label: "Back to Driving Licence" },
  certifications: { url: "/vendor/services/certifications", label: "Back to Certifications" },
  events: { url: "/vendor/services/events", label: "Back to Events" },
  jobs: { url: "/vendor/services/jobs", label: "Back to Jobs" },
};

export default function VendorListingDetailPage() {
  const { serviceSlug = "", id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [editOpen, setEditOpen] = useState(false);

  const back = serviceBackLabels[serviceSlug] ?? { url: "/vendor/services", label: "Back to Services" };
  const category = (serviceSlug || "accommodation") as ServiceCategory;

  const handleDelete = () => {
    toast({ title: "Delete request submitted", description: "Admin will review the deletion request." });
    navigate(back.url);
  };

  const handleEdit = (_data: ListingFormData) => {
    toast({ title: "Edit submitted", description: "Your changes have been submitted for admin approval." });
  };

  return (
    <div className="space-y-4">
      {/* Sticky vendor action bar */}
      <div className="sticky top-0 z-10 -mx-4 sm:mx-0 flex items-center justify-between flex-wrap gap-3 border-b border-border bg-background/95 px-4 sm:px-0 py-3 backdrop-blur">
        <div className="text-xs text-muted-foreground hidden sm:flex items-center gap-2">
          <span className="rounded-full bg-primary/10 px-2 py-0.5 font-medium text-primary">Vendor View</span>
          <span>Listing #{id}</span>
        </div>
        <div className="flex gap-2 ml-auto">
          <Button size="sm" variant="outline" className="gap-1" onClick={() => setEditOpen(true)}>
            <Pencil className="h-3.5 w-3.5" /> Edit
          </Button>
          <Button size="sm" variant="outline" className="gap-1 text-destructive hover:bg-destructive/10" onClick={handleDelete}>
            <Trash2 className="h-3.5 w-3.5" /> Delete
          </Button>
        </div>
      </div>

      <ListingDetailRenderer
        serviceSlug={serviceSlug}
        role="vendor"
        backUrl={back.url}
        backLabel={back.label}
        hideStudentActions
      />

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
