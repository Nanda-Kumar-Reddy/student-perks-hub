import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Home, Bed, Bath, Search } from "lucide-react";

const properties = [
  { id: 1, title: "Modern Studio Apartment", rent: "$280/week", address: "123 Swanston St, Melbourne", beds: 1, baths: 1, furnishing: "Fully Furnished", available: true, desc: "Bright and modern studio in the heart of CBD. Close to universities and public transport.", image: "🏠" },
  { id: 2, title: "Shared 2BR Apartment", rent: "$180/week", address: "45 Elizabeth St, Sydney", beds: 2, baths: 1, furnishing: "Semi Furnished", available: true, desc: "Affordable shared apartment near campus. All bills included.", image: "🏢" },
  { id: 3, title: "Student House Room", rent: "$150/week", address: "78 Queen St, Brisbane", beds: 1, baths: 1, furnishing: "Unfurnished", available: false, desc: "Single room in a student share house. Great community.", image: "🏡" },
  { id: 4, title: "Luxury 1BR Unit", rent: "$350/week", address: "200 Collins St, Melbourne", beds: 1, baths: 1, furnishing: "Fully Furnished", available: true, desc: "Premium living with gym and pool access. Walking distance to uni.", image: "🏙️" },
];

export default function AccommodationsPage() {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<number | null>(null);
  const filtered = properties.filter((p) => p.title.toLowerCase().includes(search.toLowerCase()) || p.address.toLowerCase().includes(search.toLowerCase()));

  if (selected !== null) {
    const p = properties.find((x) => x.id === selected)!;
    return (
      <div className="space-y-6">
        <Button variant="ghost" onClick={() => setSelected(null)}>← Back to listings</Button>
        <div className="rounded-xl border border-border bg-card shadow-card overflow-hidden">
          <div className="flex h-48 items-center justify-center bg-secondary text-7xl">{p.image}</div>
          <div className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h1 className="font-display text-2xl font-bold">{p.title}</h1>
              <span className="font-display text-xl font-bold text-primary">{p.rent}</span>
            </div>
            <p className="text-muted-foreground">{p.address}</p>
            <div className="flex gap-4 text-sm">
              <span className="flex items-center gap-1"><Bed className="h-4 w-4" /> {p.beds} Bed</span>
              <span className="flex items-center gap-1"><Bath className="h-4 w-4" /> {p.baths} Bath</span>
              <span className="rounded-full bg-secondary px-2.5 py-0.5 text-xs font-medium">{p.furnishing}</span>
            </div>
            <p className="text-sm text-muted-foreground">{p.desc}</p>
            <div className="flex gap-3 pt-2">
              <Button>Request Viewing</Button>
              <Button variant="outline">Contact Owner</Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold flex items-center gap-2"><Home className="h-6 w-6 text-primary" /> Accommodations</h1>
        <p className="text-sm text-muted-foreground mt-1">Find your perfect student accommodation</p>
      </div>
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input placeholder="Search by location or property name..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        {filtered.map((p) => (
          <div key={p.id} onClick={() => setSelected(p.id)} className="cursor-pointer rounded-xl border border-border bg-card shadow-card overflow-hidden transition-all hover:shadow-card-hover hover:-translate-y-0.5">
            <div className="flex h-32 items-center justify-center bg-secondary text-5xl">{p.image}</div>
            <div className="p-4 space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="font-display text-sm font-bold">{p.title}</h3>
                <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${p.available ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive"}`}>
                  {p.available ? "Available" : "Taken"}
                </span>
              </div>
              <p className="text-xs text-muted-foreground">{p.address}</p>
              <div className="flex items-center justify-between">
                <div className="flex gap-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1"><Bed className="h-3 w-3" /> {p.beds}</span>
                  <span className="flex items-center gap-1"><Bath className="h-3 w-3" /> {p.baths}</span>
                </div>
                <span className="font-display text-sm font-bold text-primary">{p.rent}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
