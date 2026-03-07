import type { ResumeData } from "@/types/resume";

// --- Shared helpers ---
const Section = ({ title, color = "#0d9488" }: { title: string; color?: string }) => (
  <h2 style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color, borderBottom: `1px solid ${color}33`, paddingBottom: 2, marginTop: 14, marginBottom: 4 }}>{title}</h2>
);

const ExpBlock = ({ e }: { e: ResumeData["experience"][0] }) => (
  <div style={{ marginTop: 6 }}>
    <div style={{ fontSize: 11, fontWeight: 600 }}>{e.jobTitle}</div>
    <div style={{ fontSize: 10, color: "#0d9488" }}>{e.company}{e.startDate && ` | ${e.startDate} – ${e.endDate || "Present"}`}</div>
    {e.description && <p style={{ fontSize: 10, color: "#666", marginTop: 2 }}>{e.description}</p>}
  </div>
);

const EduBlock = ({ e }: { e: ResumeData["education"][0] }) => (
  <div style={{ marginTop: 4 }}>
    <div style={{ fontSize: 11, fontWeight: 600 }}>{e.degree}</div>
    <div style={{ fontSize: 10, color: "#666" }}>{e.institution}{e.startDate && ` · ${e.startDate} – ${e.endDate}`}</div>
  </div>
);

const SkillTags = ({ skills, bg = "#0d948815", color = "#0d9488" }: { skills: string[]; bg?: string; color?: string }) => (
  <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginTop: 4 }}>
    {skills.map(s => <span key={s} style={{ fontSize: 9, padding: "2px 8px", borderRadius: 4, background: bg, color }}>{s}</span>)}
  </div>
);

const ProjBlock = ({ p }: { p: ResumeData["projects"][0] }) => (
  <div style={{ marginTop: 4 }}>
    <div style={{ fontSize: 11, fontWeight: 600 }}>{p.name}</div>
    {p.link && <div style={{ fontSize: 9, color: "#0d9488" }}>{p.link}</div>}
    {p.description && <p style={{ fontSize: 10, color: "#666", marginTop: 1 }}>{p.description}</p>}
  </div>
);

const CertBlock = ({ c }: { c: ResumeData["certifications"][0] }) => (
  <div style={{ marginTop: 4 }}>
    <div style={{ fontSize: 11, fontWeight: 600 }}>{c.name}</div>
    <div style={{ fontSize: 9, color: "#666" }}>{c.issuer}{c.date && ` · ${c.date}`}</div>
  </div>
);

// ============================
// TEMPLATE: Professional
// ============================
export function ProfessionalTemplate({ data }: { data: ResumeData }) {
  return (
    <div style={{ width: 816, minHeight: 1056, background: "#fff", color: "#1a1a2e", padding: 40, fontFamily: "'Inter', sans-serif", fontSize: 11 }}>
      <h1 style={{ fontSize: 26, fontWeight: 700, color: "#0d9488" }}>{data.name || "Your Name"}</h1>
      {data.jobTitle && <p style={{ fontSize: 13, color: "#0d9488", marginTop: 2 }}>{data.jobTitle}</p>}
      <p style={{ fontSize: 10, color: "#666", marginTop: 4 }}>{[data.email, data.phone, data.address, data.linkedin, data.portfolio].filter(Boolean).join(" • ")}</p>
      {data.summary && <><Section title="Summary" /><p style={{ fontSize: 10, color: "#666", marginTop: 4 }}>{data.summary}</p></>}
      {data.experience.some(e => e.company) && <><Section title="Experience" />{data.experience.filter(e => e.company).map((e, i) => <ExpBlock key={i} e={e} />)}</>}
      {data.education.some(e => e.institution) && <><Section title="Education" />{data.education.filter(e => e.institution).map((e, i) => <EduBlock key={i} e={e} />)}</>}
      {data.skills.length > 0 && <><Section title="Skills" /><SkillTags skills={data.skills} /></>}
      {data.projects.some(p => p.name) && <><Section title="Projects" />{data.projects.filter(p => p.name).map((p, i) => <ProjBlock key={i} p={p} />)}</>}
      {data.certifications.some(c => c.name) && <><Section title="Certifications" />{data.certifications.filter(c => c.name).map((c, i) => <CertBlock key={i} c={c} />)}</>}
      {data.languages.length > 0 && <><Section title="Languages" /><p style={{ fontSize: 10, color: "#666", marginTop: 4 }}>{data.languages.join(", ")}</p></>}
    </div>
  );
}

