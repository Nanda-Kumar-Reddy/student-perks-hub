import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ArrowLeft, MapPin, Clock, Monitor, Building, Briefcase, DollarSign, CheckCircle2, FileText, ListChecks } from "lucide-react";
import PhoneField from "@/components/shared/PhoneField";
import FormSection from "@/components/shared/FormSection";

const jobs = [
  {
    id: 1, title: "Software Engineer", company: "TechCorp AU", location: "Melbourne", type: "Full-time", mode: "Online", posted: "2d ago", salary: "$75k-90k",
    desc: "Build scalable web applications.",
    requirements: ["3+ years React", "Node.js experience", "Valid work rights"],
    fullDesc: "We are looking for a talented Software Engineer to join our growing team at TechCorp AU. You will be responsible for designing, developing, and maintaining high-quality web applications using modern technologies. This is a fully remote position offering competitive compensation and excellent growth opportunities. You'll work with a collaborative team of engineers building products used by thousands of users across Australia.",
    responsibilities: ["Design and develop scalable web applications using React and Node.js", "Collaborate with product and design teams to deliver features", "Write clean, maintainable, and well-tested code", "Participate in code reviews and technical discussions", "Troubleshoot and debug production issues"],
    benefits: ["Competitive salary package", "Fully remote work", "Professional development budget", "Health insurance", "Flexible working hours"],
    overview: { experience: "3+ years", education: "Bachelor's in CS or equivalent", schedule: "Full-time", startDate: "Immediate" },
  },
  {
    id: 2, title: "Marketing Coordinator", company: "BrandHouse", location: "Sydney", type: "Full-time", mode: "Offline", posted: "1d ago", salary: "$60k-70k",
    desc: "Manage marketing campaigns.",
    requirements: ["Marketing degree", "Social media skills", "Creative thinking"],
    fullDesc: "BrandHouse is seeking a creative and organized Marketing Coordinator to manage our marketing campaigns across digital and traditional channels. You will work closely with the marketing manager to develop strategies, create content, and analyze campaign performance. This role is based in our modern Sydney CBD office and offers plenty of room for career progression.",
    responsibilities: ["Plan and execute marketing campaigns across multiple channels", "Create compelling content for social media and email marketing", "Analyze campaign metrics and prepare reports", "Coordinate with external agencies and vendors", "Manage marketing budget and timelines"],
    benefits: ["Central Sydney office", "Career progression", "Team lunches", "Training allowance", "Annual bonus"],
    overview: { experience: "1-2 years", education: "Marketing/Communications degree", schedule: "Full-time", startDate: "March 2026" },
  },
  {
    id: 3, title: "Barista", company: "Bean Counter Café", location: "Melbourne CBD", type: "Part-time", mode: "Offline", posted: "2d ago", salary: "$25-28/hr",
    desc: "Join our friendly café team.",
    requirements: ["Weekend availability", "Good communication"],
    fullDesc: "Bean Counter Café is a popular specialty coffee shop in the heart of Melbourne CBD. We're looking for an enthusiastic barista to join our team. If you're passionate about coffee and love creating great customer experiences, we want to hear from you! Training will be provided for the right candidate. Perfect for students looking for flexible part-time work.",
    responsibilities: ["Prepare high-quality coffee beverages", "Provide excellent customer service", "Maintain cleanliness and hygiene standards", "Assist with food preparation", "Handle cash and EFTPOS transactions"],
    benefits: ["Flexible scheduling", "Free coffee and meals during shifts", "Barista training provided", "Fun team environment", "Staff discounts"],
    overview: { experience: "Entry level", education: "No formal requirements", schedule: "Part-time (15-20 hrs/week)", startDate: "Immediate" },
  },
  {
    id: 4, title: "Retail Assistant", company: "Uni Bookstore", location: "Sydney", type: "Part-time", mode: "Offline", posted: "1d ago", salary: "$26/hr",
    desc: "Help customers at our university bookstore.",
    requirements: ["Current student", "Basic computer skills"],
    fullDesc: "The University Bookstore is looking for a friendly and organized Retail Assistant to help serve our student community. You'll assist customers in finding textbooks, merchandise, and supplies. This role is perfect for current students who want convenient on-campus employment with flexible hours that work around your class schedule.",
    responsibilities: ["Assist customers with finding books and supplies", "Process sales transactions", "Restock shelves and maintain displays", "Handle online order pickups", "Provide product information and recommendations"],
    benefits: ["On-campus location", "Flexible hours around classes", "Student discount", "Quiet study periods allowed", "Friendly team"],
    overview: { experience: "Entry level", education: "Current university student", schedule: "Part-time (10-15 hrs/week)", startDate: "Immediate" },
  },
  {
    id: 5, title: "IT Support", company: "TechCorp", location: "Brisbane", type: "Part-time", mode: "Online", posted: "5d ago", salary: "$30-35/hr",
    desc: "Entry-level IT support role.",
    requirements: ["IT student", "Problem-solving skills"],
    fullDesc: "TechCorp is hiring a part-time IT Support specialist to assist our team remotely. This is an excellent opportunity for IT students to gain real-world experience while studying. You'll provide first-level technical support to internal staff, troubleshoot hardware and software issues, and help maintain our systems. Full training and mentorship provided.",
    responsibilities: ["Provide first-level IT support via phone, email, and chat", "Troubleshoot hardware and software issues", "Set up and configure user accounts", "Document support tickets and resolutions", "Assist with system maintenance tasks"],
    benefits: ["Fully remote", "Mentorship program", "Flexible hours", "Potential full-time conversion", "Latest tech equipment provided"],
    overview: { experience: "Entry level / Student", education: "Currently studying IT or related", schedule: "Part-time (15-20 hrs/week)", startDate: "Flexible" },
  },
];

