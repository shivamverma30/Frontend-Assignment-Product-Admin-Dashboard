import type { Metadata } from "next";
import { Suspense } from "react";

import { ProductCatalog } from "@/components/products/product-catalog";
import { ProductListSkeleton } from "@/components/products/product-list-skeleton";
import { PageHeader } from "@/components/ui/page-header";

export const metadata: Metadata = {
  title: "Products",
};

export default function ProductsPage() {
  return (
    <section>
      <PageHeader
        eyebrow="Catalog"
        title="Products"
        description="Review inventory, pricing, and product performance in one place."
      />
      <Suspense fallback={<div className="mt-8"><ProductListSkeleton /></div>}>
        <ProductCatalog />
      </Suspense>
    </section>
  );
}