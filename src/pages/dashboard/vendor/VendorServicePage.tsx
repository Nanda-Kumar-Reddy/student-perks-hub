/**
 * Enhanced Vendor Service Page — dynamic per service type
 * Accommodation/Car/Events/Jobs/Certifications/Driving → Listings + Requests + History
 * Consultations/Accounting → Profile + Services + Requests
 * Loans/Airport Pickup → Requests + History only
 */
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Package, ClipboardList, History, Search, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import ListingCard, { ListingCardItem } from "@/components/shared/ListingCard";
import AddEditListingModal, { ServiceCategory, ListingFormData } from "@/components/shared/AddEditListingModal";
import RejectReasonDialog from "@/components/shared/RejectReasonDialog";
import RequestDetailPopup, { RequestDetailField } from "@/components/shared/RequestDetailPopup";
import VendorProfileTab, { VendorProfile } from "@/components/shared/VendorProfileTab";

interface VendorServicePageProps {
  serviceType: string;
  serviceLabel: string;
  icon: React.ReactNode;
}

const typeToCategory: Record<string, ServiceCategory> = {
  ACCOMMODATION: "accommodation", CAR_RENT_SALE: "car-rent-sale", CONSULTATIONS: "consultations",
  ACCOUNTING: "accounting", DRIVING_LICENCE: "driving-licence", LOANS: "loans",
  AIRPORT_PICKUP: "airport-pickup", CERTIFICATIONS: "certifications", EVENTS: "events", JOBS: "jobs",
};

const typeToSlug: Record<string, string> = {
  ACCOMMODATION: "accommodation", CAR_RENT_SALE: "car-rent-sale", CONSULTATIONS: "consultations",
  ACCOUNTING: "accounting", DRIVING_LICENCE: "driving-licence", LOANS: "loans",
  AIRPORT_PICKUP: "airport-pickup", CERTIFICATIONS: "certifications", EVENTS: "events", JOBS: "jobs",
};

const noListingsServices = ["AIRPORT_PICKUP", "LOANS"];
const profileServices = ["CONSULTATIONS", "ACCOUNTING", "DRIVING_LICENCE"];

function getDemoListings(serviceType: string): ListingCardItem[] {
  const demos: Record<string, ListingCardItem[]> = {
    ACCOMMODATION: [
      { id: "1", title: "Modern Studio CBD", description: "Bright studio near campus", price: "$280/week", status: "APPROVED", emoji: "🏠" },
      { id: "2", title: "Shared 2BR Apartment", description: "Affordable shared living", price: "$180/week", status: "PENDING", emoji: "🏢" },
    ],
    CAR_RENT_SALE: [
      { id: "1", title: "Toyota Corolla 2024", description: "Reliable sedan, low mileage", price: "$250/week", status: "APPROVED", emoji: "🚗", badges: ["Rent"] },
      { id: "2", title: "Honda Civic 2023", description: "Great condition", price: "$14,200", status: "PENDING", emoji: "🚗", badges: ["Sale"] },
    ],
    CONSULTATIONS: [
      { id: "1", title: "Career Counseling Session", description: "1-hour career guidance", price: "$120/session", status: "APPROVED" },
    ],
    ACCOUNTING: [
      { id: "1", title: "Student Tax Return", description: "Full tax return lodgement", price: "$49", status: "APPROVED" },
    ],
    DRIVING_LICENCE: [
      { id: "1", title: "Standard Package", description: "10 lessons + test booking", price: "$650", status: "APPROVED" },
      { id: "2", title: "Premium Package", description: "20 lessons + 2 test bookings", price: "$1,100", status: "APPROVED" },
    ],
    CERTIFICATIONS: [
      { id: "1", title: "RSA Certificate", description: "Responsible Service of Alcohol", price: "$120", status: "APPROVED", emoji: "🍷" },
    ],
    EVENTS: [
      { id: "1", title: "Welcome Week BBQ", description: "Free food and drinks", status: "APPROVED", emoji: "🎉" },
    ],
    JOBS: [
      { id: "1", title: "Software Engineer", description: "Full-time role in Melbourne", price: "$75k-90k", status: "APPROVED", badges: ["Full-time"] },
      { id: "2", title: "Barista", description: "Part-time café role", price: "$25-28/hr", status: "PENDING", badges: ["Part-time"] },
    ],
  };
  return demos[serviceType] || [];
}

