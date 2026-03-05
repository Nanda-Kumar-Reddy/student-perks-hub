import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Home, Bed, Bath, Search, MapPin, CheckCircle, ChevronLeft, ChevronRight, MessageCircle, Phone, Mail, Wifi, Car as CarIcon, Dumbbell } from "lucide-react";
import RequestsListTab from "@/components/shared/RequestsListTab";

const properties = [
  { id: 1, title: "Modern Studio Apartment", rent: "$280/week", address: "123 Swanston St, Melbourne", beds: 1, baths: 1, furnishing: "Fully Furnished", available: true, type: "Studio", listed: "2d ago", desc: "Bright and modern studio in the heart of CBD. Close to universities and public transport.", images: ["🏠", "🛋️", "🍳"], amenities: ["WiFi", "Parking", "Gym"], ownerPhone: "+61 400 111 222", ownerEmail: "owner1@mail.com" },
  { id: 2, title: "Shared 2BR Apartment", rent: "$180/week", address: "45 Elizabeth St, Sydney", beds: 2, baths: 1, furnishing: "Semi Furnished", available: true, type: "Apartment", listed: "5d ago", desc: "Affordable shared apartment near campus. All bills included.", images: ["🏢", "🛏️", "🚿"], amenities: ["WiFi", "Laundry"], ownerPhone: "+61 400 333 444", ownerEmail: "owner2@mail.com" },
  { id: 3, title: "Student House Room", rent: "$150/week", address: "78 Queen St, Brisbane", beds: 1, baths: 1, furnishing: "Unfurnished", available: false, type: "Shared Room", listed: "1w ago", desc: "Single room in a student share house. Great community.", images: ["🏡", "🛏️"], amenities: ["WiFi"], ownerPhone: "+61 400 555 666", ownerEmail: "owner3@mail.com" },
  { id: 4, title: "Luxury 1BR Unit", rent: "$350/week", address: "200 Collins St, Melbourne", beds: 1, baths: 1, furnishing: "Fully Furnished", available: true, type: "Apartment", listed: "3d ago", desc: "Premium living with gym and pool access. Walking distance to uni.", images: ["🏙️", "🏊", "💪"], amenities: ["WiFi", "Parking", "Gym", "Pool"], ownerPhone: "+61 400 777 888", ownerEmail: "owner4@mail.com" },
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

export default function AccommodationsPage() {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");
  const [selected, setSelected] = useState<number | null>(null);
  const [imgIdx, setImgIdx] = useState(0);
  const [chatOpen, setChatOpen] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);
  const [contactProp, setContactProp] = useState<typeof properties[0] | null>(null);

  const filtered = properties.filter((p) => {
    const matchSearch = p.title.toLowerCase().includes(search.toLowerCase()) || p.address.toLowerCase().includes(search.toLowerCase());
    const matchType = typeFilter === "All" || p.type === typeFilter;
    return matchSearch && matchType;
  });

  if (selected !== null) {
    const p = properties.find((x) => x.id === selected)!;
    return (
      <div className="space-y-6">
        <Button variant="ghost" onClick={() => { setSelected(null); setImgIdx(0); }}>← Back to listings</Button>
        <div className="rounded-xl border border-border bg-card shadow-card overflow-hidden">
          <div className="relative flex h-48 items-center justify-center bg-secondary text-7xl">
            {p.images[imgIdx]}
            {p.images.length > 1 && (
              <>
                <button onClick={() => setImgIdx((i) => (i - 1 + p.images.length) % p.images.length)} className="absolute left-2 rounded-full bg-background/80 p-1.5 hover:bg-background"><ChevronLeft className="h-4 w-4" /></button>
                <button onClick={() => setImgIdx((i) => (i + 1) % p.images.length)} className="absolute right-2 rounded-full bg-background/80 p-1.5 hover:bg-background"><ChevronRight className="h-4 w-4" /></button>
              </>
            )}
          </div>
          <div className="p-6 space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <h1 className="font-display text-2xl font-bold">{p.title}</h1>
              <span className="font-display text-xl font-bold text-primary">{p.rent}</span>
            </div>
            <p className="text-muted-foreground flex items-center gap-1"><MapPin className="h-4 w-4" /> {p.address}</p>
            <div className="flex flex-wrap gap-4 text-sm">
              <span className="flex items-center gap-1"><Bed className="h-4 w-4" /> {p.beds} Bed</span>
              <span className="flex items-center gap-1"><Bath className="h-4 w-4" /> {p.baths} Bath</span>
              <span className="rounded-full bg-secondary px-2.5 py-0.5 text-xs font-medium">{p.furnishing}</span>
              {p.available && <span className="flex items-center gap-1 text-success text-xs font-medium"><CheckCircle className="h-3 w-3" /> Verified</span>}
            </div>
            <div className="flex flex-wrap gap-2">
              {p.amenities.map((a) => (
                <span key={a} className="flex items-center gap-1 rounded-full bg-secondary px-2.5 py-1 text-xs font-medium">
                  {amenityIcon[a] || null} {a}
                </span>
              ))}
            </div>
            <p className="text-sm text-muted-foreground">{p.desc}</p>
            <div className="flex gap-3 pt-2 flex-wrap">
              <Button onClick={() => setChatOpen(true)}><MessageCircle className="h-4 w-4 mr-1" /> Chat with Vendor</Button>
              <Button variant="outline" onClick={() => { setContactProp(p); setContactOpen(true); }}><Phone className="h-4 w-4 mr-1" /> Contact Owner</Button>
            </div>
          </div>
        </div>

        {/* Chat popup */}
        <Dialog open={chatOpen} onOpenChange={setChatOpen}>
          <DialogContent className="max-w-sm">
            <DialogHeader><DialogTitle>Chat with Vendor</DialogTitle></DialogHeader>
            <div className="space-y-3 pt-2">
              <div className="rounded-lg bg-secondary p-3 text-sm">Hi! How can I help you with this property?</div>
              <Input placeholder="Type your message..." />
              <Button className="w-full">Send</Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Contact popup */}
        <Dialog open={contactOpen} onOpenChange={setContactOpen}>
          <DialogContent className="max-w-xs">
            <DialogHeader><DialogTitle>Owner Contact</DialogTitle></DialogHeader>
            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-2 text-sm"><Phone className="h-4 w-4 text-primary" /> {contactProp?.ownerPhone}</div>
              <div className="flex items-center gap-2 text-sm"><Mail className="h-4 w-4 text-primary" /> {contactProp?.ownerEmail}</div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    );
  }

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
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {filtered.map((p) => (
              <div key={p.id} onClick={() => setSelected(p.id)} className="cursor-pointer rounded-xl border border-border bg-card shadow-card overflow-hidden transition-all hover:shadow-card-hover hover:-translate-y-0.5">
                <div className="relative flex h-32 items-center justify-center bg-secondary text-5xl">
                  {p.images[0]}
                  {p.available && <span className="absolute top-2 left-2 flex items-center gap-1 rounded-full bg-success/90 px-2 py-0.5 text-[10px] font-medium text-white"><CheckCircle className="h-2.5 w-2.5" /> Verified</span>}
                </div>
                <div className="p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="font-display text-sm font-bold">{p.title}</h3>
                    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${p.available ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive"}`}>
                      {p.available ? "Available" : "Taken"}
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
                  <div className="flex gap-2 pt-1">
                    <Button size="sm" variant="outline" className="flex-1 text-xs" onClick={(e) => { e.stopPropagation(); setChatOpen(true); }}><MessageCircle className="h-3 w-3 mr-1" /> Chat</Button>
                    <Button size="sm" variant="outline" className="flex-1 text-xs" onClick={(e) => { e.stopPropagation(); setContactProp(p); setContactOpen(true); }}><Phone className="h-3 w-3 mr-1" /> Contact</Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>
        <TabsContent value="bookings" className="mt-4">
          <RequestsListTab requests={bookings} emptyMessage="No accommodation bookings yet." />
        </TabsContent>
      </Tabs>

      <Dialog open={chatOpen} onOpenChange={setChatOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader><DialogTitle>Chat with Vendor</DialogTitle></DialogHeader>
          <div className="space-y-3 pt-2">
            <div className="rounded-lg bg-secondary p-3 text-sm">Hi! How can I help?</div>
            <Input placeholder="Type your message..." />
            <Button className="w-full">Send</Button>
          </div>
        </DialogContent>
      </Dialog>
      <Dialog open={contactOpen} onOpenChange={setContactOpen}>
        <DialogContent className="max-w-xs">
          <DialogHeader><DialogTitle>Owner Contact</DialogTitle></DialogHeader>
          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-2 text-sm"><Phone className="h-4 w-4 text-primary" /> {contactProp?.ownerPhone}</div>
            <div className="flex items-center gap-2 text-sm"><Mail className="h-4 w-4 text-primary" /> {contactProp?.ownerEmail}</div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