// ============================
// TEMPLATE: Creative
// ============================
export function CreativeTemplate({ data }: { data: ResumeData }) {
  const accent = "#e85d04";
  return (
    <div style={{ width: 816, minHeight: 1056, background: "#fff", color: "#1a1a2e", fontFamily: "'Inter', sans-serif", fontSize: 11 }}>
      <div style={{ background: accent, color: "#fff", padding: "30px 40px" }}>
        <h1 style={{ fontSize: 28, fontWeight: 800 }}>{data.name || "Your Name"}</h1>
        <p style={{ fontSize: 14, opacity: 0.9, marginTop: 2 }}>{data.jobTitle || "Job Title"}</p>
        <p style={{ fontSize: 10, opacity: 0.7, marginTop: 4 }}>{[data.email, data.phone, data.address].filter(Boolean).join(" | ")}</p>
      </div>
      <div style={{ padding: "24px 40px" }}>
        {data.summary && <><Section title="About Me" color={accent} /><p style={{ fontSize: 10, color: "#666", marginTop: 4 }}>{data.summary}</p></>}
        {data.experience.some(e => e.company) && <><Section title="Experience" color={accent} />{data.experience.filter(e => e.company).map((e, i) => <ExpBlock key={i} e={e} />)}</>}
        <div style={{ display: "flex", gap: 30, marginTop: 14 }}>
          <div style={{ flex: 1 }}>
            {data.education.some(e => e.institution) && <><Section title="Education" color={accent} />{data.education.filter(e => e.institution).map((e, i) => <EduBlock key={i} e={e} />)}</>}
            {data.projects.some(p => p.name) && <><Section title="Projects" color={accent} />{data.projects.filter(p => p.name).map((p, i) => <ProjBlock key={i} p={p} />)}</>}
          </div>
          <div style={{ flex: 1 }}>
            {data.skills.length > 0 && <><Section title="Skills" color={accent} /><SkillTags skills={data.skills} bg="#e85d0415" color={accent} /></>}
            {data.languages.length > 0 && <><Section title="Languages" color={accent} /><p style={{ fontSize: 10, color: "#666", marginTop: 4 }}>{data.languages.join(", ")}</p></>}
            {data.certifications.some(c => c.name) && <><Section title="Certifications" color={accent} />{data.certifications.filter(c => c.name).map((c, i) => <CertBlock key={i} c={c} />)}</>}
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================
// TEMPLATE: Minimal
// ============================
export function MinimalTemplate({ data }: { data: ResumeData }) {
  return (
    <div style={{ width: 816, minHeight: 1056, background: "#fff", color: "#333", padding: 48, fontFamily: "'Inter', sans-serif", fontSize: 11 }}>
      <h1 style={{ fontSize: 22, fontWeight: 600, color: "#111" }}>{data.name || "Your Name"}</h1>
      <p style={{ fontSize: 10, color: "#999", marginTop: 4 }}>{[data.jobTitle, data.email, data.phone, data.address].filter(Boolean).join(" · ")}</p>
      <div style={{ width: 40, height: 1, background: "#ddd", margin: "16px 0" }} />
      {data.summary && <p style={{ fontSize: 10, color: "#666", lineHeight: 1.6 }}>{data.summary}</p>}
      {data.experience.some(e => e.company) && <><h2 style={{ fontSize: 11, fontWeight: 600, marginTop: 20, color: "#111" }}>EXPERIENCE</h2>{data.experience.filter(e => e.company).map((e, i) => <div key={i} style={{ marginTop: 8 }}><div style={{ display: "flex", justifyContent: "space-between" }}><span style={{ fontWeight: 600, fontSize: 11 }}>{e.jobTitle}</span><span style={{ fontSize: 9, color: "#999" }}>{e.startDate} – {e.endDate || "Present"}</span></div><div style={{ fontSize: 10, color: "#666" }}>{e.company}</div>{e.description && <p style={{ fontSize: 10, color: "#888", marginTop: 2 }}>{e.description}</p>}</div>)}</>}
      {data.education.some(e => e.institution) && <><h2 style={{ fontSize: 11, fontWeight: 600, marginTop: 20, color: "#111" }}>EDUCATION</h2>{data.education.filter(e => e.institution).map((e, i) => <div key={i} style={{ marginTop: 6 }}><div style={{ fontWeight: 600, fontSize: 11 }}>{e.degree}</div><div style={{ fontSize: 10, color: "#666" }}>{e.institution} · {e.startDate} – {e.endDate}</div></div>)}</>}
      {data.skills.length > 0 && <><h2 style={{ fontSize: 11, fontWeight: 600, marginTop: 20, color: "#111" }}>SKILLS</h2><p style={{ fontSize: 10, color: "#666", marginTop: 4 }}>{data.skills.join(" · ")}</p></>}
      {data.languages.length > 0 && <><h2 style={{ fontSize: 11, fontWeight: 600, marginTop: 20, color: "#111" }}>LANGUAGES</h2><p style={{ fontSize: 10, color: "#666", marginTop: 4 }}>{data.languages.join(", ")}</p></>}
    </div>
  );
}

// ============================
// TEMPLATE: Tech (Code-Inspired)
// ============================
export function TechTemplate({ data }: { data: ResumeData }) {
  return (
    <div style={{ width: 816, minHeight: 1056, background: "#0d1b2a", color: "#c9d1d9", fontFamily: "'Courier New', monospace", fontSize: 11 }}>
      <div style={{ padding: "24px 32px" }}>
        <p style={{ fontSize: 10, color: "#58a6ff" }}>import Profile from './{(data.name || "YourName").replace(/\s/g, "")}';</p>
        <h1 style={{ fontSize: 24, fontWeight: 700, color: "#58a6ff", marginTop: 4 }}>{data.name || "Your Name"}</h1>
        <p style={{ color: "#8b949e" }}>// {data.jobTitle || "Job Title"}</p>
        <p style={{ color: "#8b949e", marginTop: 4, fontSize: 10 }}>const contact = {`{ email: "${data.email || "email"}", phone: "${data.phone || "phone"}" }`};</p>
      </div>
      <div style={{ display: "flex" }}>
        <div style={{ flex: 1, padding: "0 32px 32px" }}>
          {data.summary && <><p style={{ color: "#58a6ff", fontSize: 10 }}>/** @summary */</p><p style={{ fontSize: 10, color: "#8b949e", marginTop: 4 }}>{data.summary}</p></>}
          {data.experience.some(e => e.company) && <>
            <p style={{ color: "#58a6ff", marginTop: 14, fontSize: 10 }}>class Experience extends Career {"{"}</p>
            {data.experience.filter(e => e.company).map((e, i) => (
              <div key={i} style={{ marginLeft: 16, marginTop: 8 }}>
                <p style={{ fontWeight: 700 }}>{e.jobTitle}() {"{"}</p>
                <p style={{ marginLeft: 16, color: "#e3b341" }}>company: "{e.company}",</p>
                <p style={{ marginLeft: 16, color: "#e3b341" }}>duration: "{e.startDate} – {e.endDate || "Present"}",</p>
                {e.description && <p style={{ marginLeft: 16, color: "#8b949e" }}>/* {e.description} */</p>}
                <p>{"}"}</p>
              </div>
            ))}
            <p>{"}"}</p>
          </>}
          {data.projects.some(p => p.name) && <>
            <p style={{ color: "#58a6ff", marginTop: 14, fontSize: 10 }}>const Projects = [</p>
            {data.projects.filter(p => p.name).map((p, i) => <p key={i} style={{ marginLeft: 16 }}>{"{"} name: <span style={{ color: "#e3b341" }}>"{p.name}"</span>, desc: "{p.description}" {"}"},</p>)}
            <p>];</p>
          </>}
        </div>
        <div style={{ width: "35%", padding: "0 24px 32px" }}>
          {data.skills.length > 0 && <div style={{ background: "#161b22", borderRadius: 8, padding: 12, marginBottom: 12 }}><p style={{ fontSize: 10, color: "#58a6ff", marginBottom: 4 }}>package.json</p>{data.skills.map(s => <p key={s} style={{ fontSize: 10 }}>"{s}": "^latest",</p>)}</div>}
          {data.languages.length > 0 && <div style={{ background: "#161b22", borderRadius: 8, padding: 12, marginBottom: 12 }}><p style={{ fontSize: 10, color: "#58a6ff", marginBottom: 4 }}>i18n.config</p><p style={{ fontSize: 10 }}>languages: [{data.languages.map(l => `"${l}"`).join(", ")}]</p></div>}
          {data.education.some(e => e.institution) && <div style={{ background: "#161b22", borderRadius: 8, padding: 12, marginBottom: 12 }}><p style={{ fontSize: 10, color: "#58a6ff", marginBottom: 4 }}>education</p>{data.education.filter(e => e.institution).map((e, i) => <div key={i}><p style={{ fontSize: 10, fontWeight: 700 }}>{e.degree}</p><p style={{ fontSize: 10, color: "#8b949e" }}>{e.institution}</p></div>)}</div>}
          {data.certifications.some(c => c.name) && <div style={{ background: "#161b22", borderRadius: 8, padding: 12 }}><p style={{ fontSize: 10, color: "#58a6ff", marginBottom: 4 }}>certificates</p>{data.certifications.filter(c => c.name).map((c, i) => <p key={i} style={{ fontSize: 10 }}>&gt; {c.name}</p>)}</div>}
        </div>
      </div>
    </div>
  );
}

// ============================
// TEMPLATE: Executive
// ============================
export function ExecutiveTemplate({ data }: { data: ResumeData }) {
  return (
    <div style={{ width: 816, minHeight: 1056, background: "#fff", color: "#1a1a2e", fontFamily: "'Georgia', serif", fontSize: 11 }}>
      <div style={{ background: "#f8f9fa", padding: "32px 40px", textAlign: "center" }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, letterSpacing: 4, color: "#1a365d" }}>{(data.name || "YOUR NAME").toUpperCase()}</h1>
        <div style={{ width: 40, height: 2, background: "#1a365d", margin: "8px auto" }} />
        <p style={{ fontSize: 12, fontStyle: "italic", color: "#666" }}>{data.jobTitle || "Job Title"}</p>
        <p style={{ fontSize: 10, color: "#888", marginTop: 4 }}>{[data.email, data.phone].filter(Boolean).join(" • ")}</p>
      </div>
      <div style={{ padding: "24px 40px" }}>
        {data.summary && <><h2 style={{ fontSize: 11, fontWeight: 700, letterSpacing: 3, textAlign: "center", color: "#1a365d" }}>PROFESSIONAL PROFILE</h2><p style={{ fontSize: 10, color: "#666", textAlign: "center", marginTop: 6 }}>{data.summary}</p></>}
        {data.experience.some(e => e.company) && <>
          <h2 style={{ fontSize: 11, fontWeight: 700, letterSpacing: 3, textAlign: "center", color: "#1a365d", marginTop: 20 }}>CAREER HISTORY</h2>
          {data.experience.filter(e => e.company).map((e, i) => (
            <div key={i} style={{ marginTop: 10 }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}><span style={{ fontWeight: 700, fontSize: 11 }}>{e.jobTitle}</span><span style={{ fontSize: 9, color: "#888", fontStyle: "italic" }}>{e.startDate} — {e.endDate || "Present"}</span></div>
              <div style={{ fontSize: 11, fontWeight: 700, color: "#1a365d" }}>{e.company}</div>
              {e.description && <p style={{ fontSize: 10, color: "#666", marginTop: 3 }}>{e.description}</p>}
            </div>
          ))}
        </>}
        <div style={{ display: "flex", gap: 30, marginTop: 20 }}>
          <div style={{ flex: 1 }}>
            {data.skills.length > 0 && <><h2 style={{ fontSize: 11, fontWeight: 700, letterSpacing: 3, color: "#1a365d" }}>CORE EXPERTISE</h2><div style={{ marginTop: 4 }}>{data.skills.map(s => <div key={s} style={{ fontSize: 10 }}>• {s}</div>)}</div></>}
          </div>
          <div style={{ flex: 1 }}>
            {data.education.some(e => e.institution) && <><h2 style={{ fontSize: 11, fontWeight: 700, letterSpacing: 3, color: "#1a365d" }}>EDUCATION</h2>{data.education.filter(e => e.institution).map((e, i) => <EduBlock key={i} e={e} />)}</>}
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================
// TEMPLATE: Bold (sidebar header)
// ============================
export function BoldTemplate({ data }: { data: ResumeData }) {
  return (
    <div style={{ width: 816, minHeight: 1056, background: "#fff", color: "#1a1a2e", fontFamily: "'Inter', sans-serif", fontSize: 11 }}>
      <div style={{ background: "#dc2626", color: "#fff", padding: "24px 32px" }}>
        <h1 style={{ fontSize: 26, fontWeight: 800 }}>{data.name || "Your Name"}</h1>
        <p style={{ fontSize: 13, opacity: 0.85, marginTop: 2 }}>{data.jobTitle || "Job Title"}</p>
      </div>
      <div style={{ display: "flex" }}>
        <div style={{ width: "35%", background: "#fef2f2", padding: 20 }}>
          <h3 style={{ fontSize: 10, fontWeight: 700, color: "#dc2626", letterSpacing: 1 }}>CONTACT</h3>
          {data.email && <p style={{ fontSize: 10, color: "#666", marginTop: 4 }}>{data.email}</p>}
          {data.phone && <p style={{ fontSize: 10, color: "#666" }}>{data.phone}</p>}
          {data.address && <p style={{ fontSize: 10, color: "#666" }}>{data.address}</p>}
          {data.education.some(e => e.institution) && <><h3 style={{ fontSize: 10, fontWeight: 700, color: "#dc2626", letterSpacing: 1, marginTop: 16 }}>EDUCATION</h3>{data.education.filter(e => e.institution).map((e, i) => <EduBlock key={i} e={e} />)}</>}
          {data.skills.length > 0 && <><h3 style={{ fontSize: 10, fontWeight: 700, color: "#dc2626", letterSpacing: 1, marginTop: 16 }}>SKILLS</h3><SkillTags skills={data.skills} bg="#dc262615" color="#dc2626" /></>}
          {data.languages.length > 0 && <><h3 style={{ fontSize: 10, fontWeight: 700, color: "#dc2626", letterSpacing: 1, marginTop: 16 }}>LANGUAGES</h3><p style={{ fontSize: 10, color: "#666", marginTop: 4 }}>{data.languages.join(", ")}</p></>}
          {data.certifications.some(c => c.name) && <><h3 style={{ fontSize: 10, fontWeight: 700, color: "#dc2626", letterSpacing: 1, marginTop: 16 }}>CERTIFICATIONS</h3>{data.certifications.filter(c => c.name).map((c, i) => <CertBlock key={i} c={c} />)}</>}
        </div>
        <div style={{ flex: 1, padding: 24 }}>
          {data.summary && <><Section title="Profile" color="#dc2626" /><p style={{ fontSize: 10, color: "#666", marginTop: 4 }}>{data.summary}</p></>}
          {data.experience.some(e => e.company) && <><Section title="Experience" color="#dc2626" />{data.experience.filter(e => e.company).map((e, i) => <ExpBlock key={i} e={e} />)}</>}
          {data.projects.some(p => p.name) && <><Section title="Projects" color="#dc2626" />{data.projects.filter(p => p.name).map((p, i) => <ProjBlock key={i} p={p} />)}</>}
        </div>
      </div>
    </div>
  );
}

// ============================
// TEMPLATE: Student
// ============================
export function StudentTemplate({ data }: { data: ResumeData }) {
  return (
    <div style={{ width: 816, minHeight: 1056, background: "#fff", color: "#1a1a2e", padding: 40, fontFamily: "'Inter', sans-serif", fontSize: 11 }}>
      <div style={{ textAlign: "center", borderBottom: "2px solid #0d9488", paddingBottom: 12 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, color: "#0d9488" }}>{data.name || "Your Name"}</h1>
        <p style={{ fontSize: 10, color: "#666", marginTop: 4 }}>{[data.address, data.email, data.phone].filter(Boolean).join(" | ")}</p>
      </div>
      <div style={{ marginTop: 16 }}>
        {data.education.some(e => e.institution) && <><Section title="Education" />{data.education.filter(e => e.institution).map((e, i) => <EduBlock key={i} e={e} />)}</>}
        {data.skills.length > 0 && <><Section title="Related Coursework & Skills" /><p style={{ fontSize: 10, marginTop: 4 }}><strong>Skills:</strong> {data.skills.join(", ")}</p>{data.languages.length > 0 && <p style={{ fontSize: 10 }}><strong>Languages:</strong> {data.languages.join(", ")}</p>}</>}
        {data.certifications.some(c => c.name) && <><Section title="Certifications" />{data.certifications.filter(c => c.name).map((c, i) => <CertBlock key={i} c={c} />)}</>}
        {data.experience.some(e => e.company) && <><Section title="Experience & Internships" />{data.experience.filter(e => e.company).map((e, i) => <ExpBlock key={i} e={e} />)}</>}
        {data.projects.some(p => p.name) && <><Section title="Projects" />{data.projects.filter(p => p.name).map((p, i) => <ProjBlock key={i} p={p} />)}</>}
        {data.summary && <><Section title="Summary" /><p style={{ fontSize: 10, color: "#666", marginTop: 4 }}>{data.summary}</p></>}
      </div>
    </div>
  );
}

// ============================
// TEMPLATE: Energetic (sidebar)
// ============================
export function EnergeticTemplate({ data }: { data: ResumeData }) {
  const accent = "#f97316";
  return (
    <div style={{ width: 816, minHeight: 1056, background: "#fff", color: "#1a1a2e", fontFamily: "'Inter', sans-serif", fontSize: 11 }}>
      <div style={{ background: accent, color: "#fff", padding: "24px 32px" }}>
        <h1 style={{ fontSize: 26, fontWeight: 800 }}>{data.name || "Your Name"}</h1>
        <p style={{ fontSize: 13, opacity: 0.85 }}>{data.jobTitle || "Job Title"}</p>
      </div>
      <div style={{ display: "flex" }}>
        <div style={{ width: "35%", background: "#fff7ed", padding: 20 }}>
          <h3 style={{ fontSize: 10, fontWeight: 700, color: accent, letterSpacing: 1 }}>CONTACT</h3>
          {data.email && <p style={{ fontSize: 10, color: "#666", marginTop: 4 }}>{data.email}</p>}
          {data.phone && <p style={{ fontSize: 10, color: "#666" }}>{data.phone}</p>}
          {data.address && <p style={{ fontSize: 10, color: "#666" }}>{data.address}</p>}
          {data.education.some(e => e.institution) && <><h3 style={{ fontSize: 10, fontWeight: 700, color: accent, letterSpacing: 1, marginTop: 16 }}>EDUCATION</h3>{data.education.filter(e => e.institution).map((e, i) => <EduBlock key={i} e={e} />)}</>}
          {data.skills.length > 0 && <><h3 style={{ fontSize: 10, fontWeight: 700, color: accent, letterSpacing: 1, marginTop: 16 }}>SKILLS</h3><SkillTags skills={data.skills} bg="#f9731615" color={accent} /></>}
          {data.languages.length > 0 && <><h3 style={{ fontSize: 10, fontWeight: 700, color: accent, letterSpacing: 1, marginTop: 16 }}>LANGUAGES</h3><p style={{ fontSize: 10, color: "#666", marginTop: 4 }}>{data.languages.join(", ")}</p></>}
        </div>
        <div style={{ flex: 1, padding: 24 }}>
          {data.summary && <><Section title="Profile" color={accent} /><p style={{ fontSize: 10, color: "#666", marginTop: 4 }}>{data.summary}</p></>}
          {data.experience.some(e => e.company) && <><Section title="Experience" color={accent} />{data.experience.filter(e => e.company).map((e, i) => <ExpBlock key={i} e={e} />)}</>}
          {data.projects.some(p => p.name) && <><Section title="Projects" color={accent} />{data.projects.filter(p => p.name).map((p, i) => <ProjBlock key={i} p={p} />)}</>}
          {data.certifications.some(c => c.name) && <><Section title="Certifications" color={accent} />{data.certifications.filter(c => c.name).map((c, i) => <CertBlock key={i} c={c} />)}</>}
        </div>
      </div>
    </div>
  );
}

// ============================
// TEMPLATE: Elegant (centered, serif)
// ============================
export function ElegantTemplate({ data }: { data: ResumeData }) {
  return (
    <div style={{ width: 816, minHeight: 1056, background: "#fff", color: "#1a1a2e", padding: 40, fontFamily: "'Georgia', serif", fontSize: 11 }}>
      <div style={{ textAlign: "center" }}>
        <h1 style={{ fontSize: 26, fontWeight: 700, fontStyle: "italic", color: "#6b21a8" }}>{data.name || "Your Name"}</h1>
        <div style={{ width: 40, height: 2, background: "#6b21a8", margin: "6px auto" }} />
        <p style={{ fontSize: 12, fontStyle: "italic", color: "#666" }}>{data.jobTitle || "Job Title"}</p>
        <p style={{ fontSize: 10, color: "#888", marginTop: 4 }}>{[data.email, data.phone, data.address].filter(Boolean).join(" | ")}</p>
      </div>
      {data.summary && <><h2 style={{ fontSize: 11, fontWeight: 700, letterSpacing: 3, textAlign: "center", color: "#6b21a8", marginTop: 20 }}>PROFILE</h2><p style={{ fontSize: 10, color: "#666", textAlign: "center", marginTop: 6 }}>{data.summary}</p></>}
      {data.experience.some(e => e.company) && <>
        <h2 style={{ fontSize: 11, fontWeight: 700, letterSpacing: 3, textAlign: "center", color: "#6b21a8", marginTop: 20 }}>EXPERIENCE</h2>
        {data.experience.filter(e => e.company).map((e, i) => (
          <div key={i} style={{ marginTop: 8, borderLeft: "2px solid #6b21a830", paddingLeft: 12 }}>
            <div style={{ fontWeight: 700, fontSize: 11, color: "#6b21a8" }}>{e.jobTitle}</div>
            <div style={{ fontSize: 10, fontStyle: "italic", color: "#666" }}>{e.company} — {e.startDate} to {e.endDate || "Present"}</div>
            {e.description && <p style={{ fontSize: 10, color: "#666", marginTop: 2 }}>{e.description}</p>}
          </div>
        ))}
      </>}
      <div style={{ display: "flex", gap: 30, marginTop: 20 }}>
        <div style={{ flex: 1, textAlign: "center" }}>{data.education.some(e => e.institution) && <><h2 style={{ fontSize: 11, fontWeight: 700, letterSpacing: 3, color: "#6b21a8" }}>EDUCATION</h2>{data.education.filter(e => e.institution).map((e, i) => <EduBlock key={i} e={e} />)}</>}</div>
        <div style={{ flex: 1, textAlign: "center" }}>{data.skills.length > 0 && <><h2 style={{ fontSize: 11, fontWeight: 700, letterSpacing: 3, color: "#6b21a8" }}>SKILLS</h2><SkillTags skills={data.skills} bg="#6b21a815" color="#6b21a8" /></>}</div>
      </div>
    </div>
  );
}

// ============================
// TEMPLATE: Sidekick (sidebar left)
// ============================
export function SidekickTemplate({ data }: { data: ResumeData }) {
  return (
    <div style={{ width: 816, minHeight: 1056, background: "#fff", color: "#1a1a2e", fontFamily: "'Inter', sans-serif", fontSize: 11, display: "flex" }}>
      <div style={{ width: "35%", background: "#f0fdf4", padding: 24, borderRight: "1px solid #e5e7eb" }}>
        <h1 style={{ fontSize: 20, fontWeight: 700, color: "#0d9488" }}>{data.name || "Your Name"}</h1>
        <p style={{ fontSize: 10, color: "#0d9488", marginTop: 2 }}>{data.jobTitle || "Job Title"}</p>
        <h3 style={{ fontSize: 10, fontWeight: 700, color: "#0d9488", letterSpacing: 1, marginTop: 20 }}>CONTACT</h3>
        {data.email && <p style={{ fontSize: 10, color: "#666", marginTop: 4 }}>{data.email}</p>}
        {data.phone && <p style={{ fontSize: 10, color: "#666" }}>{data.phone}</p>}
        {data.address && <p style={{ fontSize: 10, color: "#666" }}>{data.address}</p>}
        {data.linkedin && <p style={{ fontSize: 10, color: "#666" }}>{data.linkedin}</p>}
        {data.education.some(e => e.institution) && <><h3 style={{ fontSize: 10, fontWeight: 700, color: "#0d9488", letterSpacing: 1, marginTop: 16 }}>EDUCATION</h3>{data.education.filter(e => e.institution).map((e, i) => <EduBlock key={i} e={e} />)}</>}
        {data.skills.length > 0 && <><h3 style={{ fontSize: 10, fontWeight: 700, color: "#0d9488", letterSpacing: 1, marginTop: 16 }}>SKILLS</h3><SkillTags skills={data.skills} /></>}
        {data.languages.length > 0 && <><h3 style={{ fontSize: 10, fontWeight: 700, color: "#0d9488", letterSpacing: 1, marginTop: 16 }}>LANGUAGES</h3><p style={{ fontSize: 10, color: "#666", marginTop: 4 }}>{data.languages.join(", ")}</p></>}
        {data.certifications.some(c => c.name) && <><h3 style={{ fontSize: 10, fontWeight: 700, color: "#0d9488", letterSpacing: 1, marginTop: 16 }}>CERTIFICATIONS</h3>{data.certifications.filter(c => c.name).map((c, i) => <CertBlock key={i} c={c} />)}</>}
      </div>
      <div style={{ flex: 1, padding: 28 }}>
        {data.summary && <><Section title="Profile" /><p style={{ fontSize: 10, color: "#666", marginTop: 4 }}>{data.summary}</p></>}
        {data.experience.some(e => e.company) && <><Section title="Experience" />{data.experience.filter(e => e.company).map((e, i) => <ExpBlock key={i} e={e} />)}</>}
        {data.projects.some(p => p.name) && <><Section title="Projects" />{data.projects.filter(p => p.name).map((p, i) => <ProjBlock key={i} p={p} />)}</>}
      </div>
    </div>
  );
}

// ============================
// TEMPLATE: Grid
// ============================
export function GridTemplate({ data }: { data: ResumeData }) {
  return (
    <div style={{ width: 816, minHeight: 1056, background: "#fff", color: "#1a1a2e", padding: 36, fontFamily: "'Inter', sans-serif", fontSize: 11 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div><h1 style={{ fontSize: 24, fontWeight: 700 }}>{data.name || "Your Name"}</h1><p style={{ fontSize: 12, color: "#0d9488" }}>{data.jobTitle || "Job Title"}</p></div>
        <div style={{ textAlign: "right", fontSize: 10, color: "#666" }}><p>{data.email}</p><p>{data.phone}</p><p>{data.address}</p></div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginTop: 20 }}>
        <div>
          {data.summary && <><div style={{ display: "flex", alignItems: "center", gap: 4 }}><div style={{ width: 16, height: 2, background: "#0d9488" }} /><h2 style={{ fontSize: 11, fontWeight: 700, color: "#0d9488" }}>Profile</h2></div><p style={{ fontSize: 10, color: "#666", marginTop: 4 }}>{data.summary}</p></>}
          {data.experience.some(e => e.company) && <><div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 14 }}><div style={{ width: 16, height: 2, background: "#0d9488" }} /><h2 style={{ fontSize: 11, fontWeight: 700, color: "#0d9488" }}>Experience</h2></div>{data.experience.filter(e => e.company).map((e, i) => <ExpBlock key={i} e={e} />)}</>}
        </div>
        <div>
          {data.education.some(e => e.institution) && <><div style={{ display: "flex", alignItems: "center", gap: 4 }}><div style={{ width: 16, height: 2, background: "#0d9488" }} /><h2 style={{ fontSize: 11, fontWeight: 700, color: "#0d9488" }}>Education</h2></div>{data.education.filter(e => e.institution).map((e, i) => <div key={i} style={{ background: "#f0fdf4", borderRadius: 6, padding: 8, marginTop: 4 }}><div style={{ fontSize: 11, fontWeight: 600 }}>{e.degree}</div><div style={{ fontSize: 10, color: "#666" }}>{e.institution}</div></div>)}</>}
          {data.skills.length > 0 && <><div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 14 }}><div style={{ width: 16, height: 2, background: "#0d9488" }} /><h2 style={{ fontSize: 11, fontWeight: 700, color: "#0d9488" }}>Skills</h2></div><SkillTags skills={data.skills} /></>}
          {data.projects.some(p => p.name) && <><div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 14 }}><div style={{ width: 16, height: 2, background: "#0d9488" }} /><h2 style={{ fontSize: 11, fontWeight: 700, color: "#0d9488" }}>Projects</h2></div>{data.projects.filter(p => p.name).map((p, i) => <ProjBlock key={i} p={p} />)}</>}
        </div>
      </div>
    </div>
  );
}

