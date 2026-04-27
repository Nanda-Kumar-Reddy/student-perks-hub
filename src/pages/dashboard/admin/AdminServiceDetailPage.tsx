/**
 * Admin Service Detail Page — moderation workflow
 *
 * Two tabs share the same ListingCard UI:
 *   • Listing tab  → APPROVED items only, with "Stop Showing" / "Show Again" toggle
 *   • Pending tab  → PENDING items only, with Approve / Reject actions
 *
 * Clicking the card body navigates to the per-item admin detail page.
 */
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Package, ClipboardList, History, Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import ListingCard, { ListingCardItem } from "@/components/shared/ListingCard";
import RejectReasonDialog from "@/components/shared/RejectReasonDialog";

const demoListings: Record<string, ListingCardItem[]> = {
  accommodation: [
    { id: "a1", title: "Modern Studio CBD", description: "Bright studio near campus", price: "$280/week", status: "PENDING", emoji: "🏠" },
    { id: "a2", title: "Shared 2BR Apartment", description: "Affordable shared living", price: "$180/week", status: "PENDING", emoji: "🏢" },
    { id: "a3", title: "Luxury 1BR Unit", description: "Premium living", price: "$350/week", status: "APPROVED", emoji: "🏙️" },
  ],
  "car-rent-sale": [
    { id: "c1", title: "Toyota Corolla 2024", description: "Reliable sedan", price: "$250/week", status: "PENDING", emoji: "🚗", badges: ["Rent"] },
    { id: "c2", title: "Honda Civic 2023", description: "Great condition", price: "$14,200", status: "APPROVED", emoji: "🚗", badges: ["Sale"] },
  ],
  consultations: [
    { id: "co1", title: "Career Counseling", description: "1-hour session", price: "$120/session", status: "PENDING" },
  ],
  accounting: [
    { id: "ac1", title: "Student Tax Return", description: "Full tax lodgement", price: "$49", status: "PENDING" },
  ],
  "driving-licence": [
    { id: "d1", title: "10 Lessons Pack", description: "10 x 1hr lessons + test prep", price: "$650", status: "APPROVED" },
    { id: "d2", title: "Premium Package", description: "20 lessons + 2 test bookings", price: "$1,100", status: "PENDING" },
  ],
  loans: [
    { id: "l1", title: "Personal Loan — Rahul S.", description: "Student personal loan $5,000", price: "$5,000", status: "PENDING" },
  ],
  "airport-pickup": [
    { id: "ap1", title: "QF1 — Melbourne Airport", description: "3 passengers, 4 luggage", status: "PENDING" },
  ],
  certifications: [
    { id: "ce1", title: "RSA Certificate", description: "Responsible Service of Alcohol", price: "$120", status: "APPROVED", emoji: "🍷" },
    { id: "ce2", title: "First Aid & CPR", description: "Full day course", price: "$180", status: "PENDING", emoji: "🏥" },
  ],
  events: [
    { id: "e1", title: "Welcome Week BBQ", description: "Semester kick-off event", status: "APPROVED", emoji: "🎉" },
    { id: "e2", title: "Career Fair 2026", description: "Connect with employers", status: "PENDING", emoji: "💼" },
  ],
  jobs: [
    { id: "j1", title: "Software Engineer — TechCorp", description: "Full-time role", price: "$75k-90k", status: "APPROVED", badges: ["Full-time"] },
    { id: "j2", title: "Barista — Bean Counter", description: "Part-time role", price: "$25-28/hr", status: "PENDING", badges: ["Part-time"] },
  ],
};

const serviceLabels: Record<string, { label: string }> = {
  accommodation: { label: "Accommodation" },
  "car-rent-sale": { label: "Car Rent/Sale" },
  consultations: { label: "Consultations" },
  accounting: { label: "Accounting" },
  "driving-licence": { label: "Driving Licence" },
  loans: { label: "Loans" },
  "airport-pickup": { label: "Airport Pickup" },
  certifications: { label: "Certifications" },
  events: { label: "Events" },
  jobs: { label: "Jobs" },
};

const noListings = ["loans", "airport-pickup"];

interface Props {
  serviceSlug: string;
  icon: React.ReactNode;
}

type ReasonAction = { type: "reject" | "stop"; itemId: string } | null;

