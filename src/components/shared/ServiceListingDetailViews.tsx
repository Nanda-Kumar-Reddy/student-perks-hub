import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calculator, Calendar, CarFront, CheckCircle2, Clock, Globe, MapPin, Monitor, Package, Video } from "lucide-react";
import { motion } from "framer-motion";
import { useListingView } from "@/contexts/ListingViewContext";

type DetailField = { label: string; value: string };

const resolveNumericId = (id?: string) => {
  const direct = Number(id);
  if (!Number.isNaN(direct) && direct > 0) return direct;
  const extracted = Number((id || "").match(/\d+/)?.[0]);
  return !Number.isNaN(extracted) && extracted > 0 ? extracted : 1;
};

function FieldGrid({ fields }: { fields: DetailField[] }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {fields.map((field) => (
        <div key={field.label} className="rounded-lg border border-border p-3">
          <p className="text-xs text-muted-foreground">{field.label}</p>
          <p className="mt-1 text-sm font-medium">{field.value}</p>
        </div>
      ))}
    </div>
  );
}

function Tags({ items }: { items: string[] }) {
  return (
    <div className="flex flex-wrap gap-2">
      {items.map((item) => (
        <span key={item} className="rounded-full bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary">
          {item}
        </span>
      ))}
    </div>
  );
}

const consultationListings = [
  {
    id: 1,
    title: "Career Counseling Session",
    type: "Career guidance",
    price: "$120/session",
    duration: "60 minutes",
    mode: "Online",
    location: "Video consultation",
    languages: ["English", "Hindi"],
    description: "Structured one-on-one support for resume positioning, interview preparation, local job search planning, and Australian workplace readiness.",
    bookingInfo: ["Pre-session intake notes", "Action plan after the call", "Follow-up resources included"],
    metadata: { status: "Approved", listed: "2 days ago", category: "Personal" },
  },
  {
    id: 2,
    title: "Visa Extension Consultation",
    type: "Migration guidance",
    price: "$95/session",
    duration: "45 minutes",
    mode: "Online / Offline",
    location: "Melbourne CBD office available",
    languages: ["English", "Mandarin"],
    description: "A focused service listing for students who need document preparation guidance, timeline planning, and next-step clarification for visa extensions.",
    bookingInfo: ["Document checklist", "Timeline review", "Office or video session"],
    metadata: { status: "Pending", listed: "Today", category: "Visa" },
  },
];

const accountingListings = [
  {
    id: 1,
    title: "Student Tax Return",
    service: "Tax return lodgement",
    price: "$49",
    duration: "45 minutes",
    mode: "Online",
    location: "Remote appointment",
    languages: ["English", "Hindi"],
    description: "Student-focused tax return service covering PAYG summaries, deductions, TFN checks, and clear lodgement steps for international students.",
    bookingInfo: ["TFN and income statement review", "Deduction checklist", "Digital lodgement guidance"],
    metadata: { status: "Approved", listed: "3 days ago", category: "Tax" },
  },
  {
    id: 2,
    title: "ABN Setup Support",
    service: "ABN registration guidance",
    price: "$69",
    duration: "60 minutes",
    mode: "Online / Offline",
    location: "Sydney office available",
    languages: ["English", "Mandarin"],
    description: "Service listing for students starting freelance or contractor work, including ABN setup guidance, GST basics, and invoicing obligations.",
    bookingInfo: ["ABN eligibility checklist", "Setup walkthrough", "Record-keeping starter guide"],
    metadata: { status: "Pending", listed: "Yesterday", category: "Business setup" },
  },
];

