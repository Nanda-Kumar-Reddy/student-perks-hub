import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calculator, Calendar } from "lucide-react";

const professionals = [
  { id: 1, name: "Smith & Co Accounting", experience: "15+ years", services: ["Tax Returns", "BAS Lodgement", "Bookkeeping", "ABN Registration"], desc: "Full-service accounting firm specializing in student and small business tax.", price: "From $49" },
  { id: 2, name: "TaxEasy Australia", experience: "8 years", services: ["Student Tax Returns", "PAYG", "Superannuation", "Tax Planning"], desc: "Affordable tax services tailored for international students.", price: "From $39" },
  { id: 3, name: "NumberCrunch", experience: "10 years", services: ["Tax Returns", "Financial Planning", "Investment Advice", "SMSF"], desc: "Professional accounting with personalized financial advice.", price: "From $59" },
];

export default function AccountingPage() {
  const [selected, setSelected] = useState<number | null>(null);

  if (selected !== null) {
    const p = professionals.find((x) => x.id === selected)!;
    return (
      <div className="space-y-6">
        <Button variant="ghost" onClick={() => setSelected(null)}>← Back</Button>
        <div className="rounded-xl border border-border bg-card p-6 shadow-card space-y-4 max-w-2xl">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 text-primary"><Calculator className="h-6 w-6" /></div>
            <div>
              <h1 className="font-display text-xl font-bold">{p.name}</h1>
              <p className="text-sm text-muted-foreground">{p.experience} experience</p>
            </div>
          </div>
          <p className="text-sm text-muted-foreground">{p.desc}</p>
          <div>
            <h3 className="font-display font-bold">Services</h3>
            <div className="mt-2 flex flex-wrap gap-2">{p.services.map((s) => <span key={s} className="rounded-full bg-secondary px-2.5 py-1 text-xs font-medium">{s}</span>)}</div>
          </div>
          <div className="flex items-center justify-between pt-2">
            <span className="font-display text-lg font-bold text-primary">{p.price}</span>
            <Button><Calendar className="h-4 w-4 mr-1" /> Book Appointment</Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold flex items-center gap-2"><Calculator className="h-6 w-6 text-primary" /> Accounting Service</h1>
        <p className="text-sm text-muted-foreground mt-1">Professional accounting services for students</p>
      </div>
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
            <div className="mt-3 flex flex-wrap gap-1">{p.services.slice(0, 3).map((s) => <span key={s} className="rounded-full bg-secondary px-2 py-0.5 text-[10px] font-medium">{s}</span>)}</div>
            <div className="mt-3 flex items-center justify-between">
              <span className="font-display text-sm font-bold text-primary">{p.price}</span>
              <Button size="sm" onClick={() => setSelected(p.id)}>View</Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
