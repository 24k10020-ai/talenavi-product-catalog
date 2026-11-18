import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { ShoppingCart, Heart, Store, Menu, X } from "lucide-react";
import { useShop } from "../context/ShopContext";

function Navbar() {
  const { cartCount, wishlist } = useShop();
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand" onClick={closeMenu}>
          <Store size={25} />
          <span>TALENAVI STORE</span>
        </Link>

        <button
          type="button"
          className="navbar-toggle"
          onClick={() => setMenuOpen((prev) => !prev)}
          aria-label={menuOpen ? "Tutup menu navigasi" : "Buka menu navigasi"}
          aria-expanded={menuOpen}
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        <div className={`navbar-menu ${menuOpen ? "open" : ""}`}>
          <NavLink to="/" end onClick={closeMenu}>
            Products
          </NavLink>

          <NavLink to="/wishlist" onClick={closeMenu}>
            <Heart size={18} />
            Wishlist ({wishlist.length})
          </NavLink>

          <NavLink to="/cart" onClick={closeMenu}>
            <ShoppingCart size={18} />
            Cart ({cartCount})
          </NavLink>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;