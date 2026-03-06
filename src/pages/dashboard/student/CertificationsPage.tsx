import { Award, Clock, MapPin, Globe, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const certifications = [
  { id: 1, name: "RSA (Responsible Service of Alcohol)", duration: "4 hours", address: "Melbourne CBD", language: "English", emoji: "🍷" },
  { id: 2, name: "First Aid & CPR Certificate", duration: "1 day", address: "Sydney Campus", language: "English", emoji: "🏥" },
  { id: 3, name: "White Card (Construction Induction)", duration: "6 hours", address: "Brisbane Office", language: "English / Mandarin", emoji: "🏗️" },
  { id: 4, name: "Food Safety Supervisor", duration: "8 hours", address: "Melbourne CBD", language: "English", emoji: "🍽️" },
  { id: 5, name: "Barista Certificate", duration: "2 days", address: "Perth Campus", language: "English", emoji: "☕" },
  { id: 6, name: "RSA + RCG Combined", duration: "6 hours", address: "Sydney CBD", language: "English", emoji: "🎰" },
  { id: 7, name: "Working at Heights", duration: "4 hours", address: "Adelaide Office", language: "English", emoji: "🧗" },
  { id: 8, name: "Traffic Controller (TC)", duration: "2 days", address: "Melbourne CBD", language: "English", emoji: "🚧" },
];

export default function CertificationsPage() {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold flex items-center gap-2"><Award className="h-6 w-6 text-primary" /> Certifications</h1>
        <p className="text-sm text-muted-foreground mt-1">Browse available certifications and get certified</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {certifications.map((c, i) => (
          <motion.div key={c.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
            onClick={() => navigate(`/student/certifications/${c.id}`)}
            className="cursor-pointer group rounded-xl border border-border bg-card p-5 shadow-card transition-all hover:shadow-card-hover">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-2xl">{c.emoji}</span>
              <h3 className="font-display text-sm font-bold leading-tight">{c.name}</h3>
            </div>
            <div className="space-y-1.5 text-xs text-muted-foreground">
              <div className="flex items-center gap-1.5"><Clock className="h-3.5 w-3.5" /> {c.duration}</div>
              <div className="flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5" /> {c.address}</div>
              <div className="flex items-center gap-1.5"><Globe className="h-3.5 w-3.5" /> {c.language}</div>
            </div>
            <Button size="sm" variant="outline" className="mt-3 w-full gap-1 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
              View Details <ArrowRight className="h-3 w-3" />
            </Button>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