export default function JobDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [applyOpen, setApplyOpen] = useState(false);
  const [applySuccess, setApplySuccess] = useState(false);
  const [applyForm, setApplyForm] = useState({ name: "", email: "", phone: "", coverLetter: "" });

  const job = jobs.find((j) => j.id === Number(id));

  if (!job) {
    return (
      <div className="space-y-4">
        <Button variant="ghost" size="sm" onClick={() => navigate("/student/jobs")} className="gap-2">
          <ArrowLeft className="h-4 w-4" /> Back to Jobs
        </Button>
        <div className="text-center py-20 text-muted-foreground">Job not found.</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Button variant="ghost" size="sm" onClick={() => navigate("/student/jobs")} className="gap-2">
        <ArrowLeft className="h-4 w-4" /> Back to Jobs
      </Button>

      <div className="grid gap-6 lg:grid-cols-5">
        {/* Left — Details */}
        <div className="lg:col-span-3 space-y-4">
          {/* Header card */}
          <div className="rounded-xl border border-border bg-card p-5 space-y-3">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h1 className="font-display text-xl font-bold">{job.title}</h1>
                <p className="text-sm text-muted-foreground mt-1">{job.company}</p>
              </div>
              <span className={`shrink-0 rounded-full px-3 py-1 text-xs font-bold text-white ${job.type === "Full-time" ? "bg-primary" : "bg-accent"}`}>
                {job.type}
              </span>
            </div>
            <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {job.location}</span>
              <span className="flex items-center gap-1">{job.mode === "Online" ? <Monitor className="h-3 w-3" /> : <Building className="h-3 w-3" />} {job.mode}</span>
              <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> Posted {job.posted}</span>
              <span className="flex items-center gap-1"><DollarSign className="h-3 w-3" /> {job.salary}</span>
            </div>
          </div>

          {/* Description */}
          <div className="rounded-xl border border-border bg-card p-5 space-y-3">
            <h2 className="font-display text-base font-bold flex items-center gap-2">
              <FileText className="h-4 w-4 text-primary" /> Job Description
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">{job.fullDesc}</p>
          </div>

          {/* Responsibilities */}
          <div className="rounded-xl border border-border bg-card p-5 space-y-3">
            <h2 className="font-display text-base font-bold flex items-center gap-2">
              <ListChecks className="h-4 w-4 text-primary" /> Responsibilities
            </h2>
            <ul className="space-y-2">
              {job.responsibilities.map((r, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                  {r}
                </li>
              ))}
            </ul>
          </div>

          {/* Requirements */}
          <div className="rounded-xl border border-border bg-card p-5 space-y-3">
            <h2 className="font-display text-base font-bold flex items-center gap-2">
              <Briefcase className="h-4 w-4 text-primary" /> Requirements
            </h2>
            <ul className="space-y-2">
              {job.requirements.map((r, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
                  {r}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Right — Overview & Apply */}
        <div className="lg:col-span-2 space-y-4">
          {/* Job overview */}
          <div className="rounded-xl border border-border bg-card p-5 space-y-4">
            <h2 className="font-display text-base font-bold">Job Overview</h2>
            <div className="space-y-3">
              {[
                { label: "Experience", value: job.overview.experience },
                { label: "Education", value: job.overview.education },
                { label: "Schedule", value: job.overview.schedule },
                { label: "Start Date", value: job.overview.startDate },
                { label: "Salary", value: job.salary },
                { label: "Location", value: job.location },
                { label: "Work Mode", value: job.mode },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{item.label}</span>
                  <span className="font-medium">{item.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Benefits */}
          <div className="rounded-xl border border-border bg-card p-5 space-y-3">
            <h2 className="font-display text-base font-bold">Benefits</h2>
            <div className="flex flex-wrap gap-2">
              {job.benefits.map((b) => (
                <span key={b} className="rounded-lg bg-secondary px-3 py-2 text-xs font-medium text-foreground">
                  {b}
                </span>
              ))}
            </div>
          </div>

          {/* Apply button */}
          <Button className="w-full" size="lg" onClick={() => { setApplyOpen(true); setApplySuccess(false); setApplyForm({ name: "", email: "", phone: "", coverLetter: "" }); }}>
            Apply Now
          </Button>
        </div>
      </div>

      {/* Apply dialog */}
      <Dialog open={applyOpen} onOpenChange={(o) => { setApplyOpen(o); if (!o) setApplySuccess(false); }}>
        <DialogContent className="max-w-md">
          {applySuccess ? (
            <div className="flex flex-col items-center py-6 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10"><CheckCircle2 className="h-8 w-8 text-primary" /></div>
              <h2 className="mt-4 font-display text-xl font-bold">Application Submitted!</h2>
              <p className="mt-2 text-sm text-muted-foreground">Your application for {job.title} at {job.company} has been sent successfully.</p>
              <Button className="mt-6" onClick={() => setApplyOpen(false)}>Close</Button>
            </div>
          ) : (
            <>
              <DialogHeader><DialogTitle>Apply — {job.title}</DialogTitle></DialogHeader>
              <div className="space-y-4 pt-2">
                <FormSection title="Personal Details">
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div><Label>Full Name</Label><Input className="mt-1.5" value={applyForm.name} onChange={(e) => setApplyForm((p) => ({ ...p, name: e.target.value }))} /></div>
                    <div><Label>Email</Label><Input className="mt-1.5" type="email" value={applyForm.email} onChange={(e) => setApplyForm((p) => ({ ...p, email: e.target.value }))} /></div>
                  </div>
                  <PhoneField value={applyForm.phone} onChange={(v) => setApplyForm((p) => ({ ...p, phone: v }))} />
                </FormSection>
                <FormSection title="Application Documents">
                  <div><Label>Cover Letter</Label><Textarea className="mt-1.5" rows={3} value={applyForm.coverLetter} onChange={(e) => setApplyForm((p) => ({ ...p, coverLetter: e.target.value }))} /></div>
                  <div><Label>Resume (PDF or Image)</Label><Input type="file" accept=".pdf,image/*" className="mt-1.5" /></div>
                  <div><Label>Visa Proof (PDF or Image)</Label><Input type="file" accept=".pdf,image/*" className="mt-1.5" /></div>
                </FormSection>
                <Button className="w-full" onClick={() => setApplySuccess(true)}>Submit Application</Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
