import { Link, useLocation, useNavigate } from "react-router-dom";
import { ShoppingCart, User, LogOut, Menu, X } from "lucide-react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../contexts/AuthContext";
import { useState } from "react";

function Navigation() {
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname;
  const { getCartCount } = useCart();
  const { currentUser, logout } = useAuth();
  const cartCount = getCartCount();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
      setMobileMenuOpen(false);
    } catch (error) {
      console.error('Failed to log out:', error);
    }
  };

  const handleNavClick = () => {
    setMobileMenuOpen(false);
  };

  return (
    <nav className="navbar">
      {/* Logo */}
      <Link to="/" className="logo" style={{ cursor: "pointer", textDecoration: "none" }} onClick={handleNavClick}>
        <img
          src="https://i.postimg.cc/nLh2w8mP/transbashologo.png"
          alt="Basho Logo"
        />
      </Link>

      {/* Mobile Menu Toggle */}
      <button 
        className="mobile-menu-toggle" 
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        aria-label="Toggle menu"
      >
        {mobileMenuOpen ? <X size={28} color="#652810" /> : <Menu size={28} color="#652810" />}
      </button>

      {/* Navigation Links */}
      <div className={`nav-links ${mobileMenuOpen ? 'mobile-open' : ''}`}>
        <Link
          to="/products"
          className={currentPath === "/products" ? "active" : ""}
          onClick={handleNavClick}
        >
          Collections
        </Link>

        <Link
          to="/workshops"
          className={currentPath === "/workshops" ? "active" : ""}
          onClick={handleNavClick}
        >
          Workshops
        </Link>

        <Link
          to="/studio"
          className={currentPath === "/studio" ? "active" : ""}
          onClick={handleNavClick}
        >
          Studio
        </Link>

        <Link
          to="/corporate"
          className={currentPath === "/corporate" ? "active" : ""}
          onClick={handleNavClick}
        >
          Corporate
        </Link>

        <Link
          to="/media"
          className={currentPath === "/media" ? "active" : ""}
          onClick={handleNavClick}
        >
          Media
        </Link>

        <Link
          to="/cart"
          className={`cart-icon ${currentPath === "/cart" ? "active" : ""}`}
          style={{ position: "relative" }}
          onClick={handleNavClick}
        >
          <ShoppingCart size={24} color="#652810" strokeWidth={2} />
          {cartCount > 0 && (
            <span className="cart-badge">{cartCount}</span>
          )}
        </Link>

        {currentUser ? (
          <div className="user-menu">
            <div className="user-avatar" title={currentUser.displayName || currentUser.email}>
              {(currentUser.displayName || currentUser.email || 'U').charAt(0).toUpperCase()}
            </div>
            <button onClick={handleLogout} className="logout-btn" title="Logout">
              <LogOut size={20} color="#652810" strokeWidth={2} />
            </button>
          </div>
        ) : (
          <Link
            to="/login"
            className={`login-link ${currentPath === "/login" ? "active" : ""}`}
            onClick={handleNavClick}
          >
            <User size={24} color="#652810" strokeWidth={2} />
          </Link>
        )}
      </div>
    </nav>
  );
}

export default Navigation;
