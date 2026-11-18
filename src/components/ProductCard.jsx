import { useState } from "react";
import { Link } from "react-router-dom";
import { Heart, ShoppingCart, Star, Check } from "lucide-react";
import { useShop } from "../context/ShopContext";

function ProductCard({ product }) {
  const { addToCart, toggleWishlist, isInWishlist } = useShop();
  const [added, setAdded] = useState(false);

  const wishlisted = isInWishlist(product.id);

  const handleAddToCart = () => {
    addToCart(product, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 1000);
  };

  return (
    <div className="product-card">
      <div className="product-image-wrapper">
        <Link to={`/products/${product.id}`}>
          <img
            src={product.thumbnail}
            alt={product.title}
            loading="lazy"
            className="product-image"
          />
        </Link>
        <button
          type="button"
          className={`wishlist-btn ${wishlisted ? "active" : ""}`}
          onClick={() => toggleWishlist(product)}
          aria-label="Simpan ke Wishlist"
        >
          <Heart size={18} fill={wishlisted ? "#ef4444" : "none"} />
        </button>
      </div>

      <div className="product-info">
        <span className="product-category">
          {product.category.replace("-", " ")}
        </span>

        <Link to={`/products/${product.id}`} className="product-title">
          {product.title}
        </Link>

        <div className="product-rating">
          <Star size={15} fill="#f59e0b" color="#f59e0b" />
          <span>{product.rating?.toFixed(1)}</span>
        </div>

        <div className="product-footer">
          <span className="product-price">${product.price.toFixed(2)}</span>

          <button
            type="button"
            className={`add-cart-btn ${added ? "added" : ""}`}
            onClick={handleAddToCart}
          >
            {added ? (
              <>
                <Check size={16} />
                Added
              </>
            ) : (
              <>
                <ShoppingCart size={16} />
                Add to Cart
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;