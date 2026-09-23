"use client";

import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";

import { DeleteProductButton } from "@/components/products/delete-product-button";
import { ProductListSkeleton } from "@/components/products/product-list-skeleton";
import { useProductDetail } from "@/hooks/use-product-detail";

export function ProductDetails({ id }: Readonly<{ id: number }>) {
  const [retryKey, setRetryKey] = useState(0);
  const searchParams = useSearchParams();
  const { status, product, error } = useProductDetail(id, retryKey);

  if (status === "loading") return <ProductListSkeleton />;
  if (status === "error" || !product) {
    const notFound = error?.status === 404;
    return <div className="mt-8 border border-dashed border-border bg-surface px-6 py-14 text-center"><h2 className="text-lg font-semibold text-slate-950">{notFound ? "Product not found" : "Product could not be loaded"}</h2><p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted">{notFound ? "This product may have been deleted or the product ID is invalid." : error?.message ?? "We could not load this product."}</p><div className="mt-5 flex justify-center gap-3"><Link className="border border-border px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50" href="/products">Back to products</Link>{!notFound ? <button className="bg-slate-950 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800" type="button" onClick={() => setRetryKey((value) => value + 1)}>Retry</button> : null}</div></div>;
  }

  return (
    <div className="mt-8 space-y-8">
      {searchParams.get("success") === "updated" ? <p className="border border-green-200 bg-green-50 px-3 py-2.5 text-sm text-green-800" role="status">Product updated successfully.</p> : null}
      <div className="flex flex-col gap-4 border-b border-border pb-6 sm:flex-row sm:items-start sm:justify-between">
        <div><p className="text-sm capitalize text-muted">{product.category.replaceAll("-", " ")}</p><h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">{product.title}</h2><p className="mt-2 max-w-2xl text-sm leading-6 text-muted">{product.description}</p></div>
        <div className="flex shrink-0 gap-3"><Link className="border border-border px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50" href={`/products/${product.id}/edit`}>Edit</Link><DeleteProductButton productId={product.id} productTitle={product.title} /></div>
      </div>
      <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_minmax(18rem,0.7fr)]">
        <div className="space-y-4"><div className="relative aspect-[4/3] overflow-hidden border border-border bg-slate-50">{product.images[0] || product.thumbnail ? <Image src={product.images[0] || product.thumbnail} alt={product.title} fill className="object-contain p-8" sizes="(max-width: 1280px) 100vw, 60vw" /> : <span className="absolute inset-0 flex items-center justify-center text-sm text-muted">No image available</span>}</div><div className="grid grid-cols-4 gap-3">{product.images.slice(0, 4).map((image, index) => <div className="relative aspect-square overflow-hidden border border-border bg-slate-50" key={`${image}-${index}`}><Image src={image} alt={`${product.title} view ${index + 1}`} fill className="object-cover" sizes="120px" /></div>)}</div></div>
        <dl className="grid h-fit grid-cols-2 gap-px border border-border bg-border"><DetailStat label="Price" value={formatCurrency(product.price)} /><DetailStat label="Rating" value={`${product.rating.toFixed(1)} / 5`} /><DetailStat label="Stock" value={String(product.stock)} /><DetailStat label="Category" value={product.category.replaceAll("-", " ")} /></dl>
      </div>
      <section className="border-t border-border pt-7"><h3 className="text-lg font-semibold text-slate-950">Reviews <span className="text-sm font-normal text-muted">({product.reviews.length})</span></h3>{product.reviews.length === 0 ? <p className="mt-4 text-sm text-muted">No reviews are available for this product.</p> : <div className="mt-4 divide-y divide-border border-y border-border">{product.reviews.map((review, index) => <article className="py-4" key={`${review.reviewerEmail}-${review.date}-${index}`}><div className="flex flex-wrap justify-between gap-2"><p className="text-sm font-semibold text-slate-950">{review.reviewerName}</p><p className="text-sm text-muted">{review.rating} / 5</p></div><p className="mt-2 text-sm leading-6 text-slate-600">{review.comment}</p></article>)}</div>}</section>
    </div>
  );
}

function DetailStat({ label, value }: Readonly<{ label: string; value: string }>) {
  return <div className="bg-surface p-4"><dt className="text-xs text-muted">{label}</dt><dd className="mt-1 text-sm font-semibold capitalize text-slate-950">{value}</dd></div>;
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(value);
}
