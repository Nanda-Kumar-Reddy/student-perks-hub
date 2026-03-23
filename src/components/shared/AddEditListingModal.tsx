/**
 * Reusable Add/Edit Listing Modal — adapts fields based on service type
 */
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";

export interface ListingFormData {
  title: string;
  description: string;
  price: string;
  location: string;
  // Accommodation-specific
  propertyType?: string;
  beds?: string;
  baths?: string;
  furnishing?: string;
  amenities?: string[];
  // Car-specific
  carType?: string;
  fuel?: string;
  year?: string;
  mileage?: string;
  // Event-specific
  date?: string;
  duration?: string;
  mode?: string;
  // Job-specific
  company?: string;
  jobType?: string;
  salary?: string;
  // Generic
  [key: string]: any;
}

export type ServiceCategory =
  | "accommodation"
  | "car-rent-sale"
  | "consultations"
  | "accounting"
  | "driving-licence"
  | "loans"
  | "airport-pickup"
  | "certifications"
  | "events"
  | "jobs";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  serviceCategory: ServiceCategory;
  editData?: Partial<ListingFormData> | null;
  onSubmit: (data: ListingFormData) => void;
}

const propertyTypes = ["Apartment", "Studio", "House", "Shared Room"];
const furnishingOptions = ["Fully Furnished", "Partially Furnished", "Unfurnished"];
const amenityOptions = ["WiFi", "Parking", "Gym", "Pool", "Laundry", "Air Conditioning", "Balcony"];

