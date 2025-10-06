import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  FaUsers, 
  FaUserPlus, 
  FaEdit, 
  FaTrash, 
  FaPhone, 
  FaUserCircle,
  FaBars,
  FaSync,
  FaSignOutAlt,
  FaKey,
  FaSearch,
  FaFilter,
  FaEnvelope,
  FaCreditCard,
  FaHistory,
  FaTimes,
  FaChartBar,
  FaBox,
  FaCashRegister,
  FaFolder,
  FaEye,
  FaCalendarAlt
} from 'react-icons/fa';
import { AiFillIdcard } from 'react-icons/ai';
import '../styles/dashboard.css';
import '../styles/customer.css';
import '../styles/pos.css';
import LoadingAnimation from '../components/LoadingAnimation';
import { useAuth } from '../context/AuthContext';

// API Configuration
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000/api';
const API_CONFIG = {
  ENDPOINTS: {
    AUTH: {
      LOGOUT: '/auth/logout'
    }
  },
  TOKEN_KEY: 'auth_token'
};

const CustomerManagement = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [customers, setCustomers] = useState([]);
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [openAddEditModal, setOpenAddEditModal] = useState(false);
  const [openInteractionModal, setOpenInteractionModal] = useState(false);
  const [openDetailsModal, setOpenDetailsModal] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [interactions, setInteractions] = useState([]);
  const [tabValue, setTabValue] = useState(0);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [userData, setUserData] = useState({
    name: user?.full_name || user?.username || '',
    email: user?.email || '',
    role: user?.role || ''
  });
  
  // Form states
  const [formData, setFormData] = useState({
    name: '',
    contact_info: '',
    phone: '',
    credit_limit: ''
  });
  
  const [interactionData, setInteractionData] = useState({
    interaction_type: '',
    details: ''
  });
  
  const [formErrors, setFormErrors] = useState({});
  const [interactionErrors, setInteractionErrors] = useState({});
  
  useEffect(() => {
    fetchCustomers();
    fetchUserData();
  }, [user]);
  
  useEffect(() => {
    filterCustomers();
  }, [searchTerm, customers]);
  
  const fetchCustomers = async () => {
    setIsLoading(true);
    try {
      // For demo purposes, let's add some fake data
      const fakeCustomers = [
        { id: 1, name: 'John Doe', contact_info: 'john@example.com', phone: '9876543210', credit_limit: 5000, credit_used: 1200, last_purchase: '2024-05-12', status: 'Active' },
        { id: 2, name: 'Jane Smith', contact_info: 'jane@example.com', phone: '8765432109', credit_limit: 10000, credit_used: 7500, last_purchase: '2024-05-10', status: 'Active' },
        { id: 3, name: 'Bob Johnson', contact_info: 'bob@example.com', phone: '7654321098', credit_limit: 7500, credit_used: 1500, last_purchase: '2024-05-05', status: 'Active' },
        { id: 4, name: 'Alice Brown', contact_info: 'alice@example.com', phone: '6543210987', credit_limit: 12000, credit_used: 3000, last_purchase: '2024-04-28', status: 'Inactive' },
        { id: 5, name: 'Charlie Davis', contact_info: 'charlie@example.com', phone: '5432109876', credit_limit: 2500, credit_used: 0, last_purchase: '2024-04-20', status: 'Active' },
        { id: 6, name: 'Eva White', contact_info: 'eva@example.com', phone: '4321098765', credit_limit: 8000, credit_used: 4500, last_purchase: '2024-05-15', status: 'Active' },
        { id: 7, name: 'Frank Miller', contact_info: 'frank@example.com', phone: '3210987654', credit_limit: 15000, credit_used: 12000, last_purchase: '2024-05-01', status: 'Active' },
        { id: 8, name: 'Grace Lee', contact_info: 'grace@example.com', phone: '2109876543', credit_limit: 3000, credit_used: 3000, last_purchase: '2024-04-15', status: 'Blocked' }
      ];
      setCustomers(fakeCustomers);
      setFilteredCustomers(fakeCustomers);
    } catch (error) {
      console.error('Error fetching customers:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const fetchCustomerInteractions = async (customerId) => {
    try {
      // For demo purposes, let's add some fake data
      const today = new Date();
      const fakeInteractions = [
        { 
          id: 1, 
          interaction_type: 'Phone Call', 
          details: 'Discussed order #123', 
          date: '2024-05-14' 
        },
        { 
          id: 2, 
          interaction_type: 'Email', 
          details: 'Sent invoice for recent purchase', 
          date: '2024-05-10' 
        },
        { 
          id: 3, 
          interaction_type: 'In-Store Visit', 
          details: 'Customer browsed inventory, but did not purchase', 
          date: '2024-05-05' 
        }
      ];
      setInteractions(fakeInteractions);
    } catch (error) {
      console.error('Error fetching customer interactions:', error);
    }
  };
  
  const filterCustomers = () => {
    if (!searchTerm) {
      setFilteredCustomers(customers);
      return;
    }
    
    const filtered = customers.filter(
      customer => 
        customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.contact_info.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.phone.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    setFilteredCustomers(filtered);
  };
  
  const handleAddCustomer = () => {
    resetForm();
    setOpenAddEditModal(true);
  };
  
  const handleEditCustomer = (customer) => {
    setSelectedCustomer(customer);
    setFormData({
      name: customer.name,
      contact_info: customer.contact_info,
      phone: customer.phone,
      credit_limit: customer.credit_limit.toString()
    });
    setOpenAddEditModal(true);
  };
  
  const handleViewCustomer = async (customer) => {
    setSelectedCustomer(customer);
    await fetchCustomerInteractions(customer.id);
    setOpenDetailsModal(true);
  };
  
  const handleAddInteraction = (customer) => {
    setSelectedCustomer(customer);
    resetInteractionForm();
    setOpenInteractionModal(true);
  };
  
  const resetForm = () => {
    setFormData({
      name: '',
      contact_info: '',
      phone: '',
      credit_limit: ''
    });
    setFormErrors({});
  };
  
  const resetInteractionForm = () => {
    setInteractionData({
      interaction_type: '',
      details: ''
    });
    setInteractionErrors({});
  };
  
  const validateForm = () => {
    const errors = {};
    if (!formData.name) errors.name = 'Name is required';
    if (!formData.contact_info) errors.contact_info = 'Contact info is required';
    if (!formData.phone) errors.phone = 'Phone number is required';
    if (!formData.credit_limit || isNaN(formData.credit_limit)) errors.credit_limit = 'Valid credit limit is required';
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  const validateInteractionForm = () => {
    const errors = {};
    if (!interactionData.interaction_type) errors.interaction_type = 'Interaction type is required';
    if (!interactionData.details) errors.details = 'Details are required';
    
    setInteractionErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  const handleSubmitCustomer = async () => {
    if (!validateForm()) return;
    
    const customerData = {
      ...formData,
          credit_limit: parseFloat(formData.credit_limit)
        };
        
    // If editing an existing customer
    if (selectedCustomer) {
      try {
        // In a real app, this would be an API call to update
        const updatedCustomers = customers.map(c => 
          c.id === selectedCustomer.id ? { ...c, ...customerData } : c
        );
        setCustomers(updatedCustomers);
        setOpenAddEditModal(false);
      } catch (error) {
        console.error('Error updating customer:', error);
      }
    } 
    // If adding a new customer
    else {
      try {
        // In a real app, this would be an API call to create
        const newCustomer = {
          id: customers.length + 1,
          ...customerData,
          credit_used: 0,
          last_purchase: 'Never',
          status: 'Active'
        };
        setCustomers([...customers, newCustomer]);
      setOpenAddEditModal(false);
    } catch (error) {
        console.error('Error adding customer:', error);
      }
    }
  };
  
  const handleSubmitInteraction = async () => {
    if (!validateInteractionForm()) return;
    
    try {
      // In a real app, this would be an API call
      const newInteraction = {
        id: interactions.length + 1,
        ...interactionData,
        date: new Date().toISOString().split('T')[0]
      };
      setInteractions([newInteraction, ...interactions]);
      setOpenInteractionModal(false);
    } catch (error) {
      console.error('Error adding interaction:', error);
    }
  };
  
  const handleDeleteCustomer = async (customerId) => {
    if (window.confirm('Are you sure you want to delete this customer?')) {
      try {
        // In a real app, this would be an API call
      const updatedCustomers = customers.filter(c => c.id !== customerId);
      setCustomers(updatedCustomers);
    } catch (error) {
      console.error('Error deleting customer:', error);
      }
    }
  };
  
  const handleFormChange = (e) => {
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
  
  const handleInteractionChange = (e) => {
    const { name, value } = e.target;
    setInteractionData({
      ...interactionData,
      [name]: value
    });
    
    // Clear error when field is updated
    if (interactionErrors[name]) {
      setInteractionErrors({
        ...interactionErrors,
        [name]: null
      });
    }
  };
  
  const handleTabChange = (tabIndex) => {
    setTabValue(tabIndex);
  };
  
  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };
  
  const toggleUserMenu = () => {
    setUserMenuOpen(!userMenuOpen);
  };
  
  const closeUserMenu = () => {
    setUserMenuOpen(false);
  };
  
  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      try {
        // Optional: Try to call logout API endpoint
        fetch(`${API_BASE_URL}${API_CONFIG.ENDPOINTS.AUTH.LOGOUT}`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem(API_CONFIG.TOKEN_KEY)}`
          }
        }).catch(error => {
          console.log('Logout API error (continuing with local logout):', error);
        }).finally(() => {
          // Always execute this code to ensure local logout occurs
          localStorage.clear();
          sessionStorage.clear();
          navigate('/login');
        });
      } catch (error) {
        // Fallback in case of any errors
        console.log('Error during logout:', error);
        localStorage.clear();
        sessionStorage.clear();
        navigate('/login');
      }
    }
  };

  const handleResetPassword = () => {
    navigate('/ResetPassword');
  };

  const handleUser = () => {
    navigate('/Profile');
  };
  
  const formatDate = (dateString) => {
    if (dateString === 'Never') return 'Never';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
  const getCreditStatus = (used, limit) => {
    const ratio = used / limit;
    if (ratio >= 0.8) return 'credit-low';
    if (ratio >= 0.5) return 'credit-moderate';
    return 'credit-good';
  };
  
  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await fetch('http://localhost:8080/api/auth/profile', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch user data');
      }

      const data = await response.json();
      setUserData({
        name: data.full_name || data.username,
        email: data.email,
        role: data.role
      });
    } catch (error) {
      console.error('Error fetching user data:', error);
      setUserData({
        name: user?.full_name || user?.username || 'User',
        email: user?.email || '',
        role: user?.role || ''
      });
    }
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
          <li className="active"><Link to="/CustomerManagement"><FaUsers /> <span>Customers</span></Link></li>
          <li><Link to="/Reportingpage"><FaFolder /> <span>Reports</span></Link></li>
        </ul>
      </div>

      {/* Main Content */}
      <div className={`main-content ${sidebarCollapsed ? 'collapsed' : ''}`}>
        {/* Top Bar */}
        <div className="top-bar">
          <div className="page-title">
            <h1>Customer Management</h1>
            <p className="subtitle">Manage your customer accounts and interactions</p>
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
                      <h3>{userData.name || 'Demo User'}</h3>
                      <p>{userData.email || 'demo@miratextile.com'}</p>
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

        {/* Customer Management Content */}
        <div className="customers-page">
          {/* Search and Actions Bar */}
          <div className="customer-actions-bar">
            <div className="search-filter-container">
              <div className="search-box">
                <FaSearch />
                <input
                  type="text"
                  className="search-input"
                  placeholder="Search by name, email or phone..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="action-buttons-container">
              <button className="refresh-btn" onClick={fetchCustomers}>
                <FaSync /> Refresh
              </button>
              <button className="add-customer-btn" onClick={handleAddCustomer}>
                <FaUserPlus /> Add New Customer
              </button>
            </div>
          </div>
          
          {/* Customers Table */}
          <div className="customers-card">
            <div className="customer-table-header">
              <h2>Customer List</h2>
            </div>
            <div className="customer-table-container">
              {isLoading ? (
                <LoadingAnimation size="large" text="Loading customer data..." />
              ) : (
                <table className="customer-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Name</th>
                      <th>Contact</th>
                      <th>Phone</th>
                      <th>Credit Limit</th>
                      <th>Last Purchase</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredCustomers.map(customer => (
                      <tr key={customer.id}>
                        <td>#{customer.id}</td>
                        <td>{customer.name}</td>
                        <td>{customer.contact_info}</td>
                        <td>{customer.phone}</td>
                        <td>
                          <span className={`customer-credit-status ${getCreditStatus(customer.credit_used, customer.credit_limit)}`}>
                            ₹{customer.credit_used} / ₹{customer.credit_limit}
                          </span>
                        </td>
                        <td>{formatDate(customer.last_purchase)}</td>
                        <td>
                          <span className={`customer-credit-status ${customer.status === 'Active' ? 'credit-good' : customer.status === 'Inactive' ? 'credit-moderate' : 'credit-low'}`}>
                            {customer.status}
                          </span>
                        </td>
                        <td>
                          <div className="customer-actions">
                            <button className="action-btn view-btn" onClick={() => handleViewCustomer(customer)}>
                              <FaEye />
                            </button>
                            <button className="action-btn edit-btn" onClick={() => handleEditCustomer(customer)}>
                              <FaEdit />
                            </button>
                            <button className="action-btn delete-btn" onClick={() => handleDeleteCustomer(customer.id)}>
                              <FaTrash />
                            </button>
                            <button className="action-btn log-btn" onClick={() => handleAddInteraction(customer)}>
                              <FaPhone />
                            </button>
                </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Add/Edit Customer Modal */}
      {openAddEditModal && (
        <div className="modal-overlay">
          <div className="modal-container">
            <div className="modal-header">
              <h2>{selectedCustomer ? 'Edit Customer' : 'Add New Customer'}</h2>
              <button className="close-modal" onClick={() => setOpenAddEditModal(false)}>×</button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>Name</label>
                <input
                  type="text"
              name="name"
                  className="form-control"
              value={formData.name}
              onChange={handleFormChange}
                  placeholder="Customer full name"
                />
                {formErrors.name && <div className="form-error">{formErrors.name}</div>}
              </div>
              
              <div className="form-group">
                <label>Email Address</label>
                <input
                  type="email"
              name="contact_info"
                  className="form-control"
              value={formData.contact_info}
              onChange={handleFormChange}
                  placeholder="Email address"
                />
                {formErrors.contact_info && <div className="form-error">{formErrors.contact_info}</div>}
              </div>
              
              <div className="form-group">
                <label>Phone Number</label>
                <input
                  type="text"
                  name="phone"
                  className="form-control"
                  value={formData.phone || ''}
                  onChange={handleFormChange}
                  placeholder="Phone number"
                />
                {formErrors.phone && <div className="form-error">{formErrors.phone}</div>}
              </div>
              
              <div className="form-group">
                <label>Credit Limit (₹)</label>
                <input
                  type="number"
              name="credit_limit"
                  className="form-control"
              value={formData.credit_limit}
              onChange={handleFormChange}
                  placeholder="Enter credit limit"
                />
                {formErrors.credit_limit && <div className="form-error">{formErrors.credit_limit}</div>}
              </div>
            </div>
            <div className="modal-footer">
              <button className="modal-btn cancel" onClick={() => setOpenAddEditModal(false)}>Cancel</button>
              <button className="modal-btn save" onClick={handleSubmitCustomer}>Save Customer</button>
            </div>
          </div>
        </div>
      )}

      {/* Add Interaction Modal */}
      {openInteractionModal && selectedCustomer && (
        <div className="modal-overlay">
          <div className="modal-container">
            <div className="modal-header">
              <h2>Log Interaction with {selectedCustomer.name}</h2>
              <button className="close-modal" onClick={() => setOpenInteractionModal(false)}>×</button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>Interaction Type</label>
                <select
                name="interaction_type"
                  className="form-control"
                value={interactionData.interaction_type}
                onChange={handleInteractionChange}
                >
                  <option value="">Select interaction type</option>
                  <option value="Phone Call">Phone Call</option>
                  <option value="Email">Email</option>
                  <option value="In-Store Visit">In-Store Visit</option>
                  <option value="Social Media">Social Media</option>
                  <option value="Other">Other</option>
                </select>
                {interactionErrors.interaction_type && <div className="form-error">{interactionErrors.interaction_type}</div>}
              </div>
              
              <div className="form-group">
                <label>Details</label>
                <textarea
              name="details"
                  className="form-control"
              value={interactionData.details}
              onChange={handleInteractionChange}
                  rows="4"
                  placeholder="Enter interaction details"
                ></textarea>
                {interactionErrors.details && <div className="form-error">{interactionErrors.details}</div>}
              </div>
            </div>
            <div className="modal-footer">
              <button className="modal-btn cancel" onClick={() => setOpenInteractionModal(false)}>Cancel</button>
              <button className="modal-btn save" onClick={handleSubmitInteraction}>Save Interaction</button>
            </div>
          </div>
        </div>
      )}

      {/* Customer Details Modal */}
      {openDetailsModal && selectedCustomer && (
        <div className="modal-overlay">
          <div className="modal-container">
            <div className="modal-header">
              <h2>Customer Details: {selectedCustomer.name}</h2>
              <button className="close-modal" onClick={() => setOpenDetailsModal(false)}>×</button>
            </div>
            <div className="modal-body">
              <div className="tabs-container">
                <div className="tabs">
                  <div className={`tab ${tabValue === 0 ? 'active' : ''}`} onClick={() => handleTabChange(0)}>
                    Profile
                  </div>
                  <div className={`tab ${tabValue === 1 ? 'active' : ''}`} onClick={() => handleTabChange(1)}>
                    Interactions
                  </div>
          </div>
                
                <div className="tab-content">
          {tabValue === 0 && (
                    <div className="customer-profile">
                      <div className="form-group">
                        <div className="customer-details-label">Customer ID</div>
                        <div className="customer-details-value">#{selectedCustomer.id}</div>
                      </div>
                      
                      <div className="form-group">
                        <div className="customer-details-label">Full Name</div>
                        <div className="customer-details-value">{selectedCustomer.name}</div>
                      </div>
                      
                      <div className="form-group">
                        <div className="customer-details-label">Email Address</div>
                        <div className="customer-details-value">{selectedCustomer.contact_info}</div>
                      </div>
                      
                      <div className="form-group">
                        <div className="customer-details-label">Phone Number</div>
                        <div className="customer-details-value">{selectedCustomer.phone}</div>
                      </div>
                      
                      <div className="form-group">
                        <div className="customer-details-label">Credit Status</div>
                        <div className="customer-details-value">
                          <span className={`customer-credit-status ${getCreditStatus(selectedCustomer.credit_used, selectedCustomer.credit_limit)}`}>
                            ₹{selectedCustomer.credit_used} used of ₹{selectedCustomer.credit_limit} limit
                          </span>
                        </div>
                      </div>
                      
                      <div className="form-group">
                        <div className="customer-details-label">Last Purchase Date</div>
                        <div className="customer-details-value">{formatDate(selectedCustomer.last_purchase)}</div>
                      </div>
                      
                      <div className="form-group">
                        <div className="customer-details-label">Account Status</div>
                        <div className="customer-details-value">
                          <span className={`customer-credit-status ${selectedCustomer.status === 'Active' ? 'credit-good' : selectedCustomer.status === 'Inactive' ? 'credit-moderate' : 'credit-low'}`}>
                            {selectedCustomer.status}
                          </span>
                        </div>
                      </div>
                    </div>
          )}
          
          {tabValue === 1 && (
                    <div className="customer-interactions">
                      <div className="form-group">
                        <button className="add-customer-btn" onClick={() => handleAddInteraction(selectedCustomer)}>
                          <FaPhone /> Add New Interaction
                        </button>
                      </div>
                      
                      {interactions.length === 0 ? (
                        <p>No interaction history found for this customer.</p>
                      ) : (
                        <table className="customer-table">
                          <thead>
                            <tr>
                              <th>Date</th>
                              <th>Type</th>
                              <th>Details</th>
                            </tr>
                          </thead>
                          <tbody>
                            {interactions.map(interaction => (
                              <tr key={interaction.id}>
                                <td>{formatDate(interaction.date)}</td>
                                <td>{interaction.interaction_type}</td>
                                <td>{interaction.details}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="modal-btn cancel" onClick={() => setOpenDetailsModal(false)}>Close</button>
              <button className="modal-btn save" onClick={() => handleEditCustomer(selectedCustomer)}>Edit Customer</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerManagement;