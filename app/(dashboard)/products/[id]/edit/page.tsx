import type { Metadata } from "next";

import Link from "next/link";
import { EditProductWorkflow } from "@/components/products/edit-product-workflow";
import { PageHeader } from "@/components/ui/page-header";

export const metadata: Metadata = {
  title: "Edit product",
};

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const productId = Number(id);

  return (
    <section>
      <PageHeader eyebrow={`Product ${id}`} title="Edit product" description="Update product information and inventory details." />
      {Number.isInteger(productId) && productId > 0 ? <EditProductWorkflow productId={productId} /> : <EditNotFound />}
    </section>
  );
}

function EditNotFound({ message = "This product could not be found." }: Readonly<{ message?: string }>) {
  return <div className="mt-8 border border-dashed border-border bg-surface px-6 py-14 text-center"><h2 className="text-lg font-semibold text-slate-950">Product not found</h2><p className="mt-2 text-sm text-muted">{message}</p><Link className="mt-5 inline-flex bg-slate-950 px-4 py-2 text-sm font-semibold text-white" href="/products">Back to products</Link></div>;
}