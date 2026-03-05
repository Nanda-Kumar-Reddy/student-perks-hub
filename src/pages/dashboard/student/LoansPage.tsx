import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle2, DollarSign } from "lucide-react";
import FormSection from "@/components/shared/FormSection";
import PhoneField from "@/components/shared/PhoneField";
import RequestsListTab from "@/components/shared/RequestsListTab";

const existingApplications = [
  { id: 1, title: "Personal Loan — $5,000", subtitle: "Submitted via LifelineAustralia", date: "March 3, 2026", status: "Pending" },
  { id: 2, title: "Education Loan — $15,000", subtitle: "Submitted via LifelineAustralia", date: "Feb 15, 2026", status: "Approved" },
];

export default function LoansPage() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    category: "", description: "", minAmount: "", maxAmount: "",
    drivingLicence: "", visaStatus: "", monthlyIncome: "", employment: "",
    email: "", phone: "",
  });
  const update = (k: string, v: string) => setForm((p) => ({ ...p, [k]: v }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold flex items-center gap-2"><DollarSign className="h-6 w-6 text-primary" /> Loans</h1>
        <p className="text-sm text-muted-foreground mt-1">Apply for student loans</p>
      </div>
      <Tabs defaultValue="apply" className="w-full">
        <TabsList>
          <TabsTrigger value="apply">New Application</TabsTrigger>
          <TabsTrigger value="existing">Existing Applications</TabsTrigger>
        </TabsList>
        <TabsContent value="apply" className="mt-4">
          {submitted ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10"><CheckCircle2 className="h-8 w-8 text-primary" /></div>
              <h2 className="mt-4 font-display text-2xl font-bold">Loan Application Submitted!</h2>
              <p className="mt-2 text-muted-foreground max-w-md">Track it in Existing Applications.</p>
              <Button className="mt-6" onClick={() => setSubmitted(false)}>Submit Another</Button>
            </div>
          ) : (
            <div className="rounded-xl border border-border bg-card p-6 shadow-card max-w-2xl">
              <form onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }} className="space-y-6">
                <FormSection title="Loan Details">
                  <div>
                    <Label>Loan Category</Label>
                    <Select value={form.category} onValueChange={(v) => update("category", v)}>
                      <SelectTrigger className="mt-1.5"><SelectValue placeholder="Select category" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="personal">Personal Loan</SelectItem>
                        <SelectItem value="education">Education Loan</SelectItem>
                        <SelectItem value="vehicle">Vehicle Loan</SelectItem>
                        <SelectItem value="emergency">Emergency Loan</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div><Label>Description</Label><Textarea className="mt-1.5" value={form.description} onChange={(e) => update("description", e.target.value)} placeholder="Describe your loan requirements" /></div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div><Label>Minimum Loan Amount ($)</Label><Input type="number" className="mt-1.5" value={form.minAmount} onChange={(e) => update("minAmount", e.target.value)} /></div>
                    <div><Label>Maximum Loan Amount ($)</Label><Input type="number" className="mt-1.5" value={form.maxAmount} onChange={(e) => update("maxAmount", e.target.value)} /></div>
                  </div>
                </FormSection>

                <FormSection title="Eligibility Information">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <Label>Driving Licence Status</Label>
                      <Select value={form.drivingLicence} onValueChange={(v) => update("drivingLicence", v)}>
                        <SelectTrigger className="mt-1.5"><SelectValue placeholder="Select" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="yes">Have Licence</SelectItem>
                          <SelectItem value="no">No Licence</SelectItem>
                          <SelectItem value="learner">Learner Permit</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Visa Status</Label>
                      <Select value={form.visaStatus} onValueChange={(v) => update("visaStatus", v)}>
                        <SelectTrigger className="mt-1.5"><SelectValue placeholder="Select" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="student">Student Visa</SelectItem>
                          <SelectItem value="pr">Permanent Resident</SelectItem>
                          <SelectItem value="citizen">Citizen</SelectItem>
                          <SelectItem value="work">Work Visa</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div><Label>Monthly Income ($)</Label><Input type="number" className="mt-1.5" value={form.monthlyIncome} onChange={(e) => update("monthlyIncome", e.target.value)} /></div>
                    <div>
                      <Label>Employment Status</Label>
                      <Select value={form.employment} onValueChange={(v) => update("employment", v)}>
                        <SelectTrigger className="mt-1.5"><SelectValue placeholder="Select" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="employed">Employed</SelectItem>
                          <SelectItem value="part-time">Part-time</SelectItem>
                          <SelectItem value="casual">Casual</SelectItem>
                          <SelectItem value="unemployed">Unemployed</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </FormSection>

                <FormSection title="Contact Information">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div><Label>Email</Label><Input type="email" className="mt-1.5" value={form.email} onChange={(e) => update("email", e.target.value)} placeholder="you@email.com" /></div>
                    <PhoneField value={form.phone} onChange={(v) => update("phone", v)} />
                  </div>
                </FormSection>

                <Button type="submit" size="lg">Submit Application</Button>
              </form>
            </div>
          )}
        </TabsContent>
        <TabsContent value="existing" className="mt-4">
          <RequestsListTab requests={existingApplications} emptyMessage="No loan applications yet." />
        </TabsContent>
      </Tabs>
    </div>
  );
}
