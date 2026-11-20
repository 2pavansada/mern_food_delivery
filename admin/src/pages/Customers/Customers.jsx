import React, { useEffect, useState } from 'react';
import './Customers.css';
import axios from 'axios';

const Customers = ({ url }) => {
  const [orders, setOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  const fetchOrders = async () => {
    try {
      const res = await axios.get(`${url}/api/order/list`);
      if (res.data.success) {
        setOrders(res.data.data || []);
      }
    } catch (err) {
      console.error("Customers error:", err);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Group orders by email
  const customerMap = {};
  orders.forEach((o) => {
    const email = o.address?.email || "guest@bitezy.com";
    if (!customerMap[email]) {
      customerMap[email] = {
        name: `${o.address?.firstName || 'Valued'} ${o.address?.lastName || 'Foodie'}`.trim(),
        email: email,
        phone: o.address?.phone || 'N/A',
        city: `${o.address?.city || ''}, ${o.address?.state || ''}`.trim(),
        orderCount: 0,
        totalSpend: 0,
        orders: []
      };
    }
    customerMap[email].orderCount += 1;
    customerMap[email].totalSpend += Number(o.amount) || 0;
    customerMap[email].orders.push(o);
  });

  const customerList = Object.values(customerMap).filter((c) => {
    const query = searchTerm.toLowerCase();
    return c.name.toLowerCase().includes(query) || c.email.toLowerCase().includes(query) || c.phone.includes(query);
  });

  return (
    <div className="customers-page">
      <div className="page-header-row">
        <div>
          <span className="admin-tag">CUSTOMER RELATIONSHIPS</span>
          <h1 className="admin-page-title">Customer Directory</h1>
          <p className="admin-page-subtitle">Track customer profiles, ordering frequencies, and total lifetime spend.</p>
        </div>

        <div className="search-bar-box">
          <input
            type="text"
            placeholder="Search by name, email, or phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="customers-card">
        {customerList.length === 0 ? (
          <div className="empty-state">
            <p>No customer profiles found. Once customers place orders in BITEZY, they will appear here automatically.</p>
          </div>
        ) : (
          <div className="admin-table-wrapper">
            <table className="admin-modern-table">
              <thead>
                <tr>
                  <th>Customer</th>
                  <th>Contact Info</th>
                  <th>Location</th>
                  <th>Total Orders</th>
                  <th>Lifetime Spend</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {customerList.map((cust, idx) => (
                  <tr key={idx}>
                    <td>
                      <div className="cust-avatar-cell">
                        <div className="cust-avatar-circle">
                          {cust.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <strong>{cust.name}</strong>
                          <span className="cust-member-tag">BITEZY Member</span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="contact-cell">
                        <span>✉️ {cust.email}</span>
                        <span>📞 {cust.phone}</span>
                      </div>
                    </td>
                    <td>{cust.city || 'N/A'}</td>
                    <td>
                      <span className="orders-badge-pill">
                        {cust.orderCount} {cust.orderCount === 1 ? 'order' : 'orders'}
                      </span>
                    </td>
                    <td>
                      <strong className="spend-value">${cust.totalSpend.toFixed(2)}</strong>
                    </td>
                    <td>
                      <button
                        type="button"
                        className="btn-view-history"
                        onClick={() => setSelectedCustomer(cust)}
                      >
                        Order History
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Customer Order History Modal */}
      {selectedCustomer && (
        <div className="modal-backdrop" onClick={(e) => { if (e.target === e.currentTarget) setSelectedCustomer(null); }}>
          <div className="customer-modal-card">
            <div className="modal-header">
              <div>
                <h2>{selectedCustomer.name}'s Orders</h2>
                <p>{selectedCustomer.email} • {selectedCustomer.orderCount} lifetime orders</p>
              </div>
              <button className="modal-close-btn" onClick={() => setSelectedCustomer(null)}>✕</button>
            </div>

            <div className="modal-orders-list">
              {selectedCustomer.orders.map((ord, i) => (
                <div key={i} className="customer-order-tile">
                  <div className="order-tile-header">
                    <strong>Order #{String(ord._id).slice(-6).toUpperCase()}</strong>
                    <span className="tile-status">{ord.status}</span>
                  </div>
                  <div className="order-tile-items">
                    {ord.items?.map((it, j) => (
                      <span key={j} className="tile-item-pill">
                        {it.name} x{it.quantity}
                      </span>
                    ))}
                  </div>
                  <div className="order-tile-footer">
                    <span>Amount: <strong>${Number(ord.amount).toFixed(2)}</strong></span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Customers;
