import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { CalendarDays, MapPin, Clock, Monitor, Building, ArrowLeft, CheckCircle2, ChevronLeft, ChevronRight, Users, Star, Ticket, Info } from "lucide-react";
import PhoneField from "@/components/shared/PhoneField";
import { motion } from "framer-motion";

const events = [
  { id: 1, title: "Welcome Week BBQ", desc: "Meet fellow students at our semester kick-off BBQ. Free food and drinks!", date: "March 15, 2026", duration: "3 hours", mode: "Offline", location: "University Park", images: ["🎉", "🍔", "🎵"], time: "12:00 PM — 3:00 PM", capacity: 200, registered: 142, organizer: "Student Union", price: "Free", about: "Kick off the new semester with our legendary Welcome Week BBQ! This is the perfect opportunity to meet fellow international students, make new friends, and enjoy a relaxing afternoon in University Park. We'll have free burgers, drinks, music, and fun activities throughout the event.", highlights: ["Free Food & Drinks", "Live Music", "Networking Activities", "Welcome Kits"], schedule: [{ time: "12:00 PM", activity: "Gates Open & Welcome" }, { time: "12:30 PM", activity: "BBQ & Food Stalls" }, { time: "1:30 PM", activity: "Live Music & Performances" }, { time: "2:30 PM", activity: "Raffle Draw & Prizes" }] },
  { id: 2, title: "Career Fair 2026", desc: "Connect with top employers hiring international students.", date: "March 22, 2026", duration: "5 hours", mode: "Offline", location: "Convention Centre", images: ["💼", "🤝"], time: "10:00 AM — 3:00 PM", capacity: 500, registered: 387, organizer: "Career Services", price: "Free", about: "The annual Career Fair brings together over 50 top employers actively recruiting international students. Whether you're looking for part-time work, internships, or graduate positions, this is your chance to make valuable connections and explore career opportunities across multiple industries.", highlights: ["50+ Employers", "Resume Review Booth", "Interview Tips Workshop", "On-the-spot Interviews"], schedule: [{ time: "10:00 AM", activity: "Doors Open" }, { time: "10:30 AM", activity: "Keynote: Job Market Trends" }, { time: "11:00 AM", activity: "Employer Booths Open" }, { time: "1:00 PM", activity: "Panel: Succeeding as an International Graduate" }] },
  { id: 3, title: "Online Visa Workshop", desc: "Learn everything about visa extensions and work rights.", date: "April 1, 2026", duration: "2 hours", mode: "Online", location: "Zoom", images: ["💻", "📋"], time: "6:00 PM — 8:00 PM", capacity: 100, registered: 67, organizer: "International Student Support", price: "Free", about: "This comprehensive online workshop covers everything you need to know about visa extensions, work rights, and compliance. Led by registered migration agents, you'll get practical advice on navigating the Australian immigration system as a student.", highlights: ["Expert Migration Agents", "Q&A Session", "Free Resources", "Recording Available"], schedule: [{ time: "6:00 PM", activity: "Introduction & Overview" }, { time: "6:30 PM", activity: "Visa Extension Process" }, { time: "7:00 PM", activity: "Work Rights & Compliance" }, { time: "7:30 PM", activity: "Live Q&A" }] },
  { id: 4, title: "Cultural Festival", desc: "Celebrate diversity with food stalls, performances, and workshops.", date: "April 5, 2026", duration: "6 hours", mode: "Offline", location: "Student Union Building", images: ["🌍", "🎭", "🍜"], time: "11:00 AM — 5:00 PM", capacity: 300, registered: 215, organizer: "Multicultural Society", price: "$5", about: "Experience the rich cultural diversity of our student community at the annual Cultural Festival! Enjoy authentic cuisines from around the world, traditional dance and music performances, art workshops, and much more. This celebration brings together students from all backgrounds for an unforgettable day.", highlights: ["20+ Food Stalls", "Cultural Performances", "Art Workshops", "Traditional Dress Parade"], schedule: [{ time: "11:00 AM", activity: "Festival Opens" }, { time: "12:00 PM", activity: "Food Stalls & Market" }, { time: "2:00 PM", activity: "Cultural Performances" }, { time: "4:00 PM", activity: "Traditional Dress Parade & Awards" }] },
];

