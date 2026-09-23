import Image from "next/image";
import Link from "next/link";

import type { Product } from "@/types/product";

export function ProductRow({ product }: Readonly<{ product: Product }>) {
  return (
    <tr className="border-t border-border transition hover:bg-slate-50">
      <td className="px-5 py-4">
        <div className="flex min-w-64 items-center gap-3">
          <ProductImage product={product} />
          <div className="min-w-0">
            <Link className="block truncate text-sm font-semibold text-slate-950 hover:text-brand-strong" href={`/products/${product.id}`}>
              {product.title}
            </Link>
            <p className="mt-1 truncate text-xs text-muted">SKU {product.sku}</p>
          </div>
        </div>
      </td>
      <td className="px-5 py-4 text-sm capitalize text-slate-600">{product.category.replaceAll("-", " ")}</td>
      <td className="px-5 py-4 text-sm font-medium text-slate-950">{formatCurrency(product.price)}</td>
      <td className="px-5 py-4 text-sm text-slate-600">{product.rating.toFixed(1)}</td>
      <td className="px-5 py-4 text-sm text-slate-600">{product.stock}</td>
      <td className="px-5 py-4 text-right">
        <Link className="text-sm font-semibold text-brand-strong hover:text-slate-950" href={`/products/${product.id}`}>
          View
        </Link>
      </td>
    </tr>
  );
}

export function ProductImage({ product }: Readonly<{ product: Product }>) {
  return (
    <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden border border-border bg-slate-50">
      <Image src={product.thumbnail} alt="" width={44} height={44} className="h-full w-full object-cover" />
    </div>
  );
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(value);
}
