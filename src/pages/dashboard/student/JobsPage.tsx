import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Briefcase, Search, MapPin, Clock, CheckCircle2, Monitor, Building } from "lucide-react";
import PhoneField from "@/components/shared/PhoneField";
import FormSection from "@/components/shared/FormSection";
import RequestsListTab from "@/components/shared/RequestsListTab";

const jobs = [
  { id: 1, title: "Software Engineer", company: "TechCorp AU", location: "Melbourne", type: "Full-time", mode: "Online", posted: "2d ago", salary: "$75k-90k", desc: "Build scalable web applications.", requirements: ["3+ years React", "Node.js experience", "Valid work rights"] },
  { id: 2, title: "Marketing Coordinator", company: "BrandHouse", location: "Sydney", type: "Full-time", mode: "Offline", posted: "1d ago", salary: "$60k-70k", desc: "Manage marketing campaigns.", requirements: ["Marketing degree", "Social media skills", "Creative thinking"] },
  { id: 3, title: "Barista", company: "Bean Counter Café", location: "Melbourne CBD", type: "Part-time", mode: "Offline", posted: "2d ago", salary: "$25-28/hr", desc: "Join our friendly café team.", requirements: ["Weekend availability", "Good communication"] },
  { id: 4, title: "Retail Assistant", company: "Uni Bookstore", location: "Sydney", type: "Part-time", mode: "Offline", posted: "1d ago", salary: "$26/hr", desc: "Help customers at our university bookstore.", requirements: ["Current student", "Basic computer skills"] },
  { id: 5, title: "IT Support", company: "TechCorp", location: "Brisbane", type: "Part-time", mode: "Online", posted: "5d ago", salary: "$30-35/hr", desc: "Entry-level IT support role.", requirements: ["IT student", "Problem-solving skills"] },
];

const myApplications = [
  { id: 1, title: "Software Engineer — TechCorp AU", subtitle: "Applied via LifelineAustralia", date: "March 6, 2026", status: "Pending" },
  { id: 2, title: "Barista — Bean Counter Café", subtitle: "Applied via LifelineAustralia", date: "March 1, 2026", status: "In Progress" },
];

const sortOptions = ["Newest", "Salary", "Most relevant"];

function JobsTab({ jobType }: { jobType: string }) {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [locationFilter, setLocationFilter] = useState("All");
  const [sort, setSort] = useState("Newest");
  const [applyOpen, setApplyOpen] = useState(false);
  const [applyJob, setApplyJob] = useState<typeof jobs[0] | null>(null);
  const [applySuccess, setApplySuccess] = useState(false);
  const [applyForm, setApplyForm] = useState({ name: "", email: "", phone: "", coverLetter: "" });

  const typeFilter = jobType === "full" ? "Full-time" : "Part-time";
  const filtered = jobs.filter((j) => {
    const mt = j.type === typeFilter;
    const ms = j.title.toLowerCase().includes(search.toLowerCase()) || j.company.toLowerCase().includes(search.toLowerCase());
    const ml = locationFilter === "All" || j.location.includes(locationFilter);
    return mt && ms && ml;
  });

  const handleApply = (j: typeof jobs[0]) => {
    setApplyJob(j);
    setApplyOpen(true);
    setApplySuccess(false);
    setApplyForm({ name: "", email: "", phone: "", coverLetter: "" });
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search jobs..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
        </div>
        <Select value={locationFilter} onValueChange={setLocationFilter}>
          <SelectTrigger className="w-full sm:w-36"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All Locations</SelectItem>
            <SelectItem value="Melbourne">Melbourne</SelectItem>
            <SelectItem value="Sydney">Sydney</SelectItem>
            <SelectItem value="Brisbane">Brisbane</SelectItem>
          </SelectContent>
        </Select>
        <Select value={sort} onValueChange={setSort}>
          <SelectTrigger className="w-full sm:w-36"><SelectValue /></SelectTrigger>
          <SelectContent>{sortOptions.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
        </Select>
      </div>
      <div className="space-y-3">
        {filtered.map((j) => (
          <div key={j.id} onClick={() => navigate(`/student/jobs/${j.id}`)} className="cursor-pointer rounded-xl border border-border bg-card p-4 shadow-card transition-all hover:shadow-card-hover flex items-center justify-between">
            <div>
              <h3 className="font-display text-sm font-bold">{j.title}</h3>
              <p className="text-xs text-muted-foreground mt-0.5">{j.company}</p>
              <div className="flex flex-wrap gap-3 mt-2 text-xs text-muted-foreground">
                <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {j.location}</span>
                <span className="flex items-center gap-1">{j.mode === "Online" ? <Monitor className="h-3 w-3" /> : <Building className="h-3 w-3" />} {j.mode}</span>
                <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {j.posted}</span>
              </div>
            </div>
            <Button size="sm" onClick={(e) => { e.stopPropagation(); handleApply(j); }}>Apply Now</Button>
          </div>
        ))}
      </div>

      <Dialog open={applyOpen} onOpenChange={(o) => { setApplyOpen(o); if (!o) setApplySuccess(false); }}>
        <DialogContent className="max-w-md">
          {applySuccess ? (
            <div className="flex flex-col items-center py-6 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10"><CheckCircle2 className="h-8 w-8 text-primary" /></div>
              <h2 className="mt-4 font-display text-xl font-bold">Application Submitted!</h2>
              <p className="mt-2 text-sm text-muted-foreground">Your application for {applyJob?.title} has been sent.</p>
              <Button className="mt-6" onClick={() => setApplyOpen(false)}>Close</Button>
            </div>
          ) : (
            <>
              <DialogHeader><DialogTitle>Apply — {applyJob?.title}</DialogTitle></DialogHeader>
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

export default function JobsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold flex items-center gap-2"><Briefcase className="h-6 w-6 text-primary" /> Jobs</h1>
        <p className="text-sm text-muted-foreground mt-1">Find jobs near you</p>
      </div>
      <Tabs defaultValue="full" className="w-full">
        <TabsList>
          <TabsTrigger value="full">Full Time</TabsTrigger>
          <TabsTrigger value="part">Part Time</TabsTrigger>
          <TabsTrigger value="applications">My Applications</TabsTrigger>
        </TabsList>
        <TabsContent value="full" className="mt-4"><JobsTab jobType="full" /></TabsContent>
        <TabsContent value="part" className="mt-4"><JobsTab jobType="part" /></TabsContent>
        <TabsContent value="applications" className="mt-4">
          <RequestsListTab requests={myApplications} emptyMessage="No job applications yet." />
        </TabsContent>
      </Tabs>
    </div>
  );
}
