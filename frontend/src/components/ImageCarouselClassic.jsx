import React, { useState, useEffect, useRef } from 'react';
import './ImageCarouselClassic.css';

function ImageCarouselClassic({ images = [], title, colorTheme = 'light' }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoplay, setIsAutoplay] = useState(true);
  const autoplayRef = useRef(null);
  const imagesPerView = Math.min(3, images.length); // Show up to 3 images, but fewer if not enough

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % Math.max(1, images.length - imagesPerView + 1));
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + Math.max(1, images.length - imagesPerView + 1)) % Math.max(1, images.length - imagesPerView + 1));
  };

  const goToSlide = (index) => {
    setCurrentIndex(Math.min(index, Math.max(0, images.length - imagesPerView)));
  };

  useEffect(() => {
    if (!isAutoplay || images.length <= imagesPerView) return;
    autoplayRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % Math.max(1, images.length - imagesPerView + 1));
    }, 3000);
    return () => {
      if (autoplayRef.current) clearInterval(autoplayRef.current);
    };
  }, [isAutoplay, images.length, imagesPerView]);

  const handleMouseEnter = () => {
    setIsAutoplay(false);
    if (autoplayRef.current) clearInterval(autoplayRef.current);
  };

  const handleMouseLeave = () => {
    setIsAutoplay(true);
  };

  if (!images || images.length === 0) {
    return null;
  }

  return (
    <section className={`classic-carousel-section classic-${colorTheme}`}>
      <div className="classic-carousel-header">
        <h2>{title}</h2>
      </div>

      <div
        className="classic-carousel-container"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div 
          className="classic-carousel-track"
          style={{ 
            '--images-per-view': imagesPerView,
            transform: `translateX(-${currentIndex * (100 / imagesPerView)}%)` 
          }}
        >
          {images.map((image, index) => (
            <div
              key={index}
              className="classic-carousel-slide"
            >
              <div className="image-wrapper">
                <img
                  src={image.src || image.image_url}
                  alt={image.alt || image.caption || `Slide ${index + 1}`}
                  className="classic-carousel-image"
                />
              </div>
              {image.caption && (
                <div className="classic-carousel-caption">
                  <p>{image.caption}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        {images.length > imagesPerView && (
          <>
            <button
              className="classic-carousel-nav classic-carousel-prev"
              onClick={prevSlide}
              aria-label="Previous slide"
            >
              &lt;
            </button>
            <button
              className="classic-carousel-nav classic-carousel-next"
              onClick={nextSlide}
              aria-label="Next slide"
            >
              &gt;
            </button>

            <div className="classic-carousel-dots">
              {Array.from({ length: Math.max(1, images.length - imagesPerView + 1) }, (_, index) => (
                <button
                  key={index}
                  className={`classic-carousel-dot ${index === currentIndex ? 'active' : ''}`}
                  onClick={() => goToSlide(index)}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}

export default ImageCarouselClassic;
