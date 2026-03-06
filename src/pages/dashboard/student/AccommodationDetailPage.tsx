import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Home, Bed, Bath, MapPin, CheckCircle, ChevronLeft, ChevronRight, MessageCircle, Phone, Mail, Wifi, Car as CarIcon, Dumbbell, ArrowLeft, Calendar, Shield, Star, Waves } from "lucide-react";
import { motion } from "framer-motion";

const amenityIcon: Record<string, React.ReactNode> = {
  WiFi: <Wifi className="h-4 w-4" />,
  Parking: <CarIcon className="h-4 w-4" />,
  Gym: <Dumbbell className="h-4 w-4" />,
  Pool: <Waves className="h-4 w-4" />,
  Laundry: <Home className="h-4 w-4" />,
};

const properties = [
  { id: 1, title: "Modern Studio Apartment", rent: "$280/week", address: "123 Swanston St, Melbourne", beds: 1, baths: 1, furnishing: "Fully Furnished", available: true, type: "Studio", listed: "2d ago", desc: "Bright and modern studio in the heart of CBD. Close to universities and public transport.", images: ["🏠", "🛋️", "🍳"], amenities: ["WiFi", "Parking", "Gym"], ownerPhone: "+61 400 111 222", ownerEmail: "owner1@mail.com", about: "This beautifully appointed studio apartment offers everything a student needs for comfortable city living. Located on Swanston Street, you're steps away from Melbourne's top universities, tram lines, and vibrant café culture. The apartment features modern finishes, abundant natural light, and a fully equipped kitchenette. Building amenities include a rooftop gym, secure parking, and high-speed internet throughout.", features: ["Air Conditioning", "Built-in Wardrobe", "Balcony", "Intercom", "Secure Entry", "Elevator"], rules: ["No smoking", "No pets", "Quiet hours 10 PM — 7 AM", "Maximum 1 occupant"], bond: "$1,120", minLease: "6 months", rating: 4.8, reviews: 24 },
  { id: 2, title: "Shared 2BR Apartment", rent: "$180/week", address: "45 Elizabeth St, Sydney", beds: 2, baths: 1, furnishing: "Semi Furnished", available: true, type: "Apartment", listed: "5d ago", desc: "Affordable shared apartment near campus. All bills included.", images: ["🏢", "🛏️", "🚿"], amenities: ["WiFi", "Laundry"], ownerPhone: "+61 400 333 444", ownerEmail: "owner2@mail.com", about: "A fantastic opportunity to share a spacious two-bedroom apartment in the heart of Sydney's university precinct. All utility bills are included in the rent, making budgeting simple. The apartment comes semi-furnished with essential items, and your friendly housemate is a fellow international student.", features: ["Shared Kitchen", "Common Area", "Balcony", "Street Parking"], rules: ["No smoking indoors", "Shared cleaning roster", "Guests allowed with notice"], bond: "$720", minLease: "3 months", rating: 4.5, reviews: 18 },
  { id: 3, title: "Student House Room", rent: "$150/week", address: "78 Queen St, Brisbane", beds: 1, baths: 1, furnishing: "Unfurnished", available: false, type: "Shared Room", listed: "1w ago", desc: "Single room in a student share house. Great community.", images: ["🏡", "🛏️"], amenities: ["WiFi"], ownerPhone: "+61 400 555 666", ownerEmail: "owner3@mail.com", about: "Join a welcoming community of international students in this charming share house in Brisbane. The house features a large backyard, communal living areas, and a fully equipped shared kitchen. Located in a quiet residential area with excellent bus connections to major universities.", features: ["Shared Kitchen", "Backyard", "Study Room", "Bus Stop Nearby"], rules: ["Shared chores", "No parties", "Quiet after 9 PM"], bond: "$600", minLease: "3 months", rating: 4.3, reviews: 12 },
  { id: 4, title: "Luxury 1BR Unit", rent: "$350/week", address: "200 Collins St, Melbourne", beds: 1, baths: 1, furnishing: "Fully Furnished", available: true, type: "Apartment", listed: "3d ago", desc: "Premium living with gym and pool access. Walking distance to uni.", images: ["🏙️", "🏊", "💪"], amenities: ["WiFi", "Parking", "Gym", "Pool"], ownerPhone: "+61 400 777 888", ownerEmail: "owner4@mail.com", about: "Experience premium student living in this luxurious one-bedroom apartment on Collins Street. Featuring high-end finishes, floor-to-ceiling windows with city views, and access to resort-style amenities including an infinity pool, fully equipped gym, and residents' lounge. Perfect for students who value comfort and convenience.", features: ["City Views", "Dishwasher", "In-unit Laundry", "Walk-in Wardrobe", "Concierge", "Rooftop Terrace"], rules: ["No smoking", "No pets", "Building quiet hours apply", "Pool hours 6 AM — 10 PM"], bond: "$1,400", minLease: "6 months", rating: 4.9, reviews: 31 },
];

