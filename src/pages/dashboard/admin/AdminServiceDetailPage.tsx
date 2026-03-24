/**
 * Admin Service Detail Page — shows listings for a specific service with Approve/Reject actions
 * Uses same UI as vendor, but with admin actions
 */
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Package, ClipboardList, History, Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import ListingCard, { ListingCardItem } from "@/components/shared/ListingCard";
import RejectReasonDialog from "@/components/shared/RejectReasonDialog";
import RequestDetailPopup, { RequestDetailField } from "@/components/shared/RequestDetailPopup";
import { ServiceCategory } from "@/components/shared/AddEditListingModal";

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

const loanFields: RequestDetailField[] = [
  { label: "Applicant", value: "Rahul S." }, { label: "Category", value: "Personal Loan" },
  { label: "Amount", value: "$5,000" }, { label: "Visa Status", value: "Student Visa" },
  { label: "Employment", value: "Part-time" }, { label: "Monthly Income", value: "$2,500" },
  { label: "Email", value: "rahul@email.com" }, { label: "Phone", value: "+61 400 111 222" },
];

const airportFields: RequestDetailField[] = [
  { label: "Student", value: "Priya K." }, { label: "Flight", value: "QF1" },
  { label: "Airline", value: "Qantas" }, { label: "Date", value: "March 25, 2026" },
  { label: "Passengers", value: "3" }, { label: "Luggage", value: "4" },
  { label: "Destination", value: "123 Swanston St, Melbourne" },
];

const noListings = ["loans", "airport-pickup"];

interface Props {
  serviceSlug: string;
  icon: React.ReactNode;
}

export default function AdminServiceDetailPage({ serviceSlug, icon }: Props) {
  const { toast } = useToast();
  const config = serviceLabels[serviceSlug] || { label: serviceSlug };
  const listings = demoListings[serviceSlug] || [];
  const [search, setSearch] = useState("");
  const [rejectOpen, setRejectOpen] = useState(false);
  const [requestPopup, setRequestPopup] = useState<{ open: boolean; title: string; fields: RequestDetailField[] }>({ open: false, title: "", fields: [] });

  const isRequestOnly = noListings.includes(serviceSlug);
  const filtered = listings.filter((l) => l.title.toLowerCase().includes(search.toLowerCase()));

  const openDetail = (item: ListingCardItem) => {
    const fields = serviceSlug === "loans" ? loanFields :
      serviceSlug === "airport-pickup" ? airportFields :
      [{ label: "Title", value: item.title }, { label: "Description", value: item.description || "" }, { label: "Price", value: String(item.price || "N/A") }, { label: "Status", value: item.status || "PENDING" }];
    setRequestPopup({ open: true, title: item.title, fields });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold flex items-center gap-2">{icon} {config.label}</h1>
        <p className="text-sm text-muted-foreground mt-1">Review and approve/reject {config.label.toLowerCase()} listings</p>
      </div>

      <Tabs defaultValue={isRequestOnly ? "requests" : "listings"} className="w-full">
        <TabsList>
          {!isRequestOnly && <TabsTrigger value="listings"><Package className="h-3.5 w-3.5 mr-1" /> Listings</TabsTrigger>}
          <TabsTrigger value="requests"><ClipboardList className="h-3.5 w-3.5 mr-1" /> {isRequestOnly ? "All Requests" : "Pending"}</TabsTrigger>
          <TabsTrigger value="history"><History className="h-3.5 w-3.5 mr-1" /> History</TabsTrigger>
        </TabsList>

        {!isRequestOnly && (
          <TabsContent value="listings" className="mt-4 space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Search listings..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {filtered.map((item, i) => (
                <ListingCard
                  key={item.id}
                  item={item}
                  index={i}
                  role="admin"
                  onClick={() => openDetail(item)}
                  onApprove={() => toast({ title: "Approved", description: `${item.title} is now visible.` })}
                  onReject={() => { setRejectOpen(true); }}
                />
              ))}
              {filtered.length === 0 && (
                <div className="col-span-2 text-center py-12 text-muted-foreground">
                  <Package className="h-12 w-12 mx-auto mb-3 opacity-30" />
                  <p>No listings found.</p>
                </div>
              )}
            </div>
          </TabsContent>
        )}

        <TabsContent value="requests" className="mt-4 space-y-3">
          {listings.filter((l) => l.status === "PENDING").map((item) => (
            <div key={item.id} className="rounded-xl border border-border bg-card p-4 shadow-card cursor-pointer hover:shadow-card-hover transition-all"
              onClick={() => openDetail(item)}>
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div>
                  <div className="text-sm font-medium">{item.title}</div>
                  <div className="text-xs text-muted-foreground">{item.description}</div>
                </div>
                <span className="rounded-full bg-warning/10 px-2.5 py-1 text-xs font-medium text-warning">Pending</span>
              </div>
            </div>
          ))}
        </TabsContent>

        <TabsContent value="history" className="mt-4 space-y-3">
          {listings.filter((l) => l.status === "APPROVED").map((item) => (
            <div key={item.id} className="rounded-xl border border-border bg-card p-4 shadow-card flex items-center justify-between">
              <div>
                <div className="text-sm font-medium">{item.title}</div>
                <div className="text-xs text-muted-foreground">{item.description}</div>
              </div>
              <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">Approved</span>
            </div>
          ))}
        </TabsContent>
      </Tabs>

      <RejectReasonDialog open={rejectOpen} onOpenChange={setRejectOpen} onReject={(reason) => toast({ title: "Rejected", description: reason })} />
      <RequestDetailPopup
        open={requestPopup.open}
        onOpenChange={(o) => setRequestPopup((p) => ({ ...p, open: o }))}
        title={requestPopup.title}
        status="Pending"
        fields={requestPopup.fields}
        onApprove={() => toast({ title: "Approved" })}
        onReject={(reason) => toast({ title: "Rejected", description: reason })}
      />
    </div>
  );
}
