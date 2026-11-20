import React, { useContext, useState, useEffect } from 'react';
import './Navbar.css';
import { assets } from './../../assets/assets';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { StoreContext } from './../context/StoreContext';
import BitezyLogo from '../BitezyLogo/BitezyLogo';

const Navbar = ({ setShowLogin }) => {
  const [activeTab, setActiveTab] = useState('home');
  const [showSearchBar, setShowSearchBar] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const { getTotalCartCount, token, setToken, searchQuery, setSearchQuery } = useContext(StoreContext);
  const navigate = useNavigate();
  const location = useLocation();
  const adminUrl = import.meta.env.VITE_ADMIN_URL || (import.meta.env.DEV ? 'http://localhost:5174' : '/admin');

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const logout = () => {
    localStorage.removeItem('token');
    setToken('');
    setProfileDropdownOpen(false);
    navigate('/');
  };

  const handleNavClick = (tab, targetId) => {
    setActiveTab(tab);
    setMobileMenuOpen(false);

    if (location.pathname !== '/') {
      navigate('/');
      setTimeout(() => {
        if (targetId) {
          const el = document.getElementById(targetId);
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }
      }, 150);
    } else if (targetId) {
      const el = document.getElementById(targetId);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const cartCount = getTotalCartCount ? getTotalCartCount() : 0;

  return (
    <header className={`navbar-wrapper ${scrolled ? 'scrolled' : ''}`}>
      <nav className="navbar">
        {/* Brand Logo */}
        <Link to="/" onClick={() => handleNavClick('home')} className="navbar-brand">
          <BitezyLogo size="md" showTagline={false} />
        </Link>

        {/* Desktop Navigation Links */}
        <ul className="navbar-menu">
          <li>
            <Link
              to="/"
              onClick={() => handleNavClick('home')}
              className={`nav-link ${activeTab === 'home' ? 'active' : ''}`}
            >
              Home
            </Link>
          </li>
          <li>
            <a
              href="#explore-menu"
              onClick={(e) => {
                e.preventDefault();
                handleNavClick('explore', 'explore-menu');
              }}
              className={`nav-link ${activeTab === 'explore' ? 'active' : ''}`}
            >
              Explore
            </a>
          </li>
          <li>
            <a
              href="#food-display"
              onClick={(e) => {
                e.preventDefault();
                handleNavClick('menu', 'food-display');
              }}
              className={`nav-link ${activeTab === 'menu' ? 'active' : ''}`}
            >
              Menu
            </a>
          </li>
          <li>
            <a
              href="#footer"
              onClick={(e) => {
                e.preventDefault();
                handleNavClick('contact', 'footer');
              }}
              className={`nav-link ${activeTab === 'contact' ? 'active' : ''}`}
            >
              Contact
            </a>
          </li>
        </ul>

        {/* Right Action Icons & Auth */}
        <div className="navbar-right">
          {/* Search container */}
          <div className={`navbar-search-container ${showSearchBar ? 'expanded' : ''}`}>
            <button
              type="button"
              className="search-btn"
              onClick={() => setShowSearchBar(!showSearchBar)}
              aria-label="Toggle search"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </button>
            <input
              type="text"
              placeholder="Search dishes, cuisine..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`search-input ${showSearchBar ? 'visible' : ''}`}
            />
            {showSearchBar && searchQuery && (
              <button 
                type="button" 
                className="search-clear-btn" 
                onClick={() => setSearchQuery('')}
              >
                ✕
              </button>
            )}
          </div>

          {/* Cart Icon with badge */}
          <Link to="/cart" className="navbar-cart-btn" aria-label="View Cart">
            <div className="cart-icon-wrapper">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <path d="M16 10a4 4 0 0 1-8 0"></path>
              </svg>
              {cartCount > 0 && (
                <span className="cart-badge-count">{cartCount}</span>
              )}
            </div>
          </Link>

          {/* Admin Portal Direct Link */}
          <a
            href={adminUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="navbar-admin-link"
            title="Open BITEZY Admin Portal"
          >
            <span>⚙️ Admin</span>
          </a>

          {/* Auth State */}
          {!token ? (
            <button 
              className="navbar-signin-btn" 
              onClick={() => setShowLogin(true)}
            >
              Sign In
            </button>
          ) : (
            <div 
              className="navbar-profile-wrapper"
              onMouseEnter={() => setProfileDropdownOpen(true)}
              onMouseLeave={() => setProfileDropdownOpen(false)}
            >
              <button 
                className="navbar-profile-avatar"
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                aria-label="User Profile"
              >
                <span className="avatar-initials">BZ</span>
              </button>

              {profileDropdownOpen && (
                <div className="profile-dropdown-card">
                  <div className="profile-header">
                    <p className="profile-greeting">Hungry Foodie</p>
                    <span className="profile-badge">BITEZY Member</span>
                  </div>
                  <hr className="dropdown-divider" />
                  <button 
                    className="dropdown-item"
                    onClick={() => {
                      setProfileDropdownOpen(false);
                      navigate('/myorders');
                    }}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
                      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
                    </svg>
                    <span>My Orders</span>
                  </button>
                  <a
                    href={adminUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="dropdown-item"
                    onClick={() => setProfileDropdownOpen(false)}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="3" width="7" height="7"></rect>
                      <rect x="14" y="3" width="7" height="7"></rect>
                      <rect x="14" y="14" width="7" height="7"></rect>
                      <rect x="3" y="14" width="7" height="7"></rect>
                    </svg>
                    <span>Admin Dashboard</span>
                  </a>
                  <button 
                    className="dropdown-item logout"
                    onClick={logout}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                      <polyline points="16 17 21 12 16 7"></polyline>
                      <line x1="21" y1="12" x2="9" y2="12"></line>
                    </svg>
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Mobile hamburger toggle */}
          <button 
            className="mobile-menu-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
          >
            <span className={`hamburger-bar ${mobileMenuOpen ? 'open' : ''}`}></span>
            <span className={`hamburger-bar ${mobileMenuOpen ? 'open' : ''}`}></span>
            <span className={`hamburger-bar ${mobileMenuOpen ? 'open' : ''}`}></span>
          </button>
        </div>
      </nav>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="mobile-drawer">
          <ul className="mobile-menu-links">
            <li>
              <Link to="/" onClick={() => handleNavClick('home')}>Home</Link>
            </li>
            <li>
              <a href="#explore-menu" onClick={(e) => { e.preventDefault(); handleNavClick('explore', 'explore-menu'); }}>Explore Categories</a>
            </li>
            <li>
              <a href="#food-display" onClick={(e) => { e.preventDefault(); handleNavClick('menu', 'food-display'); }}>Food Menu</a>
            </li>
            <li>
              <a href="#footer" onClick={(e) => { e.preventDefault(); handleNavClick('contact', 'footer'); }}>Contact Us</a>
            </li>
            <li>
              <a href={adminUrl} target="_blank" rel="noopener noreferrer">⚙️ Admin Portal</a>
            </li>
            {token ? (
              <>
                <li className="mobile-divider"></li>
                <li>
                  <Link to="/myorders" onClick={() => setMobileMenuOpen(false)}>My Orders</Link>
                </li>
                <li>
                  <button className="mobile-logout-btn" onClick={logout}>Sign Out</button>
                </li>
              </>
            ) : (
              <li className="mobile-auth-wrapper">
                <button 
                  className="btn-primary mobile-signin-btn"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setShowLogin(true);
                  }}
                >
                  Sign In / Register
                </button>
              </li>
            )}
          </ul>
        </div>
      )}
    </header>
  );
};

export default Navbar;
