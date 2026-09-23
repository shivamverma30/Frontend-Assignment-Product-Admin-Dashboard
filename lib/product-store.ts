import { STORAGE_KEYS } from "@/lib/constants";
import type { Product, ProductMutationInput, ProductListResponse } from "@/types/product";

type ProductOverride = Partial<Product>;

const emptySnapshot = {
  createdProducts: [] as Product[],
  overrides: {} as Record<string, ProductOverride>,
  deletedIds: [] as number[],
};

let snapshot = emptySnapshot;
let hydrated = false;

function readJson<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;

  try {
    const value = window.localStorage.getItem(key);
    return value ? (JSON.parse(value) as T) : fallback;
  } catch {
    window.localStorage.removeItem(key);
    return fallback;
  }
}

function hydrate() {
  if (hydrated || typeof window === "undefined") return;

  const createdProducts = readJson<Product[]>(STORAGE_KEYS.createdProducts, []).filter(isProduct).map(normalizeStoredProduct);
  const overrides = readJson<Record<string, ProductOverride>>(STORAGE_KEYS.productOverrides, {});
  const deletedIds = readJson<number[]>(STORAGE_KEYS.deletedProductIds, []).filter((id) => Number.isInteger(id));
  snapshot = { createdProducts, overrides: isRecord(overrides) ? overrides : {}, deletedIds };
  hydrated = true;
}

function persist() {
  if (typeof window === "undefined") return;

  window.localStorage.setItem(STORAGE_KEYS.createdProducts, JSON.stringify(snapshot.createdProducts));
  window.localStorage.setItem(STORAGE_KEYS.productOverrides, JSON.stringify(snapshot.overrides));
  window.localStorage.setItem(STORAGE_KEYS.deletedProductIds, JSON.stringify(snapshot.deletedIds));
  window.dispatchEvent(new Event(STORAGE_KEYS.productStoreEvent));
}

export function getProductStoreSnapshot() {
  hydrate();
  return snapshot;
}

export function getProductStoreServerSnapshot() {
  return emptySnapshot;
}

export function subscribeToProductStore(onChange: () => void) {
  if (typeof window === "undefined") return () => undefined;

  const handleChange = () => {
    hydrated = false;
    hydrate();
    onChange();
  };

  window.addEventListener(STORAGE_KEYS.productStoreEvent, handleChange);
  window.addEventListener("storage", handleChange);
  return () => {
    window.removeEventListener(STORAGE_KEYS.productStoreEvent, handleChange);
    window.removeEventListener("storage", handleChange);
  };
}

export function createLocalProduct(product: Product, input: ProductMutationInput) {
  hydrate();
  const localProduct: Product = {
    ...createProductDefaults(product.id, input),
    ...product,
    ...input,
    thumbnail: input.thumbnail || product.thumbnail || "",
    images: product.images?.length ? product.images : input.thumbnail ? [input.thumbnail] : [],
    reviews: product.reviews ?? [],
  };
  snapshot = { ...snapshot, createdProducts: [...snapshot.createdProducts, localProduct] };
  persist();
  return localProduct;
}

export function saveProductOverride(id: number, input: ProductMutationInput) {
  hydrate();
  snapshot = { ...snapshot, overrides: { ...snapshot.overrides, [id]: input } };
  persist();
}

export function markProductDeleted(id: number) {
  hydrate();
  if (snapshot.deletedIds.includes(id)) return;
  snapshot = { ...snapshot, deletedIds: [...snapshot.deletedIds, id] };
  persist();
}

export function getLocalProduct(id: number) {
  const current = getProductStoreSnapshot();
  if (current.deletedIds.includes(id)) return null;

  const created = current.createdProducts.find((product) => product.id === id);
  if (created) return { ...created, ...current.overrides[String(id)] };
  return null;
}

export function isProductDeleted(id: number) {
  return getProductStoreSnapshot().deletedIds.includes(id);
}

export function isLocalProduct(id: number) {
  return getProductStoreSnapshot().createdProducts.some((product) => product.id === id);
}

export function mergeProduct(product: Product) {
  const current = getProductStoreSnapshot();
  if (current.deletedIds.includes(product.id)) return null;
  return { ...product, ...current.overrides[String(product.id)] };
}

export function mergeProductList(response: ProductListResponse): ProductListResponse {
  const current = getProductStoreSnapshot();
  const remoteProducts = response.products.flatMap((product) => {
    const merged = mergeProduct(product);
    return merged ? [merged] : [];
  });
  const createdProducts = current.createdProducts.filter((product) => !current.deletedIds.includes(product.id));
  const knownIds = new Set(remoteProducts.map((product) => product.id));
  const products = [...createdProducts.filter((product) => !knownIds.has(product.id)), ...remoteProducts];

  return { ...response, products, total: response.total + createdProducts.length - (response.products.length - remoteProducts.length) };
}

function isRecord(value: unknown): value is Record<string, ProductOverride> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function isProduct(value: unknown): value is Product {
  if (!value || typeof value !== "object") return false;
  const product = value as Partial<Product>;
  return typeof product.id === "number" && typeof product.title === "string" && typeof product.category === "string";
}

function createProductDefaults(id: number, input: ProductMutationInput): Product {
  return {
    id,
    title: input.title,
    description: input.description,
    category: input.category,
    price: input.price,
    discountPercentage: 0,
    rating: 0,
    stock: input.stock,
    tags: [],
    sku: `LOCAL-${id}`,
    weight: 0,
    dimensions: { width: 0, height: 0, depth: 0 },
    warrantyInformation: "",
    shippingInformation: "",
    availabilityStatus: input.stock > 0 ? "In Stock" : "Out of Stock",
    reviews: [],
    returnPolicy: "",
    minimumOrderQuantity: 1,
    meta: { createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), barcode: "", qrCode: "" },
    images: input.thumbnail ? [input.thumbnail] : [],
    thumbnail: input.thumbnail ?? "",
  };
}

function normalizeStoredProduct(product: Product): Product {
  return {
    ...createProductDefaults(product.id, {
      title: product.title,
      description: product.description ?? "",
      category: product.category,
      price: product.price ?? 0,
      stock: product.stock ?? 0,
      thumbnail: product.thumbnail,
    }),
    ...product,
    images: product.images ?? (product.thumbnail ? [product.thumbnail] : []),
    reviews: product.reviews ?? [],
    tags: product.tags ?? [],
  };
}