// ============================
// TEMPLATE: Executive Elite
// ============================
export function ExecutiveEliteTemplate({ data }: { data: ResumeData }) {
  return (
    <div style={{ width: 816, minHeight: 1056, background: "#fff", color: "#1a1a2e", fontFamily: "'Georgia', serif", fontSize: 11 }}>
      <div style={{ background: "#1e293b", color: "#fff", padding: "36px 40px", textAlign: "center" }}>
        <h1 style={{ fontSize: 26, fontWeight: 700, letterSpacing: 6 }}>{(data.name || "YOUR NAME").toUpperCase()}</h1>
        <div style={{ width: 50, height: 2, background: "#c4a747", margin: "8px auto" }} />
        <p style={{ fontSize: 12, color: "#c4a747", marginTop: 4 }}>{data.jobTitle || "Job Title"}</p>
        <p style={{ fontSize: 10, color: "#94a3b8", marginTop: 6 }}>{[data.email, data.phone, data.address].filter(Boolean).join("  ·  ")}</p>
      </div>
      <div style={{ padding: "28px 40px" }}>
        {data.summary && <><h2 style={{ fontSize: 11, fontWeight: 700, letterSpacing: 3, textAlign: "center", color: "#1e293b" }}>EXECUTIVE SUMMARY</h2><p style={{ fontSize: 10, color: "#666", textAlign: "center", marginTop: 6 }}>{data.summary}</p></>}
        {data.experience.some(e => e.company) && <>
          <h2 style={{ fontSize: 11, fontWeight: 700, letterSpacing: 3, textAlign: "center", color: "#1e293b", marginTop: 20, borderTop: "1px solid #e2e8f0", borderBottom: "1px solid #e2e8f0", padding: "6px 0" }}>PROFESSIONAL EXPERIENCE</h2>
          {data.experience.filter(e => e.company).map((e, i) => (
            <div key={i} style={{ marginTop: 10 }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}><span style={{ fontWeight: 700 }}>{e.jobTitle}</span><span style={{ fontSize: 9, color: "#888", fontStyle: "italic" }}>{e.startDate} — {e.endDate || "Present"}</span></div>
              <div style={{ fontSize: 11, color: "#c4a747", fontWeight: 600 }}>{e.company}</div>
              {e.description && <p style={{ fontSize: 10, color: "#666", marginTop: 3 }}>{e.description}</p>}
            </div>
          ))}
        </>}
        <div style={{ display: "flex", gap: 30, marginTop: 20 }}>
          <div style={{ flex: 1 }}>{data.skills.length > 0 && <><h2 style={{ fontSize: 11, fontWeight: 700, letterSpacing: 3, color: "#1e293b" }}>EXPERTISE</h2><div style={{ marginTop: 4 }}>{data.skills.map(s => <div key={s} style={{ fontSize: 10 }}>▪ {s}</div>)}</div></>}</div>
          <div style={{ flex: 1 }}>{data.education.some(e => e.institution) && <><h2 style={{ fontSize: 11, fontWeight: 700, letterSpacing: 3, color: "#1e293b" }}>EDUCATION</h2>{data.education.filter(e => e.institution).map((e, i) => <EduBlock key={i} e={e} />)}</>}</div>
        </div>
      </div>
    </div>
  );
}

