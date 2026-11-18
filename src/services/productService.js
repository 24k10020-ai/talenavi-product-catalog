const BASE_URL = "https://dummyjson.com/products";
const AUTH_URL = "https://dummyjson.com/auth";

export const productService = {
  // Mengambil daftar produk dengan pagination, pencarian, filter kategori, sorting, dan AbortSignal
  async getProducts({
    limit = 12,
    skip = 0,
    search = "",
    category = "",
    sortBy = "",
    order = "asc",
    signal,
  } = {}) {
    let url = `${BASE_URL}?limit=${limit}&skip=${skip}`;

    if (search.trim()) {
      url = `${BASE_URL}/search?q=${encodeURIComponent(search.trim())}&limit=${limit}&skip=${skip}`;
    } else if (category && category !== "all") {
      url = `${BASE_URL}/category/${encodeURIComponent(category)}?limit=${limit}&skip=${skip}`;
    }

    if (sortBy) {
      url += `&sortBy=${encodeURIComponent(sortBy)}&order=${encodeURIComponent(order)}`;
    }

    const response = await fetch(url, { signal });
    if (!response.ok) {
      throw new Error("Gagal mengambil data produk.");
    }
    return response.json();
  },

  // Mengambil detail satu produk berdasarkan ID
  async getProductById(id, { signal } = {}) {
    const response = await fetch(`${BASE_URL}/${id}`, { signal });
    if (!response.ok) {
      throw new Error("Produk tidak ditemukan.");
    }
    return response.json();
  },

  // Mengambil seluruh daftar kategori produk
  async getCategories({ signal } = {}) {
    const response = await fetch(`${BASE_URL}/category-list`, { signal });
    if (!response.ok) {
      throw new Error("Gagal mengambil daftar kategori.");
    }
    return response.json();
  },
};

export const authService = {
  // Login pengguna menggunakan DummyJSON Auth API
  async login({ username, password }) {
    const response = await fetch(`${AUTH_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: username.trim(),
        password,
        expiresInMins: 60,
      }),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Username atau password salah.");
    }
    return data;
  },
};