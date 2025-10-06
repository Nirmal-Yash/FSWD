// src/components/ProtectedRoute.js
import React from 'react';

// This component now just renders children without checking authentication
const ProtectedRoute = ({ children }) => {
  return children;
};

export default ProtectedRoute;