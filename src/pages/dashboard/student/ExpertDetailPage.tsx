import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ArrowLeft, Star, Users, CheckCircle2, Award, Briefcase } from "lucide-react";
import EnquiryPopup from "@/components/shared/EnquiryPopup";

const experts = [
  {
    id: 1, name: "Anna Richards", experience: "8 years", clients: 320, rating: 4.9, photo: "AR",
    desc: "Specializes in tech and executive resumes with ATS optimization.",
    about: "Anna Richards is a certified resume writer with 8 years of experience crafting high-impact resumes for tech professionals and executives. She has helped over 320 clients land positions at top companies including Google, Microsoft, and Amazon. Her expertise in ATS optimization ensures your resume passes automated screening systems.",
    specialties: ["ATS-Optimized Resumes", "Executive & C-Suite Profiles", "Tech Industry Resumes", "LinkedIn Profile Optimization"],
    qualifications: ["Certified Professional Resume Writer (CPRW)", "National Resume Writers' Association Member", "BA in Communications — University of Sydney"],
    services: ["Full Resume Rewrite", "Resume Review & Feedback", "Cover Letter Writing", "LinkedIn Optimization"],
    price: "$120/resume",
  },
  {
    id: 2, name: "James Park", experience: "5 years", clients: 185, rating: 4.7, photo: "JP",
    desc: "Expert in creative and design-focused resume layouts.",
    about: "James Park brings a unique design perspective to resume writing. With a background in graphic design and 5 years of resume writing experience, he creates visually stunning resumes that stand out while maintaining professional standards. His creative approach has helped 185 clients across creative industries.",
    specialties: ["Creative & Design Resumes", "Portfolio-Style CVs", "Visual Resume Design", "Personal Branding"],
    qualifications: ["Certified Resume Strategist", "BFA in Graphic Design — RMIT University", "Adobe Certified Expert"],
    services: ["Creative Resume Design", "Visual CV Creation", "Portfolio Development", "Brand Identity Package"],
    price: "$100/resume",
  },
  {
    id: 3, name: "Priya Sharma", experience: "10 years", clients: 500, rating: 5.0, photo: "PS",
    desc: "Corporate resume specialist with international formatting expertise.",
    about: "Priya Sharma is a veteran resume specialist with 10 years of experience and a perfect 5.0 rating from 500+ clients. She specializes in corporate resumes for international professionals, understanding the nuances of formatting requirements across different countries and industries. Her clients have secured positions at Fortune 500 companies worldwide.",
    specialties: ["International Resume Formats", "Corporate & Finance Resumes", "Academic CVs", "Government & Public Sector"],
    qualifications: ["Master Certified Resume Writer", "PhD in Human Resources — University of Melbourne", "International Career Development Certification"],
    services: ["Corporate Resume Writing", "International CV Formatting", "Academic CV Development", "Career Consultation"],
    price: "$150/resume",
  },
];

export default function ExpertDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [enquiryOpen, setEnquiryOpen] = useState(false);
  const [enquirySuccess, setEnquirySuccess] = useState(false);

  const expert = experts.find(e => e.id === Number(id));

  if (!expert) {
    return (
      <div className="space-y-4 animate-fade-in">
        <Button variant="ghost" size="sm" onClick={() => navigate("/student/resume-builder")} className="gap-2">
          <ArrowLeft className="h-4 w-4" /> Back to Resume Builder
        </Button>
        <div className="text-center py-20 text-muted-foreground">Expert not found.</div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <Button variant="ghost" size="sm" onClick={() => navigate("/student/resume-builder")} className="gap-2">
        <ArrowLeft className="h-4 w-4" /> Back to Resume Builder
      </Button>

      <div className="grid gap-6 lg:grid-cols-5">
        <div className="lg:col-span-3 space-y-4">
          <div className="rounded-xl border border-border bg-card p-5 space-y-4">
            <div className="flex items-start gap-4">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-primary/10 text-lg font-bold text-primary">
                {expert.photo}
              </div>
              <div className="flex-1">
                <h1 className="font-display text-xl font-bold">{expert.name}</h1>
                <p className="text-sm text-muted-foreground">{expert.desc}</p>
                <div className="mt-2 flex flex-wrap gap-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1"><Star className="h-3 w-3 text-yellow-500 fill-yellow-500" /> {expert.rating}</span>
                  <span className="flex items-center gap-1"><Users className="h-3 w-3" /> {expert.clients} clients</span>
                  <span>{expert.experience} experience</span>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card p-5 space-y-3">
            <h2 className="font-display text-base font-bold flex items-center gap-2"><Briefcase className="h-4 w-4 text-primary" /> About</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">{expert.about}</p>
          </div>

          <div className="rounded-xl border border-border bg-card p-5 space-y-3">
            <h2 className="font-display text-base font-bold flex items-center gap-2"><Award className="h-4 w-4 text-primary" /> Qualifications</h2>
            <ul className="space-y-2">
              {expert.qualifications.map((q, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
                  {q}
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-xl border border-border bg-card p-5 space-y-3">
            <h2 className="font-display text-base font-bold">Areas of Expertise</h2>
            <ul className="space-y-2">
              {expert.specialties.map((s, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                  {s}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-4">
          <div className="rounded-xl border border-border bg-card p-5 space-y-4">
            <h2 className="font-display text-base font-bold">Services Offered</h2>
            <div className="flex flex-wrap gap-2">
              {expert.services.map(s => (
                <span key={s} className="rounded-lg bg-secondary px-3 py-2 text-xs font-medium text-foreground">{s}</span>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card p-5 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Starting from</span>
              <span className="font-display text-lg font-bold text-primary">{expert.price}</span>
            </div>
            <Button className="w-full" size="lg" onClick={() => { setEnquiryOpen(true); setEnquirySuccess(false); }}>
              Get Started
            </Button>
          </div>
        </div>
      </div>

      <Dialog open={enquiryOpen} onOpenChange={setEnquiryOpen}>
        <DialogContent className="max-w-sm">
          {enquirySuccess ? (
            <div className="flex flex-col items-center py-6 text-center animate-scale-in">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10"><CheckCircle2 className="h-8 w-8 text-primary" /></div>
              <h2 className="mt-4 font-display text-xl font-bold">Request Submitted!</h2>
              <p className="mt-2 text-sm text-muted-foreground">Thank you for your interest. {expert.name} will contact you within 24 hours.</p>
              <Button className="mt-6" onClick={() => setEnquiryOpen(false)}>Close</Button>
            </div>
          ) : (
            <>
              <DialogHeader><DialogTitle>Contact {expert.name}</DialogTitle></DialogHeader>
              <p className="text-sm text-muted-foreground">Submit your request and {expert.name} will reach out to discuss your resume needs.</p>
              <Button className="w-full mt-4" onClick={() => setEnquirySuccess(true)}>Submit Request</Button>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
