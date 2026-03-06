import { useState } from "react";
import { Settings, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";

export default function VendorSettingsPage() {
  const [business, setBusiness] = useState("Bean Counter Café");
  const [email, setEmail] = useState("info@beancounter.com");
  const [phone, setPhone] = useState("0412 345 678");
  const [address, setAddress] = useState("123 Lonsdale St, Melbourne VIC 3000");
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold flex items-center gap-2"><Settings className="h-6 w-6 text-primary" /> Settings</h1>
        <p className="text-sm text-muted-foreground mt-1">Manage your business information</p>
      </div>

      <div className="rounded-xl border border-border bg-card p-6 shadow-card max-w-xl space-y-4">
        <div><Label>Business Name</Label><Input className="mt-1" value={business} onChange={e => setBusiness(e.target.value)} /></div>
        <div><Label>Email</Label><Input className="mt-1" type="email" value={email} onChange={e => setEmail(e.target.value)} /></div>
        <div><Label>Phone Number</Label><Input className="mt-1" value={phone} onChange={e => setPhone(e.target.value)} /><p className="mt-0.5 text-[10px] text-muted-foreground">Format: +61 4XX XXX XXX or 04XX XXX XXX</p></div>
        <div><Label>Address</Label><Input className="mt-1" value={address} onChange={e => setAddress(e.target.value)} /></div>
        <Button onClick={handleSave} className="w-full sm:w-auto">
          {saved ? <><CheckCircle2 className="h-4 w-4 mr-1" /> Saved!</> : "Save Changes"}
        </Button>
      </div>
    </div>
  );
}
