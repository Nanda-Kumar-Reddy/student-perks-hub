import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CheckCircle2 } from "lucide-react";

interface PartnerModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const serviceTypes = ["Restaurant", "Café", "Gym", "Hostel", "Bookstore", "Salon", "Services", "Other"];

export default function PartnerModal({ open, onOpenChange }: PartnerModalProps) {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: "", serviceType: "", location: "", phone: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.serviceType) e.serviceType = "Service type is required";
    if (!form.location.trim()) e.location = "Location is required";
    if (!form.phone.trim()) e.phone = "Phone number is required";
    else if (!/^\d{7,15}$/.test(form.phone.trim())) e.phone = "Enter a valid phone number";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) setSubmitted(true);
  };

  const handleClose = () => {
    onOpenChange(false);
    setTimeout(() => {
      setSubmitted(false);
      setForm({ name: "", serviceType: "", location: "", phone: "" });
      setErrors({});
    }, 200);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        {submitted ? (
          <div className="flex flex-col items-center py-8 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <CheckCircle2 className="h-8 w-8 text-primary" />
            </div>
            <h3 className="mt-4 font-display text-xl font-bold">Thank You!</h3>
            <p className="mt-2 text-sm text-muted-foreground max-w-xs">
              Thank you for your interest in partnering with us. Our team will contact you soon.
            </p>
            <Button className="mt-6" onClick={handleClose}>Close</Button>
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="font-display">Partner With Us</DialogTitle>
              <DialogDescription>Fill in your details and we'll get in touch.</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 mt-2">
              <div>
                <Label htmlFor="partner-name">Name</Label>
                <Input id="partner-name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Your name" />
                {errors.name && <p className="text-xs text-destructive mt-1">{errors.name}</p>}
              </div>
              <div>
                <Label htmlFor="service-type">Service Type</Label>
                <Select value={form.serviceType} onValueChange={(v) => setForm({ ...form, serviceType: v })}>
                  <SelectTrigger><SelectValue placeholder="Select service type" /></SelectTrigger>
                  <SelectContent>
                    {serviceTypes.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                  </SelectContent>
                </Select>
                {errors.serviceType && <p className="text-xs text-destructive mt-1">{errors.serviceType}</p>}
              </div>
              <div>
                <Label htmlFor="location">Business Location</Label>
                <Input id="location" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} placeholder="City, Area" />
                {errors.location && <p className="text-xs text-destructive mt-1">{errors.location}</p>}
              </div>
              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input id="phone" type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value.replace(/\D/g, "") })} placeholder="Your phone number" />
                {errors.phone && <p className="text-xs text-destructive mt-1">{errors.phone}</p>}
              </div>
              <Button type="submit" className="w-full">Submit</Button>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
