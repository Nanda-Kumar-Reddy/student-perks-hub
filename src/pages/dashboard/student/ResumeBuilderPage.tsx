import { useState, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, Plus, Trash2, Download, Star, X, Search } from "lucide-react";
import EnquiryPopup from "@/components/shared/EnquiryPopup";
import RequestsListTab from "@/components/shared/RequestsListTab";
import { motion } from "framer-motion";
import html2canvas from "html2canvas";

// --- Types ---
interface ExperienceEntry { company: string; jobTitle: string; startDate: string; endDate: string; description: string; }
interface EducationEntry { institution: string; degree: string; startDate: string; endDate: string; }
interface ProjectEntry { name: string; link: string; description: string; }
interface CertEntry { name: string; issuer: string; date: string; }

// --- Templates ---
const templates = [
  { id: "professional", name: "Professional", desc: "Clean modern layout" },
  { id: "creative", name: "Creative", desc: "Bold eye-catching design" },
  { id: "minimal", name: "Minimal", desc: "Simple and elegant" },
  { id: "tech", name: "Tech", desc: "Code-inspired developer resume" },
  { id: "executive", name: "Executive", desc: "Formal corporate layout" },
  { id: "bold", name: "Bold", desc: "Strong visual impact" },
  { id: "student", name: "Student", desc: "Education-first layout" },
  { id: "energetic", name: "Energetic", desc: "Vibrant two-column design" },
  { id: "elegant", name: "Elegant", desc: "Serif typography, centered" },
  { id: "sidekick", name: "Sidekick", desc: "Sidebar with main content" },
  { id: "grid", name: "Grid", desc: "Structured grid layout" },
  { id: "executive-elite", name: "Executive Elite", desc: "Premium corporate" },
  { id: "classic", name: "Classic", desc: "Traditional two-column" },
  { id: "compact", name: "Compact", desc: "Dense single-page layout" },
  { id: "global", name: "Global Standard", desc: "International format" },
];

const skillSuggestions = ["JavaScript", "React", "TypeScript", "Python", "Node.js", "AWS", "Docker", "MongoDB", "Git", "Agile/Scrum", "SQL", "Java", "C++", "Figma", "Photoshop", "Communication", "Leadership", "Problem Solving"];
const langSuggestions = ["English", "Spanish", "French", "Mandarin", "Hindi", "Arabic", "Portuguese", "Japanese", "Korean", "German", "Italian", "Russian"];

const experts = [
  { id: 1, name: "Anna Richards", experience: "8 years", rating: 4.9, photo: "AR" },
  { id: 2, name: "James Park", experience: "5 years", rating: 4.7, photo: "JP" },
  { id: 3, name: "Priya Sharma", experience: "10 years", rating: 5.0, photo: "PS" },
];

const myRequests = [
  { id: 1, title: "Resume Review — Anna Richards", subtitle: "Professional review service", date: "March 4, 2026", status: "In Progress" },
];

const contentSections = ["Personal", "Experience", "Education", "Skills", "Projects", "Certifications", "Languages"] as const;

// --- Tag Input Component ---
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

