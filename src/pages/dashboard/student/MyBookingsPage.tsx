import { CalendarCheck, Clock } from "lucide-react";

const bookings = [
  { service: "Airport Pickup", date: "March 10, 2026", status: "Confirmed", vendor: "SkyRide Transfers" },
  { service: "1:1 Consultation", date: "March 12, 2026", status: "Pending", vendor: "Dr. Sarah Williams" },
  { service: "Driving Lesson", date: "March 18, 2026", status: "Completed", vendor: "DriveRight School" },
  { service: "Tax Return", date: "March 20, 2026", status: "In Progress", vendor: "TaxEasy Australia" },
];

const statusColor: Record<string, string> = {
  Confirmed: "bg-success/10 text-success",
  Pending: "bg-warning/10 text-warning",
  Completed: "bg-primary/10 text-primary",
  "In Progress": "bg-accent/10 text-accent",
};

export default function MyBookingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold flex items-center gap-2"><CalendarCheck className="h-6 w-6 text-primary" /> My Bookings</h1>
        <p className="text-sm text-muted-foreground mt-1">Track all your service bookings</p>
      </div>
      <div className="space-y-3">
        {bookings.map((b, i) => (
          <div key={i} className="rounded-xl border border-border bg-card p-4 shadow-card flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary"><CalendarCheck className="h-5 w-5" /></div>
              <div>
                <h3 className="text-sm font-medium">{b.service}</h3>
                <p className="text-xs text-muted-foreground">{b.vendor}</p>
                <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5"><Clock className="h-3 w-3" /> {b.date}</p>
              </div>
            </div>
            <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${statusColor[b.status] || ""}`}>{b.status}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
