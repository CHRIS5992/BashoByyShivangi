import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import './Media.css';

const API_BASE_URL = '/api';

function Media() {
  const [galleryImages, setGalleryImages] = useState([]);
  const [textTestimonials, setTextTestimonials] = useState([]);
  const [videoTestimonials, setVideoTestimonials] = useState([]);
  const [experiences, setExperiences] = useState([]);

  const [activeFilter, setActiveFilter] = useState('all');
  const [testimonialIndex, setTestimonialIndex] = useState(0);
  const [lightboxImage, setLightboxImage] = useState(null);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [videoModal, setVideoModal] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [galleryRes, textRes, videoRes, expRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/media/gallery/`),
          axios.get(`${API_BASE_URL}/media/testimonials/text/`),
          axios.get(`${API_BASE_URL}/media/testimonials/video/`),
          axios.get(`${API_BASE_URL}/media/experiences/`)
        ]);

        setGalleryImages(galleryRes.data.results || galleryRes.data);
        setTextTestimonials(textRes.data.results || textRes.data);
        setVideoTestimonials(videoRes.data.results || videoRes.data);
        setExperiences(expRes.data.results || expRes.data);
      } catch (error) {
        console.error('Error fetching media data:', error);
      }
    };

    fetchData();
  }, []);

  const filteredImages = activeFilter === 'all'
    ? galleryImages
    : galleryImages.filter(img => img.category === activeFilter);

  const openLightbox = (image, index) => {
    setLightboxImage(image);
    setLightboxIndex(index);
  };

  const navigateLightbox = useCallback((direction) => {
    const newIndex = direction === 'next'
      ? (lightboxIndex + 1) % filteredImages.length
      : (lightboxIndex - 1 + filteredImages.length) % filteredImages.length;
    setLightboxIndex(newIndex);
    setLightboxImage(filteredImages[newIndex].image_url);
  }, [lightboxIndex, filteredImages]);

  // Keyboard navigation for lightbox
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!lightboxImage) return;
      if (e.key === 'ArrowRight') navigateLightbox('next');
      if (e.key === 'ArrowLeft') navigateLightbox('prev');
      if (e.key === 'Escape') setLightboxImage(null);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxImage, navigateLightbox]);

  return (
    <div className="media-page">
      {/* ================= HERO SECTION ================= */}
      <section className="media-hero">
        <div className="media-hero-content">
          <h1>Stories & Moments</h1>
          <p>
            A collection of handcrafted work, shared experiences, and the quiet
            moments that define Basho — told through images and heartfelt words.
          </p>
        </div>
      </section>

      {/* ================= PHOTO GALLERY ================= */}
      <section className="media-gallery">
        <div className="section-header">
          <h2>Photo Gallery</h2>
        </div>

        <div className="gallery-filters">
          <button
            className={`filter-btn ${activeFilter === 'all' ? 'active' : ''}`}
            onClick={() => setActiveFilter('all')}
          >
            All
          </button>
          <button
            className={`filter-btn ${activeFilter === 'product' ? 'active' : ''}`}
            onClick={() => setActiveFilter('product')}
          >
            Products
          </button>
          <button
            className={`filter-btn ${activeFilter === 'workshop' ? 'active' : ''}`}
            onClick={() => setActiveFilter('workshop')}
          >
            Workshops
          </button>
          <button
            className={`filter-btn ${activeFilter === 'studio' ? 'active' : ''}`}
            onClick={() => setActiveFilter('studio')}
          >
            Studio & Events
          </button>
        </div>

        <div className="gallery-masonry">
          {filteredImages.map((image, index) => (
            <div
              key={image.id}
              className="gallery-item"
              onClick={() => openLightbox(image.image_url, index)}
            >
              <img src={image.image_url} alt={`Gallery ${index + 1}`} />
            </div>
          ))}
        </div>

        {filteredImages.length === 0 && (
          <p style={{ textAlign: 'center', color: '#8a6b5a', fontStyle: 'italic' }}>
            No images in this category yet.
          </p>
        )}
      </section>

      {/* ================= TEXT TESTIMONIALS ================= */}
      {textTestimonials.length > 0 && (
        <section className="media-testimonials">
          <div className="section-header light">
            <h2>What People Say</h2>
          </div>

          <div className="testimonials-carousel">
            <div className="testimonial-slide">
              <p className="testimonial-quote">
                {textTestimonials[testimonialIndex]?.quote}
              </p>
              <div className="testimonial-author">
                <strong>{textTestimonials[testimonialIndex]?.customer_name}</strong>
                {textTestimonials[testimonialIndex]?.location && (
                  <span>{textTestimonials[testimonialIndex].location}</span>
                )}
              </div>
            </div>

            {textTestimonials.length > 1 && (
              <div className="testimonial-nav">
                {textTestimonials.map((_, index) => (
                  <button
                    key={index}
                    className={`testimonial-dot ${index === testimonialIndex ? 'active' : ''}`}
                    onClick={() => setTestimonialIndex(index)}
                    aria-label={`Go to testimonial ${index + 1}`}
                  />
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* ================= VIDEO TESTIMONIALS ================= */}
      {videoTestimonials.length > 0 && (
        <section className="media-videos">
          <div className="section-header">
            <h2>Video Stories</h2>
          </div>

          <div className="videos-grid">
            {videoTestimonials.map(video => (
              <div
                key={video.id}
                className="video-card"
                onClick={() => setVideoModal(video)}
              >
                {video.thumbnail_url ? (
                  <img src={video.thumbnail_url} alt={video.customer_name} />
                ) : (
                  <div style={{ background: 'var(--media-primary)' }} />
                )}
                <div className="video-play-overlay">
                  <div className="play-icon" />
                  <div className="video-info">
                    <h4>{video.customer_name}</h4>
                    {video.location && <span>{video.location}</span>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ================= CUSTOMER EXPERIENCES ================= */}
      {experiences.length > 0 && (
        <section className="media-experiences">
          <div className="section-header light">
            <h2>Customer Experiences</h2>
          </div>

          <div className="experiences-grid">
            {experiences.map(exp => (
              <div key={exp.id} className="experience-card">
                <div className="experience-image">
                  <img src={exp.image_url} alt={exp.customer_name || 'Customer experience'} />
                </div>
                <div className="experience-text">
                  <p>"{exp.paragraph}"</p>
                  {(exp.customer_name || exp.context) && (
                    <span className="author">
                      {exp.customer_name}
                      {exp.customer_name && exp.context && ' — '}
                      {exp.context}
                    </span>
                  )}
                </div>
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

        {filteredImages.length > 1 && (
          <>
            <button
              className="lightbox-nav prev"
              onClick={(e) => { e.stopPropagation(); navigateLightbox('prev'); }}
              aria-label="Previous image"
            >
              ←
            </button>
            <button
              className="lightbox-nav next"
              onClick={(e) => { e.stopPropagation(); navigateLightbox('next'); }}
              aria-label="Next image"
            >
              →
            </button>
          </>
        )}

        {lightboxImage && (
          <div className="lightbox-content" onClick={e => e.stopPropagation()}>
            <img src={lightboxImage} alt="Gallery enlarged" />
          </div>
        )}
      </div>

      {/* ================= VIDEO MODAL ================= */}
      <div
        className={`video-modal-overlay ${videoModal ? 'active' : ''}`}
        onClick={() => setVideoModal(null)}
      >
        <button
          className="video-modal-close"
          onClick={() => setVideoModal(null)}
          aria-label="Close video"
        >
          ×
        </button>

        {videoModal && (
          <div className="video-modal-content" onClick={e => e.stopPropagation()}>
            {videoModal.video_file_url ? (
              <video
                src={videoModal.video_file_url}
                controls
                autoPlay
                style={{ maxWidth: '90vw', maxHeight: '80vh', borderRadius: '8px' }}
              />
            ) : videoModal.video_url ? (
              <iframe
                src={videoModal.video_url}
                title={videoModal.customer_name}
                width="800"
                height="450"
                frameBorder="0"
                allow="autoplay; fullscreen"
                allowFullScreen
                style={{ borderRadius: '8px', maxWidth: '90vw' }}
              />
            ) : (
              <p style={{ color: 'white' }}>Video not available</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Media;
