/**
 * Reusable Add/Edit Listing Modal — full fields per service + image carousel uploader
 */
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import CarouselImageUploader from "./CarouselImageUploader";

export interface ListingFormData {
  title: string;
  description: string;
  price: string;
  location: string;
  images: string[];
  // Accommodation
  propertyType?: string;
  beds?: string;
  baths?: string;
  furnishing?: string;
  amenities?: string[];
  bond?: string;
  minLease?: string;
  features?: string;
  houseRules?: string;
  about?: string;
  // Car
  carType?: string;
  fuel?: string;
  year?: string;
  mileage?: string;
  transmission?: string;
  color?: string;
  rego?: string;
  // Event
  date?: string;
  time?: string;
  duration?: string;
  mode?: string;
  capacity?: string;
  organizer?: string;
  // Job
  company?: string;
  jobType?: string;
  salary?: string;
  requirements?: string;
  contactEmail?: string;
  // Certification
  language?: string;
  provider?: string;
  // Driving
  lessons?: string;
  includes?: string;
  [key: string]: any;
}

export type ServiceCategory =
  | "accommodation" | "car-rent-sale" | "consultations" | "accounting"
  | "driving-licence" | "loans" | "airport-pickup" | "certifications" | "events" | "jobs";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  serviceCategory: ServiceCategory;
  editData?: Partial<ListingFormData> | null;
  onSubmit: (data: ListingFormData) => void;
}

const propertyTypes = ["Apartment", "Studio", "House", "Shared Room", "Unit"];
const furnishingOptions = ["Fully Furnished", "Partially Furnished", "Unfurnished"];
const amenityOptions = ["WiFi", "Parking", "Gym", "Pool", "Laundry", "Air Conditioning", "Balcony", "Dishwasher", "Security", "Elevator"];

