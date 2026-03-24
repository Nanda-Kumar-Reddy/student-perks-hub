/**
 * Full-screen image preview dialog
 */
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  images: string[];
  currentIndex: number;
  onIndexChange: (index: number) => void;
}

export default function ImagePreviewDialog({ open, onOpenChange, images, currentIndex, onIndexChange }: Props) {
  if (!images.length) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[95vh] p-0 bg-black/95 border-none">
        <button onClick={() => onOpenChange(false)} className="absolute top-3 right-3 z-20 rounded-full bg-white/10 p-2 text-white hover:bg-white/20 transition-colors">
          <X className="h-5 w-5" />
        </button>
        <div className="relative flex items-center justify-center min-h-[60vh]">
          <img src={images[currentIndex]} alt={`Preview ${currentIndex + 1}`} className="max-h-[85vh] max-w-full object-contain" />
          {images.length > 1 && (
            <>
              <button onClick={() => onIndexChange((currentIndex - 1 + images.length) % images.length)} className="absolute left-3 rounded-full bg-white/10 p-2 text-white hover:bg-white/20 transition-colors">
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button onClick={() => onIndexChange((currentIndex + 1) % images.length)} className="absolute right-3 rounded-full bg-white/10 p-2 text-white hover:bg-white/20 transition-colors">
                <ChevronRight className="h-5 w-5" />
              </button>
            </>
          )}
        </div>
        <div className="flex justify-center gap-1.5 pb-3">
          {images.map((_, i) => (
            <button key={i} onClick={() => onIndexChange(i)} className={`h-2 w-2 rounded-full transition-colors ${i === currentIndex ? "bg-white" : "bg-white/30"}`} />
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
