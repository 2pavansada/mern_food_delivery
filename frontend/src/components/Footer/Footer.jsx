import React from 'react';
import './Footer.css';
import { assets } from '../../assets/assets';
import BitezyLogo from '../BitezyLogo/BitezyLogo';
import { Link } from 'react-router-dom';

const Footer = () => {
  const adminUrl = import.meta.env.VITE_ADMIN_URL || (import.meta.env.DEV ? 'http://localhost:5174' : '/admin');
  return (
    <footer className="footer-wrapper" id="footer">
      <div className="footer-container">
        <div className="footer-grid">
          {/* Brand Info */}
          <div className="footer-col brand-col">
            <BitezyLogo size="md" theme="light" showTagline={true} />
            <p className="footer-tagline-text">
              <strong>Good food. Great mood.</strong> We are on a mission to deliver delicious meals from the most loved local kitchens straight to your doorstep in minutes.
            </p>
            <div className="footer-social-links">
              <a href="#facebook" aria-label="Facebook" className="social-pill" onClick={(e) => e.preventDefault()}>
                <img src={assets.facebook_icon} alt="Facebook" />
              </a>
              <a href="#twitter" aria-label="Twitter" className="social-pill" onClick={(e) => e.preventDefault()}>
                <img src={assets.twitter_icon} alt="Twitter" />
              </a>
              <a href="#linkedin" aria-label="LinkedIn" className="social-pill" onClick={(e) => e.preventDefault()}>
                <img src={assets.linkedin_icon} alt="LinkedIn" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="footer-col">
            <h4 className="footer-heading">Explore</h4>
            <ul className="footer-links">
              <li><Link to="/">Home</Link></li>
              <li><a href="#explore-menu">Food Categories</a></li>
              <li><a href="#food-display">Popular Dishes</a></li>
              <li><a href="#why-bitezy">Why Choose BITEZY</a></li>
              <li><Link to="/cart">My Cart</Link></li>
              <li><a href={adminUrl} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--primary-orange, #F97316)', fontWeight: '700' }}>⚙️ Admin Portal</a></li>
            </ul>
          </div>

          {/* Cuisines */}
          <div className="footer-col">
            <h4 className="footer-heading">Cuisines</h4>
            <ul className="footer-links">
              <li><a href="#explore-menu">Mediterranean Salads</a></li>
              <li><a href="#explore-menu">Artisan Rolls</a></li>
              <li><a href="#explore-menu">Italian Pastas</a></li>
              <li><a href="#explore-menu">Hearty Sandwiches</a></li>
              <li><a href="#explore-menu">Artisan Desserts</a></li>
            </ul>
          </div>

          {/* Contact & Hours */}
          <div className="footer-col contact-col">
            <h4 className="footer-heading">Get in Touch</h4>
            <ul className="footer-contact-info">
              <li>
                <span className="contact-icon">📞</span>
                <span>+1 (800) 555-BITE (2483)</span>
              </li>
              <li>
                <span className="contact-icon">✉️</span>
                <span>support@bitezy.com</span>
              </li>
              <li>
                <span className="contact-icon">📍</span>
                <span>450 Market Street, San Francisco, CA</span>
              </li>
              <li>
                <span className="contact-icon">🕒</span>
                <span>Mon – Sun: 8:00 AM – Midnight</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="footer-divider"></div>

        <div className="footer-bottom">
          <p className="footer-copyright">
            Copyright &copy; 2026 BITEZY Inc. All rights reserved. Good food. Great mood.
          </p>
          <div className="footer-legal">
            <a href="#privacy" onClick={(e) => e.preventDefault()}>Privacy Policy</a>
            <span>•</span>
            <a href="#terms" onClick={(e) => e.preventDefault()}>Terms of Service</a>
            <span>•</span>
            <a href="#cookies" onClick={(e) => e.preventDefault()}>Cookie Settings</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
