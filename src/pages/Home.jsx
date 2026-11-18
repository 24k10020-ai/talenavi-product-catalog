import { useState, useEffect } from "react";
import { productService } from "../services/productService";
import { useDebounce } from "../hooks/useDebounce";
import SearchBar from "../components/SearchBar";
import ProductCard from "../components/ProductCard";
import Pagination from "../components/Pagination";

const ITEMS_PER_PAGE = 12;

function Home() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState("");
  const debouncedSearch = useDebounce(searchQuery, 400);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);
  const [showMobileFilter, setShowMobileFilter] = useState(false);

  // Ambil daftar kategori saat halaman pertama kali dibuka
  useEffect(() => {
    let isMounted = true;
    productService
      .getCategories()
      .then((data) => {
        if (isMounted) setCategories(data);
      })
      .catch(() => {
        // Biarkan daftar kategori kosong jika gagal memuat
      });
    return () => {
      isMounted = false;
    };
  }, []);

  // Ambil daftar produk setiap kali halaman, pencarian, kategori, sorting, atau retry berubah
  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError(null);

    const skip = (currentPage - 1) * ITEMS_PER_PAGE;
    const [sortBy, order] = sortOption ? sortOption.split("-") : ["", "asc"];

    productService
      .getProducts({
        limit: ITEMS_PER_PAGE,
        skip,
        search: debouncedSearch,
        category: selectedCategory,
        sortBy,
        order,
      })
      .then((data) => {
        if (!isMounted) return;
        setProducts(data.products || []);
        setTotalProducts(data.total || 0);
      })
      .catch((err) => {
        if (!isMounted) return;
        setError(err.message || "Terjadi kesalahan saat memuat produk.");
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [currentPage, debouncedSearch, selectedCategory, sortOption, retryCount]);

  const handleSearchChange = (value) => {
    setSearchQuery(value);
    if (value.trim() && selectedCategory !== "all") {
      setSelectedCategory("all");
    }
    setCurrentPage(1);
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    if (searchQuery) {
      setSearchQuery("");
    }
    setCurrentPage(1);
    setShowMobileFilter(false);
  };

  const handleSortChange = (e) => {
    setSortOption(e.target.value);
    setCurrentPage(1);
  };

  const handleResetFilters = () => {
    setSearchQuery("");
    setSelectedCategory("all");
    setSortOption("");
    setCurrentPage(1);
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

      {/* Filter Kategori */}
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

      {/* Konten Utama */}
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
            onPageChange={setCurrentPage}
          />
        </>
      )}
    </div>
  );
}

export default Home;