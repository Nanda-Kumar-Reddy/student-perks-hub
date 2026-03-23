/**
 * Edit Community Task Dialog
 */
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

interface EditCommunityTaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  task: {
    id: string;
    title: string;
    description: string;
    location: string;
    payment: string | number;
    duration: string;
  } | null;
}

export default function EditCommunityTaskDialog({ open, onOpenChange, task }: EditCommunityTaskDialogProps) {
  const { toast } = useToast();
  const [title, setTitle] = useState(task?.title || "");
  const [description, setDescription] = useState(task?.description || "");
  const [location, setLocation] = useState(task?.location || "");
  const [payment, setPayment] = useState(String(task?.payment || ""));
  const [duration, setDuration] = useState(task?.duration || "");

  // Update state when task changes
  if (task && title !== task.title && !open) {
    setTitle(task.title);
    setDescription(task.description);
    setLocation(task.location);
    setPayment(String(task.payment));
    setDuration(task.duration);
  }

  const handleSubmit = () => {
    if (!title.trim()) {
      toast({ title: "Title required", variant: "destructive" });
      return;
    }
    toast({ title: "Edit submitted", description: "Your changes have been submitted for admin approval." });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Community Task</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium">Title</label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>
          <div>
            <label className="text-sm font-medium">Description</label>
            <Textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium">Location</label>
              <Input value={location} onChange={(e) => setLocation(e.target.value)} />
            </div>
            <div>
              <label className="text-sm font-medium">Duration</label>
              <Input value={duration} onChange={(e) => setDuration(e.target.value)} />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium">Payment ($)</label>
            <Input type="number" value={payment} onChange={(e) => setPayment(e.target.value)} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleSubmit}>Submit for Approval</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
