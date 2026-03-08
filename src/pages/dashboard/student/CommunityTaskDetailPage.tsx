import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  MapPin, Clock, DollarSign, Star, User, Shield, Car, Baby,
  Heart, AlertTriangle, Send, MessageCircle, ArrowLeft, CheckCircle2,
  Briefcase, Award
} from "lucide-react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter
} from "@/components/ui/dialog";

const task = {
  id: "1",
  title: "Garden Maintenance — Mowing & Weeding",
  category: "Home & Garden",
  description: "Need someone to mow the front and back lawn, weed the garden beds, and trim the hedges. All tools and equipment will be provided. The property is a standard suburban block. Preferably someone with gardening experience but not essential.",
  location: "42 Oak Street, Carlton, VIC 3053",
  date: "March 15, 2026",
  time: "9:00 AM",
  duration: "3 hours",
  payment: "$90",
  poster: {
    name: "Sarah Mitchell",
    rating: 4.8,
    responseRate: "92%",
    memberSince: "Jun 2024",
    completedTasks: 15,
  },
  qualifications: {
    requiresExperience: true,
    requiresTransport: false,
    requiresPoliceCheck: false,
    requiresChildrenCheck: false,
    requiresFirstAid: false,
  },
};

const messages = [
  { id: "1", sender: "Sarah Mitchell", content: "Hi! Are you interested in this task?", time: "10:30 AM", isOwner: true },
  { id: "2", sender: "You", content: "Yes, I have experience with gardening. When should I arrive?", time: "10:45 AM", isOwner: false },
  { id: "3", sender: "Sarah Mitchell", content: "Great! Please come at 9 AM sharp. I'll have everything ready.", time: "11:00 AM", isOwner: true },
];