// ============================
// TEMPLATE: Classic (two-col)
// ============================
export function ClassicTemplate({ data }: { data: ResumeData }) {
  return (
    <div style={{ width: 816, minHeight: 1056, background: "#fff", color: "#1a1a2e", padding: 40, fontFamily: "'Inter', sans-serif", fontSize: 11 }}>
      <div style={{ textAlign: "center", borderBottom: "1px solid #e5e7eb", paddingBottom: 12 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, letterSpacing: 2 }}>{(data.name || "YOUR NAME").toUpperCase()}</h1>
        <p style={{ fontSize: 10, color: "#666", marginTop: 4 }}>{[data.email, data.phone, data.address].filter(Boolean).join(" | ")}</p>
      </div>
      <div style={{ display: "flex", gap: 24, marginTop: 16 }}>
        <div style={{ width: "60%" }}>
          {data.experience.some(e => e.company) && <>
            <Section title="Professional Experience" />
            {data.experience.filter(e => e.company).map((e, i) => (
              <div key={i} style={{ marginTop: 6 }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}><span style={{ fontWeight: 700, color: "#0d9488" }}>{e.company}</span><span style={{ fontSize: 9, color: "#888", fontStyle: "italic" }}>{e.startDate} – {e.endDate || "Present"}</span></div>
                <div style={{ fontSize: 10, fontStyle: "italic", color: "#666" }}>{e.jobTitle}</div>
                {e.description && <p style={{ fontSize: 10, color: "#666", marginTop: 2 }}>{e.description}</p>}
              </div>
            ))}
          </>}
          {data.projects.some(p => p.name) && <><Section title="Projects" />{data.projects.filter(p => p.name).map((p, i) => <ProjBlock key={i} p={p} />)}</>}
          {data.summary && <><Section title="Summary" /><p style={{ fontSize: 10, color: "#666", marginTop: 4 }}>{data.summary}</p></>}
        </div>
        <div style={{ width: "40%" }}>
          {data.education.some(e => e.institution) && <><Section title="Education" />{data.education.filter(e => e.institution).map((e, i) => <EduBlock key={i} e={e} />)}</>}
          {data.skills.length > 0 && <><Section title="Skills" /><div style={{ marginTop: 4 }}>{data.skills.map(s => <div key={s} style={{ fontSize: 10 }}>• {s}</div>)}</div></>}
          {data.languages.length > 0 && <><Section title="Languages" /><p style={{ fontSize: 10, color: "#666", marginTop: 4 }}>{data.languages.join(", ")}</p></>}
          {data.certifications.some(c => c.name) && <><Section title="Certifications" />{data.certifications.filter(c => c.name).map((c, i) => <CertBlock key={i} c={c} />)}</>}
        </div>
      </div>
    </div>
  );
}

