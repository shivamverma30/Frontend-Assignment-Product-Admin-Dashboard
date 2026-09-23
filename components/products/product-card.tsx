import Link from "next/link";

import { DeleteProductButton } from "@/components/products/delete-product-button";
import { ProductImage } from "@/components/products/product-row";
import type { Product } from "@/types/product";

export function ProductCard({ product }: Readonly<{ product: Product }>) {
  return (
    <article className="border border-border bg-surface p-4">
      <div className="flex items-start gap-3">
        <ProductImage product={product} />
        <div className="min-w-0 flex-1">
          <Link className="block truncate text-sm font-semibold text-slate-950 hover:text-brand-strong" href={`/products/${product.id}`}>
            {product.title}
          </Link>
          <p className="mt-1 text-xs capitalize text-muted">{product.category.replaceAll("-", " ")}</p>
        </div>
        <Link className="text-sm font-semibold text-brand-strong" href={`/products/${product.id}`}>View</Link>
      </div>
      <dl className="mt-5 grid grid-cols-3 gap-3 border-t border-border pt-4">
        <div>
          <dt className="text-xs text-muted">Price</dt>
          <dd className="mt-1 text-sm font-semibold text-slate-950">{formatCurrency(product.price)}</dd>
        </div>
        <div>
          <dt className="text-xs text-muted">Rating</dt>
          <dd className="mt-1 text-sm font-semibold text-slate-950">{product.rating.toFixed(1)}</dd>
        </div>
        <div>
          <dt className="text-xs text-muted">Stock</dt>
          <dd className="mt-1 text-sm font-semibold text-slate-950">{product.stock}</dd>
        </div>
      </dl>
      <div className="mt-4 flex items-center gap-4 border-t border-border pt-4">
        <Link className="text-sm font-semibold text-slate-600" href={`/products/${product.id}/edit`}>Edit</Link>
        <DeleteProductButton productId={product.id} productTitle={product.title} />
      </div>
    </article>
  );
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(value);
}
