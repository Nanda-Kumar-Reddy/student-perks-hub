import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { CheckCircle2 } from "lucide-react";
import PhoneField from "./PhoneField";

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  title: string;
}

export default function EnquiryPopup({ open, onOpenChange, title }: Props) {
  const [phone, setPhone] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleClose = () => {
    onOpenChange(false);
    setTimeout(() => { setPhone(""); setSubmitted(false); }, 300);
  };

  if (submitted) {
    return (
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="max-w-sm text-center">
          <div className="flex flex-col items-center py-6">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10"><CheckCircle2 className="h-8 w-8 text-primary" /></div>
            <h2 className="mt-4 font-display text-xl font-bold">Enquiry Submitted!</h2>
            <p className="mt-2 text-sm text-muted-foreground">We'll contact you shortly regarding {title}.</p>
            <Button className="mt-6" onClick={handleClose}>Close</Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-sm">
        <DialogHeader><DialogTitle>Enquire — {title}</DialogTitle></DialogHeader>
        <div className="space-y-4 pt-2">
          <PhoneField value={phone} onChange={setPhone} />
          <Button className="w-full" onClick={() => setSubmitted(true)} disabled={!phone.trim()}>Submit Enquiry</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
