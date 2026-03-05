import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, CheckCircle2 } from "lucide-react";
import FormSection from "@/components/shared/FormSection";
import PhoneField from "@/components/shared/PhoneField";

export default function ProfilePage() {
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState({ name: "John Doe", email: "john@university.edu", phone: "+61 400 123 456", address: "Melbourne, VIC" });
  const [password, setPassword] = useState({ current: "", new: "", confirm: "" });
  const update = (k: string, v: string) => setForm((p) => ({ ...p, [k]: v }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold flex items-center gap-2"><User className="h-6 w-6 text-primary" /> Profile</h1>
        <p className="text-sm text-muted-foreground mt-1">Manage your account settings</p>
      </div>
      {saved && (
        <div className="flex items-center gap-2 rounded-lg bg-success/10 p-3 text-sm text-success"><CheckCircle2 className="h-4 w-4" /> Profile updated successfully!</div>
      )}
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-border bg-card p-6 shadow-card space-y-6">
          <FormSection title="Personal Details">
            <div><Label>Full Name</Label><Input className="mt-1.5" value={form.name} onChange={(e) => update("name", e.target.value)} /></div>
            <div><Label>Email</Label><Input className="mt-1.5" type="email" value={form.email} onChange={(e) => update("email", e.target.value)} /></div>
            <PhoneField value={form.phone} onChange={(v) => update("phone", v)} />
            <div><Label>Address</Label><Input className="mt-1.5" value={form.address} onChange={(e) => update("address", e.target.value)} /></div>
          </FormSection>
          <Button onClick={() => { setSaved(true); setTimeout(() => setSaved(false), 3000); }}>Save Changes</Button>
        </div>
        <div className="rounded-xl border border-border bg-card p-6 shadow-card space-y-6">
          <FormSection title="Change Password">
            <div><Label>Current Password</Label><Input className="mt-1.5" type="password" value={password.current} onChange={(e) => setPassword((p) => ({ ...p, current: e.target.value }))} /></div>
            <div><Label>New Password</Label><Input className="mt-1.5" type="password" value={password.new} onChange={(e) => setPassword((p) => ({ ...p, new: e.target.value }))} /></div>
            <div><Label>Confirm New Password</Label><Input className="mt-1.5" type="password" value={password.confirm} onChange={(e) => setPassword((p) => ({ ...p, confirm: e.target.value }))} /></div>
          </FormSection>
          <Button variant="outline">Update Password</Button>
        </div>
      </div>
    </div>
  );
}
