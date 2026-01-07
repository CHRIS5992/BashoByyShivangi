import React from 'react';

const ProductCare = () => {
  return (
    <section className="section-padding" style={{background: '#ffffff'}}>
      <style>{`
        @keyframes wave-1 {
          0%, 100% { transform: translateX(0) translateY(0) rotate(0deg); }
          50% { transform: translateX(-20px) translateY(-10px) rotate(5deg); }
        }
        @keyframes wave-2 {
          0%, 100% { transform: translateX(0) translateY(0) rotate(0deg); }
          50% { transform: translateX(20px) translateY(-15px) rotate(-5deg); }
        }
        @keyframes wave-3 {
          0%, 100% { transform: translateX(0) translateY(0) rotate(0deg); }
          50% { transform: translateX(-15px) translateY(10px) rotate(3deg); }
        }
      `}</style>
      <div className="container">
        <div className="section-header center" style={{marginBottom: '3rem'}}>
          <h2 className="section-title" style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <span className="title-accent" style={{fontSize: '1rem', letterSpacing: '0.2em'}}>PRODUCT CARE &</span>
            <span className="title-main" style={{fontSize: '2.5rem'}}>Information</span>
          </h2>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '2rem',
          maxWidth: '1200px',
          margin: '0 auto'
        }}>
          <div className="fade-in" style={{
            background: 'linear-gradient(135deg, #f0f8ff 0%, #ffffff 100%)',
            padding: '2rem',
            borderRadius: '16px',
            border: '2px solid #d4e9ff',
            boxShadow: '0 6px 24px rgba(33, 150, 243, 0.1)',
            transition: 'all 0.3s ease',
            position: 'relative',
            overflow: 'hidden'
          }} onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-8px)';
            e.currentTarget.style.boxShadow = '0 12px 36px rgba(33, 150, 243, 0.15)';
          }} onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 6px 24px rgba(33, 150, 243, 0.1)';
          }}>
            <svg style={{
              position: 'absolute',
              top: '-50px',
              right: '-50px',
              width: '250px',
              height: '250px',
              opacity: 0.15,
              animation: 'wave-1 8s ease-in-out infinite'
            }} viewBox="0 0 200 200">
              <path fill="#2196F3" d="M47.1,-57.1C59.9,-45.5,68.4,-29.4,71.8,-12.1C75.2,5.3,73.5,23.8,64.4,38.7C55.3,53.6,38.8,64.9,20.6,70.4C2.4,75.9,-17.5,75.6,-34.8,68.9C-52.1,62.2,-66.8,49.1,-74.3,32.5C-81.8,15.9,-82.1,-4.2,-75.8,-21.5C-69.5,-38.8,-56.6,-53.3,-41.5,-64.3C-26.4,-75.3,-9.1,-82.8,5.7,-89.3C20.5,-95.8,34.3,-68.7,47.1,-57.1Z" transform="translate(100 100)" />
            </svg>
            <h3 style={{
              color: '#2196F3',
              fontSize: '1.6rem',
              marginBottom: '1.5rem',
              fontWeight: 600,
              borderBottom: '3px solid #64B5F6',
              paddingBottom: '0.8rem',
              textAlign: 'center',
              fontFamily: "'Noto Serif JP', serif",
              letterSpacing: '0.05em'
            }}>
              Care Instructions
            </h3>
            <div style={{marginBottom: '1.5rem'}}>
              <h4 style={{color: '#2196F3', fontSize: '1.1rem', marginBottom: '0.7rem', fontWeight: 600}}>For Tableware:</h4>
              <ul style={{
                listStyle: 'none',
                padding: 0,
                lineHeight: '1.8',
                color: '#4a3a2a'
              }}>
                <li style={{marginBottom: '0.6rem', paddingLeft: '1.5rem', position: 'relative'}}>
                  <span style={{position: 'absolute', left: 0, color: '#2196F3', fontWeight: 'bold'}}>•</span>
                  Food safe
                </li>
                <li style={{marginBottom: '0.6rem', paddingLeft: '1.5rem', position: 'relative'}}>
                  <span style={{position: 'absolute', left: 0, color: '#2196F3', fontWeight: 'bold'}}>•</span>
                  Lead free
                </li>
                <li style={{marginBottom: '0.6rem', paddingLeft: '1.5rem', position: 'relative'}}>
                  <span style={{position: 'absolute', left: 0, color: '#2196F3', fontWeight: 'bold'}}>•</span>
                  Microwave and oven friendly
                </li>
                <li style={{marginBottom: '0.6rem', paddingLeft: '1.5rem', position: 'relative'}}>
                  <span style={{position: 'absolute', left: 0, color: '#2196F3', fontWeight: 'bold'}}>•</span>
                  Dishwasher friendly
                </li>
                <li style={{marginBottom: '0.6rem', paddingLeft: '1.5rem', position: 'relative'}}>
                  <span style={{position: 'absolute', left: 0, color: '#2196F3', fontWeight: 'bold'}}>•</span>
                  Handwash gently with soap or detergent to extend its longevity
                </li>
              </ul>
            </div>
            <div>
              <h4 style={{color: '#2196F3', fontSize: '1.1rem', marginBottom: '0.7rem', fontWeight: 600}}>For Lights and Artifacts:</h4>
              <ul style={{
                listStyle: 'none',
                padding: 0,
                lineHeight: '1.8',
                color: '#4a3a2a'
              }}>
                <li style={{marginBottom: '0.6rem', paddingLeft: '1.5rem', position: 'relative'}}>
                  <span style={{position: 'absolute', left: 0, color: '#2196F3', fontWeight: 'bold'}}>•</span>
                  Clean with damp cloth followed by dry cloth
                </li>
              </ul>
            </div>
          </div>

          <div className="fade-in" style={{
            background: 'linear-gradient(135deg, #fff4e6 0%, #ffffff 100%)',
            padding: '2rem',
            borderRadius: '16px',
            border: '2px solid #ffe0b2',
            boxShadow: '0 6px 24px rgba(255, 152, 0, 0.1)',
            transition: 'all 0.3s ease',
            position: 'relative',
            overflow: 'hidden'
          }} onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-8px)';
            e.currentTarget.style.boxShadow = '0 12px 36px rgba(255, 152, 0, 0.15)';
          }} onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 6px 24px rgba(255, 152, 0, 0.1)';
          }}>
            <svg style={{
              position: 'absolute',
              bottom: '-50px',
              left: '-50px',
              width: '250px',
              height: '250px',
              opacity: 0.15,
              animation: 'wave-2 10s ease-in-out infinite'
            }} viewBox="0 0 200 200">
              <path fill="#FF9800" d="M41.7,-52.5C54.4,-42.6,65.3,-29.4,70.1,-13.8C74.9,1.8,73.6,19.8,65.8,34.4C58,49,43.7,60.2,27.5,66.5C11.3,72.8,-6.7,74.2,-23.5,69.1C-40.3,64,-55.9,52.4,-65.2,37.3C-74.5,22.2,-77.5,3.6,-74.3,-13.7C-71.1,-31,-61.7,-47,-48.6,-57.2C-35.5,-67.4,-18.8,-71.8,-1.8,-69.5C15.2,-67.2,29,-52.4,41.7,-52.5Z" transform="translate(100 100)" />
            </svg>
            <h3 style={{
              color: '#FF9800',
              fontSize: '1.6rem',
              marginBottom: '1.2rem',
              fontWeight: 600,
              borderBottom: '3px solid #FFB74D',
              paddingBottom: '0.8rem',
              textAlign: 'center',
              fontFamily: "'Noto Serif JP', serif",
              letterSpacing: '0.05em'
            }}>
              Shipping
            </h3>
            <ul style={{
              listStyle: 'none',
              padding: 0,
              lineHeight: '1.9',
              color: '#4a3a2a'
            }}>
              <li style={{marginBottom: '0.9rem', paddingLeft: '1.5rem', position: 'relative'}}>
                <span style={{position: 'absolute', left: 0, color: '#FF9800', fontWeight: 'bold'}}>•</span>
                All items are carefully wrapped and packaged with eco-friendly materials to ensure safe delivery
              </li>
              <li style={{marginBottom: '0.9rem', paddingLeft: '1.5rem', position: 'relative'}}>
                <span style={{position: 'absolute', left: 0, color: '#FF9800', fontWeight: 'bold'}}>•</span>
                Shipping within India typically takes 5-7 business days
              </li>
              <li style={{marginBottom: '0.9rem', paddingLeft: '1.5rem', position: 'relative'}}>
                <span style={{position: 'absolute', left: 0, color: '#FF9800', fontWeight: 'bold'}}>•</span>
                Shipping charges are calculated based on weight at ₹50/kg
              </li>
              <li style={{marginBottom: '0.9rem', paddingLeft: '1.5rem', position: 'relative'}}>
                <span style={{position: 'absolute', left: 0, color: '#FF9800', fontWeight: 'bold'}}>•</span>
                Custom orders require 3-4 weeks for production before shipping
              </li>
              <li style={{marginBottom: '0.9rem', paddingLeft: '1.5rem', position: 'relative'}}>
                <span style={{position: 'absolute', left: 0, color: '#FF9800', fontWeight: 'bold'}}>•</span>
                Free shipping on orders above ₹3,000
              </li>
            </ul>
          </div>

          <div className="fade-in" style={{
            background: 'linear-gradient(135deg, #f3e5f5 0%, #ffffff 100%)',
            padding: '2rem',
            borderRadius: '16px',
            border: '2px solid #e1bee7',
            boxShadow: '0 6px 24px rgba(156, 39, 176, 0.1)',
            transition: 'all 0.3s ease',
            position: 'relative',
            overflow: 'hidden'
          }} onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-8px)';
            e.currentTarget.style.boxShadow = '0 12px 36px rgba(156, 39, 176, 0.15)';
          }} onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 6px 24px rgba(156, 39, 176, 0.1)';
          }}>
            <svg style={{
              position: 'absolute',
              top: '50%',
              right: '-50px',
              width: '250px',
              height: '250px',
              opacity: 0.15,
              animation: 'wave-3 12s ease-in-out infinite',
              transform: 'translateY(-50%)'
            }} viewBox="0 0 200 200">
              <path fill="#9C27B0" d="M44.3,-58.5C56.8,-48.3,65.7,-33.8,69.8,-17.8C73.9,-1.8,73.2,15.7,66.3,30.3C59.4,44.9,46.3,56.6,31.1,63.5C15.9,70.4,-1.4,72.5,-18.3,68.5C-35.2,64.5,-51.7,54.4,-62.3,40.1C-72.9,25.8,-77.6,7.3,-75.4,-10.3C-73.2,-27.9,-64.1,-44.6,-50.9,-54.5C-37.7,-64.4,-20.4,-67.5,-2.9,-63.8C14.6,-60.1,31.8,-68.7,44.3,-58.5Z" transform="translate(100 100)" />
            </svg>
            <h3 style={{
              color: '#9C27B0',
              fontSize: '1.6rem',
              marginBottom: '1.2rem',
              fontWeight: 600,
              borderBottom: '3px solid #BA68C8',
              paddingBottom: '0.8rem',
              textAlign: 'center',
              fontFamily: "'Noto Serif JP', serif",
              letterSpacing: '0.05em'
            }}>
              Returns & Exchange
            </h3>
            <ul style={{
              listStyle: 'none',
              padding: 0,
              lineHeight: '1.9',
              color: '#4a3a2a'
            }}>
              <li style={{marginBottom: '0.9rem', paddingLeft: '1.5rem', position: 'relative'}}>
                <span style={{position: 'absolute', left: 0, color: '#9C27B0', fontWeight: 'bold'}}>•</span>
                We want you to love your purchase. If you receive a damaged or defective item, we offer full refund or replacement
              </li>
              <li style={{marginBottom: '0.9rem', paddingLeft: '1.5rem', position: 'relative'}}>
                <span style={{position: 'absolute', left: 0, color: '#9C27B0', fontWeight: 'bold'}}>•</span>
                Please report any damage within 48 hours of delivery with photos
              </li>
              <li style={{marginBottom: '0.9rem', paddingLeft: '1.5rem', position: 'relative'}}>
                <span style={{position: 'absolute', left: 0, color: '#9C27B0', fontWeight: 'bold'}}>•</span>
                Due to the handmade nature of our products, slight variations in color and size are normal and not considered defects
              </li>
              <li style={{marginBottom: '0.9rem', paddingLeft: '1.5rem', position: 'relative'}}>
                <span style={{position: 'absolute', left: 0, color: '#9C27B0', fontWeight: 'bold'}}>•</span>
                Custom orders cannot be returned or exchanged once production has begun
              </li>
              <li style={{marginBottom: '0.9rem', paddingLeft: '1.5rem', position: 'relative'}}>
                <span style={{position: 'absolute', left: 0, color: '#9C27B0', fontWeight: 'bold'}}>•</span>
                Contact our customer service team for any concerns or questions
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductCare;
            background: 'linear-gradient(135deg, #f0f8ff 0%, #ffffff 100%)',
            padding: '2rem',
            borderRadius: '16px',
            border: '2px solid #d4e9ff',
            boxShadow: '0 6px 24px rgba(33, 150, 243, 0.1)',
            transition: 'all 0.3s ease',
            position: 'relative',
            overflow: 'hidden'
          }} onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-8px)';
            e.currentTarget.style.boxShadow = '0 12px 36px rgba(33, 150, 243, 0.15)';
          }} onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 6px 24px rgba(33, 150, 243, 0.1)';
          }}>
            <div style={{
              position: 'absolute',
              top: '-20px',
              right: '-20px',
              width: '100px',
              height: '100px',
              background: 'linear-gradient(135deg, #2196F3 0%, #64B5F6 100%)',
              borderRadius: '50%',
              opacity: 0.1
            }}></div>
            <h3 style={{
              color: '#2196F3',
              fontSize: '1.5rem',
              marginBottom: '1.5rem',
              fontWeight: 600,
              borderBottom: '3px solid #64B5F6',
              paddingBottom: '0.8rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <span style={{fontSize: '1.8rem'}}>✨</span>
              Care Instructions
            </h3>
            <div style={{marginBottom: '1.5rem'}}>
              <h4 style={{color: '#2196F3', fontSize: '1.1rem', marginBottom: '0.7rem', fontWeight: 600}}>For Tableware:</h4>
              <ul style={{
                listStyle: 'none',
                padding: 0,
                lineHeight: '1.8',
                color: '#4a3a2a'
              }}>
                <li style={{marginBottom: '0.6rem', paddingLeft: '1.5rem', position: 'relative'}}>
                  <span style={{position: 'absolute', left: 0, color: '#2196F3', fontWeight: 'bold'}}>•</span>
                  Food safe
                </li>
                <li style={{marginBottom: '0.6rem', paddingLeft: '1.5rem', position: 'relative'}}>
                  <span style={{position: 'absolute', left: 0, color: '#2196F3', fontWeight: 'bold'}}>•</span>
                  Lead free
                </li>
                <li style={{marginBottom: '0.6rem', paddingLeft: '1.5rem', position: 'relative'}}>
                  <span style={{position: 'absolute', left: 0, color: '#2196F3', fontWeight: 'bold'}}>•</span>
                  Microwave and oven friendly
                </li>
                <li style={{marginBottom: '0.6rem', paddingLeft: '1.5rem', position: 'relative'}}>
                  <span style={{position: 'absolute', left: 0, color: '#2196F3', fontWeight: 'bold'}}>•</span>
                  Dishwasher friendly
                </li>
                <li style={{marginBottom: '0.6rem', paddingLeft: '1.5rem', position: 'relative'}}>
                  <span style={{position: 'absolute', left: 0, color: '#2196F3', fontWeight: 'bold'}}>•</span>
                  Handwash gently with soap or detergent to extend its longevity
                </li>
              </ul>
            </div>
            <div>
              <h4 style={{color: '#2196F3', fontSize: '1.1rem', marginBottom: '0.7rem', fontWeight: 600}}>For Lights and Artifacts:</h4>
              <ul style={{
                listStyle: 'none',
                padding: 0,
                lineHeight: '1.8',
                color: '#4a3a2a'
              }}>
                <li style={{marginBottom: '0.6rem', paddingLeft: '1.5rem', position: 'relative'}}>
                  <span style={{position: 'absolute', left: 0, color: '#2196F3', fontWeight: 'bold'}}>•</span>
                  Clean with damp cloth followed by dry cloth
                </li>
              </ul>
            </div>
          </div>

          <div className="fade-in" style={{
            background: 'linear-gradient(135deg, #fff4e6 0%, #ffffff 100%)',
            padding: '2rem',
            borderRadius: '16px',
            border: '2px solid #ffe0b2',
            boxShadow: '0 6px 24px rgba(255, 152, 0, 0.1)',
            transition: 'all 0.3s ease',
            position: 'relative',
            overflow: 'hidden'
          }} onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-8px)';
            e.currentTarget.style.boxShadow = '0 12px 36px rgba(255, 152, 0, 0.15)';
          }} onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 6px 24px rgba(255, 152, 0, 0.1)';
          }}>
            <div style={{
              position: 'absolute',
              top: '-20px',
              right: '-20px',
              width: '100px',
              height: '100px',
              background: 'linear-gradient(135deg, #FF9800 0%, #FFB74D 100%)',
              borderRadius: '50%',
              opacity: 0.1
            }}></div>
            <h3 style={{
              color: '#FF9800',
              fontSize: '1.5rem',
              marginBottom: '1.2rem',
              fontWeight: 600,
              borderBottom: '3px solid #FFB74D',
              paddingBottom: '0.8rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <span style={{fontSize: '1.8rem'}}>📦</span>
              Shipping
            </h3>
            <ul style={{
              listStyle: 'none',
              padding: 0,
              lineHeight: '1.9',
              color: '#4a3a2a'
            }}>
              <li style={{marginBottom: '0.9rem', paddingLeft: '1.5rem', position: 'relative'}}>
                <span style={{position: 'absolute', left: 0, color: '#FF9800', fontWeight: 'bold'}}>•</span>
                All items are carefully wrapped and packaged with eco-friendly materials to ensure safe delivery
              </li>
              <li style={{marginBottom: '0.9rem', paddingLeft: '1.5rem', position: 'relative'}}>
                <span style={{position: 'absolute', left: 0, color: '#FF9800', fontWeight: 'bold'}}>•</span>
                Shipping within India typically takes 5-7 business days
              </li>
              <li style={{marginBottom: '0.9rem', paddingLeft: '1.5rem', position: 'relative'}}>
                <span style={{position: 'absolute', left: 0, color: '#FF9800', fontWeight: 'bold'}}>•</span>
                Shipping charges are calculated based on weight at ₹50/kg
              </li>
              <li style={{marginBottom: '0.9rem', paddingLeft: '1.5rem', position: 'relative'}}>
                <span style={{position: 'absolute', left: 0, color: '#FF9800', fontWeight: 'bold'}}>•</span>
                Custom orders require 3-4 weeks for production before shipping
              </li>
              <li style={{marginBottom: '0.9rem', paddingLeft: '1.5rem', position: 'relative'}}>
                <span style={{position: 'absolute', left: 0, color: '#FF9800', fontWeight: 'bold'}}>•</span>
                Free shipping on orders above ₹3,000
              </li>
            </ul>
          </div>

          <div className="fade-in" style={{
            background: 'linear-gradient(135deg, #f3e5f5 0%, #ffffff 100%)',
            padding: '2rem',
            borderRadius: '16px',
            border: '2px solid #e1bee7',
            boxShadow: '0 6px 24px rgba(156, 39, 176, 0.1)',
            transition: 'all 0.3s ease',
            position: 'relative',
            overflow: 'hidden'
          }} onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-8px)';
            e.currentTarget.style.boxShadow = '0 12px 36px rgba(156, 39, 176, 0.15)';
          }} onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 6px 24px rgba(156, 39, 176, 0.1)';
          }}>
            <div style={{
              position: 'absolute',
              top: '-20px',
              right: '-20px',
              width: '100px',
              height: '100px',
              background: 'linear-gradient(135deg, #9C27B0 0%, #BA68C8 100%)',
              borderRadius: '50%',
              opacity: 0.1
            }}></div>
            <h3 style={{
              color: '#9C27B0',
              fontSize: '1.5rem',
              marginBottom: '1.2rem',
              fontWeight: 600,
              borderBottom: '3px solid #BA68C8',
              paddingBottom: '0.8rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <span style={{fontSize: '1.8rem'}}>🔄</span>
              Returns & Exchange
            </h3>
            <ul style={{
              listStyle: 'none',
              padding: 0,
              lineHeight: '1.9',
              color: '#4a3a2a'
            }}>
              <li style={{marginBottom: '0.9rem', paddingLeft: '1.5rem', position: 'relative'}}>
                <span style={{position: 'absolute', left: 0, color: '#9C27B0', fontWeight: 'bold'}}>•</span>
                We want you to love your purchase. If you receive a damaged or defective item, we offer full refund or replacement
              </li>
              <li style={{marginBottom: '0.9rem', paddingLeft: '1.5rem', position: 'relative'}}>
                <span style={{position: 'absolute', left: 0, color: '#9C27B0', fontWeight: 'bold'}}>•</span>
                Please report any damage within 48 hours of delivery with photos
              </li>
              <li style={{marginBottom: '0.9rem', paddingLeft: '1.5rem', position: 'relative'}}>
                <span style={{position: 'absolute', left: 0, color: '#9C27B0', fontWeight: 'bold'}}>•</span>
                Due to the handmade nature of our products, slight variations in color and size are normal and not considered defects
              </li>
              <li style={{marginBottom: '0.9rem', paddingLeft: '1.5rem', position: 'relative'}}>
                <span style={{position: 'absolute', left: 0, color: '#9C27B0', fontWeight: 'bold'}}>•</span>
                Custom orders cannot be returned or exchanged once production has begun
              </li>
              <li style={{marginBottom: '0.9rem', paddingLeft: '1.5rem', position: 'relative'}}>
                <span style={{position: 'absolute', left: 0, color: '#9C27B0', fontWeight: 'bold'}}>•</span>
                Contact our customer service team for any concerns or questions
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductCare;
