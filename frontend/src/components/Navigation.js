function Navigation({ currentPage, onNavigate }) {
  return (
    <nav className="navbar">
      {/* Logo */}
      <div
        className="logo"
        onClick={() => onNavigate("home")}
        style={{ cursor: "pointer" }}
      >
        <img
          src="https://i.postimg.cc/nLh2w8mP/transbashologo.png"
          alt="Basho Logo"
        />
      </div>

      {/* Navigation Links */}
      <div className="nav-links">
        <span
          className={currentPage === "products" ? "active" : ""}
          onClick={() => onNavigate("products")}
        >
          Collections
        </span>

        <span
          className={currentPage === "workshops" ? "active" : ""}
          onClick={() => onNavigate("workshops")}
        >
          Workshops
        </span>

        <span
          className={currentPage === "studio" ? "active" : ""}
          onClick={() => onNavigate("studio")}
        >
          Studio
        </span>

        <span
          className={currentPage === "corporate" ? "active" : ""}
          onClick={() => onNavigate("corporate")}
        >
          Corporate
        </span>

        <span
          className={currentPage === "media" ? "active" : ""}
          onClick={() => onNavigate("media")}
        >
          Media
        </span>
      </div>
    </nav>
  );
}

export default Navigation;
