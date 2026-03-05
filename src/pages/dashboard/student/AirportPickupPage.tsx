import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CheckCircle2, Plane } from "lucide-react";

export default function AirportPickupPage() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    visitingType: "", primaryPhone: "", whatsapp: "", airline: "", flightNumber: "",
    arrivalDate: "", arrivalTime: "", passengers: "", luggage: "", passengerNames: "",
    destination: "", suburb: "", city: "", state: "", postcode: "",
  });

  const update = (key: string, val: string) => setForm((p) => ({ ...p, [key]: val }));

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
          <CheckCircle2 className="h-8 w-8 text-primary" />
        </div>
        <h2 className="mt-4 font-display text-2xl font-bold">Pickup Request Submitted!</h2>
        <p className="mt-2 text-muted-foreground max-w-md">Your airport pickup request has been submitted. You can track it in My Requests.</p>
        <Button className="mt-6" onClick={() => setSubmitted(false)}>Submit Another</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold flex items-center gap-2"><Plane className="h-6 w-6 text-primary" /> Airport Pickup</h1>
        <p className="text-sm text-muted-foreground mt-1">Submit your airport pickup request and we'll arrange everything for you.</p>
      </div>
      <div className="rounded-xl border border-border bg-card p-6 shadow-card">
        <form onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }} className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label>Visiting Type</Label>
            <Select value={form.visitingType} onValueChange={(v) => update("visitingType", v)}>
              <SelectTrigger className="mt-1.5"><SelectValue placeholder="Select type" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="first-time">First Time</SelectItem>
                <SelectItem value="returning">Returning</SelectItem>
                <SelectItem value="visiting">Visiting</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div><Label>Primary Contact Number</Label><Input className="mt-1.5" value={form.primaryPhone} onChange={(e) => update("primaryPhone", e.target.value)} placeholder="+61..." /></div>
          <div><Label>WhatsApp Number</Label><Input className="mt-1.5" value={form.whatsapp} onChange={(e) => update("whatsapp", e.target.value)} placeholder="+61..." /></div>
          <div><Label>Airline Name</Label><Input className="mt-1.5" value={form.airline} onChange={(e) => update("airline", e.target.value)} placeholder="e.g. Qantas" /></div>
          <div><Label>Flight Number</Label><Input className="mt-1.5" value={form.flightNumber} onChange={(e) => update("flightNumber", e.target.value)} placeholder="e.g. QF1" /></div>
          <div><Label>Arrival Date</Label><Input type="date" className="mt-1.5" value={form.arrivalDate} onChange={(e) => update("arrivalDate", e.target.value)} /></div>
          <div><Label>Arrival Time</Label><Input type="time" className="mt-1.5" value={form.arrivalTime} onChange={(e) => update("arrivalTime", e.target.value)} /></div>
          <div><Label>Number of Passengers</Label><Input type="number" min="1" className="mt-1.5" value={form.passengers} onChange={(e) => update("passengers", e.target.value)} /></div>
          <div><Label>Number of Luggage</Label><Input type="number" min="0" className="mt-1.5" value={form.luggage} onChange={(e) => update("luggage", e.target.value)} /></div>
          <div className="sm:col-span-2"><Label>Passenger Names</Label><Input className="mt-1.5" value={form.passengerNames} onChange={(e) => update("passengerNames", e.target.value)} placeholder="Comma separated names" /></div>
          <div className="sm:col-span-2"><Label>Destination Address</Label><Input className="mt-1.5" value={form.destination} onChange={(e) => update("destination", e.target.value)} placeholder="Full address" /></div>
          <div><Label>Suburb</Label><Input className="mt-1.5" value={form.suburb} onChange={(e) => update("suburb", e.target.value)} /></div>
          <div><Label>City</Label><Input className="mt-1.5" value={form.city} onChange={(e) => update("city", e.target.value)} /></div>
          <div><Label>State</Label><Input className="mt-1.5" value={form.state} onChange={(e) => update("state", e.target.value)} /></div>
          <div><Label>Postcode</Label><Input className="mt-1.5" value={form.postcode} onChange={(e) => update("postcode", e.target.value)} /></div>
          <div className="sm:col-span-2 pt-2"><Button type="submit" size="lg" className="w-full sm:w-auto">Submit Pickup Request</Button></div>
        </form>
      </div>
    </div>
  );
}
