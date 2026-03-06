import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ArrowLeft, Globe, Clock, Users, Star, CheckCircle2, Calendar, MessageSquare, Award, Briefcase } from "lucide-react";

const consultants = [
  { id: 1, name: "Dr. Sarah Williams", experience: "10+ years", languages: ["English", "Mandarin"], speciality: "Immigration & Visa", category: "Visa", price: "$80/session", responseTime: "< 2 hours", sessions: 340, about: "Dr. Sarah Williams is a highly experienced immigration consultant specializing in Australian immigration law. With over a decade of experience, she has successfully guided hundreds of students through complex visa processes including extensions, permanent residency applications, and work rights consultations. Sarah holds a Doctorate in Law from the University of Melbourne and is a registered migration agent (MARN 1234567).", services: ["Visa Extensions", "PR Applications", "Student Visa", "Work Rights"], dates: ["March 10", "March 12", "March 15"], slots: ["9:00 AM", "11:00 AM", "2:00 PM", "4:00 PM"], rating: 4.9, reviews: 128, qualifications: ["Registered Migration Agent (MARN 1234567)", "Doctorate in Law — University of Melbourne", "Member of Migration Institute of Australia"], specialties: ["Student Visa (Subclass 500)", "Skilled Worker Visa (Subclass 482)", "Permanent Residency Applications", "Bridging Visas & Appeals"] },
  { id: 2, name: "Mark Thompson", experience: "8 years", languages: ["English", "Hindi"], speciality: "Career Coaching", category: "Personal", price: "$60/session", responseTime: "< 4 hours", sessions: 215, about: "Mark Thompson is a certified career coach with 8 years of experience helping students and professionals build successful careers in Australia. He specializes in resume optimization, interview preparation, and strategic career planning. Mark has worked with leading recruitment firms and understands what employers look for in candidates. His clients have secured positions at top companies including Google, Atlassian, and Commonwealth Bank.", services: ["Resume Review", "Interview Prep", "Career Planning"], dates: ["March 11", "March 13"], slots: ["10:00 AM", "1:00 PM", "3:00 PM"], rating: 4.8, reviews: 96, qualifications: ["Certified Career Coach (ICF)", "MBA — UNSW Sydney", "Former Senior Recruiter at Hays"], specialties: ["Resume & Cover Letter Optimization", "Behavioral Interview Coaching", "LinkedIn Profile Enhancement", "Salary Negotiation Strategy"] },
  { id: 3, name: "Emily Chen", experience: "5 years", languages: ["English", "Cantonese", "Mandarin"], speciality: "Academic Counseling", category: "Personal", price: "$50/session", responseTime: "< 1 hour", sessions: 180, about: "Emily Chen is a dedicated academic counselor with 5 years of experience supporting international students in navigating the Australian higher education system. She provides expert guidance on course selection, university transfers, and academic appeals. Emily is multilingual and understands the unique challenges faced by students from diverse backgrounds. Her personalized approach has helped hundreds of students achieve their academic goals.", services: ["Course Selection", "University Transfers", "Academic Appeals"], dates: ["March 10", "March 14"], slots: ["9:00 AM", "12:00 PM", "3:00 PM"], rating: 4.7, reviews: 72, qualifications: ["Master of Education — University of Sydney", "Certified Academic Advisor (NACADA)", "Bilingual Counseling Certification"], specialties: ["Course & Major Selection Guidance", "Credit Transfer Assessments", "Academic Appeals & Grievances", "Study Abroad Program Advising"] },
];

