import type { Metadata } from "next";

import Link from "next/link";
import { ProductDetails } from "@/components/products/product-details";
import { PageHeader } from "@/components/ui/page-header";

export const metadata: Metadata = {
  title: "Product details",
};

export default async function ProductDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const productId = Number(id);

  return (
    <section>
      <PageHeader
        eyebrow={`Product ${id}`}
        title="Product details"
        description="Review product information, customer feedback, and inventory details."
      />
      {Number.isInteger(productId) && productId > 0 ? <ProductDetails id={productId} /> : <NotFoundProduct />}
    </section>
  );
}

function NotFoundProduct() {
  return <div className="mt-8 border border-dashed border-border bg-surface px-6 py-14 text-center"><h2 className="text-lg font-semibold text-slate-950">Product not found</h2><p className="mt-2 text-sm text-muted">The product ID is not valid.</p><Link className="mt-5 inline-flex bg-slate-950 px-4 py-2 text-sm font-semibold text-white" href="/products">Back to products</Link></div>;
}