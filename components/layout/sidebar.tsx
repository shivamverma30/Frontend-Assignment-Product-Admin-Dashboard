import Link from "next/link";

export function Sidebar() {
  return (
    <aside className="border-b border-border bg-surface px-5 py-5 lg:min-h-screen lg:w-64 lg:shrink-0 lg:border-b-0 lg:border-r lg:px-6 lg:py-8">
      <Link className="block text-lg font-semibold tracking-tight text-slate-950" href="/products">
        Product Admin
      </Link>
      <p className="mt-1 text-xs text-muted">Operations workspace</p>
      <nav className="mt-8" aria-label="Primary navigation">
        <Link className="block border-l-2 border-brand bg-orange-50 px-3 py-2 text-sm font-semibold text-brand-strong" href="/products">
          Products
        </Link>
      </nav>
    </aside>
  );
}