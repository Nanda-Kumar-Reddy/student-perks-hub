import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CalendarCheck, Clock, Search } from "lucide-react";
import StatusBadge from "@/components/shared/StatusBadge";

const bookings = [
  { service: "Airport Pickup", date: "March 10, 2026", status: "Confirmed", vendor: "SkyRide Transfers" },
  { service: "1:1 Consultation", date: "March 12, 2026", status: "Pending", vendor: "Dr. Sarah Williams" },
  { service: "Driving Lesson", date: "March 18, 2026", status: "Completed", vendor: "DriveRight School" },
  { service: "Tax Return", date: "March 20, 2026", status: "In Progress", vendor: "TaxEasy Australia" },
  { service: "Event Registration", date: "March 15, 2026", status: "Confirmed", vendor: "Welcome Week BBQ" },
];

const statuses = ["All", "Pending", "Confirmed", "Completed", "In Progress"];

export default function MyBookingsPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const filtered = bookings.filter((b) => {
    const ms = b.service.toLowerCase().includes(search.toLowerCase()) || b.vendor.toLowerCase().includes(search.toLowerCase());
    const mf = statusFilter === "All" || b.status === statusFilter;
    return ms && mf;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold flex items-center gap-2"><CalendarCheck className="h-6 w-6 text-primary" /> My Bookings</h1>
        <p className="text-sm text-muted-foreground mt-1">Track all your service bookings</p>
      </div>
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search bookings..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-40"><SelectValue /></SelectTrigger>
          <SelectContent>{statuses.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
        </Select>
      </div>
      <div className="space-y-3">
        {filtered.map((b, i) => (
          <div key={i} className="rounded-xl border border-border bg-card p-4 shadow-card flex items-center justify-between transition-all hover:shadow-card-hover">
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary"><CalendarCheck className="h-5 w-5" /></div>
              <div>
                <h3 className="text-sm font-medium">{b.service}</h3>
                <p className="text-xs text-muted-foreground">{b.vendor}</p>
                <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5"><Clock className="h-3 w-3" /> {b.date}</p>
              </div>
            </div>
            <StatusBadge status={b.status} />
          </div>
        ))}
      </div>
    </div>
  );
}