export default function ConsultantDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [bookOpen, setBookOpen] = useState(false);
  const [selectedService, setSelectedService] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedSlot, setSelectedSlot] = useState("");
  const [description, setDescription] = useState("");
  const [bookSuccess, setBookSuccess] = useState(false);

  const consultant = consultants.find((c) => c.id === Number(id));

  if (!consultant) {
    return (
      <div className="space-y-4 animate-fade-in">
        <Button variant="ghost" size="sm" onClick={() => navigate("/student/consultations")} className="gap-2">
          <ArrowLeft className="h-4 w-4" /> Back to Consultants
        </Button>
        <div className="text-center py-20 text-muted-foreground">Consultant not found.</div>
      </div>
    );
  }

  const handleOpenBook = () => {
    setBookOpen(true);
    setBookSuccess(false);
    setSelectedService("");
    setSelectedDate("");
    setSelectedSlot("");
    setDescription("");
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <Button variant="ghost" size="sm" onClick={() => navigate("/student/consultations")} className="gap-2">
        <ArrowLeft className="h-4 w-4" /> Back to Consultants
      </Button>

      <div className="grid gap-6 lg:grid-cols-5">
        {/* Left — Details */}
        <div className="lg:col-span-3 space-y-4">
          {/* Header card */}
          <div className="rounded-xl border border-border bg-card p-5 space-y-4">
            <div className="flex items-start gap-4">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-primary/10 text-lg font-bold text-primary">
                {consultant.name.split(" ").map((n) => n[0]).join("")}
              </div>
              <div className="flex-1">
                <h1 className="font-display text-xl font-bold">{consultant.name}</h1>
                <p className="text-sm text-muted-foreground">{consultant.speciality}</p>
                <div className="mt-2 flex flex-wrap gap-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1"><Star className="h-3 w-3 text-yellow-500" /> {consultant.rating} ({consultant.reviews} reviews)</span>
                  <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {consultant.responseTime}</span>
                  <span className="flex items-center gap-1"><Users className="h-3 w-3" /> {consultant.sessions} sessions</span>
                </div>
              </div>
            </div>
          </div>

          {/* About */}
          <div className="rounded-xl border border-border bg-card p-5 space-y-3">
            <h2 className="font-display text-base font-bold flex items-center gap-2">
              <MessageSquare className="h-4 w-4 text-primary" /> About
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">{consultant.about}</p>
          </div>

          {/* Qualifications */}
          <div className="rounded-xl border border-border bg-card p-5 space-y-3">
            <h2 className="font-display text-base font-bold flex items-center gap-2">
              <Award className="h-4 w-4 text-primary" /> Qualifications
            </h2>
            <ul className="space-y-2">
              {consultant.qualifications.map((q, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
                  {q}
                </li>
              ))}
            </ul>
          </div>

          {/* Specialties */}
          <div className="rounded-xl border border-border bg-card p-5 space-y-3">
            <h2 className="font-display text-base font-bold flex items-center gap-2">
              <Briefcase className="h-4 w-4 text-primary" /> Areas of Expertise
            </h2>
            <ul className="space-y-2">
              {consultant.specialties.map((s, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                  {s}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Right — Overview & Book */}
        <div className="lg:col-span-2 space-y-4">
          {/* Overview */}
          <div className="rounded-xl border border-border bg-card p-5 space-y-4">
            <h2 className="font-display text-base font-bold">Consultant Overview</h2>
            <div className="space-y-3">
              {[
                { label: "Experience", value: consultant.experience },
                { label: "Speciality", value: consultant.speciality },
                { label: "Category", value: consultant.category },
                { label: "Response Time", value: consultant.responseTime },
                { label: "Total Sessions", value: String(consultant.sessions) },
                { label: "Rating", value: `${consultant.rating} / 5.0` },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{item.label}</span>
                  <span className="font-medium">{item.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Languages */}
          <div className="rounded-xl border border-border bg-card p-5 space-y-3">
            <h2 className="font-display text-base font-bold flex items-center gap-2">
              <Globe className="h-4 w-4 text-primary" /> Languages
            </h2>
            <div className="flex flex-wrap gap-2">
              {consultant.languages.map((l) => (
                <span key={l} className="rounded-lg bg-secondary px-3 py-2 text-xs font-medium text-foreground">{l}</span>
              ))}
            </div>
          </div>

          {/* Services */}
          <div className="rounded-xl border border-border bg-card p-5 space-y-3">
            <h2 className="font-display text-base font-bold">Services Offered</h2>
            <div className="flex flex-wrap gap-2">
              {consultant.services.map((s) => (
                <span key={s} className="rounded-lg bg-secondary px-3 py-2 text-xs font-medium text-foreground">{s}</span>
              ))}
            </div>
          </div>

          {/* Price & Book */}
          <div className="rounded-xl border border-border bg-card p-5 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Session Fee</span>
              <span className="font-display text-lg font-bold text-primary">{consultant.price}</span>
            </div>
            <Button className="w-full" size="lg" onClick={handleOpenBook}>
              <Calendar className="h-4 w-4 mr-2" /> Book Session
            </Button>
          </div>
        </div>
      </div>

      {/* Booking dialog */}
      <Dialog open={bookOpen} onOpenChange={(o) => { setBookOpen(o); if (!o) setBookSuccess(false); }}>
        <DialogContent className="max-w-md">
          {bookSuccess ? (
            <div className="flex flex-col items-center py-6 text-center animate-scale-in">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10"><CheckCircle2 className="h-8 w-8 text-primary" /></div>
              <h2 className="mt-4 font-display text-xl font-bold">Booking Confirmed!</h2>
              <div className="mt-3 rounded-lg bg-secondary p-3 text-sm space-y-1 w-full">
                <p><strong>Date:</strong> {selectedDate}</p>
                <p><strong>Time:</strong> {selectedSlot}</p>
                <p><strong>Consultant Timezone:</strong> AEST (UTC+10)</p>
                <p><strong>Your Timezone:</strong> {Intl.DateTimeFormat().resolvedOptions().timeZone}</p>
              </div>
              <Button className="mt-6" onClick={() => setBookOpen(false)}>Close</Button>
            </div>
          ) : (
            <>
              <DialogHeader><DialogTitle>Book — {consultant.name}</DialogTitle></DialogHeader>
              <div className="space-y-4 pt-2">
                <div>
                  <Label>Select Service</Label>
                  <Select value={selectedService} onValueChange={setSelectedService}>
                    <SelectTrigger className="mt-1.5"><SelectValue placeholder="Choose service" /></SelectTrigger>
                    <SelectContent>{consultant.services.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                {selectedService && (
                  <div>
                    <Label>Available Dates</Label>
                    <div className="mt-1.5 flex flex-wrap gap-2">
                      {consultant.dates.map((d) => (
                        <button key={d} onClick={() => setSelectedDate(d)} className={`rounded-lg px-3 py-1.5 text-xs font-medium border transition-colors ${selectedDate === d ? "border-primary bg-primary/10 text-primary" : "border-border hover:bg-secondary"}`}>{d}</button>
                      ))}
                    </div>
                  </div>
                )}
                {selectedDate && (
                  <div>
                    <Label>Available Time Slots</Label>
                    <div className="mt-1.5 flex flex-wrap gap-2">
                      {consultant.slots.map((s) => (
                        <button key={s} onClick={() => setSelectedSlot(s)} className={`rounded-lg px-3 py-1.5 text-xs font-medium border transition-colors ${selectedSlot === s ? "border-primary bg-primary/10 text-primary" : "border-border hover:bg-secondary"}`}>{s}</button>
                      ))}
                    </div>
                  </div>
                )}
                {selectedSlot && (
                  <div><Label>Description (optional)</Label><Textarea className="mt-1.5" rows={2} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="What would you like to discuss?" /></div>
                )}
                <Button className="w-full" disabled={!selectedSlot} onClick={() => setBookSuccess(true)}>
                  <Calendar className="h-4 w-4 mr-1" /> Confirm Booking
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
