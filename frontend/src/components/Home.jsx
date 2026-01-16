import { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Inspiration from "./Inspiration";
import Founder from "./Founder";
import Masonry from "./Masonry";
import StudioDuo from "./StudioDuo";
import "./Home.css";

function Home() {
  const paperRef = useRef(null);
  const navigate = useNavigate();
  const [creations, setCreations] = useState([]);

  // Fetch Creations for Masonry Gallery
  useEffect(() => {
    const fetchCreations = async () => {
      try {
        const response = await axios.get('/api/creations/');
        const formattedData = response.data.map(item => ({
          id: item.id,
          img: item.image_url,
          height: item.height || 300,
          url: item.url
        }));
        setCreations(formattedData);
      } catch (error) {
        console.error("Error loading creations:", error);
      }
    };

    fetchCreations();
  }, []);

  /* Scroll/Stacking effect is handled by CSS sticky positioning in Inspiration.css */

  return (
    <div className="home">

      {/* ================= HERO VIDEO ================= */}
      <section className="video-hero">
        <video
          className="hero-video"
          src="/static/basho-here.mp4"
          autoPlay
          muted
          loop
          playsInline
        />

        <div className="video-overlay" />

        <div className="video-content">
          <img
            src="https://i.postimg.cc/Kcfdz13G/noshivlogo.png"
            alt="Basho"
            className="hero-logo"
          />

          <p className="hero-description">
            A space for handcrafted products, workshops, and community-driven
            creation.
          </p>

          <div className="home-actions">
            <button onClick={() => navigate("/products")}>
              Explore Products
            </button>
            <button onClick={() => navigate("/workshops")}>
              View Workshops
            </button>
          </div>
        </div>
      </section>

      {/* ================= CREATIONS MASONRY GALLERY ================= */}
      {creations.length > 0 && (
        <section className="creations-section">
          <div className="creations-header">
            <h2>Our Creations</h2>
          </div>
          <div className="creations-container">
            <Masonry
              items={creations}
              animateFrom="bottom"
              scaleOnHover={true}
              hoverScale={0.97}
              blurToFocus={true}
            />
          </div>
        </section>
      )}

      {/* ================= STUDIO DUO (PRODUCTS & WORKSHOPS) ================= */}
      <StudioDuo />

      {/* ================= WHAT IS BASHO ================= */}
      <section
        ref={paperRef}
        className="whatisbasho-section"
        style={{
          backgroundImage: "url(/static/images/gallery/whatisbasho.jpg)",
        }}
      >
        <div className="whatisbasho-inner">
          <div className="whatisbasho-text">
            <h2>WHAT IS BASHO</h2>
            <p>
              Basho is a Japanese word meaning "place." It also carries the
              legacy of a poet who found depth in simplicity and meaning in
              fleeting moments. That idea lives on here, where clay is shaped
              slowly, guided by touch, patience, and intention. Every piece
              reflects a moment in time, embracing subtle imperfections and
              quiet rhythm, inviting a deeper connection between the maker,
              the object, and the space it belongs to.
            </p>
          </div>
        </div>
      </section>

      {/* ================= INSPIRATION SECTION ================= */}
      {/* This section has the sticky stacking effect in Inspiration.css */}
      <Inspiration />

      {/* ================= FOUNDER STORY ================= */}
      <Founder />

    </div>
  );
}

export default Home;
