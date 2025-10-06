import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import { 
  Box, 
  Tab, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper, 
  Button, 
  FormControlLabel, 
  Switch,
  Typography
} from '@mui/material';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar, Line, Pie } from 'react-chartjs-2';
import { CSVLink } from 'react-csv';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { 
  FaChartBar, 
  FaBox, 
  FaShoppingCart, 
  FaUsers, 
  FaFolder,
  FaCashRegister,
  FaFileDownload,
  FaUserCircle,
  FaSync,
  FaBars,
  FaCalendarAlt,
  FaSignOutAlt,
  FaKey,
  FaSearch,
  FaDownload,
  FaFileExcel,
  FaFilePdf,
  FaChartPie,
  FaChartLine,
  FaTable,
  FaFilter,
  FaHistory
} from 'react-icons/fa';
import { AiFillIdcard } from 'react-icons/ai';
import '../styles/dashboard.css';
import '../styles/pos.css';
import LoadingAnimation from '../components/LoadingAnimation';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

// API Configuration
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8082/api';
const API_CONFIG = {
  ENDPOINTS: {
    AUTH: {
      LOGOUT: '/auth/logout'
    }
  },
  TOKEN_KEY: 'auth_token'
};

const Reportingpage = () => {
  const navigate = useNavigate();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [activeReportType, setActiveReportType] = useState('sales');
  const [reportPeriod, setReportPeriod] = useState('month');
  const [loading, setLoading] = useState(true);
  const [userData] = useState({
    name: 'Admin User',
    email: 'admin@miratextile.com'
  });

  // Mock data for demonstration
  const salesData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Sales',
        data: [65000, 59000, 80000, 81000, 56000, 95000],
        backgroundColor: 'rgba(75, 108, 183, 0.6)',
        borderColor: 'rgba(75, 108, 183, 1)',
        borderWidth: 1,
      },
    ],
  };

  const categorySalesData = {
    labels: ['Shirts', 'Pants', 'Sarees', 'Kurtas', 'Fabric', 'Accessories'],
    datasets: [
      {
        label: 'Sales by Category',
        data: [35000, 25000, 42000, 30000, 18000, 12000],
        backgroundColor: [
          'rgba(75, 108, 183, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 206, 86, 0.6)',
          'rgba(75, 192, 192, 0.6)',
          'rgba(153, 102, 255, 0.6)',
          'rgba(255, 159, 64, 0.6)',
        ],
        borderColor: [
          'rgba(75, 108, 183, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const profitMarginData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Profit Margin (%)',
        data: [25, 28, 32, 26, 29, 31],
        fill: false,
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        tension: 0.4,
      },
    ],
  };

  const paymentMethodData = {
    labels: ['Cash', 'Credit Card', 'UPI', 'Bank Transfer', 'Credit'],
    datasets: [
      {
        label: 'Payment Methods',
        data: [45, 25, 20, 5, 5],
        backgroundColor: [
          'rgba(75, 108, 183, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 206, 86, 0.6)',
          'rgba(75, 192, 192, 0.6)',
          'rgba(153, 102, 255, 0.6)',
        ],
        borderColor: [
          'rgba(75, 108, 183, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const inventoryData = {
    labels: ['Shirts', 'Pants', 'Sarees', 'Kurtas', 'Fabric', 'Accessories'],
    datasets: [
      {
        label: 'Current Stock',
        data: [150, 120, 80, 95, 210, 175],
        backgroundColor: 'rgba(75, 108, 183, 0.6)',
        borderColor: 'rgba(75, 108, 183, 1)',
        borderWidth: 1,
      },
      {
        label: 'Reorder Level',
        data: [50, 40, 30, 40, 60, 50],
        backgroundColor: 'rgba(255, 99, 132, 0.6)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1,
      },
    ],
  };

  // Sample table data for different report types
  const tableData = {
    sales: [
      { id: 1, date: '2024-05-01', orderCount: 23, total: 45000, profit: 12500 },
      { id: 2, date: '2024-05-02', orderCount: 18, total: 36000, profit: 9800 },
      { id: 3, date: '2024-05-03', orderCount: 27, total: 52000, profit: 14600 },
      { id: 4, date: '2024-05-04', orderCount: 21, total: 41500, profit: 11200 },
      { id: 5, date: '2024-05-05', orderCount: 19, total: 38000, profit: 10500 },
    ],
    inventory: [
      { id: 1, category: 'Shirts', currentStock: 150, sold: 45, reorderLevel: 50, value: 75000 },
      { id: 2, category: 'Pants', currentStock: 120, sold: 38, reorderLevel: 40, value: 84000 },
      { id: 3, category: 'Sarees', currentStock: 80, sold: 22, reorderLevel: 30, value: 120000 },
      { id: 4, category: 'Kurtas', currentStock: 95, sold: 31, reorderLevel: 40, value: 57000 },
      { id: 5, category: 'Fabric', currentStock: 210, sold: 56, reorderLevel: 60, value: 63000 },
    ],
    customers: [
      { id: 1, name: 'John Doe', purchases: 15, totalSpent: 45000, lastPurchase: '2024-05-02' },
      { id: 2, name: 'Jane Smith', purchases: 22, totalSpent: 68000, lastPurchase: '2024-05-01' },
      { id: 3, name: 'Bob Johnson', purchases: 8, totalSpent: 24000, lastPurchase: '2024-04-28' },
      { id: 4, name: 'Alice Brown', purchases: 17, totalSpent: 51000, lastPurchase: '2024-05-03' },
      { id: 5, name: 'Eva White', purchases: 12, totalSpent: 36000, lastPurchase: '2024-04-30' },
    ]
  };

  useEffect(() => {
    // Simulate loading data
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);
  
  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };
  
  const toggleUserMenu = () => {
    setUserMenuOpen(!userMenuOpen);
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
  

  const handleReportTypeChange = (type) => {
    setActiveReportType(type);
  };

  const handlePeriodChange = (e) => {
    setReportPeriod(e.target.value);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  // Prepare data for export
  const prepareExportData = () => {
    const currentData = tableData[activeReportType] || [];
    
    if (activeReportType === 'sales') {
      return currentData.map(row => ({
        'Date': row.date,
        'Orders': row.orderCount,
        'Total Sales': formatCurrency(row.total).replace('₹', ''),
        'Profit': formatCurrency(row.profit).replace('₹', '')
      }));
    } else if (activeReportType === 'inventory') {
      return currentData.map(row => ({
        'Category': row.category,
        'Current Stock': row.currentStock,
        'Sold': row.sold,
        'Reorder Level': row.reorderLevel,
        'Stock Value': formatCurrency(row.value).replace('₹', '')
      }));
    } else if (activeReportType === 'customers') {
      return currentData.map(row => ({
        'Customer': row.name,
        'Purchases': row.purchases,
        'Total Spent': formatCurrency(row.totalSpent).replace('₹', ''),
        'Last Purchase': row.lastPurchase
      }));
    }
    
    return [];
  };

  const exportToPdf = () => {
    try {
      // Simple approach without autoTable to avoid compatibility issues
      const doc = new jsPDF();
      
      // Set title
      doc.setFontSize(16);
      doc.setTextColor(75, 108, 183);
      doc.text(`${activeReportType.charAt(0).toUpperCase() + activeReportType.slice(1)} Report`, 15, 15);
      
      // Add date
      doc.setFontSize(10);
      doc.setTextColor(0, 0, 0);
      doc.text(`Generated: ${new Date().toLocaleDateString()}`, 15, 25);
      
      const currentData = tableData[activeReportType] || [];
      let yPos = 40;
      
      // Add table headers manually
      doc.setFontSize(10);
      doc.setTextColor(255, 255, 255);
      doc.setFillColor(75, 108, 183);
      
      if (activeReportType === 'sales') {
        doc.rect(15, yPos, 140, 10, 'F');
        doc.setTextColor(255, 255, 255);
        doc.text('Date', 20, yPos + 7);
        doc.text('Orders', 50, yPos + 7);
        doc.text('Total Sales', 80, yPos + 7);
        doc.text('Profit', 120, yPos + 7);
        
        yPos += 15;
        doc.setTextColor(0, 0, 0);
        
        // Add rows
        currentData.forEach(row => {
          doc.text(row.date, 20, yPos);
          doc.text(row.orderCount.toString(), 50, yPos);
          doc.text(formatCurrency(row.total).replace('₹', ''), 80, yPos);
          doc.text(formatCurrency(row.profit).replace('₹', ''), 120, yPos);
          yPos += 10;
        });
      } else if (activeReportType === 'inventory') {
        doc.rect(15, yPos, 160, 10, 'F');
        doc.setTextColor(255, 255, 255);
        doc.text('Category', 20, yPos + 7);
        doc.text('Stock', 60, yPos + 7);
        doc.text('Sold', 85, yPos + 7);
        doc.text('Reorder', 110, yPos + 7);
        doc.text('Value', 140, yPos + 7);
        
        yPos += 15;
        doc.setTextColor(0, 0, 0);
        
        // Add rows
        currentData.forEach(row => {
          doc.text(row.category, 20, yPos);
          doc.text(row.currentStock.toString(), 60, yPos);
          doc.text(row.sold.toString(), 85, yPos);
          doc.text(row.reorderLevel.toString(), 110, yPos);
          doc.text(formatCurrency(row.value).replace('₹', ''), 140, yPos);
          yPos += 10;
        });
      } else if (activeReportType === 'customers') {
        doc.rect(15, yPos, 160, 10, 'F');
        doc.setTextColor(255, 255, 255);
        doc.text('Customer', 20, yPos + 7);
        doc.text('Purchases', 70, yPos + 7);
        doc.text('Total Spent', 100, yPos + 7);
        doc.text('Last Purchase', 135, yPos + 7);
        
        yPos += 15;
        doc.setTextColor(0, 0, 0);
        
        // Add rows
        currentData.forEach(row => {
          doc.text(row.name, 20, yPos);
          doc.text(row.purchases.toString(), 70, yPos);
          doc.text(formatCurrency(row.totalSpent).replace('₹', ''), 100, yPos);
          doc.text(row.lastPurchase, 135, yPos);
          yPos += 10;
        });
      }
      
      // Add summary section
      yPos += 10;
      doc.setFontSize(12);
      doc.setTextColor(75, 108, 183);
      doc.text('Summary', 15, yPos);
      
      yPos += 10;
      doc.setFontSize(10);
      doc.setTextColor(0, 0, 0);
      
      if (activeReportType === 'sales') {
        doc.text(`Total Sales: ${formatCurrency(436000)}`, 15, yPos);
        doc.text(`Total Orders: 214`, 15, yPos + 7);
        doc.text(`Average Order Value: ${formatCurrency(2037)}`, 15, yPos + 14);
        doc.text(`Profit Margin: 28.4%`, 15, yPos + 21);
      } else if (activeReportType === 'inventory') {
        doc.text(`Total Stock Value: ${formatCurrency(399000)}`, 15, yPos);
        doc.text(`Items in Stock: 830`, 15, yPos + 7);
        doc.text(`Low Stock Items: 12`, 15, yPos + 14);
        doc.text(`Out of Stock: 4`, 15, yPos + 21);
      } else if (activeReportType === 'customers') {
        doc.text(`Total Customers: 342`, 15, yPos);
        doc.text(`Active Customers: 215`, 15, yPos + 7);
        doc.text(`Average Customer Value: ${formatCurrency(12500)}`, 15, yPos + 14);
        doc.text(`Customer Retention: 86%`, 15, yPos + 21);
      }
      
      // Footer
      doc.setFontSize(8);
      doc.setTextColor(100, 100, 100);
      doc.text('Mira Textile Report System', 15, 280);
      
      // Save PDF
      doc.save(`${activeReportType}_report.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('There was an error generating the PDF. Please try again.');
    }
  };

  const renderReportSummary = () => {
    switch (activeReportType) {
      case 'sales':
        return (
          <div className="report-summary">
            <div className="summary-card">
              <h3>Total Sales</h3>
              <div className="summary-value">{formatCurrency(436000)}</div>
              <div className="summary-change positive">+12.5% vs. last period</div>
            </div>
            <div className="summary-card">
              <h3>Orders</h3>
              <div className="summary-value">214</div>
              <div className="summary-change positive">+8.2% vs. last period</div>
            </div>
            <div className="summary-card">
              <h3>Average Order Value</h3>
              <div className="summary-value">{formatCurrency(2037)}</div>
              <div className="summary-change positive">+4.1% vs. last period</div>
            </div>
            <div className="summary-card">
              <h3>Profit Margin</h3>
              <div className="summary-value">28.4%</div>
              <div className="summary-change negative">-1.2% vs. last period</div>
            </div>
          </div>
        );
      case 'inventory':
        return (
          <div className="report-summary">
            <div className="summary-card">
              <h3>Total Stock Value</h3>
              <div className="summary-value">{formatCurrency(399000)}</div>
              <div className="summary-change positive">+5.3% vs. last month</div>
            </div>
            <div className="summary-card">
              <h3>Items in Stock</h3>
              <div className="summary-value">830</div>
              <div className="summary-change positive">+42 since last month</div>
            </div>
            <div className="summary-card">
              <h3>Low Stock Items</h3>
              <div className="summary-value">12</div>
              <div className="summary-change negative">+3 since last week</div>
            </div>
            <div className="summary-card">
              <h3>Out of Stock</h3>
              <div className="summary-value">4</div>
              <div className="summary-change positive">-2 since last week</div>
            </div>
          </div>
        );
      case 'customers':
        return (
          <div className="report-summary">
            <div className="summary-card">
              <h3>Total Customers</h3>
              <div className="summary-value">342</div>
              <div className="summary-change positive">+18 since last month</div>
            </div>
            <div className="summary-card">
              <h3>Active Customers</h3>
              <div className="summary-value">215</div>
              <div className="summary-change positive">+8.5% vs. last month</div>
            </div>
            <div className="summary-card">
              <h3>Average Customer Value</h3>
              <div className="summary-value">{formatCurrency(12500)}</div>
              <div className="summary-change positive">+3.2% vs. last month</div>
            </div>
            <div className="summary-card">
              <h3>Customer Retention</h3>
              <div className="summary-value">86%</div>
              <div className="summary-change positive">+2.1% vs. last month</div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  const renderCharts = () => {
    switch (activeReportType) {
      case 'sales':
        return (
          <div className="report-charts">
            <div className="chart-container">
              <h3>Sales Trend</h3>
              <Bar 
                data={salesData} 
                options={{
                  responsive: true,
                  plugins: {
                    legend: {
                      position: 'top',
                    },
                    title: {
                      display: true,
                      text: 'Monthly Sales',
                    },
                  },
                }} 
              />
            </div>
            <div className="chart-container">
              <h3>Sales by Category</h3>
              <Pie 
                data={categorySalesData} 
                options={{
                  responsive: true,
                  plugins: {
                    legend: {
                      position: 'right',
                    },
                    title: {
                      display: true,
                      text: 'Category Distribution',
                    },
                  },
                }} 
              />
            </div>
            <div className="chart-container">
              <h3>Profit Margin Trend</h3>
              <Line 
                data={profitMarginData}
                options={{
                  responsive: true,
                  plugins: {
                    legend: {
                      position: 'top',
                    },
                    title: {
                      display: true,
                      text: 'Monthly Profit Margin',
                    },
                  },
                }} 
              />
            </div>
            <div className="chart-container">
              <h3>Payment Methods</h3>
              <Pie 
                data={paymentMethodData}
                options={{
                  responsive: true,
                  plugins: {
                    legend: {
                      position: 'right',
                    },
                    title: {
                      display: true,
                      text: 'Payment Method Distribution',
                    },
                  },
                }} 
              />
            </div>
          </div>
        );
      case 'inventory':
        return (
          <div className="report-charts">
            <div className="chart-container wide">
              <h3>Inventory Levels by Category</h3>
              <Bar 
                data={inventoryData}
                options={{
                  responsive: true,
                  plugins: {
                    legend: {
                      position: 'top',
                    },
                    title: {
                      display: true,
                      text: 'Current Stock vs. Reorder Level',
                    },
                  },
                }} 
              />
            </div>
            <div className="chart-container">
              <h3>Stock Value Distribution</h3>
              <Pie 
                data={categorySalesData}
                options={{
                  responsive: true,
                  plugins: {
                    legend: {
                      position: 'right',
                    },
                    title: {
                      display: true,
                      text: 'Value by Category',
                    },
                  },
                }} 
              />
            </div>
          </div>
        );
      case 'customers':
        return (
          <div className="report-charts">
            <div className="chart-container wide">
              <h3>Customer Growth</h3>
              <Line 
                data={{
                  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                  datasets: [
                    {
                      label: 'Total Customers',
                      data: [270, 285, 298, 315, 330, 342],
                      fill: false,
                      backgroundColor: 'rgba(75, 108, 183, 0.6)',
                      borderColor: 'rgba(75, 108, 183, 1)',
                      tension: 0.4,
                    },
                    {
                      label: 'New Customers',
                      data: [15, 20, 13, 17, 15, 12],
                      fill: false,
                      backgroundColor: 'rgba(75, 192, 192, 0.6)',
                      borderColor: 'rgba(75, 192, 192, 1)',
                      tension: 0.4,
                    },
                  ],
                }}
                options={{
    responsive: true,
                  plugins: {
                    legend: {
                      position: 'top',
                    },
        title: {
          display: true,
                      text: 'Customer Growth',
                    },
                  },
                }} 
              />
            </div>
            <div className="chart-container">
              <h3>Customer Spending Distribution</h3>
              <Pie 
                data={{
                  labels: ['0-5K', '5K-15K', '15K-30K', '30K-50K', '50K+'],
                  datasets: [
                    {
                      label: 'Customers by Spending',
                      data: [85, 120, 68, 42, 27],
                      backgroundColor: [
                        'rgba(75, 108, 183, 0.6)',
                        'rgba(54, 162, 235, 0.6)',
                        'rgba(255, 206, 86, 0.6)',
                        'rgba(75, 192, 192, 0.6)',
                        'rgba(153, 102, 255, 0.6)',
                      ],
                      borderColor: [
                        'rgba(75, 108, 183, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)',
                        'rgba(153, 102, 255, 1)',
                      ],
                      borderWidth: 1,
                    },
                  ],
                }}
                options={{
                  responsive: true,
                  plugins: {
                    legend: {
                      position: 'right',
                    },
        title: {
          display: true,
                      text: 'Customer Spending (₹)',
                    },
                  },
                }} 
              />
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  const renderTable = () => {
    const currentData = tableData[activeReportType] || [];
    
    let headers = [];
    if (activeReportType === 'sales') {
      headers = ['Date', 'Orders', 'Total Sales', 'Profit'];
    } else if (activeReportType === 'inventory') {
      headers = ['Category', 'Current Stock', 'Sold', 'Reorder Level', 'Stock Value'];
    } else if (activeReportType === 'customers') {
      headers = ['Customer', 'Purchases', 'Total Spent', 'Last Purchase'];
    }

    return (
      <div className="report-table-container">
        <h3>Detailed Report</h3>
        <table className="report-table">
          <thead>
            <tr>
              {headers.map((header, index) => (
                <th key={index}>{header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {currentData.map((row) => {
              if (activeReportType === 'sales') {
                return (
                  <tr key={row.id}>
                    <td>{row.date}</td>
                    <td>{row.orderCount}</td>
                    <td>{formatCurrency(row.total)}</td>
                    <td>{formatCurrency(row.profit)}</td>
                  </tr>
                );
              } else if (activeReportType === 'inventory') {
                return (
                  <tr key={row.id}>
                    <td>{row.category}</td>
                    <td>{row.currentStock}</td>
                    <td>{row.sold}</td>
                    <td>{row.reorderLevel}</td>
                    <td>{formatCurrency(row.value)}</td>
                  </tr>
                );
              } else if (activeReportType === 'customers') {
                return (
                  <tr key={row.id}>
                    <td>{row.name}</td>
                    <td>{row.purchases}</td>
                    <td>{formatCurrency(row.totalSpent)}</td>
                    <td>{row.lastPurchase}</td>
                  </tr>
                );
              }
              return null;
            })}
          </tbody>
        </table>
      </div>
    );
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
          <li className="active"><Link to="/Reportingpage"><FaFolder /> <span>Reports</span></Link></li>
        </ul>
      </div>

      {/* Main Content */}
      <div className={`main-content ${sidebarCollapsed ? 'collapsed' : ''}`}>
        {/* Top Bar */}
        <div className="top-bar">
          <div className="page-title">
            <h1>Reporting Dashboard</h1>
            <p className="subtitle">View and export business analytics</p>
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

        {/* Report Controls */}
        <div className="pos-card report-controls">
          <div className="report-type-selector">
            <button 
              className={`report-type-btn ${activeReportType === 'sales' ? 'active' : ''}`}
              onClick={() => handleReportTypeChange('sales')}
            >
              <FaChartBar /> Sales Reports
            </button>
            <button 
              className={`report-type-btn ${activeReportType === 'inventory' ? 'active' : ''}`}
              onClick={() => handleReportTypeChange('inventory')}
            >
              <FaBox /> Inventory Reports
            </button>
            <button 
              className={`report-type-btn ${activeReportType === 'customers' ? 'active' : ''}`}
              onClick={() => handleReportTypeChange('customers')}
            >
              <FaUsers /> Customer Reports
            </button>
                  </div>
          <div className="report-actions">
            <div className="report-period-selector">
                          <FaCalendarAlt />
              <select
                value={reportPeriod}
                onChange={handlePeriodChange}
              >
                <option value="week">Last 7 Days</option>
                <option value="month">Last 30 Days</option>
                <option value="quarter">Last 3 Months</option>
                <option value="year">Last 12 Months</option>
              </select>
                          </div>
            <div className="export-buttons">
                      <CSVLink 
                data={prepareExportData()}
                filename={`${activeReportType}_report_${new Date().toISOString().split('T')[0]}.csv`}
                className="export-btn"
                target="_blank"
              >
                <FaFileExcel /> Excel
                      </CSVLink>
              <button className="export-btn" onClick={exportToPdf}>
                <FaFilePdf /> PDF
              </button>
            </div>
          </div>
        </div>

        {/* Report Content */}
        <div className="report-content">
          {loading ? (
            <LoadingAnimation size="large" text="Loading report data..." />
          ) : (
            <>
              {/* Report Summary */}
              {renderReportSummary()}
              
              {/* Charts */}
              {renderCharts()}
              
              {/* Detailed Report Table */}
              {renderTable()}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Reportingpage;