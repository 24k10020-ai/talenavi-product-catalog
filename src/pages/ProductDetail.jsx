import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  ShoppingCart,
  Heart,
  Star,
  Minus,
  Plus,
  Check,
} from "lucide-react";
import { productService } from "../services/productService";
import { useShop } from "../context/ShopContext";

function ProductDetail() {
  const { id } = useParams();
  const { addToCart, toggleWishlist, isInWishlist } = useShop();

  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError(null);
    setQuantity(1);

    productService
      .getProductById(id)
      .then((data) => {
        if (!isMounted) return;
        setProduct(data);
        setSelectedImage(data.images?.[0] || data.thumbnail);
      })
      .catch((err) => {
        if (!isMounted) return;
        setError(err.message || "Gagal memuat detail produk.");
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [id]);

  if (loading) {
    return (
      <div className="container">
        <div className="state-box">
          <div className="spinner" />
          <p>Memuat detail produk...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container">
        <div className="state-box">
          <p className="error-text">{error || "Produk tidak ditemukan."}</p>
          <Link to="/" className="primary-btn" style={{ textDecoration: "none" }}>
            Kembali ke Katalog
          </Link>
        </div>
      </div>
    );
  }

  const wishlisted = isInWishlist(product.id);

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 1200);
  };

  return (
    <div className="container">
      <Link to="/" className="back-link">
        <ArrowLeft size={16} />
        Kembali ke Katalog
      </Link>

      <div className="product-detail-card">
        {/* Galeri Gambar */}
        <div className="detail-gallery">
          <div className="detail-main-image">
            <img src={selectedImage} alt={product.title} />
          </div>

          {product.images && product.images.length > 1 && (
            <div className="detail-thumbnails">
              {product.images.map((img, index) => (
                <button
                  key={index}
                  type="button"
                  className={`thumb-btn ${selectedImage === img ? "active" : ""}`}
                  onClick={() => setSelectedImage(img)}
                >
                  <img src={img} alt={`${product.title} ${index + 1}`} />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Informasi Produk */}
        <div className="detail-info">
          <div className="detail-meta">
            <span className="product-category">
              {product.category.replace("-", " ")}
            </span>
            {product.brand && (
              <span className="detail-brand">• {product.brand}</span>
            )}
          </div>

          <h1 className="detail-title">{product.title}</h1>

          <div className="detail-rating-row">
            <div className="product-rating" style={{ marginBottom: 0 }}>
              <Star size={17} fill="#f59e0b" color="#f59e0b" />
              <span>{product.rating?.toFixed(1)}</span>
            </div>
            <span className="stock-badge">
              {product.stock > 0 ? `Stok: ${product.stock}` : "Stok Habis"}
            </span>
          </div>

          <div className="detail-price-box">
            <span className="detail-price">${product.price.toFixed(2)}</span>
            {product.discountPercentage > 0 && (
              <span className="discount-badge">
                -{Math.round(product.discountPercentage)}%
              </span>
            )}
          </div>

          <p className="detail-description">{product.description}</p>

          <div className="detail-controls">
            <div className="qty-control">
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                aria-label="Kurangi jumlah"
              >
                <Minus size={16} />
              </button>
              <span>{quantity}</span>
              <button
                type="button"
                onClick={() =>
                  setQuantity((q) => Math.min(product.stock || 99, q + 1))
                }
                aria-label="Tambah jumlah"
              >
                <Plus size={16} />
              </button>
            </div>

            <button
              type="button"
              className={`primary-btn detail-cart-btn ${added ? "added" : ""}`}
              onClick={handleAddToCart}
              disabled={product.stock === 0}
            >
              {added ? (
                <>
                  <Check size={18} />
                  Added to Cart
                </>
              ) : (
                <>
                  <ShoppingCart size={18} />
                  Add to Cart
                </>
              )}
            </button>

            <button
              type="button"
              className={`detail-wish-btn ${wishlisted ? "active" : ""}`}
              onClick={() => toggleWishlist(product)}
              aria-label="Wishlist"
            >
              <Heart size={20} fill={wishlisted ? "#ef4444" : "none"} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;