// ============================
// TEMPLATE: Compact
// ============================
export function CompactTemplate({ data }: { data: ResumeData }) {
  return (
    <div style={{ width: 816, minHeight: 1056, background: "#fff", color: "#1a1a2e", padding: "28px 36px", fontFamily: "'Inter', sans-serif", fontSize: 10 }}>
      <h1 style={{ fontSize: 20, fontWeight: 700 }}>{data.name || "Your Name"}</h1>
      <p style={{ fontSize: 10, color: "#666", marginTop: 2 }}>{[data.jobTitle, data.email, data.phone, data.address].filter(Boolean).join(" | ")}</p>
      {data.summary && <p style={{ fontSize: 10, color: "#666", marginTop: 8, borderLeft: "2px solid #0d9488", paddingLeft: 8 }}>{data.summary}</p>}
      {data.experience.some(e => e.company) && <>
        <h2 style={{ fontSize: 10, fontWeight: 700, marginTop: 12, borderBottom: "1px solid #e5e7eb", paddingBottom: 2 }}>EXPERIENCE</h2>
        {data.experience.filter(e => e.company).map((e, i) => <div key={i} style={{ marginTop: 4 }}><div style={{ display: "flex", justifyContent: "space-between" }}><span style={{ fontWeight: 600 }}>{e.jobTitle} — {e.company}</span><span style={{ fontSize: 9, color: "#888" }}>{e.startDate} – {e.endDate || "Present"}</span></div>{e.description && <p style={{ fontSize: 9, color: "#666", marginTop: 1 }}>{e.description}</p>}</div>)}
      </>}
      {data.education.some(e => e.institution) && <>
        <h2 style={{ fontSize: 10, fontWeight: 700, marginTop: 12, borderBottom: "1px solid #e5e7eb", paddingBottom: 2 }}>EDUCATION</h2>
        {data.education.filter(e => e.institution).map((e, i) => <div key={i} style={{ marginTop: 4 }}><span style={{ fontWeight: 600 }}>{e.degree}</span> — {e.institution} ({e.startDate} – {e.endDate})</div>)}
      </>}
      <div style={{ display: "flex", gap: 20, marginTop: 12 }}>
        {data.skills.length > 0 && <div style={{ flex: 1 }}><h2 style={{ fontSize: 10, fontWeight: 700, borderBottom: "1px solid #e5e7eb", paddingBottom: 2 }}>SKILLS</h2><p style={{ fontSize: 9, marginTop: 4 }}>{data.skills.join(" · ")}</p></div>}
        {data.languages.length > 0 && <div><h2 style={{ fontSize: 10, fontWeight: 700, borderBottom: "1px solid #e5e7eb", paddingBottom: 2 }}>LANGUAGES</h2><p style={{ fontSize: 9, marginTop: 4 }}>{data.languages.join(", ")}</p></div>}
      </div>
    </div>
  );
}

