import React from 'react';
import './AppDownlaod.css';
import { assets } from '../../assets/assets';

const AppDownload = () => {
  return (
    <section className="app-download-section" id="app-download">
      <div className="app-download-card">
        <div className="app-download-content">
          <span className="app-pill">BITEZY ON THE GO</span>
          <h2 className="app-title">Faster Food. Zero Hassle.<br />Download the BITEZY App</h2>
          <p className="app-subtitle">
            Get instant access to live driver tracking, exclusive 30% off discounts, and seamless 1-tap checkout wherever you are.
          </p>

          <div className="app-features-list">
            <div className="app-feature-item">
              <span className="feature-check">✓</span>
              <span>Live Order Tracking with GPS</span>
            </div>
            <div className="app-feature-item">
              <span className="feature-check">✓</span>
              <span>App-Only Flash Discounts & Rewards</span>
            </div>
            <div className="app-feature-item">
              <span className="feature-check">✓</span>
              <span>Instant 1-Tap Reorder</span>
            </div>
          </div>

          <div className="app-download-platforms">
            <a href="#playstore" className="store-badge-link" onClick={(e) => e.preventDefault()}>
              <img src={assets.play_store} alt="Get it on Google Play" />
            </a>
            <a href="#appstore" className="store-badge-link" onClick={(e) => e.preventDefault()}>
              <img src={assets.app_store} alt="Download on the App Store" />
            </a>
          </div>
        </div>

        <div className="app-download-mockup">
          <div className="phone-mockup-frame">
            <div className="mockup-header-notch"></div>
            <div className="mockup-screen-content">
              <div className="mockup-logo-mini">BITEZY</div>
              <div className="mockup-dish-card">
                <div className="mockup-dish-badge">🚚 Out for delivery</div>
                <p className="mockup-dish-title">Greek Feast Salad</p>
                <div className="mockup-progress">
                  <div className="mockup-progress-fill"></div>
                </div>
                <p className="mockup-eta">Arriving in 12 mins</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AppDownload;
