import React, { useState, useMemo } from 'react';
import './VideoTestimonialsHero.css';

export default function VideoTestimonialsHero({ videos = [], onPlay }) {
  const [index, setIndex] = useState(0);

  const len = videos.length;
  const current = len ? videos[index % len] : null;

  const currentThumb = useMemo(() => {
    if (!current) return null;
    return current.thumbnail_url || `${process.env.PUBLIC_URL}/images/gallery/vdbg.png`;
  }, [current]);

  if (!len) return null;

  return (
    <section
      className="video-hero-section"
      style={{
        backgroundImage: `url(${process.env.PUBLIC_URL}/images/gallery/vdbg.png)`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      {/* Left name bars */}
      <div className="video-hero-side left">
        <div className="name-bar">
          <span className="name-text">{videos[(index - 2 + len) % len]?.customer_name || ''}</span>
        </div>
        <div className="name-bar">
          <span className="name-text">{videos[(index - 1 + len) % len]?.customer_name || ''}</span>
        </div>
        <button className="side-arrow" aria-label="Previous" onClick={() => setIndex((i) => (i - 1 + len) % len)}>←</button>
      </div>

      {/* Center featured card */}
      <div className="video-hero-center">
        <div className="center-card" style={{ backgroundImage: currentThumb ? `url(${currentThumb})` : undefined }}>
          <button
            className="play-button"
            aria-label="Play video"
            onClick={() => onPlay && onPlay(current)}
          >
            ▶
          </button>
          <div className="center-info">
            <div className="name">{current.customer_name}</div>
            {(current.location || current.description) && (
              <div className="role">{current.location || current.description}</div>
            )}
          </div>
        </div>
      </div>

      {/* Right name bars */}
      <div className="video-hero-side right">
        <div className="name-bar">
          <span className="name-text">{videos[(index + 1) % len]?.customer_name || ''}</span>
        </div>
        <div className="name-bar">
          <span className="name-text">{videos[(index + 2) % len]?.customer_name || ''}</span>
        </div>
        <button className="side-arrow" aria-label="Next" onClick={() => setIndex((i) => (i + 1) % len)}>→</button>
      </div>
    </section>
  );
}
