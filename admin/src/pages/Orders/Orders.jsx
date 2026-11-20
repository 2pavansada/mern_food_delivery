import React, { useEffect, useState } from 'react';
import './Orders.css';
import axios from 'axios';
import { toast } from 'react-toastify';

const ALLOWED_TRANSITIONS = {
  'Order Placed': ['Order Confirmed', 'Cancelled'],
  'Order Confirmed': ['Food Processing', 'Cancelled'],
  'Food Processing': ['Out for Delivery', 'Cancelled'],
  'Out for Delivery': ['Delivered'],
  'Delivered': [],
  'Cancelled': [],
};

const normalize = (s) => {
  if (!s) return 'Order Placed';
  const l = s.trim().toLowerCase();
  if (l === 'order placed') return 'Order Placed';
  if (l === 'order confirmed') return 'Order Confirmed';
  if (l === 'food processing' || l === 'processing') return 'Food Processing';
  if (l === 'out for delivery' || l === 'on the way') return 'Out for Delivery';
  if (l === 'delivered') return 'Delivered';
  if (l === 'cancelled' || l === 'canceled') return 'Cancelled';
  return s;
};

const Orders = ({ url }) => {
  const [orders, setOrders] = useState([]);
  const [statusFilter, setStatusFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [expandedHistories, setExpandedHistories] = useState({});

  const fetchAllOrders = async () => {
    setLoading(true);
    try {
      const response = await axios.get(url + '/api/order/list');
      if (response.data.success) {
        setOrders(response.data.data || []);
      } else {
        toast.error('Failed to load orders');
      }
    } catch (err) {
      console.error(err);
      toast.error('Error communicating with backend server');
    } finally {
      setLoading(false);
    }
  };

  const statusHandler = async (event, orderId) => {
    const newStatus = event.target.value;
    if (!newStatus) return;

    try {
      const response = await axios.post(url + '/api/order/status', {
        orderId,
        status: newStatus,
        note: `Updated to ${newStatus} from dispatch portal`,
      });

      if (response.data.success) {
        toast.success(response.data.message || `Order status updated to: ${newStatus}`);
        await fetchAllOrders();
      } else {
        toast.error(response.data.message || 'Status update failed');
      }
    } catch (err) {
      console.error(err);
      toast.error('Error updating order status');
    }
  };

  const toggleHistory = (orderId) => {
    setExpandedHistories((prev) => ({
      ...prev,
      [orderId]: !prev[orderId],
    }));
  };

  useEffect(() => {
    fetchAllOrders();
  }, []);

  const filteredOrders = orders.filter((order) => {
    const currentNorm = normalize(order.status);
    const matchesFilter =
      statusFilter === 'All' ||
      currentNorm.toLowerCase() === statusFilter.toLowerCase();

    const q = searchQuery.toLowerCase();
    const custName = `${order.address?.firstName || ''} ${order.address?.lastName || ''}`.toLowerCase();
    const orderId = String(order._id).toLowerCase();
    const matchesSearch = !q || custName.includes(q) || orderId.includes(q);

    return matchesFilter && matchesSearch;
  });

  const getStatusClass = (status) => {
    const s = normalize(status).toLowerCase();
    if (s.includes('cancel')) return 'red';
    if (s.includes('deliver')) return 'green';
    if (s.includes('out') || s.includes('way')) return 'blue';
    if (s.includes('process')) return 'amber';
    return 'purple';
  };

  return (
    <div className="admin-orders-page">
      <div className="page-header-row">
        <div>
          <span className="admin-tag">ORDER DISPATCH</span>
          <h1 className="admin-page-title">Orders Management</h1>
          <p className="admin-page-subtitle">
            Track incoming food orders, validate lifecycle transitions, and view customer destinations.
          </p>
        </div>

        <button onClick={fetchAllOrders} className="btn-secondary-admin">
          <span>↻ Refresh Orders</span>
        </button>
      </div>

      {/* Filter Tabs & Search */}
      <div className="orders-dispatch-toolbar">
        <div className="status-tab-pills">
          <button
            type="button"
            className={`tab-btn ${statusFilter === 'All' ? 'active' : ''}`}
            onClick={() => setStatusFilter('All')}
          >
            All Orders ({orders.length})
          </button>
          <button
            type="button"
            className={`tab-btn ${statusFilter === 'Order Placed' ? 'active' : ''}`}
            onClick={() => setStatusFilter('Order Placed')}
          >
            Placed ({orders.filter((o) => normalize(o.status) === 'Order Placed').length})
          </button>
          <button
            type="button"
            className={`tab-btn ${statusFilter === 'Order Confirmed' ? 'active' : ''}`}
            onClick={() => setStatusFilter('Order Confirmed')}
          >
            Confirmed ({orders.filter((o) => normalize(o.status) === 'Order Confirmed').length})
          </button>
          <button
            type="button"
            className={`tab-btn ${statusFilter === 'Food Processing' ? 'active' : ''}`}
            onClick={() => setStatusFilter('Food Processing')}
          >
            Processing ({orders.filter((o) => normalize(o.status) === 'Food Processing').length})
          </button>
          <button
            type="button"
            className={`tab-btn ${statusFilter === 'Out for Delivery' ? 'active' : ''}`}
            onClick={() => setStatusFilter('Out for Delivery')}
          >
            On The Way ({orders.filter((o) => normalize(o.status) === 'Out for Delivery').length})
          </button>
          <button
            type="button"
            className={`tab-btn ${statusFilter === 'Delivered' ? 'active' : ''}`}
            onClick={() => setStatusFilter('Delivered')}
          >
            Delivered ({orders.filter((o) => normalize(o.status) === 'Delivered').length})
          </button>
          <button
            type="button"
            className={`tab-btn ${statusFilter === 'Cancelled' ? 'active' : ''}`}
            onClick={() => setStatusFilter('Cancelled')}
          >
            Cancelled ({orders.filter((o) => normalize(o.status) === 'Cancelled').length})
          </button>
        </div>

        <div className="orders-search-input">
          <input
            type="text"
            placeholder="Search by customer name or Order ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Orders List */}
      {loading ? (
        <div className="orders-loading-state">
          <div className="loading-spinner"></div>
          <p>Loading dispatch orders...</p>
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="orders-empty-card">
          <div className="empty-icon">📦</div>
          <h3>No Orders Found</h3>
          <p>No customer orders match the current status or search filter.</p>
        </div>
      ) : (
        <div className="orders-cards-list">
          {filteredOrders.map((order, index) => {
            const currentNorm = normalize(order.status);
            const statusClass = getStatusClass(currentNorm);
            const allowedNext = ALLOWED_TRANSITIONS[currentNorm] || [];
            const isTerminal = allowedNext.length === 0;
            const totalDishes =
              order.items?.reduce((acc, item) => acc + (item.quantity || 1), 0) || 0;
            const isExpanded = !!expandedHistories[order._id];

            return (
              <div key={order._id || index} className="admin-order-card">
                <div className="order-card-header">
                  <div className="order-header-left">
                    <span className="order-badge-id">
                      Order #{String(order._id).slice(-6).toUpperCase()}
                    </span>
                    {order.payment ? (
                      <span className="payment-status-badge">✓ Paid via Stripe</span>
                    ) : currentNorm === 'Cancelled' ? (
                      <span
                        className="payment-status-badge"
                        style={{ backgroundColor: '#FEE2E2', color: '#DC2626' }}
                      >
                        ✕ Unpaid / Cancelled
                      </span>
                    ) : (
                      <span
                        className="payment-status-badge"
                        style={{ backgroundColor: '#FEF3C7', color: '#B45309' }}
                      >
                        ⏳ Payment Pending
                      </span>
                    )}

                    {order.estimatedDelivery && !isTerminal && (
                      <span
                        style={{
                          fontSize: '11px',
                          color: '#C2410C',
                          backgroundColor: '#FFF7ED',
                          padding: '3px 8px',
                          borderRadius: '6px',
                          border: '1px solid #FED7AA',
                          fontWeight: 600,
                        }}
                      >
                        ⏱ ETA: {new Date(order.estimatedDelivery).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    )}
                  </div>

                  <div className="order-header-right">
                    <span className={`status-pill ${statusClass}`}>
                      {currentNorm}
                    </span>
                  </div>
                </div>

                <div className="order-card-content-grid">
                  {/* Left: Items description */}
                  <div className="content-col items-col">
                    <h4 className="col-label">Ordered Items ({totalDishes})</h4>
                    <div className="order-items-pills">
                      {order.items?.map((item, idx) => (
                        <div key={idx} className="item-order-bubble">
                          <span className="bubble-qty">{item.quantity}x</span>
                          <span className="bubble-name">{item.name}</span>
                          <span className="bubble-price">
                            ${Number(item.price || 0).toFixed(2)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Middle: Customer details */}
                  <div className="content-col customer-col">
                    <h4 className="col-label">Customer & Delivery Info</h4>
                    <p className="cust-full-name">
                      <strong>
                        {order.address?.firstName} {order.address?.lastName}
                      </strong>
                    </p>
                    <p className="cust-address-line">
                      📍 {order.address?.street}, {order.address?.city},{' '}
                      {order.address?.state} {order.address?.zipcode}
                    </p>
                    <p className="cust-phone-line">📞 {order.address?.phone}</p>
                    {order.address?.email && (
                      <p className="cust-email-line">✉️ {order.address.email}</p>
                    )}

                    <button
                      type="button"
                      onClick={() => toggleHistory(order._id)}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: 'var(--primary-orange, #F97316)',
                        cursor: 'pointer',
                        fontSize: '12px',
                        fontWeight: 700,
                        padding: '4px 0',
                        marginTop: '8px',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                      }}
                    >
                      <span>{isExpanded ? '▲ Hide Status History' : '▼ View Status Audit Log'}</span>
                    </button>
                  </div>

                  {/* Right: Amount & Status control */}
                  <div className="content-col actions-col">
                    <div className="order-cost-box">
                      <span className="cost-label">Total Amount</span>
                      <strong className="cost-value">
                        ${Number(order.amount).toFixed(2)}
                      </strong>
                    </div>

                    <div className="status-selector-box">
                      <label className="status-label">
                        Lifecycle Status Control:
                      </label>

                      {isTerminal ? (
                        <div
                          style={{
                            padding: '8px 12px',
                            background: '#F3F4F6',
                            borderRadius: '8px',
                            fontSize: '12px',
                            fontWeight: 700,
                            color: '#6B7280',
                            textAlign: 'center',
                          }}
                        >
                          🔒 Order is {currentNorm} (Final State)
                        </div>
                      ) : (
                        <select
                          onChange={(event) => statusHandler(event, order._id)}
                          defaultValue=""
                          className="admin-status-select"
                        >
                          <option value="" disabled>
                            Current: {currentNorm} (Select next step...)
                          </option>
                          {allowedNext.map((nextStatus) => (
                            <option key={nextStatus} value={nextStatus}>
                              ➔ Advance to: {nextStatus}
                            </option>
                          ))}
                        </select>
                      )}
                    </div>
                  </div>
                </div>

                {/* Collapsible Status History Log */}
                {isExpanded && (
                  <div
                    style={{
                      marginTop: '16px',
                      paddingTop: '16px',
                      borderTop: '1px solid var(--border-light, #F3F4F6)',
                    }}
                  >
                    <h5
                      style={{
                        fontSize: '12px',
                        textTransform: 'uppercase',
                        color: 'var(--secondary-text, #737373)',
                        marginBottom: '8px',
                      }}
                    >
                      Audit Trail ({order.statusHistory?.length || 0} transitions)
                    </h5>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      {order.statusHistory?.map((h, hIdx) => (
                        <div
                          key={hIdx}
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            fontSize: '12px',
                            background: '#FAFAF9',
                            padding: '6px 12px',
                            borderRadius: '6px',
                          }}
                        >
                          <div>
                            <strong style={{ color: 'var(--dark-charcoal, #171717)' }}>
                              {h.status}
                            </strong>
                            {h.note && (
                              <span style={{ color: '#737373', marginLeft: '6px' }}>
                                ({h.note})
                              </span>
                            )}
                          </div>
                          <span style={{ color: '#737373' }}>
                            {new Date(h.timestamp).toLocaleString()}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Orders;
