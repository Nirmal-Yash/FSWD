import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  FaBox, 
  FaShoppingCart, 
  FaFolder,
  FaChartBar, 
  FaUsers,
  FaUserCircle,
  FaBars,
  FaSignOutAlt,
  FaKey,
  FaEye,
  FaEdit,
  FaTrash,
  FaSearch,
  FaPlusCircle,
  FaDownload,
  FaUpload,
  FaFilter,
  FaSortAmountDown,
  FaCheck,
  FaTimes,
  FaTruck,
  FaClock,
  FaClipboardList,
  FaFolderOpen,
  FaCalendarAlt
} from 'react-icons/fa';
import { AiFillIdcard } from 'react-icons/ai';
import '../styles/dashboard.css';
import '../styles/orders.css';
import LoadingAnimation from '../components/LoadingAnimation';

// Dummy orders data
const dummyOrdersData = [
  {
    id: 'ORD-2023-1001',
    customerName: 'Anand Textiles',
    orderDate: '2023-07-15',
    deliveryDate: '2023-07-22',
    totalAmount: 18500,
    status: 'Delivered',
    paymentStatus: 'Paid',
    items: [
      { id: 1, name: 'Cotton Fabric', quantity: 25, price: 350, total: 8750 },
      { id: 2, name: 'Silk Fabric', quantity: 10, price: 850, total: 8500 },
      { id: 3, name: 'Plastic Buttons', quantity: 100, price: 12.5, total: 1250 }
    ]
  },
  {
    id: 'ORD-2023-1002',
    customerName: 'Shree Fashion',
    orderDate: '2023-07-18',
    deliveryDate: '2023-07-25',
    totalAmount: 12750,
    status: 'Processing',
    paymentStatus: 'Pending',
    items: [
      { id: 1, name: 'Linen Fabric', quantity: 15, price: 450, total: 6750 },
      { id: 2, name: 'Denim Fabric', quantity: 10, price: 550, total: 5500 },
      { id: 4, name: 'Metal Zippers', quantity: 50, price: 10, total: 500 }
    ]
  },
  {
    id: 'ORD-2023-1003',
    customerName: 'Royal Garments',
    orderDate: '2023-07-20',
    deliveryDate: '2023-07-27',
    totalAmount: 22650,
    status: 'Shipped',
    paymentStatus: 'Paid',
    items: [
      { id: 5, name: 'Velvet Fabric', quantity: 20, price: 750, total: 15000 },
      { id: 6, name: 'Silk Fabric', quantity: 8, price: 850, total: 6800 },
      { id: 7, name: 'Wooden Buttons', quantity: 50, price: 17, total: 850 }
    ]
  },
  {
    id: 'ORD-2023-1004',
    customerName: 'Lakshmi Textiles',
    orderDate: '2023-07-22',
    deliveryDate: '2023-07-29',
    totalAmount: 15250,
    status: 'Delivered',
    paymentStatus: 'Paid',
    items: [
      { id: 8, name: 'Cotton Fabric', quantity: 30, price: 350, total: 10500 },
      { id: 9, name: 'Cotton Thread', quantity: 50, price: 45, total: 2250 },
      { id: 10, name: 'Plastic Buttons', quantity: 200, price: 12.5, total: 2500 }
    ]
  },
  {
    id: 'ORD-2023-1005',
    customerName: 'Modern Fabrics',
    orderDate: '2023-07-25',
    deliveryDate: '2023-08-01',
    totalAmount: 31500,
    status: 'Pending',
    paymentStatus: 'Pending',
    items: [
      { id: 11, name: 'Silk Fabric', quantity: 25, price: 850, total: 21250 },
      { id: 12, name: 'Velvet Fabric', quantity: 10, price: 750, total: 7500 },
      { id: 13, name: 'Metal Zippers', quantity: 100, price: 12.5, total: 1250 },
      { id: 14, name: 'Wooden Buttons', quantity: 100, price: 15, total: 1500 }
    ]
  },
  {
    id: 'ORD-2023-1006',
    customerName: 'Supreme Garments',
    orderDate: '2023-07-26',
    deliveryDate: '2023-08-02',
    totalAmount: 17850,
    status: 'Cancelled',
    paymentStatus: 'Refunded',
    items: [
      { id: 15, name: 'Polyester Blend', quantity: 40, price: 250, total: 10000 },
      { id: 16, name: 'Cotton Fabric', quantity: 20, price: 350, total: 7000 },
      { id: 17, name: 'Cotton Thread', quantity: 30, price: 28.33, total: 850 }
    ]
  },
  {
    id: 'ORD-2023-1007',
    customerName: 'Global Textiles',
    orderDate: '2023-07-28',
    deliveryDate: '2023-08-04',
    totalAmount: 24750,
    status: 'Pending',
    paymentStatus: 'Pending',
    items: [
      { id: 18, name: 'Denim Fabric', quantity: 35, price: 550, total: 19250 },
      { id: 19, name: 'Metal Zippers', quantity: 200, price: 12.5, total: 2500 },
      { id: 20, name: 'Plastic Buttons', quantity: 300, price: 10, total: 3000 }
    ]
  }
];

