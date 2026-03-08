import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  ShieldCheck, Clock, MapPin, DollarSign, User, Mail, CheckCircle2,
  XCircle, Edit, Flag, AlertTriangle, ChevronDown, ChevronUp, Save
} from "lucide-react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter
} from "@/components/ui/dialog";
import { toast } from "sonner";
import FormSection from "@/components/shared/FormSection";

interface PendingTask {
  id: string;
  title: string;
  poster: string;
  email: string;
  userHistory: string;
  category: string;
  location: string;
  payment: string;
  description: string;
  date: string;
  duration: string;
  time: string;
  checks: { keyword: boolean; payment: boolean; history: boolean; location: boolean };
}

const categories = [
  "Home & Garden", "Childcare", "Tutoring", "Cleaning",
  "Moving", "Pet Care", "Technology Help", "Event Help",
  "Delivery", "Other",
];

const pendingTasks: PendingTask[] = [
  {
    id: "1", title: "Garden Maintenance — Mowing & Weeding",
    poster: "Sarah Mitchell", email: "sarah@university.edu", userHistory: "15 completed tasks, 4.8 rating",
    category: "Home & Garden", location: "Carlton, VIC", payment: "$90",
    description: "Need someone to mow the lawn and weed the garden beds. Tools provided.",
    date: "2026-03-15", duration: "3 hours", time: "09:00",
    checks: { keyword: true, payment: true, history: true, location: true },
  },
  {
    id: "2", title: "Babysitting — Saturday Evening",
    poster: "James Kim", email: "james@university.edu", userHistory: "3 completed tasks, 4.5 rating",
    category: "Childcare", location: "South Yarra, VIC", payment: "$150",
    description: "Looking for an experienced babysitter for two children aged 4 and 7.",
    date: "2026-03-16", duration: "5 hours", time: "18:00",
    checks: { keyword: true, payment: true, history: true, location: true },
  },
  {
    id: "3", title: "Help Moving Items Quickly",
    poster: "New User", email: "new@student.edu", userHistory: "0 completed tasks, no rating",
    category: "Moving", location: "Unknown Area", payment: "$10",
    description: "Need urgent help moving some items. Cash payment.",
    date: "2026-03-18", duration: "2 hours", time: "10:00",
    checks: { keyword: true, payment: false, history: false, location: false },
  },
];

const checkLabel = (passed: boolean) => passed
  ? <span className="flex items-center gap-1 text-xs text-success"><CheckCircle2 className="h-3 w-3" /> Passed</span>
  : <span className="flex items-center gap-1 text-xs text-destructive"><XCircle className="h-3 w-3" /> Failed</span>;

