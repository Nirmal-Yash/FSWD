import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  BarElement, 
  PointElement,
  LineElement,
  ArcElement,
  Title, 
  Tooltip, 
  Legend,
  Filler
} from 'chart.js';
import { Bar, Line, Doughnut } from 'react-chartjs-2';
import { 
  FaBox, 
  FaShoppingCart, 
  FaRupeeSign, 
  FaFolder,
  FaChartBar, 
  FaUsers,
  FaUserPlus,
  FaSync,
  FaSignOutAlt,
  FaUserCircle,
  FaBars,
  FaKey,
  FaCashRegister,
  FaCalendarAlt,
  FaArrowUp,
  FaExclamationTriangle,
  FaRegClock,
  FaHistory,
  FaStore,
  FaBell,
  FaTimes,
  FaSun,
  FaMoon,
  FaBellSlash
} from 'react-icons/fa';
import { AiFillIdcard } from 'react-icons/ai';
import '../styles/dashboard.css';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { API_CONFIG, API_BASE_URL, AUTH_CONFIG } from '../config';
import LoadingAnimation from '../components/LoadingAnimation';
import { useAuth } from '../context/AuthContext';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  ChartDataLabels
);

// Disable DataLabels for all charts by default, then enable only for specific charts
ChartJS.defaults.set('plugins.datalabels', { display: false });

