import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Calculator, Calendar, CheckCircle2, Clock, Video, Building } from "lucide-react";
import RequestsListTab from "@/components/shared/RequestsListTab";
import StatusBadge from "@/components/shared/StatusBadge";

const professionals = [
  { id: 1, name: "Smith & Co Accounting", experience: "15+ years", services: ["Tax Returns", "BAS Lodgement", "Bookkeeping", "ABN Registration"], desc: "Full-service accounting firm specializing in student and small business tax.", price: "From $49", officeHours: "Mon-Fri 9AM-5PM", about: "We've been helping students with their taxes for over 15 years.", disclaimer: "All services subject to ATO regulations.", meetingTypes: ["Online", "Offline"], dates: ["March 10", "March 12", "March 14"], slots: ["9:00 AM", "11:00 AM", "2:00 PM"] },
  { id: 2, name: "TaxEasy Australia", experience: "8 years", services: ["Student Tax Returns", "PAYG", "Superannuation", "Tax Planning"], desc: "Affordable tax services tailored for international students.", price: "From $39", officeHours: "Mon-Sat 10AM-6PM", about: "Making tax simple and affordable for students.", disclaimer: "Results may vary based on individual circumstances.", meetingTypes: ["Online"], dates: ["March 11", "March 13"], slots: ["10:00 AM", "1:00 PM", "3:00 PM"] },
  { id: 3, name: "NumberCrunch", experience: "10 years", services: ["Tax Returns", "Financial Planning", "Investment Advice", "SMSF"], desc: "Professional accounting with personalized financial advice.", price: "From $59", officeHours: "Mon-Fri 8AM-4PM", about: "Expert financial guidance for your future.", disclaimer: "Financial advice is general in nature.", meetingTypes: ["Online", "Offline"], dates: ["March 10", "March 15"], slots: ["8:00 AM", "10:00 AM", "2:00 PM"] },
];

const myBookings = [
  { id: 1, service: "Tax Returns", provider: "Smith & Co Accounting", date: "March 10, 2026", time: "2:00 PM", mode: "Online", status: "Confirmed" },
  { id: 2, service: "Student Tax Returns", provider: "TaxEasy Australia", date: "March 13, 2026", time: "1:00 PM", mode: "Online", status: "Pending" },
  { id: 3, service: "Financial Planning", provider: "NumberCrunch", date: "Feb 28, 2026", time: "10:00 AM", mode: "Offline", status: "Completed" },
];