// Order statuses for filtering
const orderStatuses = [
  { id: 'all', name: 'All Orders' },
  { id: 'pending', name: 'Pending' },
  { id: 'processing', name: 'Processing' },
  { id: 'shipped', name: 'Shipped' },
  { id: 'delivered', name: 'Delivered' },
  { id: 'cancelled', name: 'Cancelled' }
];

const OrdersPage = () => {
  const navigate = useNavigate();
  
  // State management
  const [orders, setOrders] = useState(dummyOrdersData);
  const [filteredOrders, setFilteredOrders] = useState(dummyOrdersData);
  const [loading, setLoading] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeStatus, setActiveStatus] = useState('all');
  const [showOrderDetailsModal, setShowOrderDetailsModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [sortCriteria, setSortCriteria] = useState('date-desc');
  const [userData] = useState({
    name: 'Sales Manager',
    email: 'sales@miratextile.com'
  });
  
  // Filter orders based on search and status
  useEffect(() => {
    let result = orders;
    
    // Filter by search term
    if (searchTerm) {
      result = result.filter(order => 
        order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customerName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Filter by status
    if (activeStatus !== 'all') {
      result = result.filter(order => 
        order.status.toLowerCase() === activeStatus.toLowerCase()
      );
    }
    
    // Sort orders
    result = sortOrders(result, sortCriteria);
    
    setFilteredOrders(result);
  }, [searchTerm, activeStatus, orders, sortCriteria]);

  // Sort orders based on selected criteria
  const sortOrders = (ordersToSort, criteria) => {
    const sorted = [...ordersToSort];
    
    switch (criteria) {
      case 'date-desc':
        return sorted.sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate));
      case 'date-asc':
        return sorted.sort((a, b) => new Date(a.orderDate) - new Date(b.orderDate));
      case 'amount-desc':
        return sorted.sort((a, b) => b.totalAmount - a.totalAmount);
      case 'amount-asc':
        return sorted.sort((a, b) => a.totalAmount - b.totalAmount);
      default:
        return sorted;
    }
  };

  // Toggle sidebar
  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  // Toggle user menu
  const toggleUserMenu = () => {
    setUserMenuOpen(!userMenuOpen);
  };

  const closeUserMenu = () => {
    setUserMenuOpen(false);
  };

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuOpen && !event.target.closest('.user-menu-container')) {
        closeUserMenu();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [userMenuOpen]);

  // Handle logout
  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      localStorage.clear();
      sessionStorage.clear();
      navigate('/Login');
    }
  };

  // Reset password navigation
  const handleResetPassword = () => {
    navigate('/ResetPassword');
  };

  // User profile navigation
  const handleUser = () => {
    navigate('/Profile');
  };

  // Status selection handler
  const handleStatusChange = (statusId) => {
    setActiveStatus(statusId);
  };

  // Search handler
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2
    }).format(amount);
  };

  // Handle viewing order details
  const handleViewOrderDetails = (order) => {
    setSelectedOrder(order);
    setShowOrderDetailsModal(true);
  };

  // Close order details modal
  const handleCloseOrderDetailsModal = () => {
    setShowOrderDetailsModal(false);
    setSelectedOrder(null);
  };

  // Handle sort change
  const handleSortChange = (e) => {
    setSortCriteria(e.target.value);
  };

  // Handle create new order
  const handleCreateNewOrder = () => {
    navigate('/orders/new');
  };

  // Handle delete order
  const handleDeleteOrder = (orderId) => {
    if (window.confirm('Are you sure you want to delete this order?')) {
      setOrders(orders.filter(order => order.id !== orderId));
    }
  };

  // Get status icon based on status
  const getStatusIcon = (status) => {
    switch(status.toLowerCase()) {
      case 'delivered':
        return <FaCheck className="status-icon delivered" />;
      case 'shipped':
        return <FaTruck className="status-icon shipped" />;
      case 'processing':
        return <FaClock className="status-icon processing" />;
      case 'pending':
        return <FaClipboardList className="status-icon pending" />;
      case 'cancelled':
        return <FaTimes className="status-icon cancelled" />;
      default:
        return null;
    }
  };

  // Get payment status icon and class
  const getPaymentStatusClass = (status) => {
    switch(status.toLowerCase()) {
      case 'paid':
        return 'payment-status paid';
      case 'pending':
        return 'payment-status pending';
      case 'refunded':
        return 'payment-status refunded';
      default:
        return 'payment-status';
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
          <li className="active"><Link to="/orders"><FaShoppingCart /> <span>Orders</span></Link></li>
          <li><Link to="/CustomerManagement"><FaUsers /> <span>Customers</span></Link></li>
          <li><Link to="/Reportingpage"><FaFolder /> <span>Reports</span></Link></li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="main-content" style={{ marginLeft: sidebarCollapsed ? '70px' : '240px' }}>
        {/* Top Bar */}
        <div className="top-bar">
          <div className="page-title">
            <h1>Order Management</h1>
            <p className="subtitle">Manage your orders and track their status</p>
          </div>
          <div className="top-bar-actions">
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

        {/* Orders Content */}
        <div className="orders-content">
          {/* Orders Actions */}
          <div className="orders-actions">
            <div className="search-container">
              <div className="search-input-wrapper">
                <FaSearch className="search-icon" />
                <input 
                  type="text" 
                  placeholder="Search orders..." 
                  value={searchTerm}
                  onChange={handleSearch}
                  className="search-input"
                />
              </div>
            </div>
            <div className="action-buttons">
              <button className="action-button primary" onClick={handleCreateNewOrder}>
                <FaPlusCircle /> New Order
              </button>
              <div className="sort-container">
                <FaSortAmountDown className="sort-icon" />
                <select className="sort-select" value={sortCriteria} onChange={handleSortChange}>
                  <option value="date-desc">Date (Newest First)</option>
                  <option value="date-asc">Date (Oldest First)</option>
                  <option value="amount-desc">Amount (High to Low)</option>
                  <option value="amount-asc">Amount (Low to High)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Status Filter */}
          <div className="status-filter">
            {orderStatuses.map(status => (
              <button 
                key={status.id}
                className={`status-btn ${activeStatus === status.id ? 'active' : ''}`}
                onClick={() => handleStatusChange(status.id)}
              >
                {status.name}
              </button>
            ))}
          </div>

          {/* Orders Table */}
          {loading ? (
            <LoadingAnimation size="large" text="Loading orders data..." />
          ) : (
            <div className="orders-table-container">
              <table className="orders-table">
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Customer</th>
                    <th>Order Date</th>
                    <th>Delivery Date</th>
                    <th>Total Amount</th>
                    <th>Status</th>
                    <th>Payment</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.length === 0 ? (
                    <tr>
                      <td colSpan="8" className="no-data">No orders found</td>
                    </tr>
                  ) : (
                    filteredOrders.map((order) => (
                      <tr key={order.id}>
                        <td>{order.id}</td>
                        <td>{order.customerName}</td>
                        <td>
                          <div className="date-cell">
                            <FaCalendarAlt className="date-icon" />
                            <span>{order.orderDate}</span>
                          </div>
                        </td>
                        <td>
                          <div className="date-cell">
                            <FaTruck className="date-icon" />
                            <span>{order.deliveryDate}</span>
                          </div>
                        </td>
                        <td className="amount-cell">{formatCurrency(order.totalAmount)}</td>
                        <td>
                          <div className="status-cell">
                            {getStatusIcon(order.status)}
                            <span className={`status-badge ${order.status.toLowerCase()}`}>
                              {order.status}
                            </span>
                          </div>
                        </td>
                        <td>
                          <span className={getPaymentStatusClass(order.paymentStatus)}>
                            {order.paymentStatus}
                          </span>
                        </td>
                        <td>
                          <div className="action-cell">
                            <button 
                              className="icon-button view"
                              onClick={() => handleViewOrderDetails(order)}
                              title="View Order Details"
                            >
                              <FaEye />
                            </button>
                            <button 
                              className="icon-button edit"
                              onClick={() => navigate(`/orders/edit/${order.id}`)}
                              title="Edit Order"
                            >
                              <FaEdit />
                            </button>
                            <button 
                              className="icon-button delete"
                              onClick={() => handleDeleteOrder(order.id)}
                              title="Delete Order"
                            >
                              <FaTrash />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
          
          {/* Orders Stats */}
          <div className="orders-stats">
            <div className="stat-card">
              <div className="stat-icon total">
                <FaFolderOpen />
              </div>
              <div className="stat-content">
                <h3>Total Orders</h3>
                <p className="stat-value">{orders.length}</p>
              </div>
            </div>
            
            <div className="stat-card">
              <div className="stat-icon pending">
                <FaClipboardList />
              </div>
              <div className="stat-content">
                <h3>Pending Orders</h3>
                <p className="stat-value">{orders.filter(order => order.status.toLowerCase() === 'pending').length}</p>
              </div>
            </div>
            
            <div className="stat-card">
              <div className="stat-icon delivered">
                <FaCheck />
              </div>
              <div className="stat-content">
                <h3>Delivered Orders</h3>
                <p className="stat-value">{orders.filter(order => order.status.toLowerCase() === 'delivered').length}</p>
              </div>
            </div>
            
            <div className="stat-card">
              <div className="stat-icon total-sales">
                <FaShoppingCart />
              </div>
              <div className="stat-content">
                <h3>Total Sales</h3>
                <p className="stat-value">
                  {formatCurrency(
                    orders.reduce((total, order) => total + order.totalAmount, 0)
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Order Details Modal */}
      {showOrderDetailsModal && selectedOrder && (
        <div className="modal-overlay">
          <div className="modal-content order-details-modal">
            <div className="modal-header">
              <h2>Order Details - {selectedOrder.id}</h2>
              <button className="modal-close" onClick={handleCloseOrderDetailsModal}>&times;</button>
            </div>
            <div className="order-details-content">
              <div className="order-info-section">
                <div className="order-info-column">
                  <div className="info-group">
                    <h3>Customer</h3>
                    <p>{selectedOrder.customerName}</p>
                  </div>
                  <div className="info-group">
                    <h3>Order Date</h3>
                    <p>{selectedOrder.orderDate}</p>
                  </div>
                  <div className="info-group">
                    <h3>Delivery Date</h3>
                    <p>{selectedOrder.deliveryDate}</p>
                  </div>
                </div>
                <div className="order-info-column">
                  <div className="info-group">
                    <h3>Order Status</h3>
                    <div className="status-chip">
                      {getStatusIcon(selectedOrder.status)}
                      <span>{selectedOrder.status}</span>
                    </div>
                  </div>
                  <div className="info-group">
                    <h3>Payment Status</h3>
                    <div className={getPaymentStatusClass(selectedOrder.paymentStatus)}>
                      {selectedOrder.paymentStatus}
                    </div>
                  </div>
                  <div className="info-group">
                    <h3>Total Amount</h3>
                    <p className="modal-amount">{formatCurrency(selectedOrder.totalAmount)}</p>
                  </div>
                </div>
              </div>

              <div className="order-items-section">
                <h3>Order Items</h3>
                <table className="order-items-table">
                  <thead>
                    <tr>
                      <th>Item</th>
                      <th>Quantity</th>
                      <th>Unit Price</th>
                      <th>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedOrder.items.map((item) => (
                      <tr key={item.id}>
                        <td>{item.name}</td>
                        <td>{item.quantity}</td>
                        <td>{formatCurrency(item.price)}</td>
                        <td>{formatCurrency(item.total)}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr>
                      <td colSpan="3" className="total-label">Total</td>
                      <td className="total-value">{formatCurrency(selectedOrder.totalAmount)}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
              
              <div className="modal-actions">
                <button className="action-button secondary">
                  <FaDownload /> Download Invoice
                </button>
                <button className="action-button primary">
                  <FaEdit /> Update Status
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrdersPage; 