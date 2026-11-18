import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { productService } from "../services/productService";
import { useDebounce } from "../hooks/useDebounce";
import SearchBar from "../components/SearchBar";
import ProductCard from "../components/ProductCard";
import Pagination from "../components/Pagination";

const ITEMS_PER_PAGE = 12;

function Home() {
  const [searchParams, setSearchParams] = useSearchParams();

  // Baca filter, pencarian, sorting, dan halaman langsung dari URL Query Params
  const urlQuery = searchParams.get("q") || "";
  const selectedCategory = searchParams.get("category") || "all";
  const sortOption = searchParams.get("sort") || "";
  const currentPage = Math.max(1, Number(searchParams.get("page")) || 1);

  const [searchQuery, setSearchQuery] = useState(urlQuery);
  const debouncedSearch = useDebounce(searchQuery, 400);

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [totalProducts, setTotalProducts] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);
  const [showMobileFilter, setShowMobileFilter] = useState(false);

  // Sinkronkan input pencarian jika pengguna menekan tombol Back/Forward browser
  useEffect(() => {
    setSearchQuery(urlQuery);
  }, [urlQuery]);

  // Simpan kata kunci pencarian yang sudah di-debounce ke URL query params
  useEffect(() => {
    if (debouncedSearch === urlQuery) return;

    const nextParams = new URLSearchParams(searchParams);
    if (debouncedSearch.trim()) {
      nextParams.set("q", debouncedSearch.trim());
      nextParams.delete("category");
    } else {
      nextParams.delete("q");
    }
    nextParams.delete("page");
    setSearchParams(nextParams, { replace: true });
  }, [debouncedSearch, urlQuery, searchParams, setSearchParams]);

  // Ambil daftar kategori saat halaman pertama kali dibuka
  useEffect(() => {
    const controller = new AbortController();
    productService
      .getCategories({ signal: controller.signal })
      .then((data) => setCategories(data))
      .catch((err) => {
        if (err.name !== "AbortError") {
          setCategories([]);
        }
      });

    return () => controller.abort();
  }, []);

  // Ambil daftar produk dengan pembatalan request lama (AbortController)
  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError(null);

    const skip = (currentPage - 1) * ITEMS_PER_PAGE;
    const [sortBy, order] = sortOption ? sortOption.split("-") : ["", "asc"];

    productService
      .getProducts({
        limit: ITEMS_PER_PAGE,
        skip,
        search: urlQuery,
        category: selectedCategory,
        sortBy,
        order,
        signal: controller.signal,
      })
      .then((data) => {
        setProducts(data.products || []);
        setTotalProducts(data.total || 0);
        setLoading(false);
      })
      .catch((err) => {
        if (err.name === "AbortError") return;
        setError(err.message || "Terjadi kesalahan saat memuat produk.");
        setLoading(false);
      });

    return () => controller.abort();
  }, [currentPage, urlQuery, selectedCategory, sortOption, retryCount]);

  const handleSearchChange = (value) => {
    setSearchQuery(value);
  };

  const handleCategoryChange = (category) => {
    setSearchQuery("");
    const nextParams = new URLSearchParams(searchParams);
    if (category && category !== "all") {
      nextParams.set("category", category);
    } else {
      nextParams.delete("category");
    }
    nextParams.delete("q");
    nextParams.delete("page");
    setSearchParams(nextParams);
    setShowMobileFilter(false);
  };

  const handleSortChange = (e) => {
    const nextSort = e.target.value;
    const nextParams = new URLSearchParams(searchParams);
    if (nextSort) {
      nextParams.set("sort", nextSort);
    } else {
      nextParams.delete("sort");
    }
    nextParams.delete("page");
    setSearchParams(nextParams);
  };

  const handlePageChange = (page) => {
    const nextParams = new URLSearchParams(searchParams);
    if (page > 1) {
      nextParams.set("page", String(page));
    } else {
      nextParams.delete("page");
    }
    setSearchParams(nextParams);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleResetFilters = () => {
    setSearchQuery("");
    setSearchParams({});
  };

  const totalPages = Math.ceil(totalProducts / ITEMS_PER_PAGE);

  return (
    <div className="container">
      <div className="catalog-header">
        <div>
          <h1>Product Catalog</h1>
          <p>
            {loading
              ? "Memuat katalog produk..."
              : `Menampilkan ${products.length} dari ${totalProducts} produk`}
          </p>
        </div>

        <div className="catalog-controls">
          <SearchBar value={searchQuery} onChange={handleSearchChange} />

          <select
            className="sort-select"
            value={sortOption}
            onChange={handleSortChange}
            aria-label="Urutkan produk"
          >
            <option value="">Urutkan: Default</option>
            <option value="price-asc">Harga: Terendah ke Tertinggi</option>
            <option value="price-desc">Harga: Tertinggi ke Terendah</option>
            <option value="rating-desc">Rating: Tertinggi</option>
            <option value="rating-asc">Rating: Terendah</option>
          </select>

          <button
            type="button"
            className="mobile-filter-btn"
            onClick={() => setShowMobileFilter((prev) => !prev)}
          >
            {showMobileFilter ? "Tutup Kategori" : "Filter Kategori"}
          </button>
        </div>
      </div>

      <div className={`category-bar ${showMobileFilter ? "open" : ""}`}>
        <button
          type="button"
          className={`category-chip ${selectedCategory === "all" ? "active" : ""}`}
          onClick={() => handleCategoryChange("all")}
        >
          All Products
        </button>
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            className={`category-chip ${selectedCategory === cat ? "active" : ""}`}
            onClick={() => handleCategoryChange(cat)}
          >
            {cat.replace("-", " ")}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="state-box">
          <div className="spinner" />
          <p>Mengambil data produk...</p>
        </div>
      ) : error ? (
        <div className="state-box">
          <p className="error-text">{error}</p>
          <button
            type="button"
            className="primary-btn"
            onClick={() => setRetryCount((prev) => prev + 1)}
          >
            Coba Lagi
          </button>
        </div>
      ) : products.length === 0 ? (
        <div className="state-box">
          <p>Produk tidak ditemukan untuk kata kunci atau kategori tersebut.</p>
          <button
            type="button"
            className="primary-btn"
            onClick={handleResetFilters}
          >
            Reset Filter
          </button>
        </div>
      ) : (
        <>
          <div className="product-grid">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </>
      )}
    </div>
  );
}

export default Home;