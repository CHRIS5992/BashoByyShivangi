import React, { useState, useEffect, useCallback } from 'react';
import { Gauge, Users, ChartBar } from 'lucide-react';
import { useCart } from '../context/CartContext';
import './Workshops.css';

const Workshops = () => {
  const [workshops, setWorkshops] = useState([]);
  const [filteredWorkshops, setFilteredWorkshops] = useState([]);
  const [selectedType, setSelectedType] = useState('all');
  const [selectedWorkshop, setSelectedWorkshop] = useState(null);
  const [showRegistrationForm, setShowRegistrationForm] = useState(false);
  const [loading, setLoading] = useState(true);

  const filterWorkshops = useCallback(() => {
    if (selectedType === 'all') {
      setFilteredWorkshops(workshops);
    } else {
      setFilteredWorkshops(workshops.filter(w => w.workshop_type === selectedType));
    }
  }, [selectedType, workshops]);

  useEffect(() => {
    fetchWorkshops();
  }, []);

  useEffect(() => {
    filterWorkshops();
  }, [filterWorkshops]);

  // Fetch workshops on mount
  useEffect(() => {
    fetchWorkshops();
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

  const handleWorkshopClick = (workshop) => {
    setSelectedWorkshop(workshop);
  };

  const handleRegisterClick = (workshop) => {
    setSelectedWorkshop(workshop);
    setShowRegistrationForm(true);
  };

  const WorkshopCard = ({ workshop }) => (
    <div 
      className="workshop-card" 
      onClick={() => handleWorkshopClick(workshop)}
      style={{
        backgroundImage: workshop.image_url ? `url(${workshop.image_url})` : 'none'
      }}
    >
      <div className="workshop-card-overlay"></div>
      {!workshop.image_url && (
        <div className="workshop-placeholder-bg">
          <span className="workshop-icon">🎨</span>
        </div>
      )}
      {workshop.is_featured && <span className="workshop-badge featured">Featured</span>}
      {workshop.is_popular && <span className="workshop-badge popular">Popular</span>}
      
      <div className="workshop-content">
        <div className="workshop-content-top">
          <h3>{workshop.name}</h3>
          <p className="workshop-type">{workshop.workshop_type_display}</p>
        </div>
        
        <div className="workshop-content-bottom">
          <p className="workshop-description">{workshop.short_description}</p>
          <div className="workshop-info">
            <span className="workshop-duration">
              <Gauge color="#EDD8B4" strokeWidth={2.5} size={16} /> {workshop.duration_hours}h
            </span>
            <span className="workshop-difficulty">
              <ChartBar color="#EDD8B4" strokeWidth={2.5} size={16} /> {workshop.difficulty_level_display}
            </span>
            <span className="workshop-participants">
              <Users color="#EDD8B4" strokeWidth={2.5} size={16} /> Max {workshop.max_participants}
            </span>
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
            <span className="button_top">
              {workshop.available_slots > 0 ? 'Register Now' : 'Fully Booked'}
            </span>
          </button>
        </div>
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
    const { addToCart } = useCart();
    const [availableSlots, setAvailableSlots] = useState([]);
    const [loadingSlots, setLoadingSlots] = useState(true);
    const [formData, setFormData] = useState({
      workshop: workshop.id,
      full_name: '',
      email: '',
      phone: '',
      number_of_participants: 1,
      special_requests: '',
      experience_level: '',
      slot: ''
    });
    const [success, setSuccess] = useState(false);

    // Helper function to format time without seconds
    const formatTime = (timeString) => {
      if (!timeString) return '';
      // timeString is in format "HH:MM:SS", extract only "HH:MM"
      return timeString.substring(0, 5);
    };

    // Fetch available slots when component mounts
    useEffect(() => {
      const fetchSlots = async () => {
        try {
          const response = await fetch(`/api/workshops/${workshop.id}/slots/`);
          const data = await response.json();
          setAvailableSlots(data);
        } catch (error) {
          console.error('Error fetching slots:', error);
        } finally {
          setLoadingSlots(false);
        }
      };
      fetchSlots();
    }, [workshop.id]);

    const handleSubmit = async (e) => {
      e.preventDefault();
      
      // Validate slot selection
      if (!formData.slot) {
        alert('Please select a date and time slot');
        return;
      }

      const selectedSlot = availableSlots.find(slot => slot.id === parseInt(formData.slot));
      if (!selectedSlot) {
        alert('Invalid slot selected');
        return;
      }

      // Add workshop to cart
      const workshopCartItem = {
        type: 'workshop',
        id: workshop.id,
        workshopId: workshop.workshop_id,
        name: workshop.name,
        price: workshop.price,
        quantity: formData.number_of_participants,
        slotId: selectedSlot.id,
        slotDate: selectedSlot.date,
        slotStartTime: selectedSlot.start_time,
        slotEndTime: selectedSlot.end_time,
        participantName: formData.full_name,
        participantEmail: formData.email,
        participantPhone: formData.phone,
        specialRequests: formData.special_requests,
        experienceLevel: formData.experience_level,
        image_url_full: workshop.image_url
      };

      addToCart(workshopCartItem);
      setSuccess(true);
      
      setTimeout(() => {
        onClose();
      }, 1500);
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
              <h2>Added to Cart!</h2>
              <p>Workshop registration has been added to your cart.</p>
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
              <label>Select Date & Time Slot *</label>
              {loadingSlots ? (
                <p>Loading available slots...</p>
              ) : availableSlots.length > 0 ? (
                <select
                  name="slot"
                  required
                  value={formData.slot}
                  onChange={handleChange}
                >
                  <option value="">-- Select a time slot --</option>
                  {availableSlots.map((slot) => (
                    <option key={slot.id} value={slot.id}>
                      {new Date(slot.date).toLocaleDateString('en-IN', { 
                        weekday: 'short', 
                        year: 'numeric', 
                        month: 'short', 
                        day: 'numeric' 
                      })} - {formatTime(slot.start_time)} to {formatTime(slot.end_time)} ({slot.available_spots} spots left)
                    </option>
                  ))}
                </select>
              ) : (
                <p style={{color: '#d32f2f', marginTop: '0.5rem'}}>No available slots at the moment. Please check back later.</p>
              )}
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
              <strong>Total Amount:</strong> ₹{(workshop.price * formData.number_of_participants).toLocaleString('en-IN')}
            </div>

            <button 
              type="submit" 
              className="submit-btn" 
              disabled={availableSlots.length === 0}
            >
              Add to Cart
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
        <h1 className="funnel-title">
          <span className="japanese-accent">ワークショップ</span>
          Pottery Workshops & Experiences
        </h1>
        <p>Create, Learn, and Connect Through the Art of Pottery</p>
      </header>

      {/* WORKSHOPS LIST SECTION */}
      <section className="workshops-list-section">
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

      {/* DESCRIPTION SECTION - Clean centered text */}
      <section className="workshops-description-section">
        <div className="workshops-description-center">
          <p style={{ fontSize: '1.4rem', color: '#442D1C', fontWeight: 400, lineHeight: 1.8, maxWidth: '800px', margin: '0 auto', fontFamily: "'Cormorant Garamond', 'Noto Serif JP', Georgia, serif", fontStyle: 'italic', letterSpacing: '0.3px' }}>
            At Basho, our workshops and experiences invite you to slow down and engage with clay in its most honest form. Guided by skilled artisans, each session blends hands-on learning with thoughtful design — creating spaces where individuals, couples, and groups come together to explore pottery, understand the craft, and create meaningful pieces through shared experience.
          </p>
        </div>
      </section>

      {/* PAST CREATIONS SECTION - Infinite Scroll */}
      <section className="past-creations-section">
        <h2 className="past-creations-title">
          <span className="japanese-accent">過去の作品</span>
          Our Past Creations
        </h2>
        <div className="infinite-scroll-container">
          <div className="infinite-scroll-track">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15].map((num) => (
              <div key={`set1-${num}`} className="scroll-item">
                <img 
                  src={`/static/images/gallery/past-creations-${num}.png`} 
                  alt={`Past Creation ${num}`}
                />
              </div>
            ))}
            {/* Duplicate for seamless loop */}
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15].map((num) => (
              <div key={`set2-${num}`} className="scroll-item">
                <img 
                  src={`/static/images/gallery/past-creations-${num}.png`} 
                  alt={`Past Creation ${num}`}
                />
              </div>
            ))}
          </div>
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
