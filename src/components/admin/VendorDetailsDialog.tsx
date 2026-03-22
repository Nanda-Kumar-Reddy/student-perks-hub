/**
 * Admin Vendor Details Dialog — Shows vendor profile, stats, and service controls
 */
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Plus, X, Users, DollarSign, CalendarDays, Clock } from "lucide-react";
import { apiGetAdminVendorDetails, apiAdminAddVendorService, apiAdminRemoveVendorService } from "@/services/api";

const ALL_SERVICE_TYPES = [
  "accommodation", "car_rent_sale", "consultations", "accounting",
  "driving_licence", "loans", "airport_pickup", "certifications", "events", "jobs",
];

const SERVICE_LABELS: Record<string, string> = {
  accommodation: "Accommodation", car_rent_sale: "Car Rent/Sale",
  consultations: "Consultations", accounting: "Accounting",
  driving_licence: "Driving Licence", loans: "Loans",
  airport_pickup: "Airport Pickup", certifications: "Certifications",
  events: "Events", jobs: "Jobs",
};

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  vendorUserId: string;
}

export default function VendorDetailsDialog({ open, onOpenChange, vendorUserId }: Props) {
  const { toast } = useToast();
  const [details, setDetails] = useState<any>(null);
  const [addServiceType, setAddServiceType] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open && vendorUserId) loadDetails();
  }, [open, vendorUserId]);

  async function loadDetails() {
    setLoading(true);
    try {
      const data = await apiGetAdminVendorDetails(vendorUserId);
      setDetails(data);
    } catch { setDetails(null); }
    setLoading(false);
  }

  async function handleAddService() {
    if (!addServiceType || !details?.vendorProfile?.id) return;
    try {
      await apiAdminAddVendorService(details.vendorProfile.id, addServiceType);
      toast({ title: "Service added" });
      setAddServiceType("");
      loadDetails();
    } catch (e: any) {
      toast({ title: "Error", description: e.message, variant: "destructive" });
    }
  }

  async function handleRemoveService(serviceType: string) {
    if (!details?.vendorProfile?.id) return;
    try {
      await apiAdminRemoveVendorService(details.vendorProfile.id, serviceType);
      toast({ title: "Service disabled" });
      loadDetails();
    } catch (e: any) {
      toast({ title: "Error", description: e.message, variant: "destructive" });
    }
  }

  const currentServiceTypes = details?.vendorProfile?.services?.map((s: any) => s.serviceType) || [];
  const availableTypes = ALL_SERVICE_TYPES.filter((t) => !currentServiceTypes.includes(t));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{details?.vendorProfile?.businessName || details?.profile?.fullName || "Vendor Details"}</DialogTitle>
        </DialogHeader>

        {loading ? (
          <div className="py-8 text-center text-muted-foreground">Loading...</div>
        ) : details ? (
          <div className="space-y-5">
            {/* Stats */}
            <div className="grid grid-cols-2 gap-3">
              {[
                { icon: <CalendarDays className="h-4 w-4" />, label: "Start Date", value: new Date(details.startDate).toLocaleDateString() },
                { icon: <Clock className="h-4 w-4" />, label: "Duration", value: `${details.durationDays} days` },
                { icon: <Users className="h-4 w-4" />, label: "Customers", value: details.customersServed },
                { icon: <DollarSign className="h-4 w-4" />, label: "Revenue", value: `$${Number(details.totalRevenue).toFixed(2)}` },
              ].map((s) => (
                <div key={s.label} className="rounded-lg border border-border bg-secondary/50 p-3 text-center">
                  <div className="flex items-center justify-center gap-1 text-muted-foreground mb-1">{s.icon}<span className="text-xs">{s.label}</span></div>
                  <div className="font-bold text-sm">{s.value}</div>
                </div>
              ))}
            </div>

            {/* Transactions count */}
            <div className="text-sm text-muted-foreground">
              Total Transactions: <span className="font-medium text-foreground">{details._count?.transactions || 0}</span>
            </div>

            {/* Services Offered */}
            <div>
              <h3 className="font-medium text-sm mb-2">Services Offered</h3>
              <div className="space-y-2">
                {details.vendorProfile?.services?.map((s: any) => (
                  <div key={s.id} className="flex items-center justify-between rounded-lg bg-secondary/50 px-3 py-2">
                    <div>
                      <span className="text-sm font-medium">{SERVICE_LABELS[s.serviceType] || s.serviceType}</span>
                      <span className={`ml-2 text-xs ${s.adminEnabled ? "text-success" : "text-destructive"}`}>
                        {s.adminEnabled ? "Active" : "Disabled"}
                      </span>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => handleRemoveService(s.serviceType)}>
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>

              {/* Add service */}
              {availableTypes.length > 0 && (
                <div className="flex gap-2 mt-3">
                  <Select value={addServiceType} onValueChange={setAddServiceType}>
                    <SelectTrigger className="flex-1">
                      <SelectValue placeholder="Add a service..." />
                    </SelectTrigger>
                    <SelectContent>
                      {availableTypes.map((t) => (
                        <SelectItem key={t} value={t}>{SERVICE_LABELS[t]}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button size="sm" onClick={handleAddService} disabled={!addServiceType}>
                    <Plus className="h-3 w-3 mr-1" /> Add
                  </Button>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="py-8 text-center text-muted-foreground">Vendor not found.</div>
        )}
      </DialogContent>
    </Dialog>
  );
}