const demoRequests = [
  { id: "r1", name: "Rahul S.", message: "Interested in this service", date: "Mar 18, 2026", status: "Pending" },
  { id: "r2", name: "Priya K.", message: "Can I get more details?", date: "Mar 15, 2026", status: "Pending" },
];

const demoHistory = [
  { id: "h1", name: "Amit D.", message: "Completed booking", date: "Mar 10, 2026", status: "Approved" },
  { id: "h2", name: "Sarah L.", message: "Service completed", date: "Mar 5, 2026", status: "Completed" },
];

const loanRequestFields: RequestDetailField[] = [
  { label: "Category", value: "Personal Loan" }, { label: "Description", value: "Need funds for tuition fees" },
  { label: "Min Amount", value: "$5,000" }, { label: "Max Amount", value: "$10,000" },
  { label: "Visa Status", value: "Student Visa" }, { label: "Monthly Income", value: "$2,500" },
  { label: "Employment", value: "Part-time" }, { label: "Email", value: "student@email.com" },
  { label: "Phone", value: "+61 400 111 222" },
];

const airportRequestFields: RequestDetailField[] = [
  { label: "Visiting Type", value: "First Time" }, { label: "Airline", value: "Qantas" },
  { label: "Flight Number", value: "QF1" }, { label: "Arrival Date", value: "March 25, 2026" },
  { label: "Arrival Time", value: "14:30" }, { label: "Passengers", value: "3" },
  { label: "Luggage", value: "4" }, { label: "Destination", value: "123 Swanston St, Melbourne VIC 3000" },
  { label: "Phone", value: "+61 400 333 444" },
];

const defaultProfile: VendorProfile = {
  name: "Dr. Sarah Williams", headline: "Immigration & Career Consultant", responseTime: "< 2 hours",
  about: "Experienced consultant specializing in immigration, visa extensions, and career guidance for international students.",
  qualifications: ["PhD Education", "MARA Registered Agent", "Career Counseling Cert IV"],
  expertise: ["Immigration", "Visa Extensions", "Career Coaching", "Resume Review"],
  languages: ["English", "Mandarin", "Hindi"],
};

const drivingProfile: VendorProfile = {
  name: "DriveRight School", headline: "Certified Driving School", responseTime: "< 4 hours",
  about: "Melbourne's trusted driving school with certified instructors.",
  qualifications: ["VicRoads Certified", "Fully Insured", "10+ Years Experience"],
  expertise: ["Manual", "Automatic", "International Conversion", "Hazard Training"],
  languages: ["English", "Hindi", "Mandarin"],
  schoolName: "DriveRight Driving School", location: "Melbourne, VIC", timing: "8:00 AM – 6:00 PM",
  whyChooseUs: "95% first-test pass rate. Flexible scheduling. Dual-controlled modern vehicles.",
};

