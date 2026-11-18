import { Link } from "react-router-dom";
import { Heart } from "lucide-react";
import { useShop } from "../context/ShopContext";
import ProductCard from "../components/ProductCard";

function Wishlist() {
  const { wishlist } = useShop();

  return (
    <div className="container">
      <div className="catalog-header">
        <div>
          <h1>Wishlist Saya</h1>
          <p>
            {wishlist.length > 0
              ? `Anda memiliki ${wishlist.length} produk tersimpan`
              : "Belum ada produk favorit yang disimpan"}
          </p>
        </div>
      </div>

      {wishlist.length === 0 ? (
        <div className="state-box">
          <Heart size={40} color="#94a3b8" />
          <p>Klik ikon hati pada kartu produk untuk menyimpannya di sini.</p>
          <Link to="/" className="primary-btn" style={{ textDecoration: "none" }}>
            Jelajahi Produk
          </Link>
        </div>
      ) : (
        <div className="product-grid">
          {wishlist.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}

export default Wishlist;