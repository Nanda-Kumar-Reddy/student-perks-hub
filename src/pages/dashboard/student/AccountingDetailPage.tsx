import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Calculator, Clock, ArrowLeft, CheckCircle2, Calendar, Video, Building, Star, MapPin, Shield, Award } from "lucide-react";
import { motion } from "framer-motion";

const professionals = [
  { id: 1, name: "Smith & Co Accounting", experience: "15+ years", services: ["Tax Returns", "BAS Lodgement", "Bookkeeping", "ABN Registration"], desc: "Full-service accounting firm specializing in student and small business tax.", price: "From $49", officeHours: "Mon-Fri 9AM-5PM", about: "We've been helping students with their taxes for over 15 years. Our team of certified accountants understands the unique financial needs of international students in Australia. From simple tax returns to complex business structures, we provide personalized guidance every step of the way.", disclaimer: "All services subject to ATO regulations.", meetingTypes: ["Online", "Offline"], dates: ["March 10", "March 12", "March 14"], slots: ["9:00 AM", "11:00 AM", "2:00 PM"], rating: 4.8, reviews: 124, location: "Sydney CBD", qualifications: ["CPA Australia", "Registered Tax Agent", "ASIC Registered"], specialties: ["International Student Tax", "Small Business Accounting", "BAS & GST", "Superannuation Advisory"] },
  { id: 2, name: "TaxEasy Australia", experience: "8 years", services: ["Student Tax Returns", "PAYG", "Superannuation", "Tax Planning"], desc: "Affordable tax services tailored for international students.", price: "From $39", officeHours: "Mon-Sat 10AM-6PM", about: "Making tax simple and affordable for students. We specialize in helping international students navigate the Australian tax system with ease. Our streamlined process ensures you get your maximum refund with minimum hassle.", disclaimer: "Results may vary based on individual circumstances.", meetingTypes: ["Online"], dates: ["March 11", "March 13"], slots: ["10:00 AM", "1:00 PM", "3:00 PM"], rating: 4.6, reviews: 89, location: "Melbourne", qualifications: ["Registered Tax Agent", "Tax Practitioners Board"], specialties: ["Student Tax Returns", "PAYG Summaries", "Tax Planning", "Superannuation Claims"] },
  { id: 3, name: "NumberCrunch", experience: "10 years", services: ["Tax Returns", "Financial Planning", "Investment Advice", "SMSF"], desc: "Professional accounting with personalized financial advice.", price: "From $59", officeHours: "Mon-Fri 8AM-4PM", about: "Expert financial guidance for your future. NumberCrunch goes beyond basic tax returns to provide comprehensive financial planning. Whether you're looking to invest, plan for retirement, or manage your SMSF, our experienced team has you covered.", disclaimer: "Financial advice is general in nature.", meetingTypes: ["Online", "Offline"], dates: ["March 10", "March 15"], slots: ["8:00 AM", "10:00 AM", "2:00 PM"], rating: 4.9, reviews: 156, location: "Brisbane", qualifications: ["CPA Australia", "Financial Planning Association", "SMSF Specialist"], specialties: ["Financial Planning", "Investment Advisory", "SMSF Management", "Retirement Planning"] },
];

