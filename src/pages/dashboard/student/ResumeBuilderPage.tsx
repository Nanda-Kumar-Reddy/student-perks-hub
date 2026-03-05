import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { FileText, Plus, Trash2, Download } from "lucide-react";

interface Section { title: string; items: string[] }

export default function ResumeBuilderPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [summary, setSummary] = useState("");
  const [education, setEducation] = useState<Section[]>([{ title: "", items: [""] }]);
  const [experience, setExperience] = useState<Section[]>([{ title: "", items: [""] }]);
  const [skills, setSkills] = useState("");
  const [preview, setPreview] = useState(false);

  const addSection = (setter: React.Dispatch<React.SetStateAction<Section[]>>) => setter((p) => [...p, { title: "", items: [""] }]);
  const removeSection = (setter: React.Dispatch<React.SetStateAction<Section[]>>, idx: number) => setter((p) => p.filter((_, i) => i !== idx));

  if (preview) {
    return (
      <div className="space-y-6">
        <div className="flex gap-3">
          <Button variant="ghost" onClick={() => setPreview(false)}>← Edit</Button>
          <Button onClick={() => window.print()}><Download className="h-4 w-4 mr-1" /> Export PDF</Button>
        </div>
        <div className="rounded-xl border border-border bg-card p-8 shadow-card max-w-2xl mx-auto print:shadow-none print:border-0">
          <h1 className="font-display text-3xl font-bold">{name || "Your Name"}</h1>
          <p className="text-sm text-muted-foreground mt-1">{[email, phone].filter(Boolean).join(" • ")}</p>
          {summary && <><h2 className="font-display font-bold mt-6 text-sm uppercase tracking-wide border-b border-border pb-1">Summary</h2><p className="mt-2 text-sm text-muted-foreground">{summary}</p></>}
          {education.some((e) => e.title) && <><h2 className="font-display font-bold mt-6 text-sm uppercase tracking-wide border-b border-border pb-1">Education</h2>{education.filter((e) => e.title).map((e, i) => <div key={i} className="mt-2"><div className="text-sm font-medium">{e.title}</div>{e.items.filter(Boolean).map((item, j) => <div key={j} className="text-xs text-muted-foreground">• {item}</div>)}</div>)}</>}
          {experience.some((e) => e.title) && <><h2 className="font-display font-bold mt-6 text-sm uppercase tracking-wide border-b border-border pb-1">Experience</h2>{experience.filter((e) => e.title).map((e, i) => <div key={i} className="mt-2"><div className="text-sm font-medium">{e.title}</div>{e.items.filter(Boolean).map((item, j) => <div key={j} className="text-xs text-muted-foreground">• {item}</div>)}</div>)}</>}
          {skills && <><h2 className="font-display font-bold mt-6 text-sm uppercase tracking-wide border-b border-border pb-1">Skills</h2><p className="mt-2 text-sm text-muted-foreground">{skills}</p></>}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold flex items-center gap-2"><FileText className="h-6 w-6 text-primary" /> Resume Builder</h1>
        <p className="text-sm text-muted-foreground mt-1">Build your professional resume</p>
      </div>
      <div className="rounded-xl border border-border bg-card p-6 shadow-card space-y-6 max-w-2xl">
        <div className="grid gap-4 sm:grid-cols-2">
          <div><Label>Full Name</Label><Input className="mt-1.5" value={name} onChange={(e) => setName(e.target.value)} /></div>
          <div><Label>Email</Label><Input className="mt-1.5" type="email" value={email} onChange={(e) => setEmail(e.target.value)} /></div>
          <div className="sm:col-span-2"><Label>Phone</Label><Input className="mt-1.5" value={phone} onChange={(e) => setPhone(e.target.value)} /></div>
          <div className="sm:col-span-2"><Label>Professional Summary</Label><Textarea className="mt-1.5" value={summary} onChange={(e) => setSummary(e.target.value)} rows={3} /></div>
        </div>

        <div>
          <div className="flex items-center justify-between"><h3 className="font-display font-bold">Education</h3><Button variant="ghost" size="sm" onClick={() => addSection(setEducation)}><Plus className="h-4 w-4 mr-1" /> Add</Button></div>
          {education.map((sec, i) => (
            <div key={i} className="mt-3 rounded-lg bg-secondary/30 p-3 space-y-2">
              <div className="flex gap-2"><Input placeholder="Degree / Institution" value={sec.title} onChange={(e) => { const n = [...education]; n[i].title = e.target.value; setEducation(n); }} /><Button variant="ghost" size="sm" onClick={() => removeSection(setEducation, i)}><Trash2 className="h-4 w-4" /></Button></div>
              {sec.items.map((item, j) => <Input key={j} placeholder="Detail..." value={item} onChange={(e) => { const n = [...education]; n[i].items[j] = e.target.value; setEducation(n); }} className="text-sm" />)}
              <Button variant="ghost" size="sm" onClick={() => { const n = [...education]; n[i].items.push(""); setEducation(n); }}>+ Detail</Button>
            </div>
          ))}
        </div>

        <div>
          <div className="flex items-center justify-between"><h3 className="font-display font-bold">Experience</h3><Button variant="ghost" size="sm" onClick={() => addSection(setExperience)}><Plus className="h-4 w-4 mr-1" /> Add</Button></div>
          {experience.map((sec, i) => (
            <div key={i} className="mt-3 rounded-lg bg-secondary/30 p-3 space-y-2">
              <div className="flex gap-2"><Input placeholder="Role / Company" value={sec.title} onChange={(e) => { const n = [...experience]; n[i].title = e.target.value; setExperience(n); }} /><Button variant="ghost" size="sm" onClick={() => removeSection(setExperience, i)}><Trash2 className="h-4 w-4" /></Button></div>
              {sec.items.map((item, j) => <Input key={j} placeholder="Detail..." value={item} onChange={(e) => { const n = [...experience]; n[i].items[j] = e.target.value; setExperience(n); }} className="text-sm" />)}
              <Button variant="ghost" size="sm" onClick={() => { const n = [...experience]; n[i].items.push(""); setExperience(n); }}>+ Detail</Button>
            </div>
          ))}
        </div>

        <div><Label>Skills</Label><Textarea className="mt-1.5" value={skills} onChange={(e) => setSkills(e.target.value)} placeholder="e.g. JavaScript, Python, Communication..." rows={2} /></div>

        <Button size="lg" onClick={() => setPreview(true)}>Preview Resume</Button>
      </div>
    </div>
  );
}
