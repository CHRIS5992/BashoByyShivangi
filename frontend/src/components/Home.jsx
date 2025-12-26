import { useEffect, useRef } from "react";
import Inspiration from "./Inspiration";
import Founder from "./Founder";
import "./Home.css";

function Home({ onNavigate }) {
  const paperRef = useRef(null);

  /* Scroll effect is now handled by CSS sticky positioning */

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
            <button onClick={() => onNavigate("products")}>
              Explore Products
            </button>
            <button onClick={() => onNavigate("workshops")}>
              View Workshops
            </button>
          </div>
        </div>
      </section>

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
      <Inspiration />

      {/* ================= FOUNDER STORY ================= */}
      <Founder />

    </div>
  );
}

export default Home;
