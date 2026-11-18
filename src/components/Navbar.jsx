import { Link, NavLink } from "react-router-dom";
import { ShoppingCart, Heart, Store } from "lucide-react";
import { useShop } from "../context/ShopContext";

function Navbar() {
  const { cartCount, wishlist } = useShop();

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          <Store size={25} />
          <span>TALENAVI STORE</span>
        </Link>

        <div className="navbar-menu">
          <NavLink to="/" end>
            Products
          </NavLink>

          <NavLink to="/wishlist">
            <Heart size={18} />
            Wishlist ({wishlist.length})
          </NavLink>

          <NavLink to="/cart">
            <ShoppingCart size={18} />
            Cart ({cartCount})
          </NavLink>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;