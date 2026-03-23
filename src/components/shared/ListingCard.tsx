/**
 * Reusable ListingCard — used across Student, Vendor, and Admin portals
 * Role determines which action buttons appear.
 */
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, CheckCircle, XCircle, ArrowRight, Eye } from "lucide-react";
import { motion } from "framer-motion";
import StatusBadge from "@/components/shared/StatusBadge";

export interface ListingCardItem {
  id: string;
  title: string;
  description?: string;
  price?: string | number;
  status?: string; // PENDING | APPROVED | REJECTED
  emoji?: string;
  imageUrl?: string;
  badges?: string[];
  meta?: { label: string; value: string }[];
  createdAt?: string;
}

export type ListingRole = "student" | "vendor" | "admin";

interface ListingCardProps {
  item: ListingCardItem;
  index?: number;
  role: ListingRole;
  onClick?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  onApprove?: () => void;
  onReject?: () => void;
  onView?: () => void;
}

function statusLabel(s?: string) {
  if (!s) return undefined;
  const map: Record<string, string> = { PENDING: "Pending", APPROVED: "Approved", REJECTED: "Rejected" };
  return map[s] || s;
}

export default function ListingCard({
  item, index = 0, role, onClick, onEdit, onDelete, onApprove, onReject, onView,
}: ListingCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06 }}
      onClick={onClick}
      className={`rounded-xl border border-border bg-card shadow-card overflow-hidden transition-all hover:shadow-card-hover ${onClick ? "cursor-pointer hover:border-primary/30" : ""}`}
    >
      {item.emoji && (
        <div className="flex h-28 items-center justify-center bg-secondary text-5xl">
          {item.emoji}
        </div>
      )}
      <div className="p-4 space-y-2">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <h3 className="font-display text-sm font-bold truncate">{item.title}</h3>
            {item.description && (
              <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{item.description}</p>
            )}
          </div>
          {item.status && <StatusBadge status={statusLabel(item.status) || item.status} />}
        </div>

        {item.badges && item.badges.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {item.badges.map((b) => (
              <span key={b} className="rounded-full bg-secondary px-2 py-0.5 text-[10px] font-medium">{b}</span>
            ))}
          </div>
        )}

        {item.meta && item.meta.length > 0 && (
          <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
            {item.meta.map((m) => (
              <span key={m.label}>{m.label}: {m.value}</span>
            ))}
          </div>
        )}

        {item.price && (
          <div className="font-display text-sm font-bold text-primary">
            {typeof item.price === "number" ? `$${item.price}` : item.price}
          </div>
        )}

        {/* Role-based actions */}
        <div className="flex flex-wrap gap-2 pt-1">
          {(role === "student" || role === "vendor") && onView && (
            <Button size="sm" variant="outline" className="gap-1" onClick={(e) => { e.stopPropagation(); onView(); }}>
              <Eye className="h-3 w-3" /> View
            </Button>
          )}
          {(role === "student" || role === "vendor") && onEdit && (
            <Button size="sm" variant="outline" className="gap-1" onClick={(e) => { e.stopPropagation(); onEdit(); }}>
              <Pencil className="h-3 w-3" /> Edit
            </Button>
          )}
          {(role === "student" || role === "vendor") && onDelete && (
            <Button size="sm" variant="outline" className="gap-1 text-destructive hover:bg-destructive/10" onClick={(e) => { e.stopPropagation(); onDelete(); }}>
              <Trash2 className="h-3 w-3" /> Delete
            </Button>
          )}
          {role === "admin" && onApprove && (
            <Button size="sm" className="gap-1" onClick={(e) => { e.stopPropagation(); onApprove(); }}>
              <CheckCircle className="h-3 w-3" /> Approve
            </Button>
          )}
          {role === "admin" && onReject && (
            <Button size="sm" variant="outline" className="gap-1 text-destructive hover:bg-destructive/10" onClick={(e) => { e.stopPropagation(); onReject(); }}>
              <XCircle className="h-3 w-3" /> Reject
            </Button>
          )}
          {!onEdit && !onDelete && !onApprove && !onReject && !onView && onClick && (
            <Button size="sm" variant="outline" className="gap-1 w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
              View Details <ArrowRight className="h-3 w-3" />
            </Button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