export default function AccommodationDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const property = properties.find((p) => p.id === Number(id));

  const [imgIdx, setImgIdx] = useState(0);
  const [chatOpen, setChatOpen] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);

  if (!property) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <h2 className="text-xl font-bold">Property not found</h2>
        <Button variant="outline" className="mt-4" onClick={() => navigate("/student/accommodations")}>
          <ArrowLeft className="h-4 w-4 mr-1" /> Back to Accommodations
        </Button>
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }} className="space-y-6">
      <Button variant="ghost" size="sm" onClick={() => navigate("/student/accommodations")} className="gap-1 text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Back to Accommodations
      </Button>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Image gallery */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="relative flex h-48 items-center justify-center rounded-xl bg-secondary text-7xl overflow-hidden border border-border">
            {property.images[imgIdx]}
            {property.images.length > 1 && (
              <>
                <button onClick={() => setImgIdx((i) => (i - 1 + property.images.length) % property.images.length)} className="absolute left-2 rounded-full bg-background/80 p-1.5 hover:bg-background transition-colors"><ChevronLeft className="h-4 w-4" /></button>
                <button onClick={() => setImgIdx((i) => (i + 1) % property.images.length)} className="absolute right-2 rounded-full bg-background/80 p-1.5 hover:bg-background transition-colors"><ChevronRight className="h-4 w-4" /></button>
              </>
            )}
            <div className="absolute bottom-2 flex gap-1">
              {property.images.map((_, i) => (
                <span key={i} className={`h-1.5 w-1.5 rounded-full transition-colors ${i === imgIdx ? "bg-primary" : "bg-muted-foreground/40"}`} />
              ))}
            </div>
            {property.available && (
              <span className="absolute top-3 left-3 flex items-center gap-1 rounded-full bg-primary px-2.5 py-1 text-xs font-medium text-primary-foreground">
                <CheckCircle className="h-3 w-3" /> Verified
              </span>
            )}
          </motion.div>

          {/* Header */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="rounded-xl border border-border bg-card p-6 shadow-card">
            <div className="flex items-start gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Home className="h-7 w-7" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <h1 className="font-display text-xl font-bold">{property.title}</h1>
                  <span className="font-display text-lg font-bold text-primary">{property.rent}</span>
                </div>
                <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {property.address}</span>
                  <span className="flex items-center gap-1"><Star className="h-3 w-3 text-primary fill-primary" /> {property.rating} ({property.reviews} reviews)</span>
                  <span className="rounded-full bg-secondary px-2 py-0.5 text-xs font-medium">{property.type}</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* About */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="rounded-xl border border-border bg-card p-6 shadow-card">
            <h2 className="font-display text-base font-bold mb-3">About This Property</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">{property.about}</p>
          </motion.div>

          {/* Property Details */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="rounded-xl border border-border bg-card p-6 shadow-card">
            <h2 className="font-display text-base font-bold mb-3">Property Details</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="flex flex-col items-center rounded-lg bg-secondary/50 p-3 text-center">
                <Bed className="h-5 w-5 text-primary mb-1" />
                <span className="text-sm font-medium">{property.beds} Bed</span>
              </div>
              <div className="flex flex-col items-center rounded-lg bg-secondary/50 p-3 text-center">
                <Bath className="h-5 w-5 text-primary mb-1" />
                <span className="text-sm font-medium">{property.baths} Bath</span>
              </div>
              <div className="flex flex-col items-center rounded-lg bg-secondary/50 p-3 text-center">
                <Home className="h-5 w-5 text-primary mb-1" />
                <span className="text-sm font-medium">{property.furnishing}</span>
              </div>
              <div className="flex flex-col items-center rounded-lg bg-secondary/50 p-3 text-center">
                <Calendar className="h-5 w-5 text-primary mb-1" />
                <span className="text-sm font-medium">Listed {property.listed}</span>
              </div>
            </div>
          </motion.div>

          {/* Amenities */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="rounded-xl border border-border bg-card p-6 shadow-card">
            <h2 className="font-display text-base font-bold mb-3">Amenities</h2>
            <div className="flex flex-wrap gap-2">
              {property.amenities.map((a) => (
                <span key={a} className="flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary">
                  {amenityIcon[a] || null} {a}
                </span>
              ))}
            </div>
          </motion.div>

          {/* Features */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="rounded-xl border border-border bg-card p-6 shadow-card">
            <h2 className="font-display text-base font-bold mb-3">Features</h2>
            <div className="grid gap-2 sm:grid-cols-2">
              {property.features.map((f) => (
                <div key={f} className="flex items-center gap-2 rounded-lg border border-border p-3 text-sm">
                  <CheckCircle className="h-4 w-4 text-primary shrink-0" />
                  {f}
                </div>
              ))}
            </div>
          </motion.div>

          {/* House Rules */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="rounded-xl border border-border bg-card p-6 shadow-card">
            <h2 className="font-display text-base font-bold mb-3">House Rules</h2>
            <div className="space-y-2">
              {property.rules.map((r) => (
                <div key={r} className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Shield className="h-4 w-4 text-primary shrink-0" />
                  {r}
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="rounded-xl border border-border bg-card p-5 shadow-card sticky top-4">
            <h3 className="font-display text-base font-bold mb-4">Overview</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Rent</span>
                <span className="font-display font-bold text-primary">{property.rent}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Bond</span>
                <span className="font-medium">{property.bond}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Min. Lease</span>
                <span className="font-medium">{property.minLease}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Furnishing</span>
                <span className="font-medium">{property.furnishing}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Rating</span>
                <span className="flex items-center gap-1 font-medium"><Star className="h-3 w-3 text-primary fill-primary" /> {property.rating}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Status</span>
                <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${property.available ? "bg-primary/10 text-primary" : "bg-destructive/10 text-destructive"}`}>
                  {property.available ? "Available" : "Taken"}
                </span>
              </div>
            </div>
            <div className="flex flex-col gap-2 mt-5">
              <Button className="w-full" onClick={() => setChatOpen(true)}>
                <MessageCircle className="h-4 w-4 mr-1" /> Chat with Owner
              </Button>
              <Button variant="outline" className="w-full" onClick={() => setContactOpen(true)}>
                <Phone className="h-4 w-4 mr-1" /> Contact Owner
              </Button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Chat Dialog */}
      <Dialog open={chatOpen} onOpenChange={setChatOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader><DialogTitle>Chat with Owner</DialogTitle></DialogHeader>
          <div className="space-y-3 pt-2">
            <div className="rounded-lg bg-secondary p-3 text-sm">Hi! How can I help you with this property?</div>
            <Input placeholder="Type your message..." />
            <Button className="w-full">Send</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Contact Dialog */}
      <Dialog open={contactOpen} onOpenChange={setContactOpen}>
        <DialogContent className="max-w-xs">
          <DialogHeader><DialogTitle>Owner Contact</DialogTitle></DialogHeader>
          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-2 text-sm"><Phone className="h-4 w-4 text-primary" /> {property.ownerPhone}</div>
            <div className="flex items-center gap-2 text-sm"><Mail className="h-4 w-4 text-primary" /> {property.ownerEmail}</div>
          </div>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
