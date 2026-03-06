import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CarFront, MapPin, Search, Clock, ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
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
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [city, setCity] = useState("All");
  const [imgIdxMap, setImgIdxMap] = useState<Record<number, number>>({});

  const filtered = partners.filter((p) => {
    const ms = p.name.toLowerCase().includes(search.toLowerCase());
    const mc = city === "All" || p.location === city;
    return ms && mc;
  });

  const getImgIdx = (id: number) => imgIdxMap[id] || 0;
  const setImgIdx = (id: number, idx: number) => setImgIdxMap((p) => ({ ...p, [id]: idx }));

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
              <div key={p.id} onClick={() => navigate(`/student/driving-licence/${p.id}`)} className="cursor-pointer rounded-xl border border-border bg-card shadow-card overflow-hidden transition-all hover:shadow-card-hover hover:border-primary/30 group">
                <div className="relative flex h-28 items-center justify-center bg-secondary text-5xl">
                  {p.images[getImgIdx(p.id)]}
                  {p.images.length > 1 && (
                    <>
                      <button onClick={(e) => { e.stopPropagation(); setImgIdx(p.id, (getImgIdx(p.id) - 1 + p.images.length) % p.images.length); }} className="absolute left-1 rounded-full bg-background/80 p-1 hover:bg-background"><ChevronLeft className="h-3 w-3" /></button>
                      <button onClick={(e) => { e.stopPropagation(); setImgIdx(p.id, (getImgIdx(p.id) + 1) % p.images.length); }} className="absolute right-1 rounded-full bg-background/80 p-1 hover:bg-background"><ChevronRight className="h-3 w-3" /></button>
                    </>
                  )}
                </div>
                <div className="p-4 space-y-2">
                  <h3 className="font-display text-sm font-bold">{p.name}</h3>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {p.location}</span>
                    <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {p.openHours} — {p.closeHours}</span>
                  </div>
                  <div className="flex items-center justify-between pt-2">
                    <span className="text-xs text-muted-foreground">{p.packages.length} packages available</span>
                    <Button size="sm" variant="outline" className="gap-1 text-xs group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                      View Details <ArrowRight className="h-3 w-3" />
                    </Button>
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
    </div>
  );
}
