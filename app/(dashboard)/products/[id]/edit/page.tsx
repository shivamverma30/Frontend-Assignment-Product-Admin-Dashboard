import type { Metadata } from "next";

import { EmptyState } from "@/components/ui/empty-state";
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

  return (
    <section>
      <PageHeader eyebrow={`Product ${id}`} title="Edit product" description="Update product information and inventory details." />
      <EmptyState title="Edit form is ready for the next step" description="The validated edit workflow will use the shared product API module." />
    </section>
  );
}