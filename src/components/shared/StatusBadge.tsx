const statusColor: Record<string, string> = {
  Pending: "bg-warning/10 text-warning",
  Confirmed: "bg-success/10 text-success",
  Approved: "bg-success/10 text-success",
  Completed: "bg-primary/10 text-primary",
  "In Progress": "bg-accent/10 text-accent",
  Rejected: "bg-destructive/10 text-destructive",
  Cancelled: "bg-destructive/10 text-destructive",
};

export default function StatusBadge({ status }: { status: string }) {
  return (
    <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${statusColor[status] || "bg-secondary text-muted-foreground"}`}>
      {status}
    </span>
  );
}