export default function AdminCommunityTasksPage() {
  const [tasks, setTasks] = useState(pendingTasks);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [rejectOpen, setRejectOpen] = useState(false);
  const [rejectId, setRejectId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState("");

  // Edit state
  const [editOpen, setEditOpen] = useState(false);
  const [editTask, setEditTask] = useState<PendingTask | null>(null);
  const [editForm, setEditForm] = useState({
    title: "", category: "", description: "", location: "",
    date: "", time: "", duration: "", payment: "",
  });

  const handleAction = (id: string, action: "approve" | "reject" | "flag") => {
    const labels = { approve: "approved", reject: "rejected", flag: "flagged for review" };
    setTasks((prev) => prev.filter((t) => t.id !== id));
    toast.success(`Task ${labels[action]} successfully`);
    if (action === "reject") { setRejectOpen(false); setRejectReason(""); }
  };

  const openEditDialog = (task: PendingTask) => {
    setEditTask(task);
    setEditForm({
      title: task.title,
      category: task.category,
      description: task.description,
      location: task.location,
      date: task.date,
      time: task.time,
      duration: task.duration,
      payment: task.payment.replace("$", ""),
    });
    setEditOpen(true);
  };

  const handleSaveEdit = () => {
    if (!editTask) return;
    setTasks((prev) =>
      prev.map((t) =>
        t.id === editTask.id
          ? {
              ...t,
              title: editForm.title,
              category: editForm.category,
              description: editForm.description,
              location: editForm.location,
              date: editForm.date,
              time: editForm.time,
              duration: editForm.duration,
              payment: `$${editForm.payment}`,
            }
          : t
      )
    );
    setEditOpen(false);
    setEditTask(null);
    toast.success("Task details updated successfully");
  };

  const updateEdit = (key: string, value: string) =>
    setEditForm((p) => ({ ...p, [key]: value }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold flex items-center gap-2">
          <ShieldCheck className="h-6 w-6 text-primary" /> Community Task Approvals
        </h1>
        <p className="text-sm text-muted-foreground mt-1">{tasks.length} tasks pending review</p>
      </div>

      <div className="space-y-4">
        {tasks.map((task) => (
          <div key={task.id} className="rounded-xl border border-border bg-card shadow-card overflow-hidden">
            <div
              className="p-5 cursor-pointer"
              onClick={() => setExpanded(expanded === task.id ? null : task.id)}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-medium text-sm">{task.title}</h3>
                    <Badge variant="secondary">{task.category}</Badge>
                  </div>
                  <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><User className="h-3 w-3" /> {task.poster}</span>
                    <span className="flex items-center gap-1"><Mail className="h-3 w-3" /> {task.email}</span>
                    <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {task.location}</span>
                    <span className="flex items-center gap-1 font-semibold text-success"><DollarSign className="h-3 w-3" /> {task.payment}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {!task.checks.payment || !task.checks.history || !task.checks.location ? (
                    <Badge variant="destructive" className="gap-1"><AlertTriangle className="h-3 w-3" /> Issues</Badge>
                  ) : (
                    <Badge className="bg-success/10 text-success border-success/20 gap-1"><CheckCircle2 className="h-3 w-3" /> Clear</Badge>
                  )}
                  {expanded === task.id ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </div>
              </div>
            </div>

            {expanded === task.id && (
              <div className="border-t border-border p-5 space-y-4">
                <div>
                  <h4 className="text-xs font-medium text-muted-foreground mb-1">Description</h4>
                  <p className="text-sm">{task.description}</p>
                </div>
                <div>
                  <h4 className="text-xs font-medium text-muted-foreground mb-1">User History</h4>
                  <p className="text-sm">{task.userHistory}</p>
                </div>

                {/* Automated Checks */}
                <div>
                  <h4 className="text-xs font-medium text-muted-foreground mb-2">Automated Checks</h4>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    <div className="rounded-lg bg-secondary/50 p-2">
                      <div className="text-[10px] text-muted-foreground">Keyword Check</div>
                      {checkLabel(task.checks.keyword)}
                    </div>
                    <div className="rounded-lg bg-secondary/50 p-2">
                      <div className="text-[10px] text-muted-foreground">Min Payment</div>
                      {checkLabel(task.checks.payment)}
                    </div>
                    <div className="rounded-lg bg-secondary/50 p-2">
                      <div className="text-[10px] text-muted-foreground">User History</div>
                      {checkLabel(task.checks.history)}
                    </div>
                    <div className="rounded-lg bg-secondary/50 p-2">
                      <div className="text-[10px] text-muted-foreground">Location Valid</div>
                      {checkLabel(task.checks.location)}
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  <Button size="sm" className="gap-1" onClick={() => handleAction(task.id, "approve")}>
                    <CheckCircle2 className="h-3.5 w-3.5" /> Approve
                  </Button>
                  <Button size="sm" variant="destructive" className="gap-1" onClick={() => { setRejectId(task.id); setRejectOpen(true); }}>
                    <XCircle className="h-3.5 w-3.5" /> Reject
                  </Button>
                  <Button size="sm" variant="outline" className="gap-1" onClick={(e) => { e.stopPropagation(); openEditDialog(task); }}>
                    <Edit className="h-3.5 w-3.5" /> Edit
                  </Button>
                  <Button size="sm" variant="outline" className="gap-1 text-warning hover:text-warning" onClick={() => handleAction(task.id, "flag")}>
                    <Flag className="h-3.5 w-3.5" /> Flag for Review
                  </Button>
                </div>
              </div>
            )}
          </div>
        ))}

        {tasks.length === 0 && (
          <div className="text-center py-12 text-muted-foreground rounded-xl border border-border bg-card">
            <CheckCircle2 className="h-8 w-8 mx-auto mb-2 text-success" />
            <p className="text-sm">All caught up! No tasks pending review.</p>
          </div>
        )}
      </div>

      {/* Reject Dialog */}
      <Dialog open={rejectOpen} onOpenChange={setRejectOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Task</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">Provide a reason for rejection. This will be sent to the user.</p>
            <Textarea
              placeholder="Reason for rejection..."
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              rows={3}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRejectOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={() => rejectId && handleAction(rejectId, "reject")}>Reject Task</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Task Dialog */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-display flex items-center gap-2">
              <Edit className="h-5 w-5 text-primary" /> Edit Community Task
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            <FormSection title="Task Details">
              <div>
                <Label>Title</Label>
                <Input className="mt-1.5" value={editForm.title} onChange={(e) => updateEdit("title", e.target.value)} />
              </div>
              <div>
                <Label>Category</Label>
                <Select value={editForm.category} onValueChange={(v) => updateEdit("category", v)}>
                  <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {categories.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Description</Label>
                <Textarea className="mt-1.5" rows={4} value={editForm.description} onChange={(e) => updateEdit("description", e.target.value)} />
              </div>
              <div>
                <Label>Location</Label>
                <Input className="mt-1.5" value={editForm.location} onChange={(e) => updateEdit("location", e.target.value)} />
              </div>
            </FormSection>

            <FormSection title="Schedule & Payment">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Date</Label>
                  <Input className="mt-1.5" type="date" value={editForm.date} onChange={(e) => updateEdit("date", e.target.value)} />
                </div>
                <div>
                  <Label>Time</Label>
                  <Input className="mt-1.5" type="time" value={editForm.time} onChange={(e) => updateEdit("time", e.target.value)} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Duration</Label>
                  <Input className="mt-1.5" placeholder="e.g., 3 hours" value={editForm.duration} onChange={(e) => updateEdit("duration", e.target.value)} />
                </div>
                <div>
                  <Label>Payment ($)</Label>
                  <Input className="mt-1.5" type="number" value={editForm.payment} onChange={(e) => updateEdit("payment", e.target.value)} />
                </div>
              </div>
            </FormSection>

            {editTask && (
              <div className="rounded-lg bg-secondary/50 p-3 space-y-1">
                <h4 className="text-xs font-medium text-muted-foreground">Posted By</h4>
                <p className="text-sm">{editTask.poster} · {editTask.email}</p>
                <p className="text-xs text-muted-foreground">{editTask.userHistory}</p>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setEditOpen(false)}>Cancel</Button>
            <Button className="gap-1.5" onClick={handleSaveEdit}>
              <Save className="h-4 w-4" /> Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