export default function AddEditListingModal({ open, onOpenChange, serviceCategory, editData, onSubmit }: Props) {
  const { toast } = useToast();
  const isEdit = !!editData;
  const [form, setForm] = useState<ListingFormData>({
    title: "", description: "", price: "", location: "",
  });

  useEffect(() => {
    if (editData) {
      setForm({ title: "", description: "", price: "", location: "", ...editData });
    } else {
      setForm({ title: "", description: "", price: "", location: "" });
    }
  }, [editData, open]);

  const update = (key: string, value: any) => setForm((p) => ({ ...p, [key]: value }));

  const toggleAmenity = (a: string) => {
    const current = form.amenities || [];
    update("amenities", current.includes(a) ? current.filter((x: string) => x !== a) : [...current, a]);
  };

  const handleSubmit = () => {
    if (!form.title.trim()) {
      toast({ title: "Title is required", variant: "destructive" });
      return;
    }
    onSubmit(form);
    onOpenChange(false);
  };

  const getTitle = () => {
    const labels: Record<string, string> = {
      accommodation: "Accommodation", "car-rent-sale": "Vehicle", consultations: "Consultation Service",
      accounting: "Accounting Service", "driving-licence": "Driving Package", loans: "Loan Product",
      "airport-pickup": "Airport Pickup", certifications: "Certification", events: "Event", jobs: "Job",
    };
    return `${isEdit ? "Edit" : "Add"} ${labels[serviceCategory] || "Listing"}`;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{getTitle()}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {/* Common fields */}
          <div>
            <label className="text-sm font-medium">Title *</label>
            <Input placeholder="Listing title" value={form.title} onChange={(e) => update("title", e.target.value)} />
          </div>
          <div>
            <label className="text-sm font-medium">Description</label>
            <Textarea placeholder="Describe your listing..." rows={3} value={form.description} onChange={(e) => update("description", e.target.value)} />
          </div>

          {/* Accommodation fields */}
          {serviceCategory === "accommodation" && (
            <>
              <div>
                <label className="text-sm font-medium">Address *</label>
                <Input placeholder="Full address" value={form.location} onChange={(e) => update("location", e.target.value)} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium">Price per week ($) *</label>
                  <Input type="number" placeholder="0" value={form.price} onChange={(e) => update("price", e.target.value)} />
                </div>
                <div>
                  <label className="text-sm font-medium">Property Type</label>
                  <Select value={form.propertyType || ""} onValueChange={(v) => update("propertyType", v)}>
                    <SelectTrigger><SelectValue placeholder="Select..." /></SelectTrigger>
                    <SelectContent>{propertyTypes.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-sm font-medium">Beds</label>
                  <Input type="number" min="1" value={form.beds || "1"} onChange={(e) => update("beds", e.target.value)} />
                </div>
                <div>
                  <label className="text-sm font-medium">Baths</label>
                  <Input type="number" min="1" value={form.baths || "1"} onChange={(e) => update("baths", e.target.value)} />
                </div>
                <div>
                  <label className="text-sm font-medium">Furnishing</label>
                  <Select value={form.furnishing || ""} onValueChange={(v) => update("furnishing", v)}>
                    <SelectTrigger><SelectValue placeholder="Select..." /></SelectTrigger>
                    <SelectContent>{furnishingOptions.map((f) => <SelectItem key={f} value={f}>{f}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Amenities</label>
                <div className="flex flex-wrap gap-2">
                  {amenityOptions.map((a) => (
                    <label key={a} className="flex items-center gap-1.5 rounded-lg border border-border px-2.5 py-1.5 text-xs cursor-pointer hover:bg-secondary/50 transition-colors">
                      <Checkbox checked={(form.amenities || []).includes(a)} onCheckedChange={() => toggleAmenity(a)} />
                      {a}
                    </label>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Car fields */}
          {serviceCategory === "car-rent-sale" && (
            <>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium">Price *</label>
                  <Input placeholder="e.g. $250/week or $18,500" value={form.price} onChange={(e) => update("price", e.target.value)} />
                </div>
                <div>
                  <label className="text-sm font-medium">Type</label>
                  <Select value={form.carType || ""} onValueChange={(v) => update("carType", v)}>
                    <SelectTrigger><SelectValue placeholder="Rent / Sale" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="rent">Rent</SelectItem>
                      <SelectItem value="sale">Sale</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-sm font-medium">Year</label>
                  <Input value={form.year || ""} onChange={(e) => update("year", e.target.value)} placeholder="2024" />
                </div>
                <div>
                  <label className="text-sm font-medium">Fuel</label>
                  <Select value={form.fuel || ""} onValueChange={(v) => update("fuel", v)}>
                    <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Petrol">Petrol</SelectItem>
                      <SelectItem value="Diesel">Diesel</SelectItem>
                      <SelectItem value="Electric">Electric</SelectItem>
                      <SelectItem value="Hybrid">Hybrid</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium">Mileage</label>
                  <Input value={form.mileage || ""} onChange={(e) => update("mileage", e.target.value)} placeholder="km" />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium">Location</label>
                <Input value={form.location} onChange={(e) => update("location", e.target.value)} placeholder="State/City" />
              </div>
            </>
          )}

          {/* Events fields */}
          {serviceCategory === "events" && (
            <>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium">Date</label>
                  <Input type="date" value={form.date || ""} onChange={(e) => update("date", e.target.value)} />
                </div>
                <div>
                  <label className="text-sm font-medium">Duration</label>
                  <Input value={form.duration || ""} onChange={(e) => update("duration", e.target.value)} placeholder="e.g. 3 hours" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium">Mode</label>
                  <Select value={form.mode || ""} onValueChange={(v) => update("mode", v)}>
                    <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Online">Online</SelectItem>
                      <SelectItem value="Offline">Offline</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium">Location</label>
                  <Input value={form.location} onChange={(e) => update("location", e.target.value)} placeholder="Venue" />
                </div>
              </div>
            </>
          )}

          {/* Jobs fields */}
          {serviceCategory === "jobs" && (
            <>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium">Company</label>
                  <Input value={form.company || ""} onChange={(e) => update("company", e.target.value)} placeholder="Company name" />
                </div>
                <div>
                  <label className="text-sm font-medium">Job Type</label>
                  <Select value={form.jobType || ""} onValueChange={(v) => update("jobType", v)}>
                    <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Full-time">Full-time</SelectItem>
                      <SelectItem value="Part-time">Part-time</SelectItem>
                      <SelectItem value="Casual">Casual</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium">Salary</label>
                  <Input value={form.salary || ""} onChange={(e) => update("salary", e.target.value)} placeholder="e.g. $25-28/hr" />
                </div>
                <div>
                  <label className="text-sm font-medium">Location</label>
                  <Input value={form.location} onChange={(e) => update("location", e.target.value)} placeholder="City" />
                </div>
              </div>
            </>
          )}

          {/* Certifications fields */}
          {serviceCategory === "certifications" && (
            <>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium">Duration</label>
                  <Input value={form.duration || ""} onChange={(e) => update("duration", e.target.value)} placeholder="e.g. 4 hours" />
                </div>
                <div>
                  <label className="text-sm font-medium">Price ($)</label>
                  <Input value={form.price} onChange={(e) => update("price", e.target.value)} placeholder="0" />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium">Location</label>
                <Input value={form.location} onChange={(e) => update("location", e.target.value)} placeholder="Address" />
              </div>
            </>
          )}

          {/* Driving Licence fields */}
          {serviceCategory === "driving-licence" && (
            <>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium">Price ($)</label>
                  <Input value={form.price} onChange={(e) => update("price", e.target.value)} placeholder="0" />
                </div>
                <div>
                  <label className="text-sm font-medium">Location</label>
                  <Input value={form.location} onChange={(e) => update("location", e.target.value)} placeholder="City" />
                </div>
              </div>
            </>
          )}

          {/* Consultations / Accounting fields */}
          {(serviceCategory === "consultations" || serviceCategory === "accounting") && (
            <>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium">Price</label>
                  <Input value={form.price} onChange={(e) => update("price", e.target.value)} placeholder="e.g. $80/session" />
                </div>
                <div>
                  <label className="text-sm font-medium">Location</label>
                  <Input value={form.location} onChange={(e) => update("location", e.target.value)} placeholder="City or Online" />
                </div>
              </div>
            </>
          )}

          {/* Generic price + location for remaining */}
          {(serviceCategory === "loans" || serviceCategory === "airport-pickup") && (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-medium">Price ($)</label>
                <Input value={form.price} onChange={(e) => update("price", e.target.value)} placeholder="0" />
              </div>
              <div>
                <label className="text-sm font-medium">Location</label>
                <Input value={form.location} onChange={(e) => update("location", e.target.value)} placeholder="Location" />
              </div>
            </div>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleSubmit}>
            {isEdit ? "Submit Update for Approval" : "Submit for Approval"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
