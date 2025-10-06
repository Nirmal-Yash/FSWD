// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Dashboard from './pages/Dashboard';
import UserManagement from './pages/UserManagement';
import InventoryStaff from './pages/InventoryStaff';
import Profile from './pages/Profile';
import POS from './pages/POS';
import CustomerManagement from './pages/CustomerManagement';
import Reportingpage from './pages/Reportingpage';
import AddUser from './pages/AddUser';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/ResetPassword" element={<ResetPassword />} />
        
        {/* Dashboard Routes */}
        <Route path="/" element={<Navigate to="/dashboard" />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/admin/dashboard" element={<Dashboard />} />
        <Route path="/admin/add-user" element={<AddUser />} />
        <Route path="/UserManagement" element={<UserManagement />} />
        <Route path="/Profile" element={<Profile />} />
        <Route path="/pos" element={<POS />} />
        <Route path="/inventory/manage" element={<InventoryStaff />} />
        <Route path="/InventoryManagement" element={<InventoryStaff />} />
        <Route path="/CustomerManagement" element={<CustomerManagement />} />
        <Route path="/Reportingpage" element={<Reportingpage />} />

        {/* Redirect legacy routes */}
        <Route path="/inventory" element={<Navigate to="/InventoryManagement" />} />
        <Route path="/InventoryStaff" element={<Navigate to="/InventoryManagement" />} />
        <Route path="/sales/pos" element={<Navigate to="/pos" />} />
        <Route path="/orders" element={<Navigate to="/pos" />} />
        <Route path="/payment" element={<Navigate to="/pos" />} />
        <Route path="/reporting" element={<Navigate to="/Reportingpage" />} />
        <Route path="/manager-dashboard" element={<Navigate to="/dashboard" />} />
      </Routes>
    </Router>
  );
}

export default App;