export default function AddEditListingModal({ open, onOpenChange, serviceCategory, editData, onSubmit }: Props) {
  const { toast } = useToast();
  const isEdit = !!editData;
  const [form, setForm] = useState<ListingFormData>({
    title: "", description: "", price: "", location: "", images: [],
  });

  useEffect(() => {
    if (editData) {
      setForm({ title: "", description: "", price: "", location: "", images: [], ...editData });
    } else {
      setForm({ title: "", description: "", price: "", location: "", images: [] });
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

  const labels: Record<string, string> = {
    accommodation: "Accommodation", "car-rent-sale": "Vehicle", consultations: "Consultation Service",
    accounting: "Accounting Service", "driving-licence": "Driving Package", loans: "Loan Product",
    "airport-pickup": "Airport Pickup", certifications: "Certification", events: "Event", jobs: "Job",
  };

  const showImages = ["accommodation", "car-rent-sale", "events", "certifications", "driving-licence", "jobs"].includes(serviceCategory);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] p-0">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle>{isEdit ? "Edit" : "Add"} {labels[serviceCategory] || "Listing"}</DialogTitle>
        </DialogHeader>
        <ScrollArea className="max-h-[65vh] px-6">
          <div className="space-y-4 pb-4">
            {/* Image Uploader */}
            {showImages && (
              <CarouselImageUploader images={form.images} onChange={(imgs) => update("images", imgs)} />
            )}

            {/* Common */}
            <div>
              <label className="text-sm font-medium">Title *</label>
              <Input placeholder="Listing title" value={form.title} onChange={(e) => update("title", e.target.value)} />
            </div>
            <div>
              <label className="text-sm font-medium">Description</label>
              <Textarea placeholder="Describe your listing..." rows={3} value={form.description} onChange={(e) => update("description", e.target.value)} />
            </div>

            {/* === ACCOMMODATION === */}
            {serviceCategory === "accommodation" && (
              <>
                <div>
                  <label className="text-sm font-medium">About the Property</label>
                  <Textarea placeholder="Detailed description..." rows={3} value={form.about || ""} onChange={(e) => update("about", e.target.value)} />
                </div>
                <div>
                  <label className="text-sm font-medium">Address *</label>
                  <Input placeholder="Full address" value={form.location} onChange={(e) => update("location", e.target.value)} />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-sm font-medium">Rent per week ($) *</label>
                    <Input type="number" placeholder="0" value={form.price} onChange={(e) => update("price", e.target.value)} />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Bond ($)</label>
                    <Input type="number" placeholder="0" value={form.bond || ""} onChange={(e) => update("bond", e.target.value)} />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="text-sm font-medium">Property Type</label>
                    <Select value={form.propertyType || ""} onValueChange={(v) => update("propertyType", v)}>
                      <SelectTrigger><SelectValue placeholder="Select..." /></SelectTrigger>
                      <SelectContent>{propertyTypes.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Beds</label>
                    <Input type="number" min="1" value={form.beds || "1"} onChange={(e) => update("beds", e.target.value)} />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Baths</label>
                    <Input type="number" min="1" value={form.baths || "1"} onChange={(e) => update("baths", e.target.value)} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-sm font-medium">Furnishing</label>
                    <Select value={form.furnishing || ""} onValueChange={(v) => update("furnishing", v)}>
                      <SelectTrigger><SelectValue placeholder="Select..." /></SelectTrigger>
                      <SelectContent>{furnishingOptions.map((f) => <SelectItem key={f} value={f}>{f}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Min Lease</label>
                    <Input placeholder="e.g. 6 months" value={form.minLease || ""} onChange={(e) => update("minLease", e.target.value)} />
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
                <div>
                  <label className="text-sm font-medium">Features (comma-separated)</label>
                  <Input placeholder="Air Con, Built-in Wardrobe, Balcony..." value={form.features || ""} onChange={(e) => update("features", e.target.value)} />
                </div>
                <div>
                  <label className="text-sm font-medium">House Rules (comma-separated)</label>
                  <Input placeholder="No smoking, No pets..." value={form.houseRules || ""} onChange={(e) => update("houseRules", e.target.value)} />
                </div>
              </>
            )}

            {/* === CAR RENT/SALE === */}
            {serviceCategory === "car-rent-sale" && (
              <>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-sm font-medium">Price *</label>
                    <Input placeholder="e.g. $250/week or $18,500" value={form.price} onChange={(e) => update("price", e.target.value)} />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Listing Type</label>
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
                        {["Petrol", "Diesel", "Electric", "Hybrid"].map((f) => <SelectItem key={f} value={f}>{f}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Mileage</label>
                    <Input value={form.mileage || ""} onChange={(e) => update("mileage", e.target.value)} placeholder="km" />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="text-sm font-medium">Transmission</label>
                    <Select value={form.transmission || ""} onValueChange={(v) => update("transmission", v)}>
                      <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Automatic">Automatic</SelectItem>
                        <SelectItem value="Manual">Manual</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Color</label>
                    <Input value={form.color || ""} onChange={(e) => update("color", e.target.value)} placeholder="e.g. White" />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Rego</label>
                    <Input value={form.rego || ""} onChange={(e) => update("rego", e.target.value)} placeholder="Rego status" />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium">Location</label>
                  <Input value={form.location} onChange={(e) => update("location", e.target.value)} placeholder="State/City" />
                </div>
              </>
            )}

            {/* === EVENTS === */}
            {serviceCategory === "events" && (
              <>
                <div className="grid grid-cols-2 gap-3">
                  <div><label className="text-sm font-medium">Date</label><Input type="date" value={form.date || ""} onChange={(e) => update("date", e.target.value)} /></div>
                  <div><label className="text-sm font-medium">Time</label><Input type="time" value={form.time || ""} onChange={(e) => update("time", e.target.value)} /></div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div><label className="text-sm font-medium">Duration</label><Input value={form.duration || ""} onChange={(e) => update("duration", e.target.value)} placeholder="e.g. 3 hours" /></div>
                  <div>
                    <label className="text-sm font-medium">Mode</label>
                    <Select value={form.mode || ""} onValueChange={(v) => update("mode", v)}>
                      <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                      <SelectContent><SelectItem value="Online">Online</SelectItem><SelectItem value="Offline">Offline</SelectItem></SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div><label className="text-sm font-medium">Location / Venue</label><Input value={form.location} onChange={(e) => update("location", e.target.value)} placeholder="Venue" /></div>
                  <div><label className="text-sm font-medium">Capacity</label><Input type="number" value={form.capacity || ""} onChange={(e) => update("capacity", e.target.value)} /></div>
                </div>
                <div><label className="text-sm font-medium">Organizer</label><Input value={form.organizer || ""} onChange={(e) => update("organizer", e.target.value)} /></div>
                <div><label className="text-sm font-medium">Price (leave blank if free)</label><Input value={form.price} onChange={(e) => update("price", e.target.value)} placeholder="$0" /></div>
              </>
            )}

            {/* === JOBS === */}
            {serviceCategory === "jobs" && (
              <>
                <div className="grid grid-cols-2 gap-3">
                  <div><label className="text-sm font-medium">Company</label><Input value={form.company || ""} onChange={(e) => update("company", e.target.value)} /></div>
                  <div>
                    <label className="text-sm font-medium">Job Type</label>
                    <Select value={form.jobType || ""} onValueChange={(v) => update("jobType", v)}>
                      <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                      <SelectContent>
                        {["Full-time", "Part-time", "Casual", "Contract"].map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div><label className="text-sm font-medium">Salary</label><Input value={form.salary || ""} onChange={(e) => update("salary", e.target.value)} placeholder="e.g. $75k-90k" /></div>
                  <div>
                    <label className="text-sm font-medium">Mode</label>
                    <Select value={form.mode || ""} onValueChange={(v) => update("mode", v)}>
                      <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                      <SelectContent><SelectItem value="Online">Remote</SelectItem><SelectItem value="Offline">On-site</SelectItem><SelectItem value="Hybrid">Hybrid</SelectItem></SelectContent>
                    </Select>
                  </div>
                </div>
                <div><label className="text-sm font-medium">Location</label><Input value={form.location} onChange={(e) => update("location", e.target.value)} /></div>
                <div><label className="text-sm font-medium">Requirements (comma-separated)</label><Input value={form.requirements || ""} onChange={(e) => update("requirements", e.target.value)} placeholder="3+ years React, Valid work rights..." /></div>
                <div><label className="text-sm font-medium">Contact Email</label><Input type="email" value={form.contactEmail || ""} onChange={(e) => update("contactEmail", e.target.value)} /></div>
              </>
            )}

            {/* === CERTIFICATIONS === */}
            {serviceCategory === "certifications" && (
              <>
                <div className="grid grid-cols-2 gap-3">
                  <div><label className="text-sm font-medium">Duration</label><Input value={form.duration || ""} onChange={(e) => update("duration", e.target.value)} placeholder="e.g. 4 hours" /></div>
                  <div><label className="text-sm font-medium">Price ($)</label><Input value={form.price} onChange={(e) => update("price", e.target.value)} /></div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div><label className="text-sm font-medium">Location</label><Input value={form.location} onChange={(e) => update("location", e.target.value)} /></div>
                  <div><label className="text-sm font-medium">Language</label><Input value={form.language || ""} onChange={(e) => update("language", e.target.value)} placeholder="English" /></div>
                </div>
                <div><label className="text-sm font-medium">Provider</label><Input value={form.provider || ""} onChange={(e) => update("provider", e.target.value)} /></div>
              </>
            )}

            {/* === DRIVING LICENCE === */}
            {serviceCategory === "driving-licence" && (
              <>
                <div className="grid grid-cols-2 gap-3">
                  <div><label className="text-sm font-medium">Price ($)</label><Input value={form.price} onChange={(e) => update("price", e.target.value)} /></div>
                  <div><label className="text-sm font-medium">Lessons Included</label><Input value={form.lessons || ""} onChange={(e) => update("lessons", e.target.value)} placeholder="e.g. 10 x 1hr" /></div>
                </div>
                <div><label className="text-sm font-medium">Location</label><Input value={form.location} onChange={(e) => update("location", e.target.value)} /></div>
                <div><label className="text-sm font-medium">Includes (comma-separated)</label><Input value={form.includes || ""} onChange={(e) => update("includes", e.target.value)} placeholder="Test prep, Mock test..." /></div>
              </>
            )}

            {/* === CONSULTATIONS / ACCOUNTING === */}
            {(serviceCategory === "consultations" || serviceCategory === "accounting") && (
              <>
                <div className="grid grid-cols-2 gap-3">
                  <div><label className="text-sm font-medium">Price</label><Input value={form.price} onChange={(e) => update("price", e.target.value)} placeholder="e.g. $80/session" /></div>
                  <div><label className="text-sm font-medium">Duration</label><Input value={form.duration || ""} onChange={(e) => update("duration", e.target.value)} placeholder="e.g. 1 hour" /></div>
                </div>
                <div><label className="text-sm font-medium">Location / Mode</label><Input value={form.location} onChange={(e) => update("location", e.target.value)} placeholder="City or Online" /></div>
              </>
            )}

            {/* === LOANS / AIRPORT PICKUP === */}
            {(serviceCategory === "loans" || serviceCategory === "airport-pickup") && (
              <div className="grid grid-cols-2 gap-3">
                <div><label className="text-sm font-medium">Price ($)</label><Input value={form.price} onChange={(e) => update("price", e.target.value)} /></div>
                <div><label className="text-sm font-medium">Location</label><Input value={form.location} onChange={(e) => update("location", e.target.value)} /></div>
              </div>
            )}
          </div>
        </ScrollArea>
        <DialogFooter className="p-6 pt-0">
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleSubmit}>{isEdit ? "Submit Update for Approval" : "Submit for Approval"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
