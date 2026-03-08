import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  User, CheckCircle2, Phone, Mail, Shield, FileCheck,
  Star, ClipboardCheck, BarChart3, MapPin, Calendar,
  Eye, XCircle, Clock, Award, X, Loader2
} from "lucide-react";
import FormSection from "@/components/shared/FormSection";
import PhoneField from "@/components/shared/PhoneField";
import { useAuth } from "@/contexts/AuthContext";
import { getProfile, updateProfile } from "@/services/database";
import { updatePassword } from "@/services/auth";
import { toast } from "@/hooks/use-toast";

const verificationBadges = [
  { label: "Phone Verified", icon: <Phone className="h-3.5 w-3.5" />, verified: true },
  { label: "Email Verified", icon: <Mail className="h-3.5 w-3.5" />, verified: true },
  { label: "ID Uploaded", icon: <FileCheck className="h-3.5 w-3.5" />, verified: false },
  { label: "Police Check", icon: <Shield className="h-3.5 w-3.5" />, verified: false },
];

const skills = ["Gardening", "Childcare", "First Aid", "Driver License"];

const activeTasks = [
  { id: "1", title: "Garden Maintenance — Mowing & Weeding", applications: 5, status: "APPROVED" },
  { id: "2", title: "Babysitting — Saturday Evening", applications: 3, status: "APPROVED" },
  { id: "3", title: "Help Moving Furniture", applications: 0, status: "PENDING_APPROVAL" },
];

const pendingApprovals = [
  { id: "4", title: "Dog Walking — Daily Morning Run", submitted: "2h ago", status: "PENDING_APPROVAL" },
  { id: "5", title: "Tutoring — Year 10 Mathematics", submitted: "1d ago", status: "PENDING_APPROVAL" },
];

const taskHistory = [
  { id: "6", title: "House Cleaning — Deep Clean", duration: "4 hours", payment: "$120", worker: "Sarah M.", rating: 5 },
  { id: "7", title: "Pet Sitting — Weekend", duration: "2 days", payment: "$200", worker: "James K.", rating: 4 },
  { id: "8", title: "Tech Help — WiFi Setup", duration: "1 hour", payment: "$50", worker: "Alex P.", rating: 5 },
];

const statusColor: Record<string, string> = {
  APPROVED: "bg-success/10 text-success",
  PENDING_APPROVAL: "bg-warning/10 text-warning",
  FILLED: "bg-primary/10 text-primary",
  CANCELLED: "bg-destructive/10 text-destructive",
  COMPLETED: "bg-primary/10 text-primary",
};

