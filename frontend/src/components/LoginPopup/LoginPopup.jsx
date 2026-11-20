import React, { useContext, useState } from 'react';
import './LoginPopup.css';
import { StoreContext } from './../context/StoreContext';
import axios from 'axios';
import BitezyLogo from '../BitezyLogo/BitezyLogo';

const LoginPopup = ({ setShowLogin }) => {
  const { url, setToken } = useContext(StoreContext);

  const [currentState, setCurrentState] = useState('Login');
  const [showPassword, setShowPassword] = useState(false);
  const [data, setData] = useState({
    name: "",
    email: "",
    password: ""
  });
  const [errorMsg, setErrorMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const onChangeHandler = (event) => {
    const { name, value } = event.target;
    setData(prev => ({ ...prev, [name]: value }));
    if (errorMsg) setErrorMsg("");
  };

  const onLogin = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    setErrorMsg("");

    let endpoint = currentState === 'Login' ? "/api/user/login" : "/api/user/register";

    try {
      const response = await axios.post(`${url}${endpoint}`, data);

      if (response.data.success) {
        setToken(response.data.token);
        localStorage.setItem("token", response.data.token);
        setShowLogin(false);
      } else {
        setErrorMsg(response.data.message || "Authentication failed.");
      }
    } catch (error) {
      console.error(error);
      setErrorMsg("Could not connect to the backend server. Please verify the backend is running on port 4000.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-popup-overlay" onClick={(e) => { if (e.target === e.currentTarget) setShowLogin(false); }}>
      <div className="login-popup-modal">
        {/* Close Button */}
        <button
          className="login-popup-close-btn"
          onClick={() => setShowLogin(false)}
          aria-label="Close modal"
        >
          ✕
        </button>

        {/* Modal Header */}
        <div className="login-modal-header">
          <BitezyLogo size="md" showTagline={false} />
          <h2 className="login-heading">
            {currentState === 'Login' ? 'Welcome Back!' : 'Join BITEZY Today'}
          </h2>
          <p className="login-subtext">
            {currentState === 'Login'
              ? 'Log in to track orders, save favorites, and enjoy hot meals.'
              : 'Sign up to unlock 30% OFF vouchers and fast delivery.'}
          </p>

          {/* Tab Switcher */}
          <div className="auth-tab-pills">
            <button
              type="button"
              className={`auth-tab-btn ${currentState === 'Login' ? 'active' : ''}`}
              onClick={() => { setCurrentState('Login'); setErrorMsg(''); }}
            >
              Sign In
            </button>
            <button
              type="button"
              className={`auth-tab-btn ${currentState === 'Sign Up' ? 'active' : ''}`}
              onClick={() => { setCurrentState('Sign Up'); setErrorMsg(''); }}
            >
              Create Account
            </button>
          </div>
        </div>

        {/* Error notification */}
        {errorMsg && (
          <div className="auth-error-alert">
            <span>⚠️ {errorMsg}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={onLogin} className="login-modal-form">
          {currentState === 'Sign Up' && (
            <div className="form-field-group">
              <label>Full Name</label>
              <div className="input-with-icon">
                <input
                  name="name"
                  onChange={onChangeHandler}
                  value={data.name}
                  type="text"
                  placeholder="E.g. Sarah Jenkins"
                  required
                />
              </div>
            </div>
          )}

          <div className="form-field-group">
            <label>Email Address</label>
            <div className="input-with-icon">
              <input
                name="email"
                onChange={onChangeHandler}
                value={data.email}
                type="email"
                placeholder="name@example.com"
                required
              />
            </div>
          </div>

          <div className="form-field-group">
            <label>Password</label>
            <div className="input-with-icon password-input-box">
              <input
                name="password"
                onChange={onChangeHandler}
                value={data.password}
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                className="pwd-toggle-btn"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                    <line x1="1" y1="1" x2="23" y2="23"></line>
                  </svg>
                ) : (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                  </svg>
                )}
              </button>
            </div>
          </div>

          <div className="auth-terms-row">
            <input type="checkbox" id="terms-check" required defaultChecked />
            <label htmlFor="terms-check">
              I agree to the BITEZY <a href="#terms" onClick={(e) => e.preventDefault()}>Terms of Service</a> & <a href="#privacy" onClick={(e) => e.preventDefault()}>Privacy Policy</a>.
            </label>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`btn-primary auth-submit-btn ${isLoading ? 'loading' : ''}`}
          >
            {isLoading ? (
              <span>Please wait...</span>
            ) : (
              <span>{currentState === 'Sign Up' ? 'Create BITEZY Account' : 'Sign In to BITEZY'}</span>
            )}
          </button>
        </form>

        {/* Footer switch */}
        <div className="login-modal-footer">
          {currentState === 'Login' ? (
            <p>
              New to BITEZY?{' '}
              <button
                type="button"
                className="auth-switch-link"
                onClick={() => { setCurrentState('Sign Up'); setErrorMsg(''); }}
              >
                Create an account
              </button>
            </p>
          ) : (
            <p>
              Already have a BITEZY account?{' '}
              <button
                type="button"
                className="auth-switch-link"
                onClick={() => { setCurrentState('Login'); setErrorMsg(''); }}
              >
                Sign in here
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginPopup;
