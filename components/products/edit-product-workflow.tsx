"use client";

import Link from "next/link";

import { ProductForm } from "@/components/products/product-form";
import { ProductListSkeleton } from "@/components/products/product-list-skeleton";
import { useProductDetail } from "@/hooks/use-product-detail";

export function EditProductWorkflow({ productId }: Readonly<{ productId: number }>) {
  const { status, product, error } = useProductDetail(productId, 0);
  if (status === "loading") return <div className="mt-8"><ProductListSkeleton /></div>;
  if (!product) return <div className="mt-8 border border-dashed border-border bg-surface px-6 py-14 text-center"><h2 className="text-lg font-semibold text-slate-950">Product not found</h2><p className="mt-2 text-sm text-muted">{error?.message ?? "This product could not be found."}</p><Link className="mt-5 inline-flex bg-slate-950 px-4 py-2 text-sm font-semibold text-white" href="/products">Back to products</Link></div>;
  return <ProductForm mode="edit" product={product} />;
}
