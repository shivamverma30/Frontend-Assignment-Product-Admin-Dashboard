export function EmptyState({
  title,
  description,
}: Readonly<{ title: string; description: string }>) {
  return (
    <div className="mt-8 border border-dashed border-border bg-surface px-6 py-14 text-center">
      <h2 className="text-base font-semibold text-slate-950">{title}</h2>
      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted">{description}</p>
    </div>
  );
}