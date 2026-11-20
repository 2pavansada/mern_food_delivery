import React from 'react';
import './Testimonials.css';

const Testimonials = () => {
  const reviews = [
    {
      name: "Marcus Vance",
      role: "Verified Foodie • Downtown",
      rating: 5,
      comment: "BITEZY has completely changed my dinner routine! Food always arrives piping hot in under 25 minutes, and the Greek salad was restaurant perfection.",
      avatarBg: "#FFEDD5"
    },
    {
      name: "Priya Sharma",
      role: "Verified Foodie • Midtown",
      rating: 5,
      comment: "The UI is so snappy and intuitive. Quantity controls right on the food card make ordering for family dinners seamless. Highly recommend!",
      avatarBg: "#DCFCE7"
    },
    {
      name: "Alex Martinez",
      role: "Verified Foodie • Uptown",
      rating: 5,
      comment: "Best delivery experience in the city. The live order tracking timeline gave me confidence, and the Lasagna Rolls were unforgettable.",
      avatarBg: "#FEF3C7"
    }
  ];

  return (
    <section className="testimonials-section">
      <div className="testimonials-header">
        <span className="section-tag">Loved by Thousands</span>
        <h2 className="testimonials-title">What Our Customers Say</h2>
        <p className="testimonials-subtitle">
          Over 50,000 satisfied foodies trust BITEZY for breakfast, lunch, and late-night cravings.
        </p>
      </div>

      <div className="testimonials-grid">
        {reviews.map((r, index) => (
          <div key={index} className="testimonial-card">
            <div className="testimonial-stars">
              {"★".repeat(r.rating)}
            </div>
            <p className="testimonial-comment">"{r.comment}"</p>
            <div className="testimonial-author">
              <div 
                className="author-avatar" 
                style={{ backgroundColor: r.avatarBg }}
              >
                {r.name.charAt(0)}
              </div>
              <div className="author-meta">
                <h4 className="author-name">{r.name}</h4>
                <p className="author-role">{r.role}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Testimonials;
