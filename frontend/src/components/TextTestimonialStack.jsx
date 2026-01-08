import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import CardSwap, { Card } from './CardSwap';
import './TextTestimonialStack.css';

const API_BASE_URL = '/api';

const DefaultAvatar = () => (
  <svg width="36" height="36" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="10" fill="#EEE" />
    <circle cx="12" cy="9" r="3" fill="#BDBDBD" />
    <path d="M4.5 18.5C6 15.5 8.7 14 12 14c3.3 0 6 1.5 7.5 4.5" stroke="#BDBDBD" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

function TextTestimonialStack() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const FALLBACK = useMemo(
    () => [
      {
        quote: 'The craftsmanship and attention to detail are incredible. Every piece tells a story.',
        customer_name: 'Aarav Sharma',
        location: 'Delhi'
      },
      {
        quote: 'Beautiful, functional, and uniquely handmade. I absolutely love my new mug!',
        customer_name: 'Mira Kapoor',
        location: 'Mumbai'
      },
      {
        quote: 'A wonderful studio experience — warm people and inspiring work all around.',
        customer_name: 'Kabir Singh',
        location: 'Bengaluru'
      }
    ],
    []
  );

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/media/testimonials/text/`);
        const data = res.data?.results ?? res.data ?? [];
        if (mounted) setItems(data);
      } catch (e) {
        if (mounted) setItems([]);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  if (loading) return null;
  const displayItems = items && items.length > 0 ? items : FALLBACK;

  return (
    <div className="text-testimonial-stack">
      <CardSwap width={520} height={360} cardDistance={70} verticalDistance={80} pauseOnHover delay={4500}>
        {displayItems.map((t, idx) => (
          <Card key={idx} className="testimonial-card">
            <div className="testimonial-card-inner">
              <div className="quote-mark">“</div>
              <p className="quote-text">{t.quote}</p>
              <div className="author-row">
                <div className="avatar"><DefaultAvatar /></div>
                <div className="author-meta">
                  <div className="author-name">{t.customer_name || 'Anonymous'}</div>
                  {t.location ? <div className="author-location">{t.location}</div> : null}
                </div>
              </div>
            </div>
          </Card>
        ))}
      </CardSwap>
    </div>
  );
}

export default TextTestimonialStack;