const drivingPackageListings = [
  {
    id: 1,
    title: "Standard Package",
    lessons: "10 lessons",
    lessonDuration: "60 minutes each",
    vehicleType: "Automatic",
    price: "$650",
    addOns: ["Mock test", "Test route practice", "Pick-up & drop-off"],
    languages: ["English", "Hindi"],
    location: "Melbourne",
    description: "A structured learner-driver package with ten practical lessons, route familiarisation, and test preparation for students building local driving confidence.",
    metadata: { status: "Approved", listed: "1 week ago", category: "Learner package" },
  },
  {
    id: 2,
    title: "Premium Package",
    lessons: "20 lessons",
    lessonDuration: "60 minutes each",
    vehicleType: "Automatic / Manual",
    price: "$1,100",
    addOns: ["2 mock tests", "Hazard perception prep", "Weekend lesson slots", "Test booking support"],
    languages: ["English", "Mandarin", "Hindi"],
    location: "Sydney",
    description: "Comprehensive driving package for new learners who need extended practice, test preparation, and flexible scheduling before licence assessment.",
    metadata: { status: "Pending", listed: "Today", category: "Complete package" },
  },
];

export function ConsultationListingDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { role, backUrl, backLabel, hideStudentActions } = useListingView();
  const listing = consultationListings.find((item) => item.id === resolveNumericId(id)) ?? consultationListings[0];
  const resolvedBackUrl = backUrl ?? "/student/consultations";
  const resolvedBackLabel = backLabel ?? "Back to Consultations";

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }} className="space-y-6">
      <Button variant="ghost" size="sm" onClick={() => navigate(resolvedBackUrl)} className="gap-1 text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> {resolvedBackLabel}
      </Button>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <section className="rounded-xl border border-border bg-card p-6 shadow-card">
            <div className="flex items-start gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Video className="h-7 w-7" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h1 className="font-display text-xl font-bold">{listing.title}</h1>
                    <p className="mt-1 text-sm text-muted-foreground">{listing.type}</p>
                  </div>
                  <span className="font-display text-lg font-bold text-primary">{listing.price}</span>
                </div>
                <div className="mt-3 flex flex-wrap gap-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> {listing.duration}</span>
                  <span className="flex items-center gap-1"><Monitor className="h-3.5 w-3.5" /> {listing.mode}</span>
                  <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" /> {listing.location}</span>
                </div>
              </div>
            </div>
          </section>

          <section className="rounded-xl border border-border bg-card p-6 shadow-card">
            <h2 className="font-display text-base font-bold">Service Description</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{listing.description}</p>
          </section>

          <section className="rounded-xl border border-border bg-card p-6 shadow-card">
            <h2 className="font-display text-base font-bold">Consultation Details</h2>
            <div className="mt-4"><FieldGrid fields={[{ label: "Consultation Type", value: listing.type }, { label: "Duration", value: listing.duration }, { label: "Mode", value: listing.mode }, { label: "Office Location", value: listing.location }]} /></div>
          </section>

          <section className="rounded-xl border border-border bg-card p-6 shadow-card">
            <h2 className="font-display text-base font-bold">Booking Information</h2>
            <div className="mt-3 grid gap-2 sm:grid-cols-3">
              {listing.bookingInfo.map((item) => (
                <div key={item} className="flex items-start gap-2 rounded-lg bg-secondary/50 p-3 text-sm">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" /> {item}
                </div>
              ))}
            </div>
          </section>
        </div>

        <aside className="space-y-4">
          <div className="sticky top-4 rounded-xl border border-border bg-card p-5 shadow-card">
            <h3 className="font-display text-base font-bold">Listing Overview</h3>
            <div className="mt-4 space-y-3 text-sm">
              <div className="flex items-center justify-between"><span className="text-muted-foreground">Price</span><span className="font-display font-bold text-primary">{listing.price}</span></div>
              <div className="flex items-center justify-between"><span className="text-muted-foreground">Duration</span><span className="font-medium">{listing.duration}</span></div>
              <div className="flex items-center justify-between"><span className="text-muted-foreground">Status</span><span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">{listing.metadata.status}</span></div>
              <div className="flex items-center justify-between"><span className="text-muted-foreground">Listed</span><span className="font-medium">{listing.metadata.listed}</span></div>
            </div>
            <div className="mt-5 space-y-3">
              <h4 className="text-sm font-medium flex items-center gap-2"><Globe className="h-4 w-4 text-primary" /> Languages</h4>
              <Tags items={listing.languages} />
            </div>
            {!hideStudentActions && role === "student" && <Button className="mt-5 w-full"><Calendar className="mr-1 h-4 w-4" /> Book Consultation</Button>}
          </div>
        </aside>
      </div>
    </motion.div>
  );
}

