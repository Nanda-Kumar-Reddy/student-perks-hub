import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Car, Search, Fuel, Calendar } from "lucide-react";

const vehicles = [
  { id: 1, name: "Toyota Corolla 2022", price: "$250/week", location: "Melbourne CBD", fuel: "Petrol", year: "2022", mileage: "15,000 km", desc: "Reliable sedan perfect for city driving. Low fuel consumption.", features: ["Bluetooth", "Reverse Camera", "Cruise Control"], image: "🚗" },
  { id: 2, name: "Hyundai i30 2021", price: "$220/week", location: "Sydney", fuel: "Petrol", year: "2021", mileage: "22,000 km", desc: "Compact hatchback with great fuel economy. Ideal for students.", features: ["Apple CarPlay", "Heated Seats", "Lane Assist"], image: "🚙" },
  { id: 3, name: "Mazda CX-5 2023", price: "$380/week", location: "Brisbane", fuel: "Petrol", year: "2023", mileage: "8,000 km", desc: "Spacious SUV for weekend adventures. Premium interior.", features: ["Leather Seats", "Sunroof", "360° Camera", "Bose Audio"], image: "🚘" },
  { id: 4, name: "Nissan Leaf 2022", price: "$200/week", location: "Melbourne", fuel: "Electric", year: "2022", mileage: "12,000 km", desc: "Eco-friendly electric car. Zero emissions and low running costs.", features: ["Fast Charging", "ProPILOT", "e-Pedal"], image: "⚡" },
];

export default function CarRentPage() {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<number | null>(null);
  const filtered = vehicles.filter((v) => v.name.toLowerCase().includes(search.toLowerCase()) || v.location.toLowerCase().includes(search.toLowerCase()));

  if (selected !== null) {
    const v = vehicles.find((x) => x.id === selected)!;
    return (
      <div className="space-y-6">
        <Button variant="ghost" onClick={() => setSelected(null)}>← Back to listings</Button>
        <div className="rounded-xl border border-border bg-card shadow-card overflow-hidden">
          <div className="flex h-48 items-center justify-center bg-secondary text-7xl">{v.image}</div>
          <div className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h1 className="font-display text-2xl font-bold">{v.name}</h1>
              <span className="font-display text-xl font-bold text-primary">{v.price}</span>
            </div>
            <div className="flex gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1"><Fuel className="h-4 w-4" /> {v.fuel}</span>
              <span className="flex items-center gap-1"><Calendar className="h-4 w-4" /> {v.year}</span>
              <span>{v.mileage}</span>
            </div>
            <p className="text-sm text-muted-foreground">{v.desc}</p>
            <div>
              <h3 className="font-display text-sm font-bold mb-2">Features</h3>
              <div className="flex flex-wrap gap-2">
                {v.features.map((f) => <span key={f} className="rounded-full bg-secondary px-2.5 py-1 text-xs font-medium">{f}</span>)}
              </div>
            </div>
            <Button className="mt-2">Enquire Now</Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold flex items-center gap-2"><Car className="h-6 w-6 text-primary" /> Car Rent / Sale</h1>
        <p className="text-sm text-muted-foreground mt-1">Find affordable cars to rent or buy</p>
      </div>
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input placeholder="Search cars..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        {filtered.map((v) => (
          <div key={v.id} onClick={() => setSelected(v.id)} className="cursor-pointer rounded-xl border border-border bg-card shadow-card overflow-hidden transition-all hover:shadow-card-hover hover:-translate-y-0.5">
            <div className="flex h-32 items-center justify-center bg-secondary text-5xl">{v.image}</div>
            <div className="p-4 space-y-2">
              <h3 className="font-display text-sm font-bold">{v.name}</h3>
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>{v.location}</span>
                <span className="flex items-center gap-1"><Fuel className="h-3 w-3" /> {v.fuel}</span>
              </div>
              <span className="font-display text-sm font-bold text-primary">{v.price}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
