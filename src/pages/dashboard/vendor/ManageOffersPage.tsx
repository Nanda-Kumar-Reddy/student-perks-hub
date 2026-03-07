import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Gift, Trash2, Plus, Tag, Phone, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { motion } from "framer-motion";

interface Coupon { id: number; discount: string; business: string; location: string; phone: string; email: string; description: string; template: string; }

const couponTemplates = [
  { id: "classic", name: "Classic", desc: "Clean centered layout", layout: "centered" },
  { id: "bold", name: "Bold", desc: "Large discount header", layout: "header" },
  { id: "elegant", name: "Elegant", desc: "Bordered premium style", layout: "bordered" },
  { id: "premium", name: "Premium", desc: "Gold accent design", layout: "split" },
  { id: "neon", name: "Neon", desc: "Modern gradient style", layout: "gradient" },
  { id: "minimal", name: "Minimal", desc: "Clean with details", layout: "minimal" },
  { id: "banner", name: "Banner", desc: "Wide banner layout", layout: "banner" },
];

const initialCoupons: Coupon[] = [
  { id: 1, discount: "20%", business: "Bean Counter Café", location: "Melbourne CBD", phone: "0412 345 678", email: "info@beancounter.com", description: "20% off all hot beverages for students", template: "classic" },
  { id: 2, discount: "50%", business: "Bean Counter Café", location: "Melbourne CBD", phone: "0412 345 678", email: "info@beancounter.com", description: "Buy 1 Get 1 Free on pastries", template: "bold" },
];

function CouponPreview({ discount, business, location, phone, email, description, template }: { discount: string; business: string; location: string; phone: string; email: string; description: string; template: string }) {
  const t = couponTemplates.find(ct => ct.id === template);

  if (t?.layout === "header") {
    return (
      <div className="rounded-xl border border-accent/30 bg-accent/5 overflow-hidden min-h-[250px]">
        <div className="bg-accent/10 p-5 text-center">
          <div className="font-display text-4xl font-bold text-accent">{discount || "—%"} OFF</div>
        </div>
        <div className="p-5 text-center space-y-2">
          <h3 className="font-display text-lg font-bold">{business || "Business Name"}</h3>
          <p className="text-sm text-muted-foreground">{description || "Offer description"}</p>
          <div className="text-xs text-muted-foreground">{location || "Location"}</div>
          {phone && <div className="text-xs text-muted-foreground flex items-center justify-center gap-1"><Phone className="h-3 w-3" />{phone}</div>}
          {email && <div className="text-xs text-muted-foreground flex items-center justify-center gap-1"><Mail className="h-3 w-3" />{email}</div>}
        </div>
      </div>
    );
  }

  if (t?.layout === "bordered") {
    return (
      <div className="rounded-xl border-2 border-dashed border-primary/30 bg-card p-6 min-h-[250px] flex flex-col items-center justify-center text-center space-y-3">
        <div className="w-12 h-0.5 bg-primary" />
        <div className="font-display text-3xl font-bold text-primary">{discount || "—%"} OFF</div>
        <h3 className="font-display text-lg font-bold">{business || "Business Name"}</h3>
        <p className="text-sm text-muted-foreground max-w-[200px]">{description || "Offer description"}</p>
        <div className="text-xs text-muted-foreground">{location}</div>
        <div className="flex gap-3 text-xs text-muted-foreground">
          {phone && <span className="flex items-center gap-1"><Phone className="h-3 w-3" />{phone}</span>}
          {email && <span className="flex items-center gap-1"><Mail className="h-3 w-3" />{email}</span>}
        </div>
        <div className="w-12 h-0.5 bg-primary" />
      </div>
    );
  }

  if (t?.layout === "split") {
    return (
      <div className="rounded-xl border border-warning/30 bg-warning/5 overflow-hidden min-h-[250px] flex">
        <div className="w-[40%] bg-warning/10 flex flex-col items-center justify-center p-4">
          <div className="font-display text-3xl font-bold text-warning">{discount || "—%"}</div>
          <div className="text-sm font-bold text-warning">OFF</div>
        </div>
        <div className="flex-1 p-5 flex flex-col justify-center space-y-2">
          <h3 className="font-display text-lg font-bold">{business || "Business Name"}</h3>
          <p className="text-sm text-muted-foreground">{description || "Offer description"}</p>
          <div className="text-xs text-muted-foreground">{location}</div>
          {phone && <div className="text-xs text-muted-foreground flex items-center gap-1"><Phone className="h-3 w-3" />{phone}</div>}
          {email && <div className="text-xs text-muted-foreground flex items-center gap-1"><Mail className="h-3 w-3" />{email}</div>}
        </div>
      </div>
    );
  }

  // Default / Classic / Others
  return (
    <div className="rounded-xl border border-primary/20 bg-primary/5 p-8 min-h-[250px] flex flex-col items-center justify-center text-center space-y-3">
      <Tag className="h-8 w-8 text-primary mb-2" />
      <div className="font-display text-4xl font-bold text-primary">{discount || "—%"} OFF</div>
      <h3 className="font-display text-lg font-bold mt-3">{business || "Business Name"}</h3>
      <p className="text-sm text-muted-foreground">{description || "Offer description"}</p>
      <div className="text-xs text-muted-foreground">{location || "Location"}</div>
      <div className="flex gap-3 text-xs text-muted-foreground">
        {phone && <span className="flex items-center gap-1"><Phone className="h-3 w-3" />{phone}</span>}
        {email && <span className="flex items-center gap-1"><Mail className="h-3 w-3" />{email}</span>}
      </div>
    </div>
  );
}

