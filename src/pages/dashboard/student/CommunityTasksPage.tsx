import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Search, Plus, MapPin, Clock, DollarSign, Star, ChevronRight,
  Home, Baby, BookOpen, Sparkles, Truck, PawPrint, Monitor, PartyPopper, Package, MoreHorizontal, ListTodo
} from "lucide-react";
import { motion } from "framer-motion";
import CreateCommunityTaskDialog from "@/components/community/CreateCommunityTaskDialog";

const categoryIcons: Record<string, React.ReactNode> = {
  "Home & Garden": <Home className="h-4 w-4" />,
  Childcare: <Baby className="h-4 w-4" />,
  Tutoring: <BookOpen className="h-4 w-4" />,
  Cleaning: <Sparkles className="h-4 w-4" />,
  Moving: <Truck className="h-4 w-4" />,
  "Pet Care": <PawPrint className="h-4 w-4" />,
  "Technology Help": <Monitor className="h-4 w-4" />,
  "Event Help": <PartyPopper className="h-4 w-4" />,
  Delivery: <Package className="h-4 w-4" />,
  Other: <MoreHorizontal className="h-4 w-4" />,
};

const tasks = [
  {
    id: "1", title: "Garden Maintenance — Mowing & Weeding", category: "Home & Garden",
    duration: "3 hours", payment: "$90", description: "Need someone to mow the lawn and weed the garden beds. Tools provided.",
    location: "Carlton, VIC", date: "Mar 15, 2026 · 9:00 AM",
    poster: "Sarah M.", rating: 4.8,
  },
  {
    id: "2", title: "Babysitting — Saturday Evening", category: "Childcare",
    duration: "5 hours", payment: "$150", description: "Looking for an experienced babysitter for two children aged 4 and 7.",
    location: "South Yarra, VIC", date: "Mar 16, 2026 · 6:00 PM",
    poster: "James K.", rating: 4.5,
  },
  {
    id: "3", title: "Help Moving Furniture", category: "Moving",
    duration: "4 hours", payment: "$160", description: "Need help moving furniture from a 2-bedroom apartment to a new location.",
    location: "Fitzroy, VIC", date: "Mar 18, 2026 · 10:00 AM",
    poster: "Emily R.", rating: 4.9,
  },
  {
    id: "4", title: "Year 10 Maths Tutoring", category: "Tutoring",
    duration: "2 hours", payment: "$80", description: "Looking for a maths tutor for Year 10 student. Focus on algebra and geometry.",
    location: "Brunswick, VIC", date: "Mar 20, 2026 · 4:00 PM",
    poster: "Michael D.", rating: 4.7,
  },
];

const sortOptions = ["Newest", "Payment", "Duration"];

export default function CommunityTasksPage() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [sort, setSort] = useState("Newest");
  const [createOpen, setCreateOpen] = useState(false);

  const filteredTasks = tasks.filter((t) => {
    const matchesSearch = !search ||
      t.title.toLowerCase().includes(search.toLowerCase()) ||
      t.location.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = !selectedCategory || t.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = Object.keys(categoryIcons);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold flex items-center gap-2">
            <ListTodo className="h-6 w-6 text-primary" /> Community Tasks
          </h1>
          <p className="text-sm text-muted-foreground mt-1">Find tasks near you or post your own</p>
        </div>
        <Button onClick={() => setCreateOpen(true)} className="gap-2">
          <Plus className="h-4 w-4" /> Create Community Task
        </Button>
      </div>

      {/* Search */}
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by title, category, or location..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2">
        <Badge
          variant={!selectedCategory ? "default" : "outline"}
          className="cursor-pointer transition-transform duration-200 hover:scale-105"
          onClick={() => setSelectedCategory(null)}
        >
          All
        </Badge>
        {categories.map((cat) => (
          <Badge
            key={cat}
            variant={selectedCategory === cat ? "default" : "outline"}
            className="cursor-pointer gap-1 transition-transform duration-200 hover:scale-105"
            onClick={() => setSelectedCategory(selectedCategory === cat ? null : cat)}
          >
            {categoryIcons[cat]}
            {cat}
          </Badge>
        ))}
      </div>

      {/* Results count + sort */}
      <div className="flex items-center justify-between border-t border-border pt-3">
        <span className="text-xs text-muted-foreground">{filteredTasks.length} tasks found</span>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">Sort by</span>
          <Select value={sort} onValueChange={setSort}>
            <SelectTrigger className="h-8 w-32 text-xs"><SelectValue /></SelectTrigger>
            <SelectContent>{sortOptions.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
          </Select>
        </div>
      </div>

      {/* Task List */}
      <div className="space-y-3">
        {filteredTasks.map((task, i) => (
          <motion.div
            key={task.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06, duration: 0.3 }}
          >
            <Link
              to={`/student/community-tasks/${task.id}`}
              className="block rounded-xl border border-border bg-card p-5 shadow-card transition-all hover:shadow-card-hover hover:-translate-y-0.5"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3 flex-1">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary shrink-0">
                    {categoryIcons[task.category] || <MoreHorizontal className="h-5 w-5" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-display text-sm font-bold">{task.title}</h3>
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{task.description}</p>
                    <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {task.duration}</span>
                      <span className="flex items-center gap-1 font-semibold text-success"><DollarSign className="h-3 w-3" /> {task.payment}</span>
                      <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {task.location}</span>
                      <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {task.date}</span>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-xs font-medium">{task.poster}</span>
                      <span className="flex items-center gap-0.5 text-xs text-warning">
                        <Star className="h-3 w-3 fill-warning" /> {task.rating}
                      </span>
                    </div>
                  </div>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground shrink-0 mt-1" />
              </div>
            </Link>
          </motion.div>
        ))}
        {filteredTasks.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="text-center py-12 text-muted-foreground rounded-xl border border-border bg-card"
          >
            <p className="text-sm">No tasks found matching your criteria.</p>
          </motion.div>
        )}
      </div>

      <CreateCommunityTaskDialog open={createOpen} onOpenChange={setCreateOpen} />
    </div>
  );
}
