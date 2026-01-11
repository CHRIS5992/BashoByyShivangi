import React, { useState } from 'react';
import axios from 'axios';

const CustomOrderForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    project_type: '',
    description: '',
    budget: '',
    gst_number: ''
  });
  const [referenceImage, setReferenceImage] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setReferenceImage(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage('');

    try {
      const formDataToSend = new FormData();

      // Append all text fields
      Object.keys(formData).forEach(key => {
        formDataToSend.append(key, formData[key]);
      });

      // Append image if selected
      if (referenceImage) {
        formDataToSend.append('reference_images', referenceImage);
      }

      const response = await axios.post('http://localhost:8000/api/custom-orders/', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      setMessage(`Success! Your order number is ${response.data.order_number}. We'll contact you within 24 hours.`);

      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        project_type: '',
        description: '',
        budget: '',
        gst_number: ''
      });
      setReferenceImage(null);
      // Reset file input
      const fileInput = document.querySelector('input[type="file"]');
      if (fileInput) fileInput.value = '';
    } catch (error) {
      setMessage('Error submitting order. Please try again or contact us directly.');
      console.error('Order submission error:', error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="section-padding custom-order-background-wrapper" id="custom">
      <div className="container">
        {/* ========== HANDMADE PAPER TEAR HEADER ========== */}
        <div style={{
          position: 'relative',
          width: '100%',
          maxWidth: '700px',
          margin: '0 auto 90px',
          padding: '50px 60px',
          background: '#FCFAF7',
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.05)',
          /* Jagged torn paper edges using clip-path */
          clipPath: 'polygon(0% 3%, 4% 0%, 8% 2%, 12% 0%, 16% 3%, 20% 1%, 24% 2%, 28% 0%, 32% 3%, 36% 1%, 40% 2%, 44% 0%, 48% 3%, 52% 1%, 56% 2%, 60% 0%, 64% 3%, 68% 1%, 72% 2%, 76% 0%, 80% 3%, 84% 1%, 88% 2%, 92% 0%, 96% 3%, 100% 1%, 100% 97%, 96% 100%, 92% 98%, 88% 100%, 84% 97%, 80% 99%, 76% 98%, 72% 100%, 68% 97%, 64% 99%, 60% 98%, 56% 100%, 52% 97%, 48% 99%, 44% 98%, 40% 100%, 36% 97%, 32% 99%, 28% 98%, 24% 100%, 20% 97%, 16% 99%, 12% 98%, 8% 100%, 4% 97%, 0% 99%)',
          textAlign: 'center'
        }}>
          {/* Paper grain texture overlay */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            opacity: 0.03,
            pointerEvents: 'none',
            backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='grain'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23grain)'/%3E%3C/svg%3E\")",
            backgroundSize: '150px 150px'
          }} />

          {/* Heading */}
          <h2 style={{
            position: 'relative',
            fontSize: 'clamp(2.8rem, 5.5vw, 4rem)',
            fontWeight: 800,
            color: '#652810',
            marginBottom: '0',
            fontFamily: "'Bricolage Grotesque', sans-serif",
            letterSpacing: '-0.01em',
            lineHeight: 1.1
          }}>
            Custom Creation
          </h2>

          {/* Subtitle */}
          <p style={{
            position: 'relative',
            fontSize: '1.25rem',
            color: 'rgba(101, 40, 16, 0.7)',
            fontFamily: "'Cormorant Garamond', serif",
            fontStyle: 'italic',
            marginTop: '15px',
            marginBottom: '0',
            lineHeight: 1.5,
            letterSpacing: '0.02em'
          }}>Bespoke pottery crafted to your vision</p>
        </div>

        {/* Premium Intro Box */}
        <div className="custom-intro" style={{
          maxWidth: '850px',
          margin: '0 auto 80px',
          background: '#ffffff',
          padding: '45px 50px',
          borderRadius: '16px',
          boxShadow: '0 6px 24px rgba(0,0,0,0.06)',
          border: '1px solid rgba(101, 40, 16, 0.04)'
        }}>
          <p style={{
            fontSize: '1.25rem',
            lineHeight: 1.8,
            color: '#4A3728',
            fontFamily: "'Cormorant Garamond', serif",
            textAlign: 'center',
            margin: 0
          }}>
            Have a specific vision? We create custom pottery pieces tailored to your needs—from personalized dinnerware to unique art installations.
          </p>
        </div>

        {/* Premium "What We Offer" Box */}
        <div style={{
          maxWidth: '850px',
          margin: '0 auto 80px',
          background: 'linear-gradient(135deg, #FAF8F5 0%, #F5EFE7 100%)',
          padding: '45px 50px',
          borderRadius: '16px',
          boxShadow: '0 6px 24px rgba(0,0,0,0.06)',
          border: '1px solid rgba(101, 40, 16, 0.06)'
        }}>
          <h4 style={{
            color: '#652810',
            marginBottom: '1.8rem',
            fontSize: '1.4rem',
            fontWeight: 700,
            fontFamily: "'Bricolage Grotesque', sans-serif",
            letterSpacing: '-0.01em'
          }}>What We Offer</h4>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: '1.2rem' }}>
            {[
              'Custom tableware sets for homes and restaurants',
              'Personalized gifts with names or messages',
              'Corporate branding on pottery',
              'Large-scale art installations',
              'Wedding and event pottery'
            ].map((item, index) => (
              <li key={index} style={{
                color: '#4A3728',
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                fontSize: '1.1rem',
                lineHeight: 1.5
              }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
                  <circle cx="12" cy="12" r="11" stroke="#652810" strokeWidth="1.5" fill="none" />
                  <path d="M7 12.5L10.5 16L17 9" stroke="#652810" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Premium Form Container */}
        <div className="form-container" style={{
          maxWidth: '800px',
          margin: '0 auto',
          background: '#ffffff',
          padding: '50px 55px',
          borderRadius: '20px',
          boxShadow: '0 12px 40px rgba(101, 40, 16, 0.10)',
          border: '1px solid rgba(101, 40, 16, 0.04)'
        }}>
          <form onSubmit={handleSubmit} className="fade-in">
            <h3 style={{
              color: '#652810',
              fontSize: '2rem',
              marginBottom: '2.5rem',
              textAlign: 'center',
              fontWeight: 700,
              fontFamily: "'Bricolage Grotesque', sans-serif",
              letterSpacing: '-0.02em'
            }}>Request a Custom Order</h3>

            {message && (
              <div className="form-message" style={{
                padding: '1rem 1.2rem',
                marginBottom: '1.8rem',
                backgroundColor: message.includes('Success') ? 'rgba(212, 237, 218, 0.4)' : 'rgba(248, 215, 218, 0.4)',
                color: message.includes('Success') ? '#155724' : '#721c24',
                borderRadius: '10px',
                textAlign: 'center',
                border: `2px solid ${message.includes('Success') ? 'rgba(195, 230, 203, 0.6)' : 'rgba(245, 198, 203, 0.6)'}`,
                fontWeight: 500,
                backdropFilter: 'blur(10px)'
              }}>
                {message}
              </div>
            )}

            <div className="form-row">
              <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '0.6rem',
                  color: '#652810',
                  fontFamily: "'Work Sans', sans-serif",
                  fontWeight: 600,
                  fontSize: '0.95rem'
                }}>Your Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="Enter your name"
                  style={{
                    width: '100%',
                    padding: '1rem 1.1rem',
                    border: '1px solid rgba(101, 40, 16, 0.25)',
                    borderRadius: '8px',
                    background: '#FAF9F7',
                    fontSize: '1rem',
                    color: '#442D1C',
                    transition: 'all 0.25s ease',
                    outline: 'none'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#652810'}
                  onBlur={(e) => e.target.style.borderColor = 'rgba(101, 40, 16, 0.25)'}
                />
              </div>
              <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '0.6rem',
                  color: '#652810',
                  fontFamily: "'Work Sans', sans-serif",
                  fontWeight: 600,
                  fontSize: '0.95rem'
                }}>Email *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="your@email.com"
                  style={{
                    width: '100%',
                    padding: '1rem 1.1rem',
                    border: '1px solid rgba(101, 40, 16, 0.25)',
                    borderRadius: '8px',
                    background: '#FAF9F7',
                    fontSize: '1rem',
                    color: '#442D1C',
                    transition: 'all 0.25s ease',
                    outline: 'none'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#652810'}
                  onBlur={(e) => e.target.style.borderColor = 'rgba(101, 40, 16, 0.25)'}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '0.6rem',
                  color: '#652810',
                  fontFamily: "'Work Sans', sans-serif",
                  fontWeight: 600,
                  fontSize: '0.95rem'
                }}>Phone Number *</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  placeholder="+91 XXXXX XXXXX"
                  style={{
                    width: '100%',
                    padding: '1rem 1.1rem',
                    border: '1px solid rgba(101, 40, 16, 0.25)',
                    borderRadius: '8px',
                    background: '#FAF9F7',
                    fontSize: '1rem',
                    color: '#442D1C',
                    transition: 'all 0.25s ease',
                    outline: 'none'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#652810'}
                  onBlur={(e) => e.target.style.borderColor = 'rgba(101, 40, 16, 0.25)'}
                />
              </div>
              <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '0.6rem',
                  color: '#652810',
                  fontFamily: "'Work Sans', sans-serif",
                  fontWeight: 600,
                  fontSize: '0.95rem'
                }}>Project Type *</label>
                <select
                  name="project_type"
                  value={formData.project_type}
                  onChange={handleChange}
                  required
                  style={{
                    width: '100%',
                    padding: '1rem 1.1rem',
                    border: '1px solid rgba(101, 40, 16, 0.25)',
                    borderRadius: '8px',
                    background: '#FAF9F7',
                    fontSize: '1rem',
                    color: '#442D1C',
                    transition: 'all 0.25s ease',
                    outline: 'none',
                    cursor: 'pointer'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#652810'}
                  onBlur={(e) => e.target.style.borderColor = 'rgba(101, 40, 16, 0.25)'}
                >
                  <option value="">Select type</option>
                  <option value="tableware">Tableware Set</option>
                  <option value="art">Art Piece</option>
                  <option value="corporate">Corporate Order</option>
                  <option value="event">Event/Wedding</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: '1.5rem' }}>
              <label style={{
                display: 'block',
                marginBottom: '0.6rem',
                color: '#652810',
                fontFamily: "'Work Sans', sans-serif",
                fontWeight: 600,
                fontSize: '0.95rem'
              }}>Describe Your Vision *</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                placeholder="Tell us about your custom pottery idea, including size, colors, quantity, and any specific requirements..."
                style={{
                  width: '100%',
                  padding: '1rem 1.1rem',
                  border: '1px solid rgba(101, 40, 16, 0.25)',
                  borderRadius: '8px',
                  background: '#FAF9F7',
                  fontSize: '1rem',
                  color: '#442D1C',
                  transition: 'all 0.25s ease',
                  outline: 'none',
                  minHeight: '140px',
                  resize: 'vertical',
                  lineHeight: '1.6',
                  fontFamily: 'inherit'
                }}
                onFocus={(e) => e.target.style.borderColor = '#652810'}
                onBlur={(e) => e.target.style.borderColor = 'rgba(101, 40, 16, 0.25)'}
              />
              <span className="form-helper" style={{
                fontSize: '0.85rem',
                color: '#7A6A5A',
                marginTop: '0.4rem',
                display: 'block'
              }}>Be as detailed as possible</span>
            </div>

            <div className="form-group" style={{ marginBottom: '1.5rem' }}>
              <label style={{
                display: 'block',
                marginBottom: '0.6rem',
                color: '#652810',
                fontFamily: "'Work Sans', sans-serif",
                fontWeight: 600,
                fontSize: '0.95rem'
              }}>Budget Range (Optional)</label>
              <select
                name="budget"
                value={formData.budget}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '1rem 1.1rem',
                  border: '1px solid rgba(101, 40, 16, 0.25)',
                  borderRadius: '8px',
                  background: '#FAF9F7',
                  fontSize: '1rem',
                  color: '#442D1C',
                  transition: 'all 0.25s ease',
                  outline: 'none',
                  cursor: 'pointer'
                }}
                onFocus={(e) => e.target.style.borderColor = '#652810'}
                onBlur={(e) => e.target.style.borderColor = 'rgba(101, 40, 16, 0.25)'}
              >
                <option value="">Select range</option>
                <option value="5000-10000">₹5,000 - ₹10,000</option>
                <option value="10000-25000">₹10,000 - ₹25,000</option>
                <option value="25000-50000">₹25,000 - ₹50,000</option>
                <option value="50000+">₹50,000+</option>
              </select>
            </div>

            <div className="form-group" style={{ marginBottom: '1.5rem' }}>
              <label style={{
                display: 'block',
                marginBottom: '0.6rem',
                color: '#652810',
                fontFamily: "'Work Sans', sans-serif",
                fontWeight: 600,
                fontSize: '0.95rem'
              }}>GST Number (Optional - for invoice)</label>
              <input
                type="text"
                name="gst_number"
                value={formData.gst_number}
                onChange={handleChange}
                placeholder="Enter GST number if applicable"
                style={{
                  width: '100%',
                  padding: '1rem 1.1rem',
                  border: '1px solid rgba(101, 40, 16, 0.25)',
                  borderRadius: '8px',
                  background: '#FAF9F7',
                  fontSize: '1rem',
                  color: '#442D1C',
                  transition: 'all 0.25s ease',
                  outline: 'none'
                }}
                onFocus={(e) => e.target.style.borderColor = '#652810'}
                onBlur={(e) => e.target.style.borderColor = 'rgba(101, 40, 16, 0.25)'}
              />
            </div>

            <div className="form-group" style={{ marginBottom: '2rem' }}>
              <label style={{
                display: 'block',
                marginBottom: '0.6rem',
                color: '#652810',
                fontFamily: "'Work Sans', sans-serif",
                fontWeight: 600,
                fontSize: '0.95rem'
              }}>Reference Image (Optional)</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                style={{
                  width: '100%',
                  padding: '0.85rem 1rem',
                  border: '2px solid #EBE4DB',
                  borderRadius: '10px',
                  background: '#FFFFFF',
                  fontSize: '0.95rem',
                  color: '#442D1C',
                  cursor: 'pointer'
                }}
              />
              <span className="form-helper" style={{
                fontSize: '0.85rem',
                color: '#7A6A5A',
                marginTop: '0.4rem',
                display: 'block'
              }}>Upload a reference image or design inspiration (JPG, PNG)</span>
              {referenceImage && (
                <div style={{
                  marginTop: '0.7rem',
                  padding: '0.6rem 1rem',
                  background: 'rgba(142, 80, 34, 0.08)',
                  borderRadius: '8px',
                  color: '#652810',
                  fontSize: '0.9rem',
                  fontWeight: 500,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}>
                  <span style={{ color: '#8E5022', fontSize: '1.1rem' }}>✓</span>
                  Selected: {referenceImage.name}
                </div>
              )}
            </div>

            <button
              type="submit"
              className="submit-order-btn"
              disabled={submitting}
              style={{
                width: '100%',
                padding: '1.15rem 2.5rem',
                fontSize: '1.05rem',
                fontWeight: 700,
                fontFamily: "'Bricolage Grotesque', sans-serif",
                letterSpacing: '0.03em',
                borderRadius: '12px',
                background: submitting
                  ? '#9B7D5E'
                  : 'linear-gradient(180deg, #7A3518 0%, #652810 100%)',
                border: 'none',
                color: 'white',
                cursor: submitting ? 'not-allowed' : 'pointer',
                transition: 'all 0.25s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                boxShadow: submitting
                  ? '0 2px 8px rgba(101, 40, 16, 0.15)'
                  : '0 5px 16px rgba(101, 40, 16, 0.22)',
                transform: 'translateY(0)'
              }}
              onMouseEnter={(e) => {
                if (!submitting) {
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.background = 'linear-gradient(180deg, #8B4520 0%, #7A3518 100%)';
                  e.target.style.boxShadow = '0 8px 24px rgba(101, 40, 16, 0.32)';
                }
              }}
              onMouseLeave={(e) => {
                if (!submitting) {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.background = 'linear-gradient(180deg, #7A3518 0%, #652810 100%)';
                  e.target.style.boxShadow = '0 5px 16px rgba(101, 40, 16, 0.22)';
                }
              }}
              onMouseDown={(e) => {
                if (!submitting) {
                  e.target.style.transform = 'translateY(1px)';
                  e.target.style.boxShadow = '0 3px 10px rgba(101, 40, 16, 0.2)';
                }
              }}
              onMouseUp={(e) => {
                if (!submitting) {
                  e.target.style.transform = 'translateY(-3px)';
                  e.target.style.boxShadow = '0 10px 28px rgba(101, 40, 16, 0.35)';
                }
              }}
            >
              {submitting ? 'Submitting...' : 'Submit Custom Order Request'}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default CustomOrderForm;
