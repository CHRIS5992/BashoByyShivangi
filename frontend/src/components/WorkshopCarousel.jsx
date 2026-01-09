import React from 'react';
import './WorkshopCarousel.css';

function WorkshopCarousel({ images = [], title = "Workshop Moments", style }) {
  if (!images || images.length === 0) {
    return null;
  }

  return (
    <section className="workshop-carousel-section" style={style}>
      <div className="workshop-carousel-header">
        <h2>{title}</h2>
      </div>
      
      <div className="workshop-carousel-container">
        <div className="workshop-carousel-track">
          {/* First set of images */}
          {images.map((image, index) => (
            <div key={`img-${index}`} className="workshop-carousel-item">
              <img
                src={image.src || image.image_url}
                alt={image.alt || image.caption || `Workshop ${index + 1}`}
                loading="lazy"
              />
            </div>
          ))}
          {/* Duplicate set for seamless loop */}
          {images.map((image, index) => (
            <div key={`img-dup-${index}`} className="workshop-carousel-item">
              <img
                src={image.src || image.image_url}
                alt={image.alt || image.caption || `Workshop ${index + 1}`}
                loading="lazy"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default WorkshopCarousel;
