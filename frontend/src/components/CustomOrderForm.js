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
        <div className="section-header center">
          <h2 className="section-title">
            <span className="title-accent">Custom</span>
            <span className="title-main">Creations</span>
          </h2>
          <p className="section-subtitle">Bespoke pottery crafted to your vision</p>
        </div>

        <div className="custom-intro" style={{maxWidth: '800px', margin: '0 auto var(--spacing-lg)'}}>
          <p className="large-text">
            Have a specific vision? We create custom pottery pieces tailored to your needs—from personalized dinnerware to unique art installations.
          </p>
          
          <div className="info-box" style={{
            background: 'linear-gradient(135deg, #FAF8F5 0%, #F5EFE7 100%)',
            padding: '2rem',
            borderRadius: '12px',
            border: '1px solid rgba(101, 40, 16, 0.08)',
            marginTop: '2rem'
          }}>
            <h4 style={{color: '#652810', marginBottom: '1rem', fontSize: '1.15rem'}}>What We Offer</h4>
            <ul style={{listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: '0.7rem'}}>
              <li style={{color: '#5A3A2A', display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
                <span style={{color: '#8E5022', fontSize: '1.2rem'}}>✓</span> Custom tableware sets for homes and restaurants
              </li>
              <li style={{color: '#5A3A2A', display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
                <span style={{color: '#8E5022', fontSize: '1.2rem'}}>✓</span> Personalized gifts with names or messages
              </li>
              <li style={{color: '#5A3A2A', display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
                <span style={{color: '#8E5022', fontSize: '1.2rem'}}>✓</span> Corporate branding on pottery
              </li>
              <li style={{color: '#5A3A2A', display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
                <span style={{color: '#8E5022', fontSize: '1.2rem'}}>✓</span> Large-scale art installations
              </li>
              <li style={{color: '#5A3A2A', display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
                <span style={{color: '#8E5022', fontSize: '1.2rem'}}>✓</span> Wedding and event pottery
              </li>
            </ul>
          </div>
        </div>

        <div className="form-container" style={{
          maxWidth: '750px',
          margin: '3rem auto 0',
          background: 'linear-gradient(135deg, #FFFFFF 0%, #FAF8F5 100%)',
          padding: '2.5rem',
          borderRadius: '16px',
          boxShadow: '0 8px 32px rgba(101, 40, 16, 0.08)',
          border: '1px solid rgba(101, 40, 16, 0.06)'
        }}>
          <form onSubmit={handleSubmit} className="fade-in">
            <h3 style={{
              color: '#442D1C',
              fontSize: '1.8rem',
              marginBottom: '1.8rem',
              textAlign: 'center',
              fontWeight: 600,
              letterSpacing: '-0.5px'
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
              <div className="form-group" style={{marginBottom: '1.5rem'}}>
                <label style={{
                  display: 'block',
                  marginBottom: '0.5rem',
                  color: '#442D1C',
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
                    padding: '0.85rem 1rem',
                    border: '2px solid #EBE4DB',
                    borderRadius: '10px',
                    background: '#FFFFFF',
                    fontSize: '1rem',
                    color: '#442D1C',
                    transition: 'all 0.3s ease',
                    outline: 'none'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#A67C52'}
                  onBlur={(e) => e.target.style.borderColor = '#EBE4DB'}
                />
              </div>
              <div className="form-group" style={{marginBottom: '1.5rem'}}>
                <label style={{
                  display: 'block',
                  marginBottom: '0.5rem',
                  color: '#442D1C',
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
                    padding: '0.85rem 1rem',
                    border: '2px solid #EBE4DB',
                    borderRadius: '10px',
                    background: '#FFFFFF',
                    fontSize: '1rem',
                    color: '#442D1C',
                    transition: 'all 0.3s ease',
                    outline: 'none'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#A67C52'}
                  onBlur={(e) => e.target.style.borderColor = '#EBE4DB'}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group" style={{marginBottom: '1.5rem'}}>
                <label style={{
                  display: 'block',
                  marginBottom: '0.5rem',
                  color: '#442D1C',
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
                    padding: '0.85rem 1rem',
                    border: '2px solid #EBE4DB',
                    borderRadius: '10px',
                    background: '#FFFFFF',
                    fontSize: '1rem',
                    color: '#442D1C',
                    transition: 'all 0.3s ease',
                    outline: 'none'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#A67C52'}
                  onBlur={(e) => e.target.style.borderColor = '#EBE4DB'}
                />
              </div>
              <div className="form-group" style={{marginBottom: '1.5rem'}}>
                <label style={{
                  display: 'block',
                  marginBottom: '0.5rem',
                  color: '#442D1C',
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
                    padding: '0.85rem 1rem',
                    border: '2px solid #EBE4DB',
                    borderRadius: '10px',
                    background: '#FFFFFF',
                    fontSize: '1rem',
                    color: '#442D1C',
                    transition: 'all 0.3s ease',
                    outline: 'none',
                    cursor: 'pointer'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#A67C52'}
                  onBlur={(e) => e.target.style.borderColor = '#EBE4DB'}
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

            <div className="form-group" style={{marginBottom: '1.5rem'}}>
              <label style={{
                display: 'block',
                marginBottom: '0.5rem',
                color: '#442D1C',
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
                  padding: '0.85rem 1rem',
                  border: '2px solid #EBE4DB',
                  borderRadius: '10px',
                  background: '#FFFFFF',
                  fontSize: '1rem',
                  color: '#442D1C',
                  transition: 'all 0.3s ease',
                  outline: 'none',
                  minHeight: '140px',
                  resize: 'vertical',
                  lineHeight: '1.6',
                  fontFamily: 'inherit'
                }}
                onFocus={(e) => e.target.style.borderColor = '#A67C52'}
                onBlur={(e) => e.target.style.borderColor = '#EBE4DB'}
              />
              <span className="form-helper" style={{
                fontSize: '0.85rem',
                color: '#7A6A5A',
                marginTop: '0.4rem',
                display: 'block'
              }}>Be as detailed as possible</span>
            </div>

            <div className="form-group" style={{marginBottom: '1.5rem'}}>
              <label style={{
                display: 'block',
                marginBottom: '0.5rem',
                color: '#442D1C',
                fontWeight: 600,
                fontSize: '0.95rem'
              }}>Budget Range (Optional)</label>
              <select 
                name="budget"
                value={formData.budget}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '0.85rem 1rem',
                  border: '2px solid #EBE4DB',
                  borderRadius: '10px',
                  background: '#FFFFFF',
                  fontSize: '1rem',
                  color: '#442D1C',
                  transition: 'all 0.3s ease',
                  outline: 'none',
                  cursor: 'pointer'
                }}
                onFocus={(e) => e.target.style.borderColor = '#A67C52'}
                onBlur={(e) => e.target.style.borderColor = '#EBE4DB'}
              >
                <option value="">Select range</option>
                <option value="5000-10000">₹5,000 - ₹10,000</option>
                <option value="10000-25000">₹10,000 - ₹25,000</option>
                <option value="25000-50000">₹25,000 - ₹50,000</option>
                <option value="50000+">₹50,000+</option>
              </select>
            </div>

            <div className="form-group" style={{marginBottom: '1.5rem'}}>
              <label style={{
                display: 'block',
                marginBottom: '0.5rem',
                color: '#442D1C',
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
                  padding: '0.85rem 1rem',
                  border: '2px solid #EBE4DB',
                  borderRadius: '10px',
                  background: '#FFFFFF',
                  fontSize: '1rem',
                  color: '#442D1C',
                  transition: 'all 0.3s ease',
                  outline: 'none'
                }}
                onFocus={(e) => e.target.style.borderColor = '#A67C52'}
                onBlur={(e) => e.target.style.borderColor = '#EBE4DB'}
              />
            </div>

            <div className="form-group" style={{marginBottom: '2rem'}}>
              <label style={{
                display: 'block',
                marginBottom: '0.5rem',
                color: '#442D1C',
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
                  <span style={{color: '#8E5022', fontSize: '1.1rem'}}>✓</span>
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
                padding: '1rem 2rem',
                fontSize: '1.05rem',
                fontWeight: 600,
                borderRadius: '10px',
                background: submitting 
                  ? 'linear-gradient(135deg, #9B7D5E 0%, #A67C52 100%)' 
                  : 'linear-gradient(135deg, #8E5022 0%, #A67C52 100%)',
                border: 'none',
                color: 'white',
                cursor: submitting ? 'not-allowed' : 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: submitting 
                  ? '0 2px 8px rgba(142, 80, 34, 0.15)' 
                  : '0 4px 16px rgba(142, 80, 34, 0.25)',
                transform: submitting ? 'scale(0.98)' : 'scale(1)',
                letterSpacing: '0.3px'
              }}
              onMouseEnter={(e) => {
                if (!submitting) {
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 6px 20px rgba(142, 80, 34, 0.35)';
                }
              }}
              onMouseLeave={(e) => {
                if (!submitting) {
                  e.target.style.transform = 'scale(1)';
                  e.target.style.boxShadow = '0 4px 16px rgba(142, 80, 34, 0.25)';
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
