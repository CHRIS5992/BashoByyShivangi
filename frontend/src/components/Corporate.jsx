import React, { useState } from 'react';
import './Corporate.css';
import './Workshops.css';

function Corporate() {
  const [formData, setFormData] = useState({
    company_name: '',
    contact_name: '',
    email: '',
    phone: '',
    service_type: '',
    team_size: '',
    message: '',
    budget_range: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage('');

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setMessage('Thank you! We\'ll get back to you within 24 hours.');
      setFormData({
        company_name: '',
        contact_name: '',
        email: '',
        phone: '',
        service_type: '',
        team_size: '',
        message: '',
        budget_range: ''
      });
    } catch (error) {
      setMessage('Error submitting inquiry. Please try again.');
      console.error('Inquiry submission error:', error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="corporate-page">
      {/* HEADER - 1/3 screen with pattern and Japanese text */}
      <header className="workshops-header" style={{ backgroundImage: "linear-gradient(90deg, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0) 50%, rgba(0,0,0,0.8) 100%), url('/static/images/gallery/pattern-brown.jpg.png')" }}>
        <h1 className="funnel-title">
          <span className="japanese-accent">法人</span>
          Corporate Services
        </h1>
        <p>Elevate Your Corporate Culture with Artisanal Excellence</p>
      </header>

      {/* Combined Quote and Services Section */}
      <section className="intro-quote" style={{ backgroundImage: 'url(/static/images/gallery/corporate-why.jpg)', backgroundSize: 'cover', backgroundPosition: 'center', backgroundBlendMode: 'overlay', backgroundColor: 'rgba(237, 216, 180, 0.87)', filter: 'contrast(1.05)', paddingBottom: '5rem' }}>
        <div className="quote-container" style={{ filter: 'contrast(0.952)' }}>
          <h2 className="quote-text">
            "We bridge traditional craftsmanship with modern business needs to create meaningful connections that last."
          </h2>
        </div>

        {/* Services Section */}
        <div className="container-new" style={{ marginTop: '3rem', filter: 'contrast(0.952)' }}>
          <div className="section-header-new">
            <h2 className="section-title-new">Our Offerings</h2>
            <p className="section-subtitle-new">Curated solutions designed to foster connection and appreciation.</p>
          </div>

          <div className="services-grid-new">
            {/* Service 1 */}
            <div className="service-card-new">
              <div className="service-icon-new">
                <span>🎁</span>
              </div>
              <div className="service-content-new">
                <h3 className="service-title-new">Corporate Gifting</h3>
                <p className="service-description-new">
                  Curated, sustainable gift boxes featuring handmade treasures that tell a story. Perfect for holidays and milestones.
                </p>
              </div>
              <div className="service-image-new">
                {/* TODO: Add corporate gifting image */}
                <div className="image-placeholder">Gift Box Image</div>
              </div>
            </div>

            {/* Service 2 */}
            <div className="service-card-new">
              <div className="service-icon-new">
                <span>👥</span>
              </div>
              <div className="service-content-new">
                <h3 className="service-title-new">Team Workshops</h3>
                <p className="service-description-new">
                  Immersive hands-on sessions in pottery, weaving, or painting to foster team creativity and mindfulness.
                </p>
              </div>
              <div className="service-image-new">
                <img src="/static/images/gallery/workshop-team.png" alt="Team Workshop" />
              </div>
            </div>

            {/* Service 3 */}
            <div className="service-card-new">
              <div className="service-icon-new">
                <span>🤝</span>
              </div>
              <div className="service-content-new">
                <h3 className="service-title-new">Brand Collaborations</h3>
                <p className="service-description-new">
                  Co-branded product lines that merge your corporate identity with our artisanal roots and aesthetics.
                </p>
              </div>
              <div className="service-image-new">
                <img src="/static/images/gallery/collaboration.png" alt="Brand Collaborations" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Artisanal Difference */}
      <section className="difference-section">
        {/* Pottery decorations for artisanal section */}
        <svg className="pottery-decor pottery-decor-1" width="110" height="150" viewBox="0 0 110 150" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M38 18 Q33 38, 38 58 L38 115 Q38 135, 55 135 Q72 135, 72 115 L72 58 Q77 38, 72 18 Q63 13, 55 13 Q47 13, 38 18 Z" stroke="#C85428" strokeWidth="2" opacity="0.15" fill="none"/>
          <ellipse cx="55" cy="18" rx="17" ry="5" stroke="#C85428" strokeWidth="1.5" opacity="0.12" fill="none"/>
        </svg>
        <svg className="pottery-decor pottery-decor-2" width="90" height="110" viewBox="0 0 90 110" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M18 38 Q18 75, 45 92 Q72 75, 72 38" stroke="#652810" strokeWidth="2" opacity="0.16" fill="none"/>
          <ellipse cx="45" cy="38" rx="27" ry="7" stroke="#652810" strokeWidth="1.5" opacity="0.13" fill="none"/>
        </svg>
        <svg className="pottery-decor pottery-decor-3" width="95" height="130" viewBox="0 0 95 130" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M28 18 L28 95 Q28 115, 47 115 Q66 115, 66 95 L66 18" stroke="#C85428" strokeWidth="2" opacity="0.14" fill="none"/>
          <ellipse cx="47" cy="18" rx="19" ry="5" stroke="#C85428" strokeWidth="1.5" opacity="0.11" fill="none"/>
        </svg>
        <svg className="pottery-decor pottery-decor-4" width="100" height="120" viewBox="0 0 100 120" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M30 28 Q25 48, 30 68 L30 95 Q30 105, 50 105 Q70 105, 70 95 L70 68 Q75 48, 70 28" stroke="#652810" strokeWidth="2" opacity="0.15" fill="none"/>
          <ellipse cx="50" cy="28" rx="20" ry="6" stroke="#652810" strokeWidth="1.5" opacity="0.12" fill="none"/>
        </svg>
        <svg className="pottery-decor pottery-decor-5" width="80" height="105" viewBox="0 0 80 105" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M23 28 L23 68 Q23 83, 40 83 Q57 83, 57 68 L57 28" stroke="#C85428" strokeWidth="1.8" opacity="0.13" fill="none"/>
          <ellipse cx="40" cy="28" rx="17" ry="5" stroke="#C85428" strokeWidth="1.5" opacity="0.11" fill="none"/>
        </svg>
        <svg className="pottery-decor pottery-decor-6" width="88" height="118" viewBox="0 0 88 118" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M28 38 Q26 53, 28 68 L28 88 Q28 98, 44 98 Q60 98, 60 88 L60 68 Q62 53, 60 38" stroke="#652810" strokeWidth="2" opacity="0.16" fill="none"/>
          <ellipse cx="44" cy="38" rx="16" ry="6" stroke="#652810" strokeWidth="1.5" opacity="0.13" fill="none"/>
        </svg>
        <svg className="pottery-decor pottery-decor-7" width="98" height="138" viewBox="0 0 98 138" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M33 23 L33 105 Q33 120, 49 120 Q65 120, 65 105 L65 23" stroke="#C85428" strokeWidth="2" opacity="0.14" fill="none"/>
          <ellipse cx="49" cy="23" rx="16" ry="6" stroke="#C85428" strokeWidth="1.5" opacity="0.12" fill="none"/>
        </svg>
        <svg className="pottery-decor pottery-decor-8" width="92" height="125" viewBox="0 0 92 125" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M34 20 Q29 40, 34 60 L34 95 Q34 110, 46 110 Q58 110, 58 95 L58 60 Q63 40, 58 20 Q52 15, 46 15 Q40 15, 34 20 Z" stroke="#652810" strokeWidth="2" opacity="0.15" fill="none"/>
          <ellipse cx="46" cy="20" rx="12" ry="5" stroke="#652810" strokeWidth="1.5" opacity="0.12" fill="none"/>
        </svg>
        <svg className="pottery-decor pottery-decor-9" width="85" height="112" viewBox="0 0 85 112" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M30 25 Q28 40, 30 55 L30 80 Q30 90, 42 90 Q55 90, 55 80 L55 55 Q57 40, 55 25" stroke="#C85428" strokeWidth="2" opacity="0.14" fill="none"/>
          <ellipse cx="42" cy="25" rx="13" ry="5" stroke="#C85428" strokeWidth="1.5" opacity="0.11" fill="none"/>
        </svg>
        
        <div className="container-new">
          <div className="difference-header">
            <h2 className="section-title-new">The Artisanal Difference</h2>
            <button onClick={(e) => e.preventDefault()} className="view-impact" style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'inherit', textDecoration: 'none' }}>View Our Impact →</button>
          </div>

          <div className="difference-grid">
            <div className="difference-item">
              <div className="difference-image">
                <img src="/static/images/gallery/sustainble-materials.png" alt="Sustainable Materials" />
              </div>
              <h4 className="difference-title">Sustainable Sourcing</h4>
              <p className="difference-text">Ethically sourced materials that respect the earth.</p>
            </div>

            <div className="difference-item offset">
              <div className="difference-image">
                <img src="/static/images/gallery/artisan-crafting.png" alt="Artisan Crafting" />
              </div>
              <h4 className="difference-title">Handcrafted Quality</h4>
              <p className="difference-text">Every piece is unique, made by master artisans.</p>
            </div>

            <div className="difference-item">
              <div className="difference-image">
                <img src="/static/images/gallery/traditional-patterns.png" alt="Traditional Patterns" />
              </div>
              <h4 className="difference-title">Cultural Heritage</h4>
              <p className="difference-text">Preserving traditional techniques for modern times.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Inquiry Form */}
      <section className="inquiry-modern">
        {/* Pottery-shaped decorative SVG elements */}
        <svg className="japanese-decor japanese-decor-1" width="120" height="160" viewBox="0 0 120 160" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Vase shape */}
          <path d="M40 20 Q35 40, 40 60 L40 120 Q40 140, 60 140 Q80 140, 80 120 L80 60 Q85 40, 80 20 Q70 15, 60 15 Q50 15, 40 20 Z" stroke="#C85428" strokeWidth="2.5" opacity="0.25" fill="none"/>
          <ellipse cx="60" cy="20" rx="20" ry="5" stroke="#C85428" strokeWidth="2" opacity="0.2" fill="none"/>
        </svg>
        <svg className="japanese-decor japanese-decor-2" width="100" height="120" viewBox="0 0 100 120" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Bowl shape */}
          <path d="M20 40 Q20 80, 50 100 Q80 80, 80 40" stroke="#652810" strokeWidth="2.5" opacity="0.28" fill="none"/>
          <ellipse cx="50" cy="40" rx="30" ry="8" stroke="#652810" strokeWidth="2" opacity="0.22" fill="none"/>
        </svg>
        <svg className="japanese-decor japanese-decor-3" width="90" height="140" viewBox="0 0 90 140" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Narrow pot */}
          <path d="M30 20 L30 100 Q30 120, 45 120 Q60 120, 60 100 L60 20" stroke="#C85428" strokeWidth="2.5" opacity="0.22" fill="none"/>
          <ellipse cx="45" cy="20" rx="15" ry="5" stroke="#C85428" strokeWidth="2" opacity="0.18" fill="none"/>
        </svg>
        <svg className="japanese-decor japanese-decor-4" width="110" height="130" viewBox="0 0 110 130" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Wide jar */}
          <path d="M35 30 Q30 50, 35 70 L35 100 Q35 110, 55 110 Q75 110, 75 100 L75 70 Q80 50, 75 30" stroke="#652810" strokeWidth="2.5" opacity="0.25" fill="none"/>
          <ellipse cx="55" cy="30" rx="20" ry="6" stroke="#652810" strokeWidth="2" opacity="0.2" fill="none"/>
        </svg>
        <svg className="japanese-decor japanese-decor-5" width="85" height="110" viewBox="0 0 85 110" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Small cup */}
          <path d="M25 30 L25 70 Q25 85, 42 85 Q60 85, 60 70 L60 30" stroke="#C85428" strokeWidth="2.2" opacity="0.2" fill="none"/>
          <ellipse cx="42" cy="30" rx="18" ry="5" stroke="#C85428" strokeWidth="2" opacity="0.16" fill="none"/>
        </svg>
        <svg className="japanese-decor japanese-decor-6" width="95" height="125" viewBox="0 0 95 125" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Teapot shape */}
          <path d="M30 40 Q28 55, 30 70 L30 90 Q30 100, 47 100 Q65 100, 65 90 L65 70 Q67 55, 65 40" stroke="#652810" strokeWidth="2.5" opacity="0.24" fill="none"/>
          <ellipse cx="47" cy="40" rx="18" ry="6" stroke="#652810" strokeWidth="2" opacity="0.2" fill="none"/>
          <path d="M65 55 Q75 55, 75 65 Q75 75, 65 75" stroke="#652810" strokeWidth="2" opacity="0.2" fill="none"/>
        </svg>
        <svg className="japanese-decor japanese-decor-7" width="105" height="145" viewBox="0 0 105 145" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Tall cylinder */}
          <path d="M35 25 L35 110 Q35 125, 52 125 Q70 125, 70 110 L70 25" stroke="#C85428" strokeWidth="2.5" opacity="0.23" fill="none"/>
          <ellipse cx="52" cy="25" rx="18" ry="6" stroke="#C85428" strokeWidth="2" opacity="0.19" fill="none"/>
        </svg>
        <svg className="japanese-decor japanese-decor-9" width="100" height="135" viewBox="0 0 100 135" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Amphora */}
          <path d="M38 25 Q33 45, 38 65 L38 100 Q38 115, 50 115 Q62 115, 62 100 L62 65 Q67 45, 62 25 Q56 20, 50 20 Q44 20, 38 25 Z" stroke="#C85428" strokeWidth="2.5" opacity="0.24" fill="none"/>
          <ellipse cx="50" cy="25" rx="12" ry="5" stroke="#C85428" strokeWidth="2" opacity="0.2" fill="none"/>
        </svg>
        <svg className="japanese-decor japanese-decor-10" width="95" height="115" viewBox="0 0 95 115" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Rounded jar */}
          <path d="M32 30 Q30 45, 32 60 L32 85 Q32 95, 47 95 Q63 95, 63 85 L63 60 Q65 45, 63 30" stroke="#652810" strokeWidth="2.5" opacity="0.26" fill="none"/>
          <ellipse cx="47" cy="30" rx="16" ry="6" stroke="#652810" strokeWidth="2" opacity="0.21" fill="none"/>
        </svg>
        <svg className="japanese-decor japanese-decor-11" width="88" height="128" viewBox="0 0 88 128" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Sake bottle */}
          <path d="M36 22 L36 30 Q34 45, 36 60 L36 95 Q36 110, 44 110 Q52 110, 52 95 L52 60 Q54 45, 52 30 L52 22" stroke="#C85428" strokeWidth="2.5" opacity="0.23" fill="none"/>
          <ellipse cx="44" cy="22" rx="8" ry="4" stroke="#C85428" strokeWidth="2" opacity="0.19" fill="none"/>
        </svg>
        
        {/* DESCRIPTION SECTION - Above inquiry form */}
        <section className="workshops-description-section" style={{ paddingTop: '2rem', paddingBottom: '2rem', background: '#F5EFE7', margin: '0' }}>
          <div className="workshops-description-center">
            <p style={{ fontSize: '1.4rem', color: '#442D1C', fontWeight: 400, lineHeight: 1.8, maxWidth: '800px', margin: '0 auto', fontFamily: "'Cormorant Garamond', 'Noto Serif JP', Georgia, serif", fontStyle: 'italic', letterSpacing: '0.3px' }}>
              Bring the warmth of artisanal heritage to your team and clients through curated experiences, sustainable gifts, and meaningful collaborations. We bridge traditional craftsmanship with modern business needs to create connections that last.
            </p>
          </div>
        </section>
        
        <div className="container-new" style={{ marginTop: '4rem' }}>
          <div className="inquiry-card">
            {/* Form Side */}
            <div className="form-side">
              <div className="form-header-new">
                <span className="form-badge">Let's Collaborate</span>
                <h2 className="form-title-new">Start a Conversation</h2>
                <p className="form-subtitle-new">
                  Tell us about your team or project, and we'll craft a proposal tailored to your needs.
                </p>
              </div>

              {message && (
                <div className={`form-message ${message.includes('Thank you') ? 'success' : 'error'}`}>
                  {message}
                </div>
              )}

              <form onSubmit={handleSubmit} className="modern-form">
                <div className="form-row-new">
                  <div className="form-group-new">
                    <label htmlFor="contact_name">Full Name</label>
                    <input
                      type="text"
                      id="contact_name"
                      name="contact_name"
                      value={formData.contact_name}
                      onChange={handleChange}
                      placeholder="Jane Doe"
                      required
                    />
                  </div>
                  <div className="form-group-new">
                    <label htmlFor="company_name">Company Name</label>
                    <input
                      type="text"
                      id="company_name"
                      name="company_name"
                      value={formData.company_name}
                      onChange={handleChange}
                      placeholder="Acme Inc."
                      required
                    />
                  </div>
                </div>

                <div className="form-group-new">
                  <label htmlFor="email">Work Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="jane@acme.com"
                    required
                  />
                </div>

                <div className="form-group-new">
                  <label htmlFor="service_type">Interested Service</label>
                  <select
                    id="service_type"
                    name="service_type"
                    value={formData.service_type}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select a service</option>
                    <option value="gifting">Corporate Gifting</option>
                    <option value="workshop">Team Workshop</option>
                    <option value="collaboration">Brand Collaboration</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div className="form-group-new">
                  <label htmlFor="message">Message</label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Tell us more about your requirements..."
                    rows="4"
                    required
                  ></textarea>
                </div>

                <button type="submit" className="submit-btn-new" disabled={submitting}>
                  {submitting ? 'Sending...' : 'Submit Inquiry'}
                </button>
              </form>
            </div>

            {/* Testimonial Side */}
            <div className="testimonial-side">
              <div className="testimonial-overlay" style={{ backgroundImage: 'url(/static/images/gallery/testimonial-bg.png)' }}>
                <div className="testimonial-content">
                  <span className="quote-mark">"</span>
                  <p className="testimonial-text">
                    "The pottery workshop was the highlight of our annual retreat. It brought the team together in a way that standard corporate activities never have."
                  </p>
                  <div className="testimonial-author">
                    <div className="author-avatar">
                      {/* TODO: Add author image */}
                    </div>
                    <div className="author-info">
                      <p className="author-name">Shivangi</p>
                      <p className="author-title">HR Director, Studio Tech</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Corporate;