export default function VendorServicePage({ serviceType, serviceLabel, icon }: VendorServicePageProps) {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [createOpen, setCreateOpen] = useState(false);
  const [editData, setEditData] = useState<Partial<ListingFormData> | null>(null);
  const [rejectOpen, setRejectOpen] = useState(false);
  const [requestPopup, setRequestPopup] = useState<{ open: boolean; title: string; fields: RequestDetailField[] }>({ open: false, title: "", fields: [] });
  const [profile, setProfile] = useState<VendorProfile>(serviceType === "DRIVING_LICENCE" ? drivingProfile : defaultProfile);

  const listings = getDemoListings(serviceType);
  const showListings = !noListingsServices.includes(serviceType);
  const showProfile = profileServices.includes(serviceType);
  const category = typeToCategory[serviceType] || "accommodation";
  const slug = typeToSlug[serviceType] || "accommodation";

  const filtered = listings.filter((l) => l.title.toLowerCase().includes(search.toLowerCase()));

  const handleCreate = (data: ListingFormData) => {
    toast({ title: "Submitted for approval", description: `Your ${serviceLabel.toLowerCase()} listing has been submitted.` });
  };

  const handleEdit = (item: ListingCardItem) => {
    setEditData({ title: item.title, description: item.description, price: String(item.price || "") });
    setCreateOpen(true);
  };

  const navigateToDetail = (itemId: string) => {
    navigate(`/vendor/services/${slug}/${itemId}`);
  };

  const openRequestDetail = (req: typeof demoRequests[0]) => {
    const fields = serviceType === "LOANS" ? loanRequestFields :
      serviceType === "AIRPORT_PICKUP" ? airportRequestFields :
      [{ label: "Student", value: req.name }, { label: "Message", value: req.message }, { label: "Date", value: req.date }];
    setRequestPopup({ open: true, title: `${req.name} — ${serviceLabel} Request`, fields });
  };

  const defaultTab = showProfile ? "profile" : showListings ? "listings" : "requests";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold flex items-center gap-2">{icon} {serviceLabel}</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage your {serviceLabel.toLowerCase()} listings and requests</p>
        </div>
        {showListings && (
          <Button onClick={() => { setEditData(null); setCreateOpen(true); }} className="gap-1">
            <Plus className="h-4 w-4" /> Add Listing
          </Button>
        )}
      </div>

      <Tabs defaultValue={defaultTab} className="w-full">
        <TabsList>
          {showProfile && <TabsTrigger value="profile"><User className="h-3.5 w-3.5 mr-1" /> Profile</TabsTrigger>}
          {showListings && <TabsTrigger value="listings"><Package className="h-3.5 w-3.5 mr-1" /> Listings</TabsTrigger>}
          <TabsTrigger value="requests"><ClipboardList className="h-3.5 w-3.5 mr-1" /> Requests</TabsTrigger>
          <TabsTrigger value="history"><History className="h-3.5 w-3.5 mr-1" /> History</TabsTrigger>
        </TabsList>

        {showProfile && (
          <TabsContent value="profile" className="mt-4">
            <VendorProfileTab
              profile={profile}
              onSave={(p) => { setProfile(p); toast({ title: "Profile updated" }); }}
              showSlots={false}
              variant={serviceType === "DRIVING_LICENCE" ? "driving" : "consultation"}
            />
          </TabsContent>
        )}

        {showListings && (
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
                  role="vendor"
                  onClick={() => navigateToDetail(item.id)}
                  onView={() => navigateToDetail(item.id)}
                  onEdit={() => handleEdit(item)}
                  onDelete={() => toast({ title: "Delete request submitted", description: "Admin will review." })}
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
          {demoRequests.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <ClipboardList className="h-12 w-12 mx-auto mb-3 opacity-30" />
              <p>No pending requests.</p>
            </div>
          ) : (
            demoRequests.map((req) => (
              <div key={req.id} className="rounded-xl border border-border bg-card p-4 shadow-card cursor-pointer hover:shadow-card-hover transition-all"
                onClick={() => openRequestDetail(req)}>
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div>
                    <div className="text-sm font-medium">{req.name}</div>
                    <div className="text-xs text-muted-foreground">{req.message}</div>
                    <div className="text-xs text-muted-foreground mt-1">{req.date}</div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" onClick={(e) => { e.stopPropagation(); toast({ title: "Approved" }); }}>Approve</Button>
                    <Button size="sm" variant="outline" className="text-destructive hover:bg-destructive/10"
                      onClick={(e) => { e.stopPropagation(); setRejectOpen(true); }}>Reject</Button>
                  </div>
                </div>
              </div>
            ))
          )}
        </TabsContent>

        <TabsContent value="history" className="mt-4 space-y-3">
          {demoHistory.map((h) => (
            <div key={h.id} className="rounded-xl border border-border bg-card p-4 shadow-card flex items-center justify-between">
              <div>
                <div className="text-sm font-medium">{h.name}</div>
                <div className="text-xs text-muted-foreground">{h.message}</div>
                <div className="text-xs text-muted-foreground mt-1">{h.date}</div>
              </div>
              <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${h.status === "Approved" ? "bg-primary/10 text-primary" : "bg-secondary text-muted-foreground"}`}>
                {h.status}
              </span>
            </div>
          ))}
        </TabsContent>
      </Tabs>

      <AddEditListingModal open={createOpen} onOpenChange={setCreateOpen} serviceCategory={category} editData={editData} onSubmit={handleCreate} />
      <RejectReasonDialog open={rejectOpen} onOpenChange={setRejectOpen} onReject={(reason) => toast({ title: "Rejected", description: "Reason sent to student." })} />
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