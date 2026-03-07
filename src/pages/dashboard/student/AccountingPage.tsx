import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calculator, Calendar, Clock, Video, Building, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import StatusBadge from "@/components/shared/StatusBadge";

const professionals = [
  { id: 1, name: "Smith & Co Accounting", experience: "15+ years", services: ["Tax Returns", "BAS Lodgement", "Bookkeeping", "ABN Registration"], desc: "Full-service accounting firm specializing in student and small business tax.", price: "From $49", officeHours: "Mon-Fri 9AM-5PM", about: "We've been helping students with their taxes for over 15 years.", disclaimer: "All services subject to ATO regulations." },
  { id: 2, name: "TaxEasy Australia", experience: "8 years", services: ["Student Tax Returns", "PAYG", "Superannuation", "Tax Planning"], desc: "Affordable tax services tailored for international students.", price: "From $39", officeHours: "Mon-Sat 10AM-6PM", about: "Making tax simple and affordable for students.", disclaimer: "Results may vary based on individual circumstances." },
  { id: 3, name: "NumberCrunch", experience: "10 years", services: ["Tax Returns", "Financial Planning", "Investment Advice", "SMSF"], desc: "Professional accounting with personalized financial advice.", price: "From $59", officeHours: "Mon-Fri 8AM-4PM", about: "Expert financial guidance for your future.", disclaimer: "Financial advice is general in nature." },
];

const myBookings = [
  { id: 1, service: "Tax Returns", provider: "Smith & Co Accounting", date: "March 10, 2026", time: "2:00 PM", mode: "Online", status: "Confirmed" },
  { id: 2, service: "Student Tax Returns", provider: "TaxEasy Australia", date: "March 13, 2026", time: "1:00 PM", mode: "Online", status: "Pending" },
  { id: 3, service: "Financial Planning", provider: "NumberCrunch", date: "Feb 28, 2026", time: "10:00 AM", mode: "Offline", status: "Completed" },
];

export default function AccountingPage() {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold flex items-center gap-2"><Calculator className="h-6 w-6 text-primary" /> Accounting Service</h1>
        <p className="text-sm text-muted-foreground mt-1">Professional accounting services</p>
      </div>
      <Tabs defaultValue="providers" className="w-full">
        <TabsList>
          <TabsTrigger value="providers">Accounting Providers</TabsTrigger>
          <TabsTrigger value="bookings">My Bookings</TabsTrigger>
        </TabsList>
        <TabsContent value="providers" className="mt-4">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {professionals.map((p, i) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08, duration: 0.3 }}
                onClick={() => navigate(`/student/accounting/${p.id}`)}
                className="cursor-pointer rounded-xl border border-border bg-card p-5 shadow-card transition-all hover:shadow-card-hover hover:border-primary/30 group"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary"><Calculator className="h-5 w-5" /></div>
                  <div>
                    <h3 className="font-display text-sm font-bold">{p.name}</h3>
                    <p className="text-xs text-muted-foreground">{p.experience}</p>
                  </div>
                </div>
                <p className="mt-2 text-xs text-muted-foreground flex items-center gap-1"><Clock className="h-3 w-3" /> {p.officeHours}</p>
                <p className="mt-2 text-xs text-muted-foreground">{p.about}</p>
                <p className="mt-1 text-[10px] text-muted-foreground italic">{p.disclaimer}</p>
                <div className="mt-3 flex flex-wrap gap-1">{p.services.slice(0, 3).map((s) => <span key={s} className="rounded-full bg-secondary px-2 py-0.5 text-[10px] font-medium">{s}</span>)}</div>
                <div className="mt-3 flex items-center justify-between">
                  <span className="font-display text-sm font-bold text-primary">{p.price}</span>
                  <Button size="sm" variant="outline" className="gap-1 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    View Details <ArrowRight className="h-3 w-3" />
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </TabsContent>
        <TabsContent value="bookings" className="mt-4">
          <div className="space-y-3">
            {myBookings.map((b, i) => (
              <motion.div
                key={b.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06, duration: 0.3 }}
                className="rounded-xl border border-border bg-card p-4 shadow-card flex items-center justify-between transition-all hover:shadow-card-hover"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary"><Calculator className="h-5 w-5" /></div>
                  <div>
                    <h3 className="text-sm font-medium">{b.service}</h3>
                    <p className="text-xs text-muted-foreground">{b.provider}</p>
                    <div className="flex flex-wrap gap-2 mt-1 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {b.date} at {b.time}</span>
                      <span className="flex items-center gap-1">{b.mode === "Online" ? <Video className="h-3 w-3" /> : <Building className="h-3 w-3" />} {b.mode}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <StatusBadge status={b.status} />
                  {b.status === "Confirmed" && b.mode === "Online" && <Button size="sm" variant="outline">Join Session</Button>}
                </div>
              </motion.div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
