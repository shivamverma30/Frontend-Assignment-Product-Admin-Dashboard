import type { Metadata } from "next";

import { EmptyState } from "@/components/ui/empty-state";
import { PageHeader } from "@/components/ui/page-header";

export const metadata: Metadata = {
  title: "Add product",
};

export default function NewProductPage() {
  return (
    <section>
      <PageHeader eyebrow="Catalog" title="Add product" description="Create a new product for the catalog." />
      <EmptyState title="Product form is ready for the next step" description="The validated create workflow will be added alongside the product repository." />
    </section>
  );
}