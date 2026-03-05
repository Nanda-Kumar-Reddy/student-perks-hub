import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Briefcase, Search, MapPin, Clock } from "lucide-react";

const jobs = [
  { id: 1, title: "Barista", company: "Bean Counter Café", location: "Melbourne CBD", type: "Part-time", posted: "2d ago", desc: "We're looking for a friendly barista to join our team. No experience required — we'll train you!", requirements: ["Must have valid work rights", "Available weekends", "Good communication skills"], overview: { salary: "$25-28/hr", hours: "15-20 hrs/week", start: "Immediate" } },
  { id: 2, title: "Retail Assistant", company: "Uni Bookstore", location: "Sydney", type: "Casual", posted: "1d ago", desc: "Join our university bookstore team. Perfect for students who love books!", requirements: ["Current university student", "Basic computer skills", "Flexible hours"], overview: { salary: "$26/hr", hours: "10-15 hrs/week", start: "Next week" } },
  { id: 3, title: "IT Support", company: "TechCorp", location: "Brisbane", type: "Part-time", posted: "5d ago", desc: "Entry-level IT support role. Great opportunity to gain industry experience.", requirements: ["Studying IT or related field", "Problem-solving skills", "Basic networking knowledge"], overview: { salary: "$30-35/hr", hours: "20 hrs/week", start: "Flexible" } },
  { id: 4, title: "Food Delivery Driver", company: "QuickBites", location: "Melbourne", type: "Casual", posted: "3d ago", desc: "Deliver food in your own car or bike. Flexible hours, great tips!", requirements: ["Valid driver's licence", "Own vehicle", "Smartphone"], overview: { salary: "$22/hr + tips", hours: "Flexible", start: "Immediate" } },
];

export default function JobsPage() {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<number | null>(null);
  const filtered = jobs.filter((j) => j.title.toLowerCase().includes(search.toLowerCase()) || j.company.toLowerCase().includes(search.toLowerCase()) || j.location.toLowerCase().includes(search.toLowerCase()));

  if (selected !== null) {
    const j = jobs.find((x) => x.id === selected)!;
    return (
      <div className="space-y-6">
        <Button variant="ghost" onClick={() => setSelected(null)}>← Back to jobs</Button>
        <div className="rounded-xl border border-border bg-card p-6 shadow-card space-y-6">
          <div>
            <h1 className="font-display text-2xl font-bold">{j.title}</h1>
            <p className="text-muted-foreground mt-1">{j.company}</p>
            <div className="flex gap-4 mt-2 text-sm text-muted-foreground">
              <span className="flex items-center gap-1"><MapPin className="h-4 w-4" /> {j.location}</span>
              <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">{j.type}</span>
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            {Object.entries(j.overview).map(([k, v]) => (
              <div key={k} className="rounded-lg bg-secondary/50 p-3">
                <div className="text-xs text-muted-foreground capitalize">{k}</div>
                <div className="text-sm font-medium">{v}</div>
              </div>
            ))}
          </div>
          <div>
            <h3 className="font-display font-bold">Description</h3>
            <p className="mt-2 text-sm text-muted-foreground">{j.desc}</p>
          </div>
          <div>
            <h3 className="font-display font-bold">Requirements</h3>
            <ul className="mt-2 space-y-1">
              {j.requirements.map((r) => <li key={r} className="text-sm text-muted-foreground">• {r}</li>)}
            </ul>
          </div>
          <Button size="lg">Apply Now</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold flex items-center gap-2"><Briefcase className="h-6 w-6 text-primary" /> Jobs</h1>
        <p className="text-sm text-muted-foreground mt-1">Find part-time and casual jobs near you</p>
      </div>
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input placeholder="Search by job, company, or location..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
      </div>
      <div className="space-y-3">
        {filtered.map((j) => (
          <div key={j.id} onClick={() => setSelected(j.id)} className="cursor-pointer rounded-xl border border-border bg-card p-4 shadow-card transition-all hover:shadow-card-hover flex items-center justify-between">
            <div>
              <h3 className="font-display text-sm font-bold">{j.title}</h3>
              <p className="text-xs text-muted-foreground mt-0.5">{j.company}</p>
              <div className="flex gap-3 mt-2 text-xs text-muted-foreground">
                <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {j.location}</span>
                <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">{j.type}</span>
                <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {j.posted}</span>
              </div>
            </div>
            <Button size="sm" variant="outline">View</Button>
          </div>
        ))}
      </div>
    </div>
  );
}
