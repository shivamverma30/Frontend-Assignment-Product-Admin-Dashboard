"use client";

import { useRef, useState } from "react";

import { deleteProduct } from "@/lib/api/products";
import { normalizeApiError } from "@/lib/api/errors";
import { isLocalProduct, markProductDeleted } from "@/lib/product-store";

export function DeleteProductButton({ productId, productTitle }: Readonly<{ productId: number; productTitle: string }>) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function openDialog() {
    setError(null);
    dialogRef.current?.showModal();
  }

  function closeDialog() {
    if (!isDeleting) dialogRef.current?.close();
  }

  async function confirmDelete() {
    if (isDeleting) return;
    setIsDeleting(true);
    setError(null);
    try {
      await deleteProduct(productId);
      markProductDeleted(productId);
      dialogRef.current?.close();
    } catch (deleteError) {
      const normalizedError = normalizeApiError(deleteError);
      if (normalizedError.status === 404 && isLocalProduct(productId)) {
        markProductDeleted(productId);
        dialogRef.current?.close();
      } else {
        setError(normalizedError.message);
      }
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <>
      <button className="text-sm font-semibold text-red-700 hover:text-red-900" type="button" onClick={openDialog}>Delete</button>
      <dialog ref={dialogRef} className="m-auto w-[min(92vw,28rem)] border border-border bg-surface p-0 text-slate-950 shadow-xl backdrop:bg-slate-950/30" aria-labelledby={`delete-title-${productId}`}>
        <div className="p-6">
          <h2 className="text-lg font-semibold" id={`delete-title-${productId}`}>Delete product?</h2>
          <p className="mt-2 text-sm leading-6 text-muted">This will remove <strong>{productTitle}</strong> from this dashboard. The change is kept locally because DummyJSON mutations are simulated.</p>
          {error ? <p className="mt-4 border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700" role="alert">{error}</p> : null}
          <div className="mt-6 flex justify-end gap-3">
            <button className="border border-border px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50" type="button" onClick={closeDialog} disabled={isDeleting}>Cancel</button>
            <button className="bg-red-700 px-4 py-2 text-sm font-semibold text-white hover:bg-red-800 disabled:opacity-60" type="button" onClick={confirmDelete} disabled={isDeleting}>{isDeleting ? "Deleting..." : "Delete product"}</button>
          </div>
        </div>
      </dialog>
    </>
  );
}
