import React, { useState } from 'react';
import './PromoBanner.css';

const PromoBanner = () => {
  const [copied, setCopied] = useState(false);

  const copyCode = () => {
    navigator.clipboard.writeText('BITEZY30');
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="promo-banner">
      <div className="promo-banner-content">
        <div className="promo-pill">LIMITED TIME OFFER</div>
        <h3 className="promo-title">Get 30% OFF Your First BITEZY Order!</h3>
        <p className="promo-subtitle">
          Treat yourself to your favorite meals today. Use voucher code at checkout.
        </p>
      </div>

      <div className="promo-action">
        <div className="promo-code-box">
          <span className="code-text">BITEZY30</span>
          <button 
            type="button" 
            className="copy-btn" 
            onClick={copyCode}
            aria-label="Copy promo code"
          >
            {copied ? '✓ Copied!' : 'Copy Code'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PromoBanner;