export default function AccountingDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const provider = professionals.find((p) => p.id === Number(id));

  const [bookOpen, setBookOpen] = useState(false);
  const [selectedService, setSelectedService] = useState("");
  const [meetingType, setMeetingType] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedSlot, setSelectedSlot] = useState("");
  const [requirements, setRequirements] = useState("");
  const [bookSuccess, setBookSuccess] = useState(false);

  if (!provider) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <h2 className="text-xl font-bold">Provider not found</h2>
        <Button variant="outline" className="mt-4" onClick={() => navigate("/student/accounting")}>
          <ArrowLeft className="h-4 w-4 mr-1" /> Back to Accounting
        </Button>
      </div>
    );
  }

  const openBooking = () => {
    setBookOpen(true);
    setBookSuccess(false);
    setSelectedService("");
    setMeetingType("");
    setSelectedDate("");
    setSelectedSlot("");
    setRequirements("");
  };

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }} className="space-y-6">
      {/* Back button */}
      <Button variant="ghost" size="sm" onClick={() => navigate("/student/accounting")} className="gap-1 text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Back to Accounting
      </Button>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Header */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="rounded-xl border border-border bg-card p-6 shadow-card">
            <div className="flex items-start gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Calculator className="h-7 w-7" />
              </div>
              <div className="flex-1">
                <h1 className="font-display text-xl font-bold">{provider.name}</h1>
                <p className="text-sm text-muted-foreground mt-1">{provider.desc}</p>
                <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {provider.officeHours}</span>
                  <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {provider.location}</span>
                  <span className="flex items-center gap-1"><Star className="h-3 w-3 text-primary fill-primary" /> {provider.rating} ({provider.reviews} reviews)</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* About */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="rounded-xl border border-border bg-card p-6 shadow-card">
            <h2 className="font-display text-base font-bold mb-3">About</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">{provider.about}</p>
            <p className="mt-3 text-xs text-muted-foreground italic flex items-center gap-1"><Shield className="h-3 w-3" /> {provider.disclaimer}</p>
          </motion.div>

          {/* Qualifications */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="rounded-xl border border-border bg-card p-6 shadow-card">
            <h2 className="font-display text-base font-bold mb-3">Qualifications</h2>
            <div className="grid gap-2 sm:grid-cols-2">
              {provider.qualifications.map((q) => (
                <div key={q} className="flex items-center gap-2 rounded-lg bg-secondary/50 p-3 text-sm">
                  <Award className="h-4 w-4 text-primary shrink-0" />
                  {q}
                </div>
              ))}
            </div>
          </motion.div>

          {/* Areas of Expertise */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="rounded-xl border border-border bg-card p-6 shadow-card">
            <h2 className="font-display text-base font-bold mb-3">Areas of Expertise</h2>
            <div className="flex flex-wrap gap-2">
              {provider.specialties.map((s) => (
                <span key={s} className="rounded-full bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary">{s}</span>
              ))}
            </div>
          </motion.div>

          {/* Services */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="rounded-xl border border-border bg-card p-6 shadow-card">
            <h2 className="font-display text-base font-bold mb-3">Services Offered</h2>
            <div className="grid gap-2 sm:grid-cols-2">
              {provider.services.map((s) => (
                <div key={s} className="flex items-center gap-2 rounded-lg border border-border p-3 text-sm">
                  <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                  {s}
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
                <span className="text-muted-foreground">Experience</span>
                <span className="font-medium">{provider.experience}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Starting Price</span>
                <span className="font-display font-bold text-primary">{provider.price}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Rating</span>
                <span className="flex items-center gap-1 font-medium"><Star className="h-3 w-3 text-primary fill-primary" /> {provider.rating}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Reviews</span>
                <span className="font-medium">{provider.reviews}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Location</span>
                <span className="font-medium">{provider.location}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Meeting Types</span>
                <div className="flex gap-1">
                  {provider.meetingTypes.map((m) => (
                    <span key={m} className="flex items-center gap-1 rounded bg-secondary px-2 py-0.5 text-xs">
                      {m === "Online" ? <Video className="h-3 w-3" /> : <Building className="h-3 w-3" />} {m}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            <Button className="w-full mt-5" onClick={openBooking}>
              <Calendar className="h-4 w-4 mr-1" /> Book Appointment
            </Button>
          </motion.div>
        </div>
      </div>

      {/* Booking Dialog */}
      <Dialog open={bookOpen} onOpenChange={(o) => { setBookOpen(o); if (!o) setBookSuccess(false); }}>
        <DialogContent className="max-w-md">
          {bookSuccess ? (
            <div className="flex flex-col items-center py-6 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10"><CheckCircle2 className="h-8 w-8 text-primary" /></div>
              <h2 className="mt-4 font-display text-xl font-bold">Appointment Booked!</h2>
              <div className="mt-3 rounded-lg bg-secondary p-3 text-sm space-y-1 w-full">
                <p><strong>Provider:</strong> {provider.name}</p>
                <p><strong>Service:</strong> {selectedService}</p>
                <p><strong>Date:</strong> {selectedDate}</p>
                <p><strong>Time:</strong> {selectedSlot}</p>
                <p><strong>Type:</strong> {meetingType}</p>
              </div>
              <Button className="mt-6" onClick={() => setBookOpen(false)}>Close</Button>
            </div>
          ) : (
            <>
              <DialogHeader><DialogTitle>Book — {provider.name}</DialogTitle></DialogHeader>
              <div className="space-y-4 pt-2">
                <div>
                  <Label>Service</Label>
                  <Select value={selectedService} onValueChange={setSelectedService}>
                    <SelectTrigger className="mt-1.5"><SelectValue placeholder="Select service" /></SelectTrigger>
                    <SelectContent>{provider.services.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                {selectedService && (
                  <div>
                    <Label>Meeting Type</Label>
                    <Select value={meetingType} onValueChange={setMeetingType}>
                      <SelectTrigger className="mt-1.5"><SelectValue placeholder="Select type" /></SelectTrigger>
                      <SelectContent>{provider.meetingTypes.map((m) => <SelectItem key={m} value={m}>{m}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                )}
                {meetingType && (
                  <div>
                    <Label>Available Dates</Label>
                    <div className="mt-1.5 flex flex-wrap gap-2">
                      {provider.dates.map((d) => (
                        <button key={d} onClick={() => setSelectedDate(d)} className={`rounded-lg px-3 py-1.5 text-xs font-medium border transition-colors ${selectedDate === d ? "border-primary bg-primary/10 text-primary" : "border-border hover:bg-secondary"}`}>{d}</button>
                      ))}
                    </div>
                  </div>
                )}
                {selectedDate && (
                  <div>
                    <Label>Time Slots</Label>
                    <div className="mt-1.5 flex flex-wrap gap-2">
                      {provider.slots.map((s) => (
                        <button key={s} onClick={() => setSelectedSlot(s)} className={`rounded-lg px-3 py-1.5 text-xs font-medium border transition-colors ${selectedSlot === s ? "border-primary bg-primary/10 text-primary" : "border-border hover:bg-secondary"}`}>{s}</button>
                      ))}
                    </div>
                  </div>
                )}
                {selectedSlot && (
                  <div><Label>Requirements (optional)</Label><Textarea className="mt-1.5" rows={2} value={requirements} onChange={(e) => setRequirements(e.target.value)} /></div>
                )}
                <Button className="w-full" disabled={!selectedSlot} onClick={() => setBookSuccess(true)}>
                  <Calendar className="h-4 w-4 mr-1" /> Book Appointment
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