export default function EventDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const event = events.find((e) => e.id === Number(id));

  const [imgIdx, setImgIdx] = useState(0);
  const [registerOpen, setRegisterOpen] = useState(false);
  const [regName, setRegName] = useState("");
  const [regPhone, setRegPhone] = useState("");
  const [regSuccess, setRegSuccess] = useState(false);

  if (!event) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <h2 className="text-xl font-bold">Event not found</h2>
        <Button variant="outline" className="mt-4" onClick={() => navigate("/student/events")}>
          <ArrowLeft className="h-4 w-4 mr-1" /> Back to Events
        </Button>
      </div>
    );
  }

  const openRegister = () => {
    setRegisterOpen(true);
    setRegSuccess(false);
    setRegName("");
    setRegPhone("");
  };

  const spotsLeft = event.capacity - event.registered;

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }} className="space-y-6">
      <Button variant="ghost" size="sm" onClick={() => navigate("/student/events")} className="gap-1 text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Back to Events
      </Button>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Image gallery */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="relative flex h-48 items-center justify-center rounded-xl bg-secondary text-7xl overflow-hidden border border-border">
            {event.images[imgIdx]}
            {event.images.length > 1 && (
              <>
                <button onClick={() => setImgIdx((imgIdx - 1 + event.images.length) % event.images.length)} className="absolute left-2 rounded-full bg-background/80 p-1.5 hover:bg-background transition-colors"><ChevronLeft className="h-4 w-4" /></button>
                <button onClick={() => setImgIdx((imgIdx + 1) % event.images.length)} className="absolute right-2 rounded-full bg-background/80 p-1.5 hover:bg-background transition-colors"><ChevronRight className="h-4 w-4" /></button>
              </>
            )}
            <div className="absolute bottom-2 flex gap-1">
              {event.images.map((_, i) => (
                <span key={i} className={`h-1.5 w-1.5 rounded-full transition-colors ${i === imgIdx ? "bg-primary" : "bg-muted-foreground/40"}`} />
              ))}
            </div>
          </motion.div>

          {/* Header */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="rounded-xl border border-border bg-card p-6 shadow-card">
            <div className="flex items-start gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <CalendarDays className="h-7 w-7" />
              </div>
              <div className="flex-1">
                <h1 className="font-display text-xl font-bold">{event.title}</h1>
                <p className="text-sm text-muted-foreground mt-1">{event.desc}</p>
                <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1"><CalendarDays className="h-3 w-3" /> {event.date}</span>
                  <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {event.time}</span>
                  <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {event.location}</span>
                  <span className="flex items-center gap-1">{event.mode === "Online" ? <Monitor className="h-3 w-3" /> : <Building className="h-3 w-3" />} {event.mode}</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* About */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="rounded-xl border border-border bg-card p-6 shadow-card">
            <h2 className="font-display text-base font-bold mb-3">About This Event</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">{event.about}</p>
          </motion.div>

          {/* Highlights */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="rounded-xl border border-border bg-card p-6 shadow-card">
            <h2 className="font-display text-base font-bold mb-3">Event Highlights</h2>
            <div className="flex flex-wrap gap-2">
              {event.highlights.map((h) => (
                <span key={h} className="rounded-full bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary">{h}</span>
              ))}
            </div>
          </motion.div>

          {/* Schedule */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="rounded-xl border border-border bg-card p-6 shadow-card">
            <h2 className="font-display text-base font-bold mb-3">Schedule</h2>
            <div className="space-y-2">
              {event.schedule.map((s, i) => (
                <div key={i} className="flex items-center gap-4 rounded-lg border border-border p-3 transition-colors hover:bg-secondary/30">
                  <span className="text-xs font-bold text-primary min-w-[70px]">{s.time}</span>
                  <span className="text-sm">{s.activity}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="rounded-xl border border-border bg-card p-5 shadow-card sticky top-4">
            <h3 className="font-display text-base font-bold mb-4">Event Details</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Date</span>
                <span className="font-medium">{event.date}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Time</span>
                <span className="font-medium">{event.time}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Duration</span>
                <span className="font-medium">{event.duration}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Mode</span>
                <span className="flex items-center gap-1 font-medium">{event.mode === "Online" ? <Monitor className="h-3 w-3" /> : <Building className="h-3 w-3" />} {event.mode}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Location</span>
                <span className="font-medium">{event.location}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Price</span>
                <span className="font-display font-bold text-primary">{event.price}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Organizer</span>
                <span className="font-medium">{event.organizer}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Spots Left</span>
                <span className={`font-medium ${spotsLeft < 50 ? "text-destructive" : ""}`}>{spotsLeft} / {event.capacity}</span>
              </div>
            </div>
            <Button className="w-full mt-5" onClick={openRegister}>
              <Ticket className="h-4 w-4 mr-1" /> Register Now
            </Button>
          </motion.div>
        </div>
      </div>

      {/* Registration Dialog */}
      <Dialog open={registerOpen} onOpenChange={(o) => { setRegisterOpen(o); if (!o) setRegSuccess(false); }}>
        <DialogContent className="max-w-sm">
          {regSuccess ? (
            <div className="flex flex-col items-center py-6 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10"><CheckCircle2 className="h-8 w-8 text-primary" /></div>
              <h2 className="mt-4 font-display text-xl font-bold">Registered!</h2>
              <div className="mt-3 rounded-lg bg-secondary p-3 text-sm space-y-1 w-full">
                <p><strong>Event:</strong> {event.title}</p>
                <p><strong>Date:</strong> {event.date}</p>
                <p><strong>Time:</strong> {event.time}</p>
                <p><strong>Location:</strong> {event.location}</p>
              </div>
              <Button className="mt-6" onClick={() => setRegisterOpen(false)}>Close</Button>
            </div>
          ) : (
            <>
              <DialogHeader><DialogTitle>Register — {event.title}</DialogTitle></DialogHeader>
              <div className="space-y-4 pt-2">
                <div className="rounded-lg bg-secondary p-3">
                  <p className="text-sm font-medium">{event.title}</p>
                  <p className="text-xs text-muted-foreground">{event.date} • {event.location}</p>
                </div>
                <div><Label>Full Name</Label><Input className="mt-1.5" value={regName} onChange={(e) => setRegName(e.target.value)} /></div>
                <PhoneField value={regPhone} onChange={setRegPhone} />
                <Button className="w-full" disabled={!regName.trim() || !regPhone.trim()} onClick={() => setRegSuccess(true)}>Submit Registration</Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
