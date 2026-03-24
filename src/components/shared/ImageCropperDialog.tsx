/**
 * ImageCropperDialog — crop, zoom, rotate an image before adding to carousel
 */
import { useState, useRef, useCallback } from "react";
import ReactCrop, { type Crop, centerCrop, makeAspectCrop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { ZoomIn, ZoomOut, RotateCw } from "lucide-react";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  imageSrc: string;
  onCropComplete: (croppedUrl: string) => void;
}

function centerAspectCrop(mediaWidth: number, mediaHeight: number, aspect: number) {
  return centerCrop(
    makeAspectCrop({ unit: "%", width: 90 }, aspect, mediaWidth, mediaHeight),
    mediaWidth,
    mediaHeight
  );
}

export default function ImageCropperDialog({ open, onOpenChange, imageSrc, onCropComplete }: Props) {
  const [crop, setCrop] = useState<Crop>();
  const [zoom, setZoom] = useState([1]);
  const [rotation, setRotation] = useState(0);
  const imgRef = useRef<HTMLImageElement>(null);

  const onImageLoad = useCallback((e: React.SyntheticEvent<HTMLImageElement>) => {
    const { naturalWidth: w, naturalHeight: h } = e.currentTarget;
    setCrop(centerAspectCrop(w, h, 4 / 3));
  }, []);

  const handleCrop = useCallback(() => {
    if (!imgRef.current || !crop) return;
    const img = imgRef.current;
    const canvas = document.createElement("canvas");
    const scaleX = img.naturalWidth / img.width;
    const scaleY = img.naturalHeight / img.height;
    const pixelCrop = {
      x: (crop.unit === "%" ? (crop.x / 100) * img.width : crop.x) * scaleX,
      y: (crop.unit === "%" ? (crop.y / 100) * img.height : crop.y) * scaleY,
      width: (crop.unit === "%" ? (crop.width / 100) * img.width : crop.width) * scaleX,
      height: (crop.unit === "%" ? (crop.height / 100) * img.height : crop.height) * scaleY,
    };

    canvas.width = pixelCrop.width;
    canvas.height = pixelCrop.height;
    const ctx = canvas.getContext("2d")!;

    // rotation
    if (rotation !== 0) {
      const rad = (rotation * Math.PI) / 180;
      const cos = Math.abs(Math.cos(rad));
      const sin = Math.abs(Math.sin(rad));
      const rW = img.naturalWidth * cos + img.naturalHeight * sin;
      const rH = img.naturalWidth * sin + img.naturalHeight * cos;
      const tempCanvas = document.createElement("canvas");
      tempCanvas.width = rW;
      tempCanvas.height = rH;
      const tCtx = tempCanvas.getContext("2d")!;
      tCtx.translate(rW / 2, rH / 2);
      tCtx.rotate(rad);
      tCtx.drawImage(img, -img.naturalWidth / 2, -img.naturalHeight / 2);
      ctx.drawImage(tempCanvas, pixelCrop.x, pixelCrop.y, pixelCrop.width, pixelCrop.height, 0, 0, pixelCrop.width, pixelCrop.height);
    } else {
      ctx.drawImage(img, pixelCrop.x, pixelCrop.y, pixelCrop.width, pixelCrop.height, 0, 0, pixelCrop.width, pixelCrop.height);
    }

    const url = canvas.toDataURL("image/jpeg", 0.92);
    onCropComplete(url);
    onOpenChange(false);
  }, [crop, rotation, onCropComplete, onOpenChange]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Crop Image</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="flex justify-center rounded-lg border border-border bg-secondary/30 overflow-hidden max-h-[40vh]">
            <ReactCrop crop={crop} onChange={setCrop} aspect={4 / 3}>
              <img
                ref={imgRef}
                src={imageSrc}
                onLoad={onImageLoad}
                style={{ transform: `scale(${zoom[0]}) rotate(${rotation}deg)`, maxHeight: "40vh", transition: "transform 0.2s" }}
                alt="Crop preview"
              />
            </ReactCrop>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <ZoomOut className="h-4 w-4 text-muted-foreground shrink-0" />
              <Slider value={zoom} onValueChange={setZoom} min={0.5} max={3} step={0.1} className="flex-1" />
              <ZoomIn className="h-4 w-4 text-muted-foreground shrink-0" />
            </div>
            <div className="flex items-center gap-3">
              <Button size="sm" variant="outline" className="gap-1" onClick={() => setRotation((r) => (r + 90) % 360)}>
                <RotateCw className="h-3.5 w-3.5" /> Rotate 90°
              </Button>
              <span className="text-xs text-muted-foreground">{rotation}°</span>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleCrop}>Apply Crop</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
