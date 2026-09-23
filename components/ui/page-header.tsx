export function PageHeader({
  eyebrow,
  title,
  description,
}: Readonly<{ eyebrow: string; title: string; description: string }>) {
  return (
    <header className="border-b border-border pb-7">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand">{eyebrow}</p>
      <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">{title}</h1>
      <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">{description}</p>
    </header>
  );
}