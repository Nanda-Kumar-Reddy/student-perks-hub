/**
 * CarouselImageUploader — horizontal carousel with max 7 images, crop on add, fullscreen preview
 */
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Plus, X, ChevronLeft, ChevronRight, ImageIcon } from "lucide-react";
import ImageCropperDialog from "./ImageCropperDialog";
import ImagePreviewDialog from "./ImagePreviewDialog";

interface Props {
  images: string[];
  onChange: (images: string[]) => void;
  maxImages?: number;
}

export default function CarouselImageUploader({ images, onChange, maxImages = 7 }: Props) {
  const [cropSrc, setCropSrc] = useState<string | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewIdx, setPreviewIdx] = useState(0);
  const fileRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setCropSrc(reader.result as string);
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const handleCropComplete = (url: string) => {
    onChange([...images, url]);
    setCropSrc(null);
  };

  const handleDelete = (idx: number) => {
    onChange(images.filter((_, i) => i !== idx));
  };

  const handleImageClick = (idx: number) => {
    setPreviewIdx(idx);
    setPreviewOpen(true);
  };

  const scroll = (dir: number) => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({ left: dir * 160, behavior: "smooth" });
  };

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">Images ({images.length}/{maxImages})</label>
      <div className="relative">
        {images.length > 2 && (
          <>
            <button type="button" onClick={() => scroll(-1)} className="absolute left-0 top-1/2 -translate-y-1/2 z-10 rounded-full bg-background/90 border border-border p-1 shadow-sm hover:bg-background">
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button type="button" onClick={() => scroll(1)} className="absolute right-0 top-1/2 -translate-y-1/2 z-10 rounded-full bg-background/90 border border-border p-1 shadow-sm hover:bg-background">
              <ChevronRight className="h-4 w-4" />
            </button>
          </>
        )}
        <div ref={scrollRef} className="flex gap-2 overflow-x-auto py-2 px-6" style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}>
          {images.map((img, i) => (
            <div key={i} className="relative shrink-0 w-[140px] h-[105px] rounded-lg border border-border overflow-hidden bg-secondary cursor-pointer" onClick={() => handleImageClick(i)}>
              <img src={img} alt={`Upload ${i + 1}`} className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); handleDelete(i); }}
                className="absolute top-1 right-1 rounded-full bg-destructive/90 p-0.5 text-destructive-foreground hover:bg-destructive"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
          {images.length < maxImages && (
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="shrink-0 flex flex-col items-center justify-center w-[140px] h-[105px] rounded-lg border-2 border-dashed border-border bg-secondary/30 hover:bg-secondary/50 transition-colors text-muted-foreground"
            >
              <Plus className="h-5 w-5 mb-1" />
              <span className="text-[10px] font-medium">Add Image</span>
            </button>
          )}
          {images.length === 0 && (
            <div className="flex flex-col items-center justify-center w-full py-6 text-muted-foreground">
              <ImageIcon className="h-8 w-8 mb-2 opacity-30" />
              <span className="text-xs">Click "Add Image" to upload photos</span>
            </div>
          )}
        </div>
      </div>
      <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFileSelect} />
      {cropSrc && (
        <ImageCropperDialog
          open={!!cropSrc}
          onOpenChange={(o) => { if (!o) setCropSrc(null); }}
          imageSrc={cropSrc}
          onCropComplete={handleCropComplete}
        />
      )}
      <ImagePreviewDialog
        open={previewOpen}
        onOpenChange={setPreviewOpen}
        images={images}
        currentIndex={previewIdx}
        onIndexChange={setPreviewIdx}
      />
    </div>
  );
}
