import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { Search, Star, MapPin, Filter } from "lucide-react";

const allVendors = [
  { id: 1, name: "HomeNest Stays", cat: "Accommodations", rating: 4.8, offer: "First month 10% off", emoji: "🏠", location: "City Centre" },
  { id: 2, name: "EduPath Advisors", cat: "1:1 Consultations", rating: 4.9, offer: "Free first session", emoji: "🎓", location: "University Ave" },
  { id: 3, name: "SkyRide Transfers", cat: "Airport Pickup", rating: 4.7, offer: "15% off first ride", emoji: "✈️", location: "Airport Road" },
  { id: 4, name: "NumPro Accounting", cat: "Accounting Services", rating: 4.6, offer: "Free consultation", emoji: "📊", location: "Finance District" },
  { id: 5, name: "DriveEasy School", cat: "Driving Licence", rating: 4.5, offer: "₹500 off package", emoji: "🚗", location: "Main Street" },
  { id: 6, name: "CampusFest Events", cat: "Events", rating: 4.8, offer: "Early bird 20% off", emoji: "🎉", location: "Event Plaza" },
  { id: 7, name: "AutoHub Rentals", cat: "Car Rent/Sale", rating: 4.3, offer: "Weekend special rates", emoji: "🚙", location: "Motor Lane" },
  { id: 8, name: "CareerLaunch Jobs", cat: "Jobs", rating: 4.4, offer: "Premium listing free", emoji: "💼", location: "Tech Park" },
];

const categories = ["All", "Accommodations", "1:1 Consultations", "Airport Pickup", "Accounting Services", "Driving Licence", "Events", "Car Rent/Sale", "Jobs"];

export default function VendorsPage() {
  const [search, setSearch] = useState("");
  const [activeCat, setActiveCat] = useState("All");

  const filtered = allVendors.filter(
    (v) =>
      (activeCat === "All" || v.cat === activeCat) &&
      v.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="py-12">
      <div className="container">
        <h1 className="font-display text-3xl font-bold">Explore Vendors</h1>
        <p className="mt-2 text-muted-foreground">Discover local businesses with student-exclusive offers</p>

        {/* Search + Filters */}
        <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search vendors..."
              className="pl-9"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCat(cat)}
                className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                  activeCat === cat
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {filtered.map((v, i) => (
            <motion.div
              key={v.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="group cursor-pointer rounded-2xl border border-border bg-card overflow-hidden shadow-card transition-all hover:shadow-card-hover"
            >
              <div className="flex h-28 items-center justify-center bg-secondary text-4xl">
                {v.emoji}
              </div>
              <div className="p-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-display font-bold text-sm">{v.name}</h3>
                  <span className="flex items-center gap-1 text-xs font-medium text-primary">
                    <Star className="h-3 w-3 fill-primary" /> {v.rating}
                  </span>
                </div>
                <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                  <MapPin className="h-3 w-3" /> {v.location}
                </div>
                <div className="mt-2 inline-flex rounded-full bg-accent/10 px-2 py-0.5 text-xs font-medium text-accent">
                  🎁 {v.offer}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="py-20 text-center text-muted-foreground">
            No vendors found. Try a different search.
          </div>
        )}
      </div>
    </div>
  );
}
