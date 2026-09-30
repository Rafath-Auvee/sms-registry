export function SectionHeading({ eyebrow, title, text }: { eyebrow: string; title: string; text: string }) {
  return (
    <div className="max-w-2xl space-y-3">
      <p className="text-sm font-medium text-primary">{eyebrow}</p>
      <h2 className="text-3xl font-semibold tracking-tight text-balance">{title}</h2>
      <p className="text-pretty text-muted-foreground">{text}</p>
    </div>
  );
}
