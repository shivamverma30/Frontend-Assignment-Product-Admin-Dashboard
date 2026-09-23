import type { Metadata } from "next";

import { EmptyState } from "@/components/ui/empty-state";
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

  return (
    <section>
      <PageHeader
        eyebrow={`Product ${id}`}
        title="Product details"
        description="Product detail fields, reviews, and editing controls will be added next."
      />
      <EmptyState
        title="Detail view is ready"
        description="This route is connected and prepared for the typed product detail request."
      />
    </section>
  );
}