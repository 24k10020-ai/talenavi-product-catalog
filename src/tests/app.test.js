import { describe, it, expect, vi, beforeEach } from "vitest";
import { productService } from "../services/productService";
import {
  addItemToCart,
  updateItemQuantity,
  removeItemFromCart,
  calculateCartSummary,
} from "../utils/cartHelpers";

describe("productService API Logic", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("memanggil endpoint produk dengan pagination, sorting, dan AbortSignal", async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ products: [{ id: 1, title: "Phone" }], total: 1 }),
    });
    global.fetch = mockFetch;

    const controller = new AbortController();
    const result = await productService.getProducts({
      limit: 12,
      skip: 12,
      sortBy: "price",
      order: "asc",
      signal: controller.signal,
    });

    expect(mockFetch).toHaveBeenCalledWith(
      "https://dummyjson.com/products?limit=12&skip=12&sortBy=price&order=asc",
      { signal: controller.signal }
    );
    expect(result.products).toHaveLength(1);
  });

  it("memanggil endpoint pencarian ketika parameter search diisi", async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ products: [], total: 0 }),
    });
    global.fetch = mockFetch;

    await productService.getProducts({ search: "laptop", limit: 12, skip: 0 });

    expect(mockFetch).toHaveBeenCalledWith(
      "https://dummyjson.com/products/search?q=laptop&limit=12&skip=0",
      { signal: undefined }
    );
  });

  it("melempar error saat response API gagal", async () => {
    global.fetch = vi.fn().mockResolvedValue({ ok: false });

    await expect(productService.getProducts()).rejects.toThrow(
      "Gagal mengambil data produk."
    );
  });
});

describe("Cart & Stock Validation Logic", () => {
  const sampleProduct = { id: 10, title: "Watch", price: 50, stock: 3 };

  it("menambahkan produk ke keranjang dan membatasi qty sesuai stok API", () => {
    let cart = addItemToCart([], sampleProduct, 2);
    expect(cart[0].quantity).toBe(2);

    // Tambah 5 lagi, harus tertahan di batas stok maksimal (3)
    cart = addItemToCart(cart, sampleProduct, 5);
    expect(cart[0].quantity).toBe(3);
  });

  it("memperbarui kuantitas tanpa melebihi stok dan menghapus item jika qty <= 0", () => {
    let cart = addItemToCart([], sampleProduct, 1);

    cart = updateItemQuantity(cart, 10, 10);
    expect(cart[0].quantity).toBe(3);

    cart = updateItemQuantity(cart, 10, 0);
    expect(cart).toHaveLength(0);
  });

  it("menghitung total item dan subtotal harga keranjang dengan akurat", () => {
    let cart = addItemToCart([], { id: 1, price: 25, stock: 5 }, 2);
    cart = addItemToCart(cart, { id: 2, price: 40, stock: 5 }, 1);
    cart = removeItemFromCart(cart, 999);

    const summary = calculateCartSummary(cart);
    expect(summary.cartCount).toBe(3);
    expect(summary.cartSubtotal).toBe(90);
  });
});