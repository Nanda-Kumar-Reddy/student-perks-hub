import { ClipboardList, Clock } from "lucide-react";

const requests = [
  { type: "Airport Pickup", date: "March 8, 2026", status: "Approved", response: "Your pickup has been confirmed. Driver: John M." },
  { type: "Loan Application", date: "March 5, 2026", status: "Pending", response: "Under review by our finance team." },
  { type: "Consultation Booking", date: "March 3, 2026", status: "Completed", response: "Session completed with Dr. Sarah Williams." },
  { type: "Driving Licence", date: "Feb 28, 2026", status: "In Progress", response: "Lessons scheduled. Next: March 15." },
  { type: "Airport Pickup", date: "Feb 20, 2026", status: "Rejected", response: "Service unavailable for the requested date." },
];

const statusColor: Record<string, string> = {
  Approved: "bg-success/10 text-success",
  Pending: "bg-warning/10 text-warning",
  Completed: "bg-primary/10 text-primary",
  "In Progress": "bg-accent/10 text-accent",
  Rejected: "bg-destructive/10 text-destructive",
};

export default function MyRequestsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold flex items-center gap-2"><ClipboardList className="h-6 w-6 text-primary" /> My Requests</h1>
        <p className="text-sm text-muted-foreground mt-1">Track your submitted service requests</p>
      </div>
      <div className="space-y-3">
        {requests.map((r, i) => (
          <div key={i} className="rounded-xl border border-border bg-card p-4 shadow-card">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary"><ClipboardList className="h-5 w-5" /></div>
                <div>
                  <h3 className="text-sm font-medium">{r.type}</h3>
                  <p className="text-xs text-muted-foreground flex items-center gap-1"><Clock className="h-3 w-3" /> {r.date}</p>
                </div>
              </div>
              <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${statusColor[r.status] || ""}`}>{r.status}</span>
            </div>
            <div className="mt-3 rounded-lg bg-secondary/50 p-3">
              <p className="text-xs text-muted-foreground"><span className="font-medium text-foreground">Response:</span> {r.response}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
