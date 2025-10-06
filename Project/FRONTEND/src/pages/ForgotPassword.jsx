import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaEnvelope, FaArrowLeft } from 'react-icons/fa';
import LoadingAnimation from '../components/LoadingAnimation';
import '../styles/Auth.css';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setPageLoading(false);
    }, 800);
    
    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!email || !email.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }
    
    setIsSubmitting(true);
    setError('');
    
    // Simulate API call with timeout
    setTimeout(() => {
      setSuccessMessage('Password reset instructions have been sent to your email.');
      setEmail(''); // Clear the email field
      setError('');
      setIsSubmitting(false);
    }, 1500);
  };
  
  if (pageLoading) {
    return <LoadingAnimation size="large" fullPage text="Loading..." />;
  }

  return (
    <div className="luxury-auth-container">
      <div className="luxury-auth-wrapper">
        <div className="luxury-auth-image">
          <div className="overlay">
            <div className="brand-content">
              <h1>Mira Textile</h1>
              <p>Clothing Management & Distribution System</p>
            </div>
          </div>
        </div>
        
        <div className="luxury-auth-form">
          <div className="logo-container">
            <img src="/templates/logo1.png" alt="Mira Textile Logo" className="auth-logo" />
          </div>
          
          <h2>Reset Password</h2>
          <p className="subtitle">Enter your email to receive reset instructions</p>
          
          {error && (
            <div className="luxury-error">
              <p>{error}</p>
            </div>
          )}
          
          {successMessage && (
            <div className="luxury-success">
              <p>{successMessage}</p>
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            <div className="luxury-input-group">
              <div className="input-icon">
                <FaEnvelope />
              </div>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            
            <p className="reset-instructions">
              We'll send you an email with instructions to reset your password.
            </p>
            
            <button 
              type="submit" 
              className={`luxury-button ${isSubmitting ? 'submitting' : ''}`}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <LoadingAnimation size="small" />
              ) : (
                <span>Send Reset Instructions</span>
              )}
            </button>
            
            <div className="back-to-login">
              <Link to="/login" className="back-link">
                <FaArrowLeft /> Back to Login
              </Link>
            </div>
          </form>
          
          <div className="login-footer">
            <p>© 2023 Mira Textile. All rights reserved.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;