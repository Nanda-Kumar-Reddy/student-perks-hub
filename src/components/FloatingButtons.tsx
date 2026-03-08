import { MessageCircle, QrCode, Star, X } from "lucide-react";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function FloatingButtons() {
  const [scannerOpen, setScannerOpen] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [scanned, setScanned] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [amount, setAmount] = useState("");
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState("");

  const handleOpenScanner = () => {
    setScannerOpen(true);
    setScanning(true);
    setScanned(false);
    setSubmitted(false);
    setAmount("");
    setRating(0);
    setFeedback("");
    setTimeout(() => {
      setScanning(false);
      setScanned(true);
    }, 3000);
  };

  const handleSubmit = () => {
    setSubmitted(true);
  };

  return (
    <>
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3">
        <a href="https://wa.me/61400000000" target="_blank" rel="noopener noreferrer"
          className="flex h-12 w-12 items-center justify-center rounded-full bg-[hsl(142,70%,45%)] text-white shadow-lg transition-transform hover:scale-110 active:scale-95">
          <MessageCircle className="h-5 w-5" />
        </a>
        <div className="relative flex items-center justify-center">
          {/* Rotating arrow ring with arrowhead */}
          <div className="absolute inset-[-6px] animate-[spin_2.5s_linear_infinite]">
            <svg width="60" height="60" viewBox="0 0 60 60" className="w-full h-full">
              <circle
                cx="30"
                cy="30"
                r="26"
                fill="none"
                stroke="hsl(var(--primary))"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeDasharray="40 123.4"
                opacity="0.5"
              />
            </svg>
          </div>
          {/* Shine burst animation */}
          <div className="absolute inset-[-8px] rounded-full animate-[shine-burst_2.5s_ease-in-out_infinite] pointer-events-none" />
          <button onClick={handleOpenScanner}
            className="relative flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg transition-transform hover:scale-110 active:scale-95 glow-primary">
            <QrCode className="h-5 w-5" />
          </button>
        </div>
      </div>

      <Dialog open={scannerOpen} onOpenChange={setScannerOpen}>
        <DialogContent className="max-w-sm">
          {submitted ? (
            <div className="flex flex-col items-center py-8 text-center animate-scale-in">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 animate-[pulse_1s_ease-in-out]">
                <svg className="h-10 w-10 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="mt-4 font-display text-xl font-bold">Thank You!</h2>
              <p className="mt-2 text-sm text-muted-foreground max-w-[260px]">
                Your transaction has been submitted. Points will be credited after vendor confirmation.
              </p>
              <Button className="mt-6" onClick={() => setScannerOpen(false)}>Close</Button>
            </div>
          ) : scanned ? (
            <>
              <DialogHeader><DialogTitle>Transaction Details</DialogTitle></DialogHeader>
              <div className="space-y-4 pt-2">
                <div className="flex items-center gap-3 rounded-lg bg-secondary/50 p-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-2xl">☕</div>
                  <div>
                    <div className="font-display text-sm font-bold">Bean Counter Café</div>
                    <div className="text-xs text-muted-foreground">Melbourne CBD</div>
                  </div>
                </div>
                <div>
                  <Label>Amount to Pay</Label>
                  <Input className="mt-1.5" placeholder="e.g. ₹250" value={amount} onChange={e => setAmount(e.target.value)} />
                </div>
                <div>
                  <Label>Rating</Label>
                  <div className="flex gap-1 mt-1.5">
                    {[1, 2, 3, 4, 5].map(s => (
                      <button key={s} onClick={() => setRating(s)} className="transition-transform hover:scale-110">
                        <Star className={`h-6 w-6 ${s <= rating ? "fill-primary text-primary" : "text-muted-foreground/30"}`} />
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <Label>Feedback (optional)</Label>
                  <Textarea className="mt-1.5" rows={2} value={feedback} onChange={e => setFeedback(e.target.value)} placeholder="Share your experience..." />
                </div>
                <Button className="w-full" onClick={handleSubmit} disabled={!amount}>Submit Transaction</Button>
              </div>
            </>
          ) : (
            <>
              <DialogHeader><DialogTitle>QR Scanner</DialogTitle></DialogHeader>
              <div className="flex flex-col items-center py-8 space-y-4">
                <div className="relative flex h-40 w-40 items-center justify-center rounded-2xl border-2 border-dashed border-primary/30 bg-primary/5">
                  <QrCode className="h-16 w-16 text-primary/40 animate-pulse" />
                  <div className="absolute inset-0 rounded-2xl overflow-hidden">
                    <div className="absolute left-0 right-0 h-0.5 bg-primary/60 animate-[scan_2s_ease-in-out_infinite]" />
                  </div>
                </div>
                <p className="text-sm text-muted-foreground text-center">Scanning for QR code...</p>
                <Button onClick={() => setScannerOpen(false)} variant="outline">Cancel</Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