// ============================
// TEMPLATE: Global Standard
// ============================
export function GlobalTemplate({ data }: { data: ResumeData }) {
  return (
    <div style={{ width: 816, minHeight: 1056, background: "#fff", color: "#1a1a2e", padding: 40, fontFamily: "'Inter', sans-serif", fontSize: 11 }}>
      <div style={{ textAlign: "center", borderBottom: "2px solid #0d9488", paddingBottom: 12 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, letterSpacing: 2 }}>{(data.name || "YOUR NAME").toUpperCase()}</h1>
        <p style={{ fontSize: 10, color: "#666", marginTop: 4 }}>{[data.email, data.phone, data.address].filter(Boolean).join(" | ")}</p>
        {data.linkedin && <p style={{ fontSize: 10, color: "#0d9488" }}>{data.linkedin}{data.portfolio && ` · ${data.portfolio}`}</p>}
      </div>
      <div style={{ display: "flex", gap: 24, marginTop: 16 }}>
        <div style={{ width: "60%" }}>
          {data.summary && <><Section title="Professional Summary" /><p style={{ fontSize: 10, color: "#666", marginTop: 4 }}>{data.summary}</p></>}
          {data.experience.some(e => e.company) && <>
            <Section title="Work Experience" />
            {data.experience.filter(e => e.company).map((e, i) => (
              <div key={i} style={{ marginTop: 6 }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}><span style={{ fontWeight: 700, color: "#0d9488" }}>{e.company}</span><span style={{ fontSize: 9, color: "#888" }}>{e.startDate} – {e.endDate || "Present"}</span></div>
                <div style={{ fontSize: 10, fontStyle: "italic", color: "#666" }}>{e.jobTitle}</div>
                {e.description && <p style={{ fontSize: 10, color: "#666", marginTop: 2 }}>{e.description}</p>}
              </div>
            ))}
          </>}
          {data.projects.some(p => p.name) && <><Section title="Projects" />{data.projects.filter(p => p.name).map((p, i) => <ProjBlock key={i} p={p} />)}</>}
        </div>
        <div style={{ width: "40%" }}>
          {data.education.some(e => e.institution) && <><Section title="Education" />{data.education.filter(e => e.institution).map((e, i) => <EduBlock key={i} e={e} />)}</>}
          {data.skills.length > 0 && <><Section title="Skills" /><SkillTags skills={data.skills} /></>}
          {data.certifications.some(c => c.name) && <><Section title="Certifications" />{data.certifications.filter(c => c.name).map((c, i) => <CertBlock key={i} c={c} />)}</>}
          {data.languages.length > 0 && <><Section title="Languages" /><p style={{ fontSize: 10, color: "#666", marginTop: 4 }}>{data.languages.join(", ")}</p></>}
        </div>
      </div>
    </div>
  );
}