export default function ProfilePage() {
  const { user } = useAuth();
  const [saving, setSaving] = useState(false);
  const [savingPw, setSavingPw] = useState(false);
  const [profileLoaded, setProfileLoaded] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    university: "",
  });
  const [password, setPassword] = useState({ current: "", new: "", confirm: "" });
  const update = (k: string, v: string) => setForm((p) => ({ ...p, [k]: v }));

  // Load profile from database
  useEffect(() => {
    if (!user) return;
    setForm((p) => ({ ...p, name: user.fullName, email: user.email }));
    getProfile(user.id)
      .then((profile) => {
        setForm((prev) => ({
          ...prev,
          name: profile.full_name || prev.name,
          phone: profile.phone || "",
          address: profile.address || "",
          university: profile.university || "",
        }));
        setProfileLoaded(true);
      })
      .catch(() => setProfileLoaded(true));
  }, [user]);

  const handleSaveProfile = async () => {
    if (!user) return;
    setSaving(true);
    try {
      await updateProfile(user.id, {
        full_name: form.name,
        phone: form.phone || null,
        address: form.address || null,
        university: form.university || null,
      });
      toast({ title: "Profile updated!", description: "Your changes have been saved." });
    } catch (err: any) {
      toast({ title: "Save failed", description: err.message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const handleUpdatePassword = async () => {
    if (!password.new.trim()) {
      toast({ title: "Error", description: "New password is required", variant: "destructive" });
      return;
    }
    if (password.new.length < 6) {
      toast({ title: "Error", description: "Password must be at least 6 characters", variant: "destructive" });
      return;
    }
    if (password.new !== password.confirm) {
      toast({ title: "Error", description: "Passwords do not match", variant: "destructive" });
      return;
    }
    setSavingPw(true);
    try {
      await updatePassword(password.new);
      toast({ title: "Password updated!" });
      setPassword({ current: "", new: "", confirm: "" });
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setSavingPw(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <div className="rounded-xl border border-border bg-card p-6 shadow-card">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
            <User className="h-8 w-8" />
          </div>
          <div className="flex-1">
            <h1 className="font-display text-2xl font-bold">{form.name}</h1>
            <div className="flex flex-wrap items-center gap-3 mt-1 text-sm text-muted-foreground">
              <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" /> Member since Jan 2025</span>
              <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" /> {form.address}</span>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mt-6">
          {[
            { icon: <Star className="h-4 w-4" />, label: "Rating", value: "4.8", color: "text-warning" },
            { icon: <ClipboardCheck className="h-4 w-4" />, label: "Completed", value: "12", color: "text-success" },
            { icon: <BarChart3 className="h-4 w-4" />, label: "Response Rate", value: "95%", color: "text-primary" },
          ].map((s) => (
            <div key={s.label} className="text-center rounded-lg bg-secondary/50 p-3">
              <div className={`flex justify-center mb-1 ${s.color}`}>{s.icon}</div>
              <div className="text-lg font-display font-bold">{s.value}</div>
              <div className="text-xs text-muted-foreground">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Verification Badges */}
        <div className="mt-4">
          <h3 className="text-sm font-medium mb-2">Verification</h3>
          <div className="flex flex-wrap gap-2">
            {verificationBadges.map((b) => (
              <Badge
                key={b.label}
                variant={b.verified ? "default" : "outline"}
                className={`gap-1.5 ${b.verified ? "bg-success/10 text-success border-success/20" : "text-muted-foreground"}`}
              >
                {b.icon}
                {b.label}
                {b.verified && <CheckCircle2 className="h-3 w-3" />}
              </Badge>
            ))}
          </div>
        </div>

        {/* Skills */}
        <div className="mt-4">
          <h3 className="text-sm font-medium mb-2">Skills & Qualifications</h3>
          <div className="flex flex-wrap gap-2">
            {skills.map((s) => (
              <Badge key={s} variant="secondary" className="gap-1">
                <Award className="h-3 w-3" />
                {s}
              </Badge>
            ))}
          </div>
        </div>
      </div>


      {/* Task Tabs */}
      <Tabs defaultValue="active" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="active">Active Tasks</TabsTrigger>
          <TabsTrigger value="pending">Pending Approvals</TabsTrigger>
          <TabsTrigger value="history">Task History</TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-3 mt-4">
          {activeTasks.map((t) => (
            <div key={t.id} className="rounded-xl border border-border bg-card p-4 shadow-card">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div>
                  <h3 className="text-sm font-medium">{t.title}</h3>
                  <p className="text-xs text-muted-foreground mt-1">{t.applications} applications</p>
                </div>
                <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${statusColor[t.status]}`}>
                  {t.status.replace("_", " ")}
                </span>
              </div>
              <div className="flex gap-2 mt-3">
                <Button size="sm" variant="outline" className="text-xs gap-1"><Eye className="h-3 w-3" /> View Applications</Button>
                <Button size="sm" variant="outline" className="text-xs gap-1"><CheckCircle2 className="h-3 w-3" /> Mark Filled</Button>
                <Button size="sm" variant="outline" className="text-xs gap-1 text-destructive hover:text-destructive"><XCircle className="h-3 w-3" /> Cancel</Button>
              </div>
            </div>
          ))}
        </TabsContent>

        <TabsContent value="pending" className="space-y-3 mt-4">
          {pendingApprovals.map((t) => (
            <div key={t.id} className="rounded-xl border border-border bg-card p-4 shadow-card">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div>
                  <h3 className="text-sm font-medium">{t.title}</h3>
                  <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1"><Clock className="h-3 w-3" /> Submitted {t.submitted}</p>
                </div>
                <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${statusColor[t.status]}`}>
                  Pending
                </span>
              </div>
            </div>
          ))}
        </TabsContent>

        <TabsContent value="history" className="space-y-3 mt-4">
          {taskHistory.map((t) => (
            <div key={t.id} className="rounded-xl border border-border bg-card p-4 shadow-card">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div>
                  <h3 className="text-sm font-medium">{t.title}</h3>
                  <p className="text-xs text-muted-foreground mt-1">{t.duration} · {t.payment} · Worker: {t.worker}</p>
                </div>
                <div className="flex items-center gap-1">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} className="h-3.5 w-3.5 fill-warning text-warning" />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </TabsContent>
      </Tabs>

      {/* Settings Section */}
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-border bg-card p-6 shadow-card space-y-6">
          <FormSection title="Personal Details">
            <div><Label>Full Name</Label><Input className="mt-1.5" value={form.name} onChange={(e) => update("name", e.target.value)} /></div>
            <div><Label>Email</Label><Input className="mt-1.5" type="email" value={form.email} onChange={(e) => update("email", e.target.value)} /></div>
            <PhoneField value={form.phone} onChange={(v) => update("phone", v)} />
            <div><Label>Address</Label><Input className="mt-1.5" value={form.address} onChange={(e) => update("address", e.target.value)} /></div>
          </FormSection>
          <Button onClick={handleSaveProfile} disabled={saving}>
            {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
            Save Changes
          </Button>
        </div>
        <div className="rounded-xl border border-border bg-card p-6 shadow-card space-y-6">
          <FormSection title="Change Password">
            <div><Label>Current Password</Label><Input className="mt-1.5" type="password" value={password.current} onChange={(e) => setPassword((p) => ({ ...p, current: e.target.value }))} /></div>
            <div><Label>New Password</Label><Input className="mt-1.5" type="password" value={password.new} onChange={(e) => setPassword((p) => ({ ...p, new: e.target.value }))} /></div>
            <div><Label>Confirm New Password</Label><Input className="mt-1.5" type="password" value={password.confirm} onChange={(e) => setPassword((p) => ({ ...p, confirm: e.target.value }))} /></div>
          </FormSection>
          <Button variant="outline" onClick={handleUpdatePassword} disabled={savingPw}>
            {savingPw ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
            Update Password
          </Button>
        </div>
      </div>
    </div>
  );
}
