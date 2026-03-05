interface Props {
  title: string;
  children: React.ReactNode;
}

export default function FormSection({ title, children }: Props) {
  return (
    <div className="space-y-4">
      <h3 className="font-display font-bold text-sm uppercase tracking-wide text-muted-foreground border-b border-border pb-2">{title}</h3>
      {children}
    </div>
  );
}
