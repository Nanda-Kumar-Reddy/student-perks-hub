/**
 * VendorProfileTab — reusable profile tab for Consultations, Accounting, Driving License vendors
 */
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Pencil, User, Clock, Globe, Award, Briefcase } from "lucide-react";
import SlotSelector, { SlotConfig } from "./SlotSelector";

export interface VendorProfile {
  name: string;
  profileImage?: string;
  headline: string;
  responseTime: string;
  about: string;
  qualifications: string[];
  expertise: string[];
  languages: string[];
  // Driving licence specific
  schoolName?: string;
  location?: string;
  timing?: string;
  whyChooseUs?: string;
}

interface Props {
  profile: VendorProfile;
  onSave: (profile: VendorProfile) => void;
  showSlots?: boolean;
  slots?: SlotConfig;
  onSlotsChange?: (slots: SlotConfig) => void;
  variant?: "consultation" | "accounting" | "driving";
}

export default function VendorProfileTab({ profile, onSave, showSlots, slots, onSlotsChange, variant = "consultation" }: Props) {
  const [editOpen, setEditOpen] = useState(false);
  const [form, setForm] = useState<VendorProfile>(profile);

  const update = (key: keyof VendorProfile, val: any) => setForm((p) => ({ ...p, [key]: val }));

  const handleSave = () => {
    onSave(form);
    setEditOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Profile Card */}
      <div className="rounded-xl border border-border bg-card p-6 shadow-card">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary text-xl font-bold">
              {profile.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
            </div>
            <div>
              <h2 className="font-display text-lg font-bold">{profile.name}</h2>
              <p className="text-sm text-muted-foreground">{profile.headline}</p>
              {profile.schoolName && <p className="text-xs text-muted-foreground mt-0.5">{profile.schoolName}</p>}
              <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" /> Response: {profile.responseTime}
              </div>
            </div>
          </div>
          <Button size="sm" variant="outline" className="gap-1" onClick={() => { setForm(profile); setEditOpen(true); }}>
            <Pencil className="h-3.5 w-3.5" /> Edit Profile
          </Button>
        </div>
      </div>

      {/* About */}
      <div className="rounded-xl border border-border bg-card p-6 shadow-card">
        <h3 className="font-display text-sm font-bold mb-2 flex items-center gap-2"><User className="h-4 w-4" /> About</h3>
        <p className="text-sm text-muted-foreground leading-relaxed">{profile.about}</p>
      </div>

      {/* Info Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-xl border border-border bg-card p-5 shadow-card">
          <h3 className="font-display text-sm font-bold mb-2 flex items-center gap-2"><Award className="h-4 w-4" /> Qualifications</h3>
          <ul className="space-y-1">{profile.qualifications.map((q) => <li key={q} className="text-xs text-muted-foreground">• {q}</li>)}</ul>
        </div>
        <div className="rounded-xl border border-border bg-card p-5 shadow-card">
          <h3 className="font-display text-sm font-bold mb-2 flex items-center gap-2"><Briefcase className="h-4 w-4" /> Expertise</h3>
          <div className="flex flex-wrap gap-1">{profile.expertise.map((e) => <span key={e} className="rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary">{e}</span>)}</div>
        </div>
        <div className="rounded-xl border border-border bg-card p-5 shadow-card">
          <h3 className="font-display text-sm font-bold mb-2 flex items-center gap-2"><Globe className="h-4 w-4" /> Languages</h3>
          <div className="flex flex-wrap gap-1">{profile.languages.map((l) => <span key={l} className="rounded-full bg-secondary px-2 py-0.5 text-xs">{l}</span>)}</div>
        </div>
      </div>

      {profile.whyChooseUs && (
        <div className="rounded-xl border border-border bg-card p-6 shadow-card">
          <h3 className="font-display text-sm font-bold mb-2">Why Choose Us</h3>
          <p className="text-sm text-muted-foreground">{profile.whyChooseUs}</p>
        </div>
      )}

      {/* Slot Selector */}
      {showSlots && slots && onSlotsChange && (
        <div className="rounded-xl border border-border bg-card p-6 shadow-card">
          <h3 className="font-display text-sm font-bold mb-4">Availability & Slots</h3>
          <SlotSelector value={slots} onChange={onSlotsChange} />
        </div>
      )}

      {/* Edit Profile Dialog */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
          <DialogHeader><DialogTitle>Edit Profile</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div><label className="text-sm font-medium">Name</label><Input value={form.name} onChange={(e) => update("name", e.target.value)} /></div>
            <div><label className="text-sm font-medium">Headline</label><Input value={form.headline} onChange={(e) => update("headline", e.target.value)} /></div>
            {variant === "driving" && (
              <>
                <div><label className="text-sm font-medium">School Name</label><Input value={form.schoolName || ""} onChange={(e) => update("schoolName", e.target.value)} /></div>
                <div><label className="text-sm font-medium">Location</label><Input value={form.location || ""} onChange={(e) => update("location", e.target.value)} /></div>
                <div><label className="text-sm font-medium">Timing</label><Input value={form.timing || ""} onChange={(e) => update("timing", e.target.value)} placeholder="e.g. 8 AM – 6 PM" /></div>
              </>
            )}
            <div><label className="text-sm font-medium">Response Time</label><Input value={form.responseTime} onChange={(e) => update("responseTime", e.target.value)} /></div>
            <div><label className="text-sm font-medium">About</label><Textarea rows={3} value={form.about} onChange={(e) => update("about", e.target.value)} /></div>
            <div><label className="text-sm font-medium">Qualifications (comma-separated)</label><Input value={form.qualifications.join(", ")} onChange={(e) => update("qualifications", e.target.value.split(",").map((s: string) => s.trim()).filter(Boolean))} /></div>
            <div><label className="text-sm font-medium">Expertise (comma-separated)</label><Input value={form.expertise.join(", ")} onChange={(e) => update("expertise", e.target.value.split(",").map((s: string) => s.trim()).filter(Boolean))} /></div>
            <div><label className="text-sm font-medium">Languages (comma-separated)</label><Input value={form.languages.join(", ")} onChange={(e) => update("languages", e.target.value.split(",").map((s: string) => s.trim()).filter(Boolean))} /></div>
            {variant === "driving" && (
              <div><label className="text-sm font-medium">Why Choose Us</label><Textarea rows={2} value={form.whyChooseUs || ""} onChange={(e) => update("whyChooseUs", e.target.value)} /></div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditOpen(false)}>Cancel</Button>
            <Button onClick={handleSave}>Save Profile</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
