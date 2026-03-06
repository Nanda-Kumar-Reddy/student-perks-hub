import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { CarFront, MapPin, Clock, ArrowLeft, CheckCircle2, ChevronLeft, ChevronRight, Star, Shield, Award, Users } from "lucide-react";
import PhoneField from "@/components/shared/PhoneField";
import { motion } from "framer-motion";

const partners = [
  { id: 1, name: "DriveRight School", location: "Melbourne", openHours: "8:00 AM", closeHours: "6:00 PM", images: ["🚗", "🏫", "🛣️"], packages: [{ name: "5 Lessons Pack", price: "$350", desc: "5 x 1hr manual lessons" }, { name: "10 Lessons Pack", price: "$650", desc: "10 x 1hr lessons + test prep" }, { name: "Test Package", price: "$200", desc: "Mock test + 1hr lesson" }], rating: 4.8, reviews: 210, about: "DriveRight School has been Melbourne's trusted driving school for over a decade. Our experienced instructors provide patient, structured lessons tailored to each learner's pace. We offer both manual and automatic vehicles with dual controls for maximum safety.", qualifications: ["VicRoads Accredited", "Fully Insured", "Dual Control Vehicles"], highlights: ["95% First-Time Pass Rate", "Flexible Scheduling", "Pick-up & Drop-off", "Multilingual Instructors"] },
  { id: 2, name: "SafeWheels Academy", location: "Sydney", openHours: "7:00 AM", closeHours: "5:00 PM", images: ["🚙", "📋"], packages: [{ name: "Starter Pack", price: "$300", desc: "4 x 1hr auto lessons" }, { name: "Premium Pack", price: "$550", desc: "8 lessons + hazard training" }, { name: "Mock Test", price: "$120", desc: "Full mock driving test" }], rating: 4.6, reviews: 145, about: "SafeWheels Academy focuses on building confident, safe drivers. Based in Sydney, we combine classroom theory with practical on-road experience. Our hazard perception training gives learners an edge for their driving test.", qualifications: ["RMS Approved", "Advanced Driving Certified", "First Aid Trained"], highlights: ["Hazard Perception Training", "Theory + Practical", "Weekend Availability", "Student Discounts"] },
  { id: 3, name: "QuickPass Driving", location: "Brisbane", openHours: "9:00 AM", closeHours: "7:00 PM", images: ["🚘", "🎓", "✅"], packages: [{ name: "Conversion Package", price: "$250", desc: "International licence conversion" }, { name: "Full Course", price: "$700", desc: "Complete learner to P-plate" }, { name: "Single Lesson", price: "$75", desc: "1hr driving lesson" }], rating: 4.9, reviews: 189, about: "QuickPass Driving specializes in helping international students convert their overseas licences and navigate the Australian driving system. Our comprehensive courses take you from learner to P-plate with confidence.", qualifications: ["QLD Transport Registered", "International Licence Specialist", "Insurance Included"], highlights: ["Licence Conversion Expert", "Comprehensive Courses", "Evening Slots Available", "International Student Focused"] },
];

