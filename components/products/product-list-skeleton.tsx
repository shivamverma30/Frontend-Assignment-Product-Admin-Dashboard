export function ProductListSkeleton() {
  return (
    <div className="space-y-3" aria-label="Loading products" aria-busy="true">
      <div className="hidden overflow-hidden border border-border bg-surface lg:block">
        {[...Array(7).keys()].map((index) => <SkeletonRow key={index} />)}
      </div>
      <div className="space-y-3 lg:hidden">
        {[...Array(5).keys()].map((index) => <SkeletonCard key={index} />)}
      </div>
    </div>
  );
}

function SkeletonRow() {
  return <div className="flex h-[73px] items-center gap-5 border-b border-border px-5 last:border-b-0"><SkeletonBlock className="h-10 w-10 shrink-0" /><SkeletonBlock className="h-4 w-2/5" /><SkeletonBlock className="ml-auto h-4 w-16" /><SkeletonBlock className="h-4 w-12" /><SkeletonBlock className="h-4 w-12" /></div>;
}

function SkeletonCard() {
  return <div className="border border-border bg-surface p-4"><div className="flex items-center gap-3"><SkeletonBlock className="h-11 w-11 shrink-0" /><SkeletonBlock className="h-4 flex-1" /></div><div className="mt-5 grid grid-cols-3 gap-3 border-t border-border pt-4"><SkeletonBlock className="h-4" /><SkeletonBlock className="h-4" /><SkeletonBlock className="h-4" /></div></div>;
}

function SkeletonBlock({ className }: Readonly<{ className: string }>) {
  return <div className={`animate-pulse bg-slate-200 ${className}`} />;
}
