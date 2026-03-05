import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Users, Globe, Search, Clock, CheckCircle2, Calendar } from "lucide-react";
import RequestsListTab from "@/components/shared/RequestsListTab";

const consultants = [
  { id: 1, name: "Dr. Sarah Williams", experience: "10+ years", languages: ["English", "Mandarin"], speciality: "Immigration & Visa", category: "Visa", price: "$80/session", responseTime: "< 2 hours", sessions: 340, about: "Expert in Australian immigration law.", services: ["Visa Extensions", "PR Applications", "Student Visa", "Work Rights"], dates: ["March 10", "March 12", "March 15"], slots: ["9:00 AM", "11:00 AM", "2:00 PM", "4:00 PM"] },
  { id: 2, name: "Mark Thompson", experience: "8 years", languages: ["English", "Hindi"], speciality: "Career Coaching", category: "Personal", price: "$60/session", responseTime: "< 4 hours", sessions: 215, about: "Helping students build successful careers.", services: ["Resume Review", "Interview Prep", "Career Planning"], dates: ["March 11", "March 13"], slots: ["10:00 AM", "1:00 PM", "3:00 PM"] },
  { id: 3, name: "Emily Chen", experience: "5 years", languages: ["English", "Cantonese", "Mandarin"], speciality: "Academic Counseling", category: "Personal", price: "$50/session", responseTime: "< 1 hour", sessions: 180, about: "University course selection and academic guidance.", services: ["Course Selection", "University Transfers", "Academic Appeals"], dates: ["March 10", "March 14"], slots: ["9:00 AM", "12:00 PM", "3:00 PM"] },
];

const myBookings = [
  { id: 1, title: "Immigration Consultation — Dr. Sarah Williams", subtitle: "Visa extension discussion", date: "March 10, 2026 at 2:00 PM", status: "Confirmed" },
  { id: 2, title: "Career Coaching — Mark Thompson", subtitle: "Resume review session", date: "March 13, 2026 at 1:00 PM", status: "Pending" },
];

export default function ConsultationsPage() {
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [bookOpen, setBookOpen] = useState(false);
  const [bookConsultant, setBookConsultant] = useState<typeof consultants[0] | null>(null);
  const [selectedService, setSelectedService] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedSlot, setSelectedSlot] = useState("");
  const [description, setDescription] = useState("");
  const [bookSuccess, setBookSuccess] = useState(false);

  const filtered = consultants.filter((c) => {
    const ms = c.name.toLowerCase().includes(search.toLowerCase()) || c.speciality.toLowerCase().includes(search.toLowerCase());
    const mc = categoryFilter === "All" || c.category === categoryFilter;
    return ms && mc;
  });

  const handleBook = (c: typeof consultants[0]) => {
    setBookConsultant(c);
    setBookOpen(true);
    setBookSuccess(false);
    setSelectedService("");
    setSelectedDate("");
    setSelectedSlot("");
    setDescription("");
  };

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
              <div key={c.id} className="rounded-xl border border-border bg-card p-5 shadow-card transition-all hover:shadow-card-hover">
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
                  <Button size="sm" onClick={() => handleBook(c)}>Book Session</Button>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>
        <TabsContent value="bookings" className="mt-4">
          <RequestsListTab requests={myBookings} emptyMessage="No consultation bookings yet." />
        </TabsContent>
      </Tabs>

      <Dialog open={bookOpen} onOpenChange={(o) => { setBookOpen(o); if (!o) setBookSuccess(false); }}>
        <DialogContent className="max-w-md">
          {bookSuccess ? (
            <div className="flex flex-col items-center py-6 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10"><CheckCircle2 className="h-8 w-8 text-primary" /></div>
              <h2 className="mt-4 font-display text-xl font-bold">Booking Confirmed!</h2>
              <div className="mt-3 rounded-lg bg-secondary p-3 text-sm space-y-1 w-full">
                <p><strong>Date:</strong> {selectedDate}</p>
                <p><strong>Time:</strong> {selectedSlot}</p>
                <p><strong>Consultant Timezone:</strong> AEST (UTC+10)</p>
                <p><strong>Your Timezone:</strong> {Intl.DateTimeFormat().resolvedOptions().timeZone}</p>
              </div>
              <Button className="mt-6" onClick={() => setBookOpen(false)}>Close</Button>
            </div>
          ) : (
            <>
              <DialogHeader><DialogTitle>Book — {bookConsultant?.name}</DialogTitle></DialogHeader>
              <div className="space-y-4 pt-2">
                <div>
                  <Label>Select Service</Label>
                  <Select value={selectedService} onValueChange={setSelectedService}>
                    <SelectTrigger className="mt-1.5"><SelectValue placeholder="Choose service" /></SelectTrigger>
                    <SelectContent>{bookConsultant?.services.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                {selectedService && (
                  <div>
                    <Label>Available Dates</Label>
                    <div className="mt-1.5 flex flex-wrap gap-2">
                      {bookConsultant?.dates.map((d) => (
                        <button key={d} onClick={() => setSelectedDate(d)} className={`rounded-lg px-3 py-1.5 text-xs font-medium border transition-colors ${selectedDate === d ? "border-primary bg-primary/10 text-primary" : "border-border hover:bg-secondary"}`}>{d}</button>
                      ))}
                    </div>
                  </div>
                )}
                {selectedDate && (
                  <div>
                    <Label>Available Time Slots</Label>
                    <div className="mt-1.5 flex flex-wrap gap-2">
                      {bookConsultant?.slots.map((s) => (
                        <button key={s} onClick={() => setSelectedSlot(s)} className={`rounded-lg px-3 py-1.5 text-xs font-medium border transition-colors ${selectedSlot === s ? "border-primary bg-primary/10 text-primary" : "border-border hover:bg-secondary"}`}>{s}</button>
                      ))}
                    </div>
                  </div>
                )}
                {selectedSlot && (
                  <div><Label>Description (optional)</Label><Textarea className="mt-1.5" rows={2} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="What would you like to discuss?" /></div>
                )}
                <Button className="w-full" disabled={!selectedSlot} onClick={() => setBookSuccess(true)}>
                  <Calendar className="h-4 w-4 mr-1" /> Confirm Booking
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