export default function AccountingPage() {
  const [bookOpen, setBookOpen] = useState(false);
  const [bookProvider, setBookProvider] = useState<typeof professionals[0] | null>(null);
  const [selectedService, setSelectedService] = useState("");
  const [meetingType, setMeetingType] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedSlot, setSelectedSlot] = useState("");
  const [requirements, setRequirements] = useState("");
  const [bookSuccess, setBookSuccess] = useState(false);

  const handleBook = (p: typeof professionals[0]) => {
    setBookProvider(p);
    setBookOpen(true);
    setBookSuccess(false);
    setSelectedService("");
    setMeetingType("");
    setSelectedDate("");
    setSelectedSlot("");
    setRequirements("");
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold flex items-center gap-2"><Calculator className="h-6 w-6 text-primary" /> Accounting Service</h1>
        <p className="text-sm text-muted-foreground mt-1">Professional accounting services</p>
      </div>
      <Tabs defaultValue="providers" className="w-full">
        <TabsList>
          <TabsTrigger value="providers">Accounting Providers</TabsTrigger>
          <TabsTrigger value="bookings">My Bookings</TabsTrigger>
        </TabsList>
        <TabsContent value="providers" className="mt-4">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {professionals.map((p) => (
              <div key={p.id} className="rounded-xl border border-border bg-card p-5 shadow-card transition-all hover:shadow-card-hover">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary"><Calculator className="h-5 w-5" /></div>
                  <div>
                    <h3 className="font-display text-sm font-bold">{p.name}</h3>
                    <p className="text-xs text-muted-foreground">{p.experience}</p>
                  </div>
                </div>
                <p className="mt-2 text-xs text-muted-foreground flex items-center gap-1"><Clock className="h-3 w-3" /> {p.officeHours}</p>
                <p className="mt-2 text-xs text-muted-foreground">{p.about}</p>
                <p className="mt-1 text-[10px] text-muted-foreground italic">{p.disclaimer}</p>
                <div className="mt-3 flex flex-wrap gap-1">{p.services.slice(0, 3).map((s) => <span key={s} className="rounded-full bg-secondary px-2 py-0.5 text-[10px] font-medium">{s}</span>)}</div>
                <div className="mt-3 flex items-center justify-between">
                  <span className="font-display text-sm font-bold text-primary">{p.price}</span>
                  <Button size="sm" onClick={() => handleBook(p)}>Book</Button>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>
        <TabsContent value="bookings" className="mt-4">
          <div className="space-y-3">
            {myBookings.map((b) => (
              <div key={b.id} className="rounded-xl border border-border bg-card p-4 shadow-card flex items-center justify-between transition-all hover:shadow-card-hover">
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary"><Calculator className="h-5 w-5" /></div>
                  <div>
                    <h3 className="text-sm font-medium">{b.service}</h3>
                    <p className="text-xs text-muted-foreground">{b.provider}</p>
                    <div className="flex flex-wrap gap-2 mt-1 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {b.date} at {b.time}</span>
                      <span className="flex items-center gap-1">{b.mode === "Online" ? <Video className="h-3 w-3" /> : <Building className="h-3 w-3" />} {b.mode}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <StatusBadge status={b.status} />
                  {b.status === "Confirmed" && b.mode === "Online" && <Button size="sm" variant="outline">Join Session</Button>}
                </div>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      <Dialog open={bookOpen} onOpenChange={(o) => { setBookOpen(o); if (!o) setBookSuccess(false); }}>
        <DialogContent className="max-w-md">
          {bookSuccess ? (
            <div className="flex flex-col items-center py-6 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10"><CheckCircle2 className="h-8 w-8 text-primary" /></div>
              <h2 className="mt-4 font-display text-xl font-bold">Appointment Booked!</h2>
              <div className="mt-3 rounded-lg bg-secondary p-3 text-sm space-y-1 w-full">
                <p><strong>Date:</strong> {selectedDate}</p>
                <p><strong>Time:</strong> {selectedSlot}</p>
                <p><strong>Type:</strong> {meetingType}</p>
              </div>
              <Button className="mt-6" onClick={() => setBookOpen(false)}>Close</Button>
            </div>
          ) : (
            <>
              <DialogHeader><DialogTitle>Book — {bookProvider?.name}</DialogTitle></DialogHeader>
              <div className="space-y-4 pt-2">
                <div>
                  <Label>Service</Label>
                  <Select value={selectedService} onValueChange={setSelectedService}>
                    <SelectTrigger className="mt-1.5"><SelectValue placeholder="Select service" /></SelectTrigger>
                    <SelectContent>{bookProvider?.services.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                {selectedService && (
                  <div>
                    <Label>Meeting Type</Label>
                    <Select value={meetingType} onValueChange={setMeetingType}>
                      <SelectTrigger className="mt-1.5"><SelectValue placeholder="Select type" /></SelectTrigger>
                      <SelectContent>{bookProvider?.meetingTypes.map((m) => <SelectItem key={m} value={m}>{m}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                )}
                {meetingType && (
                  <div>
                    <Label>Available Dates</Label>
                    <div className="mt-1.5 flex flex-wrap gap-2">
                      {bookProvider?.dates.map((d) => (
                        <button key={d} onClick={() => setSelectedDate(d)} className={`rounded-lg px-3 py-1.5 text-xs font-medium border transition-colors ${selectedDate === d ? "border-primary bg-primary/10 text-primary" : "border-border hover:bg-secondary"}`}>{d}</button>
                      ))}
                    </div>
                  </div>
                )}
                {selectedDate && (
                  <div>
                    <Label>Time Slots</Label>
                    <div className="mt-1.5 flex flex-wrap gap-2">
                      {bookProvider?.slots.map((s) => (
                        <button key={s} onClick={() => setSelectedSlot(s)} className={`rounded-lg px-3 py-1.5 text-xs font-medium border transition-colors ${selectedSlot === s ? "border-primary bg-primary/10 text-primary" : "border-border hover:bg-secondary"}`}>{s}</button>
                      ))}
                    </div>
                  </div>
                )}
                {selectedSlot && (
                  <div><Label>Requirements (optional)</Label><Textarea className="mt-1.5" rows={2} value={requirements} onChange={(e) => setRequirements(e.target.value)} /></div>
                )}
                <Button className="w-full" disabled={!selectedSlot} onClick={() => setBookSuccess(true)}>
                  <Calendar className="h-4 w-4 mr-1" /> Book Appointment
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
