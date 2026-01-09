import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import './Media.css';
import DomeGallery from './DomeGallery';
import WorkshopCarousel from './WorkshopCarousel';
import StudioCarousel from './StudioCarousel';
import TextTestimonialStack from './TextTestimonialStack';
import HeadingSplit from './HeadingSplit';
import VideoTestimonialsHero from './VideoTestimonialsHero';

const API_BASE_URL = '/api';

function Media() {
  const [galleryImages, setGalleryImages] = useState([]);
  const [workshopGalleryImages, setWorkshopGalleryImages] = useState([]);
  const [studioGalleryImages, setStudioGalleryImages] = useState([]);
  const [experiences, setExperiences] = useState([]);
  const [videoTestimonials, setVideoTestimonials] = useState([]);

  const [activeFilter] = useState('all');
  const [lightboxImage, setLightboxImage] = useState(null);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [videoModal, setVideoModal] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [galleryRes, workshopRes, studioRes, expRes, videoRes] = await Promise.all([
          // Fetch 'product' category for the product gallery section
          axios.get(`${API_BASE_URL}/media/gallery/`, { params: { category: 'product' } }),
          // Fetch 'workshop' category for workshop moments
          axios.get(`${API_BASE_URL}/media/gallery/`, { params: { category: 'workshop' } }),
          // Fetch 'studio' category for studio & events
          axios.get(`${API_BASE_URL}/media/gallery/`, { params: { category: 'studio' } }),
          axios.get(`${API_BASE_URL}/media/experiences/`),
          // Video testimonials
          axios.get(`${API_BASE_URL}/media/testimonials/video/`)
        ]);

        setGalleryImages(galleryRes.data.results || galleryRes.data);
        setWorkshopGalleryImages(workshopRes.data.results || workshopRes.data);
        setStudioGalleryImages(studioRes.data.results || studioRes.data);
        setExperiences(expRes.data.results || expRes.data);
        setVideoTestimonials(videoRes.data.results || videoRes.data);
      } catch (error) {
        console.error('Error fetching media data:', error);
      }
    };

    fetchData();
  }, []);

  const filteredImages = activeFilter === 'all'
    ? galleryImages
    : galleryImages.filter(img => img.category === activeFilter);

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
      <section
        className="media-hero"
        style={{
          backgroundImage: `linear-gradient(90deg, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.28) 55%, rgba(0,0,0,0.08) 100%), url(${process.env.PUBLIC_URL}/images/gallery/str.jpg)`,
          backgroundSize: 'cover',
          backgroundPosition: 'center center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        <div className="media-hero-content">
          <h1>Stories & Moments</h1>
          <p>
            A collection of handcrafted work, shared experiences, and the quiet
            moments that define Basho — told through images and heartfelt words.
          </p>
        </div>
      </section>

      {/* ================= PRODUCT GALLERY ================= */}
      <section className="media-gallery">
        {/* 3D Dome Gallery */}
        {galleryImages.length > 0 && (
          <div className="dome-gallery-wrapper">
            <div className="section-header dome-header">
              <h2>Product Gallery</h2>
            </div>
            <DomeGallery
              images={galleryImages.map(img => ({
                src: img.image_url,
                alt: img.caption || img.title || 'Gallery image'
              }))}
              fit={0.48}
              padFactor={0.02}
              maxVerticalRotationDeg={4}
              dragSensitivity={24}
              minRadius={1500}
              grayscale={false}
              imageBorderRadius="18px"
              openedImageBorderRadius="22px"
              openedImageWidth="320px"
              openedImageHeight="420px"
            />
          </div>
        )}
      </section>

      {/* ================= WORKSHOP MOMENTS CAROUSEL ================= */}
      {workshopGalleryImages.length > 0 && (
        <WorkshopCarousel
          images={workshopGalleryImages.map(img => ({
            src: img.image_url,
            alt: img.caption || 'Workshop moment',
            caption: img.caption
          }))}
          title="Workshop Moments"
          style={{
            backgroundImage: `url(${process.env.PUBLIC_URL}/images/gallery/wrkev.png)`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
          }}
        />
      )}

      {/* ================= STUDIO & EVENTS CAROUSEL ================= */}
      {studioGalleryImages.length > 0 && (
        <StudioCarousel
          images={studioGalleryImages.map(img => ({
            src: img.image_url,
            alt: img.caption || 'Studio event',
            caption: img.caption
          }))}
          title="Studio & Events"
          style={{
            backgroundImage: `url(${process.env.PUBLIC_URL}/images/gallery/stdev.png)`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
          }}
        />
      )}

      <section className="media-testimonials" style={{
        backgroundImage: `url(${process.env.PUBLIC_URL}/images/gallery/textbg.jpg)`,
        backgroundSize: 'cover',
        backgroundPosition: 'center top',
        backgroundRepeat: 'no-repeat'
      }}>
        <div className="testimonial-layout">
          <div className="testimonial-left">
            <HeadingSplit text="Testimonials" />
            <p className="testimonial-subtext">What people are saying about their experiences.</p>
          </div>
          <div className="testimonial-right">
            <TextTestimonialStack />
          </div>
        </div>
      </section>

      {/* ================= VIDEO TESTIMONIALS (Hero style) ================= */}
      {videoTestimonials.length > 0 && (
        <VideoTestimonialsHero videos={videoTestimonials} onPlay={setVideoModal} />
      )}

      {/* ================= CUSTOMER EXPERIENCES ================= */}
      {experiences.length > 0 && (
        <section className="customer-experiences-section">
          <div className="experiences-header">
            <h2>Proven track of satisfied clients</h2>
            <p>We cherish relations to blossom and last</p>
          </div>

          <div className="experiences-masonry">
            {experiences.map(exp => (
              <div key={exp.id} className="experience-testimonial-card">
                <div className="experience-title">{(exp.title && exp.title.trim()) ? exp.title : 'Customer Story'}</div>
                <p className="experience-quote">"{exp.paragraph}"</p>
                <div className="experience-author-info">
                  {exp.image_url && (
                    <img src={exp.image_url} alt={exp.customer_name || 'Customer'} className="experience-avatar" />
                  )}
                  <div>
                    <div className="experience-author-name">{exp.customer_name || 'Anonymous'}</div>
                    {exp.context && <div className="experience-author-role">{exp.context}</div>}
                  </div>
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
