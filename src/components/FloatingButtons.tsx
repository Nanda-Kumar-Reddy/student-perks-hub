import { MessageCircle, QrCode } from "lucide-react";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export default function FloatingButtons() {
  const [scannerOpen, setScannerOpen] = useState(false);

  return (
    <>
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3">
        <a href="https://wa.me/61400000000" target="_blank" rel="noopener noreferrer"
          className="flex h-12 w-12 items-center justify-center rounded-full bg-[hsl(142,70%,45%)] text-white shadow-lg transition-transform hover:scale-110 active:scale-95">
          <MessageCircle className="h-5 w-5" />
        </a>
        <button onClick={() => setScannerOpen(true)}
          className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg transition-transform hover:scale-110 active:scale-95 animate-[pulse_2s_cubic-bezier(0.4,0,0.6,1)_infinite] glow-primary">
          <QrCode className="h-5 w-5" />
        </button>
      </div>

      <Dialog open={scannerOpen} onOpenChange={setScannerOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader><DialogTitle>QR Scanner</DialogTitle></DialogHeader>
          <div className="flex flex-col items-center py-8 space-y-4">
            <div className="flex h-40 w-40 items-center justify-center rounded-2xl border-2 border-dashed border-primary/30 bg-primary/5">
              <QrCode className="h-16 w-16 text-primary/40" />
            </div>
            <p className="text-sm text-muted-foreground text-center">Point your camera at a QR code to scan</p>
            <Button onClick={() => setScannerOpen(false)} variant="outline">Close Scanner</Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
