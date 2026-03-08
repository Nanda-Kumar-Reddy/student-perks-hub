import { useState, useRef, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileText, Plus, Trash2, Download, Star, X, Search, ArrowRight, Loader2 } from "lucide-react";
import EnquiryPopup from "@/components/shared/EnquiryPopup";
import RequestsListTab from "@/components/shared/RequestsListTab";
import { motion } from "framer-motion";
import { ResumePreview, ResumeThumb } from "@/components/resume/ResumeTemplates";
import { templateMeta, defaultResume } from "@/types/resume";
import type { ResumeData, TemplateName, ExperienceEntry, EducationEntry, ProjectEntry, CertEntry } from "@/types/resume";

const skillSuggestions = ["JavaScript", "React", "TypeScript", "Python", "Node.js", "AWS", "Docker", "MongoDB", "Git", "Agile/Scrum", "SQL", "Java", "C++", "Figma", "Photoshop", "Communication", "Leadership", "Problem Solving"];
const langSuggestions = ["English", "Spanish", "French", "Mandarin", "Hindi", "Arabic", "Portuguese", "Japanese", "Korean", "German", "Italian", "Russian"];

const experts = [
  { id: 1, name: "Anna Richards", experience: "8 years", clients: 320, rating: 4.9, photo: "AR", desc: "Specializes in tech and executive resumes with ATS optimization." },
  { id: 2, name: "James Park", experience: "5 years", clients: 185, rating: 4.7, photo: "JP", desc: "Expert in creative and design-focused resume layouts." },
  { id: 3, name: "Priya Sharma", experience: "10 years", clients: 500, rating: 5.0, photo: "PS", desc: "Corporate resume specialist with international formatting expertise." },
];

const myRequests = [
  { id: 1, title: "Resume Review — Anna Richards", subtitle: "Professional review service", date: "March 4, 2026", status: "In Progress" },
];

const contentSections = ["Personal", "Experience", "Education", "Skills", "Projects", "Certifications", "Languages"] as const;

type PageSize = "a4" | "letter" | "a5";
const pageSizes: Record<PageSize, { w: number; h: number; label: string }> = {
  a4: { w: 794, h: 1123, label: "A4" },
  letter: { w: 816, h: 1056, label: "Letter" },
  a5: { w: 559, h: 794, label: "A5" },
};

function TagInput({ tags, setTags, suggestions, placeholder }: { tags: string[]; setTags: (t: string[]) => void; suggestions: string[]; placeholder: string }) {
  const [query, setQuery] = useState("");
  const filtered = suggestions.filter(s => s.toLowerCase().includes(query.toLowerCase()) && !tags.includes(s));
  const add = (tag: string) => { if (tag && !tags.includes(tag)) { setTags([...tags, tag]); setQuery(""); } };
  const remove = (tag: string) => setTags(tags.filter(t => t !== tag));

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input className="pl-8" placeholder={placeholder} value={query} onChange={e => setQuery(e.target.value)} onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); add(query.trim()); } }} />
        </div>
        <Button size="sm" variant="outline" onClick={() => add(query.trim())} disabled={!query.trim()}><Plus className="h-4 w-4 mr-1" /> Add</Button>
      </div>
      {query && filtered.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {filtered.slice(0, 8).map(s => (
            <button key={s} onClick={() => add(s)} className="rounded-md bg-secondary px-2 py-1 text-xs text-muted-foreground hover:bg-primary/10 hover:text-primary transition-colors">{s}</button>
          ))}
        </div>
      )}
      <div className="flex flex-wrap gap-1.5">
        {tags.map(t => (
          <span key={t} className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
            {t}
            <button onClick={() => remove(t)} className="hover:text-destructive"><X className="h-3 w-3" /></button>
          </span>
        ))}
      </div>
    </div>
  );
}

