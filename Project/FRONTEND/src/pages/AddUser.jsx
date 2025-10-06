import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  FaUserPlus, 
  FaUserCircle, 
  FaBars, 
  FaSignOutAlt, 
  FaKey,
  FaCalendarAlt,
  FaChartBar,
  FaBox,
  FaCashRegister,
  FaUsers,
  FaFolder,
  FaArrowLeft
} from 'react-icons/fa';
import '../styles/dashboard.css';
import '../styles/AddUser.css';

const AddUser = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    fullName: '',
    email: '',
    password: '',
    role: 'SALES_STAFF'
  });
  const [formErrors, setFormErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [userData] = useState({
    name: 'Admin User',
    email: 'admin@miratextile.com'
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    // Clear error when field is updated
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: null
      });
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.username.trim()) errors.username = 'Username is required';
    if (!formData.fullName.trim()) errors.fullName = 'Full name is required';
    if (!formData.email.trim()) errors.email = 'Email is required';
    if (!formData.password.trim()) errors.password = 'Password is required';
    if (formData.password.length < 8) errors.password = 'Password must be at least 8 characters';
    if (!formData.role) errors.role = 'Role is required';

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch('http://localhost:5000/api/admin/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          username: formData.username,
          fullName: formData.fullName,
          email: formData.email,
          password: formData.password,
          role: formData.role
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create user');
      }

      setSuccessMessage('User created successfully!');
      setTimeout(() => {
        navigate('/UserManagement');
      }, 1500);

    } catch (error) {
      console.error('Error creating user:', error);
      setErrorMessage(error.message || 'An error occurred while creating the user');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const toggleUserMenu = () => {
    setUserMenuOpen(!userMenuOpen);
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const handleResetPassword = () => {
    navigate('/ResetPassword');
  };

  const handleUser = () => {
    navigate('/Profile');
  };

  return (
    <div className="admin-dashboard">
      {/* Sidebar */}
      <div className={`sidebar ${sidebarCollapsed ? 'collapsed' : ''}`}>
        <div className="sidebar-header">
          <h3>Mira Textile</h3>
          <button className="collapse-btn" onClick={toggleSidebar}>
            <FaBars />
          </button>
        </div>
        <ul className="sidebar-menu">
          <li><Link to="/dashboard"><FaChartBar /> <span>Dashboard</span></Link></li>
          <li><Link to="/inventory/manage"><FaBox /> <span>Inventory</span></Link></li>
          <li><Link to="/pos"><FaCashRegister /> <span>POS</span></Link></li>
          <li><Link to="/CustomerManagement"><FaUsers /> <span>Customers</span></Link></li>
          <li className="active"><Link to="/UserManagement"><FaUserCircle /> <span>Users</span></Link></li>
          <li><Link to="/Reportingpage"><FaFolder /> <span>Reports</span></Link></li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="main-content" style={{ marginLeft: sidebarCollapsed ? '70px' : '240px' }}>
        {/* Top Bar */}
        <div className="top-bar">
          <div className="page-title">
            <h1>Add New User</h1>
            <p className="subtitle">Create a new system user account</p>
          </div>
          <div className="top-bar-actions">
            <div className="date-display">
              <FaCalendarAlt />
              <span>{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
            </div>
            
            <div className="user-menu-container">
              <button className="user-menu-btn" onClick={toggleUserMenu}>
                <FaUserCircle />
              </button>
              
              {userMenuOpen && (
                <div className="user-popup">
                  <div className="user-info">
                    <div className="user-avatar">
                      <FaUserCircle />
                    </div>
                    <div className="user-details">
                      <h3>{userData.name}</h3>
                      <p>{userData.email}</p>
                      <span className="user-role">Admin</span>
                    </div>
                  </div>
                  <div className="user-actions">
                    <button className="view-profile-btn" onClick={handleUser}>
                      <FaUserCircle /> View Profile
                    </button>
                    <button className="reset-password-btn" onClick={handleResetPassword}>
                      <FaKey /> Reset Password
                    </button>
                    <button className="logout-btn" onClick={handleLogout}>
                      <FaSignOutAlt /> Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Add User Form */}
        <div className="add-user-page">
          <div className="add-user-card">
            <div className="form-header">
              <button className="back-button" onClick={() => navigate('/UserManagement')}>
                <FaArrowLeft /> Back to Users
              </button>
              <h2>User Information</h2>
            </div>

            {successMessage && (
              <div className="success-message">
                {successMessage}
              </div>
            )}

            {errorMessage && (
              <div className="error-message">
                {errorMessage}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="username">Username</label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  placeholder="Enter username"
                  className={formErrors.username ? 'error' : ''}
                />
                {formErrors.username && <span className="error-message">{formErrors.username}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="fullName">Full Name</label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  placeholder="Enter full name"
                  className={formErrors.fullName ? 'error' : ''}
                />
                {formErrors.fullName && <span className="error-message">{formErrors.fullName}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter email address"
                  className={formErrors.email ? 'error' : ''}
                />
                {formErrors.email && <span className="error-message">{formErrors.email}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Enter password"
                  className={formErrors.password ? 'error' : ''}
                />
                {formErrors.password && <span className="error-message">{formErrors.password}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="role">Role</label>
                <select
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  className={formErrors.role ? 'error' : ''}
                >
                  <option value="SALES_STAFF">Sales Staff</option>
                  <option value="INVENTORY_STAFF">Inventory Staff</option>
                </select>
                {formErrors.role && <span className="error-message">{formErrors.role}</span>}
              </div>

              <div className="form-actions">
                <button type="submit" className="submit-button" disabled={isLoading}>
                  {isLoading ? 'Creating User...' : 'Create User'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddUser; 