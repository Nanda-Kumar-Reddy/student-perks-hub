export interface ExperienceEntry {
  company: string;
  jobTitle: string;
  startDate: string;
  endDate: string;
  description: string;
}

export interface EducationEntry {
  institution: string;
  degree: string;
  startDate: string;
  endDate: string;
}

export interface ProjectEntry {
  name: string;
  link: string;
  description: string;
}

export interface CertEntry {
  name: string;
  issuer: string;
  date: string;
}

export interface ResumeData {
  name: string;
  jobTitle: string;
  email: string;
  phone: string;
  address: string;
  linkedin: string;
  portfolio: string;
  summary: string;
  experience: ExperienceEntry[];
  education: EducationEntry[];
  skills: string[];
  projects: ProjectEntry[];
  certifications: CertEntry[];
  languages: string[];
}

export type TemplateName =
  | "professional"
  | "creative"
  | "minimal"
  | "tech"
  | "executive"
  | "bold"
  | "student"
  | "energetic"
  | "elegant"
  | "sidekick"
  | "grid"
  | "executive-elite"
  | "classic"
  | "compact"
  | "global"
  | "modern-professional"
  | "corporate-clean"
  | "developer-dark"
  | "timeline";

export const templateMeta: { id: TemplateName; name: string; desc: string; layout: string }[] = [
  { id: "professional", name: "Professional", desc: "Clean modern layout", layout: "single" },
  { id: "creative", name: "Creative", desc: "Bold eye-catching design", layout: "single" },
  { id: "minimal", name: "Minimal", desc: "Simple and elegant", layout: "single" },
  { id: "tech", name: "Tech", desc: "Code-inspired developer resume", layout: "sidebar" },
  { id: "executive", name: "Executive", desc: "Formal corporate layout", layout: "centered" },
  { id: "bold", name: "Bold", desc: "Strong visual impact", layout: "sidebar" },
  { id: "student", name: "Student", desc: "Education-first layout", layout: "single" },
  { id: "energetic", name: "Energetic", desc: "Vibrant two-column design", layout: "sidebar" },
  { id: "elegant", name: "Elegant", desc: "Serif typography, centered", layout: "centered" },
  { id: "sidekick", name: "Sidekick", desc: "Sidebar with main content", layout: "sidebar" },
  { id: "grid", name: "Grid", desc: "Structured grid layout", layout: "grid" },
  { id: "executive-elite", name: "Executive Elite", desc: "Premium corporate", layout: "centered" },
  { id: "classic", name: "Classic", desc: "Traditional two-column", layout: "two-col" },
  { id: "compact", name: "Compact", desc: "Dense single-page layout", layout: "single" },
  { id: "global", name: "Global Standard", desc: "International format", layout: "two-col" },
  { id: "modern-professional", name: "Modern Professional", desc: "Contemporary clean style", layout: "sidebar" },
  { id: "corporate-clean", name: "Corporate Clean", desc: "Business-ready format", layout: "single" },
  { id: "developer-dark", name: "Developer Dark", desc: "Dark theme for devs", layout: "sidebar" },
  { id: "timeline", name: "Timeline", desc: "Chronological timeline style", layout: "timeline" },
];

export const defaultResume: ResumeData = {
  name: "Alex Johnson",
  jobTitle: "Full Stack Developer",
  email: "alex.johnson@email.com",
  phone: "+61 412 345 678",
  address: "Melbourne, VIC, Australia",
  linkedin: "linkedin.com/in/alexjohnson",
  portfolio: "alexjohnson.dev",
  summary: "Passionate full-stack developer with 4+ years of experience building scalable web applications. Proficient in React, Node.js, and cloud technologies. Strong problem-solver with a track record of delivering high-quality solutions on time.",
  experience: [
    { company: "TechCorp Solutions", jobTitle: "Senior Frontend Developer", startDate: "Jan 2023", endDate: "Present", description: "Led the frontend team in building a SaaS platform serving 50K+ users. Implemented CI/CD pipelines reducing deployment time by 60%." },
    { company: "Digital Innovations", jobTitle: "Full Stack Developer", startDate: "Mar 2021", endDate: "Dec 2022", description: "Built RESTful APIs and React-based dashboards for enterprise clients. Improved application performance by 40%." },
  ],
  education: [
    { institution: "University of Melbourne", degree: "Bachelor of Computer Science", startDate: "2017", endDate: "2020" },
  ],
  skills: ["React", "TypeScript", "Node.js", "Python", "AWS", "Docker", "MongoDB", "Git"],
  projects: [
    { name: "TaskFlow", link: "github.com/alex/taskflow", description: "A project management tool built with React and Firebase, serving 2K+ active users." },
    { name: "EcoTrack", link: "ecotrack.app", description: "Carbon footprint tracker mobile app built with React Native." },
  ],
  certifications: [
    { name: "AWS Solutions Architect", issuer: "Amazon Web Services", date: "2023" },
    { name: "Google Cloud Professional", issuer: "Google", date: "2022" },
  ],
  languages: ["English", "Spanish", "Mandarin"],
};
