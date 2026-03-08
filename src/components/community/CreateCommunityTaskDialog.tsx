import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import FormSection from "@/components/shared/FormSection";
import { toast } from "sonner";

const categories = [
  "Home & Garden", "Childcare", "Tutoring", "Cleaning",
  "Moving", "Pet Care", "Technology Help", "Event Help",
  "Delivery", "Other",
];

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function CreateCommunityTaskDialog({ open, onOpenChange }: Props) {
  const [form, setForm] = useState({
    title: "", category: "", description: "", location: "",
    date: "", time: "", duration: "", payment: "",
    requiresExperience: false, requiresTransport: false,
    requiresPoliceCheck: false, requiresChildrenCheck: false,
    requiresFirstAid: false,
    showPhonePublicly: false, chatThroughApp: true,
    agreeTerms: false, understandApproval: false,
  });

  const update = (key: string, value: any) => setForm((p) => ({ ...p, [key]: value }));

  const canSubmit = form.title && form.category && form.description && form.location &&
    form.date && form.time && form.duration && form.payment && form.agreeTerms && form.understandApproval;

  const handleSubmit = () => {
    toast.success("Task submitted for admin approval!", {
      description: "You'll be notified once it's reviewed.",
    });
    onOpenChange(false);
    setForm({
      title: "", category: "", description: "", location: "",
      date: "", time: "", duration: "", payment: "",
      requiresExperience: false, requiresTransport: false,
      requiresPoliceCheck: false, requiresChildrenCheck: false,
      requiresFirstAid: false,
      showPhonePublicly: false, chatThroughApp: true,
      agreeTerms: false, understandApproval: false,
    });
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
          <Button onClick={handleSubmit} disabled={!canSubmit}>Submit for Approval</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
