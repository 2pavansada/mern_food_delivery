import React, { useContext, useState } from "react";
import "./FoodItem.css";
import { StoreContext } from '../context/StoreContext';
import { assets } from "../../assets/assets";

const FoodItem = ({ id, name, price, description, image, category }) => {
  const { cartItems, addToCart, removeFromCart, getImageUrl } = useContext(StoreContext);
  const [imgSrc, setImgSrc] = useState(getImageUrl ? getImageUrl(image) : image);

  const itemCount = cartItems ? cartItems[id] || 0 : 0;

  const handleImageError = () => {
    // If backend image or custom image fails to load, gracefully fallback to default appetizing dish
    setImgSrc(assets.food_1);
  };

  return (
    <div className="food-card">
      <div className="food-card-img-wrapper">
        <img
          src={imgSrc}
          className="food-card-img"
          alt={name}
          loading="lazy"
          onError={handleImageError}
        />
        {category && (
          <span className="food-card-category-badge">{category}</span>
        )}

        {/* Floating Quick Add / Stepper */}
        <div className="food-card-action-overlay">
          {itemCount === 0 ? (
            <button
              className="quick-add-btn"
              onClick={() => addToCart(id)}
              aria-label={`Add ${name} to cart`}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
              <span>Add</span>
            </button>
          ) : (
            <div className="food-counter-pill">
              <button
                className="counter-btn minus"
                onClick={() => removeFromCart(id)}
                aria-label="Decrease quantity"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
              </button>
              <span className="counter-value">{itemCount}</span>
              <button
                className="counter-btn plus"
                onClick={() => addToCart(id)}
                aria-label="Increase quantity"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="5" x2="12" y2="19"></line>
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="food-card-body">
        <div className="food-card-header">
          <h3 className="food-card-title">{name}</h3>
          <div className="food-rating-stars">
            <span className="star-icon">★</span>
            <span className="rating-score">4.8</span>
          </div>
        </div>

        <p className="food-card-description">{description}</p>

        <div className="food-card-footer">
          <div className="food-card-price">
            <span className="currency">$</span>
            <span className="amount">{Number(price).toFixed(2)}</span>
          </div>
          {itemCount > 0 && (
            <span className="in-cart-indicator">
              In Cart ({itemCount})
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default FoodItem;
