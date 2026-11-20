import React, { useState } from 'react';
import './Navbar.css';
import BitezyLogo from '../BitezyLogo/BitezyLogo';

const Navbar = ({ toggleSidebar, sidebarCollapsed }) => {
  const [profileOpen, setProfileOpen] = useState(false);

  return (
    <header className="admin-navbar-header">
      <div className="admin-navbar-left">
        <button 
          type="button" 
          className="sidebar-toggle-btn" 
          onClick={toggleSidebar}
          aria-label="Toggle sidebar navigation"
          title={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
        </button>

        <a href="/" className="admin-brand-link">
          <BitezyLogo size="sm" showAdminBadge={true} />
        </a>
      </div>

      <div className="admin-navbar-right">
        {/* Backend Status indicator */}
        <div className="server-status-pill">
          <span className="status-indicator-dot online"></span>
          <span className="status-label">Backend Connected</span>
        </div>

        {/* View Customer App Link */}
        <a 
          href="http://localhost:5173" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="view-store-btn"
          title="Open live customer food store in new tab"
        >
          <span>Live Store</span>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
            <polyline points="15 3 21 3 21 9"></polyline>
            <line x1="10" y1="14" x2="21" y2="3"></line>
          </svg>
        </a>

        {/* Admin Profile */}
        <div className="admin-profile-container">
          <button 
            type="button" 
            className="admin-profile-pill" 
            onClick={() => setProfileOpen(!profileOpen)}
            aria-label="Admin settings"
          >
            <div className="admin-avatar">AD</div>
            <div className="admin-info-text">
              <span className="admin-name">Admin Manager</span>
              <span className="admin-role">Super Admin</span>
            </div>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </button>

          {profileOpen && (
            <div className="admin-dropdown-menu">
              <div className="admin-dropdown-head">
                <strong>BITEZY Headquarters</strong>
                <p>admin@bitezy.com</p>
              </div>
              <hr className="admin-dropdown-sep" />
              <a href="http://localhost:5173" target="_blank" rel="noopener noreferrer" className="admin-dropdown-link">
                <span>View Customer App</span>
                <span className="shortcut-tag">↗</span>
              </a>
              <button 
                type="button" 
                className="admin-dropdown-link" 
                onClick={() => {
                  setProfileOpen(false);
                  window.location.reload();
                }}
              >
                <span>Refresh Dashboard Data</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
