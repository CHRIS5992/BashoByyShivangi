import React from 'react';

const ProductCare = () => {
  return (
    <section className="section-padding" style={{
      background: '#EDD8B4',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <style>{`
        @keyframes wave-1 {
          0%, 100% { transform: translateX(0) translateY(0) rotate(0deg); }
          50% { transform: translateX(-30px) translateY(-20px) rotate(8deg); }
        }
        @keyframes wave-2 {
          0%, 100% { transform: translateX(0) translateY(0) rotate(0deg); }
          50% { transform: translateX(30px) translateY(-25px) rotate(-8deg); }
        }
        @keyframes wave-3 {
          0%, 100% { transform: translateX(0) translateY(0) rotate(0deg); }
          50% { transform: translateX(-25px) translateY(20px) rotate(5deg); }
        }
      `}</style>

      {/* Earthy Animated Floating Circles */}
      <div style={{
        position: 'absolute',
        top: '-100px',
        left: '-100px',
        width: '400px',
        height: '400px',
        borderRadius: '50%',
        background: '#652810',
        opacity: 0.3,
        filter: 'blur(40px)',
        animation: 'wave-1 12s ease-in-out infinite',
        pointerEvents: 'none'
      }} />
      <div style={{
        position: 'absolute',
        bottom: '-80px',
        right: '-80px',
        width: '350px',
        height: '350px',
        borderRadius: '50%',
        background: '#C5A059',
        opacity: 0.3,
        filter: 'blur(40px)',
        animation: 'wave-2 15s ease-in-out infinite',
        pointerEvents: 'none'
      }} />
      <div style={{
        position: 'absolute',
        top: '40%',
        left: '60%',
        width: '300px',
        height: '300px',
        borderRadius: '50%',
        background: '#B4A69A',
        opacity: 0.3,
        filter: 'blur(40px)',
        animation: 'wave-3 18s ease-in-out infinite',
        pointerEvents: 'none'
      }} />

      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        {/* Main Header */}
        <div className="section-header center" style={{ marginBottom: '3rem' }}>
          <p style={{
            fontSize: '0.9rem',
            fontFamily: "'Work Sans', sans-serif",
            fontWeight: 600,
            letterSpacing: '0.2em',
            color: '#652810',
            marginBottom: '0.8rem',
            textTransform: 'uppercase'
          }}>PRODUCT CARE &</p>
          <h2 style={{
            fontSize: 'clamp(2.2rem, 4vw, 3rem)',
            fontFamily: "'Bricolage Grotesque', sans-serif",
            fontWeight: 800,
            color: '#652810',
            margin: 0,
            letterSpacing: '-0.01em'
          }}>Information</h2>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '2rem',
          maxWidth: '1200px',
          margin: '0 auto'
        }} className="product-care-grid">

          {/* Care Instructions Card */}
          <div className="fade-in" style={{
            background: 'rgba(252, 249, 245, 0.7)',
            backdropFilter: 'blur(15px)',
            WebkitBackdropFilter: 'blur(15px)',
            padding: '2.5rem',
            borderRadius: '16px',
            border: '1px solid rgba(101, 40, 16, 0.1)',
            boxShadow: '0 8px 32px rgba(101, 40, 16, 0.08)',
            transition: 'all 0.3s ease',
            position: 'relative',
            overflow: 'hidden'
          }} onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-6px)';
            e.currentTarget.style.boxShadow = '0 16px 48px rgba(101, 40, 16, 0.12)';
          }} onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 8px 32px rgba(101, 40, 16, 0.08)';
          }}>
            <h3 style={{
              color: '#652810',
              fontSize: '1.4rem',
              marginBottom: '1.5rem',
              fontWeight: 600,
              fontFamily: "'Bricolage Grotesque', sans-serif",
              borderBottom: '2px solid rgba(101, 40, 16, 0.15)',
              paddingBottom: '0.8rem',
              textAlign: 'center',
              letterSpacing: '0.02em'
            }}>
              Care Instructions
            </h3>
            <div style={{ marginBottom: '1.5rem' }}>
              <h4 style={{
                color: '#652810',
                fontSize: '1rem',
                marginBottom: '0.7rem',
                fontWeight: 600,
                fontFamily: "'Bricolage Grotesque', sans-serif"
              }}>For Tableware:</h4>
              <ul style={{
                listStyle: 'none',
                padding: 0,
                lineHeight: '1.9'
              }}>
                {['Food safe', 'Lead free', 'Microwave and oven friendly', 'Dishwasher friendly', 'Handwash gently with soap or detergent to extend its longevity'].map((item, i) => (
                  <li key={i} style={{
                    marginBottom: '0.6rem',
                    paddingLeft: '1.5rem',
                    position: 'relative',
                    color: 'rgba(101, 40, 16, 0.9)',
                    fontFamily: "'Work Sans', sans-serif",
                    fontWeight: 500,
                    fontSize: '0.95rem'
                  }}>
                    <span style={{ position: 'absolute', left: 0, color: '#652810', fontWeight: 'bold' }}>•</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 style={{
                color: '#652810',
                fontSize: '1rem',
                marginBottom: '0.7rem',
                fontWeight: 600,
                fontFamily: "'Bricolage Grotesque', sans-serif"
              }}>For Lights and Artifacts:</h4>
              <ul style={{
                listStyle: 'none',
                padding: 0,
                lineHeight: '1.9'
              }}>
                <li style={{
                  marginBottom: '0.6rem',
                  paddingLeft: '1.5rem',
                  position: 'relative',
                  color: 'rgba(101, 40, 16, 0.9)',
                  fontFamily: "'Work Sans', sans-serif",
                  fontWeight: 500,
                  fontSize: '0.95rem'
                }}>
                  <span style={{ position: 'absolute', left: 0, color: '#652810', fontWeight: 'bold' }}>•</span>
                  Clean with damp cloth followed by dry cloth
                </li>
              </ul>
            </div>
          </div>

          {/* Shipping Card */}
          <div className="fade-in" style={{
            background: 'rgba(252, 249, 245, 0.7)',
            backdropFilter: 'blur(15px)',
            WebkitBackdropFilter: 'blur(15px)',
            padding: '2.5rem',
            borderRadius: '16px',
            border: '1px solid rgba(101, 40, 16, 0.1)',
            boxShadow: '0 8px 32px rgba(101, 40, 16, 0.08)',
            transition: 'all 0.3s ease',
            position: 'relative',
            overflow: 'hidden'
          }} onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-6px)';
            e.currentTarget.style.boxShadow = '0 16px 48px rgba(101, 40, 16, 0.12)';
          }} onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 8px 32px rgba(101, 40, 16, 0.08)';
          }}>
            <h3 style={{
              color: '#652810',
              fontSize: '1.4rem',
              marginBottom: '1.5rem',
              fontWeight: 600,
              fontFamily: "'Bricolage Grotesque', sans-serif",
              borderBottom: '2px solid rgba(101, 40, 16, 0.15)',
              paddingBottom: '0.8rem',
              textAlign: 'center',
              letterSpacing: '0.02em'
            }}>
              Shipping
            </h3>
            <ul style={{
              listStyle: 'none',
              padding: 0,
              lineHeight: '1.9'
            }}>
              {[
                'All items are carefully wrapped and packaged with eco-friendly materials to ensure safe delivery',
                'Shipping within India typically takes 5-7 business days',
                'Shipping charges are calculated based on weight at ₹50/kg',
                'Custom orders require 3-4 weeks for production before shipping',
                'Free shipping on orders above ₹3,000'
              ].map((item, i) => (
                <li key={i} style={{
                  marginBottom: '0.8rem',
                  paddingLeft: '1.5rem',
                  position: 'relative',
                  color: 'rgba(101, 40, 16, 0.9)',
                  fontFamily: "'Work Sans', sans-serif",
                  fontWeight: 500,
                  fontSize: '0.95rem'
                }}>
                  <span style={{ position: 'absolute', left: 0, color: '#652810', fontWeight: 'bold' }}>•</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Returns Card */}
          <div className="fade-in" style={{
            background: 'rgba(252, 249, 245, 0.7)',
            backdropFilter: 'blur(15px)',
            WebkitBackdropFilter: 'blur(15px)',
            padding: '2.5rem',
            borderRadius: '16px',
            border: '1px solid rgba(101, 40, 16, 0.1)',
            boxShadow: '0 8px 32px rgba(101, 40, 16, 0.08)',
            transition: 'all 0.3s ease',
            position: 'relative',
            overflow: 'hidden'
          }} onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-6px)';
            e.currentTarget.style.boxShadow = '0 16px 48px rgba(101, 40, 16, 0.12)';
          }} onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 8px 32px rgba(101, 40, 16, 0.08)';
          }}>
            <h3 style={{
              color: '#652810',
              fontSize: '1.4rem',
              marginBottom: '1.5rem',
              fontWeight: 600,
              fontFamily: "'Bricolage Grotesque', sans-serif",
              borderBottom: '2px solid rgba(101, 40, 16, 0.15)',
              paddingBottom: '0.8rem',
              textAlign: 'center',
              letterSpacing: '0.02em'
            }}>
              Returns & Exchange
            </h3>
            <ul style={{
              listStyle: 'none',
              padding: 0,
              lineHeight: '1.9'
            }}>
              {[
                'We want you to love your purchase. If you receive a damaged or defective item, we offer full refund or replacement',
                'Please report any damage within 48 hours of delivery with photos',
                'Due to the handmade nature of our products, slight variations in color and size are normal and not considered defects',
                'Custom orders cannot be returned or exchanged once production has begun',
                'Contact our customer service team for any concerns or questions'
              ].map((item, i) => (
                <li key={i} style={{
                  marginBottom: '0.8rem',
                  paddingLeft: '1.5rem',
                  position: 'relative',
                  color: 'rgba(101, 40, 16, 0.9)',
                  fontFamily: "'Work Sans', sans-serif",
                  fontWeight: 500,
                  fontSize: '0.95rem'
                }}>
                  <span style={{ position: 'absolute', left: 0, color: '#652810', fontWeight: 'bold' }}>•</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductCare;
