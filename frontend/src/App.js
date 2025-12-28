import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

import Home from "./components/Home";
import Products from "./components/Products";
import Navigation from "./components/Navigation";
import Footer from "./components/Footer";
import Workshops from "./components/Workshops";
import Studio from "./components/Studio";
import Corporate from "./components/Corporate";
import Media from "./components/Media";

const API_BASE_URL = "/api";

function App() {
  const [currentPage, setCurrentPage] = useState("home");

  const handleNavigate = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="App">
      <Navigation currentPage={currentPage} onNavigate={handleNavigate} />

      {currentPage === "home" && <Home onNavigate={handleNavigate} />}

      {currentPage === "products" && <Products />}

      {currentPage === "workshops" && <Workshops />}
      {currentPage === "studio" && <Studio />}
      {currentPage === "corporate" && <Corporate />}
      {currentPage === "media" && <Media />}

      <Footer />
    </div>
  );
}

export default App;
