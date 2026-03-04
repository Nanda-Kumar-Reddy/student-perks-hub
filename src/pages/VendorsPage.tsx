import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { Search, Star, MapPin, Filter } from "lucide-react";

const allVendors = [
  { id: 1, name: "The Green Bowl", cat: "Restaurant", rating: 4.8, offer: "15% off on meals", emoji: "🥗", location: "MG Road" },
  { id: 2, name: "Bean Counter Café", cat: "Café", rating: 4.9, offer: "Free cookie with coffee", emoji: "☕", location: "College Street" },
  { id: 3, name: "FitZone Gym", cat: "Gym", rating: 4.7, offer: "First month free", emoji: "🏋️", location: "Park Avenue" },
  { id: 4, name: "Page Turner Books", cat: "Bookstore", rating: 4.6, offer: "10% on textbooks", emoji: "📚", location: "Library Lane" },
  { id: 5, name: "Campus Bites", cat: "Restaurant", rating: 4.5, offer: "Buy 1 Get 1 Free", emoji: "🍔", location: "University Road" },
  { id: 6, name: "Zen Spa", cat: "Services", rating: 4.8, offer: "20% off first visit", emoji: "💆", location: "Wellness Street" },
  { id: 7, name: "Quick Print", cat: "Services", rating: 4.3, offer: "Free binding", emoji: "🖨️", location: "Tech Park" },
  { id: 8, name: "Fresh Juice Corner", cat: "Café", rating: 4.4, offer: "₹10 off smoothies", emoji: "🥤", location: "Market Road" },
];

const categories = ["All", "Restaurant", "Café", "Gym", "Bookstore", "Services"];

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
