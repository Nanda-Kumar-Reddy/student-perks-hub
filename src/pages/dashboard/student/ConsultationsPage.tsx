import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Users, Globe, Search, Clock } from "lucide-react";
import RequestsListTab from "@/components/shared/RequestsListTab";

const consultants = [
  { id: 1, name: "Dr. Sarah Williams", experience: "10+ years", languages: ["English", "Mandarin"], speciality: "Immigration & Visa", category: "Visa", price: "$80/session", responseTime: "< 2 hours", sessions: 340 },
  { id: 2, name: "Mark Thompson", experience: "8 years", languages: ["English", "Hindi"], speciality: "Career Coaching", category: "Personal", price: "$60/session", responseTime: "< 4 hours", sessions: 215 },
  { id: 3, name: "Emily Chen", experience: "5 years", languages: ["English", "Cantonese", "Mandarin"], speciality: "Academic Counseling", category: "Personal", price: "$50/session", responseTime: "< 1 hour", sessions: 180 },
];

const myBookings = [
  { id: 1, title: "Immigration Consultation — Dr. Sarah Williams", subtitle: "Visa extension discussion", date: "March 10, 2026 at 2:00 PM", status: "Confirmed" },
  { id: 2, title: "Career Coaching — Mark Thompson", subtitle: "Resume review session", date: "March 13, 2026 at 1:00 PM", status: "Pending" },
];

export default function ConsultationsPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");

  const filtered = consultants.filter((c) => {
    const ms = c.name.toLowerCase().includes(search.toLowerCase()) || c.speciality.toLowerCase().includes(search.toLowerCase());
    const mc = categoryFilter === "All" || c.category === categoryFilter;
    return ms && mc;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold flex items-center gap-2"><Users className="h-6 w-6 text-primary" /> 1:1 Consultations</h1>
        <p className="text-sm text-muted-foreground mt-1">Book expert consultations</p>
      </div>
      <Tabs defaultValue="consultants" className="w-full">
        <TabsList>
          <TabsTrigger value="consultants">Consultants</TabsTrigger>
          <TabsTrigger value="bookings">My Bookings</TabsTrigger>
        </TabsList>
        <TabsContent value="consultants" className="mt-4 space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Search consultants..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full sm:w-36"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All</SelectItem>
                <SelectItem value="Personal">Personal</SelectItem>
                <SelectItem value="Visa">Visa</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((c) => (
              <div
                key={c.id}
                onClick={() => navigate(`/student/consultations/${c.id}`)}
                className="cursor-pointer rounded-xl border border-border bg-card p-5 shadow-card transition-all hover:shadow-card-hover hover:border-primary/30"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">{c.name.split(" ").map((n) => n[0]).join("")}</div>
                  <div>
                    <h3 className="font-display text-sm font-bold">{c.name}</h3>
                    <p className="text-xs text-muted-foreground">{c.speciality}</p>
                  </div>
                </div>
                <div className="mt-3 flex flex-wrap gap-2 text-xs text-muted-foreground">
                  <span>{c.experience}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1"><Globe className="h-3 w-3" /> {c.languages.join(", ")}</span>
                </div>
                <div className="mt-2 flex gap-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {c.responseTime}</span>
                  <span>{c.sessions} sessions</span>
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <span className="font-display text-sm font-bold text-primary">{c.price}</span>
                  <Button size="sm" onClick={(e) => { e.stopPropagation(); navigate(`/student/consultations/${c.id}`); }}>Book Session</Button>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>
        <TabsContent value="bookings" className="mt-4">
          <RequestsListTab requests={myBookings} emptyMessage="No consultation bookings yet." />
        </TabsContent>
      </Tabs>
    </div>
  );
}