export default function AdminServiceDetailPage({ serviceSlug, icon }: Props) {
  const { toast } = useToast();
  const navigate = useNavigate();
  const config = serviceLabels[serviceSlug] || { label: serviceSlug };
  const seed = demoListings[serviceSlug] || [];

  // Local state — initialise visibility flag for approved items.
  const [items, setItems] = useState<ListingCardItem[]>(() =>
    seed.map((it) => ({ ...it, isVisible: it.status === "APPROVED" ? true : it.isVisible }))
  );
  const [search, setSearch] = useState("");
  const [reasonAction, setReasonAction] = useState<ReasonAction>(null);
  const [pendingId, setPendingId] = useState<string | null>(null);

  const isRequestOnly = noListings.includes(serviceSlug);

  const approved = useMemo(
    () => items.filter((l) => l.status === "APPROVED" && l.title.toLowerCase().includes(search.toLowerCase())),
    [items, search]
  );
  const pending = useMemo(() => items.filter((l) => l.status === "PENDING"), [items]);
  const history = useMemo(() => items.filter((l) => l.status === "APPROVED" || l.status === "REJECTED"), [items]);

  const navigateToDetail = (itemId: string) => navigate(`/admin/services/${serviceSlug}/${itemId}`);

  // ───────── Action handlers (optimistic; swap for real API calls) ─────────
  const withLoading = async (id: string, fn: () => void | Promise<void>) => {
    setPendingId(id);
    try {
      await fn();
    } catch (err) {
      toast({ title: "Action failed", description: (err as Error).message || "Please try again.", variant: "destructive" });
    } finally {
      setPendingId(null);
    }
  };

  const approveItem = (itemId: string) =>
    withLoading(itemId, () => {
      setItems((prev) => prev.map((it) => (it.id === itemId ? { ...it, status: "APPROVED", isVisible: true } : it)));
      toast({ title: "Approved", description: "Item is now visible to users." });
    });

  const rejectItem = (itemId: string, reason: string) =>
    withLoading(itemId, () => {
      setItems((prev) => prev.map((it) => (it.id === itemId ? { ...it, status: "REJECTED" } : it)));
      toast({ title: "Rejected", description: reason });
    });

  const stopShowing = (itemId: string, reason: string) =>
    withLoading(itemId, () => {
      setItems((prev) => prev.map((it) => (it.id === itemId ? { ...it, isVisible: false } : it)));
      toast({ title: "Hidden", description: `Item hidden. Reason: ${reason}` });
    });

  const showAgain = (itemId: string) =>
    withLoading(itemId, () => {
      setItems((prev) => prev.map((it) => (it.id === itemId ? { ...it, isVisible: true } : it)));
      toast({ title: "Visible", description: "Item is showing again." });
    });

  const handleReasonSubmit = (reason: string) => {
    if (!reasonAction) return;
    if (reasonAction.type === "reject") rejectItem(reasonAction.itemId, reason);
    else stopShowing(reasonAction.itemId, reason);
    setReasonAction(null);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold flex items-center gap-2">{icon} {config.label}</h1>
        <p className="text-sm text-muted-foreground mt-1">Moderate {config.label.toLowerCase()} listings across the platform</p>
      </div>

      <Tabs defaultValue={isRequestOnly ? "requests" : "listings"} className="w-full">
        <TabsList>
          {!isRequestOnly && <TabsTrigger value="listings"><Package className="h-3.5 w-3.5 mr-1" /> Listings</TabsTrigger>}
          <TabsTrigger value="requests"><ClipboardList className="h-3.5 w-3.5 mr-1" /> {isRequestOnly ? "All Requests" : "Pending"}</TabsTrigger>
          <TabsTrigger value="history"><History className="h-3.5 w-3.5 mr-1" /> History</TabsTrigger>
        </TabsList>

        {/* ─────────────── LISTING TAB (Approved only) ─────────────── */}
        {!isRequestOnly && (
          <TabsContent value="listings" className="mt-4 space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Search listings..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {approved.map((item, i) => (
                <ListingCard
                  key={item.id}
                  item={item}
                  index={i}
                  role="admin"
                  adminMode="listing"
                  loading={pendingId === item.id}
                  onClick={() => navigateToDetail(item.id)}
                  onStopShowing={() => setReasonAction({ type: "stop", itemId: item.id })}
                  onShowAgain={() => showAgain(item.id)}
                />
              ))}
              {approved.length === 0 && (
                <div className="col-span-2 text-center py-12 text-muted-foreground">
                  <Package className="h-12 w-12 mx-auto mb-3 opacity-30" />
                  <p>No approved listings.</p>
                </div>
              )}
            </div>
          </TabsContent>
        )}

        {/* ─────────────── PENDING TAB (same card UI) ─────────────── */}
        <TabsContent value="requests" className="mt-4 space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            {pending.map((item, i) => (
              <ListingCard
                key={item.id}
                item={item}
                index={i}
                role="admin"
                adminMode="pending"
                loading={pendingId === item.id}
                onClick={() => navigateToDetail(item.id)}
                onApprove={() => approveItem(item.id)}
                onReject={() => setReasonAction({ type: "reject", itemId: item.id })}
              />
            ))}
            {pending.length === 0 && (
              <div className="col-span-2 text-center py-12 text-muted-foreground">
                <ClipboardList className="h-12 w-12 mx-auto mb-3 opacity-30" />
                <p>No pending items.</p>
              </div>
            )}
          </div>
        </TabsContent>

        {/* ─────────────── HISTORY TAB ─────────────── */}
        <TabsContent value="history" className="mt-4 space-y-3">
          {history.map((item) => (
            <div key={item.id} className="rounded-xl border border-border bg-card p-4 shadow-card flex items-center justify-between">
              <div>
                <div className="text-sm font-medium">{item.title}</div>
                <div className="text-xs text-muted-foreground">{item.description}</div>
              </div>
              <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${item.status === "APPROVED" ? "bg-primary/10 text-primary" : "bg-destructive/10 text-destructive"}`}>
                {item.status === "APPROVED" ? "Approved" : "Rejected"}
              </span>
            </div>
          ))}
          {history.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              <History className="h-12 w-12 mx-auto mb-3 opacity-30" />
              <p>No history yet.</p>
            </div>
          )}
        </TabsContent>
      </Tabs>

      <RejectReasonDialog
        open={reasonAction !== null}
        onOpenChange={(o) => !o && setReasonAction(null)}
        onReject={handleReasonSubmit}
        title={reasonAction?.type === "stop" ? "Reason for hiding" : "Rejection Reason"}
      />
    </div>
  );
}
