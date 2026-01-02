import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import "./App.css";

import Home from "./components/Home";
import Products from "./components/Products";
import Navigation from "./components/Navigation";
import Footer from "./components/Footer";
import Workshops from "./components/Workshops";
import Studio from "./components/Studio";
import Corporate from "./components/Corporate";
import Media from "./components/Media";
import Cart from "./components/Cart";
import Checkout from "./components/Checkout";
import { CartProvider } from "./context/CartContext";

// Component to scroll to top on route change
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [pathname]);

  return null;
}

function App() {
  return (
    <Router>
      <CartProvider>
        <div className="App">
          <ScrollToTop />
          <Navigation />

          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<Products />} />
            <Route path="/workshops" element={<Workshops />} />
            <Route path="/studio" element={<Studio />} />
            <Route path="/corporate" element={<Corporate />} />
            <Route path="/media" element={<Media />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
          </Routes>

          <Footer />
        </div>
      </CartProvider>
    </Router>
  );
}

export default App;
