/**
 * Admin Services Page — mirrors vendor service pages with Approve/Reject actions
 */
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Home, Car, Users, Calculator, CarFront, DollarSign, Plane, Award, CalendarDays, Briefcase, Package
} from "lucide-react";
import { motion } from "framer-motion";

const serviceConfig = [
  { slug: "accommodation", label: "Accommodation", icon: <Home className="h-8 w-8" />, color: "text-primary" },
  { slug: "car-rent-sale", label: "Car Rent/Sale", icon: <Car className="h-8 w-8" />, color: "text-accent" },
  { slug: "consultations", label: "Consultations", icon: <Users className="h-8 w-8" />, color: "text-success" },
  { slug: "accounting", label: "Accounting", icon: <Calculator className="h-8 w-8" />, color: "text-warning" },
  { slug: "driving-licence", label: "Driving Licence", icon: <CarFront className="h-8 w-8" />, color: "text-primary" },
  { slug: "loans", label: "Loans", icon: <DollarSign className="h-8 w-8" />, color: "text-accent" },
  { slug: "airport-pickup", label: "Airport Pickup", icon: <Plane className="h-8 w-8" />, color: "text-success" },
  { slug: "certifications", label: "Certifications", icon: <Award className="h-8 w-8" />, color: "text-warning" },
  { slug: "events", label: "Events", icon: <CalendarDays className="h-8 w-8" />, color: "text-primary" },
  { slug: "jobs", label: "Jobs", icon: <Briefcase className="h-8 w-8" />, color: "text-accent" },
];

export default function AdminServicesPage() {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold flex items-center gap-2">
          <Package className="h-6 w-6 text-primary" /> Services
        </h1>
        <p className="text-sm text-muted-foreground mt-1">Review and manage all service listings across the platform</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {serviceConfig.map((s, i) => (
          <motion.button
            key={s.slug}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            onClick={() => navigate(`/admin/services/${s.slug}`)}
            className="flex flex-col items-center gap-3 rounded-xl border border-border bg-card p-6 shadow-card transition-all hover:shadow-card-hover hover:border-primary/30 text-center"
          >
            <div className={s.color}>{s.icon}</div>
            <span className="font-display text-sm font-bold">{s.label}</span>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
