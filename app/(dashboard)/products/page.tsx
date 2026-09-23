import type { Metadata } from "next";

import { PageHeader } from "@/components/ui/page-header";
import { EmptyState } from "@/components/ui/empty-state";

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
      <EmptyState
        title="Product workspace is ready"
        description="The catalog table, filters, and pagination will be added in the next implementation step."
      />
    </section>
  );
}