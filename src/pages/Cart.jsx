import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ShoppingBag,
  Trash2,
  Minus,
  Plus,
  CheckCircle,
} from "lucide-react";
import { useShop } from "../context/ShopContext";

function Cart() {
  const {
    cart,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    cartCount,
    cartSubtotal,
  } = useShop();
  const [checkedOut, setCheckedOut] = useState(false);

  const handleCheckout = () => {
    clearCart();
    setCheckedOut(true);
  };

  if (checkedOut) {
    return (
      <div className="container">
        <div className="state-box">
          <CheckCircle size={48} color="#16a34a" />
          <h2>Pesanan Berhasil Diproses!</h2>
          <p>Terima kasih telah berbelanja di TALENAVI STORE.</p>
          <Link to="/" className="primary-btn" style={{ textDecoration: "none" }}>
            Lanjut Belanja
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="catalog-header">
        <div>
          <h1>Keranjang Belanja</h1>
          <p>
            {cartCount > 0
              ? `Total ${cartCount} item di keranjang Anda`
              : "Keranjang belanja Anda masih kosong"}
          </p>
        </div>

        {cart.length > 0 && (
          <button type="button" className="clear-cart-btn" onClick={clearCart}>
            Kosongkan Keranjang
          </button>
        )}
      </div>

      {cart.length === 0 ? (
        <div className="state-box">
          <ShoppingBag size={40} color="#94a3b8" />
          <p>Belum ada produk di dalam keranjang belanja Anda.</p>
          <Link to="/" className="primary-btn" style={{ textDecoration: "none" }}>
            Mulai Belanja
          </Link>
        </div>
      ) : (
        <div className="cart-layout">
          {/* Daftar Item */}
          <div className="cart-items">
            {cart.map((item) => (
              <div key={item.id} className="cart-item">
                <Link to={`/products/${item.id}`} className="cart-item-image">
                  <img src={item.thumbnail} alt={item.title} />
                </Link>

                <div className="cart-item-info">
                  <Link
                    to={`/products/${item.id}`}
                    className="cart-item-title"
                  >
                    {item.title}
                  </Link>
                  <span className="cart-item-unit">
                    ${item.price.toFixed(2)} / item
                  </span>

                  <div className="cart-item-actions">
                    <div className="qty-control">
                      <button
                        type="button"
                        onClick={() =>
                          updateCartQuantity(item.id, item.quantity - 1)
                        }
                        aria-label="Kurangi jumlah"
                      >
                        <Minus size={14} />
                      </button>
                      <span>{item.quantity}</span>
                      <button
                        type="button"
                        onClick={() =>
                          updateCartQuantity(item.id, item.quantity + 1)
                        }
                        aria-label="Tambah jumlah"
                      >
                        <Plus size={14} />
                      </button>
                    </div>

                    <button
                      type="button"
                      className="remove-item-btn"
                      onClick={() => removeFromCart(item.id)}
                      aria-label="Hapus item"
                    >
                      <Trash2 size={17} />
                    </button>
                  </div>
                </div>

                <div className="cart-item-total">
                  ${(item.price * item.quantity).toFixed(2)}
                </div>
              </div>
            ))}
          </div>

          {/* Ringkasan Belanja */}
          <div className="cart-summary">
            <h2>Ringkasan Pesanan</h2>

            <div className="summary-row">
              <span>Total Item</span>
              <span>{cartCount} pcs</span>
            </div>

            <div className="summary-row">
              <span>Subtotal</span>
              <span>${cartSubtotal.toFixed(2)}</span>
            </div>

            <div className="summary-row">
              <span>Ongkos Kirim</span>
              <span style={{ color: "#16a34a", fontWeight: 500 }}>Gratis</span>
            </div>

            <div className="summary-divider" />

            <div className="summary-row summary-total">
              <span>Total Bayar</span>
              <span>${cartSubtotal.toFixed(2)}</span>
            </div>

            <button
              type="button"
              className="primary-btn checkout-btn"
              onClick={handleCheckout}
            >
              Checkout Sekarang
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Cart;