import { Button } from "@/components/ui/button";
import { CalendarDays, MapPin } from "lucide-react";

const events = [
  { id: 1, title: "Welcome Week BBQ", desc: "Meet fellow students at our semester kick-off BBQ. Free food and drinks!", date: "March 15, 2026", location: "University Park", time: "12:00 PM" },
  { id: 2, title: "Career Fair 2026", desc: "Connect with top employers hiring international students.", date: "March 22, 2026", location: "Convention Centre", time: "10:00 AM" },
  { id: 3, title: "Cultural Festival", desc: "Celebrate diversity with food stalls, performances, and workshops from around the world.", date: "April 5, 2026", location: "Student Union Building", time: "11:00 AM" },
  { id: 4, title: "Resume Workshop", desc: "Learn how to build an Australian-style resume. Bring your laptop!", date: "April 12, 2026", location: "Library Room 301", time: "2:00 PM" },
];

export default function EventsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold flex items-center gap-2"><CalendarDays className="h-6 w-6 text-primary" /> Events</h1>
        <p className="text-sm text-muted-foreground mt-1">Upcoming student events</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        {events.map((e) => (
          <div key={e.id} className="rounded-xl border border-border bg-card p-5 shadow-card transition-all hover:shadow-card-hover">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <CalendarDays className="h-3 w-3" /> {e.date} • {e.time}
            </div>
            <h3 className="mt-2 font-display text-lg font-bold">{e.title}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{e.desc}</p>
            <div className="mt-3 flex items-center justify-between">
              <span className="flex items-center gap-1 text-xs text-muted-foreground"><MapPin className="h-3 w-3" /> {e.location}</span>
              <Button size="sm">Register</Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
