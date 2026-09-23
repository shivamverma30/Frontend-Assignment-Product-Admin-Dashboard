import type { Product } from "@/types/product";

import { ProductRow } from "@/components/products/product-row";

export function ProductTable({ products }: Readonly<{ products: Product[] }>) {
  return (
    <div className="hidden overflow-hidden border border-border bg-surface xl:block">
      <table className="w-full border-collapse text-left">
        <caption className="sr-only">Product catalog</caption>
        <thead className="bg-slate-50">
          <tr className="text-xs font-semibold uppercase tracking-[0.12em] text-muted">
            <th className="px-5 py-3" scope="col">Product</th>
            <th className="px-5 py-3" scope="col">Category</th>
            <th className="px-5 py-3" scope="col">Price</th>
            <th className="px-5 py-3" scope="col">Rating</th>
            <th className="px-5 py-3" scope="col">Stock</th>
            <th className="px-5 py-3 text-right" scope="col">Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => <ProductRow key={product.id} product={product} />)}
        </tbody>
      </table>
    </div>
  );
}