// --- Template Preview Renderers ---
function TemplatePreview({ templateId, data }: { templateId: string; data: ResumeData }) {
  const { name, jobTitle, email, phone, address, linkedin, portfolio, summary, experience, education, skills, projects, certifications, languages } = data;

  const sectionTitle = (title: string, className?: string) => (
    <h2 className={`font-display font-bold mt-4 text-xs uppercase tracking-wider border-b border-border/50 pb-1 ${className || "text-primary"}`}>{title}</h2>
  );

  // Common content blocks
  const renderExperience = () => experience.filter(e => e.company || e.jobTitle).map((e, i) => (
    <div key={i} className="mt-2">
      <div className="text-xs font-semibold">{e.jobTitle}</div>
      <div className="text-[11px] text-primary">{e.company}{e.startDate && ` | ${e.startDate} - ${e.endDate || "Present"}`}</div>
      {e.description && <p className="text-[11px] text-muted-foreground mt-0.5">{e.description}</p>}
    </div>
  ));

  const renderEducation = () => education.filter(e => e.institution || e.degree).map((e, i) => (
    <div key={i} className="mt-1">
      <div className="text-xs font-semibold">{e.degree}</div>
      <div className="text-[11px] text-muted-foreground">{e.institution}{e.startDate && ` · ${e.startDate} - ${e.endDate}`}</div>
    </div>
  ));

  const renderSkillTags = () => skills.length > 0 && (
    <div className="flex flex-wrap gap-1 mt-1">
      {skills.map(s => <span key={s} className="rounded-md border border-border px-1.5 py-0.5 text-[10px]">{s}</span>)}
    </div>
  );

  const renderProjects = () => projects.filter(p => p.name).map((p, i) => (
    <div key={i} className="mt-1">
      <div className="text-xs font-semibold">{p.name}</div>
      {p.link && <div className="text-[10px] text-primary">{p.link}</div>}
      {p.description && <p className="text-[11px] text-muted-foreground">{p.description}</p>}
    </div>
  ));

  const renderCerts = () => certifications.filter(c => c.name).map((c, i) => (
    <div key={i} className="mt-1">
      <div className="text-xs font-semibold">{c.name}</div>
      <div className="text-[10px] text-muted-foreground">{c.issuer}{c.date && ` · ${c.date}`}</div>
    </div>
  ));

  // TEMPLATE: Sidebar layout (sidekick, bold, energetic)
  if (["sidekick", "bold", "energetic"].includes(templateId)) {
    const headerBg = templateId === "bold" ? "bg-destructive text-destructive-foreground" : templateId === "energetic" ? "bg-accent text-accent-foreground" : "bg-primary/5";
    const headingColor = templateId === "bold" ? "text-[hsl(220,60%,30%)]" : templateId === "energetic" ? "text-accent" : "text-primary";

    return (
      <div className="rounded-xl border border-border overflow-hidden min-h-[500px] bg-card text-foreground">
        {(templateId === "bold" || templateId === "energetic") && (
          <div className={`p-4 ${headerBg}`}>
            <h1 className="font-display text-xl font-bold">{name || "Your Name"}</h1>
            <p className="text-xs opacity-80">{jobTitle || "Job Title"}</p>
          </div>
        )}
        <div className="flex">
          <div className="w-[35%] border-r border-border p-3 space-y-3 bg-secondary/30">
            {templateId === "sidekick" && <>
              <h1 className="font-display text-lg font-bold">{name || "Your Name"}</h1>
              <p className="text-xs text-primary">{jobTitle || "Job Title"}</p>
            </>}
            <div>
              <h3 className={`text-[10px] font-bold uppercase tracking-wider ${headingColor}`}>Contact</h3>
              {email && <p className="text-[10px] text-muted-foreground mt-1">{email}</p>}
              {phone && <p className="text-[10px] text-muted-foreground">{phone}</p>}
              {address && <p className="text-[10px] text-muted-foreground">{address}</p>}
              {linkedin && <p className="text-[10px] text-muted-foreground">{linkedin}</p>}
            </div>
            {education.some(e => e.institution) && <div><h3 className={`text-[10px] font-bold uppercase tracking-wider ${headingColor}`}>Education</h3>{renderEducation()}</div>}
            {skills.length > 0 && <div><h3 className={`text-[10px] font-bold uppercase tracking-wider ${headingColor}`}>Skills</h3>{renderSkillTags()}</div>}
            {languages.length > 0 && <div><h3 className={`text-[10px] font-bold uppercase tracking-wider ${headingColor}`}>Languages</h3><p className="text-[10px] text-muted-foreground mt-1">{languages.join(", ")}</p></div>}
            {certifications.some(c => c.name) && <div><h3 className={`text-[10px] font-bold uppercase tracking-wider ${headingColor}`}>Certifications</h3>{renderCerts()}</div>}
          </div>
          <div className="w-[65%] p-4 space-y-2">
            {summary && <>{sectionTitle("Profile", headingColor)}<p className="text-[11px] text-muted-foreground mt-1">{summary}</p></>}
            {experience.some(e => e.company) && <>{sectionTitle("Experience", headingColor)}{renderExperience()}</>}
            {projects.some(p => p.name) && <>{sectionTitle("Projects", headingColor)}{renderProjects()}</>}
          </div>
        </div>
      </div>
    );
  }

  // TEMPLATE: Classic two-column
  if (["classic", "global"].includes(templateId)) {
    return (
      <div className="rounded-xl border border-border overflow-hidden min-h-[500px] bg-card p-5 text-foreground">
        <div className="text-center border-b border-border pb-3">
          <h1 className="font-display text-xl font-bold uppercase tracking-wide">{name || "YOUR NAME"}</h1>
          <p className="text-[11px] text-muted-foreground mt-1">{[email, phone, address].filter(Boolean).join(" | ")}</p>
        </div>
        <div className="flex gap-4 mt-3">
          <div className="w-[60%] space-y-2">
            {experience.some(e => e.company) && <>
              <h2 className="font-display font-bold text-xs uppercase tracking-wider text-primary border-b border-border pb-0.5">Professional Experience</h2>
              {experience.filter(e => e.company).map((e, i) => (
                <div key={i}>
                  <div className="flex justify-between items-baseline"><span className="text-xs font-bold text-primary">{e.company}</span><span className="text-[10px] text-muted-foreground italic">{e.startDate} - {e.endDate || "Present"}</span></div>
                  <div className="text-[11px] italic text-muted-foreground">{e.jobTitle}</div>
                  {e.description && <p className="text-[11px] text-muted-foreground mt-0.5">{e.description}</p>}
                </div>
              ))}
            </>}
            {projects.some(p => p.name) && <>{sectionTitle("Projects")}{renderProjects()}</>}
            {summary && <>{sectionTitle("Summary")}<p className="text-[11px] text-muted-foreground mt-1">{summary}</p></>}
          </div>
          <div className="w-[40%] space-y-2">
            {education.some(e => e.institution) && <>
              <h2 className="font-display font-bold text-xs uppercase tracking-wider text-primary border-b border-border pb-0.5">Education</h2>
              {renderEducation()}
            </>}
            {skills.length > 0 && <><h2 className="font-display font-bold text-xs uppercase tracking-wider text-primary border-b border-border pb-0.5">Skills</h2><div className="mt-1">{skills.map(s => <div key={s} className="text-[11px]">• {s}</div>)}</div></>}
            {languages.length > 0 && <><h2 className="font-display font-bold text-xs uppercase tracking-wider text-primary border-b border-border pb-0.5">Languages</h2><p className="text-[11px] text-muted-foreground mt-1">{languages.join(", ")}</p></>}
            {certifications.some(c => c.name) && <><h2 className="font-display font-bold text-xs uppercase tracking-wider text-primary border-b border-border pb-0.5">Certifications</h2>{renderCerts()}</>}
          </div>
        </div>
      </div>
    );
  }

  // TEMPLATE: Executive / Executive Elite (centered formal)
  if (["executive", "executive-elite"].includes(templateId)) {
    return (
      <div className="rounded-xl border border-border overflow-hidden min-h-[500px] bg-card text-foreground">
        <div className="bg-primary/5 p-5 text-center">
          <h1 className="font-display text-xl font-bold uppercase tracking-widest text-primary">{name || "YOUR NAME"}</h1>
          <div className="w-8 h-0.5 bg-primary mx-auto mt-1.5" />
          <p className="text-xs italic text-muted-foreground mt-1.5">{jobTitle || "Job Title"}</p>
          <p className="text-[10px] text-muted-foreground mt-1">{[email, phone].filter(Boolean).join(" • ")}</p>
        </div>
        <div className="p-5 space-y-3">
          {summary && <><h2 className="font-display font-bold text-xs uppercase tracking-widest text-center text-primary">Professional Profile</h2><p className="text-[11px] text-muted-foreground text-center mt-1">{summary}</p></>}
          {experience.some(e => e.company) && <>
            <h2 className="font-display font-bold text-xs uppercase tracking-widest text-center text-primary mt-3">Career History</h2>
            {experience.filter(e => e.company).map((e, i) => (
              <div key={i} className="mt-2">
                <div className="flex justify-between"><span className="text-xs font-bold">{e.jobTitle}</span><span className="text-[10px] text-muted-foreground italic">{e.startDate} — {e.endDate || "Present"}</span></div>
                <div className="text-[11px] font-bold uppercase text-primary">{e.company}</div>
                {e.description && <p className="text-[11px] text-muted-foreground mt-0.5">{e.description}</p>}
              </div>
            ))}
          </>}
          <div className="flex gap-4 mt-3">
            <div className="flex-1">
              {skills.length > 0 && <><h2 className="font-display font-bold text-xs uppercase tracking-widest text-primary">Core Expertise</h2><div className="mt-1 grid grid-cols-2 gap-0.5">{skills.map(s => <div key={s} className="text-[11px]">• {s}</div>)}</div></>}
            </div>
            <div className="flex-1">
              {education.some(e => e.institution) && <><h2 className="font-display font-bold text-xs uppercase tracking-widest text-primary">Academic Credentials</h2>{renderEducation()}</>}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // TEMPLATE: Tech (code-inspired)
  if (templateId === "tech") {
    return (
      <div className="rounded-xl border border-border overflow-hidden min-h-[500px] bg-[hsl(220,20%,10%)] text-[hsl(210,20%,90%)] font-mono text-[11px]">
        <div className="p-5">
          <p className="text-primary text-[10px]">import Profile from './{(name || "YourName").replace(/\s/g, "")}';</p>
          <h1 className="font-display text-xl font-bold text-primary mt-1">{name || "Your Name"}</h1>
          <p className="text-muted-foreground">// {jobTitle || "Job Title"}</p>
          <p className="text-muted-foreground mt-1">const email = "{email || "email"}"; &nbsp; const phone = "{phone || "phone"}";</p>
        </div>
        <div className="flex">
          <div className="flex-1 p-5 pt-0 space-y-3">
            {experience.some(e => e.company) && <>
              <p className="text-primary">class Experience extends Career {"{"}</p>
              {experience.filter(e => e.company).map((e, i) => (
                <div key={i} className="ml-4 mb-2">
                  <p className="font-bold text-[hsl(210,20%,90%)]">{e.jobTitle}() {"{"}</p>
                  <p className="ml-4 text-[hsl(38,92%,50%)]">company: "{e.company}",</p>
                  <p className="ml-4 text-[hsl(38,92%,50%)]">duration: "{e.startDate} – {e.endDate || "Present"}",</p>
                  {e.description && <p className="ml-4 text-muted-foreground">/* {e.description} */</p>}
                  <p>{"}"}</p>
                </div>
              ))}
              <p>{"}"}</p>
            </>}
            {projects.some(p => p.name) && <>
              <p className="text-primary mt-2">const Projects = [</p>
              {projects.filter(p => p.name).map((p, i) => (
                <div key={i} className="ml-4">
                  <p>{"{"}  name: <span className="text-[hsl(38,92%,50%)]">"{p.name}"</span>, desc: "{p.description}" {"}"},</p>
                </div>
              ))}
              <p>];</p>
            </>}
          </div>
          <div className="w-[35%] space-y-3 p-3">
            {skills.length > 0 && <div className="rounded-lg bg-[hsl(220,14%,16%)] p-3"><p className="text-primary text-[10px] mb-1">package.json</p>{skills.map(s => <p key={s} className="text-[10px]">"{s}": "^latest",</p>)}</div>}
            {languages.length > 0 && <div className="rounded-lg bg-[hsl(220,14%,16%)] p-3"><p className="text-primary text-[10px] mb-1">i18n.config.js</p><p className="text-[10px]">languages: [{languages.map(l => `"${l}"`).join(",")}]</p></div>}
            {education.some(e => e.institution) && <div className="rounded-lg bg-[hsl(220,14%,16%)] p-3"><p className="text-primary text-[10px] mb-1">education.config</p>{education.filter(e => e.institution).map((e, i) => <div key={i}><p className="text-[10px] font-bold">{e.degree}</p><p className="text-[10px] text-muted-foreground">{e.institution}</p></div>)}</div>}
            {certifications.some(c => c.name) && <div className="rounded-lg bg-[hsl(220,14%,16%)] p-3"><p className="text-primary text-[10px] mb-1">certificates.log</p>{certifications.filter(c => c.name).map((c, i) => <p key={i} className="text-[10px]">&gt; {c.name}</p>)}</div>}
          </div>
        </div>
      </div>
    );
  }

  // TEMPLATE: Student
  if (templateId === "student") {
    return (
      <div className="rounded-xl border border-border overflow-hidden min-h-[500px] bg-card p-5 text-foreground">
        <div className="text-center border-b border-border pb-3">
          <h1 className="font-display text-xl font-bold text-primary">{name || "Your Name"}</h1>
          <p className="text-[10px] text-muted-foreground mt-1">{[address, email, phone].filter(Boolean).join(" | ")}</p>
        </div>
        <div className="mt-3 space-y-3">
          {education.some(e => e.institution) && <>{sectionTitle("Education")}{renderEducation()}</>}
          {skills.length > 0 && <>{sectionTitle("Related Coursework & Skills")}<p className="text-[11px] mt-1"><strong>Skills:</strong> {skills.join(", ")}</p>{languages.length > 0 && <p className="text-[11px]"><strong>Languages:</strong> {languages.join(", ")}</p>}</>}
          {certifications.some(c => c.name) && <>{sectionTitle("Certifications")}{renderCerts()}</>}
          {experience.some(e => e.company) && <>{sectionTitle("Experience & Internships")}{renderExperience()}</>}
          {projects.some(p => p.name) && <>{sectionTitle("Projects")}{renderProjects()}</>}
          {summary && <>{sectionTitle("Summary")}<p className="text-[11px] text-muted-foreground mt-1">{summary}</p></>}
        </div>
      </div>
    );
  }

  // TEMPLATE: Elegant
  if (templateId === "elegant") {
    return (
      <div className="rounded-xl border border-border overflow-hidden min-h-[500px] bg-card p-5 text-foreground">
        <div className="text-center pb-3">
          <h1 className="font-display text-2xl font-bold italic text-primary">{name || "Your Name"}</h1>
          <div className="w-8 h-0.5 bg-primary mx-auto mt-1" />
          <p className="text-xs italic text-muted-foreground mt-1">{jobTitle || "Job Title"}</p>
          <p className="text-[10px] text-muted-foreground mt-1">{[email, phone, address].filter(Boolean).join(" | ")}</p>
        </div>
        {summary && <><h2 className="font-display font-bold text-xs uppercase tracking-widest text-center text-primary mt-3">Profile</h2><p className="text-[11px] text-muted-foreground text-center mt-1">{summary}</p></>}
        {experience.some(e => e.company) && <>
          <h2 className="font-display font-bold text-xs uppercase tracking-widest text-center text-primary mt-4">Professional Experience</h2>
          {experience.filter(e => e.company).map((e, i) => (
            <div key={i} className="mt-2 border-l-2 border-primary/30 pl-3">
              <div className="text-xs font-bold text-primary">{e.jobTitle}</div>
              <div className="text-[10px] italic text-muted-foreground">{e.company} — {e.startDate} to {e.endDate || "Present"}</div>
              {e.description && <p className="text-[11px] text-muted-foreground mt-0.5">{e.description}</p>}
            </div>
          ))}
        </>}
        <div className="flex gap-4 mt-4">
          <div className="flex-1 text-center">{education.some(e => e.institution) && <><h2 className="font-display font-bold text-xs uppercase tracking-widest text-primary">Education</h2>{renderEducation()}</>}</div>
          <div className="flex-1 text-center">{skills.length > 0 && <><h2 className="font-display font-bold text-xs uppercase tracking-widest text-primary">Skills</h2>{renderSkillTags()}</>}</div>
        </div>
      </div>
    );
  }

  // TEMPLATE: Grid
  if (templateId === "grid") {
    return (
      <div className="rounded-xl border border-border overflow-hidden min-h-[500px] bg-card p-5 text-foreground">
        <div className="flex justify-between items-start">
          <div><h1 className="font-display text-xl font-bold">{name || "Your Name"}</h1><p className="text-xs text-primary">{jobTitle || "Job Title"}</p></div>
          <div className="text-right text-[10px] text-muted-foreground"><p>{email}</p><p>{phone}</p><p>{address}</p></div>
        </div>
        <div className="grid grid-cols-2 gap-4 mt-4">
          <div className="space-y-3">
            {summary && <><div className="flex items-center gap-1"><div className="w-4 h-0.5 bg-primary" /><h2 className="font-display font-bold text-xs text-primary">Profile</h2></div><p className="text-[11px] text-muted-foreground">{summary}</p></>}
            {experience.some(e => e.company) && <><div className="flex items-center gap-1"><div className="w-4 h-0.5 bg-primary" /><h2 className="font-display font-bold text-xs text-primary">Experience</h2></div>{renderExperience()}</>}
          </div>
          <div className="space-y-3">
            {education.some(e => e.institution) && <><div className="flex items-center gap-1"><div className="w-4 h-0.5 bg-primary" /><h2 className="font-display font-bold text-xs text-primary">Education</h2></div>{education.filter(e => e.institution).map((e, i) => <div key={i} className="rounded-lg bg-secondary/50 p-2 mt-1"><div className="text-xs font-semibold">{e.degree}</div><div className="text-[10px] text-muted-foreground">{e.institution}</div></div>)}</>}
            {skills.length > 0 && <><div className="flex items-center gap-1"><div className="w-4 h-0.5 bg-primary" /><h2 className="font-display font-bold text-xs text-primary">Skills</h2></div>{renderSkillTags()}</>}
            {projects.some(p => p.name) && <><div className="flex items-center gap-1"><div className="w-4 h-0.5 bg-primary" /><h2 className="font-display font-bold text-xs text-primary">Projects</h2></div>{renderProjects()}</>}
          </div>
        </div>
      </div>
    );
  }

  // DEFAULT: Professional / Minimal / Compact / Creative
  const bgClass = templateId === "creative" ? "bg-accent/5" : templateId === "compact" ? "bg-secondary/20" : "";
  return (
    <div className={`rounded-xl border border-border overflow-hidden min-h-[500px] bg-card p-5 text-foreground ${bgClass}`}>
      <h1 className="font-display text-xl font-bold">{name || "Your Name"}</h1>
      {jobTitle && <p className="text-xs text-primary mt-0.5">{jobTitle}</p>}
      <p className="text-[10px] text-muted-foreground mt-1">{[email, phone, address, linkedin, portfolio].filter(Boolean).join(" • ")}</p>
      {summary && <>{sectionTitle("Summary")}<p className="text-[11px] text-muted-foreground mt-1">{summary}</p></>}
      {experience.some(e => e.company) && <>{sectionTitle("Experience")}{renderExperience()}</>}
      {education.some(e => e.institution) && <>{sectionTitle("Education")}{renderEducation()}</>}
      {skills.length > 0 && <>{sectionTitle("Skills")}{renderSkillTags()}</>}
      {projects.some(p => p.name) && <>{sectionTitle("Projects")}{renderProjects()}</>}
      {certifications.some(c => c.name) && <>{sectionTitle("Certifications")}{renderCerts()}</>}
      {languages.length > 0 && <>{sectionTitle("Languages")}<p className="text-[11px] text-muted-foreground mt-1">{languages.join(", ")}</p></>}
    </div>
  );
}

interface ResumeData {
  name: string; jobTitle: string; email: string; phone: string; address: string; linkedin: string; portfolio: string; summary: string;
  experience: ExperienceEntry[]; education: EducationEntry[]; skills: string[]; projects: ProjectEntry[]; certifications: CertEntry[]; languages: string[];
}

export default function ResumeBuilderPage() {
  const [name, setName] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [portfolio, setPortfolio] = useState("");
  const [summary, setSummary] = useState("");
  const [experience, setExperience] = useState<ExperienceEntry[]>([{ company: "", jobTitle: "", startDate: "", endDate: "", description: "" }]);
  const [education, setEducation] = useState<EducationEntry[]>([{ institution: "", degree: "", startDate: "", endDate: "" }]);
  const [skills, setSkills] = useState<string[]>([]);
  const [projects, setProjects] = useState<ProjectEntry[]>([{ name: "", link: "", description: "" }]);
  const [certifications, setCertifications] = useState<CertEntry[]>([{ name: "", issuer: "", date: "" }]);
  const [languages, setLanguages] = useState<string[]>([]);
  const [activeTemplate, setActiveTemplate] = useState("professional");
  const [contentTab, setContentTab] = useState<"content" | "templates">("content");
  const [activeSection, setActiveSection] = useState<string>("Personal");
  const [expertEnquiry, setExpertEnquiry] = useState(false);
  const [expertName, setExpertName] = useState("");
  const previewRef = useRef<HTMLDivElement>(null);

  const resumeData: ResumeData = { name, jobTitle, email, phone, address, linkedin, portfolio, summary, experience, education, skills, projects, certifications, languages };

  const handleDownload = useCallback(async () => {
    if (!previewRef.current) return;
    const canvas = await html2canvas(previewRef.current, { scale: 2, useCORS: true });
    const link = document.createElement("a");
    link.download = `${name || "resume"}.png`;
    link.href = canvas.toDataURL();
    link.click();
  }, [name]);

  const renderSectionEditor = () => {
    switch (activeSection) {
      case "Personal":
        return (
          <div className="grid gap-3 sm:grid-cols-2">
            <div><Label>Full Name</Label><Input className="mt-1" value={name} onChange={e => setName(e.target.value)} /></div>
            <div><Label>Job Title</Label><Input className="mt-1" value={jobTitle} onChange={e => setJobTitle(e.target.value)} /></div>
            <div><Label>Email</Label><Input className="mt-1" type="email" value={email} onChange={e => setEmail(e.target.value)} /></div>
            <div><Label>Phone</Label><Input className="mt-1" value={phone} onChange={e => setPhone(e.target.value)} /><p className="mt-0.5 text-[10px] text-muted-foreground">Format: +61 4XX XXX XXX</p></div>
            <div><Label>Address</Label><Input className="mt-1" value={address} onChange={e => setAddress(e.target.value)} /></div>
            <div><Label>LinkedIn URL</Label><Input className="mt-1" value={linkedin} onChange={e => setLinkedin(e.target.value)} /></div>
            <div className="sm:col-span-2"><Label>Portfolio Website</Label><Input className="mt-1" value={portfolio} onChange={e => setPortfolio(e.target.value)} /></div>
            <div className="sm:col-span-2">
              <Label>Profile Summary</Label>
              <Textarea className="mt-1" value={summary} onChange={e => setSummary(e.target.value)} rows={3} />
              <p className="mt-0.5 text-[10px] text-muted-foreground">💡 Keep the summary concise and highlight your strongest professional achievements.</p>
            </div>
          </div>
        );
      case "Experience":
        return (
          <div className="space-y-3">
            <div className="flex items-center justify-between"><span className="text-sm font-medium">Work Experience</span><Button variant="ghost" size="sm" onClick={() => setExperience(p => [...p, { company: "", jobTitle: "", startDate: "", endDate: "", description: "" }])}><Plus className="h-4 w-4 mr-1" /> Add</Button></div>
            {experience.map((e, i) => (
              <div key={i} className="rounded-lg bg-secondary/30 p-3 space-y-2">
                <div className="flex justify-between items-start">
                  <span className="text-xs font-medium text-muted-foreground">Entry {i + 1}</span>
                  <Button variant="ghost" size="sm" onClick={() => setExperience(p => p.filter((_, j) => j !== i))}><Trash2 className="h-3.5 w-3.5" /></Button>
                </div>
                <div className="grid gap-2 sm:grid-cols-2">
                  <Input placeholder="Company Name" value={e.company} onChange={ev => { const n = [...experience]; n[i].company = ev.target.value; setExperience(n); }} />
                  <Input placeholder="Job Title" value={e.jobTitle} onChange={ev => { const n = [...experience]; n[i].jobTitle = ev.target.value; setExperience(n); }} />
                  <Input placeholder="Start Date" value={e.startDate} onChange={ev => { const n = [...experience]; n[i].startDate = ev.target.value; setExperience(n); }} />
                  <Input placeholder="End Date" value={e.endDate} onChange={ev => { const n = [...experience]; n[i].endDate = ev.target.value; setExperience(n); }} />
                </div>
                <Textarea placeholder="Description..." value={e.description} onChange={ev => { const n = [...experience]; n[i].description = ev.target.value; setExperience(n); }} rows={2} />
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
                <div className="flex justify-between items-start">
                  <span className="text-xs font-medium text-muted-foreground">Entry {i + 1}</span>
                  <Button variant="ghost" size="sm" onClick={() => setEducation(p => p.filter((_, j) => j !== i))}><Trash2 className="h-3.5 w-3.5" /></Button>
                </div>
                <div className="grid gap-2 sm:grid-cols-2">
                  <Input placeholder="Institution / University" value={e.institution} onChange={ev => { const n = [...education]; n[i].institution = ev.target.value; setEducation(n); }} />
                  <Input placeholder="Degree / Course" value={e.degree} onChange={ev => { const n = [...education]; n[i].degree = ev.target.value; setEducation(n); }} />
                  <Input placeholder="Start Date" value={e.startDate} onChange={ev => { const n = [...education]; n[i].startDate = ev.target.value; setEducation(n); }} />
                  <Input placeholder="End Date" value={e.endDate} onChange={ev => { const n = [...education]; n[i].endDate = ev.target.value; setEducation(n); }} />
                </div>
              </div>
            ))}
          </div>
        );
      case "Skills":
        return <div><Label className="mb-2 block">Skills</Label><TagInput tags={skills} setTags={setSkills} suggestions={skillSuggestions} placeholder="Search or type a skill..." /></div>;
      case "Projects":
        return (
          <div className="space-y-3">
            <div className="flex items-center justify-between"><span className="text-sm font-medium">Projects</span><Button variant="ghost" size="sm" onClick={() => setProjects(p => [...p, { name: "", link: "", description: "" }])}><Plus className="h-4 w-4 mr-1" /> Add</Button></div>
            {projects.map((p, i) => (
              <div key={i} className="rounded-lg bg-secondary/30 p-3 space-y-2">
                <div className="flex justify-between items-start">
                  <span className="text-xs font-medium text-muted-foreground">Project {i + 1}</span>
                  <Button variant="ghost" size="sm" onClick={() => setProjects(pr => pr.filter((_, j) => j !== i))}><Trash2 className="h-3.5 w-3.5" /></Button>
                </div>
                <Input placeholder="Project Name" value={p.name} onChange={ev => { const n = [...projects]; n[i].name = ev.target.value; setProjects(n); }} />
                <Input placeholder="Project Link (optional)" value={p.link} onChange={ev => { const n = [...projects]; n[i].link = ev.target.value; setProjects(n); }} />
                <Textarea placeholder="Description..." value={p.description} onChange={ev => { const n = [...projects]; n[i].description = ev.target.value; setProjects(n); }} rows={2} />
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
                <div className="flex justify-between items-start">
                  <span className="text-xs font-medium text-muted-foreground">Cert {i + 1}</span>
                  <Button variant="ghost" size="sm" onClick={() => setCertifications(p => p.filter((_, j) => j !== i))}><Trash2 className="h-3.5 w-3.5" /></Button>
                </div>
                <Input placeholder="Certification Name" value={c.name} onChange={ev => { const n = [...certifications]; n[i].name = ev.target.value; setCertifications(n); }} />
                <Input placeholder="Issuer" value={c.issuer} onChange={ev => { const n = [...certifications]; n[i].issuer = ev.target.value; setCertifications(n); }} />
                <Input placeholder="Date" value={c.date} onChange={ev => { const n = [...certifications]; n[i].date = ev.target.value; setCertifications(n); }} />
              </div>
            ))}
          </div>
        );
      case "Languages":
        return <div><Label className="mb-2 block">Languages</Label><TagInput tags={languages} setTags={setLanguages} suggestions={langSuggestions} placeholder="Search or type a language..." /></div>;
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
            <div className="space-y-4">
              <div className="flex gap-2">
                <Button variant={contentTab === "content" ? "default" : "outline"} size="sm" onClick={() => setContentTab("content")}>Content</Button>
                <Button variant={contentTab === "templates" ? "default" : "outline"} size="sm" onClick={() => setContentTab("templates")}>Templates ({templates.length})</Button>
              </div>
              {contentTab === "templates" ? (
                <div className="grid gap-2 sm:grid-cols-2">
                  {templates.map(t => (
                    <motion.div key={t.id} whileHover={{ scale: 1.02 }} onClick={() => setActiveTemplate(t.id)}
                      className={`cursor-pointer rounded-xl border p-3 transition-all ${activeTemplate === t.id ? "border-primary bg-primary/5 shadow-card" : "border-border bg-card hover:shadow-card"}`}>
                      <h3 className="font-display text-sm font-bold">{t.name}</h3>
                      <p className="text-[11px] text-muted-foreground">{t.desc}</p>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="rounded-xl border border-border bg-card p-4 shadow-card space-y-4">
                  <div className="flex flex-wrap gap-1">
                    {contentSections.map(s => (
                      <button key={s} onClick={() => setActiveSection(s)}
                        className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${activeSection === s ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground hover:text-foreground"}`}>{s}</button>
                    ))}
                  </div>
                  {renderSectionEditor()}
                </div>
              )}
            </div>

            <div className="print:shadow-none">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-display text-sm font-bold">Live Preview — {templates.find(t => t.id === activeTemplate)?.name}</h3>
                <Button size="sm" onClick={handleDownload}><Download className="h-4 w-4 mr-1" /> Download</Button>
              </div>
              <div ref={previewRef}>
                <TemplatePreview templateId={activeTemplate} data={resumeData} />
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="expert" className="mt-4">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {experts.map(e => (
              <div key={e.id} className="rounded-xl border border-border bg-card p-5 shadow-card transition-all hover:shadow-card-hover">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">{e.photo}</div>
                  <div>
                    <h3 className="font-display text-sm font-bold">{e.name}</h3>
                    <p className="text-xs text-muted-foreground">{e.experience} experience</p>
                  </div>
                </div>
                <div className="mt-3 flex items-center gap-1 text-xs"><Star className="h-3 w-3 fill-primary text-primary" /><span className="font-medium">{e.rating}</span></div>
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
