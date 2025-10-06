// src/components/Navbar.js
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css'; // New CSS file for Navbar styling

const Navbar = ({ userRole }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleLogout = () => {
    try {
      logout(); // Clear user state from context
      // Remove all stored data
      localStorage.clear();
      sessionStorage.clear();
      // Navigate to login page
      navigate('/login');
    } catch (error) {
      console.error('Error during logout:', error);
      // Fallback direct navigation if anything fails
      window.location.href = '/login';
    } finally {
      setIsDropdownOpen(false); // Close dropdown after logout attempt
    }
  };

  return (
    <nav className="navbar">
      <div className="logo">
        <Link to="/" className="logo-link">
          <img src="/templates/logo.png" alt="Mira Textile Logo" className="logo-image" />
        </Link>
      </div>
      <ul className="nav-links">
        <li><Link to="/dashboard" className="nav-link">Home</Link></li>
        <li><Link to="/inventory" className="nav-link">Product</Link></li>
      </ul>
      {user && (
        <div className="user-profile" onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
          <span className="user-role">Welcome, {userRole}</span>
          {isDropdownOpen && (
            <div className="dropdown">
              <Link to="/profile" className="dropdown-item">Profile</Link>
              <Link to="/settings" className="dropdown-item">Settings</Link>
              <Link to="#" onClick={handleLogout} className="dropdown-item">Logout</Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;