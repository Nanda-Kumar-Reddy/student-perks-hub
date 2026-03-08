import { useState } from "react"; // refresh
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Car, Search, Fuel, MapPin, Gauge } from "lucide-react";
import { motion } from "framer-motion";
import EnquiryPopup from "@/components/shared/EnquiryPopup";
import RequestsListTab from "@/components/shared/RequestsListTab";

const vehicles = [
  { id: 1, name: "Toyota Corolla 2022", weeklyPrice: "$250/week", monthlyPrice: "$900/month", location: "NSW", fuel: "Petrol", year: "2022", mileage: "15,000 km", reading: "45,000 km", desc: "Reliable sedan perfect for city driving.", type: "rent", badge: "Rent" },
  { id: 2, name: "Hyundai i30 2021", weeklyPrice: "$220/week", monthlyPrice: "$800/month", location: "SA", fuel: "Petrol", year: "2021", mileage: "22,000 km", reading: "60,000 km", desc: "Compact hatchback with great fuel economy.", type: "rent", badge: "Rent" },
  { id: 3, name: "Mazda CX-5 2023", weeklyPrice: "$380/week", monthlyPrice: "$1400/month", location: "TAS", fuel: "Petrol", year: "2023", mileage: "8,000 km", reading: "24,000 km", desc: "Spacious SUV for weekend adventures.", type: "rent", badge: "Rent" },
  { id: 4, name: "Nissan Leaf 2022", weeklyPrice: "$200/week", monthlyPrice: "$720/month", location: "ACT", fuel: "Electric", year: "2022", mileage: "12,000 km", reading: "36,000 km", desc: "Eco-friendly electric car.", type: "rent", badge: "Rent" },
  { id: 5, name: "Ford Ranger 2020", weeklyPrice: "$18,500", monthlyPrice: "", location: "NSW", fuel: "Diesel", year: "2020", mileage: "5,000 km/yr", reading: "78,000 km", desc: "Rugged ute in great condition.", type: "sale", badge: "Sale" },
  { id: 6, name: "Honda Civic 2019", weeklyPrice: "$14,200", monthlyPrice: "", location: "NT", fuel: "Petrol", year: "2019", mileage: "8,000 km/yr", reading: "95,000 km", desc: "Reliable sedan, low running costs.", type: "sale", badge: "Sale" },
];

const cities = ["All", "NSW", "SA", "TAS", "ACT", "NT"];

const myRequests = [
  { id: 1, title: "Toyota Corolla 2022", subtitle: "Rent enquiry — NSW", date: "March 8, 2026", status: "Pending" },
  { id: 2, title: "Ford Ranger 2020", subtitle: "Sale enquiry — NSW", date: "March 2, 2026", status: "Confirmed" },
];

function VehicleGrid({ items, type }: { items: typeof vehicles; type: string }) {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [city, setCity] = useState("All");
  const [enquiryOpen, setEnquiryOpen] = useState(false);
  const [enquiryTitle, setEnquiryTitle] = useState("");

  const filtered = items.filter((v) => {
    const ms = v.name.toLowerCase().includes(search.toLowerCase());
    const mc = city === "All" || v.location === city;
    return ms && mc;
  });

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search vehicles..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
        </div>
        <Select value={city} onValueChange={setCity}>
          <SelectTrigger className="w-full sm:w-36"><SelectValue /></SelectTrigger>
          <SelectContent>{cities.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
        </Select>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        {filtered.map((v, i) => (
          <motion.div
            key={v.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08, duration: 0.3 }}
            onClick={() => navigate(`/student/cars/${v.id}`)}
            className="cursor-pointer rounded-xl border border-border bg-card shadow-card overflow-hidden transition-all hover:shadow-card-hover hover:-translate-y-0.5"
          >
            <div className="relative flex h-32 items-center justify-center bg-secondary text-5xl">
              🚗
              <span className={`absolute top-2 left-2 rounded-full px-2 py-0.5 text-[10px] font-bold backdrop-blur-sm border ${
                v.badge === "Rent"
                  ? "bg-primary/10 text-primary border-primary/20"
                  : "bg-accent/10 text-accent border-accent/20"
              }`}>{v.badge}</span>
            </div>
            <div className="p-4 space-y-2">
              <h3 className="font-display text-sm font-bold">{v.name}</h3>
              <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {v.location}</span>
                <span className="flex items-center gap-1"><Fuel className="h-3 w-3" /> {v.fuel}</span>
                <span className="flex items-center gap-1"><Gauge className="h-3 w-3" /> {v.reading}</span>
              </div>
              <p className="text-xs text-muted-foreground">{v.desc}</p>
              <div className="flex items-center justify-between pt-1">
                <div>
                  <span className="font-display text-sm font-bold text-primary">{v.weeklyPrice}</span>
                  {v.monthlyPrice && <span className="text-xs text-muted-foreground ml-1">/ {v.monthlyPrice}</span>}
                </div>
                <Button size="sm" onClick={(e) => { e.stopPropagation(); setEnquiryTitle(v.name); setEnquiryOpen(true); }}>Enquire</Button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
      <EnquiryPopup open={enquiryOpen} onOpenChange={setEnquiryOpen} title={enquiryTitle} />
    </div>
  );
}

export default function CarRentPage() {
  const rentVehicles = vehicles.filter((v) => v.type === "rent");
  const saleVehicles = vehicles.filter((v) => v.type === "sale");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold flex items-center gap-2"><Car className="h-6 w-6 text-primary" /> Car Rent / Sale</h1>
        <p className="text-sm text-muted-foreground mt-1">Find affordable cars to rent or buy</p>
      </div>
      <Tabs defaultValue="rent" className="w-full">
        <TabsList>
          <TabsTrigger value="rent">Rent</TabsTrigger>
          <TabsTrigger value="sale">Sale</TabsTrigger>
          <TabsTrigger value="requests">My Requests</TabsTrigger>
        </TabsList>
        <TabsContent value="rent" className="mt-4"><VehicleGrid items={rentVehicles} type="rent" /></TabsContent>
        <TabsContent value="sale" className="mt-4"><VehicleGrid items={saleVehicles} type="sale" /></TabsContent>
        <TabsContent value="requests" className="mt-4">
          <RequestsListTab requests={myRequests} emptyMessage="No vehicle enquiries yet." />
        </TabsContent>
      </Tabs>
    </div>
  );
}
