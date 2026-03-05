import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { CarFront, MapPin, Search, Clock, ChevronLeft, ChevronRight, CheckCircle2 } from "lucide-react";
import PhoneField from "@/components/shared/PhoneField";
import RequestsListTab from "@/components/shared/RequestsListTab";

const partners = [
  { id: 1, name: "DriveRight School", location: "Melbourne", openHours: "8:00 AM", closeHours: "6:00 PM", images: ["🚗", "🏫", "🛣️"], packages: [{ name: "5 Lessons Pack", price: "$350", desc: "5 x 1hr manual lessons" }, { name: "10 Lessons Pack", price: "$650", desc: "10 x 1hr lessons + test prep" }, { name: "Test Package", price: "$200", desc: "Mock test + 1hr lesson" }] },
  { id: 2, name: "SafeWheels Academy", location: "Sydney", openHours: "7:00 AM", closeHours: "5:00 PM", images: ["🚙", "📋"], packages: [{ name: "Starter Pack", price: "$300", desc: "4 x 1hr auto lessons" }, { name: "Premium Pack", price: "$550", desc: "8 lessons + hazard training" }, { name: "Mock Test", price: "$120", desc: "Full mock driving test" }] },
  { id: 3, name: "QuickPass Driving", location: "Brisbane", openHours: "9:00 AM", closeHours: "7:00 PM", images: ["🚘", "🎓", "✅"], packages: [{ name: "Conversion Package", price: "$250", desc: "International licence conversion" }, { name: "Full Course", price: "$700", desc: "Complete learner to P-plate" }, { name: "Single Lesson", price: "$75", desc: "1hr driving lesson" }] },
];

const cities = ["All", "Melbourne", "Sydney", "Brisbane"];

const myBookings = [
  { id: 1, title: "10 Lessons Pack — DriveRight School", subtitle: "Melbourne", date: "March 8, 2026", status: "Confirmed" },
  { id: 2, title: "Conversion Package — QuickPass Driving", subtitle: "Brisbane", date: "March 1, 2026", status: "In Progress" },
];

export default function DrivingLicencePage() {
  const [search, setSearch] = useState("");
  const [city, setCity] = useState("All");
  const [imgIdxMap, setImgIdxMap] = useState<Record<number, number>>({});
  const [bookOpen, setBookOpen] = useState(false);
  const [bookPkg, setBookPkg] = useState<{ partner: string; name: string; price: string } | null>(null);
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [bookSuccess, setBookSuccess] = useState(false);

  const filtered = partners.filter((p) => {
    const ms = p.name.toLowerCase().includes(search.toLowerCase());
    const mc = city === "All" || p.location === city;
    return ms && mc;
  });

  const getImgIdx = (id: number) => imgIdxMap[id] || 0;
  const setImgIdx = (id: number, idx: number) => setImgIdxMap((p) => ({ ...p, [id]: idx }));

  const handleBook = (partner: string, pkg: { name: string; price: string }) => {
    setBookPkg({ partner, ...pkg });
    setBookOpen(true);
    setBookSuccess(false);
    setPhone("");
    setAddress("");
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold flex items-center gap-2"><CarFront className="h-6 w-6 text-primary" /> Driving Licence</h1>
        <p className="text-sm text-muted-foreground mt-1">Find certified driving partners</p>
      </div>
      <Tabs defaultValue="book" className="w-full">
        <TabsList>
          <TabsTrigger value="book">Book Package</TabsTrigger>
          <TabsTrigger value="bookings">My Bookings</TabsTrigger>
        </TabsList>
        <TabsContent value="book" className="mt-4 space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Search partners..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
            </div>
            <Select value={city} onValueChange={setCity}>
              <SelectTrigger className="w-full sm:w-36"><SelectValue /></SelectTrigger>
              <SelectContent>{cities.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((p) => (
              <div key={p.id} className="rounded-xl border border-border bg-card shadow-card overflow-hidden transition-all hover:shadow-card-hover">
                <div className="relative flex h-28 items-center justify-center bg-secondary text-5xl">
                  {p.images[getImgIdx(p.id)]}
                  {p.images.length > 1 && (
                    <>
                      <button onClick={() => setImgIdx(p.id, (getImgIdx(p.id) - 1 + p.images.length) % p.images.length)} className="absolute left-1 rounded-full bg-background/80 p-1 hover:bg-background"><ChevronLeft className="h-3 w-3" /></button>
                      <button onClick={() => setImgIdx(p.id, (getImgIdx(p.id) + 1) % p.images.length)} className="absolute right-1 rounded-full bg-background/80 p-1 hover:bg-background"><ChevronRight className="h-3 w-3" /></button>
                    </>
                  )}
                </div>
                <div className="p-4 space-y-2">
                  <h3 className="font-display text-sm font-bold">{p.name}</h3>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {p.location}</span>
                    <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {p.openHours} — {p.closeHours}</span>
                  </div>
                  <div className="space-y-1.5 pt-1">
                    {p.packages.map((pkg) => (
                      <div key={pkg.name} className="flex items-center justify-between rounded-lg bg-secondary/50 p-2">
                        <div>
                          <span className="text-xs font-medium">{pkg.name}</span>
                          <p className="text-[10px] text-muted-foreground">{pkg.desc}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-primary">{pkg.price}</span>
                          <Button size="sm" variant="outline" className="text-xs h-7 px-2" onClick={() => handleBook(p.name, pkg)}>Book</Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>
        <TabsContent value="bookings" className="mt-4">
          <RequestsListTab requests={myBookings} emptyMessage="No driving bookings yet." />
        </TabsContent>
      </Tabs>

      <Dialog open={bookOpen} onOpenChange={(o) => { setBookOpen(o); if (!o) setBookSuccess(false); }}>
        <DialogContent className="max-w-sm">
          {bookSuccess ? (
            <div className="flex flex-col items-center py-6 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10"><CheckCircle2 className="h-8 w-8 text-primary" /></div>
              <h2 className="mt-4 font-display text-xl font-bold">Booking Confirmed!</h2>
              <p className="mt-2 text-sm text-muted-foreground">{bookPkg?.name} at {bookPkg?.partner}</p>
              <Button className="mt-6" onClick={() => setBookOpen(false)}>Close</Button>
            </div>
          ) : (
            <>
              <DialogHeader><DialogTitle>Book Package</DialogTitle></DialogHeader>
              <div className="space-y-4 pt-2">
                <div className="rounded-lg bg-secondary p-3">
                  <p className="text-sm font-medium">{bookPkg?.name}</p>
                  <p className="text-xs text-muted-foreground">{bookPkg?.partner} — {bookPkg?.price}</p>
                </div>
                <PhoneField value={phone} onChange={setPhone} />
                <div><Label>Current Address</Label><Input className="mt-1.5" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Your current address" /></div>
                <Button className="w-full" disabled={!phone.trim()} onClick={() => setBookSuccess(true)}>Proceed to Payment</Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
