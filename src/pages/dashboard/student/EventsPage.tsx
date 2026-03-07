import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CalendarDays, MapPin, Search, Clock, Monitor, Building, ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import RequestsListTab from "@/components/shared/RequestsListTab";

const events = [
  { id: 1, title: "Welcome Week BBQ", desc: "Meet fellow students at our semester kick-off BBQ. Free food and drinks!", date: "March 15, 2026", duration: "3 hours", mode: "Offline", location: "University Park", images: ["🎉", "🍔", "🎵"] },
  { id: 2, title: "Career Fair 2026", desc: "Connect with top employers hiring international students.", date: "March 22, 2026", duration: "5 hours", mode: "Offline", location: "Convention Centre", images: ["💼", "🤝"] },
  { id: 3, title: "Online Visa Workshop", desc: "Learn everything about visa extensions and work rights.", date: "April 1, 2026", duration: "2 hours", mode: "Online", location: "Zoom", images: ["💻", "📋"] },
  { id: 4, title: "Cultural Festival", desc: "Celebrate diversity with food stalls, performances, and workshops.", date: "April 5, 2026", duration: "6 hours", mode: "Offline", location: "Student Union Building", images: ["🌍", "🎭", "🍜"] },
];

const myRegistrations = [
  { id: 1, title: "Welcome Week BBQ", subtitle: "University Park — March 15, 2026", date: "Registered March 1, 2026", status: "Confirmed" },
];

export default function EventsPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [locationFilter, setLocationFilter] = useState("All");
  const [imgIdxMap, setImgIdxMap] = useState<Record<number, number>>({});

  const filtered = events.filter((e) => {
    const ms = e.title.toLowerCase().includes(search.toLowerCase());
    const ml = locationFilter === "All" || e.location.includes(locationFilter);
    return ms && ml;
  });

  const getImgIdx = (id: number) => imgIdxMap[id] || 0;
  const setImgIdx = (id: number, idx: number) => setImgIdxMap((p) => ({ ...p, [id]: idx }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold flex items-center gap-2"><CalendarDays className="h-6 w-6 text-primary" /> Events</h1>
        <p className="text-sm text-muted-foreground mt-1">Upcoming student events</p>
      </div>
      <Tabs defaultValue="events" className="w-full">
        <TabsList>
          <TabsTrigger value="events">Events</TabsTrigger>
          <TabsTrigger value="registrations">My Registrations</TabsTrigger>
        </TabsList>
        <TabsContent value="events" className="mt-4 space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Search events..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
            </div>
            <Select value={locationFilter} onValueChange={setLocationFilter}>
              <SelectTrigger className="w-full sm:w-40"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Locations</SelectItem>
                <SelectItem value="Park">Parks</SelectItem>
                <SelectItem value="Centre">Centres</SelectItem>
                <SelectItem value="Zoom">Online</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {filtered.map((e, i) => (
              <motion.div
                key={e.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08, duration: 0.3 }}
                onClick={() => navigate(`/student/events/${e.id}`)}
                className="cursor-pointer rounded-xl border border-border bg-card shadow-card overflow-hidden transition-all hover:shadow-card-hover hover:border-primary/30 group"
              >
                <div className="relative flex h-28 items-center justify-center bg-secondary text-5xl">
                  {e.images[getImgIdx(e.id)]}
                  {e.images.length > 1 && (
                    <>
                      <button onClick={(ev) => { ev.stopPropagation(); setImgIdx(e.id, (getImgIdx(e.id) - 1 + e.images.length) % e.images.length); }} className="absolute left-1 rounded-full bg-background/80 p-1 hover:bg-background"><ChevronLeft className="h-3 w-3" /></button>
                      <button onClick={(ev) => { ev.stopPropagation(); setImgIdx(e.id, (getImgIdx(e.id) + 1) % e.images.length); }} className="absolute right-1 rounded-full bg-background/80 p-1 hover:bg-background"><ChevronRight className="h-3 w-3" /></button>
                    </>
                  )}
                </div>
                <div className="p-4 space-y-2">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <CalendarDays className="h-3 w-3" /> {e.date}
                    <span>•</span>
                    <Clock className="h-3 w-3" /> {e.duration}
                    <span>•</span>
                    {e.mode === "Online" ? <Monitor className="h-3 w-3" /> : <Building className="h-3 w-3" />} {e.mode}
                  </div>
                  <h3 className="font-display text-lg font-bold">{e.title}</h3>
                  <p className="text-sm text-muted-foreground">{e.desc}</p>
                  <div className="flex items-center justify-between pt-1">
                    <span className="flex items-center gap-1 text-xs text-muted-foreground"><MapPin className="h-3 w-3" /> {e.location}</span>
                    <Button size="sm" variant="outline" className="gap-1 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                      View Details <ArrowRight className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </TabsContent>
        <TabsContent value="registrations" className="mt-4">
          <RequestsListTab requests={myRegistrations} emptyMessage="No event registrations yet." />
        </TabsContent>
      </Tabs>
    </div>
  );
}
