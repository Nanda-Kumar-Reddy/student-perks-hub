import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CarFront, MapPin, Calendar } from "lucide-react";

const partners = [
  { id: 1, name: "DriveRight School", location: "Melbourne", services: ["Manual Lessons", "Auto Lessons", "Test Preparation"], desc: "Certified driving school with multilingual instructors. Specializing in international student driving education.", packages: [{ name: "5 Lessons Pack", price: "$350" }, { name: "10 Lessons Pack", price: "$650" }, { name: "Test Package", price: "$200" }] },
  { id: 2, name: "SafeWheels Academy", location: "Sydney", services: ["Auto Lessons", "Hazard Training", "Night Driving"], desc: "Patient instructors with high pass rates. Flexible scheduling for students.", packages: [{ name: "Starter Pack", price: "$300" }, { name: "Premium Pack", price: "$550" }, { name: "Mock Test", price: "$120" }] },
  { id: 3, name: "QuickPass Driving", location: "Brisbane", services: ["Manual & Auto", "International Licence Conversion", "Refresher Courses"], desc: "Fast-track your licence. Specializing in converting international licences.", packages: [{ name: "Conversion Package", price: "$250" }, { name: "Full Course", price: "$700" }, { name: "Single Lesson", price: "$75" }] },
];

export default function DrivingLicencePage() {
  const [selected, setSelected] = useState<number | null>(null);

  if (selected !== null) {
    const p = partners.find((x) => x.id === selected)!;
    return (
      <div className="space-y-6">
        <Button variant="ghost" onClick={() => setSelected(null)}>← Back</Button>
        <div className="rounded-xl border border-border bg-card p-6 shadow-card space-y-4 max-w-2xl">
          <div>
            <h1 className="font-display text-xl font-bold">{p.name}</h1>
            <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1"><MapPin className="h-4 w-4" /> {p.location}</p>
          </div>
          <p className="text-sm text-muted-foreground">{p.desc}</p>
          <div>
            <h3 className="font-display font-bold">Services</h3>
            <div className="mt-2 flex flex-wrap gap-2">{p.services.map((s) => <span key={s} className="rounded-full bg-secondary px-2.5 py-1 text-xs font-medium">{s}</span>)}</div>
          </div>
          <div>
            <h3 className="font-display font-bold">Packages</h3>
            <div className="mt-2 space-y-2">
              {p.packages.map((pkg) => (
                <div key={pkg.name} className="flex items-center justify-between rounded-lg bg-secondary/50 p-3">
                  <span className="text-sm font-medium">{pkg.name}</span>
                  <div className="flex items-center gap-3">
                    <span className="font-display text-sm font-bold text-primary">{pkg.price}</span>
                    <Button size="sm"><Calendar className="h-3 w-3 mr-1" /> Book</Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold flex items-center gap-2"><CarFront className="h-6 w-6 text-primary" /> Driving Licence</h1>
        <p className="text-sm text-muted-foreground mt-1">Find certified driving partners</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {partners.map((p) => (
          <div key={p.id} className="rounded-xl border border-border bg-card p-5 shadow-card transition-all hover:shadow-card-hover">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary"><CarFront className="h-5 w-5" /></div>
              <div>
                <h3 className="font-display text-sm font-bold">{p.name}</h3>
                <p className="text-xs text-muted-foreground flex items-center gap-1"><MapPin className="h-3 w-3" /> {p.location}</p>
              </div>
            </div>
            <div className="mt-3 flex flex-wrap gap-1">{p.services.map((s) => <span key={s} className="rounded-full bg-secondary px-2 py-0.5 text-[10px] font-medium">{s}</span>)}</div>
            <div className="mt-3"><Button size="sm" className="w-full" onClick={() => setSelected(p.id)}>View Packages</Button></div>
          </div>
        ))}
      </div>
    </div>
  );
}
