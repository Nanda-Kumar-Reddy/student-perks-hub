import { useState, useEffect, useMemo } from "react";
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
import { getProfile, updateProfile, updateCommunityTaskStatus } from "@/services/database";
import { getMyActiveTasks, getMyPendingApprovals, getMyTaskHistory } from "@/services/database";
import { updatePassword } from "@/services/auth";
import { toast } from "@/hooks/use-toast";
import ViewTaskDetailDialog from "@/components/profile/ViewTaskDetailDialog";
import CreateCommunityTaskDialog from "@/components/community/CreateCommunityTaskDialog";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const verificationBadges = [
  { label: "Phone Verified", icon: <Phone className="h-3.5 w-3.5" />, verified: true },
  { label: "Email Verified", icon: <Mail className="h-3.5 w-3.5" />, verified: true },
  { label: "ID Uploaded", icon: <FileCheck className="h-3.5 w-3.5" />, verified: false },
  { label: "Police Check", icon: <Shield className="h-3.5 w-3.5" />, verified: false },
];

const skills = ["Gardening", "Childcare", "First Aid", "Driver License"];

const taskDetails: Record<string, any> = {
  "1": {
    id: "1", title: "Garden Maintenance — Mowing & Weeding", category: "Home & Garden",
    description: "Need someone to mow the front and back lawn, weed the garden beds, and trim the hedges. All tools and equipment will be provided. The property is a standard suburban block.",
    location: "42 Oak Street, Carlton, VIC 3053", date: "March 15, 2026", time: "9:00 AM", duration: "3 hours", payment: "$90",
    poster: { name: "Sarah Mitchell", rating: 4.8, responseRate: "92%", completedTasks: 15 },
    qualifications: { requiresExperience: true, requiresTransport: false, requiresPoliceCheck: false, requiresChildrenCheck: false, requiresFirstAid: false },
  },
  "2": {
    id: "2", title: "Babysitting — Saturday Evening", category: "Childcare",
    description: "Looking for an experienced babysitter for two children aged 4 and 7. Kids are well-behaved. Need someone from 6 PM to 11 PM. Dinner will be provided.",
    location: "18 Elm Ave, South Yarra, VIC 3141", date: "March 16, 2026", time: "6:00 PM", duration: "5 hours", payment: "$150",
    poster: { name: "James Cooper", rating: 4.5, responseRate: "88%", completedTasks: 8 },
    qualifications: { requiresExperience: true, requiresTransport: false, requiresPoliceCheck: false, requiresChildrenCheck: true, requiresFirstAid: true },
  },
  "3": {
    id: "3", title: "Help Moving Furniture", category: "Moving",
    description: "Need help moving furniture from a 2-bedroom apartment to a new location 15 minutes away. Items include a couch, bed frame, desk, and boxes.",
    location: "7 Rose St, Fitzroy, VIC 3065", date: "March 18, 2026", time: "10:00 AM", duration: "4 hours", payment: "$160",
    poster: { name: "Emily Chen", rating: 4.9, responseRate: "95%", completedTasks: 22 },
    qualifications: { requiresExperience: false, requiresTransport: true, requiresPoliceCheck: false, requiresChildrenCheck: false, requiresFirstAid: false },
  },
};
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
  const [appDialogOpen, setAppDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<{ id: string; title: string } | null>(null);
  const [activeTasks, setActiveTasks] = useState<any[]>([]);
  const [pendingApprovals, setPendingApprovals] = useState<any[]>([]);
  const [taskHistory, setTaskHistory] = useState<any[]>([]);
  const [confirmAction, setConfirmAction] = useState<{ taskId: string; taskTitle: string; type: "FILLED" | "CANCELLED" } | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    university: "",
  });
  const [password, setPassword] = useState({ current: "", new: "", confirm: "" });
  const update = (k: string, v: string) => setForm((p) => ({ ...p, [k]: v }));
  const selectedTaskData = useMemo(() => {
    if (!selectedTask) return null;
    const liveTask = activeTasks.find((task) => task.id === selectedTask.id) || pendingApprovals.find((task) => task.id === selectedTask.id);
    return liveTask ? {
      ...liveTask,
      poster: taskDetails[selectedTask.id]?.poster || { name: user?.fullName || "User", rating: 5, responseRate: "100%", completedTasks: 0 },
      qualifications: {
        requiresExperience: Boolean(liveTask.requiresExperience),
        requiresTransport: Boolean(liveTask.requiresTransport),
        requiresPoliceCheck: Boolean(liveTask.requiresPoliceCheck),
        requiresChildrenCheck: Boolean(liveTask.requiresChildrenCheck),
        requiresFirstAid: Boolean(liveTask.requiresFirstAid),
      },
    } : taskDetails[selectedTask.id] || null;
  }, [activeTasks, pendingApprovals, selectedTask, user?.fullName]);

  const loadTaskData = async () => {
    if (!user) return;
    try {
      const [active, pending, history] = await Promise.all([
        getMyActiveTasks(),
        getMyPendingApprovals(),
        getMyTaskHistory(),
      ]);
      setActiveTasks(active.data || []);
      setPendingApprovals(pending.data || []);
      setTaskHistory(history.data || []);
    } catch {
      setActiveTasks([]);
      setPendingApprovals([]);
      setTaskHistory([]);
    }
  };

  // Load profile from database
  useEffect(() => {
    if (!user) return;
    setForm((p) => ({ ...p, name: user.fullName, email: user.email }));
    getProfile(user.id)
      .then((profile) => {
        setForm((prev) => ({
          ...prev,
          name: profile?.full_name || profile?.fullName || prev.name || user.fullName || "User",
          phone: profile?.phone || "",
          address: profile?.address || "",
          university: profile?.university || "",
        }));
        setProfileLoaded(true);
      })
      .catch(() => setProfileLoaded(true));
    loadTaskData();
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

  const handleTaskAction = async () => {
    if (!confirmAction) return;
    setActionLoading(true);
    try {
      await updateCommunityTaskStatus(confirmAction.taskId, confirmAction.type);
      setActiveTasks((prev) => prev.filter((t) => t.id !== confirmAction.taskId));
      toast({
        title: confirmAction.type === "FILLED" ? "Task marked as filled" : "Task cancelled",
        description: confirmAction.type === "FILLED"
          ? `"${confirmAction.taskTitle}" has been marked as filled and removed from active tasks.`
          : `"${confirmAction.taskTitle}" has been cancelled and removed.`,
      });
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setActionLoading(false);
      setConfirmAction(null);
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
                  <p className="text-xs text-muted-foreground mt-1">{t._count?.applications || t.applications || 0} applications</p>
                </div>
                <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${statusColor[t.status]}`}>
                  {t.status.replace("_", " ")}
                </span>
              </div>
              <div className="flex gap-2 mt-3">
                <Button size="sm" variant="outline" className="text-xs gap-1" onClick={() => { setSelectedTask({ id: t.id, title: t.title }); setAppDialogOpen(true); }}><Eye className="h-3 w-3" /> View Application</Button>
                <Button size="sm" variant="outline" className="text-xs gap-1" onClick={() => { setSelectedTask({ id: t.id, title: t.title }); setEditDialogOpen(true); }}>Edit</Button>
                <Button size="sm" variant="outline" className="text-xs gap-1" onClick={() => setConfirmAction({ taskId: t.id, taskTitle: t.title, type: "FILLED" })}><CheckCircle2 className="h-3 w-3" /> Mark Filled</Button>
                <Button size="sm" variant="outline" className="text-xs gap-1 text-destructive hover:text-destructive" onClick={() => setConfirmAction({ taskId: t.id, taskTitle: t.title, type: "CANCELLED" })}><XCircle className="h-3 w-3" /> Cancel</Button>
              </div>
            </div>
          ))}
          {activeTasks.length === 0 && (
            <div className="rounded-xl border border-border bg-card p-8 text-center">
              <CheckCircle2 className="h-8 w-8 text-muted-foreground/40 mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">No active tasks</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="pending" className="space-y-3 mt-4">
          {pendingApprovals.map((t) => (
            <div key={t.id} className="rounded-xl border border-border bg-card p-4 shadow-card">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div>
                  <h3 className="text-sm font-medium">{t.title}</h3>
                  <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1"><Clock className="h-3 w-3" /> Submitted {t.createdAt ? new Date(t.createdAt).toLocaleString() : t.submitted}</p>
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
                  <p className="text-xs text-muted-foreground mt-1">{t.duration || "—"} · {t.payment ? `$${t.payment}` : "—"} · Worker: {t.workerName || t.worker || "—"}</p>
                </div>
                <div className="flex items-center gap-1">
                  {Array.from({ length: t.rating || 0 }).map((_, i) => (
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
      {selectedTask && (
        <ViewTaskDetailDialog
          open={appDialogOpen}
          onOpenChange={setAppDialogOpen}
          task={selectedTaskData}
        />
      )}
      {selectedTask && (
        <CreateCommunityTaskDialog
          open={editDialogOpen}
          onOpenChange={setEditDialogOpen}
          taskId={selectedTask.id}
          initialValues={selectedTaskData}
          onSubmitted={loadTaskData}
        />
      )}

      {/* Confirm Mark Filled / Cancel Dialog */}
      <AlertDialog open={!!confirmAction} onOpenChange={(open) => !open && setConfirmAction(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {confirmAction?.type === "FILLED" ? "Mark Task as Filled?" : "Cancel Task?"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {confirmAction?.type === "FILLED"
                ? `Are you sure you want to mark "${confirmAction?.taskTitle}" as filled? This will close the task and stop accepting new applications.`
                : `Are you sure you want to cancel "${confirmAction?.taskTitle}"? This action cannot be undone and the task will be removed permanently.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={actionLoading}>Go Back</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleTaskAction}
              disabled={actionLoading}
              className={confirmAction?.type === "CANCELLED" ? "bg-destructive text-destructive-foreground hover:bg-destructive/90" : ""}
            >
              {actionLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              {confirmAction?.type === "FILLED" ? "Mark as Filled" : "Cancel Task"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