// ============================
// TEMPLATE: Modern Professional (sidebar)
// ============================
export function ModernProfessionalTemplate({ data }: { data: ResumeData }) {
  return (
    <div style={{ width: 816, minHeight: 1056, background: "#fff", color: "#1a1a2e", fontFamily: "'Inter', sans-serif", fontSize: 11, display: "flex" }}>
      <div style={{ width: "33%", background: "#1e293b", color: "#e2e8f0", padding: 24 }}>
        <div style={{ width: 64, height: 64, borderRadius: "50%", background: "#334155", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, fontWeight: 700, color: "#94a3b8", margin: "0 auto" }}>{(data.name || "A")[0]}</div>
        <h1 style={{ fontSize: 18, fontWeight: 700, color: "#fff", textAlign: "center", marginTop: 12 }}>{data.name || "Your Name"}</h1>
        <p style={{ fontSize: 10, color: "#94a3b8", textAlign: "center" }}>{data.jobTitle}</p>
        <div style={{ marginTop: 20 }}>
          <h3 style={{ fontSize: 10, fontWeight: 700, color: "#38bdf8", letterSpacing: 1 }}>CONTACT</h3>
          {data.email && <p style={{ fontSize: 10, color: "#94a3b8", marginTop: 6 }}>{data.email}</p>}
          {data.phone && <p style={{ fontSize: 10, color: "#94a3b8" }}>{data.phone}</p>}
          {data.address && <p style={{ fontSize: 10, color: "#94a3b8" }}>{data.address}</p>}
        </div>
        {data.skills.length > 0 && <div style={{ marginTop: 16 }}><h3 style={{ fontSize: 10, fontWeight: 700, color: "#38bdf8", letterSpacing: 1 }}>SKILLS</h3>{data.skills.map(s => <div key={s} style={{ fontSize: 10, color: "#cbd5e1", marginTop: 3 }}>▹ {s}</div>)}</div>}
        {data.languages.length > 0 && <div style={{ marginTop: 16 }}><h3 style={{ fontSize: 10, fontWeight: 700, color: "#38bdf8", letterSpacing: 1 }}>LANGUAGES</h3><p style={{ fontSize: 10, color: "#94a3b8", marginTop: 4 }}>{data.languages.join(", ")}</p></div>}
        {data.certifications.some(c => c.name) && <div style={{ marginTop: 16 }}><h3 style={{ fontSize: 10, fontWeight: 700, color: "#38bdf8", letterSpacing: 1 }}>CERTIFICATIONS</h3>{data.certifications.filter(c => c.name).map((c, i) => <div key={i} style={{ marginTop: 4 }}><div style={{ fontSize: 10, fontWeight: 600, color: "#e2e8f0" }}>{c.name}</div><div style={{ fontSize: 9, color: "#94a3b8" }}>{c.issuer}</div></div>)}</div>}
      </div>
      <div style={{ flex: 1, padding: 28 }}>
        {data.summary && <><Section title="About" color="#1e293b" /><p style={{ fontSize: 10, color: "#666", marginTop: 4 }}>{data.summary}</p></>}
        {data.experience.some(e => e.company) && <><Section title="Experience" color="#1e293b" />{data.experience.filter(e => e.company).map((e, i) => <ExpBlock key={i} e={e} />)}</>}
        {data.education.some(e => e.institution) && <><Section title="Education" color="#1e293b" />{data.education.filter(e => e.institution).map((e, i) => <EduBlock key={i} e={e} />)}</>}
        {data.projects.some(p => p.name) && <><Section title="Projects" color="#1e293b" />{data.projects.filter(p => p.name).map((p, i) => <ProjBlock key={i} p={p} />)}</>}
      </div>
    </div>
  );
}

// ============================
// TEMPLATE: Corporate Clean
// ============================
export function CorporateCleanTemplate({ data }: { data: ResumeData }) {
  return (
    <div style={{ width: 816, minHeight: 1056, background: "#fff", color: "#1a1a2e", padding: 40, fontFamily: "'Inter', sans-serif", fontSize: 11 }}>
      <div style={{ borderBottom: "3px solid #2563eb", paddingBottom: 12 }}>
        <h1 style={{ fontSize: 26, fontWeight: 700 }}>{data.name || "Your Name"}</h1>
        <p style={{ fontSize: 13, color: "#2563eb", marginTop: 2 }}>{data.jobTitle || "Job Title"}</p>
        <p style={{ fontSize: 10, color: "#666", marginTop: 4 }}>{[data.email, data.phone, data.address].filter(Boolean).join("  ·  ")}</p>
      </div>
      {data.summary && <><Section title="Summary" color="#2563eb" /><p style={{ fontSize: 10, color: "#666", marginTop: 4 }}>{data.summary}</p></>}
      {data.experience.some(e => e.company) && <><Section title="Experience" color="#2563eb" />{data.experience.filter(e => e.company).map((e, i) => <ExpBlock key={i} e={e} />)}</>}
      {data.education.some(e => e.institution) && <><Section title="Education" color="#2563eb" />{data.education.filter(e => e.institution).map((e, i) => <EduBlock key={i} e={e} />)}</>}
      {data.skills.length > 0 && <><Section title="Skills" color="#2563eb" /><SkillTags skills={data.skills} bg="#2563eb15" color="#2563eb" /></>}
      {data.projects.some(p => p.name) && <><Section title="Projects" color="#2563eb" />{data.projects.filter(p => p.name).map((p, i) => <ProjBlock key={i} p={p} />)}</>}
      {data.certifications.some(c => c.name) && <><Section title="Certifications" color="#2563eb" />{data.certifications.filter(c => c.name).map((c, i) => <CertBlock key={i} c={c} />)}</>}
      {data.languages.length > 0 && <><Section title="Languages" color="#2563eb" /><p style={{ fontSize: 10, color: "#666", marginTop: 4 }}>{data.languages.join(", ")}</p></>}
    </div>
  );
}