export default function CommunityTaskDetailPage() {
  const { id } = useParams();
  const [applyOpen, setApplyOpen] = useState(false);
  const [applyMessage, setApplyMessage] = useState("");
  const [applied, setApplied] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [chatMessages, setChatMessages] = useState(messages);

  const handleApply = () => {
    setApplied(true);
    setApplyOpen(false);
  };

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    setChatMessages((prev) => [...prev, {
      id: String(prev.length + 1),
      sender: "You",
      content: newMessage,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      isOwner: false,
    }]);
    setNewMessage("");
  };

  return (
    <div className="space-y-6">
      <Link to="/student/community-tasks" className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors">
        <ArrowLeft className="h-4 w-4" /> Back to Tasks
      </Link>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-xl border border-border bg-card p-6 shadow-card">
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="secondary">{task.category}</Badge>
            </div>
            <h1 className="font-display text-xl font-bold">{task.title}</h1>
            <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
              <MapPin className="h-3.5 w-3.5" /> {task.location}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
              {[
                { icon: <Clock className="h-4 w-4" />, label: "Date", value: task.date },
                { icon: <Clock className="h-4 w-4" />, label: "Time", value: task.time },
                { icon: <Clock className="h-4 w-4" />, label: "Duration", value: task.duration },
                { icon: <DollarSign className="h-4 w-4" />, label: "Payment", value: task.payment },
              ].map((d) => (
                <div key={d.label} className="rounded-lg bg-secondary/50 p-3 text-center">
                  <div className="flex justify-center text-primary mb-1">{d.icon}</div>
                  <div className="text-xs text-muted-foreground">{d.label}</div>
                  <div className="text-sm font-medium mt-0.5">{d.value}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card p-6 shadow-card">
            <h2 className="font-display font-bold mb-3">Description</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">{task.description}</p>
          </div>

          <div className="rounded-xl border border-border bg-card p-6 shadow-card">
            <h2 className="font-display font-bold mb-3">Required Qualifications</h2>
            <div className="flex flex-wrap gap-2">
              {task.qualifications.requiresExperience && (
                <Badge variant="outline" className="gap-1"><Briefcase className="h-3 w-3" /> Previous Experience</Badge>
              )}
              {task.qualifications.requiresTransport && (
                <Badge variant="outline" className="gap-1"><Car className="h-3 w-3" /> Own Transport</Badge>
              )}
              {task.qualifications.requiresPoliceCheck && (
                <Badge variant="outline" className="gap-1"><Shield className="h-3 w-3" /> Police Check</Badge>
              )}
              {task.qualifications.requiresChildrenCheck && (
                <Badge variant="outline" className="gap-1"><Baby className="h-3 w-3" /> Children Check</Badge>
              )}
              {task.qualifications.requiresFirstAid && (
                <Badge variant="outline" className="gap-1"><Award className="h-3 w-3" /> First Aid</Badge>
              )}
              {!Object.values(task.qualifications).some(Boolean) && (
                <p className="text-sm text-muted-foreground">No specific qualifications required.</p>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <div className="rounded-xl border border-border bg-card p-6 shadow-card">
            <h3 className="font-display font-bold mb-3">Posted By</h3>
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                <User className="h-6 w-6" />
              </div>
              <div>
                <div className="font-medium text-sm">{task.poster.name}</div>
                <div className="flex items-center gap-1 text-xs text-warning">
                  <Star className="h-3 w-3 fill-warning" /> {task.poster.rating}
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 mt-4 text-xs">
              <div className="rounded-lg bg-secondary/50 p-2 text-center">
                <div className="text-muted-foreground">Response Rate</div>
                <div className="font-medium mt-0.5">{task.poster.responseRate}</div>
              </div>
              <div className="rounded-lg bg-secondary/50 p-2 text-center">
                <div className="text-muted-foreground">Completed</div>
                <div className="font-medium mt-0.5">{task.poster.completedTasks} tasks</div>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            {applied ? (
              <Button className="w-full gap-2" disabled>
                <CheckCircle2 className="h-4 w-4" /> Applied
              </Button>
            ) : (
              <Button className="w-full" onClick={() => setApplyOpen(true)}>
                Apply for Task
              </Button>
            )}
            <Button variant="outline" className="w-full gap-2" onClick={() => setChatOpen(true)}>
              <MessageCircle className="h-4 w-4" /> Chat with Poster
            </Button>
            <div className="flex gap-2">
              <Button variant="outline" className="flex-1 gap-1"><Heart className="h-4 w-4" /> Save</Button>
              <Button variant="outline" className="flex-1 gap-1 text-destructive hover:text-destructive"><AlertTriangle className="h-4 w-4" /> Report</Button>
            </div>
          </div>
        </div>
      </div>

      {/* Apply Dialog */}
      <Dialog open={applyOpen} onOpenChange={setApplyOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Apply for Task</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">Introduce yourself and explain why you're a good fit for this task.</p>
            <Textarea
              placeholder="Write a message to the task poster..."
              value={applyMessage}
              onChange={(e) => setApplyMessage(e.target.value)}
              rows={4}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setApplyOpen(false)}>Cancel</Button>
            <Button onClick={handleApply}>Submit Application</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Chat Dialog */}
      <Dialog open={chatOpen} onOpenChange={setChatOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Chat with {task.poster.name}</DialogTitle>
          </DialogHeader>
          <div className="h-64 overflow-y-auto space-y-3 p-2">
            {chatMessages.map((m) => (
              <div key={m.id} className={`flex ${m.isOwner ? "justify-start" : "justify-end"}`}>
                <div className={`rounded-lg px-3 py-2 max-w-[80%] text-sm ${m.isOwner ? "bg-secondary" : "bg-primary text-primary-foreground"}`}>
                  <p>{m.content}</p>
                  <p className={`text-[10px] mt-1 ${m.isOwner ? "text-muted-foreground" : "text-primary-foreground/70"}`}>{m.time}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <Input
              placeholder="Type a message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
            />
            <Button size="icon" onClick={handleSendMessage}><Send className="h-4 w-4" /></Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
