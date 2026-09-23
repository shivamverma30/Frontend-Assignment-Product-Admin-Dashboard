import type { Metadata } from "next";

import { ProductForm } from "@/components/products/product-form";
import { PageHeader } from "@/components/ui/page-header";

export const metadata: Metadata = {
  title: "Add product",
};

export default function NewProductPage() {
  return (
    <section>
      <PageHeader eyebrow="Catalog" title="Add product" description="Create a new product for the catalog." />
      <ProductForm mode="create" />
    </section>
  );
}