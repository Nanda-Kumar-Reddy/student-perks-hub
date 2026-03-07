import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Home, Bed, Bath, Search, MapPin, CheckCircle, Wifi, Car as CarIcon, Dumbbell, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import RequestsListTab from "@/components/shared/RequestsListTab";

const properties = [
  { id: 1, title: "Modern Studio Apartment", rent: "$280/week", address: "123 Swanston St, Melbourne", beds: 1, baths: 1, furnishing: "Fully Furnished", available: true, type: "Studio", listed: "2d ago", desc: "Bright and modern studio in the heart of CBD.", images: ["🏠", "🛋️", "🍳"], amenities: ["WiFi", "Parking", "Gym"] },
  { id: 2, title: "Shared 2BR Apartment", rent: "$180/week", address: "45 Elizabeth St, Sydney", beds: 2, baths: 1, furnishing: "Partially Furnished", available: true, type: "Apartment", listed: "5d ago", desc: "Affordable shared apartment near campus.", images: ["🏢", "🛏️", "🚿"], amenities: ["WiFi", "Laundry"] },
  { id: 3, title: "Student House Room", rent: "$150/week", address: "78 Queen St, Brisbane", beds: 1, baths: 1, furnishing: "Unfurnished", available: false, type: "Shared Room", listed: "1w ago", desc: "Single room in a student share house.", images: ["🏡", "🛏️"], amenities: ["WiFi"] },
  { id: 4, title: "Luxury 1BR Unit", rent: "$350/week", address: "200 Collins St, Melbourne", beds: 1, baths: 1, furnishing: "Fully Furnished", available: true, type: "Apartment", listed: "3d ago", desc: "Premium living with gym and pool access.", images: ["🏙️", "🏊", "💪"], amenities: ["WiFi", "Parking", "Gym", "Pool"] },
];

const bookings = [
  { id: 1, title: "Modern Studio Apartment", subtitle: "123 Swanston St, Melbourne", date: "March 5, 2026", status: "Confirmed" },
  { id: 2, title: "Shared 2BR Apartment", subtitle: "45 Elizabeth St, Sydney", date: "Feb 20, 2026", status: "Pending" },
];

const amenityIcon: Record<string, React.ReactNode> = {
  WiFi: <Wifi className="h-3 w-3" />,
  Parking: <CarIcon className="h-3 w-3" />,
  Gym: <Dumbbell className="h-3 w-3" />,
};

const types = ["All", "Apartment", "House", "Studio", "Shared Room"];
const furnishingOptions = ["All", "Fully Furnished", "Partially Furnished", "Unfurnished"];

const furnishingBadge = (f: string) => {
  const colors: Record<string, string> = {
    "Fully Furnished": "bg-primary/10 text-primary",
    "Partially Furnished": "bg-warning/10 text-warning",
    "Unfurnished": "bg-muted text-muted-foreground",
  };
  return colors[f] || "bg-muted text-muted-foreground";
};

export default function AccommodationsPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");
  const [furnishingFilter, setFurnishingFilter] = useState("All");

  const filtered = properties.filter((p) => {
    const matchSearch = p.title.toLowerCase().includes(search.toLowerCase()) || p.address.toLowerCase().includes(search.toLowerCase());
    const matchType = typeFilter === "All" || p.type === typeFilter;
    const matchFurnishing = furnishingFilter === "All" || p.furnishing === furnishingFilter;
    return matchSearch && matchType && matchFurnishing;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold flex items-center gap-2"><Home className="h-6 w-6 text-primary" /> Accommodations</h1>
        <p className="text-sm text-muted-foreground mt-1">Find your perfect student accommodation</p>
      </div>
      <Tabs defaultValue="find" className="w-full">
        <TabsList>
          <TabsTrigger value="find">Find Accommodation</TabsTrigger>
          <TabsTrigger value="bookings">My Bookings</TabsTrigger>
        </TabsList>
        <TabsContent value="find" className="mt-4 space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Search by location or name..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
            </div>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-full sm:w-40"><SelectValue /></SelectTrigger>
              <SelectContent>{types.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
            </Select>
            <Select value={furnishingFilter} onValueChange={setFurnishingFilter}>
              <SelectTrigger className="w-full sm:w-48"><SelectValue /></SelectTrigger>
              <SelectContent>{furnishingOptions.map((f) => <SelectItem key={f} value={f}>{f}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {filtered.map((p, i) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08, duration: 0.3 }}
                onClick={() => navigate(`/student/accommodations/${p.id}`)}
                className="cursor-pointer rounded-xl border border-border bg-card shadow-card overflow-hidden transition-all hover:shadow-card-hover hover:border-primary/30 group"
              >
                <div className="relative flex h-32 items-center justify-center bg-secondary text-5xl">
                  {p.images[0]}
                  {p.available && (
                    <span className="absolute top-2 left-2 flex items-center gap-1 rounded-full bg-primary/10 backdrop-blur-sm border border-primary/20 px-2 py-0.5 text-[10px] font-medium text-primary">
                      <CheckCircle className="h-2.5 w-2.5" /> Verified
                    </span>
                  )}
                </div>
                <div className="p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="font-display text-sm font-bold">{p.title}</h3>
                    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${furnishingBadge(p.furnishing)}`}>
                      {p.furnishing}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground flex items-center gap-1"><MapPin className="h-3 w-3" /> {p.address}</p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span className="rounded-full bg-secondary px-2 py-0.5">{p.type}</span>
                    <span>Listed {p.listed}</span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {p.amenities.map((a) => (
                      <span key={a} className="flex items-center gap-0.5 rounded-full bg-secondary px-1.5 py-0.5 text-[10px] font-medium">{amenityIcon[a]} {a}</span>
                    ))}
                  </div>
                  <div className="flex items-center justify-between pt-1">
                    <div className="flex gap-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><Bed className="h-3 w-3" /> {p.beds}</span>
                      <span className="flex items-center gap-1"><Bath className="h-3 w-3" /> {p.baths}</span>
                    </div>
                    <span className="font-display text-sm font-bold text-primary">{p.rent}</span>
                  </div>
                  <div className="pt-1">
                    <Button size="sm" variant="outline" className="w-full gap-1 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                      View Details <ArrowRight className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </TabsContent>
        <TabsContent value="bookings" className="mt-4">
          <RequestsListTab requests={bookings} emptyMessage="No accommodation bookings yet." />
        </TabsContent>
      </Tabs>
    </div>
  );
}
