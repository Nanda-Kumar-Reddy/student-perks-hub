import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Users, Globe, Calendar } from "lucide-react";

const consultants = [
  { id: 1, name: "Dr. Sarah Williams", experience: "10+ years", languages: ["English", "Mandarin"], speciality: "Immigration & Visa", price: "$80/session", about: "Expert in Australian immigration law and student visa applications.", services: ["Visa Extensions", "PR Applications", "Student Visa", "Work Rights"] },
  { id: 2, name: "Mark Thompson", experience: "8 years", languages: ["English", "Hindi"], speciality: "Career Coaching", price: "$60/session", about: "Helping international students build successful careers in Australia.", services: ["Resume Review", "Interview Prep", "Career Planning", "LinkedIn Optimization"] },
  { id: 3, name: "Emily Chen", experience: "5 years", languages: ["English", "Cantonese", "Mandarin"], speciality: "Academic Counseling", price: "$50/session", about: "University course selection and academic guidance for international students.", services: ["Course Selection", "University Transfers", "Academic Appeals", "Study Plans"] },
];

export default function ConsultationsPage() {
  const [selected, setSelected] = useState<number | null>(null);

  if (selected !== null) {
    const c = consultants.find((x) => x.id === selected)!;
    return (
      <div className="space-y-6">
        <Button variant="ghost" onClick={() => setSelected(null)}>← Back</Button>
        <div className="rounded-xl border border-border bg-card p-6 shadow-card space-y-6 max-w-2xl">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-xl font-bold text-primary">{c.name.split(" ").map((n) => n[0]).join("")}</div>
            <div>
              <h1 className="font-display text-xl font-bold">{c.name}</h1>
              <p className="text-sm text-muted-foreground">{c.speciality}</p>
            </div>
          </div>
          <div className="flex gap-4 text-sm text-muted-foreground">
            <span>{c.experience} experience</span>
            <span className="font-bold text-primary">{c.price}</span>
          </div>
          <div><h3 className="font-display font-bold">About</h3><p className="mt-2 text-sm text-muted-foreground">{c.about}</p></div>
          <div>
            <h3 className="font-display font-bold">Services</h3>
            <div className="mt-2 flex flex-wrap gap-2">{c.services.map((s) => <span key={s} className="rounded-full bg-secondary px-2.5 py-1 text-xs font-medium">{s}</span>)}</div>
          </div>
          <div>
            <h3 className="font-display font-bold">Languages</h3>
            <div className="mt-2 flex gap-2">{c.languages.map((l) => <span key={l} className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">{l}</span>)}</div>
          </div>
          <Button size="lg"><Calendar className="h-4 w-4 mr-1" /> Book Session</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold flex items-center gap-2"><Users className="h-6 w-6 text-primary" /> 1:1 Consultations</h1>
        <p className="text-sm text-muted-foreground mt-1">Book expert consultations</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {consultants.map((c) => (
          <div key={c.id} className="rounded-xl border border-border bg-card p-5 shadow-card transition-all hover:shadow-card-hover">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">{c.name.split(" ").map((n) => n[0]).join("")}</div>
              <div>
                <h3 className="font-display text-sm font-bold">{c.name}</h3>
                <p className="text-xs text-muted-foreground">{c.speciality}</p>
              </div>
            </div>
            <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
              <span>{c.experience}</span>
              <span>•</span>
              <span className="flex items-center gap-1"><Globe className="h-3 w-3" /> {c.languages.join(", ")}</span>
            </div>
            <div className="mt-3 flex items-center justify-between">
              <span className="font-display text-sm font-bold text-primary">{c.price}</span>
              <Button size="sm" onClick={() => setSelected(c.id)}>View Profile</Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
