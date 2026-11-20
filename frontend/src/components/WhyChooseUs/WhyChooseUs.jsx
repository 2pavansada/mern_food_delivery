import React from 'react';
import './WhyChooseUs.css';

const WhyChooseUs = () => {
  const features = [
    {
      icon: (
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
        </svg>
      ),
      title: "Under 30-Min Delivery",
      description: "Our smart route dispatch delivers your food sizzling hot while it's at peak freshness."
    },
    {
      icon: (
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
        </svg>
      ),
      title: "Curated Gourmet Chefs",
      description: "We partner with verified top kitchens and authentic local culinary artisans."
    },
    {
      icon: (
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <polyline points="12 6 12 12 14 14"></polyline>
        </svg>
      ),
      title: "Live GPS Tracking",
      description: "Watch your meal journey in real-time from the restaurant skillet straight to your door."
    },
    {
      icon: (
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
        </svg>
      ),
      title: "100% Sealed & Safe",
      description: "Tamper-proof thermal insulated packaging ensures maximum hygiene and safety."
    }
  ];

  return (
    <section className="why-bitezy-section" id="why-bitezy">
      <div className="why-header">
        <span className="section-tag">The BITEZY Promise</span>
        <h2 className="why-title">Why Foodies Love BITEZY</h2>
        <p className="why-subtitle">
          We bring high standard culinary experiences right to your dining table with speed, care, and reliability.
        </p>
      </div>

      <div className="why-grid">
        {features.map((f, index) => (
          <div key={index} className="why-card">
            <div className="why-icon-box">
              {f.icon}
            </div>
            <h3 className="why-card-title">{f.title}</h3>
            <p className="why-card-desc">{f.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default WhyChooseUs;
