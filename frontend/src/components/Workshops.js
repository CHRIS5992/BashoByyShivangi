import React, { useState, useEffect } from 'react';
import './Workshops.css';

const Workshops = () => {
  const [workshops, setWorkshops] = useState([]);
  const [filteredWorkshops, setFilteredWorkshops] = useState([]);
  const [selectedType, setSelectedType] = useState('all');
  const [selectedWorkshop, setSelectedWorkshop] = useState(null);
  const [showRegistrationForm, setShowRegistrationForm] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWorkshops();
  }, []);

  useEffect(() => {
    filterWorkshops();
  }, [selectedType, workshops]);

  // Scroll animation for floating images
  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, observerOptions);

    const floatingImages = document.querySelectorAll('.floating-image');
    floatingImages.forEach(img => observer.observe(img));

    return () => {
      floatingImages.forEach(img => observer.unobserve(img));
    };
  }, []);

  const fetchWorkshops = async () => {
    try {
      const response = await fetch('/api/workshops/');
      const data = await response.json();
      setWorkshops(data.results || data);
      setFilteredWorkshops(data.results || data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching workshops:', error);
      setLoading(false);
    }
  };

  const filterWorkshops = () => {
    if (selectedType === 'all') {
      setFilteredWorkshops(workshops);
    } else {
      setFilteredWorkshops(workshops.filter(w => w.workshop_type === selectedType));
    }
  };

  const handleWorkshopClick = (workshop) => {
    setSelectedWorkshop(workshop);
  };

  const handleRegisterClick = (workshop) => {
    setSelectedWorkshop(workshop);
    setShowRegistrationForm(true);
  };

  const WorkshopCard = ({ workshop }) => (
    <div className="workshop-card" onClick={() => handleWorkshopClick(workshop)}>
      <div className="workshop-image">
        {workshop.image_url ? (
          <img src={workshop.image_url} alt={workshop.name} />
        ) : (
          <div className="workshop-placeholder">
            <span className="workshop-icon">🎨</span>
          </div>
        )}
        {workshop.is_featured && <span className="workshop-badge featured">Featured</span>}
        {workshop.is_popular && <span className="workshop-badge popular">Popular</span>}
      </div>
      <div className="workshop-content">
        <h3>{workshop.name}</h3>
        <p className="workshop-type">{workshop.workshop_type_display}</p>
        <p className="workshop-description">{workshop.short_description}</p>
        <div className="workshop-info">
          <span className="workshop-duration">⏱️ {workshop.duration_hours}h</span>
          <span className="workshop-difficulty">📊 {workshop.difficulty_level_display}</span>
          <span className="workshop-participants">👥 Max {workshop.max_participants}</span>
        </div>
        <div className="workshop-footer">
          <span className="workshop-price">₹{workshop.price}</span>
          <span className="workshop-availability">
            {workshop.available_slots > 0 ? `${workshop.available_slots} slots` : 'Sold Out'}
          </span>
        </div>
        <button 
          className="workshop-register-btn"
          onClick={(e) => {
            e.stopPropagation();
            handleRegisterClick(workshop);
          }}
          disabled={workshop.available_slots === 0}
        >
          {workshop.available_slots > 0 ? 'Register Now' : 'Fully Booked'}
        </button>
      </div>
    </div>
  );

  const WorkshopDetails = ({ workshop, onClose }) => {
    const features = [];
    if (workshop.includes_materials) features.push('Materials Included');
    if (workshop.includes_refreshments) features.push('Refreshments');
    if (workshop.takes_home_creation) features.push('Take Home Your Creation');

    return (
      <div className="workshop-modal-overlay" onClick={onClose}>
        <div className="workshop-modal" onClick={(e) => e.stopPropagation()}>
          <button className="modal-close" onClick={onClose}>×</button>
          <div className="modal-content">
            <div className="modal-image">
              {workshop.image_url ? (
                <img src={workshop.image_url} alt={workshop.name} />
              ) : (
                <div className="workshop-placeholder-large">
                  <span className="workshop-icon">🎨</span>
                </div>
              )}
            </div>
            <div className="modal-info">
              <h2>{workshop.name}</h2>
              <p className="modal-type">{workshop.workshop_type_display}</p>
              <div className="modal-price">₹{workshop.price}</div>
              <p className="modal-description">{workshop.description}</p>
              
              <div className="modal-details-grid">
                <div className="detail-item">
                  <strong>Duration:</strong> {workshop.duration_hours} hours
                </div>
                <div className="detail-item">
                  <strong>Level:</strong> {workshop.difficulty_level_display}
                </div>
                <div className="detail-item">
                  <strong>Max Participants:</strong> {workshop.max_participants}
                </div>
                <div className="detail-item">
                  <strong>Min Age:</strong> {workshop.min_age} years
                </div>
              </div>

              {features.length > 0 && (
                <div className="modal-features">
                  <h3>What's Included:</h3>
                  <ul>
                    {features.map((feature, idx) => (
                      <li key={idx}>✓ {feature}</li>
                    ))}
                  </ul>
                </div>
              )}

              <button 
                className="modal-register-btn"
                onClick={() => {
                  onClose();
                  handleRegisterClick(workshop);
                }}
                disabled={workshop.available_slots === 0}
              >
                {workshop.available_slots > 0 ? 'Register for this Workshop' : 'Fully Booked'}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const RegistrationForm = ({ workshop, onClose }) => {
    const [formData, setFormData] = useState({
      workshop: workshop.id,
      full_name: '',
      email: '',
      phone: '',
      number_of_participants: 1,
      special_requests: '',
      experience_level: ''
    });
    const [submitting, setSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e) => {
      e.preventDefault();
      setSubmitting(true);

      try {
        const response = await fetch('/api/registrations/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData)
        });

        if (response.ok) {
          setSuccess(true);
          setTimeout(() => {
            onClose();
            fetchWorkshops(); // Refresh to update available slots
          }, 2000);
        } else {
          const error = await response.json();
          alert(JSON.stringify(error));
        }
      } catch (error) {
        console.error('Error submitting registration:', error);
        alert('Failed to submit registration. Please try again.');
      } finally {
        setSubmitting(false);
      }
    };

    const handleChange = (e) => {
      setFormData({
        ...formData,
        [e.target.name]: e.target.value
      });
    };

    if (success) {
      return (
        <div className="workshop-modal-overlay" onClick={onClose}>
          <div className="workshop-modal registration-success" onClick={(e) => e.stopPropagation()}>
            <div className="success-message">
              <div className="success-icon">✓</div>
              <h2>Registration Successful!</h2>
              <p>You will receive a confirmation email shortly.</p>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="workshop-modal-overlay" onClick={onClose}>
        <div className="workshop-modal registration-form" onClick={(e) => e.stopPropagation()}>
          <button className="modal-close" onClick={onClose}>×</button>
          <h2>Register for {workshop.name}</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Full Name *</label>
              <input
                type="text"
                name="full_name"
                required
                value={formData.full_name}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Email *</label>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Phone *</label>
              <input
                type="tel"
                name="phone"
                required
                value={formData.phone}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Number of Participants *</label>
              <input
                type="number"
                name="number_of_participants"
                min="1"
                max={workshop.max_participants}
                required
                value={formData.number_of_participants}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Experience Level</label>
              <select
                name="experience_level"
                value={formData.experience_level}
                onChange={handleChange}
              >
                <option value="">Select your experience</option>
                <option value="beginner">Complete Beginner</option>
                <option value="some">Some Experience</option>
                <option value="experienced">Experienced</option>
              </select>
            </div>

            <div className="form-group">
              <label>Special Requests</label>
              <textarea
                name="special_requests"
                rows="3"
                value={formData.special_requests}
                onChange={handleChange}
                placeholder="Any special requirements or questions?"
              />
            </div>

            <div className="form-total">
              <strong>Total Amount:</strong> ₹{workshop.price * formData.number_of_participants}
            </div>

            <button type="submit" className="submit-btn" disabled={submitting}>
              {submitting ? 'Submitting...' : 'Complete Registration'}
            </button>
          </form>
        </div>
      </div>
    );
  };

  if (loading) {
    return <div className="workshops-loading">Loading workshops...</div>;
  }

  return (
    <div className="workshops-page">
      {/* HEADER - 1/3 screen with pattern and Japanese text */}
      <header className="workshops-header" style={{ backgroundImage: "linear-gradient(90deg, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0) 50%, rgba(0,0,0,0.8) 100%), url('/static/images/gallery/pattern-brown.jpg.png')" }}>
        <h1>
          <span className="japanese-accent">ワークショップ</span>
          Pottery Workshops & Experiences
        </h1>
        <p>Create, Learn, and Connect Through the Art of Pottery</p>
      </header>

      {/* DESCRIPTION SECTION - Clean centered text */}
      <section className="workshops-description-section">
        <div className="workshops-description-center">
          <p style={{ fontSize: '1.4rem', color: '#442D1C', fontWeight: 500, lineHeight: 1.7, maxWidth: '800px', margin: '0 auto' }}>
            At Basho, our workshops and experiences invite you to slow down and engage with clay in its most honest form. Guided by skilled artisans, each session blends hands-on learning with thoughtful design — creating spaces where individuals, couples, and groups come together to explore pottery, understand the craft, and create meaningful pieces through shared experience.
          </p>
        </div>
      </section>

      {/* WORKSHOPS LIST SECTION - With artistic floating images */}
      <section className="workshops-list-section">
        {/* Artistic floating images that appear on scroll */}
        <img src="/static/images/gallery/Workshop Pieces (1).png" alt="Workshop Piece 1" className="floating-image floating-image-1" data-scroll="fade-in" />
        <img src="/static/images/gallery/Workshop Pieces (2).png" alt="Workshop Piece 2" className="floating-image floating-image-2" data-scroll="fade-in" />
        <img src="/static/images/gallery/Workshop Pieces (3).png" alt="Workshop Piece 3" className="floating-image floating-image-3" data-scroll="fade-in" />
        <img src="/static/images/gallery/Workshop Pieces (4).png" alt="Workshop Piece 4" className="floating-image floating-image-4" data-scroll="fade-in" />
        <img src="/static/images/gallery/Workshop Pieces (5).png" alt="Workshop Piece 5" className="floating-image floating-image-5" data-scroll="fade-in" />
        <img src="/static/images/gallery/Workshop Pieces (6).png" alt="Workshop Piece 6" className="floating-image floating-image-6" data-scroll="fade-in" />
        <img src="/static/images/gallery/Workshop Pieces (7).png" alt="Workshop Piece 7" className="floating-image floating-image-7" data-scroll="fade-in" />
        <img src="/static/images/gallery/Workshop Pieces (8).png" alt="Workshop Piece 8" className="floating-image floating-image-8" data-scroll="fade-in" />
        <img src="/static/images/gallery/Workshop Pieces (9).png" alt="Workshop Piece 9" className="floating-image floating-image-9" data-scroll="fade-in" />
        
        <div className="workshops-list-content">
        <div className="workshops-filter">
          <button
            className={selectedType === 'all' ? 'active' : ''}
            onClick={() => setSelectedType('all')}
          >
            All Workshops
          </button>
          <button
            className={selectedType === 'group' ? 'active' : ''}
            onClick={() => setSelectedType('group')}
          >
            Group Workshops
          </button>
          <button
            className={selectedType === 'one-on-one' ? 'active' : ''}
            onClick={() => setSelectedType('one-on-one')}
          >
            One-on-One
          </button>
          <button
            className={selectedType === 'couple' ? 'active' : ''}
            onClick={() => setSelectedType('couple')}
          >
            Couple Dates
          </button>
          <button
            className={selectedType === 'birthday' ? 'active' : ''}
            onClick={() => setSelectedType('birthday')}
          >
            Birthday Parties
          </button>
          <button
            className={selectedType === 'party' ? 'active' : ''}
            onClick={() => setSelectedType('party')}
          >
            Mini Parties
          </button>
        </div>

        <div className="workshops-grid">
          {filteredWorkshops.map(workshop => (
            <WorkshopCard key={workshop.id} workshop={workshop} />
          ))}
        </div>

        {filteredWorkshops.length === 0 && (
          <div className="no-workshops">
            <p>No workshops available in this category.</p>
          </div>
        )}
        </div>
      </section>

      {selectedWorkshop && !showRegistrationForm && (
        <WorkshopDetails
          workshop={selectedWorkshop}
          onClose={() => setSelectedWorkshop(null)}
        />
      )}

      {showRegistrationForm && selectedWorkshop && (
        <RegistrationForm
          workshop={selectedWorkshop}
          onClose={() => {
            setShowRegistrationForm(false);
            setSelectedWorkshop(null);
          }}
        />
      )}
    </div>
  );
};

export default Workshops;