export default function DrivingLicenceDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const partner = partners.find((p) => p.id === Number(id));

  const [imgIdx, setImgIdx] = useState(0);
  const [bookOpen, setBookOpen] = useState(false);
  const [bookPkg, setBookPkg] = useState<{ name: string; price: string; desc: string } | null>(null);
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [bookSuccess, setBookSuccess] = useState(false);

  if (!partner) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <h2 className="text-xl font-bold">Partner not found</h2>
        <Button variant="outline" className="mt-4" onClick={() => navigate("/student/driving-licence")}>
          <ArrowLeft className="h-4 w-4 mr-1" /> Back to Driving Licence
        </Button>
      </div>
    );
  }

  const handleBook = (pkg: { name: string; price: string; desc: string }) => {
    setBookPkg(pkg);
    setBookOpen(true);
    setBookSuccess(false);
    setPhone("");
    setAddress("");
  };

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }} className="space-y-6">
      <Button variant="ghost" size="sm" onClick={() => navigate("/student/driving-licence")} className="gap-1 text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Back to Driving Licence
      </Button>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Image gallery */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="relative flex h-48 items-center justify-center rounded-xl bg-secondary text-7xl overflow-hidden border border-border">
            {partner.images[imgIdx]}
            {partner.images.length > 1 && (
              <>
                <button onClick={() => setImgIdx((imgIdx - 1 + partner.images.length) % partner.images.length)} className="absolute left-2 rounded-full bg-background/80 p-1.5 hover:bg-background transition-colors"><ChevronLeft className="h-4 w-4" /></button>
                <button onClick={() => setImgIdx((imgIdx + 1) % partner.images.length)} className="absolute right-2 rounded-full bg-background/80 p-1.5 hover:bg-background transition-colors"><ChevronRight className="h-4 w-4" /></button>
              </>
            )}
            <div className="absolute bottom-2 flex gap-1">
              {partner.images.map((_, i) => (
                <span key={i} className={`h-1.5 w-1.5 rounded-full transition-colors ${i === imgIdx ? "bg-primary" : "bg-muted-foreground/40"}`} />
              ))}
            </div>
          </motion.div>

          {/* Header */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="rounded-xl border border-border bg-card p-6 shadow-card">
            <div className="flex items-start gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <CarFront className="h-7 w-7" />
              </div>
              <div className="flex-1">
                <h1 className="font-display text-xl font-bold">{partner.name}</h1>
                <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {partner.location}</span>
                  <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {partner.openHours} — {partner.closeHours}</span>
                  <span className="flex items-center gap-1"><Star className="h-3 w-3 text-primary fill-primary" /> {partner.rating} ({partner.reviews} reviews)</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* About */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="rounded-xl border border-border bg-card p-6 shadow-card">
            <h2 className="font-display text-base font-bold mb-3">About</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">{partner.about}</p>
          </motion.div>

          {/* Qualifications */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="rounded-xl border border-border bg-card p-6 shadow-card">
            <h2 className="font-display text-base font-bold mb-3">Qualifications & Accreditations</h2>
            <div className="grid gap-2 sm:grid-cols-2">
              {partner.qualifications.map((q) => (
                <div key={q} className="flex items-center gap-2 rounded-lg bg-secondary/50 p-3 text-sm">
                  <Award className="h-4 w-4 text-primary shrink-0" />
                  {q}
                </div>
              ))}
            </div>
          </motion.div>

          {/* Highlights */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="rounded-xl border border-border bg-card p-6 shadow-card">
            <h2 className="font-display text-base font-bold mb-3">Why Choose Us</h2>
            <div className="flex flex-wrap gap-2">
              {partner.highlights.map((h) => (
                <span key={h} className="rounded-full bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary">{h}</span>
              ))}
            </div>
          </motion.div>

          {/* Packages */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="rounded-xl border border-border bg-card p-6 shadow-card">
            <h2 className="font-display text-base font-bold mb-3">Packages</h2>
            <div className="space-y-2">
              {partner.packages.map((pkg) => (
                <div key={pkg.name} className="flex items-center justify-between rounded-lg border border-border p-4 transition-colors hover:bg-secondary/30">
                  <div>
                    <span className="text-sm font-medium">{pkg.name}</span>
                    <p className="text-xs text-muted-foreground">{pkg.desc}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-display text-sm font-bold text-primary">{pkg.price}</span>
                    <Button size="sm" onClick={() => handleBook(pkg)}>Book Now</Button>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="rounded-xl border border-border bg-card p-5 shadow-card sticky top-4">
            <h3 className="font-display text-base font-bold mb-4">Overview</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Location</span>
                <span className="font-medium">{partner.location}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Hours</span>
                <span className="font-medium">{partner.openHours} — {partner.closeHours}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Rating</span>
                <span className="flex items-center gap-1 font-medium"><Star className="h-3 w-3 text-primary fill-primary" /> {partner.rating}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Reviews</span>
                <span className="font-medium">{partner.reviews}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Packages</span>
                <span className="font-medium">{partner.packages.length} available</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Starting From</span>
                <span className="font-display font-bold text-primary">{partner.packages.reduce((min, p) => { const v = parseInt(p.price.replace("$", "")); return v < min ? v : min; }, Infinity).toLocaleString("en-AU", { style: "currency", currency: "AUD", minimumFractionDigits: 0 })}</span>
              </div>
            </div>
            <Button className="w-full mt-5" onClick={() => handleBook(partner.packages[0])}>
              Book a Package
            </Button>
          </motion.div>
        </div>
      </div>

      {/* Booking Dialog */}
      <Dialog open={bookOpen} onOpenChange={(o) => { setBookOpen(o); if (!o) setBookSuccess(false); }}>
        <DialogContent className="max-w-sm">
          {bookSuccess ? (
            <div className="flex flex-col items-center py-6 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10"><CheckCircle2 className="h-8 w-8 text-primary" /></div>
              <h2 className="mt-4 font-display text-xl font-bold">Booking Confirmed!</h2>
              <div className="mt-3 rounded-lg bg-secondary p-3 text-sm space-y-1 w-full">
                <p><strong>Partner:</strong> {partner.name}</p>
                <p><strong>Package:</strong> {bookPkg?.name}</p>
                <p><strong>Price:</strong> {bookPkg?.price}</p>
              </div>
              <Button className="mt-6" onClick={() => setBookOpen(false)}>Close</Button>
            </div>
          ) : (
            <>
              <DialogHeader><DialogTitle>Book Package</DialogTitle></DialogHeader>
              <div className="space-y-4 pt-2">
                <div className="rounded-lg bg-secondary p-3">
                  <p className="text-sm font-medium">{bookPkg?.name}</p>
                  <p className="text-xs text-muted-foreground">{partner.name} — {bookPkg?.price}</p>
                </div>
                <PhoneField value={phone} onChange={setPhone} />
                <div><Label>Current Address</Label><Input className="mt-1.5" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Your current address" /></div>
                <Button className="w-full" disabled={!phone.trim()} onClick={() => setBookSuccess(true)}>Proceed to Payment</Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
