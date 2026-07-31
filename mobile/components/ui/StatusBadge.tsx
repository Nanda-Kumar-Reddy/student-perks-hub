import React from "react";
import { Badge } from "./Badge";
import type { RequestStatus, CommunityTaskStatus, ApprovalStatus } from "@/types";

export function StatusBadge({ status }: { status: RequestStatus | CommunityTaskStatus | ApprovalStatus | string }) {
  const s = status.toLowerCase();
  let tone: "default" | "success" | "warning" | "destructive" | "primary" = "default";
  let label = String(status);

  if (s === "pending" || s === "pending_approval") { tone = "warning"; label = "Pending"; }
  else if (s === "approved" || s === "confirmed" || s === "completed" || s === "succeeded") { tone = "success"; label = label.charAt(0).toUpperCase() + label.slice(1); }
  else if (s === "rejected" || s === "cancelled" || s === "canceled" || s === "failed") { tone = "destructive"; label = label.charAt(0).toUpperCase() + label.slice(1); }
  else if (s === "filled" || s === "flagged") { tone = "primary"; label = label.charAt(0).toUpperCase() + label.slice(1); }
  else { label = label.charAt(0).toUpperCase() + label.slice(1); }

  return <Badge tone={tone} label={label} />;
}
