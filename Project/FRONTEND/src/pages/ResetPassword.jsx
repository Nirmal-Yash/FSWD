import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash, FaLock, FaKey, FaArrowLeft, FaTimes } from 'react-icons/fa';
import LoadingAnimation from '../components/LoadingAnimation';
import '../styles/Auth.css';

const ResetPassword = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    // Simulate initial page loading
    const timer = setTimeout(() => {
      setPageLoading(false);
    }, 800);
    
    return () => clearTimeout(timer);
  }, []);

  const handleCancel = () => {
    navigate(-1); // Go back to the previous page
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    // Clear error when typing
    if (error) {
      setError('');
    }
  };

  const validateForm = () => {
    if (!formData.password.trim()) {
      setError('New password is required');
      return false;
    }
    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters');
      return false;
    }
    if (!formData.confirmPassword.trim()) {
      setError('Please confirm your password');
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSuccessMessage('Password has been reset successfully!');
      setError('');
      
      // Clear form
      setFormData({
        password: '',
        confirmPassword: ''
      });
      
      // Redirect after 2 seconds
      setTimeout(() => {
        window.location.href = '/login';
      }, 2000);
    } catch (error) {
      setError('Failed to reset password. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (pageLoading) {
    return <LoadingAnimation size="large" fullPage text="Loading Mira Textile..." />;
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
            <div className="luxury-logo">MT</div>
          </div>
          
          <h2>Reset Password</h2>
          <p className="subtitle">Enter your new password below</p>
          
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
                <FaLock />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Enter new password"
                value={formData.password}
                onChange={handleChange}
                minLength="8"
                required
              />
              <div 
                className="luxury-password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </div>
            </div>
            
            <div className="luxury-input-group">
              <div className="input-icon">
                <FaKey />
              </div>
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                placeholder="Confirm new password"
                value={formData.confirmPassword}
                onChange={handleChange}
                minLength="8"
                required
              />
              <div 
                className="luxury-password-toggle"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </div>
            </div>
            
            <div className="password-requirements">
              <div className="requirements-header">
                <h3>Password Requirements</h3>
                <div className="strength-indicator">
                  <span className="strength-label">Password Strength:</span>
                  <div className="strength-bar">
                    <div 
                      className="strength-fill"
                      style={{ 
                        width: `${Math.min((formData.password.length / 8) * 100, 100)}%`,
                        backgroundColor: formData.password.length >= 8 ? '#27ae60' : '#e74c3c'
                      }}
                    ></div>
                  </div>
                </div>
              </div>
              
              <div className="requirements-list">
                <div className={`requirement-item ${formData.password.length >= 8 ? 'valid' : ''}`}>
                  <div className="requirement-icon">
                    {formData.password.length >= 8 ? '✓' : '✗'}
                  </div>
                  <div className="requirement-content">
                    <span className="requirement-text">At least 8 characters</span>
                    {formData.password.length > 0 && (
                      <span className="character-count">
                        {formData.password.length}/8 characters
                      </span>
                    )}
                  </div>
                </div>
                
                <div className={`requirement-item ${formData.password === formData.confirmPassword && formData.password ? 'valid' : ''}`}>
                  <div className="requirement-icon">
                    {formData.password === formData.confirmPassword && formData.password ? '✓' : '✗'}
                  </div>
                  <div className="requirement-content">
                    <span className="requirement-text">Passwords match</span>
                    {formData.confirmPassword && (
                      <span className="match-status">
                        {formData.password === formData.confirmPassword ? 'Matching' : 'Not matching'}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="form-actions">
              <button 
                type="submit" 
                className={`luxury-button ${isSubmitting ? 'submitting' : ''}`}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <LoadingAnimation size="small" />
                ) : (
                  <>
                    <span>Reset Password</span>
                    <FaKey />
                  </>
                )}
              </button>
              
              <button 
                type="button" 
                className="luxury-button cancel-button"
                onClick={handleCancel}
              >
                <span>Cancel</span>
                <FaTimes />
              </button>
            </div>
          </form>
          
          <div className="back-to-login">
            <Link to="/login" className="back-link">
              <FaArrowLeft /> Back to Login
            </Link>
          </div>
          
          <div className="login-footer">
            <p>© 2023 Mira Textile. All rights reserved.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword; 