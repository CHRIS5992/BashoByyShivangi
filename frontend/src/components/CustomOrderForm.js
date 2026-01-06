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
    <section className="section-padding" id="custom">
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
          
          <div className="info-box">
            <h4>What We Offer</h4>
            <ul style={{listStyle: 'none', padding: 0}}>
              <li>✓ Custom tableware sets for homes and restaurants</li>
              <li>✓ Personalized gifts with names or messages</li>
              <li>✓ Corporate branding on pottery</li>
              <li>✓ Large-scale art installations</li>
              <li>✓ Wedding and event pottery</li>
            </ul>
          </div>
        </div>

        <div className="form-container">
          <form onSubmit={handleSubmit} className="fade-in">
            <h3>Request a Custom Order</h3>
            
            {message && (
              <div className="form-message" style={{
                padding: '1rem 1.2rem',
                marginBottom: '1.5rem',
                backgroundColor: message.includes('Success') ? '#d4edda' : '#f8d7da',
                color: message.includes('Success') ? '#155724' : '#721c24',
                borderRadius: '8px',
                textAlign: 'center',
                border: `2px solid ${message.includes('Success') ? '#c3e6cb' : '#f5c6cb'}`,
                fontWeight: 500
              }}>
                {message}
              </div>
            )}

            <div className="form-row">
              <div className="form-group">
                <label>Your Name *</label>
                <input 
                  type="text" 
                  name="name" 
                  value={formData.name}
                  onChange={handleChange}
                  required 
                  placeholder="Enter your name"
                />
              </div>
              <div className="form-group">
                <label>Email *</label>
                <input 
                  type="email" 
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required 
                  placeholder="your@email.com"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Phone Number *</label>
                <input 
                  type="tel" 
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required 
                  placeholder="+91 XXXXX XXXXX"
                />
              </div>
              <div className="form-group">
                <label>Project Type *</label>
                <select 
                  name="project_type"
                  value={formData.project_type}
                  onChange={handleChange}
                  required
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

            <div className="form-group">
              <label>Describe Your Vision *</label>
              <textarea 
                name="description"
                value={formData.description}
                onChange={handleChange}
                required 
                placeholder="Tell us about your custom pottery idea, including size, colors, quantity, and any specific requirements..."
              />
              <span className="form-helper">Be as detailed as possible</span>
            </div>

            <div className="form-group">
              <label>Budget Range (Optional)</label>
              <select 
                name="budget"
                value={formData.budget}
                onChange={handleChange}
              >
                <option value="">Select range</option>
                <option value="5000-10000">₹5,000 - ₹10,000</option>
                <option value="10000-25000">₹10,000 - ₹25,000</option>
                <option value="25000-50000">₹25,000 - ₹50,000</option>
                <option value="50000+">₹50,000+</option>
              </select>
            </div>

            <div className="form-group">
              <label>GST Number (Optional - for invoice)</label>
              <input 
                type="text" 
                name="gst_number"
                value={formData.gst_number}
                onChange={handleChange}
                placeholder="Enter GST number if applicable"
              />
            </div>

            <div className="form-group">
              <label>Reference Image (Optional)</label>
              <input 
                type="file" 
                accept="image/*"
                onChange={handleImageChange}
                style={{
                  padding: '0.8rem',
                  fontSize: '0.95rem'
                }}
              />
              <span className="form-helper">Upload a reference image or design inspiration (JPG, PNG)</span>
              {referenceImage && (
                <div style={{
                  marginTop: '0.5rem',
                  color: '#652810',
                  fontSize: '0.9rem',
                  fontWeight: 500
                }}>
                  ✓ Selected: {referenceImage.name}
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
                borderRadius: '8px',
                background: 'linear-gradient(135deg, #652810 0%, #8E5022 100%)',
                border: 'none',
                color: 'white',
                cursor: submitting ? 'not-allowed' : 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 12px rgba(101, 40, 16, 0.2)',
                opacity: submitting ? 0.7 : 1
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
