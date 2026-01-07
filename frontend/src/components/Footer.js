import React from 'react';
import { Mail, Instagram, Phone } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Footer = () => {
  const navigate = useNavigate();

  const handleNavigate = (page) => {
    navigate(`/${page}`);
    window.scrollTo(0, 0);
  };

  return (
    <footer className="main-footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-col footer-col-logo">
            <img src="/static/images/gallery/whitelogo.png" alt="Basho" className="footer-logo" />
            <p className="footer-tagline">Handcrafted pottery inspired by Japanese philosophy.</p>
            <p className="footer-address">311, Silent Zone, Gavier, Dumas Road, Surat-395007</p>
          </div>
          <div className="footer-col footer-col-explore">
            <h4 className="footer-section-heading">Explore</h4>
            <ul className="footer-nav-list">
              <li><button onClick={() => handleNavigate('products')} className="footer-nav-link">Collections</button></li>
              <li><button onClick={() => handleNavigate('workshops')} className="footer-nav-link">Workshops</button></li>
              <li><button onClick={() => handleNavigate('studio')} className="footer-nav-link">Studio</button></li>
              <li><button onClick={() => handleNavigate('corporate')} className="footer-nav-link">Corporate</button></li>
              <li><button onClick={() => handleNavigate('media')} className="footer-nav-link">Media</button></li>
            </ul>
          </div>
          <div className="footer-col footer-col-connect">
            <h4 className="footer-section-heading">Connect</h4>
            <ul className="connect-list">
              <li>
                <a href="mailto:hello@bashobyshivangi.com" className="connect-link">
                  <Mail size={18} />
                  <span>Email Us</span>
                </a>
              </li>
              <li>
                <a href="https://www.instagram.com/bashobyyshivangi/" target="_blank" rel="noopener noreferrer" className="connect-link">
                  <Instagram size={18} />
                  <span>Instagram</span>
                </a>
              </li>
              <li>
                <a href="tel:+919879575601" className="connect-link">
                  <Phone size={18} />
                  <span>+91 98795 75601</span>
                </a>
              </li>
            </ul>
          </div>
          <div className="footer-col footer-col-image-right">
            <img src="/static/images/gallery/handmadewithlove.png" alt="Handmade with love" className="footer-handmade-image" />
          </div>
          <div className="footer-col footer-col-image">
            <img src="/static/images/gallery/topr.png" alt="" className="footer-top-right-image" />
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2025 Basho by Shivangi. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
