import React, { useEffect, useState } from 'react';
import './Dashboard.css';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

const Dashboard = ({ url }) => {
  const [foods, setFoods] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [foodRes, orderRes] = await Promise.allSettled([
        axios.get(`${url}/api/food/list`),
        axios.get(`${url}/api/order/list`)
      ]);

      if (foodRes.status === 'fulfilled' && foodRes.value.data.success) {
        setFoods(foodRes.value.data.data || []);
      }
      if (orderRes.status === 'fulfilled' && orderRes.value.data.success) {
        setOrders(orderRes.value.data.data || []);
      }
    } catch (err) {
      console.error("Dashboard data error:", err);
    } finally {
      setLoading(false);
    }
  };

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

  const updateOrderStatus = async (orderId, newStatus) => {
    if (!newStatus) return;
    try {
      const res = await axios.post(`${url}/api/order/status`, {
        orderId,
        status: newStatus
      });
      if (res.data.success) {
        toast.success(res.data.message || `Order status updated to "${newStatus}"`);
        fetchDashboardData();
      } else {
        toast.error(res.data.message || "Failed to update status");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error communicating with server");
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Compute metrics
  const totalOrders = orders.length;
  const totalRevenue = orders.reduce((sum, o) => sum + (Number(o.amount) || 0), 0);
  const deliveredOrders = orders.filter(o => (o.status || '').toLowerCase().includes('deliver')).length;
  const pendingOrders = totalOrders - deliveredOrders;
  const totalFoodItems = foods.length;

  // Extract unique customers
  const uniqueEmails = new Set(orders.map(o => o.address?.email).filter(Boolean));
  const totalCustomers = uniqueEmails.size;

  const recentOrders = [...orders].reverse().slice(0, 5);

  return (
    <div className="dashboard-overview-page">
      <div className="dashboard-header">
        <div>
          <span className="admin-tag">BITEZY COMMAND CENTER</span>
          <h1 className="admin-page-title">Executive Dashboard</h1>
          <p className="admin-page-subtitle">Real-time overview of revenue, operations, menu catalog, and customer orders.</p>
        </div>
        <div className="dashboard-header-actions">
          <button onClick={fetchDashboardData} className="btn-secondary-admin">
            <span>↻ Refresh</span>
          </button>
          <Link to="/add" className="btn-primary-admin">
            <span>+ Add New Dish</span>
          </Link>
        </div>
      </div>

      {/* 6 Key Performance Metric Cards */}
      <div className="stats-cards-grid">
        {/* Total Revenue */}
        <div className="stat-card">
          <div className="stat-card-header">
            <span className="stat-card-label">Total Revenue</span>
            <div className="stat-icon-wrapper orange">💰</div>
          </div>
          <h2 className="stat-card-value">${totalRevenue.toFixed(2)}</h2>
          <div className="stat-card-footer">
            <span className="stat-trend positive">↑ Live</span>
            <span className="stat-note">From all completed orders</span>
          </div>
        </div>

        {/* Total Orders */}
        <div className="stat-card">
          <div className="stat-card-header">
            <span className="stat-card-label">Total Orders</span>
            <div className="stat-icon-wrapper blue">📦</div>
          </div>
          <h2 className="stat-card-value">{totalOrders}</h2>
          <div className="stat-card-footer">
            <span className="stat-trend neutral">{pendingOrders} active</span>
            <span className="stat-note">Lifetime customer orders</span>
          </div>
        </div>

        {/* Pending Orders */}
        <div className="stat-card">
          <div className="stat-card-header">
            <span className="stat-card-label">Pending / In Kitchen</span>
            <div className="stat-icon-wrapper amber">⏳</div>
          </div>
          <h2 className="stat-card-value">{pendingOrders}</h2>
          <div className="stat-card-footer">
            <span className="stat-trend warning">Needs Attention</span>
            <span className="stat-note">Prep & out for delivery</span>
          </div>
        </div>

        {/* Delivered Orders */}
        <div className="stat-card">
          <div className="stat-card-header">
            <span className="stat-card-label">Delivered Orders</span>
            <div className="stat-icon-wrapper green">✅</div>
          </div>
          <h2 className="stat-card-value">{deliveredOrders}</h2>
          <div className="stat-card-footer">
            <span className="stat-trend positive">
              {totalOrders > 0 ? Math.round((deliveredOrders / totalOrders) * 100) : 100}%
            </span>
            <span className="stat-note">Fulfillment success rate</span>
          </div>
        </div>

        {/* Total Food Items */}
        <div className="stat-card">
          <div className="stat-card-header">
            <span className="stat-card-label">Active Menu Dishes</span>
            <div className="stat-icon-wrapper cream">🥗</div>
          </div>
          <h2 className="stat-card-value">{totalFoodItems}</h2>
          <div className="stat-card-footer">
            <Link to="/list" className="stat-link">View Full Menu →</Link>
          </div>
        </div>

        {/* Total Customers */}
        <div className="stat-card">
          <div className="stat-card-header">
            <span className="stat-card-label">Total Customers</span>
            <div className="stat-icon-wrapper purple">👥</div>
          </div>
          <h2 className="stat-card-value">{totalCustomers}</h2>
          <div className="stat-card-footer">
            <Link to="/customers" className="stat-link">Customer Directory →</Link>
          </div>
        </div>
      </div>

      {/* Main Grid: Recent Orders & Quick Overview */}
      <div className="dashboard-content-split">
        {/* Left: Recent Orders Table */}
        <div className="dashboard-card recent-orders-card">
          <div className="card-heading-bar">
            <div>
              <h3 className="card-heading-title">Recent Customer Orders</h3>
              <p className="card-heading-sub">Latest incoming delivery requests</p>
            </div>
            <Link to="/orders" className="view-all-link">
              View All Orders ({orders.length}) →
            </Link>
          </div>

          {recentOrders.length === 0 ? (
            <div className="empty-table-state">
              <p>No orders recorded yet. As orders are placed in the store, they will populate here live!</p>
            </div>
          ) : (
            <div className="admin-table-wrapper">
              <table className="admin-modern-table">
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Customer</th>
                    <th>Dishes</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Update</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((order, idx) => (
                    <tr key={order._id || idx}>
                      <td>
                        <span className="order-id-badge">#{String(order._id).slice(-6).toUpperCase()}</span>
                      </td>
                      <td>
                        <div className="customer-cell">
                          <strong>{order.address?.firstName} {order.address?.lastName}</strong>
                          <span>{order.address?.city}, {order.address?.state}</span>
                        </div>
                      </td>
                      <td>
                        <span className="item-count-chip">
                          {order.items?.length || 0} items
                        </span>
                      </td>
                      <td>
                        <strong className="amount-cell">${Number(order.amount).toFixed(2)}</strong>
                      </td>
                      <td>
                        <span className={`status-pill ${
                          normalize(order.status).toLowerCase().includes('cancel') ? 'red' :
                          normalize(order.status).toLowerCase().includes('deliver') ? 'green' :
                          normalize(order.status).toLowerCase().includes('out') ? 'blue' : 'amber'
                        }`}>
                          {normalize(order.status)}
                        </span>
                      </td>
                      <td>
                        {ALLOWED_TRANSITIONS[normalize(order.status)]?.length > 0 ? (
                          <select
                            className="status-dropdown-select"
                            defaultValue=""
                            onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                          >
                            <option value="" disabled>➔ Advance...</option>
                            {ALLOWED_TRANSITIONS[normalize(order.status)].map((next) => (
                              <option key={next} value={next}>
                                {next}
                              </option>
                            ))}
                          </select>
                        ) : (
                          <span style={{ fontSize: '11px', color: '#6B7280', fontWeight: 600 }}>
                            {normalize(order.status)}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Right: Quick Action Hub & Menu Highlights */}
        <div className="dashboard-side-column">
          <div className="dashboard-card quick-actions-card">
            <h3 className="card-heading-title">Quick Actions</h3>
            <div className="quick-actions-list">
              <Link to="/add" className="quick-action-item">
                <div className="qa-icon orange">+</div>
                <div>
                  <strong>Add New Food Item</strong>
                  <p>Upload dish photos, set price & category</p>
                </div>
              </Link>
              <Link to="/list" className="quick-action-item">
                <div className="qa-icon blue">☰</div>
                <div>
                  <strong>Manage Food Inventory</strong>
                  <p>Edit descriptions, filter dishes or remove</p>
                </div>
              </Link>
              <Link to="/orders" className="quick-action-item">
                <div className="qa-icon green">🛵</div>
                <div>
                  <strong>Live Orders Dispatch</strong>
                  <p>Update statuses & inspect deliveries</p>
                </div>
              </Link>
            </div>
          </div>

          <div className="dashboard-card system-info-card">
            <h3 className="card-heading-title">Platform Status</h3>
            <div className="platform-info-list">
              <div className="platform-info-row">
                <span>Application</span>
                <strong>BITEZY Delivery Engine</strong>
              </div>
              <div className="platform-info-row">
                <span>Payment Gateway</span>
                <strong>Stripe Integration</strong>
              </div>
              <div className="platform-info-row">
                <span>Database</span>
                <strong>MongoDB Atlas</strong>
              </div>
              <div className="platform-info-row">
                <span>API Server</span>
                <strong className="text-green">HTTP Port 4000</strong>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
