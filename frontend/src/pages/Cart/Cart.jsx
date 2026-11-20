import React, { useContext, useState } from 'react';
import './Cart.css';
import { StoreContext } from '../../components/context/StoreContext';
import { useNavigate, Link } from 'react-router-dom';
import { assets } from '../../assets/assets';

const Cart = ({ setShowLogin }) => {
  const {
    cartItems,
    food_list,
    removeFromCart,
    addToCart,
    getTotalCartAmount,
    getTotalCartCount,
    getImageUrl,
    token,
    promoCode,
    discountPercent,
    applyPromoCode,
    removePromoCode
  } = useContext(StoreContext);

  const [inputCode, setInputCode] = useState('');
  const [promoFeedback, setPromoFeedback] = useState(null);

  const navigate = useNavigate();

  const handleCheckout = () => {
    if (!token) {
      setShowLogin(true);
    } else if (getTotalCartAmount() === 0) {
      alert("Your cart is empty. Please add items to your cart before checking out.");
    } else {
      navigate('/order');
    }
  };

  const handleApplyCode = (e) => {
    e.preventDefault();
    if (!inputCode.trim()) return;
    const res = applyPromoCode(inputCode);
    setPromoFeedback(res);
  };

  const subtotal = getTotalCartAmount();
  const deliveryFee = subtotal === 0 ? 0 : 2;
  const discountAmount = discountPercent > 0 ? (subtotal * discountPercent) / 100 : 0;
  const grandTotal = Math.max(0, subtotal - discountAmount + deliveryFee);
  const totalCount = getTotalCartCount ? getTotalCartCount() : 0;

  // Filter items in cart
  const itemsInCart = (food_list || []).filter((item) => cartItems && cartItems[item._id] > 0);

  if (itemsInCart.length === 0) {
    return (
      <div className="cart-empty-page">
        <div className="cart-empty-card">
          <div className="cart-empty-icon">🛒</div>
          <h2 className="cart-empty-title">Your BITEZY Cart is Empty</h2>
          <p className="cart-empty-subtitle">
            Looks like you haven't added any appetizing dishes yet. Explore our freshly prepared menu and find your next craving!
          </p>
          <Link to="/" className="btn-primary cart-empty-btn">
            Explore Delicious Dishes
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page-wrapper">
      <div className="cart-header-title">
        <h1 className="page-heading">Your Order Cart</h1>
        <p className="page-subheading">Review your selected meals and proceed to secure checkout.</p>
      </div>

      <div className="cart-layout-grid">
        {/* Left Column: Items List */}
        <div className="cart-items-column">
          <div className="cart-items-card">
            <div className="cart-table-head">
              <span className="col-dish">Dish</span>
              <span className="col-price">Price</span>
              <span className="col-qty">Quantity</span>
              <span className="col-total">Total</span>
              <span className="col-action"></span>
            </div>

            <div className="cart-items-body">
              {itemsInCart.map((item) => {
                const qty = cartItems[item._id];
                const imgSrc = getImageUrl ? getImageUrl(item.image) : item.image;
                const itemTotal = (item.price * qty).toFixed(2);

                return (
                  <div key={item._id} className="cart-item-row">
                    {/* Food thumbnail & name */}
                    <div className="item-info-cell">
                      <img
                        src={imgSrc}
                        alt={item.name}
                        className="item-thumbnail"
                        onError={(e) => { e.target.src = assets.food_1; }}
                      />
                      <div className="item-details">
                        <h4 className="item-name">{item.name}</h4>
                        <span className="item-category-tag">{item.category}</span>
                      </div>
                    </div>

                    {/* Unit price */}
                    <div className="item-unit-price">
                      ${Number(item.price).toFixed(2)}
                    </div>

                    {/* Stepper */}
                    <div className="item-stepper-cell">
                      <div className="cart-stepper">
                        <button
                          type="button"
                          className="stepper-btn minus"
                          onClick={() => removeFromCart(item._id)}
                          aria-label="Decrease quantity"
                        >
                          –
                        </button>
                        <span className="stepper-qty">{qty}</span>
                        <button
                          type="button"
                          className="stepper-btn plus"
                          onClick={() => addToCart(item._id)}
                          aria-label="Increase quantity"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    {/* Total */}
                    <div className="item-line-total">
                      ${itemTotal}
                    </div>

                    {/* Remove Action */}
                    <div className="item-action-cell">
                      <button
                        type="button"
                        className="item-remove-btn"
                        onClick={() => {
                          // Clear all count of this item
                          for (let i = 0; i < qty; i++) {
                            removeFromCart(item._id);
                          }
                        }}
                        title="Remove dish"
                        aria-label="Remove dish"
                      >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="3 6 5 6 21 6"></polyline>
                          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                        </svg>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="cart-items-footer">
              <Link to="/" className="continue-shopping-link">
                ← Continue Browsing Menu
              </Link>
              <span className="total-items-badge">
                {totalCount} {totalCount === 1 ? 'item' : 'items'} in cart
              </span>
            </div>
          </div>
        </div>

        {/* Right Column: Order Summary & Checkout */}
        <div className="cart-summary-column">
          <div className="cart-summary-card">
            <h3 className="summary-title">Order Summary</h3>

            <div className="summary-breakdown">
              <div className="summary-row">
                <span className="summary-label">Subtotal</span>
                <span className="summary-value">${subtotal.toFixed(2)}</span>
              </div>

              <div className="summary-row">
                <span className="summary-label">Estimated Delivery Fee</span>
                <span className="summary-value">${deliveryFee.toFixed(2)}</span>
              </div>

              {discountAmount > 0 && (
                <div className="summary-row discount-row">
                  <span className="summary-label">Promo Discount ({discountPercent}%)</span>
                  <span className="summary-value">- ${discountAmount.toFixed(2)}</span>
                </div>
              )}

              <div className="summary-divider"></div>

              <div className="summary-row grand-total-row">
                <span className="total-label">Grand Total</span>
                <span className="total-value">${grandTotal.toFixed(2)}</span>
              </div>
            </div>

            {/* Promo Voucher Box */}
            <div className="summary-promo-container">
              {promoCode ? (
                <div className="applied-promo-chip">
                  <div>
                    <span className="promo-active-label">Voucher Applied:</span>
                    <strong>{promoCode}</strong>
                  </div>
                  <button type="button" className="promo-remove-link" onClick={removePromoCode}>
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCode} className="promo-input-form">
                  <input
                    type="text"
                    placeholder="Promo Code (e.g. BITEZY30)"
                    value={inputCode}
                    onChange={(e) => setInputCode(e.target.value)}
                    className="promo-input-field"
                  />
                  <button type="submit" className="promo-apply-button">
                    Apply
                  </button>
                </form>
              )}

              {promoFeedback && (
                <p className={`promo-feedback-msg ${promoFeedback.success ? 'success' : 'error'}`}>
                  {promoFeedback.message}
                </p>
              )}
            </div>

            <button onClick={handleCheckout} className="btn-primary checkout-action-btn">
              <span>PROCEED TO CHECKOUT</span>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </button>

            <div className="checkout-trust-badges">
              <span>🔒 100% Secure Checkout</span>
              <span>⚡ Fast Kitchen Prep</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