export function AccountingListingDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { role, backUrl, backLabel, hideStudentActions } = useListingView();
  const listing = accountingListings.find((item) => item.id === resolveNumericId(id)) ?? accountingListings[0];
  const resolvedBackUrl = backUrl ?? "/student/accounting";
  const resolvedBackLabel = backLabel ?? "Back to Accounting";

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }} className="space-y-6">
      <Button variant="ghost" size="sm" onClick={() => navigate(resolvedBackUrl)} className="gap-1 text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> {resolvedBackLabel}
      </Button>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <section className="rounded-xl border border-border bg-card p-6 shadow-card">
            <div className="flex items-start gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 text-primary"><Calculator className="h-7 w-7" /></div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div><h1 className="font-display text-xl font-bold">{listing.title}</h1><p className="mt-1 text-sm text-muted-foreground">{listing.service}</p></div>
                  <span className="font-display text-lg font-bold text-primary">{listing.price}</span>
                </div>
                <div className="mt-3 flex flex-wrap gap-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> {listing.duration}</span>
                  <span className="flex items-center gap-1"><Monitor className="h-3.5 w-3.5" /> {listing.mode}</span>
                  <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" /> {listing.location}</span>
                </div>
              </div>
            </div>
          </section>

          <section className="rounded-xl border border-border bg-card p-6 shadow-card"><h2 className="font-display text-base font-bold">Service Description</h2><p className="mt-3 text-sm leading-relaxed text-muted-foreground">{listing.description}</p></section>
          <section className="rounded-xl border border-border bg-card p-6 shadow-card"><h2 className="font-display text-base font-bold">Accounting Service Details</h2><div className="mt-4"><FieldGrid fields={[{ label: "Service Offered", value: listing.service }, { label: "Session Duration", value: listing.duration }, { label: "Mode", value: listing.mode }, { label: "Office Location", value: listing.location }]} /></div></section>
          <section className="rounded-xl border border-border bg-card p-6 shadow-card"><h2 className="font-display text-base font-bold">Service Information</h2><div className="mt-3 grid gap-2 sm:grid-cols-3">{listing.bookingInfo.map((item) => <div key={item} className="flex items-start gap-2 rounded-lg bg-secondary/50 p-3 text-sm"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" /> {item}</div>)}</div></section>
        </div>

        <aside className="space-y-4"><div className="sticky top-4 rounded-xl border border-border bg-card p-5 shadow-card"><h3 className="font-display text-base font-bold">Listing Overview</h3><div className="mt-4 space-y-3 text-sm"><div className="flex items-center justify-between"><span className="text-muted-foreground">Price</span><span className="font-display font-bold text-primary">{listing.price}</span></div><div className="flex items-center justify-between"><span className="text-muted-foreground">Duration</span><span className="font-medium">{listing.duration}</span></div><div className="flex items-center justify-between"><span className="text-muted-foreground">Category</span><span className="font-medium">{listing.metadata.category}</span></div><div className="flex items-center justify-between"><span className="text-muted-foreground">Listed</span><span className="font-medium">{listing.metadata.listed}</span></div></div><div className="mt-5 space-y-3"><h4 className="text-sm font-medium flex items-center gap-2"><Globe className="h-4 w-4 text-primary" /> Languages</h4><Tags items={listing.languages} /></div>{!hideStudentActions && role === "student" && <Button className="mt-5 w-full"><Calendar className="mr-1 h-4 w-4" /> Book Accounting Service</Button>}</div></aside>
      </div>
    </motion.div>
  );
}

