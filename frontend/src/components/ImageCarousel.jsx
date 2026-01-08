import React from 'react';
import './ImageCarousel.css';

function ImageCarousel({ images = [], title, colorTheme = 'light' }) {
  if (!images || images.length === 0) {
    return null;
  }

  return (
    <section className={`carousel-section carousel-${colorTheme}`}>
      <div className="carousel-header">
        <h2>{title}</h2>
      </div>

      <div className="carousel-container">
        <div className="carousel-track">
          {/* First set */}
          {images.map((image, index) => (
            <div key={`set1-${index}`} className="carousel-item">
              <img
                src={image.src || image.image_url}
                alt={image.alt || image.caption || `Item ${index + 1}`}
              />
              {image.caption && <div className="carousel-overlay">{image.caption}</div>}
            </div>
          ))}
          {/* Duplicate for seamless loop */}
          {images.map((image, index) => (
            <div key={`set2-${index}`} className="carousel-item">
              <img
                src={image.src || image.image_url}
                alt={image.alt || image.caption || `Item ${index + 1}`}
              />
              {image.caption && <div className="carousel-overlay">{image.caption}</div>}
            </div>
          ))}
        </div>
      </div>
      {/* Gradient overlays */}
      <div className="carousel-fade carousel-fade-left"></div>
      <div className="carousel-fade carousel-fade-right"></div>
    </section>
  );
}

export default ImageCarousel;
