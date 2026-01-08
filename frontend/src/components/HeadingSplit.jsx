import React, { useEffect, useMemo, useRef, useState } from 'react';
import gsap from 'gsap';
import './HeadingSplit.css';

function splitText(text) {
  return text.split('').map((ch, i) => ({ ch, key: `${ch}-${i}` }));
}

const HeadingSplit = ({ text = 'Testimonials', fontFamily = 'Poppins', size = 'clamp(2.5rem, 6vw, 5.5rem)' }) => {
  const rootRef = useRef(null);
  const [animated, setAnimated] = useState(false);
  const chars = useMemo(() => splitText(text), [text]);

  useEffect(() => {
    const el = rootRef.current;
    if (!el || animated) return;

    let obs;
    const hasUserScrolled = { current: false };
    const onUserScroll = () => { hasUserScrolled.current = true; };

    window.addEventListener('scroll', onUserScroll, { passive: true });
    window.addEventListener('touchmove', onUserScroll, { passive: true });

    const containerToObserve = el.closest('.media-testimonials') || el;
    obs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !animated && hasUserScrolled.current) {
          const targets = el.querySelectorAll('.split-char');
          gsap.fromTo(
            targets,
            { yPercent: 120, opacity: 0 },
            {
              yPercent: 0,
              opacity: 1,
              duration: 0.9,
              ease: 'power3.out',
              stagger: 0.045
            }
          );
          setAnimated(true);
          obs && obs.disconnect();
        }
      });
    }, { root: null, threshold: 0.5 });

    obs.observe(containerToObserve);

      return () => {
        obs && obs.disconnect();
        window.removeEventListener('scroll', onUserScroll);
        window.removeEventListener('touchmove', onUserScroll);
      };
  }, [animated]);

  return (
    <h2 ref={rootRef} className="heading-split" style={{ fontFamily }}>
      {chars.map(({ ch, key }) => (
        <span className="split-wrapper" key={key}>
          <span className="split-char" style={{ fontSize: size }}>{ch === ' ' ? '\u00A0' : ch}</span>
        </span>
      ))}
    </h2>
  );
};

export default HeadingSplit;
