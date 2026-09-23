"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { ProductCard } from "@/components/products/product-card";
import { ProductListSkeleton } from "@/components/products/product-list-skeleton";
import { Pagination } from "@/components/products/pagination";
import { ProductTable } from "@/components/products/product-table";
import { EmptyState } from "@/components/ui/empty-state";
import { useProductList } from "@/hooks/use-product-list";
import { getPageRange, getTotalPages, parseProductListUrl } from "@/lib/utils/product-query";

export function ProductCatalog() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { page, pageSize } = parseProductListUrl(searchParams);
  const [retryKey, setRetryKey] = useState(0);
  const { status, data, error } = useProductList({ page, pageSize, retryKey });
  const totalPages = data ? getTotalPages(data.total, pageSize) : 1;

  useEffect(() => {
    const rawPage = searchParams.get("page");
    const rawPageSize = searchParams.get("pageSize");
    const hasInvalidPage = rawPage !== null && rawPage !== String(page);
    const hasInvalidPageSize = rawPageSize !== null && rawPageSize !== String(pageSize);

    if (hasInvalidPage || hasInvalidPageSize) {
      replaceUrl(router, pathname, searchParams, hasInvalidPage ? page : undefined, hasInvalidPageSize ? pageSize : undefined);
    }
  }, [page, pageSize, pathname, router, searchParams]);

  useEffect(() => {
    if (data && page > totalPages) {
      replaceUrl(router, pathname, searchParams, totalPages);
    }
  }, [data, page, pathname, router, searchParams, totalPages]);

  function handlePageChange(nextPage: number) {
    replaceUrl(router, pathname, searchParams, nextPage);
  }

  function handlePageSizeChange(nextPageSize: number) {
    replaceUrl(router, pathname, searchParams, 1, nextPageSize);
  }

  return (
    <div className="mt-8 space-y-5">
      <div className="flex flex-col gap-4 border-y border-border py-4 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex flex-1 flex-col gap-3 sm:flex-row">
          <input className="w-full border border-border bg-surface px-3 py-2.5 text-sm text-slate-950 outline-none placeholder:text-muted focus:border-brand focus:ring-2 focus:ring-orange-100 sm:max-w-sm" type="search" placeholder="Search products (coming next)" disabled aria-label="Search products" />
          <select className="border border-border bg-surface px-3 py-2.5 text-sm text-muted outline-none" disabled aria-label="Filter by category">
            <option>Category filter (coming next)</option>
          </select>
          <select className="border border-border bg-surface px-3 py-2.5 text-sm text-muted outline-none" disabled aria-label="Sort products">
            <option>Sort (coming next)</option>
          </select>
        </div>
        <Link className="inline-flex items-center justify-center bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800" href="/products/new">
          Add product
        </Link>
      </div>

      {status === "loading" ? <ProductListSkeleton /> : null}
      {status === "error" ? <ErrorState message={error?.message ?? "We could not load products."} onRetry={() => setRetryKey((value) => value + 1)} /> : null}
      {status === "success" && data?.products.length === 0 ? <EmptyState title="No products found" description="There are no products available for this page yet." /> : null}
      {status === "success" && data && data.products.length > 0 ? <><ProductTable products={data.products} /><div className="space-y-3 lg:hidden">{data.products.map((product) => <ProductCard key={product.id} product={product} />)}</div><Pagination page={Math.min(page, totalPages)} pageSize={pageSize} total={data.total} totalPages={totalPages} isLoading={false} onPageChange={handlePageChange} onPageSizeChange={handlePageSizeChange} /></> : null}
      {status === "success" && data ? <p className="text-xs text-muted">{getPageRange(Math.min(page, totalPages), pageSize, data.total).start === 0 ? "Catalog is empty" : `${data.total} products in the catalog`}</p> : null}
    </div>
  );
}

function ErrorState({ message, onRetry }: Readonly<{ message: string; onRetry: () => void }>) {
  return <div className="border border-red-200 bg-red-50 px-6 py-10 text-center"><h2 className="text-base font-semibold text-red-900">Products could not be loaded</h2><p className="mx-auto mt-2 max-w-md text-sm leading-6 text-red-700">{message}</p><button className="mt-5 border border-red-300 bg-white px-4 py-2 text-sm font-semibold text-red-800 transition hover:bg-red-100" type="button" onClick={onRetry}>Retry</button></div>;
}

function replaceUrl(router: ReturnType<typeof useRouter>, pathname: string, searchParams: { toString: () => string }, page?: number, pageSize?: number) {
  const nextParams = new URLSearchParams(searchParams.toString());
  if (page !== undefined) nextParams.set("page", String(page));
  if (pageSize !== undefined) nextParams.set("pageSize", String(pageSize));
  router.replace(`${pathname}?${nextParams.toString()}`);
}
