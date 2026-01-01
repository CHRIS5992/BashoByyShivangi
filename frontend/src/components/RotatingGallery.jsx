import React from 'react';
import './RotatingGallery.css';

const RotatingGallery = ({ images }) => {
  // Limit to 10 images for optimal display
  const displayImages = images.slice(0, 10);
  const quantity = displayImages.length;

  console.log('RotatingGallery - Images count:', quantity);

  return (
    <div className="rotating-gallery-wrapper">
      <div 
        className="rotating-gallery-inner" 
        style={{ 
          '--quantity': quantity 
        }}
      >
        {displayImages.map((image, index) => (
          <div 
            key={image.id || index} 
            className="rotating-card" 
            style={{ 
              '--index': index 
            }}
          >
            <img 
              src={image.image_url} 
              alt={`Gallery ${index + 1}`} 
              className="rotating-card-img"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default RotatingGallery;
