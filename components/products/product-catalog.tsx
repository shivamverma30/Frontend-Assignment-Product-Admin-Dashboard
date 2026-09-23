"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

import { ProductCard } from "@/components/products/product-card";
import { ProductListSkeleton } from "@/components/products/product-list-skeleton";
import { Pagination } from "@/components/products/pagination";
import { ProductTable } from "@/components/products/product-table";
import { EmptyState } from "@/components/ui/empty-state";
import { useProductCategories } from "@/hooks/use-product-categories";
import { useProductList } from "@/hooks/use-product-list";
import { getPageRange, getTotalPages, parseProductListUrl, type ProductListUrlState } from "@/lib/utils/product-query";
import type { ProductSortField } from "@/types/product";

export function ProductCatalog() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const query = parseProductListUrl(searchParams);
  const success = searchParams.get("success");
  const [retryKey, setRetryKey] = useState(0);
  const [categoryRetryKey, setCategoryRetryKey] = useState(0);
  const { status: categoryStatus, categories, error: categoryError } = useProductCategories(categoryRetryKey);
  const activeCategory = categoryStatus === "success" && categories.includes(query.category) ? query.category : "";
  const { status, data, error } = useProductList({ ...query, category: activeCategory, retryKey });
  const { page, pageSize } = query;
  const totalPages = data ? getTotalPages(data.total, pageSize) : 1;

  useEffect(() => {
    const rawPage = searchParams.get("page");
    const rawPageSize = searchParams.get("pageSize");
    const updates: Partial<ProductListUrlState> = {};
    if (rawPage !== null && rawPage !== String(page)) updates.page = page;
    if (rawPageSize !== null && rawPageSize !== String(pageSize)) updates.pageSize = pageSize;
    const rawSearch = searchParams.get("search");
    if (rawSearch !== null && rawSearch !== query.search) updates.search = query.search;
    const rawSortBy = searchParams.get("sortBy");
    if (rawSortBy !== null && rawSortBy !== query.sortBy) updates.sortBy = query.sortBy;
    const rawSortOrder = searchParams.get("sortOrder");
    if (rawSortOrder !== null && rawSortOrder !== query.sortOrder) updates.sortOrder = query.sortOrder;
    const rawCategory = searchParams.get("category");
    if (categoryStatus === "success" && rawCategory !== null && !categories.includes(query.category)) {
      updates.category = "";
      updates.page = 1;
    }

    if (Object.keys(updates).length > 0) replaceUrl(pathname, updates);
  }, [categories, categoryStatus, page, pageSize, pathname, query.category, query.search, query.sortBy, query.sortOrder, searchParams]);

  useEffect(() => {
    if (data && page > totalPages) {
      replaceUrl(pathname, { page: totalPages });
    }
  }, [data, page, pathname, searchParams, totalPages]);

  function handlePageChange(nextPage: number) {
    replaceUrl(pathname, { page: nextPage });
  }

  function handlePageSizeChange(nextPageSize: number) {
    replaceUrl(pathname, { page: 1, pageSize: nextPageSize });
  }

  function handleSearchChange(search: string) {
    replaceUrl(pathname, { page: 1, search });
  }

  function handleCategoryChange(category: string) {
    replaceUrl(pathname, { page: 1, category });
  }

  function handleSortChange(sortBy: ProductSortField | "") {
    replaceUrl(pathname, { page: 1, sortBy });
  }

  function handleSortOrderChange(sortOrder: "asc" | "desc") {
    replaceUrl(pathname, { page: 1, sortOrder });
  }

  const isLoading = status === "loading";
  const catalogData = data;

  return (
    <div className="mt-8 space-y-5">
      {success === "created" ? <p className="border border-green-200 bg-green-50 px-3 py-2.5 text-sm text-green-800" role="status">Product created successfully.</p> : null}
      <div className="flex flex-col gap-4 border-y border-border py-4 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:flex-wrap">
          <label className="sr-only" htmlFor="product-search">Search products</label>
          <input className="w-full border border-border bg-surface px-3 py-2.5 text-sm text-slate-950 outline-none placeholder:text-muted focus:border-brand focus:ring-2 focus:ring-orange-100 sm:max-w-sm" id="product-search" type="search" value={query.search} onChange={(event) => handleSearchChange(event.target.value)} placeholder="Search products" aria-label="Search products" />
          <label className="sr-only" htmlFor="product-category">Filter by category</label>
          <select className="border border-border bg-surface px-3 py-2.5 text-sm text-slate-950 outline-none focus:border-brand focus:ring-2 focus:ring-orange-100" id="product-category" value={activeCategory} onChange={(event) => handleCategoryChange(event.target.value)} disabled={Boolean(query.search) || categoryStatus !== "success"} aria-describedby="category-help">
            <option value="">All categories</option>
            {categoryStatus === "loading" ? <option disabled>Loading categories...</option> : null}
            {categories.map((category) => <option key={category} value={category}>{category.replaceAll("-", " ")}</option>)}
          </select>
          <label className="sr-only" htmlFor="product-sort">Sort products by</label>
          <select className="border border-border bg-surface px-3 py-2.5 text-sm text-slate-950 outline-none focus:border-brand focus:ring-2 focus:ring-orange-100" id="product-sort" value={query.sortBy} onChange={(event) => handleSortChange(event.target.value as ProductSortField | "")}>
            <option value="">Sort by</option>
            <option value="title">Title</option>
            <option value="price">Price</option>
            <option value="rating">Rating</option>
          </select>
          <label className="sr-only" htmlFor="product-sort-order">Sort order</label>
          <select className="border border-border bg-surface px-3 py-2.5 text-sm text-slate-950 outline-none focus:border-brand focus:ring-2 focus:ring-orange-100" id="product-sort-order" value={query.sortOrder} onChange={(event) => handleSortOrderChange(event.target.value as "asc" | "desc")}>
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>
        </div>
        <Link className="inline-flex items-center justify-center bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800" href="/products/new">
          Add product
        </Link>
      </div>
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted" id="category-help">
        {query.search ? <span>Category filtering is unavailable while search is active because the API exposes search and category as separate product endpoints.</span> : null}
        {categoryStatus === "error" ? <><span>{categoryError?.message ?? "Categories could not be loaded."}</span><button className="font-semibold text-brand-strong hover:text-slate-950" type="button" onClick={() => setCategoryRetryKey((value) => value + 1)}>Retry categories</button></> : null}
      </div>

      {isLoading && !catalogData ? <ProductListSkeleton /> : null}
      {isLoading && catalogData ? <p className="text-xs text-muted" aria-live="polite">Updating products...</p> : null}
      {status === "error" ? <ErrorState message={error?.message ?? "We could not load products."} onRetry={() => setRetryKey((value) => value + 1)} /> : null}
      {status === "success" && catalogData?.products.length === 0 ? <EmptyState title="No products found" description="Try a different search, category, or sorting option." /> : null}
      {catalogData && catalogData.products.length > 0 ? <><ProductTable products={catalogData.products} /><div className="space-y-3 xl:hidden">{catalogData.products.map((product) => <ProductCard key={product.id} product={product} />)}</div><Pagination page={Math.min(page, totalPages)} pageSize={pageSize} total={catalogData.total} totalPages={totalPages} isLoading={isLoading} onPageChange={handlePageChange} onPageSizeChange={handlePageSizeChange} /></> : null}
      {catalogData ? <p className="text-xs text-muted">{getPageRange(Math.min(page, totalPages), pageSize, catalogData.total).start === 0 ? "Catalog is empty" : `${catalogData.total} products in the catalog`}</p> : null}
    </div>
  );
}

function ErrorState({ message, onRetry }: Readonly<{ message: string; onRetry: () => void }>) {
  return <div className="border border-red-200 bg-red-50 px-6 py-10 text-center"><h2 className="text-base font-semibold text-red-900">Products could not be loaded</h2><p className="mx-auto mt-2 max-w-md text-sm leading-6 text-red-700">{message}</p><button className="mt-5 border border-red-300 bg-white px-4 py-2 text-sm font-semibold text-red-800 transition hover:bg-red-100" type="button" onClick={onRetry}>Retry</button></div>;
}

function replaceUrl(pathname: string, updates: Partial<ProductListUrlState>) {
  const nextParams = new URLSearchParams(window.location.search);
  Object.entries(updates).forEach(([key, value]) => nextParams.set(key, String(value)));
  window.history.replaceState(null, "", `${pathname}?${nextParams.toString()}`);
}
