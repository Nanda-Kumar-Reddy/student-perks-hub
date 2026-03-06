import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { ArrowLeft, Clock, MapPin, Globe, CheckCircle2, Award, Users, BookOpen, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { motion } from "framer-motion";

const certifications: Record<number, {
  name: string; duration: string; address: string; language: string; emoji: string;
  description: string; requirements: string[]; benefits: string[]; price: string; rating: number; enrolled: number;
}> = {
  1: { name: "RSA (Responsible Service of Alcohol)", duration: "4 hours", address: "Melbourne CBD", language: "English", emoji: "🍷", description: "The Responsible Service of Alcohol (RSA) certificate is a mandatory requirement for anyone working in venues that serve alcohol in Australia. This course covers legal obligations, identifying intoxicated patrons, and responsible serving practices.", requirements: ["Valid ID", "Must be 18+", "Basic English proficiency"], benefits: ["Nationally recognized", "Required for hospitality jobs", "Valid for 3 years", "Instant digital certificate"], price: "$49", rating: 4.8, enrolled: 2340 },
  2: { name: "First Aid & CPR Certificate", duration: "1 day", address: "Sydney Campus", language: "English", emoji: "🏥", description: "Learn essential life-saving skills including CPR, wound management, and emergency response. This nationally accredited course meets workplace health and safety requirements.", requirements: ["No prior experience needed", "Comfortable clothing", "Must be 16+"], benefits: ["Nationally accredited", "Workplace compliant", "Valid for 3 years", "Hands-on practical training"], price: "$89", rating: 4.9, enrolled: 4120 },
  3: { name: "White Card (Construction Induction)", duration: "6 hours", address: "Brisbane Office", language: "English / Mandarin", emoji: "🏗️", description: "The White Card is mandatory for anyone working on a construction site in Australia. Learn about workplace safety, hazard identification, and risk management.", requirements: ["Valid ID", "USI Number", "Basic English"], benefits: ["Nationally recognized", "Mandatory for construction", "Lifetime validity", "Job-ready certification"], price: "$69", rating: 4.7, enrolled: 3200 },
  4: { name: "Food Safety Supervisor", duration: "8 hours", address: "Melbourne CBD", language: "English", emoji: "🍽️", description: "Comprehensive food safety training covering hygiene practices, temperature control, contamination prevention and compliance with food safety standards.", requirements: ["Must be 18+", "Working in food industry"], benefits: ["Industry requirement", "Nationally recognized", "Career advancement"], price: "$120", rating: 4.6, enrolled: 1890 },
  5: { name: "Barista Certificate", duration: "2 days", address: "Perth Campus", language: "English", emoji: "☕", description: "Master the art of coffee making with hands-on training in espresso extraction, milk texturing, latte art, and cafe operations.", requirements: ["No experience needed", "Passion for coffee"], benefits: ["Practical skills", "Portfolio ready", "Job placement support"], price: "$199", rating: 4.9, enrolled: 2780 },
  6: { name: "RSA + RCG Combined", duration: "6 hours", address: "Sydney CBD", language: "English", emoji: "🎰", description: "Combined course covering both Responsible Service of Alcohol and Responsible Conduct of Gambling. Essential for anyone working in licensed venues.", requirements: ["Must be 18+", "Valid ID"], benefits: ["Two certifications in one", "Cost effective", "Nationally recognized"], price: "$79", rating: 4.7, enrolled: 1560 },
  7: { name: "Working at Heights", duration: "4 hours", address: "Adelaide Office", language: "English", emoji: "🧗", description: "Learn to safely work at heights including fall prevention, harness usage, and emergency rescue procedures.", requirements: ["Must be 18+", "Physically fit", "White Card preferred"], benefits: ["Construction essential", "Safety certified", "Nationally recognized"], price: "$89", rating: 4.5, enrolled: 980 },
  8: { name: "Traffic Controller (TC)", duration: "2 days", address: "Melbourne CBD", language: "English", emoji: "🚧", description: "Become a certified traffic controller with training in traffic management, signage, and road safety procedures.", requirements: ["Must be 18+", "White Card", "Valid drivers license"], benefits: ["High-demand role", "Good pay rates", "Nationally recognized"], price: "$250", rating: 4.6, enrolled: 1340 },
};

export default function CertificationDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [showSuccess, setShowSuccess] = useState(false);
  const cert = certifications[Number(id)];

  if (!cert) return <div className="text-center py-20 text-muted-foreground">Certification not found</div>;

  return (
    <div className="space-y-6">
      <button onClick={() => navigate("/student/certifications")} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors">
        <ArrowLeft className="h-4 w-4" /> Back to Certifications
      </button>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-xl border border-border bg-card p-6 shadow-card">
            <div className="flex items-center gap-3">
              <span className="text-4xl">{cert.emoji}</span>
              <div>
                <h1 className="font-display text-xl font-bold">{cert.name}</h1>
                <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> {cert.duration}</span>
                  <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" /> {cert.address}</span>
                  <span className="flex items-center gap-1"><Globe className="h-3.5 w-3.5" /> {cert.language}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card p-6 shadow-card">
            <h2 className="font-display font-bold">About This Certification</h2>
            <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{cert.description}</p>
          </div>

          <div className="rounded-xl border border-border bg-card p-6 shadow-card">
            <h2 className="font-display font-bold">Requirements</h2>
            <ul className="mt-3 space-y-2">
              {cert.requirements.map((r, i) => (
                <li key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0" /> {r}
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-xl border border-border bg-card p-6 shadow-card">
            <h2 className="font-display font-bold">Benefits</h2>
            <div className="grid gap-3 sm:grid-cols-2 mt-3">
              {cert.benefits.map((b, i) => (
                <div key={i} className="flex items-center gap-2 rounded-lg bg-primary/5 p-3">
                  <Award className="h-4 w-4 text-primary flex-shrink-0" />
                  <span className="text-sm">{b}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-xl border border-border bg-card p-5 shadow-card sticky top-6">
            <div className="text-2xl font-display font-bold text-primary">{cert.price}</div>
            <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
              <span className="flex items-center gap-1"><Star className="h-3.5 w-3.5 fill-primary text-primary" /> {cert.rating}</span>
              <span className="flex items-center gap-1"><Users className="h-3.5 w-3.5" /> {cert.enrolled.toLocaleString()} enrolled</span>
            </div>
            <Button className="w-full mt-4" onClick={() => setShowSuccess(true)}>Get Certification</Button>
            <div className="mt-4 space-y-2 text-xs text-muted-foreground">
              <div className="flex items-center gap-2"><Clock className="h-3.5 w-3.5" /> Duration: {cert.duration}</div>
              <div className="flex items-center gap-2"><MapPin className="h-3.5 w-3.5" /> Location: {cert.address}</div>
              <div className="flex items-center gap-2"><BookOpen className="h-3.5 w-3.5" /> Certificate included</div>
            </div>
          </div>
        </div>
      </motion.div>

      <Dialog open={showSuccess} onOpenChange={setShowSuccess}>
        <DialogContent className="max-w-sm text-center">
          <div className="flex flex-col items-center py-6">
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 200 }}
              className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <CheckCircle2 className="h-8 w-8 text-primary" />
            </motion.div>
            <h2 className="mt-4 font-display text-xl font-bold">Thank You!</h2>
            <p className="mt-2 text-sm text-muted-foreground">Thank you for your interest. Our team will contact you soon.</p>
            <Button className="mt-6" onClick={() => setShowSuccess(false)}>Close</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
