import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Dashboard from './pages/Dashboard';
import InventoryStaff from './pages/InventoryStaff';
import POS from './pages/POS';
import CustomerManagement from './pages/CustomerManagement';
import Reportingpage from './pages/Reportingpage';
import Profile from './pages/Profile';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/inventory/manage" element={<InventoryStaff />} />
        <Route path="/pos" element={<POS />} />
        <Route path="/CustomerManagement" element={<CustomerManagement />} />
        <Route path="/Reportingpage" element={<Reportingpage />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </Router>
  );
}

export default App; 