// ============================
// TEMPLATE: Developer Dark (dark sidebar)
// ============================
export function DeveloperDarkTemplate({ data }: { data: ResumeData }) {
  return (
    <div style={{ width: 816, minHeight: 1056, background: "#111827", color: "#e5e7eb", fontFamily: "'Courier New', monospace", fontSize: 11, display: "flex" }}>
      <div style={{ width: "35%", background: "#1f2937", padding: 24, borderRight: "1px solid #374151" }}>
        <h1 style={{ fontSize: 18, fontWeight: 700, color: "#34d399" }}>{data.name || "Your Name"}</h1>
        <p style={{ fontSize: 10, color: "#6ee7b7" }}>{data.jobTitle}</p>
        <div style={{ marginTop: 16 }}>
          <p style={{ fontSize: 10, color: "#34d399" }}>// Contact</p>
          {data.email && <p style={{ fontSize: 10, color: "#9ca3af" }}>{data.email}</p>}
          {data.phone && <p style={{ fontSize: 10, color: "#9ca3af" }}>{data.phone}</p>}
          {data.address && <p style={{ fontSize: 10, color: "#9ca3af" }}>{data.address}</p>}
        </div>
        {data.skills.length > 0 && <div style={{ marginTop: 16 }}><p style={{ fontSize: 10, color: "#34d399" }}>// Tech Stack</p>{data.skills.map(s => <p key={s} style={{ fontSize: 10, color: "#d1d5db" }}>├─ {s}</p>)}</div>}
        {data.languages.length > 0 && <div style={{ marginTop: 16 }}><p style={{ fontSize: 10, color: "#34d399" }}>// Languages</p><p style={{ fontSize: 10, color: "#9ca3af" }}>{data.languages.join(", ")}</p></div>}
        {data.certifications.some(c => c.name) && <div style={{ marginTop: 16 }}><p style={{ fontSize: 10, color: "#34d399" }}>// Certs</p>{data.certifications.filter(c => c.name).map((c, i) => <p key={i} style={{ fontSize: 10, color: "#d1d5db" }}>⟫ {c.name}</p>)}</div>}
      </div>
      <div style={{ flex: 1, padding: 28 }}>
        {data.summary && <><p style={{ fontSize: 10, color: "#34d399" }}>/** About */</p><p style={{ fontSize: 10, color: "#9ca3af", marginTop: 4 }}>{data.summary}</p></>}
        {data.experience.some(e => e.company) && <>
          <p style={{ fontSize: 10, color: "#34d399", marginTop: 14 }}>class Experience {"{"}</p>
          {data.experience.filter(e => e.company).map((e, i) => (
            <div key={i} style={{ marginLeft: 16, marginTop: 6 }}>
              <p style={{ fontWeight: 700, color: "#e5e7eb" }}>{e.jobTitle}() {"{"}</p>
              <p style={{ marginLeft: 16, color: "#fbbf24" }}>at: "{e.company}",</p>
              <p style={{ marginLeft: 16, color: "#fbbf24" }}>period: "{e.startDate} – {e.endDate || "Present"}",</p>
              {e.description && <p style={{ marginLeft: 16, color: "#6b7280" }}>// {e.description}</p>}
              <p>{"}"}</p>
            </div>
          ))}
          <p>{"}"}</p>
        </>}
        {data.education.some(e => e.institution) && <>
          <p style={{ fontSize: 10, color: "#34d399", marginTop: 14 }}>// Education</p>
          {data.education.filter(e => e.institution).map((e, i) => <div key={i} style={{ marginTop: 4 }}><p style={{ fontWeight: 600 }}>{e.degree}</p><p style={{ fontSize: 10, color: "#6b7280" }}>{e.institution} · {e.startDate} – {e.endDate}</p></div>)}
        </>}
        {data.projects.some(p => p.name) && <>
          <p style={{ fontSize: 10, color: "#34d399", marginTop: 14 }}>const projects = [</p>
          {data.projects.filter(p => p.name).map((p, i) => <p key={i} style={{ marginLeft: 16 }}>{"{"} name: <span style={{ color: "#fbbf24" }}>"{p.name}"</span>{p.description && `, desc: "${p.description}"`} {"}"},</p>)}
          <p>];</p>
        </>}
      </div>
    </div>
  );
}

// ============================
// TEMPLATE: Timeline
// ============================
export function TimelineTemplate({ data }: { data: ResumeData }) {
  return (
    <div style={{ width: 816, minHeight: 1056, background: "#fff", color: "#1a1a2e", padding: 40, fontFamily: "'Inter', sans-serif", fontSize: 11 }}>
      <div style={{ textAlign: "center", marginBottom: 20 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, color: "#7c3aed" }}>{data.name || "Your Name"}</h1>
        <p style={{ fontSize: 12, color: "#7c3aed", marginTop: 2 }}>{data.jobTitle || "Job Title"}</p>
        <p style={{ fontSize: 10, color: "#666", marginTop: 4 }}>{[data.email, data.phone, data.address].filter(Boolean).join(" · ")}</p>
      </div>
      {data.summary && <p style={{ fontSize: 10, color: "#666", textAlign: "center", maxWidth: 500, margin: "0 auto 16px" }}>{data.summary}</p>}
      {data.experience.some(e => e.company) && <>
        <h2 style={{ fontSize: 11, fontWeight: 700, color: "#7c3aed", marginTop: 8 }}>EXPERIENCE</h2>
        {data.experience.filter(e => e.company).map((e, i) => (
          <div key={i} style={{ display: "flex", gap: 12, marginTop: 8 }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: 20 }}>
              <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#7c3aed" }} />
              <div style={{ flex: 1, width: 2, background: "#7c3aed30" }} />
            </div>
            <div style={{ flex: 1, paddingBottom: 8 }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}><span style={{ fontWeight: 700 }}>{e.jobTitle}</span><span style={{ fontSize: 9, color: "#888" }}>{e.startDate} – {e.endDate || "Present"}</span></div>
              <div style={{ fontSize: 10, color: "#7c3aed" }}>{e.company}</div>
              {e.description && <p style={{ fontSize: 10, color: "#666", marginTop: 2 }}>{e.description}</p>}
            </div>
          </div>
        ))}
      </>}
      <div style={{ display: "flex", gap: 30, marginTop: 14 }}>
        <div style={{ flex: 1 }}>
          {data.education.some(e => e.institution) && <><h2 style={{ fontSize: 11, fontWeight: 700, color: "#7c3aed" }}>EDUCATION</h2>{data.education.filter(e => e.institution).map((e, i) => <EduBlock key={i} e={e} />)}</>}
          {data.projects.some(p => p.name) && <><h2 style={{ fontSize: 11, fontWeight: 700, color: "#7c3aed", marginTop: 12 }}>PROJECTS</h2>{data.projects.filter(p => p.name).map((p, i) => <ProjBlock key={i} p={p} />)}</>}
        </div>
        <div style={{ flex: 1 }}>
          {data.skills.length > 0 && <><h2 style={{ fontSize: 11, fontWeight: 700, color: "#7c3aed" }}>SKILLS</h2><SkillTags skills={data.skills} bg="#7c3aed15" color="#7c3aed" /></>}
          {data.languages.length > 0 && <><h2 style={{ fontSize: 11, fontWeight: 700, color: "#7c3aed", marginTop: 12 }}>LANGUAGES</h2><p style={{ fontSize: 10, color: "#666", marginTop: 4 }}>{data.languages.join(", ")}</p></>}
          {data.certifications.some(c => c.name) && <><h2 style={{ fontSize: 11, fontWeight: 700, color: "#7c3aed", marginTop: 12 }}>CERTIFICATIONS</h2>{data.certifications.filter(c => c.name).map((c, i) => <CertBlock key={i} c={c} />)}</>}
        </div>
      </div>
    </div>
  );
}

// ============================
// TEMPLATE MAP & PREVIEW
// ============================
import type { TemplateName } from "@/types/resume";

const templateMap: Record<TemplateName, React.FC<{ data: ResumeData }>> = {
  professional: ProfessionalTemplate,
  creative: CreativeTemplate,
  minimal: MinimalTemplate,
  tech: TechTemplate,
  executive: ExecutiveTemplate,
  bold: BoldTemplate,
  student: StudentTemplate,
  energetic: EnergeticTemplate,
  elegant: ElegantTemplate,
  sidekick: SidekickTemplate,
  grid: GridTemplate,
  "executive-elite": ExecutiveEliteTemplate,
  classic: ClassicTemplate,
  compact: CompactTemplate,
  global: GlobalTemplate,
  "modern-professional": ModernProfessionalTemplate,
  "corporate-clean": CorporateCleanTemplate,
  "developer-dark": DeveloperDarkTemplate,
  timeline: TimelineTemplate,
};

export function ResumePreview({ templateId, data }: { templateId: TemplateName; data: ResumeData }) {
  const Template = templateMap[templateId] || ProfessionalTemplate;
  return <Template data={data} />;
}

// Mini thumbnail preview (scaled down for template selector)
export function ResumeThumb({ templateId, data }: { templateId: TemplateName; data: ResumeData }) {
  const Template = templateMap[templateId] || ProfessionalTemplate;
  return (
    <div style={{ width: 160, height: 210, overflow: "hidden", borderRadius: 6, position: "relative" }}>
      <div style={{ transform: "scale(0.196)", transformOrigin: "top left", width: 816, height: 1056, pointerEvents: "none" }}>
        <Template data={data} />
      </div>
    </div>
  );
}
