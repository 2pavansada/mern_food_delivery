import React, { useContext, useEffect, useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import './TrackOrder.css';
import { StoreContext } from '../../components/context/StoreContext';

const STAGES = [
  { key: 'Order Placed', label: 'Order Placed', icon: '📝' },
  { key: 'Order Confirmed', label: 'Confirmed', icon: '✓' },
  { key: 'Food Processing', label: 'Kitchen Prep', icon: '👨‍🍳' },
  { key: 'Out for Delivery', label: 'Out for Delivery', icon: '🛵' },
  { key: 'Delivered', label: 'Delivered', icon: '🎉' },
];

const TERMINAL_STATUSES = ['Delivered', 'Cancelled'];

const TrackOrder = () => {
  const { orderId } = useParams();
  const { url, token } = useContext(StoreContext);

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastRefreshed, setLastRefreshed] = useState(new Date());
  const [isPolling, setIsPolling] = useState(true);

  const pollTimerRef = useRef(null);

  // Normalize status string for comparison
  const normalize = (s) => (s || '').trim().toLowerCase();

  const fetchOrderDetails = async (isBackgroundPoll = false) => {
    if (!token) {
      setLoading(false);
      setError('Please log in to track your order.');
      return;
    }

    try {
      if (!isBackgroundPoll) {
        setLoading(true);
      }
      const response = await axios.get(`${url}/api/order/track/${orderId}`, {
        headers: { token },
      });

      if (response.data.success && response.data.data) {
        const orderData = response.data.data;
        setOrder(orderData);
        setError(null);
        setLastRefreshed(new Date());

        // Check terminal state to stop polling
        const isTerminal = TERMINAL_STATUSES.some(
          (t) => normalize(t) === normalize(orderData.status)
        );
        if (isTerminal) {
          setIsPolling(false);
          if (pollTimerRef.current) {
            clearInterval(pollTimerRef.current);
            pollTimerRef.current = null;
          }
        }
      } else {
        setError(response.data.message || 'Unable to retrieve order details.');
      }
    } catch (err) {
      console.error('Error fetching order tracking info:', err);
      if (!isBackgroundPoll) {
        if (err.response && err.response.status === 403) {
          setError('Access denied: You are not authorized to track this order.');
        } else if (err.response && err.response.status === 404) {
          setError('Order not found. Please verify the order ID.');
        } else {
          setError('Could not connect to the tracking server.');
        }
      }
    } finally {
      if (!isBackgroundPoll) {
        setLoading(false);
      }
    }
  };

  // Initial load
  useEffect(() => {
    fetchOrderDetails();
  }, [orderId, token]);

  // Setup 6-second polling interval
  useEffect(() => {
    if (!token || !isPolling) return;

    pollTimerRef.current = setInterval(() => {
      fetchOrderDetails(true);
    }, 6000);

    return () => {
      if (pollTimerRef.current) {
        clearInterval(pollTimerRef.current);
      }
    };
  }, [orderId, token, isPolling]);

  // Determine which stage index is active (0 to 4, or -1 for cancelled)
  const getStageIndex = (status) => {
    const s = normalize(status);
    if (s.includes('cancel')) return -1;
    if (s.includes('deliver')) return 4;
    if (s.includes('out') || s.includes('way')) return 3;
    if (s.includes('process') || s.includes('prep') || s.includes('cook')) return 2;
    if (s.includes('confirm')) return 1;
    return 0; // 'Order Placed'
  };

  const getStatusTimestamp = (stageKey) => {
    if (!order || !order.statusHistory) return null;
    const historyItem = order.statusHistory.find(
      (h) => normalize(h.status) === normalize(stageKey)
    );
    if (!historyItem || !historyItem.timestamp) return null;
    return new Date(historyItem.timestamp).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatFullDate = (d) => {
    if (!d) return '';
    return new Date(d).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Format estimated delivery
  const renderEstimatedDeliveryText = () => {
    if (!order) return '';
    const s = normalize(order.status);
    if (s.includes('cancel')) {
      return 'Order Cancelled';
    }
    if (s.includes('deliver')) {
      const deliveredTime = getStatusTimestamp('Delivered');
      return deliveredTime ? `Delivered at ${deliveredTime}` : 'Delivered';
    }
    if (order.estimatedDelivery) {
      const timeStr = new Date(order.estimatedDelivery).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      });
      return `~ ${timeStr} (Estimated)`;
    }
    return 'Calculating estimate...';
  };

  // Loading state
  if (loading) {
    return (
      <div className="track-order-page">
        <div className="track-state-container">
          <div className="loading-spinner"></div>
          <h3 className="track-state-title">Loading Live Tracking...</h3>
          <p className="track-state-desc">Fetching real-time updates for Order #{orderId ? String(orderId).slice(-6).toUpperCase() : ''}</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !order) {
    return (
      <div className="track-order-page">
        <div className="track-state-container">
          <div className="track-state-icon">⚠️</div>
          <h3 className="track-state-title">Order Tracking Unavailable</h3>
          <p className="track-state-desc">{error || 'Unable to locate this order.'}</p>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button onClick={() => fetchOrderDetails(false)} className="btn-secondary">
              Try Again
            </button>
            <Link to="/myorders" className="btn-primary">
              View All Orders
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const currentStageIndex = getStageIndex(order.status);
  const isCancelled = currentStageIndex === -1;
  const progressPercent = isCancelled ? 0 : Math.min(100, Math.max(0, (currentStageIndex / (STAGES.length - 1)) * 100));

  const getPillClass = () => {
    if (isCancelled) return 'cancelled';
    if (currentStageIndex === 4) return 'delivered';
    if (currentStageIndex === 3) return 'delivery';
    if (currentStageIndex === 2) return 'processing';
    if (currentStageIndex === 1) return 'confirmed';
    return 'placed';
  };

  return (
    <div className="track-order-page">
      {/* Top action bar */}
      <div className="track-top-bar">
        <Link to="/myorders" className="back-to-orders-link">
          <span>← Back to My Orders</span>
        </Link>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {isPolling ? (
            <div className="live-polling-badge">
              <span className="live-indicator-dot pulse"></span>
              <span>Live Updates Active (6s)</span>
            </div>
          ) : (
            <div className="live-polling-badge">
              <span className="live-indicator-dot"></span>
              <span>Final Status Reached</span>
            </div>
          )}

          <button
            onClick={() => fetchOrderDetails(false)}
            className="btn-secondary"
            style={{ padding: '6px 14px', fontSize: '13px' }}
            title={`Last checked at ${lastRefreshed.toLocaleTimeString()}`}
          >
            ↻ Refresh
          </button>
        </div>
      </div>

      {/* Main Tracking Card */}
      <div className="track-main-card">
        {/* Card Header */}
        <div className="track-card-header">
          <div className="track-order-meta">
            <div className="track-order-title-row">
              <h1 className="track-order-heading">Track Your Feast</h1>
              <span className="track-id-badge">
                #{String(order._id).slice(-6).toUpperCase()}
              </span>
            </div>
            <span className="track-placed-date">
              Placed on {formatFullDate(order.date)} • Full ID: {order._id}
            </span>
          </div>

          <div>
            <span className={`track-status-pill-large ${getPillClass()}`}>
              <span>●</span>
              <span>{order.status || 'Order Placed'}</span>
            </span>
          </div>
        </div>

        {/* ETA Banner */}
        <div
          className={`track-eta-banner ${
            currentStageIndex === 4
              ? 'delivered-banner'
              : isCancelled
              ? 'cancelled-banner'
              : ''
          }`}
        >
          <div className="track-eta-content">
            <div className="eta-icon-bubble">
              {isCancelled ? '✕' : currentStageIndex === 4 ? '✓' : '⏱'}
            </div>
            <div className="eta-text-group">
              <span className="eta-label">
                {isCancelled
                  ? 'Status'
                  : currentStageIndex === 4
                  ? 'Completed'
                  : 'Estimated Delivery Time'}
              </span>
              <div className="eta-value">{renderEstimatedDeliveryText()}</div>
            </div>
          </div>

          {!isCancelled && currentStageIndex < 4 && (
            <span className="eta-notice-badge">
              ⚠️ Estimated window subject to traffic & kitchen rush
            </span>
          )}
        </div>

        {/* 5-Stage Timeline */}
        {!isCancelled ? (
          <div className="track-5stage-timeline">
            <div className="timeline-horizontal">
              <div className="timeline-horizontal-track">
                <div
                  className="timeline-horizontal-progress"
                  style={{ width: `${progressPercent}%` }}
                ></div>
              </div>

              {STAGES.map((stage, idx) => {
                const isCompleted = currentStageIndex > idx;
                const isCurrent = currentStageIndex === idx;
                const stageTime = getStatusTimestamp(stage.key);

                return (
                  <div
                    key={stage.key}
                    className={`timeline-stage-node ${
                      isCompleted ? 'completed' : isCurrent ? 'current' : 'pending'
                    }`}
                  >
                    <div className="stage-node-circle">
                      {isCompleted ? '✓' : stage.icon}
                    </div>
                    <div className="stage-node-info">
                      <div className="stage-node-title">{stage.label}</div>
                      <div className="stage-node-time">
                        {stageTime || (isCurrent ? 'In progress' : '')}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div
            style={{
              padding: '24px',
              textAlign: 'center',
              backgroundColor: '#FEF2F2',
              borderRadius: '16px',
              border: '1px solid #FECACA',
              margin: '20px 0',
            }}
          >
            <h4 style={{ color: '#DC2626', margin: '0 0 6px 0', fontSize: '16px' }}>
              Order Cancelled
            </h4>
            <p style={{ color: '#737373', fontSize: '13px', margin: 0 }}>
              This order has been cancelled and will not be prepared or dispatched.
            </p>
          </div>
        )}

        {/* Status History Audit Log */}
        {order.statusHistory && order.statusHistory.length > 0 && (
          <div className="track-history-log">
            <h4 className="history-log-heading">Status Timeline History</h4>
            <div className="history-log-list">
              {order.statusHistory.map((entry, index) => (
                <div key={index} className="history-log-item">
                  <div className="history-item-left">
                    <span className="history-item-bullet"></span>
                    <span className="history-item-status">{entry.status}</span>
                    {entry.note && (
                      <span className="history-item-note">— {entry.note}</span>
                    )}
                  </div>
                  <span className="history-item-time">
                    {formatFullDate(entry.timestamp)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Two-Column Details Grid */}
      <div className="track-details-grid">
        {/* Ordered Food Items */}
        <div className="track-details-card">
          <h3 className="details-card-title">
            <span>🍽️ Ordered Dishes ({order.items?.length || 0})</span>
          </h3>

          <div className="track-items-list">
            {order.items?.map((item, idx) => (
              <div key={idx} className="track-item-row">
                <div className="track-item-left">
                  <span className="track-item-qty">{item.quantity}x</span>
                  <span className="track-item-name">{item.name}</span>
                </div>
                <span className="track-item-price">
                  ${(Number(item.price || 0) * (item.quantity || 1)).toFixed(2)}
                </span>
              </div>
            ))}
          </div>

          <div className="track-order-summary-totals">
            <div className="summary-row">
              <span>Subtotal</span>
              <span>
                $
                {order.items
                  ?.reduce(
                    (sum, item) => sum + (item.price || 0) * (item.quantity || 1),
                    0
                  )
                  .toFixed(2)}
              </span>
            </div>
            <div className="summary-row">
              <span>Delivery Fee</span>
              <span>$2.00</span>
            </div>
            <div className="summary-row grand-total">
              <span>Total Paid</span>
              <span className="total-orange">${Number(order.amount).toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Delivery & Payment Information */}
        <div className="track-details-card">
          <h3 className="details-card-title">
            <span>📍 Delivery & Payment Details</span>
          </h3>

          <div className="delivery-info-block">
            <div className="info-data-group">
              <span className="info-data-label">Recipient</span>
              <div className="info-data-value">
                <strong>
                  {order.address?.firstName} {order.address?.lastName}
                </strong>
              </div>
            </div>

            <div className="info-data-group">
              <span className="info-data-label">Destination Address</span>
              <div className="info-data-value">
                {order.address?.street}, {order.address?.city}, {order.address?.state}{' '}
                {order.address?.zipcode}
              </div>
            </div>

            <div className="info-data-group">
              <span className="info-data-label">Contact Phone</span>
              <div className="info-data-value">📞 {order.address?.phone}</div>
            </div>

            {order.address?.email && (
              <div className="info-data-group">
                <span className="info-data-label">Email Confirmation</span>
                <div className="info-data-value">✉️ {order.address.email}</div>
              </div>
            )}

            <div className="info-data-group">
              <span className="info-data-label">Payment Status</span>
              <div>
                {order.payment ? (
                  <span className="payment-badge-inline paid">
                    ✓ Paid via Stripe
                  </span>
                ) : isCancelled ? (
                  <span className="payment-badge-inline failed">
                    ✕ Cancelled / Unpaid
                  </span>
                ) : (
                  <span className="payment-badge-inline pending">
                    ⏳ Payment Pending / COD
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrackOrder;
