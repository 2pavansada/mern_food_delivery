import React, { useContext, useEffect, useState } from 'react';
import './PlaceOrder.css';
import { StoreContext } from '../../components/context/StoreContext';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const PlaceOrder = () => {
  const {
    getTotalCartAmount,
    token,
    food_list,
    cartItems,
    url,
    promoCode,
    discountPercent
  } = useContext(StoreContext);

  const [data, setData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    street: "",
    city: "",
    state: "",
    zipcode: "",
    country: "",
    phone: ""
  });

  const [deliveryNotes, setDeliveryNotes] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("stripe");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate('/cart');
    } else if (getTotalCartAmount() === 0) {
      navigate('/cart');
    }
  }, [token]);

  const onChangeHandler = (event) => {
    const { name, value } = event.target;
    setData(prev => ({ ...prev, [name]: value }));
  };

  const subtotal = getTotalCartAmount();
  const deliveryFee = subtotal === 0 ? 0 : 2;
  const discountAmount = discountPercent > 0 ? (subtotal * discountPercent) / 100 : 0;
  const finalAmount = Math.max(0, subtotal - discountAmount + deliveryFee);

  const placeOrder = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setErrorMessage("");

    let orderItems = [];
    food_list.forEach((item) => {
      if (cartItems[item._id] > 0) {
        let itemInfo = { ...item };
        itemInfo["quantity"] = cartItems[item._id];
        orderItems.push(itemInfo);
      }
    });

    let orderData = {
      address: {
        ...data,
        notes: deliveryNotes
      },
      items: orderItems,
      amount: finalAmount,
      promoCode: promoCode || null
    };

    try {
      let response = await axios.post(url + '/api/order/place', orderData, { headers: { token } });
      if (response.data.success) {
        const { session_url } = response.data;
        window.location.replace(session_url);
      } else {
        setErrorMessage(response.data.message || 'Unable to initiate order payment. Please try again.');
        setIsSubmitting(false);
      }
    } catch (err) {
      console.error("Order error:", err);
      setErrorMessage("Could not connect to payment gateway. Please make sure the backend server is running.");
      setIsSubmitting(false);
    }
  };

  // Filter items in cart for order summary preview
  const orderedItems = (food_list || []).filter((item) => cartItems && cartItems[item._id] > 0);

  return (
    <div className="checkout-page-wrapper">
      <div className="checkout-header">
        <h1 className="page-heading">Complete Your Order</h1>
        <p className="page-subheading">Provide your delivery address and choose a payment method.</p>
      </div>

      {errorMessage && (
        <div className="checkout-error-banner">
          <span>⚠️ {errorMessage}</span>
          <button type="button" onClick={() => setErrorMessage("")}>✕</button>
        </div>
      )}

      <form onSubmit={placeOrder} className="checkout-form-grid">
        {/* Left Column: Delivery & Contact Form */}
        <div className="checkout-form-left">
          {/* Section 1: Customer Info */}
          <div className="checkout-card">
            <div className="card-section-title">
              <span className="step-num">1</span>
              <h3>Contact Details</h3>
            </div>
            <div className="input-row">
              <div className="form-group">
                <label>First Name</label>
                <input
                  required
                  name="firstName"
                  onChange={onChangeHandler}
                  value={data.firstName}
                  type="text"
                  placeholder="John"
                />
              </div>
              <div className="form-group">
                <label>Last Name</label>
                <input
                  required
                  name="lastName"
                  onChange={onChangeHandler}
                  value={data.lastName}
                  type="text"
                  placeholder="Doe"
                />
              </div>
            </div>

            <div className="input-row">
              <div className="form-group">
                <label>Email Address</label>
                <input
                  required
                  name="email"
                  onChange={onChangeHandler}
                  value={data.email}
                  type="email"
                  placeholder="john.doe@example.com"
                />
              </div>
              <div className="form-group">
                <label>Phone Number</label>
                <input
                  required
                  name="phone"
                  onChange={onChangeHandler}
                  value={data.phone}
                  type="tel"
                  placeholder="+1 (555) 000-0000"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Address Info */}
          <div className="checkout-card">
            <div className="card-section-title">
              <span className="step-num">2</span>
              <h3>Delivery Address</h3>
            </div>
            <div className="form-group">
              <label>Street Address</label>
              <input
                required
                name="street"
                onChange={onChangeHandler}
                value={data.street}
                type="text"
                placeholder="123 Delicious Lane, Apt 4B"
              />
            </div>

            <div className="input-row">
              <div className="form-group">
                <label>City</label>
                <input
                  required
                  name="city"
                  onChange={onChangeHandler}
                  value={data.city}
                  type="text"
                  placeholder="San Francisco"
                />
              </div>
              <div className="form-group">
                <label>State / Region</label>
                <input
                  required
                  name="state"
                  onChange={onChangeHandler}
                  value={data.state}
                  type="text"
                  placeholder="CA"
                />
              </div>
            </div>

            <div className="input-row">
              <div className="form-group">
                <label>Zip / Postal Code</label>
                <input
                  required
                  name="zipcode"
                  onChange={onChangeHandler}
                  value={data.zipcode}
                  type="text"
                  placeholder="94103"
                />
              </div>
              <div className="form-group">
                <label>Country</label>
                <input
                  required
                  name="country"
                  onChange={onChangeHandler}
                  value={data.country}
                  type="text"
                  placeholder="United States"
                />
              </div>
            </div>

            <div className="form-group">
              <label>Delivery Instructions (Optional)</label>
              <input
                type="text"
                placeholder="E.g., Ring buzzer 402, leave at front door"
                value={deliveryNotes}
                onChange={(e) => setDeliveryNotes(e.target.value)}
              />
            </div>
          </div>

          {/* Section 3: Payment Method */}
          <div className="checkout-card">
            <div className="card-section-title">
              <span className="step-num">3</span>
              <h3>Payment Selection</h3>
            </div>
            <div className="payment-options-list">
              <label className={`payment-option-tile ${paymentMethod === 'stripe' ? 'selected' : ''}`}>
                <input
                  type="radio"
                  name="paymentMethod"
                  value="stripe"
                  checked={paymentMethod === 'stripe'}
                  onChange={() => setPaymentMethod('stripe')}
                />
                <div className="payment-option-content">
                  <div className="payment-title-row">
                    <strong>Online Payment via Stripe</strong>
                    <span className="payment-badge-secure">Encrypted & Secure</span>
                  </div>
                  <p className="payment-desc">Credit / Debit Card, Apple Pay, Google Pay via Stripe</p>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Right Column: Order Summary */}
        <div className="checkout-form-right">
          <div className="order-summary-box">
            <h3 className="summary-title">Order Summary</h3>

            {/* Itemized preview */}
            <div className="summary-items-preview">
              {orderedItems.map((item) => (
                <div key={item._id} className="preview-item-row">
                  <div className="preview-item-desc">
                    <span className="preview-qty">{cartItems[item._id]}x</span>
                    <span className="preview-name">{item.name}</span>
                  </div>
                  <span className="preview-price">
                    ${(item.price * cartItems[item._id]).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            <div className="summary-divider"></div>

            <div className="summary-cost-breakdown">
              <div className="summary-cost-row">
                <span>Subtotal</span>
                <strong>${subtotal.toFixed(2)}</strong>
              </div>
              <div className="summary-cost-row">
                <span>Delivery Fee</span>
                <strong>${deliveryFee.toFixed(2)}</strong>
              </div>
              {discountAmount > 0 && (
                <div className="summary-cost-row discount">
                  <span>Promo Discount ({promoCode})</span>
                  <strong>- ${discountAmount.toFixed(2)}</strong>
                </div>
              )}
              <div className="summary-divider"></div>
              <div className="summary-cost-row total-row">
                <span>Total Due</span>
                <span className="total-due-amount">${finalAmount.toFixed(2)}</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className={`btn-primary place-order-submit-btn ${isSubmitting ? 'submitting' : ''}`}
            >
              {isSubmitting ? (
                <span>Redirecting to Payment...</span>
              ) : (
                <>
                  <span>PROCEED TO PAYMENT</span>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <polyline points="12 5 19 12 12 19"></polyline>
                  </svg>
                </>
              )}
            </button>

            <p className="order-security-note">
              🔒 256-Bit SSL Encrypted. You will be redirected to the secure Stripe portal to finalize payment.
            </p>
          </div>
        </div>
      </form>
    </div>
  );
};

export default PlaceOrder;
