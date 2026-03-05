import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, Plus, Trash2, Download, Star } from "lucide-react";
import EnquiryPopup from "@/components/shared/EnquiryPopup";
import RequestsListTab from "@/components/shared/RequestsListTab";

interface Section { title: string; items: string[] }

const templates = [
  { id: 1, name: "Professional", desc: "Clean and modern layout", color: "bg-primary/10" },
  { id: 2, name: "Creative", desc: "Bold and eye-catching design", color: "bg-accent/10" },
  { id: 3, name: "Minimal", desc: "Simple and elegant", color: "bg-secondary" },
];

const experts = [
  { id: 1, name: "Anna Richards", experience: "8 years", rating: 4.9, photo: "AR" },
  { id: 2, name: "James Park", experience: "5 years", rating: 4.7, photo: "JP" },
  { id: 3, name: "Priya Sharma", experience: "10 years", rating: 5.0, photo: "PS" },
];

const myRequests = [
  { id: 1, title: "Resume Review — Anna Richards", subtitle: "Professional review service", date: "March 4, 2026", status: "In Progress" },
];

const contentSections = ["Personal", "Experience", "Education", "Skills", "Projects", "Certifications", "Languages"] as const;

export default function ResumeBuilderPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [summary, setSummary] = useState("");
  const [education, setEducation] = useState<Section[]>([{ title: "", items: [""] }]);
  const [experience, setExperience] = useState<Section[]>([{ title: "", items: [""] }]);
  const [skills, setSkills] = useState("");
  const [projects, setProjects] = useState("");
  const [certifications, setCertifications] = useState("");
  const [languages, setLanguages] = useState("");
  const [activeTemplate, setActiveTemplate] = useState(1);
  const [contentTab, setContentTab] = useState<"content" | "templates">("content");
  const [activeSection, setActiveSection] = useState<string>("Personal");
  const [expertEnquiry, setExpertEnquiry] = useState(false);
  const [expertName, setExpertName] = useState("");

  const addSection = (setter: React.Dispatch<React.SetStateAction<Section[]>>) => setter((p) => [...p, { title: "", items: [""] }]);
  const removeSection = (setter: React.Dispatch<React.SetStateAction<Section[]>>, idx: number) => setter((p) => p.filter((_, i) => i !== idx));

  const LivePreview = () => (
    <div className={`rounded-xl border border-border p-6 shadow-card min-h-[500px] ${templates.find((t) => t.id === activeTemplate)?.color || "bg-card"}`}>
      <h1 className="font-display text-2xl font-bold">{name || "Your Name"}</h1>
      <p className="text-xs text-muted-foreground mt-1">{[email, phone].filter(Boolean).join(" • ")}</p>
      {summary && <><h2 className="font-display font-bold mt-4 text-xs uppercase tracking-wide border-b border-border pb-1">Summary</h2><p className="mt-1 text-xs text-muted-foreground">{summary}</p></>}
      {experience.some((e) => e.title) && <><h2 className="font-display font-bold mt-4 text-xs uppercase tracking-wide border-b border-border pb-1">Experience</h2>{experience.filter((e) => e.title).map((e, i) => <div key={i} className="mt-1"><div className="text-xs font-medium">{e.title}</div>{e.items.filter(Boolean).map((item, j) => <div key={j} className="text-[11px] text-muted-foreground">• {item}</div>)}</div>)}</>}
      {education.some((e) => e.title) && <><h2 className="font-display font-bold mt-4 text-xs uppercase tracking-wide border-b border-border pb-1">Education</h2>{education.filter((e) => e.title).map((e, i) => <div key={i} className="mt-1"><div className="text-xs font-medium">{e.title}</div>{e.items.filter(Boolean).map((item, j) => <div key={j} className="text-[11px] text-muted-foreground">• {item}</div>)}</div>)}</>}
      {skills && <><h2 className="font-display font-bold mt-4 text-xs uppercase tracking-wide border-b border-border pb-1">Skills</h2><p className="mt-1 text-xs text-muted-foreground">{skills}</p></>}
      {projects && <><h2 className="font-display font-bold mt-4 text-xs uppercase tracking-wide border-b border-border pb-1">Projects</h2><p className="mt-1 text-xs text-muted-foreground">{projects}</p></>}
      {certifications && <><h2 className="font-display font-bold mt-4 text-xs uppercase tracking-wide border-b border-border pb-1">Certifications</h2><p className="mt-1 text-xs text-muted-foreground">{certifications}</p></>}
      {languages && <><h2 className="font-display font-bold mt-4 text-xs uppercase tracking-wide border-b border-border pb-1">Languages</h2><p className="mt-1 text-xs text-muted-foreground">{languages}</p></>}
    </div>
  );

  const renderSectionEditor = () => {
    switch (activeSection) {
      case "Personal":
        return (
          <div className="grid gap-4 sm:grid-cols-2">
            <div><Label>Full Name</Label><Input className="mt-1.5" value={name} onChange={(e) => setName(e.target.value)} /></div>
            <div><Label>Email</Label><Input className="mt-1.5" type="email" value={email} onChange={(e) => setEmail(e.target.value)} /></div>
            <div className="sm:col-span-2"><Label>Phone</Label><Input className="mt-1.5" value={phone} onChange={(e) => setPhone(e.target.value)} /><p className="mt-1 text-xs text-muted-foreground">Format: +61 4XX XXX XXX or 04XX XXX XXX</p></div>
            <div className="sm:col-span-2"><Label>Professional Summary</Label><Textarea className="mt-1.5" value={summary} onChange={(e) => setSummary(e.target.value)} rows={3} /></div>
          </div>
        );
      case "Experience":
        return (
          <div>
            <div className="flex items-center justify-between mb-2"><span className="text-sm font-medium">Work Experience</span><Button variant="ghost" size="sm" onClick={() => addSection(setExperience)}><Plus className="h-4 w-4 mr-1" /> Add</Button></div>
            {experience.map((sec, i) => (
              <div key={i} className="mt-2 rounded-lg bg-secondary/30 p-3 space-y-2">
                <div className="flex gap-2"><Input placeholder="Role / Company" value={sec.title} onChange={(e) => { const n = [...experience]; n[i].title = e.target.value; setExperience(n); }} /><Button variant="ghost" size="sm" onClick={() => removeSection(setExperience, i)}><Trash2 className="h-4 w-4" /></Button></div>
                {sec.items.map((item, j) => <Input key={j} placeholder="Detail..." value={item} onChange={(e) => { const n = [...experience]; n[i].items[j] = e.target.value; setExperience(n); }} className="text-sm" />)}
                <Button variant="ghost" size="sm" onClick={() => { const n = [...experience]; n[i].items.push(""); setExperience(n); }}>+ Detail</Button>
              </div>
            ))}
          </div>
        );
      case "Education":
        return (
          <div>
            <div className="flex items-center justify-between mb-2"><span className="text-sm font-medium">Education</span><Button variant="ghost" size="sm" onClick={() => addSection(setEducation)}><Plus className="h-4 w-4 mr-1" /> Add</Button></div>
            {education.map((sec, i) => (
              <div key={i} className="mt-2 rounded-lg bg-secondary/30 p-3 space-y-2">
                <div className="flex gap-2"><Input placeholder="Degree / Institution" value={sec.title} onChange={(e) => { const n = [...education]; n[i].title = e.target.value; setEducation(n); }} /><Button variant="ghost" size="sm" onClick={() => removeSection(setEducation, i)}><Trash2 className="h-4 w-4" /></Button></div>
                {sec.items.map((item, j) => <Input key={j} placeholder="Detail..." value={item} onChange={(e) => { const n = [...education]; n[i].items[j] = e.target.value; setEducation(n); }} className="text-sm" />)}
                <Button variant="ghost" size="sm" onClick={() => { const n = [...education]; n[i].items.push(""); setEducation(n); }}>+ Detail</Button>
              </div>
            ))}
          </div>
        );
      case "Skills":
        return <div><Label>Skills</Label><Textarea className="mt-1.5" value={skills} onChange={(e) => setSkills(e.target.value)} placeholder="e.g. JavaScript, Python, Communication..." rows={3} /></div>;
      case "Projects":
        return <div><Label>Projects</Label><Textarea className="mt-1.5" value={projects} onChange={(e) => setProjects(e.target.value)} placeholder="Describe your projects..." rows={3} /></div>;
      case "Certifications":
        return <div><Label>Certifications</Label><Textarea className="mt-1.5" value={certifications} onChange={(e) => setCertifications(e.target.value)} placeholder="List your certifications..." rows={3} /></div>;
      case "Languages":
        return <div><Label>Languages</Label><Textarea className="mt-1.5" value={languages} onChange={(e) => setLanguages(e.target.value)} placeholder="e.g. English (Native), Mandarin (Fluent)..." rows={3} /></div>;
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
      <Tabs defaultValue="build" className="w-full">
        <TabsList>
          <TabsTrigger value="build">Build It Myself</TabsTrigger>
          <TabsTrigger value="expert">Hire an Expert</TabsTrigger>
          <TabsTrigger value="requests">My Requests</TabsTrigger>
        </TabsList>

        <TabsContent value="build" className="mt-4">
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Left: Editor */}
            <div className="space-y-4">
              <div className="flex gap-2">
                <Button variant={contentTab === "content" ? "default" : "outline"} size="sm" onClick={() => setContentTab("content")}>Content</Button>
                <Button variant={contentTab === "templates" ? "default" : "outline"} size="sm" onClick={() => setContentTab("templates")}>Templates</Button>
              </div>
              {contentTab === "templates" ? (
                <div className="grid gap-3">
                  {templates.map((t) => (
                    <div key={t.id} onClick={() => setActiveTemplate(t.id)} className={`cursor-pointer rounded-xl border p-4 transition-all hover:shadow-card ${activeTemplate === t.id ? "border-primary bg-primary/5" : "border-border bg-card"}`}>
                      <h3 className="font-display text-sm font-bold">{t.name}</h3>
                      <p className="text-xs text-muted-foreground">{t.desc}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="rounded-xl border border-border bg-card p-4 shadow-card space-y-4">
                  <div className="flex flex-wrap gap-1">
                    {contentSections.map((s) => (
                      <button key={s} onClick={() => setActiveSection(s)} className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${activeSection === s ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground hover:text-foreground"}`}>{s}</button>
                    ))}
                  </div>
                  {renderSectionEditor()}
                </div>
              )}
              <Button onClick={() => window.print()}><Download className="h-4 w-4 mr-1" /> Download PDF</Button>
            </div>

            {/* Right: Live Preview */}
            <div className="print:shadow-none">
              <h3 className="font-display text-sm font-bold mb-3">Live Preview</h3>
              <LivePreview />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="expert" className="mt-4">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {experts.map((e) => (
              <div key={e.id} className="rounded-xl border border-border bg-card p-5 shadow-card transition-all hover:shadow-card-hover">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">{e.photo}</div>
                  <div>
                    <h3 className="font-display text-sm font-bold">{e.name}</h3>
                    <p className="text-xs text-muted-foreground">{e.experience} experience</p>
                  </div>
                </div>
                <div className="mt-3 flex items-center gap-1 text-xs">
                  <Star className="h-3 w-3 fill-primary text-primary" />
                  <span className="font-medium">{e.rating}</span>
                </div>
                <Button size="sm" className="mt-3 w-full" onClick={() => { setExpertName(e.name); setExpertEnquiry(true); }}>Book Now</Button>
              </div>
            ))}
          </div>
          <EnquiryPopup open={expertEnquiry} onOpenChange={setExpertEnquiry} title={expertName} />
        </TabsContent>

        <TabsContent value="requests" className="mt-4">
          <RequestsListTab requests={myRequests} emptyMessage="No resume service requests yet." />
        </TabsContent>
      </Tabs>
    </div>
  );
}
