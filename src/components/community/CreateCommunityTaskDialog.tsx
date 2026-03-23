import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import FormSection from "@/components/shared/FormSection";
import { toast } from "sonner";
import { createCommunityTask, updateCommunityTask } from "@/services/database";

const categories = [
  "Home & Garden", "Childcare", "Tutoring", "Cleaning",
  "Moving", "Pet Care", "Technology Help", "Event Help",
  "Delivery", "Other",
];

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialValues?: Record<string, any> | null;
  taskId?: string;
  onSubmitted?: () => void;
}

export default function CreateCommunityTaskDialog({ open, onOpenChange, initialValues = null, taskId, onSubmitted }: Props) {
  const [form, setForm] = useState({
    title: "", category: "", description: "", location: "",
    date: "", time: "", duration: "", payment: "",
    requiresExperience: false, requiresTransport: false,
    requiresPoliceCheck: false, requiresChildrenCheck: false,
    requiresFirstAid: false,
    showPhonePublicly: false, chatThroughApp: true,
    agreeTerms: false, understandApproval: false,
  });
  const [submitting, setSubmitting] = useState(false);

  const resetForm = () => setForm({
    title: "", category: "", description: "", location: "",
    date: "", time: "", duration: "", payment: "",
    requiresExperience: false, requiresTransport: false,
    requiresPoliceCheck: false, requiresChildrenCheck: false,
    requiresFirstAid: false,
    showPhonePublicly: false, chatThroughApp: true,
    agreeTerms: false, understandApproval: false,
  });

  useEffect(() => {
    if (!open) return;

    if (initialValues) {
      setForm((prev) => ({
        ...prev,
        ...initialValues,
        payment: String(initialValues.payment ?? ""),
        date: initialValues.date ? String(initialValues.date).slice(0, 10) : "",
        agreeTerms: true,
        understandApproval: true,
      }));
      return;
    }

    resetForm();
  }, [initialValues, open]);

  const update = (key: string, value: any) => setForm((p) => ({ ...p, [key]: value }));

  const canSubmit = form.title && form.category && form.description && form.location &&
    form.date && form.time && form.duration && form.payment && form.agreeTerms && form.understandApproval;

  const handleSubmit = async () => {
    if (!canSubmit || submitting) return;
    setSubmitting(true);
    try {
      const payload = {
        ...form,
        payment: Number(form.payment),
        date: new Date(`${form.date}T00:00:00`).toISOString(),
      };

      if (taskId) {
        await updateCommunityTask(taskId, payload);
        toast.success("Task update sent for admin approval!", {
          description: "Your changes will go live after review.",
        });
      } else {
        await createCommunityTask(payload);
        toast.success("Task submitted for admin approval!", {
          description: "You'll be notified once it's reviewed.",
        });
      }

      onOpenChange(false);
      resetForm();
      onSubmitted?.();
    } catch (error: any) {
      toast.error(error.message || "Unable to submit task");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display">Create Community Task</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <FormSection title="Task Details">
            <div>
              <Label>Title <span className="text-destructive">*</span></Label>
              <Input className="mt-1.5" placeholder="e.g., Garden Maintenance" value={form.title} onChange={(e) => update("title", e.target.value)} />
            </div>
            <div>
              <Label>Category <span className="text-destructive">*</span></Label>
              <Select value={form.category} onValueChange={(v) => update("category", v)}>
                <SelectTrigger className="mt-1.5"><SelectValue placeholder="Select a category" /></SelectTrigger>
                <SelectContent>
                  {categories.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Description <span className="text-destructive">*</span></Label>
              <Textarea className="mt-1.5" placeholder="Describe the task in detail..." value={form.description} onChange={(e) => update("description", e.target.value)} rows={4} />
            </div>
            <div>
              <Label>Location <span className="text-destructive">*</span></Label>
              <Input className="mt-1.5" placeholder="e.g., Carlton, VIC" value={form.location} onChange={(e) => update("location", e.target.value)} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Date <span className="text-destructive">*</span></Label>
                <Input className="mt-1.5" type="date" value={form.date} onChange={(e) => update("date", e.target.value)} />
              </div>
              <div>
                <Label>Time <span className="text-destructive">*</span></Label>
                <Input className="mt-1.5" type="time" value={form.time} onChange={(e) => update("time", e.target.value)} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Duration <span className="text-destructive">*</span></Label>
                <Input className="mt-1.5" placeholder="e.g., 3 hours" value={form.duration} onChange={(e) => update("duration", e.target.value)} />
              </div>
              <div>
                <Label>Payment Offered ($) <span className="text-destructive">*</span></Label>
                <Input className="mt-1.5" type="number" placeholder="e.g., 90" value={form.payment} onChange={(e) => update("payment", e.target.value)} />
              </div>
            </div>
          </FormSection>

          <FormSection title="Worker Qualifications (Optional)">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { key: "requiresExperience", label: "Previous experience" },
                { key: "requiresTransport", label: "Own transport" },
                { key: "requiresPoliceCheck", label: "Police check" },
                { key: "requiresChildrenCheck", label: "Working with children check" },
                { key: "requiresFirstAid", label: "First aid certification" },
              ].map((q) => (
                <div key={q.key} className="flex items-center gap-2">
                  <Checkbox
                    checked={(form as any)[q.key]}
                    onCheckedChange={(v) => update(q.key, Boolean(v))}
                  />
                  <Label className="text-sm font-normal cursor-pointer">{q.label}</Label>
                </div>
              ))}
            </div>
          </FormSection>

          <FormSection title="Contact Preference">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Checkbox checked={form.showPhonePublicly} onCheckedChange={(v) => update("showPhonePublicly", Boolean(v))} />
                <Label className="text-sm font-normal">Show phone publicly</Label>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox checked={form.chatThroughApp} onCheckedChange={(v) => update("chatThroughApp", Boolean(v))} />
                <Label className="text-sm font-normal">Chat through app</Label>
              </div>
            </div>
          </FormSection>

          <FormSection title="Terms & Conditions">
            <div className="space-y-3">
              <div className="flex items-start gap-2">
                <Checkbox checked={form.agreeTerms} onCheckedChange={(v) => update("agreeTerms", Boolean(v))} className="mt-0.5" />
                <Label className="text-sm font-normal">I agree to the Community Tasks Terms <span className="text-destructive">*</span></Label>
              </div>
              <div className="flex items-start gap-2">
                <Checkbox checked={form.understandApproval} onCheckedChange={(v) => update("understandApproval", Boolean(v))} className="mt-0.5" />
                <Label className="text-sm font-normal">I understand this post requires admin approval <span className="text-destructive">*</span></Label>
              </div>
            </div>
          </FormSection>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={!canSubmit || submitting}>{submitting ? "Saving..." : taskId ? "Save for Approval" : "Submit for Approval"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
