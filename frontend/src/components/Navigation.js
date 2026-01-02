import { Link, useLocation } from "react-router-dom";
import { ShoppingCart } from "lucide-react";
import { useCart } from "../context/CartContext";

function Navigation() {
  const location = useLocation();
  const currentPath = location.pathname;
  const { getCartCount } = useCart();
  const cartCount = getCartCount();

  return (
    <nav className="navbar">
      {/* Logo */}
      <Link to="/" className="logo" style={{ cursor: "pointer", textDecoration: "none" }}>
        <img
          src="https://i.postimg.cc/nLh2w8mP/transbashologo.png"
          alt="Basho Logo"
        />
      </Link>

      {/* Navigation Links */}
      <div className="nav-links">
        <Link
          to="/products"
          className={currentPath === "/products" ? "active" : ""}
        >
          Collections
        </Link>

        <Link
          to="/workshops"
          className={currentPath === "/workshops" ? "active" : ""}
        >
          Workshops
        </Link>

        <Link
          to="/studio"
          className={currentPath === "/studio" ? "active" : ""}
        >
          Studio
        </Link>

        <Link
          to="/corporate"
          className={currentPath === "/corporate" ? "active" : ""}
        >
          Corporate
        </Link>

        <Link
          to="/media"
          className={currentPath === "/media" ? "active" : ""}
        >
          Media
        </Link>

        <Link
          to="/cart"
          className={`cart-icon ${currentPath === "/cart" ? "active" : ""}`}
          style={{ position: "relative" }}
        >
          <ShoppingCart size={24} color="#652810" strokeWidth={2} />
          {cartCount > 0 && (
            <span className="cart-badge">{cartCount}</span>
          )}
        </Link>
      </div>
    </nav>
  );
}

export default Navigation;
