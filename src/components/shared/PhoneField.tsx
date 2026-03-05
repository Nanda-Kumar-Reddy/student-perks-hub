import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface Props {
  value: string;
  onChange: (v: string) => void;
  label?: string;
  className?: string;
}

export default function PhoneField({ value, onChange, label = "Australian Phone Number", className }: Props) {
  return (
    <div className={className}>
      <Label>{label}</Label>
      <Input className="mt-1.5" value={value} onChange={(e) => onChange(e.target.value)} placeholder="+61 4XX XXX XXX" />
      <p className="mt-1 text-xs text-muted-foreground">Format: +61 4XX XXX XXX or 04XX XXX XXX</p>
    </div>
  );
}
