import React from 'react';
import './Header.css';
import { assets } from '../../assets/assets';

const Header = () => {
  const scrollToMenu = () => {
    const el = document.getElementById('explore-menu');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToWhy = () => {
    const el = document.getElementById('why-bitezy');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="hero-section">
      <div className="hero-container">
        {/* Left Column: Headline & Action */}
        <div className="hero-content">
          <div className="hero-badge">
            <span className="badge-pulse"></span>
            <span className="badge-text">⚡ Sizzling Delivery • Under 30 Mins</span>
          </div>

          <h1 className="hero-title">
            Cravings? <br />
            <span className="hero-title-highlight">We've got you covered.</span>
          </h1>

          <p className="hero-subtitle">
            <strong>Good food. Great mood.</strong> Explore handcrafted dishes from top-rated kitchens, fresh local favorites, and chef specials delivered hot to your doorstep.
          </p>

          <div className="hero-actions">
            <button onClick={scrollToMenu} className="btn-primary hero-cta-btn">
              <span>Explore Menu</span>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </button>
            <button onClick={scrollToWhy} className="btn-secondary hero-learn-btn">
              Why BITEZY?
            </button>
          </div>

          {/* Social Proof / Stats */}
          <div className="hero-stats">
            <div className="hero-stat-item">
              <span className="stat-number">500+</span>
              <span className="stat-label">Dishes</span>
            </div>
            <div className="stat-divider"></div>
            <div className="hero-stat-item">
              <span className="stat-number">4.9 ★</span>
              <span className="stat-label">25k+ Reviews</span>
            </div>
            <div className="stat-divider"></div>
            <div className="hero-stat-item">
              <span className="stat-number">&lt; 30 min</span>
              <span className="stat-label">Fast Delivery</span>
            </div>
          </div>
        </div>

        {/* Right Column: Hero Visual Food Showcase */}
        <div className="hero-visual">
          <div className="hero-visual-backdrop"></div>
          
          <div className="hero-image-card main-dish">
            <img 
              src={assets.food_1} 
              alt="Greek salad with fresh greens and dressing" 
              className="hero-main-img" 
            />
            <div className="hero-dish-info">
              <span className="dish-tag">Chef's Choice</span>
              <h4 className="dish-name">Greek Feast Salad</h4>
              <p className="dish-price">$12.00</p>
            </div>
          </div>

          {/* Floating Pill: Delivery Time */}
          <div className="hero-floating-badge badge-delivery">
            <div className="floating-icon-circle delivery">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#22A06B" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12 6 12 12 16 14"></polyline>
              </svg>
            </div>
            <div>
              <p className="floating-label">Average Delivery</p>
              <p className="floating-value">22 - 28 mins</p>
            </div>
          </div>

          {/* Floating Pill: Customer Rating */}
          <div className="hero-floating-badge badge-rating">
            <div className="floating-icon-circle star">
              ★
            </div>
            <div>
              <p className="floating-label">Community Rating</p>
              <p className="floating-value">4.9 / 5.0 (50k+)</p>
            </div>
          </div>

          {/* Secondary Dish Accent */}
          <div className="hero-floating-dish secondary-dish">
            <img src={assets.food_4} alt="Chicken Salad" />
            <div className="secondary-dish-text">
              <p className="secondary-dish-name">Crisp Chicken Bowl</p>
              <span className="secondary-dish-price">$24.00</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Header;
