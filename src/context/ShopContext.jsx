import { createContext, useContext, useState, useEffect } from "react";
import {
  addItemToCart,
  updateItemQuantity,
  removeItemFromCart,
  calculateCartSummary,
} from "../utils/cartHelpers";

const ShopContext = createContext();

export function ShopProvider({ children }) {
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem("talenavi_cart");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [wishlist, setWishlist] = useState(() => {
    try {
      const saved = localStorage.getItem("talenavi_wishlist");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem("talenavi_user");
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("talenavi_theme") || "light";
  });

  useEffect(() => {
    localStorage.setItem("talenavi_cart", JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem("talenavi_wishlist", JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    if (user) {
      localStorage.setItem("talenavi_user", JSON.stringify(user));
    } else {
      localStorage.removeItem("talenavi_user");
    }
  }, [user]);

  useEffect(() => {
    localStorage.setItem("talenavi_theme", theme);
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  const login = (userData) => {
    setUser(userData);
  };

  const logout = () => {
    setUser(null);
  };

  const addToCart = (product, quantity = 1) => {
    setCart((prev) => addItemToCart(prev, product, quantity));
  };

  const updateCartQuantity = (productId, newQuantity) => {
    setCart((prev) => updateItemQuantity(prev, productId, newQuantity));
  };

  const removeFromCart = (productId) => {
    setCart((prev) => removeItemFromCart(prev, productId));
  };

  const clearCart = () => setCart([]);

  const toggleWishlist = (product) => {
    setWishlist((prev) => {
      const exists = prev.some((item) => item.id === product.id);
      if (exists) {
        return prev.filter((item) => item.id !== product.id);
      }
      return [...prev, product];
    });
  };

  const isInWishlist = (productId) => {
    return wishlist.some((item) => item.id === productId);
  };

  const { cartCount, cartSubtotal } = calculateCartSummary(cart);

  return (
    <ShopContext.Provider
      value={{
        cart,
        wishlist,
        user,
        theme,
        toggleTheme,
        login,
        logout,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
        toggleWishlist,
        isInWishlist,
        cartCount,
        cartSubtotal,
      }}
    >
      {children}
    </ShopContext.Provider>
  );
}

export function useShop() {
  return useContext(ShopContext);
}