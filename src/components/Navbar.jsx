import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  Store,
  Heart,
  ShoppingCart,
  Sun,
  Moon,
  LogIn,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { useShop } from "../context/ShopContext";

function Navbar() {
  const { cartCount, wishlist, theme, toggleTheme, user, logout } = useShop();
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
    navigate("/");
  };

  return (
    <header className="navbar">
      <div className="container navbar-inner">
        <Link to="/" className="brand-logo" onClick={() => setMenuOpen(false)}>
          <Store size={22} />
          <span>TALENAVI STORE</span>
        </Link>

        <div className="navbar-actions">
          <button
            type="button"
            className="icon-btn"
            onClick={toggleTheme}
            aria-label={theme === "dark" ? "Aktifkan Light Mode" : "Aktifkan Dark Mode"}
            title={theme === "dark" ? "Light Mode" : "Dark Mode"}
          >
            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          <button
            type="button"
            className="hamburger-btn"
            onClick={() => setMenuOpen((prev) => !prev)}
            aria-label="Toggle Menu"
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        <nav className={`nav-links ${menuOpen ? "open" : ""}`}>
          <NavLink to="/" end onClick={() => setMenuOpen(false)}>
            Products
          </NavLink>

          <NavLink to="/wishlist" onClick={() => setMenuOpen(false)}>
            <Heart size={16} />
            <span>Wishlist ({wishlist.length})</span>
          </NavLink>

          <NavLink to="/cart" onClick={() => setMenuOpen(false)}>
            <ShoppingCart size={16} />
            <span>Cart ({cartCount})</span>
          </NavLink>

          {user ? (
            <button type="button" className="nav-auth-btn" onClick={handleLogout}>
              <LogOut size={16} />
              <span>Logout ({user.firstName || user.username})</span>
            </button>
          ) : (
            <NavLink
              to="/login"
              className="nav-login-link"
              onClick={() => setMenuOpen(false)}
            >
              <LogIn size={16} />
              <span>Login</span>
            </NavLink>
          )}
        </nav>
      </div>
    </header>
  );
}

export default Navbar;