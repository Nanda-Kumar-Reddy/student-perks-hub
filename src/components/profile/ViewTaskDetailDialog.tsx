import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import {
  MapPin, Clock, DollarSign, Star, User, Shield, Car, Baby,
  Briefcase, Award, MessageCircle, Heart,
} from "lucide-react";

interface TaskDetail {
  id: string;
  title: string;
  category: string;
  description: string;
  location: string;
  date: string;
  time: string;
  duration: string;
  payment: string;
  poster: {
    name: string;
    rating: number;
    responseRate: string;
    completedTasks: number;
  };
  qualifications: {
    requiresExperience: boolean;
    requiresTransport: boolean;
    requiresPoliceCheck: boolean;
    requiresChildrenCheck: boolean;
    requiresFirstAid: boolean;
  };
}

interface ViewTaskDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  task: TaskDetail | null;
}

export default function ViewTaskDetailDialog({ open, onOpenChange, task }: ViewTaskDetailDialogProps) {
  if (!task) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[85vh] flex flex-col p-0 gap-0">
        <DialogHeader className="px-5 pt-5 pb-3 border-b border-border">
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="secondary" className="text-[10px]">{task.category}</Badge>
          </div>
          <DialogTitle className="text-base font-display leading-snug">{task.title}</DialogTitle>
          <div className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
            <MapPin className="h-3 w-3" /> {task.location}
          </div>
        </DialogHeader>

        <ScrollArea className="flex-1">
          <div className="p-5 space-y-5">
            {/* Quick Info Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {[
                { icon: <Clock className="h-3.5 w-3.5" />, label: "Date", value: task.date },
                { icon: <Clock className="h-3.5 w-3.5" />, label: "Time", value: task.time },
                { icon: <Clock className="h-3.5 w-3.5" />, label: "Duration", value: task.duration },
                { icon: <DollarSign className="h-3.5 w-3.5" />, label: "Payment", value: task.payment },
              ].map((d) => (
                <div key={d.label} className="rounded-lg bg-secondary/50 p-2.5 text-center">
                  <div className="flex justify-center text-primary mb-0.5">{d.icon}</div>
                  <div className="text-[10px] text-muted-foreground">{d.label}</div>
                  <div className="text-xs font-medium mt-0.5">{d.value}</div>
                </div>
              ))}
            </div>

            {/* Description */}
            <div>
              <h3 className="text-sm font-display font-bold mb-1.5">Description</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">{task.description}</p>
            </div>

            {/* Qualifications */}
            <div>
              <h3 className="text-sm font-display font-bold mb-1.5">Required Qualifications</h3>
              <div className="flex flex-wrap gap-1.5">
                {task.qualifications.requiresExperience && (
                  <Badge variant="outline" className="gap-1 text-[10px]"><Briefcase className="h-3 w-3" /> Previous Experience</Badge>
                )}
                {task.qualifications.requiresTransport && (
                  <Badge variant="outline" className="gap-1 text-[10px]"><Car className="h-3 w-3" /> Own Transport</Badge>
                )}
                {task.qualifications.requiresPoliceCheck && (
                  <Badge variant="outline" className="gap-1 text-[10px]"><Shield className="h-3 w-3" /> Police Check</Badge>
                )}
                {task.qualifications.requiresChildrenCheck && (
                  <Badge variant="outline" className="gap-1 text-[10px]"><Baby className="h-3 w-3" /> Children Check</Badge>
                )}
                {task.qualifications.requiresFirstAid && (
                  <Badge variant="outline" className="gap-1 text-[10px]"><Award className="h-3 w-3" /> First Aid</Badge>
                )}
                {!Object.values(task.qualifications).some(Boolean) && (
                  <p className="text-xs text-muted-foreground">No specific qualifications required.</p>
                )}
              </div>
            </div>

            {/* Poster Info */}
            <div className="rounded-xl border border-border bg-secondary/30 p-4">
              <h3 className="text-sm font-display font-bold mb-2.5">Posted By</h3>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <User className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-sm font-medium">{task.poster.name}</div>
                  <div className="flex items-center gap-1 text-xs text-warning">
                    <Star className="h-3 w-3 fill-warning" /> {task.poster.rating}
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 mt-3 text-xs">
                <div className="rounded-lg bg-background p-2 text-center">
                  <div className="text-muted-foreground">Response Rate</div>
                  <div className="font-medium mt-0.5">{task.poster.responseRate}</div>
                </div>
                <div className="rounded-lg bg-background p-2 text-center">
                  <div className="text-muted-foreground">Completed</div>
                  <div className="font-medium mt-0.5">{task.poster.completedTasks} tasks</div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <Button className="flex-1 text-xs gap-1">
                <MessageCircle className="h-3.5 w-3.5" /> Chat with Poster
              </Button>
              <Button variant="outline" className="text-xs gap-1">
                <Heart className="h-3.5 w-3.5" /> Save
              </Button>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
