import React, { useContext, useEffect, useState } from 'react';
import './MyOrders.css';
import { StoreContext } from './../../components/context/StoreContext';
import axios from 'axios';
import { Link } from 'react-router-dom';

const MyOrders = () => {
  const { url, token } = useContext(StoreContext);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await axios.post(url + '/api/order/userorders', {}, { headers: { token } });
      if (response.data.success) {
        setData(response.data.data || []);
      }
    } catch (error) {
      console.error("Failed to fetch orders:", error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchOrders();
    }
  }, [token]);

  const getStatusStep = (status) => {
    const s = (status || "").toLowerCase();
    if (s.includes("cancel")) return -1;
    if (s.includes("deliver")) return 5;
    if (s.includes("out") || s.includes("way")) return 4;
    if (s.includes("process") || s.includes("prep") || s.includes("cook")) return 3;
    if (s.includes("confirm")) return 2;
    return 1; // Order Placed
  };

  const getStatusBadgeClass = (status) => {
    const s = (status || "").toLowerCase();
    if (s.includes("cancel")) return "badge-cancelled";
    if (s.includes("deliver")) return "badge-delivered";
    if (s.includes("out") || s.includes("way")) return "badge-out";
    if (s.includes("process") || s.includes("prep")) return "badge-processing";
    if (s.includes("confirm")) return "badge-confirmed";
    return "badge-placed";
  };

  return (
    <div className="my-orders-page">
      <div className="orders-header-title">
        <div>
          <h1 className="page-heading">Your Order History</h1>
          <p className="page-subheading">Track live deliveries, review past feasts, and check order details.</p>
        </div>
        <button onClick={fetchOrders} className="btn-secondary refresh-orders-btn">
          <span>↻ Refresh Orders</span>
        </button>
      </div>

      {loading ? (
        <div className="orders-loading-state">
          <div className="loading-spinner"></div>
          <p>Fetching your latest orders...</p>
        </div>
      ) : data.length === 0 ? (
        <div className="orders-empty-state">
          <div className="empty-icon">📦</div>
          <h3>No Orders Placed Yet</h3>
          <p>You haven't ordered any meals yet. When you place an order, it will appear here with live progress tracking!</p>
          <Link to="/" className="btn-primary">Explore Menu</Link>
        </div>
      ) : (
        <div className="orders-container">
          {data.map((order, index) => {
            const currentStep = getStatusStep(order.status);
            const isCancelled = currentStep === -1;
            const badgeClass = getStatusBadgeClass(order.status);
            const formattedDate = order.date ? new Date(order.date).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric"
            }) : "Recent Order";

            const progressWidth = isCancelled 
              ? 0 
              : Math.min(100, Math.max(0, ((currentStep - 1) / 4) * 100));

            return (
              <div key={order._id || index} className="order-history-card">
                {/* Card Top: Order metadata & status */}
                <div className="order-card-top">
                  <div className="order-meta-info">
                    <span className="order-id-label">Order #{String(order._id).slice(-6).toUpperCase()}</span>
                    <span className="order-date-text">{formattedDate}</span>
                  </div>

                  <div className="order-status-group">
                    <span className={`order-status-badge ${badgeClass}`}>
                      <span className="status-dot"></span>
                      {order.status || 'Order Placed'}
                    </span>
                  </div>
                </div>

                {/* 5-Stage Tracking Timeline Preview */}
                {!isCancelled ? (
                  <div className="order-tracking-timeline">
                    <div className="timeline-track">
                      <div
                        className="timeline-progress-bar"
                        style={{ width: `${progressWidth}%` }}
                      ></div>
                    </div>

                    <div className="timeline-steps">
                      <div className={`timeline-step ${currentStep >= 1 ? 'completed' : ''} ${currentStep === 1 ? 'active' : ''}`}>
                        <div className="step-circle">{currentStep > 1 ? '✓' : '📝'}</div>
                        <span className="step-label">Placed</span>
                      </div>
                      <div className={`timeline-step ${currentStep >= 2 ? 'completed' : ''} ${currentStep === 2 ? 'active' : ''}`}>
                        <div className="step-circle">{currentStep > 2 ? '✓' : '✓'}</div>
                        <span className="step-label">Confirmed</span>
                      </div>
                      <div className={`timeline-step ${currentStep >= 3 ? 'completed' : ''} ${currentStep === 3 ? 'active' : ''}`}>
                        <div className="step-circle">{currentStep > 3 ? '✓' : '👨‍🍳'}</div>
                        <span className="step-label">Kitchen Prep</span>
                      </div>
                      <div className={`timeline-step ${currentStep >= 4 ? 'completed' : ''} ${currentStep === 4 ? 'active' : ''}`}>
                        <div className="step-circle">{currentStep > 4 ? '✓' : '🛵'}</div>
                        <span className="step-label">On The Way</span>
                      </div>
                      <div className={`timeline-step ${currentStep >= 5 ? 'completed' : ''} ${currentStep === 5 ? 'active' : ''}`}>
                        <div className="step-circle">{currentStep >= 5 ? '✓' : '🏠'}</div>
                        <span className="step-label">Delivered</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div style={{ padding: '12px 16px', background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: '12px', margin: '14px 0', color: '#DC2626', fontSize: '13px', fontWeight: 600 }}>
                    ✕ This order was cancelled
                  </div>
                )}

                {/* Items Summary */}
                <div className="order-items-box">
                  <h4 className="items-heading">Items ({order.items.length}):</h4>
                  <div className="items-tags-list">
                    {order.items.map((item, idx) => (
                      <span key={idx} className="item-order-pill">
                        <strong>{item.quantity}x</strong> {item.name}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Card Bottom: Amount & Live Track button */}
                <div className="order-card-bottom">
                  <div className="order-total-amount">
                    <span className="total-label">Total Amount:</span>
                    <strong className="total-value">${Number(order.amount).toFixed(2)}</strong>
                  </div>

                  <Link to={`/track/${order._id}`} className="btn-primary track-action-btn">
                    <span>Track Order</span>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10"></circle>
                      <polyline points="12 6 12 12 16 14"></polyline>
                    </svg>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyOrders;
