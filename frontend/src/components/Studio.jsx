import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Studio.css';

const API_BASE_URL = '/api';

function Studio() {
  const [exhibitions, setExhibitions] = useState([]);
  const [pastPopups, setPastPopups] = useState([]);
  const [galleryImages, setGalleryImages] = useState([]);
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [lightboxImage, setLightboxImage] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [exhibitionsRes, popupsRes, galleryRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/studio/exhibitions/`),
          axios.get(`${API_BASE_URL}/studio/past-popups/`),
          axios.get(`${API_BASE_URL}/studio/gallery/`)
        ]);

        setExhibitions(exhibitionsRes.data.results || exhibitionsRes.data);
        setPastPopups(popupsRes.data.results || popupsRes.data);
        setGalleryImages(galleryRes.data.results || galleryRes.data);
      } catch (error) {
        console.error('Error fetching studio data:', error);
      }
    };

    fetchData();
  }, []);

  const handlePrevExhibition = () => {
    setCarouselIndex(prev =>
      prev === 0 ? Math.max(0, exhibitions.length - 1) : prev - 1
    );
  };

  const handleNextExhibition = () => {
    setCarouselIndex(prev =>
      prev === exhibitions.length - 1 ? 0 : prev + 1
    );
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getCardPosition = (index) => {
    if (index === carouselIndex) return 'center';
    if (index === carouselIndex - 1 || (carouselIndex === 0 && index === exhibitions.length - 1)) return 'side left';
    if (index === carouselIndex + 1 || (carouselIndex === exhibitions.length - 1 && index === 0)) return 'side right';
    return 'hidden';
  };

  return (
    <div className="studio-page">
      {/* ================= HERO SECTION ================= */}
      <section
        className="studio-hero"
        style={{ backgroundImage: "url('/static/images/gallery/studiobg.jpg')" }}
      >
        <div className="studio-hero-content">
          <h1>THE STUDIO</h1>
          <p>
            A quiet space for slow craft and shared making. Here, clay takes form through
            patience and intention — each piece shaped by hand, guided by tradition,
            and imbued with the spirit of mindful creation.
          </p>
        </div>
      </section>

      {/* ================= LOCATION SECTION ================= */}
      <section className="studio-location">
        <div className="studio-location-container">
          <div className="studio-map-wrapper">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3720.3714!2d72.8347!3d21.1702!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjHCsDEwJzEyLjciTiA3MsKwNTAnMDQuOSJF!5e0!3m2!1sen!2sin!4v1234567890"
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Basho Studio Location"
            />
          </div>
          <div className="studio-address">
            <h2>Visit Us</h2>
            <div className="studio-address-text">
              <span>Silent Zone, Opp. Airport</span>
              <span>R.S. No. 811 Paikee, Plot No. 311</span>
              <span>Surat–Dumas Road</span>
              <span>Surat, Gujarat</span>
            </div>
          </div>
        </div>
      </section>

      {/* ================= VISIT & COLLECTION ================= */}
      <section className="studio-info-section">
        <div className="studio-info-container">
          <h2>Visit & Collection</h2>
          <ul className="studio-info-list">
            <li>Studio visits are by prior appointment only</li>
            <li>Collections can be viewed and purchased directly from the studio</li>
            <li>Custom orders may be discussed during visits</li>
            <li>Studio pickups are available for confirmed orders</li>
            <li>Visitors are encouraged to take their time and engage with the process</li>
          </ul>
        </div>
      </section>

      {/* ================= STUDIO POLICIES ================= */}
      <section className="studio-info-section alt-bg">
        <div className="studio-info-container">
          <h2>Studio Policies</h2>
          <ul className="studio-info-list">
            <li>Visits and workshops require prior confirmation</li>
            <li>Clay pieces are handcrafted; natural variations are part of the process</li>
            <li>No refunds on custom-made orders once production begins</li>
            <li>Handle pieces with care during studio visits</li>
            <li>Photography is allowed unless otherwise specified</li>
          </ul>
        </div>
      </section>

      {/* ================= UPCOMING EXHIBITIONS ================= */}
      <section className="studio-exhibitions">
        <h2>Upcoming Pop-ups & Exhibitions</h2>

        {exhibitions.length > 0 ? (
          <>
            <div className="carousel-container">
              <div className="carousel-track">
                {exhibitions.map((exhibition, index) => {
                  const position = getCardPosition(index);
                  if (position === 'hidden') return null;

                  return (
                    <div
                      key={exhibition.id}
                      className={`carousel-card ${position}`}
                    >
                      {exhibition.image_url && (
                        <img
                          src={exhibition.image_url}
                          alt={exhibition.title}
                          className="carousel-card-image"
                        />
                      )}
                      <div className="carousel-card-content">
                        <h3>{exhibition.title}</h3>
                        <div className="location">{exhibition.location}</div>
                        <div className="dates">
                          {formatDate(exhibition.start_date)} — {formatDate(exhibition.end_date)}
                        </div>
                        <p>{exhibition.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {exhibitions.length > 1 && (
              <div className="carousel-nav">
                <button
                  className="carousel-btn"
                  onClick={handlePrevExhibition}
                  aria-label="Previous exhibition"
                >
                  ←
                </button>
                <button
                  className="carousel-btn"
                  onClick={handleNextExhibition}
                  aria-label="Next exhibition"
                >
                  →
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="carousel-placeholder">
            <p>No upcoming exhibitions at the moment. Check back soon for new events.</p>
          </div>
        )}
      </section>

      {/* ================= PAST POP-UPS ================= */}
      {pastPopups.length > 0 && (
        <section className="studio-past-popups">
          <h2>Past Pop-up Showcases</h2>
          <div className="past-popups-grid">
            {pastPopups.map(popup => (
              <div key={popup.id} className="popup-card">
                {popup.image_url ? (
                  <img src={popup.image_url} alt={popup.event_name} />
                ) : (
                  <div style={{
                    width: '100%',
                    height: '100%',
                    background: 'var(--studio-secondary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <span style={{ color: 'var(--studio-primary)' }}>
                      {popup.event_name}
                    </span>
                  </div>
                )}
                <div className="popup-card-overlay">
                  <h4>{popup.event_name}</h4>
                  <span>{popup.city}, {popup.year}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ================= EVENT GALLERY ================= */}
      {galleryImages.length > 0 && (
        <section className="studio-gallery">
          <h2>Event Gallery</h2>
          <div className="gallery-masonry">
            {galleryImages.map(image => (
              <div
                key={image.id}
                className="gallery-item"
                onClick={() => setLightboxImage(image.image_url)}
              >
                <img
                  src={image.image_url}
                  alt={image.alt_text || 'Gallery image'}
                />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ================= LIGHTBOX ================= */}
      <div
        className={`lightbox-overlay ${lightboxImage ? 'active' : ''}`}
        onClick={() => setLightboxImage(null)}
      >
        <button
          className="lightbox-close"
          onClick={() => setLightboxImage(null)}
          aria-label="Close lightbox"
        >
          ×
        </button>
        {lightboxImage && (
          <div className="lightbox-content" onClick={e => e.stopPropagation()}>
            <img src={lightboxImage} alt="Gallery enlarged" />
          </div>
        )}
      </div>
    </div>
  );
}

export default Studio;