// Fallback data if API is unavailable (limited to 10 entries)
const fallbackData = {
  metrics: {
    totalSales: 92500,
    ordersCount: 48,
    customersCount: 25,
    averageOrder: 1850.25,
    pendingOrders: 6,
    lowStockItems: 3,
    salesGrowth: 12.5,
    inventoryValue: 185000
  },
  dailySales: {
    labels: ['May 1', 'May 2', 'May 3', 'May 4', 'May 5', 'May 6', 'May 7', 'May 8', 'May 9', 'May 10'],
    datasets: [{
      label: 'Sales Amount',
      data: [9200, 8400, 11500, 10200, 9800, 12500, 11000, 9500, 10800, 9600],
      backgroundColor: 'rgba(53, 162, 235, 0.5)',
      borderColor: 'rgb(53, 162, 235)',
      borderWidth: 2,
    }]
  },
  inventoryDistribution: {
    labels: ['Fabric', 'Clothing', 'Accessories', 'Raw Materials'],
    datasets: [{
      label: 'Inventory Value',
      data: [35, 30, 15, 20],
      backgroundColor: [
        'rgba(255, 99, 132, 0.7)',
        'rgba(54, 162, 235, 0.7)',
        'rgba(255, 206, 86, 0.7)',
        'rgba(75, 192, 192, 0.7)',
      ],
      borderColor: [
        'rgba(255, 99, 132, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(75, 192, 192, 1)',
      ],
      borderWidth: 1,
    }]
  },
  monthlyTrend: {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Revenue',
        data: [65000, 59000, 80000, 81000, 95000, 92500],
        fill: true,
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        tension: 0.4,
      },
      {
        label: 'Expenses',
        data: [35000, 40000, 45000, 50000, 49000, 60000],
        fill: true,
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderColor: 'rgba(255, 99, 132, 1)',
        tension: 0.4,
      }
    ]
  },
  outstandingCredits: [
    { id: 1, customer: 'Acme Clothing Co.', amount: 4500, dueDate: '2023-05-15', status: 'OVERDUE' },
    { id: 2, customer: 'Fashion Fabrics Ltd', amount: 2800, dueDate: '2023-05-20', status: 'PENDING' },
    { id: 3, customer: 'Style Studio', amount: 1200, dueDate: '2023-06-01', status: 'PENDING' },
    { id: 4, customer: 'Textile Trends', amount: 3750, dueDate: '2023-05-12', status: 'OVERDUE' },
    { id: 5, customer: 'Designer Depot', amount: 5200, dueDate: '2023-06-10', status: 'PENDING' }
  ]
};

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [salesData, setSalesData] = useState(null);
  const [outstandingCredits, setOutstandingCredits] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [userData, setUserData] = useState({
    name: user?.full_name || user?.username || '',
    email: user?.email || '',
    role: user?.role || '',
    lastLogin: user?.last_login || '',
    storeLocation: user?.store_location || ''
  });
  
  const [userPreferences, setUserPreferences] = useState({
    darkMode: false,
    notificationsEnabled: true,
    dataRefreshInterval: 30 // in minutes
  });
  
  const [notifications, setNotifications] = useState([
    { id: 1, message: 'Low stock alert for 5 items', read: false, date: new Date().toLocaleString() },
    { id: 2, message: 'New order #ORD-0025 received', read: false, date: new Date().toLocaleString() },
    { id: 3, message: 'System update scheduled for tonight', read: true, date: new Date().toLocaleString() }
  ]);
  
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  
  const [availableStores, setAvailableStores] = useState([
    { id: 1, name: 'Main Store', address: '123 Main St' },
    { id: 2, name: 'Downtown Branch', address: '456 Market St' },
    { id: 3, name: 'Mall Outlet', address: 'Central Mall, Shop #34' }
  ]);
  
  const [storeSelectOpen, setStoreSelectOpen] = useState(false);

  const [metrics, setMetrics] = useState({
    totalSales: 0,
    ordersCount: 0,
    customersCount: 0,
    averageOrder: 0,
    pendingOrders: 0,
    lowStockItems: 0,
    salesGrowth: 0,
    inventoryValue: 0
  });

  useEffect(() => {
    fetchDashboardData();
    fetchUserData();
  }, [user]);

  const fetchDashboardData = async () => {
    setIsLoading(true);
    try {
      // Fetch dashboard metrics
      const metricsResponse = await fetch(`${API_BASE_URL}${API_CONFIG.ENDPOINTS.DASHBOARD.METRICS}`);
      if (metricsResponse.ok) {
        const metricsData = await metricsResponse.json();
        setMetrics(metricsData);
      } else {
        // Use fallback metrics if API is unavailable
        setMetrics(fallbackData.metrics);
      }

      // Fetch sales data for chart
      const salesResponse = await fetch(`${API_BASE_URL}${API_CONFIG.ENDPOINTS.DASHBOARD.SALES}`);
      if (salesResponse.ok) {
        const salesData = await salesResponse.json();
        setSalesData(salesData);
      } else {
        // Use fallback chart data if API is unavailable
        setSalesData({
          dailySales: fallbackData.dailySales,
          inventoryDistribution: fallbackData.inventoryDistribution,
          monthlyTrend: fallbackData.monthlyTrend
        });
      }
      
      // Fetch inventory distribution data
      const inventoryResponse = await fetch(`${API_BASE_URL}${API_CONFIG.ENDPOINTS.DASHBOARD.INVENTORY}`);
      if (inventoryResponse.ok) {
        const inventoryData = await inventoryResponse.json();
        setSalesData(prev => ({ ...prev, inventoryDistribution: inventoryData }));
      } else {
        // Use fallback inventory data if API is unavailable
        setSalesData(prev => ({ ...prev, inventoryDistribution: fallbackData.inventoryDistribution }));
      }
      
      // Fetch monthly trend data
      const trendsResponse = await fetch(`${API_BASE_URL}${API_CONFIG.ENDPOINTS.DASHBOARD.TRENDS}`);
      if (trendsResponse.ok) {
        const trendsData = await trendsResponse.json();
        setSalesData(prev => ({ ...prev, monthlyTrend: trendsData }));
      } else {
        // Use fallback trend data if API is unavailable
        setSalesData(prev => ({ ...prev, monthlyTrend: fallbackData.monthlyTrend }));
      }
      
      // Fetch outstanding credits
      const creditsResponse = await fetch(`${API_BASE_URL}${API_CONFIG.ENDPOINTS.DASHBOARD.CREDITS}`);
      if (creditsResponse.ok) {
        const creditsData = await creditsResponse.json();
        setOutstandingCredits(creditsData);
      } else {
        // Use fallback credits data if API is unavailable
        setOutstandingCredits(fallbackData.outstandingCredits);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      // Use fallback data if API fails
      setMetrics(fallbackData.metrics);
      setSalesData({
        dailySales: fallbackData.dailySales,
        inventoryDistribution: fallbackData.inventoryDistribution,
        monthlyTrend: fallbackData.monthlyTrend
      });
      setOutstandingCredits(fallbackData.outstandingCredits);
    } finally {
      setIsLoading(false);
    }
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
        role: data.role,
        lastLogin: data.last_login,
        storeLocation: data.store_location
      });
    } catch (error) {
      console.error('Error fetching user data:', error);
      setUserData({
        name: user?.full_name || user?.username || 'User',
        email: user?.email || '',
        role: user?.role || '',
        lastLogin: user?.last_login || '',
        storeLocation: user?.store_location || ''
      });
    }
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

  // Chart options
  const salesChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Daily Sales (Last 30 Days)',
        font: {
          size: 16,
          weight: 'bold'
        }
      },
      tooltip: {
        enabled: false // Disable tooltips
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Amount (₹)'
        }
      },
      x: {
        title: {
          display: true,
          text: 'Date'
        }
      }
    }
  };
  
  const inventoryChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'right',
      },
      title: {
        display: true,
        text: 'Inventory Distribution',
        font: {
          size: 16,
          weight: 'bold'
        }
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const label = context.label || '';
            const value = context.raw || 0;
            const total = context.dataset.data.reduce((acc, curr) => acc + curr, 0);
            const percentage = Math.round((value / total) * 100);
            return `${label}: ${percentage}%`;
          }
        }
      },
      datalabels: {
        display: true,
        formatter: (value, ctx) => {
          const dataset = ctx.chart.data.datasets[0];
          const total = dataset.data.reduce((acc, data) => acc + data, 0);
          const percentage = Math.round((value / total) * 100);
          return percentage + '%';
        },
        color: '#fff',
        font: {
          weight: 'bold',
          size: 12
        }
      }
    }
  };
  
  const trendChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Revenue vs Expenses (6 Months)',
        font: {
          size: 16,
          weight: 'bold'
        }
      },
      tooltip: {
        enabled: false // Disable tooltips
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Amount (₹)'
        }
      }
    }
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2
    }).format(amount);
  };

  const toggleNotifications = () => {
    setNotificationsOpen(!notificationsOpen);
    setStoreSelectOpen(false);
    setUserMenuOpen(false);
  };
  
  const toggleStoreSelect = () => {
    setStoreSelectOpen(!storeSelectOpen);
    setNotificationsOpen(false);
    setUserMenuOpen(false);
  };
  
  const markAllNotificationsAsRead = () => {
    const updatedNotifications = notifications.map(notification => ({
      ...notification,
      read: true
    }));
    setNotifications(updatedNotifications);
  };
  
  const markNotificationAsRead = (id) => {
    const updatedNotifications = notifications.map(notification => 
      notification.id === id ? { ...notification, read: true } : notification
    );
    setNotifications(updatedNotifications);
  };
  
  const deleteNotification = (id) => {
    const updatedNotifications = notifications.filter(notification => notification.id !== id);
    setNotifications(updatedNotifications);
  };
  
  const changeStore = (storeId) => {
    const selectedStore = availableStores.find(store => store.id === storeId);
    if (selectedStore) {
      setUserData({
        ...userData,
        storeLocation: selectedStore.name
      });
      // Here you would typically make an API call to switch stores
      console.log(`Switching to store: ${selectedStore.name}`);
      setStoreSelectOpen(false);
      
      // Refresh data for the new store
      fetchDashboardData();
    }
  };
  
  const toggleDarkMode = () => {
    setUserPreferences({
      ...userPreferences,
      darkMode: !userPreferences.darkMode
    });
    // Here you would implement actual dark mode toggle
    document.body.classList.toggle('dark-mode');
  };
  
  const toggleNotificationSettings = () => {
    setUserPreferences({
      ...userPreferences,
      notificationsEnabled: !userPreferences.notificationsEnabled
    });
    // Here you would update user preferences via API
  };
  
  const updateRefreshInterval = (minutes) => {
    setUserPreferences({
      ...userPreferences,
      dataRefreshInterval: minutes
    });
    // Here you would update the refresh interval for dashboard data
  };
  
  const unreadNotificationsCount = notifications.filter(n => !n.read).length;

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
          <li className="active"><Link to="/dashboard"><FaChartBar /> <span>Dashboard</span></Link></li>
          <li><Link to="/inventory/manage"><FaBox /> <span>Inventory</span></Link></li>
          <li><Link to="/pos"><FaCashRegister /> <span>POS</span></Link></li>
          <li><Link to="/CustomerManagement"><FaUsers /> <span>Customers</span></Link></li>
          <li><Link to="/Reportingpage"><FaFolder /> <span>Reports</span></Link></li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="main-content" style={{ marginLeft: sidebarCollapsed ? '70px' : '240px' }}>
        {/* Top Bar */}
        <div className="top-bar">
          <div className="page-title">
            <h1>Dashboard</h1>
            <p className="subtitle">Welcome back, {userData.name || 'User'}</p>
          </div>
          <div className="top-bar-actions">
            <div className="date-display">
              <FaCalendarAlt />
              <span>{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
            </div>
            
            <button className="refresh-btn" onClick={fetchDashboardData}>
              <FaSync />
            </button>
            
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

        {/* Dashboard Content */}
        <div className="dashboard-content">
          {isLoading ? (
            <LoadingAnimation size="large" text="Loading dashboard data..." />
          ) : (
            <>
              {/* Key Metrics Section */}
              <div className="metrics-grid">
                <div className="metric-card">
                  <div className="metric-icon sales-icon">
                    <FaRupeeSign />
                  </div>
                  <div className="metric-content">
                    <h3>Total Sales</h3>
                    <p className="metric-value">{formatCurrency(metrics.totalSales)}</p>
                    {metrics.salesGrowth > 0 && (
                      <p className="metric-change positive">
                        <FaArrowUp /> {metrics.salesGrowth}% from last month
                      </p>
                    )}
                  </div>
                </div>
                
                <div className="metric-card">
                  <div className="metric-icon orders-icon">
                    <FaShoppingCart />
                  </div>
                  <div className="metric-content">
                    <h3>Total Orders</h3>
                    <p className="metric-value">{metrics.ordersCount}</p>
                    {metrics.pendingOrders > 0 && (
                      <p className="metric-description">
                        <span className="highlight">{metrics.pendingOrders}</span> pending orders
                      </p>
                    )}
                  </div>
                </div>
                
                <div className="metric-card">
                  <div className="metric-icon customers-icon">
                    <FaUsers />
                  </div>
                  <div className="metric-content">
                    <h3>Customers</h3>
                    <p className="metric-value">{metrics.customersCount}</p>
                    {metrics.averageOrder > 0 && (
                      <p className="metric-description">
                        Avg. order: {formatCurrency(metrics.averageOrder)}
                      </p>
                    )}
                  </div>
                </div>
                
                <div className="metric-card">
                  <div className="metric-icon inventory-icon">
                    <FaBox />
                  </div>
                  <div className="metric-content">
                    <h3>Inventory Value</h3>
                    <p className="metric-value">{formatCurrency(metrics.inventoryValue)}</p>
                  </div>
                </div>
              </div>

              {/* Charts Row */}
              <div className="charts-grid">
                <div className="chart-card sales-chart">
                  <div className="chart-container">
                    {salesData && salesData.dailySales.labels.length > 0 ? (
                      <Bar data={salesData.dailySales} options={salesChartOptions} />
                    ) : (
                      <div className="no-data-message">No sales data available</div>
                    )}
                  </div>
                </div>
                
                <div className="chart-card trend-chart">
                  <div className="chart-container">
                    {salesData && salesData.monthlyTrend.labels.length > 0 ? (
                      <Line data={salesData.monthlyTrend} options={trendChartOptions} />
                    ) : (
                      <div className="no-data-message">No trend data available</div>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Lower Section - Inventory and Outstanding Credits */}
              <div className="bottom-grid">
                <div className="chart-card inventory-chart">
                  <div className="chart-container donut-container">
                    {salesData && salesData.inventoryDistribution.labels.length > 0 ? (
                      <Doughnut data={salesData.inventoryDistribution} options={inventoryChartOptions} />
                    ) : (
                      <div className="no-data-message">No inventory data available</div>
                    )}
                  </div>
                </div>
                
                <div className="card credits-card">
                  <div className="card-header">
                    <h2>Outstanding Credits</h2>
                    <Link to="/credits" className="view-all">View All</Link>
                  </div>
                  <div className="card-body">
                    {outstandingCredits.length > 0 ? (
                      <table className="credits-table">
                        <thead>
                          <tr>
                            <th>Customer</th>
                            <th>Amount</th>
                            <th>Due Date</th>
                            <th>Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {outstandingCredits.map(credit => (
                            <tr key={credit.id}>
                              <td>{credit.customer}</td>
                              <td>{formatCurrency(credit.amount)}</td>
                              <td>
                                <span className="date-with-icon">
                                  <FaRegClock /> {new Date(credit.dueDate).toLocaleDateString()}
                                </span>
                              </td>
                              <td className={credit.status.toLowerCase()}>
                                {credit.status}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    ) : (
                      <div className="no-data-message">No outstanding credits</div>
                    )}
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="card quick-actions-card">
                <div className="card-header">
                  <h2>Quick Actions</h2>
                </div>
                <div className="card-body">
                  <div className="action-buttons">
                    <Link to="/pos" className="action-button primary">
                      <FaCashRegister /> New Sale
                    </Link>
                    <Link to="/inventory/manage" className="action-button secondary">
                      <FaBox /> Manage Inventory
                    </Link>
                    <Link to="/UserManagement" className="action-button tertiary">
                      <FaUserPlus /> Add User
                    </Link>
                    <Link to="/Reportingpage" className="action-button quaternary">
                      <FaChartBar /> View Reports
                    </Link>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;