export function DrivingPackageDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { role, backUrl, backLabel, hideStudentActions } = useListingView();
  const listing = drivingPackageListings.find((item) => item.id === resolveNumericId(id)) ?? drivingPackageListings[0];
  const resolvedBackUrl = backUrl ?? "/student/driving-licence";
  const resolvedBackLabel = backLabel ?? "Back to Driving Licence";

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }} className="space-y-6">
      <Button variant="ghost" size="sm" onClick={() => navigate(resolvedBackUrl)} className="gap-1 text-muted-foreground hover:text-foreground"><ArrowLeft className="h-4 w-4" /> {resolvedBackLabel}</Button>
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <section className="rounded-xl border border-border bg-card p-6 shadow-card"><div className="flex items-start gap-4"><div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 text-primary"><CarFront className="h-7 w-7" /></div><div className="min-w-0 flex-1"><div className="flex flex-wrap items-start justify-between gap-3"><div><h1 className="font-display text-xl font-bold">{listing.title}</h1><p className="mt-1 text-sm text-muted-foreground">{listing.lessons} • {listing.lessonDuration}</p></div><span className="font-display text-lg font-bold text-primary">{listing.price}</span></div><div className="mt-3 flex flex-wrap gap-3 text-xs text-muted-foreground"><span className="flex items-center gap-1"><Package className="h-3.5 w-3.5" /> {listing.vehicleType}</span><span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" /> {listing.location}</span></div></div></div></section>
          <section className="rounded-xl border border-border bg-card p-6 shadow-card"><h2 className="font-display text-base font-bold">Package Description</h2><p className="mt-3 text-sm leading-relaxed text-muted-foreground">{listing.description}</p></section>
          <section className="rounded-xl border border-border bg-card p-6 shadow-card"><h2 className="font-display text-base font-bold">Package Details</h2><div className="mt-4"><FieldGrid fields={[{ label: "Lesson Count", value: listing.lessons }, { label: "Lesson Duration", value: listing.lessonDuration }, { label: "Vehicle Type", value: listing.vehicleType }, { label: "Location", value: listing.location }]} /></div></section>
          <section className="rounded-xl border border-border bg-card p-6 shadow-card"><h2 className="font-display text-base font-bold">Add-ons Included</h2><div className="mt-3 grid gap-2 sm:grid-cols-2">{listing.addOns.map((item) => <div key={item} className="flex items-start gap-2 rounded-lg bg-secondary/50 p-3 text-sm"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" /> {item}</div>)}</div></section>
        </div>
        <aside className="space-y-4"><div className="sticky top-4 rounded-xl border border-border bg-card p-5 shadow-card"><h3 className="font-display text-base font-bold">Listing Overview</h3><div className="mt-4 space-y-3 text-sm"><div className="flex items-center justify-between"><span className="text-muted-foreground">Price</span><span className="font-display font-bold text-primary">{listing.price}</span></div><div className="flex items-center justify-between"><span className="text-muted-foreground">Lessons</span><span className="font-medium">{listing.lessons}</span></div><div className="flex items-center justify-between"><span className="text-muted-foreground">Vehicle</span><span className="font-medium">{listing.vehicleType}</span></div><div className="flex items-center justify-between"><span className="text-muted-foreground">Listed</span><span className="font-medium">{listing.metadata.listed}</span></div></div><div className="mt-5 space-y-3"><h4 className="text-sm font-medium flex items-center gap-2"><Globe className="h-4 w-4 text-primary" /> Languages</h4><Tags items={listing.languages} /></div>{!hideStudentActions && role === "student" && <Button className="mt-5 w-full"><Calendar className="mr-1 h-4 w-4" /> Book Package</Button>}</div></aside>
      </div>
    </motion.div>
  );
}