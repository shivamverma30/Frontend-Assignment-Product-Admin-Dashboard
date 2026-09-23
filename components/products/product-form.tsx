"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

import { useProductCategories } from "@/hooks/use-product-categories";
import { normalizeApiError } from "@/lib/api/errors";
import { createProduct, updateProduct } from "@/lib/api/products";
import { createLocalProduct, saveProductOverride } from "@/lib/product-store";
import type { Product, ProductMutationInput } from "@/types/product";

interface ProductFormProps {
  mode: "create" | "edit";
  product?: Product;
}

type FormValues = Omit<ProductMutationInput, "price" | "stock" | "thumbnail"> & { price: string; stock: string; thumbnail: string };

const fieldClassName = "mt-2 block w-full border border-border bg-surface px-3 py-2.5 text-sm text-slate-950 outline-none transition focus:border-brand focus:ring-2 focus:ring-orange-100";

export function ProductForm({ mode, product }: ProductFormProps) {
  const router = useRouter();
  const { categories, status: categoryStatus, error: categoryError } = useProductCategories(0);
  const [values, setValues] = useState<FormValues>(() => ({
    title: product?.title ?? "",
    description: product?.description ?? "",
    category: product?.category ?? "",
    price: product ? String(product.price) : "",
    stock: product ? String(product.stock) : "",
    thumbnail: product?.thumbnail ?? "",
  }));
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [apiError, setApiError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  function updateValue(field: keyof FormValues, value: string) {
    setValues((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: "" }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isSaving) return;

    const validationErrors = validate(values);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    const input: ProductMutationInput = {
      title: values.title.trim(),
      description: values.description.trim(),
      category: values.category.trim(),
      price: Number(values.price),
      stock: Number(values.stock),
      ...(values.thumbnail.trim() ? { thumbnail: values.thumbnail.trim() } : {}),
    };

    setApiError(null);
    setIsSaving(true);
    try {
      if (mode === "create") {
        const response = await createProduct(input);
        createLocalProduct(response, input);
        router.replace("/products?success=created");
      } else if (product) {
        const response = await updateProduct(product.id, input);
        saveProductOverride(product.id, { ...input, ...response });
        router.replace(`/products/${product.id}?success=updated`);
      }
    } catch (error) {
      setApiError(normalizeApiError(error).message);
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <form className="mt-8 max-w-3xl border border-border bg-surface p-5 sm:p-7" onSubmit={handleSubmit} noValidate>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Title" name="title" value={values.title} error={errors.title} onChange={(value) => updateValue("title", value)} />
        <label className="block text-sm font-medium text-slate-700" htmlFor="category">
          Category
          <select className={fieldClassName} id="category" value={values.category} onChange={(event) => updateValue("category", event.target.value)} aria-invalid={Boolean(errors.category)}>
            <option value="">Select a category</option>
            {categoryStatus === "loading" ? <option disabled>Loading categories...</option> : null}
            {categories.map((category) => <option key={category} value={category}>{category.replaceAll("-", " ")}</option>)}
          </select>
          {errors.category ? <FieldError message={errors.category} /> : null}
          {categoryStatus === "error" ? <FieldError message={categoryError?.message ?? "Categories could not be loaded."} /> : null}
        </label>
        <Field label="Price" name="price" type="number" min="0.01" step="0.01" value={values.price} error={errors.price} onChange={(value) => updateValue("price", value)} />
        <Field label="Stock" name="stock" type="number" min="0" step="1" value={values.stock} error={errors.stock} onChange={(value) => updateValue("stock", value)} />
        <div className="sm:col-span-2"><Field label="Image URL (optional)" name="thumbnail" type="url" value={values.thumbnail} error={errors.thumbnail} onChange={(value) => updateValue("thumbnail", value)} placeholder="https://..." /></div>
        <label className="block text-sm font-medium text-slate-700 sm:col-span-2" htmlFor="description">
          Description
          <textarea className={`${fieldClassName} min-h-32 resize-y`} id="description" value={values.description} onChange={(event) => updateValue("description", event.target.value)} aria-invalid={Boolean(errors.description)} />
          {errors.description ? <FieldError message={errors.description} /> : null}
        </label>
      </div>
      {apiError ? <p className="mt-5 border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-700" role="alert">{apiError}</p> : null}
      <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <button className="border border-border px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50" type="button" onClick={() => router.back()} disabled={isSaving}>Cancel</button>
        <button className="bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60" type="submit" disabled={isSaving}>{isSaving ? "Saving..." : mode === "create" ? "Create product" : "Save changes"}</button>
      </div>
    </form>
  );
}

function Field({ label, name, value, error, onChange, type = "text", ...props }: Readonly<{ label: string; name: string; value: string; error?: string; onChange: (value: string) => void; type?: string; min?: string; step?: string; placeholder?: string }>) {
  return <label className="block text-sm font-medium text-slate-700" htmlFor={name}>{label}<input className={fieldClassName} id={name} name={name} type={type} value={value} onChange={(event) => onChange(event.target.value)} aria-invalid={Boolean(error)} {...props} />{error ? <FieldError message={error} /> : null}</label>;
}

function FieldError({ message }: Readonly<{ message: string }>) {
  return <span className="mt-1 block text-xs font-normal text-red-700" role="alert">{message}</span>;
}

function validate(values: FormValues) {
  const errors: Record<string, string> = {};
  if (!values.title.trim()) errors.title = "Title is required.";
  else if (values.title.trim().length > 120) errors.title = "Title must be 120 characters or fewer.";
  if (!values.category.trim()) errors.category = "Category is required.";
  if (!values.description.trim()) errors.description = "Description is required.";
  else if (values.description.trim().length > 2000) errors.description = "Description must be 2,000 characters or fewer.";
  const price = Number(values.price);
  if (!values.price || !Number.isFinite(price) || price <= 0) errors.price = "Enter a price greater than zero.";
  const stock = Number(values.stock);
  if (!/^\d+$/.test(values.stock) || !Number.isInteger(stock) || stock < 0) errors.stock = "Stock must be a non-negative whole number.";
  if (values.thumbnail && !/^https?:\/\//i.test(values.thumbnail)) errors.thumbnail = "Enter a valid image URL.";
  return errors;
}