export default function ResumeBuilderPage() {
  const navigate = useNavigate();
  const [name, setName] = useState(defaultResume.name);
  const [jobTitle, setJobTitle] = useState(defaultResume.jobTitle);
  const [email, setEmail] = useState(defaultResume.email);
  const [phone, setPhone] = useState(defaultResume.phone);
  const [address, setAddress] = useState(defaultResume.address);
  const [linkedin, setLinkedin] = useState(defaultResume.linkedin);
  const [portfolio, setPortfolio] = useState(defaultResume.portfolio);
  const [summary, setSummary] = useState(defaultResume.summary);
  const [experience, setExperience] = useState<ExperienceEntry[]>(defaultResume.experience);
  const [education, setEducation] = useState<EducationEntry[]>(defaultResume.education);
  const [skills, setSkills] = useState<string[]>(defaultResume.skills);
  const [projects, setProjects] = useState<ProjectEntry[]>(defaultResume.projects);
  const [certifications, setCertifications] = useState<CertEntry[]>(defaultResume.certifications);
  const [languages, setLanguages] = useState<string[]>(defaultResume.languages);
  const [activeTemplate, setActiveTemplate] = useState<TemplateName>("professional");
  const [contentTab, setContentTab] = useState<"content" | "templates">("content");
  const [activeSection, setActiveSection] = useState<string>("Personal");
  const [expertEnquiry, setExpertEnquiry] = useState(false);
  const [expertName, setExpertName] = useState("");
  const [downloading, setDownloading] = useState(false);
  const [pageSize, setPageSize] = useState<PageSize>("letter");
  const previewRef = useRef<HTMLDivElement>(null);
  const previewViewportRef = useRef<HTMLDivElement>(null);
  const [previewScale, setPreviewScale] = useState(1);

  const resumeData: ResumeData = { name, jobTitle, email, phone, address, linkedin, portfolio, summary, experience, education, skills, projects, certifications, languages };

  const ps = pageSizes[pageSize];

  useEffect(() => {
    const viewport = previewViewportRef.current;
    if (!viewport) return;

    const calculateScale = () => {
      const availableWidth = Math.max(viewport.clientWidth - 24, 280);
      const nextScale = Math.min(1, availableWidth / ps.w);
      setPreviewScale(Number(nextScale.toFixed(3)));
    };

    calculateScale();

    if (typeof ResizeObserver !== "undefined") {
      const observer = new ResizeObserver(calculateScale);
      observer.observe(viewport);
      return () => observer.disconnect();
    }

    window.addEventListener("resize", calculateScale);
    return () => window.removeEventListener("resize", calculateScale);
  }, [ps.w]);

  const handleDownload = useCallback(async () => {
    if (!previewRef.current || downloading) return;
    setDownloading(true);
    try {
      const html2pdf = (await import("html2pdf.js")).default;
      await html2pdf().set({
        margin: 0,
        filename: `${name || "resume"}.pdf`,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: "px", format: [ps.w, ps.h], hotfixes: ["px_scaling"] },
      }).from(previewRef.current).save();
    } finally {
      setDownloading(false);
    }
  }, [name, downloading, ps]);

  const renderSectionEditor = () => {
    switch (activeSection) {
      case "Personal":
        return (
          <div className="grid grid-cols-1 gap-2.5 sm:gap-3 md:grid-cols-2">
            <div className="min-w-0"><Label className="text-xs sm:text-sm">Full Name</Label><Input className="mt-1 text-sm" value={name} onChange={e => setName(e.target.value)} placeholder="Enter your full name" /><p className="mt-0.5 text-[9px] sm:text-[10px] text-muted-foreground">💡 Use your legal name as it appears on official documents.</p></div>
            <div className="min-w-0"><Label className="text-xs sm:text-sm">Job Title</Label><Input className="mt-1 text-sm" value={jobTitle} onChange={e => setJobTitle(e.target.value)} placeholder="e.g. Full Stack Developer" /><p className="mt-0.5 text-[9px] sm:text-[10px] text-muted-foreground">💡 Match this to the role you're applying for.</p></div>
            <div className="min-w-0"><Label className="text-xs sm:text-sm">Email</Label><Input className="mt-1 text-sm" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="your@email.com" /></div>
            <div className="min-w-0"><Label className="text-xs sm:text-sm">Phone</Label><Input className="mt-1 text-sm" value={phone} onChange={e => setPhone(e.target.value)} placeholder="+61 4XX XXX XXX" /><p className="mt-0.5 text-[9px] sm:text-[10px] text-muted-foreground">Format: +61 4XX XXX XXX or 04XX XXX XXX</p></div>
            <div className="min-w-0"><Label className="text-xs sm:text-sm">Address</Label><Input className="mt-1 text-sm" value={address} onChange={e => setAddress(e.target.value)} placeholder="City, State, Country" /></div>
            <div className="min-w-0"><Label className="text-xs sm:text-sm">LinkedIn URL</Label><Input className="mt-1 text-sm" value={linkedin} onChange={e => setLinkedin(e.target.value)} placeholder="linkedin.com/in/yourname" /></div>
            <div className="md:col-span-2 min-w-0"><Label className="text-xs sm:text-sm">Portfolio Website</Label><Input className="mt-1 text-sm" value={portfolio} onChange={e => setPortfolio(e.target.value)} placeholder="yourportfolio.com" /></div>
            <div className="md:col-span-2 min-w-0">
              <Label className="text-xs sm:text-sm">Profile Summary</Label>
              <Textarea className="mt-1 text-sm" value={summary} onChange={e => setSummary(e.target.value)} rows={3} placeholder="A brief summary of your professional background..." />
              <p className="mt-0.5 text-[9px] sm:text-[10px] text-muted-foreground">💡 Keep the summary concise and highlight your strongest professional achievements.</p>
            </div>
          </div>
        );
      case "Experience":
        return (
          <div className="space-y-3">
            <div className="flex items-center justify-between"><span className="text-sm font-medium">Work Experience</span><Button variant="ghost" size="sm" onClick={() => setExperience(p => [...p, { company: "", jobTitle: "", startDate: "", endDate: "", description: "" }])}><Plus className="h-4 w-4 mr-1" /> Add</Button></div>
            {experience.map((e, i) => (
              <div key={i} className="rounded-lg bg-secondary/30 p-3 space-y-2">
                <div className="flex justify-between items-start"><span className="text-xs font-medium text-muted-foreground">Entry {i + 1}</span><Button variant="ghost" size="sm" onClick={() => setExperience(p => p.filter((_, j) => j !== i))}><Trash2 className="h-3.5 w-3.5" /></Button></div>
                <div className="grid gap-2 md:grid-cols-2">
                  <div><Label className="text-xs">Company Name</Label><Input className="mt-1" placeholder="Company Name" value={e.company} onChange={ev => { const n = [...experience]; n[i] = { ...n[i], company: ev.target.value }; setExperience(n); }} /></div>
                  <div><Label className="text-xs">Job Title</Label><Input className="mt-1" placeholder="Job Title" value={e.jobTitle} onChange={ev => { const n = [...experience]; n[i] = { ...n[i], jobTitle: ev.target.value }; setExperience(n); }} /></div>
                  <div><Label className="text-xs">Start Date</Label><Input className="mt-1" placeholder="e.g. Jan 2023" value={e.startDate} onChange={ev => { const n = [...experience]; n[i] = { ...n[i], startDate: ev.target.value }; setExperience(n); }} /></div>
                  <div><Label className="text-xs">End Date</Label><Input className="mt-1" placeholder="e.g. Present" value={e.endDate} onChange={ev => { const n = [...experience]; n[i] = { ...n[i], endDate: ev.target.value }; setExperience(n); }} /></div>
                </div>
                <div><Label className="text-xs">Description</Label><Textarea className="mt-1" placeholder="Key responsibilities and achievements..." value={e.description} onChange={ev => { const n = [...experience]; n[i] = { ...n[i], description: ev.target.value }; setExperience(n); }} rows={2} /></div>
              </div>
            ))}
          </div>
        );
      case "Education":
        return (
          <div className="space-y-3">
            <div className="flex items-center justify-between"><span className="text-sm font-medium">Education</span><Button variant="ghost" size="sm" onClick={() => setEducation(p => [...p, { institution: "", degree: "", startDate: "", endDate: "" }])}><Plus className="h-4 w-4 mr-1" /> Add</Button></div>
            {education.map((e, i) => (
              <div key={i} className="rounded-lg bg-secondary/30 p-3 space-y-2">
                <div className="flex justify-between items-start"><span className="text-xs font-medium text-muted-foreground">Entry {i + 1}</span><Button variant="ghost" size="sm" onClick={() => setEducation(p => p.filter((_, j) => j !== i))}><Trash2 className="h-3.5 w-3.5" /></Button></div>
                <div className="grid gap-2 md:grid-cols-2">
                  <div><Label className="text-xs">Institution</Label><Input className="mt-1" placeholder="University / Institution" value={e.institution} onChange={ev => { const n = [...education]; n[i] = { ...n[i], institution: ev.target.value }; setEducation(n); }} /></div>
                  <div><Label className="text-xs">Degree / Course</Label><Input className="mt-1" placeholder="Degree / Course" value={e.degree} onChange={ev => { const n = [...education]; n[i] = { ...n[i], degree: ev.target.value }; setEducation(n); }} /></div>
                  <div><Label className="text-xs">Start Date</Label><Input className="mt-1" placeholder="e.g. 2017" value={e.startDate} onChange={ev => { const n = [...education]; n[i] = { ...n[i], startDate: ev.target.value }; setEducation(n); }} /></div>
                  <div><Label className="text-xs">End Date</Label><Input className="mt-1" placeholder="e.g. 2020" value={e.endDate} onChange={ev => { const n = [...education]; n[i] = { ...n[i], endDate: ev.target.value }; setEducation(n); }} /></div>
                </div>
              </div>
            ))}
          </div>
        );
      case "Skills":
        return <div><Label className="mb-2 block">Skills</Label><p className="text-[10px] text-muted-foreground mb-2">💡 Add skills relevant to your target role. Include both technical and soft skills.</p><TagInput tags={skills} setTags={setSkills} suggestions={skillSuggestions} placeholder="Search or type a skill..." /></div>;
      case "Projects":
        return (
          <div className="space-y-3">
            <div className="flex items-center justify-between"><span className="text-sm font-medium">Projects</span><Button variant="ghost" size="sm" onClick={() => setProjects(p => [...p, { name: "", link: "", description: "" }])}><Plus className="h-4 w-4 mr-1" /> Add</Button></div>
            {projects.map((p, i) => (
              <div key={i} className="rounded-lg bg-secondary/30 p-3 space-y-2">
                <div className="flex justify-between items-start"><span className="text-xs font-medium text-muted-foreground">Project {i + 1}</span><Button variant="ghost" size="sm" onClick={() => setProjects(pr => pr.filter((_, j) => j !== i))}><Trash2 className="h-3.5 w-3.5" /></Button></div>
                <div><Label className="text-xs">Project Name</Label><Input className="mt-1" placeholder="Project Name" value={p.name} onChange={ev => { const n = [...projects]; n[i] = { ...n[i], name: ev.target.value }; setProjects(n); }} /></div>
                <div><Label className="text-xs">Project Link (optional)</Label><Input className="mt-1" placeholder="github.com/..." value={p.link} onChange={ev => { const n = [...projects]; n[i] = { ...n[i], link: ev.target.value }; setProjects(n); }} /></div>
                <div><Label className="text-xs">Description</Label><Textarea className="mt-1" placeholder="Brief description..." value={p.description} onChange={ev => { const n = [...projects]; n[i] = { ...n[i], description: ev.target.value }; setProjects(n); }} rows={2} /></div>
              </div>
            ))}
          </div>
        );
      case "Certifications":
        return (
          <div className="space-y-3">
            <div className="flex items-center justify-between"><span className="text-sm font-medium">Certifications</span><Button variant="ghost" size="sm" onClick={() => setCertifications(p => [...p, { name: "", issuer: "", date: "" }])}><Plus className="h-4 w-4 mr-1" /> Add</Button></div>
            {certifications.map((c, i) => (
              <div key={i} className="rounded-lg bg-secondary/30 p-3 space-y-2">
                <div className="flex justify-between items-start"><span className="text-xs font-medium text-muted-foreground">Cert {i + 1}</span><Button variant="ghost" size="sm" onClick={() => setCertifications(p => p.filter((_, j) => j !== i))}><Trash2 className="h-3.5 w-3.5" /></Button></div>
                <div><Label className="text-xs">Certification Name</Label><Input className="mt-1" placeholder="Certification Name" value={c.name} onChange={ev => { const n = [...certifications]; n[i] = { ...n[i], name: ev.target.value }; setCertifications(n); }} /></div>
                <div><Label className="text-xs">Issuer</Label><Input className="mt-1" placeholder="Issuing Organization" value={c.issuer} onChange={ev => { const n = [...certifications]; n[i] = { ...n[i], issuer: ev.target.value }; setCertifications(n); }} /></div>
                <div><Label className="text-xs">Date</Label><Input className="mt-1" placeholder="e.g. 2023" value={c.date} onChange={ev => { const n = [...certifications]; n[i] = { ...n[i], date: ev.target.value }; setCertifications(n); }} /></div>
              </div>
            ))}
          </div>
        );
      case "Languages":
        return <div><Label className="mb-2 block">Languages</Label><p className="text-[10px] text-muted-foreground mb-2">💡 Include languages you can communicate in professionally.</p><TagInput tags={languages} setTags={setLanguages} suggestions={langSuggestions} placeholder="Search or type a language..." /></div>;
      default:
        return null;
    }
  };

  

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold flex items-center gap-2"><FileText className="h-6 w-6 text-primary" /> Resume Builder</h1>
        <p className="text-sm text-muted-foreground mt-1">Build your professional resume</p>
      </div>
      <Tabs defaultValue="build" className="w-full min-w-0">
        <TabsList className="w-full justify-start overflow-x-auto whitespace-nowrap">
          <TabsTrigger value="build" className="shrink-0">Build It Myself</TabsTrigger>
          <TabsTrigger value="expert" className="shrink-0">Hire an Expert</TabsTrigger>
          <TabsTrigger value="requests" className="shrink-0">My Requests</TabsTrigger>
        </TabsList>

        <TabsContent value="build" className="mt-4">
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="min-w-0 space-y-4">
              <div className="flex flex-wrap gap-2">
                <Button variant={contentTab === "content" ? "default" : "outline"} size="sm" onClick={() => setContentTab("content")}>Content</Button>
                <Button variant={contentTab === "templates" ? "default" : "outline"} size="sm" onClick={() => setContentTab("templates")}>Templates ({templateMeta.length})</Button>
              </div>
              {contentTab === "templates" ? (
                <div className="grid gap-3 grid-cols-2 sm:grid-cols-3">
                  {templateMeta.map(t => (
                    <motion.div key={t.id} whileHover={{ scale: 1.02 }} onClick={() => setActiveTemplate(t.id)}
                      className={`cursor-pointer rounded-xl border overflow-hidden transition-all ${activeTemplate === t.id ? "border-primary ring-2 ring-primary/30 shadow-card" : "border-border bg-card hover:shadow-card"}`}>
                      <div className="bg-secondary/30 flex items-center justify-center p-1">
                        <ResumeThumb templateId={t.id} data={resumeData} />
                      </div>
                      <div className="p-2">
                        <h3 className="font-display text-xs font-bold">{t.name}</h3>
                        <p className="text-[10px] text-muted-foreground">{t.desc}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="flex max-w-full min-w-0 flex-col space-y-2.5 rounded-xl border border-border bg-card p-2 shadow-card sm:space-y-4 sm:p-4">
                  <div className="w-full overflow-x-auto pb-1.5 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                    <div className="flex min-w-max gap-1 pr-1">
                      {contentSections.map(s => (
                        <button key={s} onClick={() => setActiveSection(s)}
                          className={`rounded-lg px-2 sm:px-3 py-1 sm:py-1.5 text-[10px] sm:text-xs font-medium transition-colors whitespace-nowrap flex-shrink-0 ${activeSection === s ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground hover:text-foreground"}`}>{s}</button>
                      ))}
                    </div>
                  </div>
                  <div className="min-w-0 w-full overflow-x-hidden overflow-y-auto max-h-[62vh] sm:max-h-none pb-20 sm:pb-0">
                    {renderSectionEditor()}
                  </div>
                </div>
              )}
            </div>

            <div className="print:shadow-none">
              <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
                <h3 className="font-display text-sm font-bold">Live Preview — {templateMeta.find(t => t.id === activeTemplate)?.name}</h3>
                <div className="flex items-center gap-2">
                  <Select value={pageSize} onValueChange={(v) => setPageSize(v as PageSize)}>
                    <SelectTrigger className="h-8 w-24 text-xs"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {Object.entries(pageSizes).map(([k, v]) => <SelectItem key={k} value={k}>{v.label}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  <Button size="sm" onClick={handleDownload} disabled={downloading} className={downloading ? "opacity-60" : ""}>
                    {downloading ? <><Loader2 className="h-4 w-4 mr-1 animate-spin" /> Downloading...</> : <><Download className="h-4 w-4 mr-1" /> Download PDF</>}
                  </Button>
                </div>
              </div>
              <div className="overflow-auto rounded-xl border border-border shadow-card bg-secondary/20" style={{ maxHeight: "70vh" }}>
                <div ref={previewRef} style={{ transform: `scale(${previewScale})`, transformOrigin: "top left", width: ps.w }}>
                  <ResumePreview templateId={activeTemplate} data={resumeData} />
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="expert" className="mt-4">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {experts.map((e, i) => (
              <motion.div key={e.id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
                className="rounded-xl border border-border bg-card p-5 shadow-card transition-all hover:shadow-card-hover cursor-pointer"
                onClick={() => navigate(`/student/resume-builder/expert/${e.id}`)}>
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">{e.photo}</div>
                  <div>
                    <h3 className="font-display text-sm font-bold">{e.name}</h3>
                    <p className="text-xs text-muted-foreground">{e.experience} experience</p>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-2">{e.desc}</p>
                <div className="mt-3 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs">
                    <span className="flex items-center gap-1"><Star className="h-3 w-3 fill-primary text-primary" />{e.rating}</span>
                    <span className="text-muted-foreground">· {e.clients} clients</span>
                  </div>
                  <span className="text-xs text-primary font-medium flex items-center gap-1">View <ArrowRight className="h-3 w-3" /></span>
                </div>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="requests" className="mt-4">
          <RequestsListTab requests={myRequests} emptyMessage="No resume service requests yet." />
        </TabsContent>
      </Tabs>
    </div>
  );
}
