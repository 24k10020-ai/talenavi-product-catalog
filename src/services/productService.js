const BASE_URL = "https://dummyjson.com/products";

export const productService = {
  // Mengambil daftar produk dengan pagination, pencarian, filter kategori, dan sorting
  async getProducts({
    limit = 12,
    skip = 0,
    search = "",
    category = "",
    sortBy = "",
    order = "asc",
  } = {}) {
    let url = `${BASE_URL}?limit=${limit}&skip=${skip}`;

    if (search.trim()) {
      url = `${BASE_URL}/search?q=${encodeURIComponent(search.trim())}&limit=${limit}&skip=${skip}`;
    } else if (category && category !== "all") {
      url = `${BASE_URL}/category/${encodeURIComponent(category)}?limit=${limit}&skip=${skip}`;
    }

    // Tambahkan parameter sorting jika pengguna memilih urutkan berdasarkan harga atau rating
    if (sortBy) {
      url += `&sortBy=${encodeURIComponent(sortBy)}&order=${encodeURIComponent(order)}`;
    }

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Gagal mengambil data produk.");
    }
    return response.json();
  },

  // Mengambil detail satu produk berdasarkan ID (termasuk galeri gambar, stok, dan reviews)
  async getProductById(id) {
    const response = await fetch(`${BASE_URL}/${id}`);
    if (!response.ok) {
      throw new Error("Produk tidak ditemukan.");
    }
    return response.json();
  },

  // Mengambil seluruh daftar kategori produk
  async getCategories() {
    const response = await fetch(`${BASE_URL}/category-list`);
    if (!response.ok) {
      throw new Error("Gagal mengambil daftar kategori.");
    }
    return response.json();
  },
};