export default function ManageOffersPage() {
  const [searchParams] = useSearchParams();
  const [coupons, setCoupons] = useState<Coupon[]>(initialCoupons);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState("coupons");

  useEffect(() => {
    if (searchParams.get("tab") === "create") setActiveTab("create");
  }, [searchParams]);

  const [discount, setDiscount] = useState("");
  const [business, setBusiness] = useState("");
  const [location, setLocation] = useState("");
  const [cPhone, setCPhone] = useState("");
  const [cEmail, setCEmail] = useState("");
  const [desc, setDesc] = useState("");
  const [template, setTemplate] = useState("classic");

  const handleCreate = () => {
    if (!discount || !business) return;
    setCoupons(p => [...p, { id: Date.now(), discount, business, location, phone: cPhone, email: cEmail, description: desc, template }]);
    setDiscount(""); setBusiness(""); setLocation(""); setCPhone(""); setCEmail(""); setDesc("");
    setActiveTab("coupons");
  };

  const handleDelete = (id: number) => {
    setCoupons(p => p.filter(c => c.id !== id));
    setDeleteConfirm(null);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold flex items-center gap-2"><Gift className="h-6 w-6 text-primary" /> Manage Offers</h1>
        <p className="text-sm text-muted-foreground mt-1">Create and manage your discount coupons</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList><TabsTrigger value="coupons">My Coupons</TabsTrigger><TabsTrigger value="create">Create Coupon</TabsTrigger></TabsList>

        <TabsContent value="coupons" className="mt-4">
          {coupons.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">No coupons yet. Create your first coupon!</div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {coupons.map((c, i) => (
                <motion.div key={c.id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                  className="group relative">
                  <button onClick={() => setDeleteConfirm(c.id)}
                    className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 rounded-lg p-1.5 bg-destructive/10 text-destructive transition-all hover:bg-destructive hover:text-destructive-foreground">
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                  <CouponPreview {...c} />
                </motion.div>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="create" className="mt-4">
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="space-y-4">
              <div className="rounded-xl border border-border bg-card p-5 shadow-card space-y-4">
                <h3 className="font-display text-sm font-bold">Coupon Details</h3>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div><Label>Discount %</Label><Input className="mt-1" placeholder="e.g. 20%" value={discount} onChange={e => setDiscount(e.target.value)} /></div>
                  <div><Label>Business Name</Label><Input className="mt-1" value={business} onChange={e => setBusiness(e.target.value)} /></div>
                  <div><Label>Location</Label><Input className="mt-1" value={location} onChange={e => setLocation(e.target.value)} /></div>
                  <div><Label>Phone</Label><Input className="mt-1" value={cPhone} onChange={e => setCPhone(e.target.value)} /></div>
                  <div className="sm:col-span-2"><Label>Email</Label><Input className="mt-1" type="email" value={cEmail} onChange={e => setCEmail(e.target.value)} /></div>
                  <div className="sm:col-span-2"><Label>Offer Description</Label><Textarea className="mt-1" value={desc} onChange={e => setDesc(e.target.value)} rows={2} /></div>
                </div>
              </div>
              <div className="rounded-xl border border-border bg-card p-5 shadow-card space-y-3">
                <h3 className="font-display text-sm font-bold">Choose Template</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {couponTemplates.map(t => (
                    <button key={t.id} onClick={() => setTemplate(t.id)}
                      className={`rounded-lg border p-3 text-center transition-all ${template === t.id ? "border-primary ring-1 ring-primary bg-primary/5" : "border-border bg-card hover:shadow-card"}`}>
                      <div className="text-xs font-bold">{t.name}</div>
                      <div className="text-[10px] text-muted-foreground">{t.desc}</div>
                    </button>
                  ))}
                </div>
              </div>
              <Button onClick={handleCreate} disabled={!discount || !business} className="w-full"><Plus className="h-4 w-4 mr-1" /> Add Coupon</Button>
            </div>

            <div>
              <h3 className="font-display text-sm font-bold mb-3">Preview</h3>
              <CouponPreview discount={discount} business={business} location={location} phone={cPhone} email={cEmail} description={desc} template={template} />
            </div>
          </div>
        </TabsContent>
      </Tabs>

      <Dialog open={deleteConfirm !== null} onOpenChange={() => setDeleteConfirm(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader><DialogTitle>Delete Coupon?</DialogTitle></DialogHeader>
          <p className="text-sm text-muted-foreground">This action cannot be undone.</p>
          <div className="flex gap-2 mt-4">
            <Button variant="outline" className="flex-1" onClick={() => setDeleteConfirm(null)}>Cancel</Button>
            <Button variant="destructive" className="flex-1" onClick={() => deleteConfirm && handleDelete(deleteConfirm)}>Delete</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
