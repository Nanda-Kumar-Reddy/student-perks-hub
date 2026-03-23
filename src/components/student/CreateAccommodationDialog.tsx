/**
 * Create Accommodation Dialog — student accommodation listing creation
 */
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";

const propertyTypes = ["Apartment", "Studio", "House", "Shared Room"];
const furnishingOptions = ["Fully Furnished", "Partially Furnished", "Unfurnished"];
const amenityOptions = ["WiFi", "Parking", "Gym", "Pool", "Laundry", "Air Conditioning", "Balcony"];

interface CreateAccommodationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function CreateAccommodationDialog({ open, onOpenChange }: CreateAccommodationDialogProps) {
  const { toast } = useToast();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [address, setAddress] = useState("");
  const [price, setPrice] = useState("");
  const [propertyType, setPropertyType] = useState("");
  const [beds, setBeds] = useState("1");
  const [baths, setBaths] = useState("1");
  const [furnishing, setFurnishing] = useState("");
  const [amenities, setAmenities] = useState<string[]>([]);

  const toggleAmenity = (amenity: string) => {
    setAmenities((prev) =>
      prev.includes(amenity) ? prev.filter((a) => a !== amenity) : [...prev, amenity]
    );
  };

  const handleSubmit = () => {
    if (!title.trim() || !address.trim() || !price.trim()) {
      toast({ title: "Missing fields", description: "Please fill in title, address, and price.", variant: "destructive" });
      return;
    }
    toast({ title: "Listing submitted", description: "Your accommodation listing has been submitted for admin approval." });
    onOpenChange(false);
    // Reset form
    setTitle(""); setDescription(""); setAddress(""); setPrice("");
    setPropertyType(""); setBeds("1"); setBaths("1"); setFurnishing("");
    setAmenities([]);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add Accommodation Listing</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium">Title *</label>
            <Input placeholder="e.g. Modern Studio near Campus" value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>

          <div>
            <label className="text-sm font-medium">Description</label>
            <Textarea placeholder="Describe the property..." value={description} onChange={(e) => setDescription(e.target.value)} rows={3} />
          </div>

          <div>
            <label className="text-sm font-medium">Address *</label>
            <Input placeholder="Full address" value={address} onChange={(e) => setAddress(e.target.value)} />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium">Price per week ($) *</label>
              <Input type="number" placeholder="0" value={price} onChange={(e) => setPrice(e.target.value)} />
            </div>
            <div>
              <label className="text-sm font-medium">Property Type</label>
              <Select value={propertyType} onValueChange={setPropertyType}>
                <SelectTrigger><SelectValue placeholder="Select..." /></SelectTrigger>
                <SelectContent>
                  {propertyTypes.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-sm font-medium">Beds</label>
              <Input type="number" min="1" value={beds} onChange={(e) => setBeds(e.target.value)} />
            </div>
            <div>
              <label className="text-sm font-medium">Baths</label>
              <Input type="number" min="1" value={baths} onChange={(e) => setBaths(e.target.value)} />
            </div>
            <div>
              <label className="text-sm font-medium">Furnishing</label>
              <Select value={furnishing} onValueChange={setFurnishing}>
                <SelectTrigger><SelectValue placeholder="Select..." /></SelectTrigger>
                <SelectContent>
                  {furnishingOptions.map((f) => <SelectItem key={f} value={f}>{f}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Amenities</label>
            <div className="flex flex-wrap gap-2">
              {amenityOptions.map((a) => (
                <label key={a} className="flex items-center gap-1.5 rounded-lg border border-border px-2.5 py-1.5 text-xs cursor-pointer hover:bg-secondary/50 transition-colors">
                  <Checkbox checked={amenities.includes(a)} onCheckedChange={() => toggleAmenity(a)} />
                  {a}
                </label>
              ))}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleSubmit}>Submit for Approval</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
