// src/components/Layout.js
import React from 'react';
import Navbar from './Navbar';
import { Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Layout = () => {
  const { user } = useAuth();
  const userRole = user ? user.role : 'Guest';

  return (
    <div>
      <Navbar userRole={userRole} />
      <div style={{ paddingTop: '60px' }}>
        <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Layout;