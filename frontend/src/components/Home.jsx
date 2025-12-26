import { useEffect, useRef } from "react";
import "./Home.css";

function Home({ onNavigate }) {
  const paperRef = useRef(null);

  /* Scroll effect is now handled by CSS sticky positioning */

  return (
    <div className="home">

      {/* HERO SECTION */}
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

      {/* PAPER LAYER */}
      <section
        ref={paperRef}
        className="basho-paper"
        style={{
          backgroundImage: "url(/static/images/gallery/whatisbasho.jpg)",
        }}
      >
        <div className="basho-paper-content">
          <h2>WHAT IS BASHO</h2>
          <p>
            Basho is a Japanese word meaning “place.” It also carries the
            legacy of a poet who found depth in simplicity and meaning in
            fleeting moments. That idea lives on here, where clay is shaped
            slowly, guided by touch, patience, and intention. Every piece
            reflects a moment in time, embracing subtle imperfections and
            quiet rhythm, inviting a deeper connection between the maker,
            the object, and the space it belongs to.
          </p>
        </div>
      </section>

      {/* JAPANESE INSPIRATION SECTION */}
      <section className="japanese-inspiration">
        <div className="container">
          <h2>Inspiration from Japanese Culture</h2>
          <p>
            Rooted in the philosophy of Wabi-sabi, we embrace the beauty of imperfection.
            Like the cherry blossoms that bloom fleetingly, our creations remind us to cherish
            the present moment and find harmony in nature's simple forms.
          </p>
        </div>
      </section>

    </div>
  );
}

export default Home;
