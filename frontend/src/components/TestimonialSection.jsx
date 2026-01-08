import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './TestimonialSection.css';

const API_BASE_URL = '/api';

function TestimonialSection({ title = "What People Say", backgroundColor = "light", maxTestimonials = 6 }) {
  const [textTestimonials, setTextTestimonials] = useState([]);
  const [videoTestimonials, setVideoTestimonials] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoplay, setIsAutoplay] = useState(true);
  const [activeTab, setActiveTab] = useState('text'); // 'text' or 'video'

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const [textRes, videoRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/media/testimonials/text/`),
          axios.get(`${API_BASE_URL}/media/testimonials/video/`)
        ]);

        setTextTestimonials(textRes.data.results || textRes.data);
        setVideoTestimonials(videoRes.data.results || videoRes.data);
      } catch (error) {
        console.error('Error fetching testimonials:', error);
      }
    };

    fetchTestimonials();
  }, []);

  // Autoplay for text testimonials
  useEffect(() => {
    if (!isAutoplay || textTestimonials.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % textTestimonials.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoplay, textTestimonials.length]);

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % textTestimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + textTestimonials.length) % textTestimonials.length);
  };

  const goToTestimonial = (index) => {
    setCurrentIndex(index);
  };

  const handleMouseEnter = () => setIsAutoplay(false);
  const handleMouseLeave = () => setIsAutoplay(true);

  if ((textTestimonials.length === 0 && videoTestimonials.length === 0)) {
    return null;
  }

  return (
    <section className={`testimonial-section testimonial-${backgroundColor}`}>
      <div className="testimonial-container">
        <div className="testimonial-header">
          <h2>{title}</h2>
          {(textTestimonials.length > 0 && videoTestimonials.length > 0) && (
            <div className="testimonial-tabs">
              <button
                className={`tab-button ${activeTab === 'text' ? 'active' : ''}`}
                onClick={() => setActiveTab('text')}
              >
                Text Reviews
              </button>
              <button
                className={`tab-button ${activeTab === 'video' ? 'active' : ''}`}
                onClick={() => setActiveTab('video')}
              >
                Video Stories
              </button>
            </div>
          )}
        </div>

        <div className="testimonial-content">
          {activeTab === 'text' && textTestimonials.length > 0 && (
            <div
              className="text-testimonials"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <div className="testimonial-card">
                <div className="quote-icon">"</div>
                <blockquote className="testimonial-quote">
                  {textTestimonials[currentIndex]?.quote}
                </blockquote>
                <div className="testimonial-author">
                  <div className="author-name">{textTestimonials[currentIndex]?.customer_name}</div>
                  {textTestimonials[currentIndex]?.location && (
                    <div className="author-location">{textTestimonials[currentIndex]?.location}</div>
                  )}
                </div>
              </div>

              {textTestimonials.length > 1 && (
                <div className="testimonial-navigation">
                  <button
                    className="nav-button prev"
                    onClick={prevTestimonial}
                    aria-label="Previous testimonial"
                  >
                    ‹
                  </button>

                  <div className="testimonial-indicators">
                    {textTestimonials.slice(0, maxTestimonials).map((_, index) => (
                      <button
                        key={index}
                        className={`indicator ${index === currentIndex ? 'active' : ''}`}
                        onClick={() => goToTestimonial(index)}
                        aria-label={`Go to testimonial ${index + 1}`}
                      />
                    ))}
                  </div>

                  <button
                    className="nav-button next"
                    onClick={nextTestimonial}
                    aria-label="Next testimonial"
                  >
                    ›
                  </button>
                </div>
              )}
            </div>
          )}

          {activeTab === 'video' && videoTestimonials.length > 0 && (
            <div className="video-testimonials">
              <div className="video-grid">
                {videoTestimonials.slice(0, maxTestimonials).map((video) => (
                  <div key={video.id} className="video-card">
                    <div className="video-thumbnail">
                      {video.thumbnail_url ? (
                        <img
                          src={video.thumbnail_url}
                          alt={video.title || 'Video testimonial'}
                          className="thumbnail-image"
                        />
                      ) : (
                        <div className="video-placeholder">
                          <div className="play-icon">▶</div>
                        </div>
                      )}
                      <div className="play-overlay">
                        <div className="play-button">▶</div>
                      </div>
                    </div>
                    <div className="video-info">
                      <h4>{video.title}</h4>
                      <p>{video.customer_name}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default TestimonialSection;