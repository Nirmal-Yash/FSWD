// src/context/AuthContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';
import { fetchUserProfile } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check authentication status on mount
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      
      if (token) {
        try {
          const userData = await fetchUserProfile();
          setUser(userData);
        } catch (error) {
          console.error('Error fetching user profile:', error);
          // Clear invalid token
          localStorage.removeItem('token');
          setUser(null);
        }
      }
      
      setLoading(false);
    };
    
    checkAuth();
  }, []);

  const login = (userData) => {
    setUser(userData);
    // Token is already stored by the login API call
    console.log('User logged in:', userData);
  };

  const logout = () => {
    try {
      // Clear all auth data
      localStorage.removeItem('token');
      localStorage.removeItem('userName');
      localStorage.removeItem('userEmail');
      localStorage.removeItem('userRole');
      setUser(null);
      
      console.log('User logged out');
    } catch (error) {
      console.error('Error during logout:', error);
      // Still clear user even if there's an error
      setUser(null);
    }
  };

  const value = {
    user,
    loading,
    login,
    logout,
    isAuthenticated: !!user
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);