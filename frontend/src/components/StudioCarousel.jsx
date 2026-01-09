import React from 'react';
import './StudioCarousel.css';

function StudioCarousel({ images = [], title = "Studio & Events", style }) {
  if (!images || images.length === 0) {
    return null;
  }

  return (
    <section className="studio-carousel-section" style={style}>
      <div className="studio-carousel-header">
        <h2>{title}</h2>
      </div>
      
      <div className="studio-carousel-container">
        <div className="studio-carousel-track">
          {/* First set of images */}
          {images.map((image, index) => (
            <div key={`img-${index}`} className="studio-carousel-item">
              <img
                src={image.src || image.image_url}
                alt={image.alt || image.caption || `Studio ${index + 1}`}
                loading="lazy"
              />
            </div>
          ))}
          {/* Duplicate set for seamless loop */}
          {images.map((image, index) => (
            <div key={`img-dup-${index}`} className="studio-carousel-item">
              <img
                src={image.src || image.image_url}
                alt={image.alt || image.caption || `Studio ${index + 1}`}
                loading="lazy"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default StudioCarousel;
