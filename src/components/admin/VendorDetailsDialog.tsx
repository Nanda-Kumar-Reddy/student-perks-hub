/**
 * Vendor Details Dialog — admin can view vendor stats and manage services
 */
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, Users, DollarSign, Activity, Plus, Trash2, Package } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const SERVICE_TYPES = [
  "ACCOMMODATION", "CAR_RENT_SALE", "CONSULTATIONS", "ACCOUNTING",
  "DRIVING_LICENCE", "LOANS", "AIRPORT_PICKUP", "CERTIFICATIONS", "EVENTS", "JOBS",
];

const serviceLabels: Record<string, string> = {
  ACCOMMODATION: "Accommodation",
  CAR_RENT_SALE: "Car Rent/Sale",
  CONSULTATIONS: "Consultations",
  ACCOUNTING: "Accounting",
  DRIVING_LICENCE: "Driving Licence",
  LOANS: "Loans",
  AIRPORT_PICKUP: "Airport Pickup",
  CERTIFICATIONS: "Certifications",
  EVENTS: "Events",
  JOBS: "Jobs",
};

interface VendorDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  vendor: {
    id: string;
    name: string;
    email: string;
    startDate: string;
    durationDays: number;
    customersServed: number;
    totalTransactions: number;
    revenue: number;
    services: { id: string; serviceType: string; isActive: boolean }[];
  } | null;
}

export default function VendorDetailsDialog({ open, onOpenChange, vendor }: VendorDetailsDialogProps) {
  const { toast } = useToast();
  const [newService, setNewService] = useState("");

  if (!vendor) return null;

  const existingTypes = vendor.services.map((s) => s.serviceType);
  const availableServices = SERVICE_TYPES.filter((t) => !existingTypes.includes(t));

  const handleAddService = () => {
    if (!newService) return;
    toast({ title: "Service added", description: `${serviceLabels[newService]} enabled for ${vendor.name}` });
    setNewService("");
  };

  const handleRemoveService = (serviceId: string, serviceType: string) => {
    toast({ title: "Service removed", description: `${serviceLabels[serviceType]} disabled for ${vendor.name}` });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{vendor.name}</DialogTitle>
        </DialogHeader>

        <div className="space-y-5">
          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-3">
            {[
              { icon: <Calendar className="h-4 w-4" />, label: "Start Date", value: new Date(vendor.startDate).toLocaleDateString() },
              { icon: <Activity className="h-4 w-4" />, label: "Duration", value: `${vendor.durationDays} days` },
              { icon: <Users className="h-4 w-4" />, label: "Customers", value: String(vendor.customersServed) },
              { icon: <DollarSign className="h-4 w-4" />, label: "Revenue", value: `$${vendor.revenue.toLocaleString()}` },
            ].map((stat) => (
              <div key={stat.label} className="rounded-lg border border-border bg-secondary/50 p-3">
                <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                  {stat.icon} {stat.label}
                </div>
                <div className="text-sm font-bold">{stat.value}</div>
              </div>
            ))}
          </div>

          {/* Services */}
          <div>
            <h3 className="font-display text-sm font-bold mb-3 flex items-center gap-2">
              <Package className="h-4 w-4" /> Services Offered
            </h3>

            <div className="space-y-2 mb-3">
              {vendor.services.length === 0 && (
                <p className="text-sm text-muted-foreground">No services enabled yet.</p>
              )}
              {vendor.services.map((s) => (
                <div key={s.id} className="flex items-center justify-between rounded-lg border border-border bg-card p-2.5">
                  <span className="text-sm font-medium">{serviceLabels[s.serviceType] || s.serviceType}</span>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-7 w-7 p-0 text-destructive hover:bg-destructive/10"
                    onClick={() => handleRemoveService(s.id, s.serviceType)}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              ))}
            </div>

            {availableServices.length > 0 && (
              <div className="flex gap-2">
                <Select value={newService} onValueChange={setNewService}>
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder="Add service..." />
                  </SelectTrigger>
                  <SelectContent>
                    {availableServices.map((t) => (
                      <SelectItem key={t} value={t}>{serviceLabels[t]}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button size="sm" onClick={handleAddService} disabled={!newService} className="gap-1">
                  <Plus className="h-3.5 w-3.5" /> Add
                </Button>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
