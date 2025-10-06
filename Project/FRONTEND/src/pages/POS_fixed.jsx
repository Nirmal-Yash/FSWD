import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FaShoppingCart, 
  FaUser, 
  FaPlus, 
  FaRupeeSign, 
  FaQrcode, 
  FaCreditCard,
  FaMoneyBillWave,
  FaUserPlus,
  FaSearch,
  FaSave,
  FaBars,
  FaChartBar,
  FaBox,
  FaUsers,
  FaCashRegister,
  FaTrash,
  FaFolder,
  FaKey,
  FaSignOutAlt,
  FaUserCircle, // Ensure this is imported
  FaSync,
  FaPrint,
  FaDatabase,
  FaDownload,
  FaHistory
} from 'react-icons/fa';
import { QRCodeSVG } from "qrcode.react";
import { Link } from "react-router-dom";
import '../styles/dashboard.css';
import '../styles/pos.css';
import { AiFillIdcard } from 'react-icons/ai';

const POSInterface = () => {
  const navigate = useNavigate();
  const [customers, setCustomers] = useState([]);
  const [skus, setSkus] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState('');
  const [showAddCustomerModal, setShowAddCustomerModal] = useState(false);
  const [activePaymentTab, setActivePaymentTab] = useState('cash');
  const [isLoading, setIsLoading] = useState(true);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [qrCodeData, setQrCodeData] = useState('');
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });
  // Add new state variables for new features
  const [isPrinting, setIsPrinting] = useState(false);
  const [isInventorySyncing, setIsInventorySyncing] = useState(false);
  const [lastSavedOrder, setLastSavedOrder] = useState(null);
  
  // Initialize userData with default values to prevent null errors
  const [userData, setUserData] = useState({
    name: 'User',
    email: 'user@example.com'
  });
  
  // Form states
  const [orderItems, setOrderItems] = useState([{ sku_id: '', quantity: 1, subtotal: 0 }]);
  const [discount, setDiscount] = useState(0);
  const [tax, setTax] = useState(0);
  const [amountReceived, setAmountReceived] = useState(0);
  const [creditPeriodDays, setCreditPeriodDays] = useState(30);
  
  // New customer form
  const [newCustomer, setNewCustomer] = useState({
    name: '',
    contact_info: '',
    credit_limit: 500
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchCustomers();
    fetchSKUs();
    
    // Check for saved orders in local storage
    const savedOrders = getLocalStorageOrders();
    if (savedOrders.length > 0) {
      setLastSavedOrder(savedOrders[0]); // Set the most recent order
    }
    
    // Mock user data - in a real app, you would fetch this from an API
    // This ensures userData is not null when accessed
    setUserData({
      name: 'Store Admin',
      email: 'admin@storemanager.com'
    });
  }, []);

  const fetchCustomers = async () => {
    setIsLoading(true);
    try {
      // Simulate API response if backend isn't ready
      setTimeout(() => {
        const mockCustomers = [
          { id: 1, name: 'John Doe', contact_info: 'john@example.com', credit_limit: 1000 },
          { id: 2, name: 'Jane Smith', contact_info: '555-123-4567', credit_limit: 2000 }
        ];
        setCustomers(mockCustomers);
        setIsLoading(false);
      }, 500);
      
      // Uncomment this for real API
      /*
      const response = await fetch('/api/customers');
      const data = await response.json();
      setCustomers(data);
      setIsLoading(false);
      */
    } catch (error) {
      console.error('Error fetching customers:', error);
      showNotification('Failed to load customers', 'error');
      setIsLoading(false);
    }
  };

  const fetchSKUs = async () => {
    try {
      // Simulate API response if backend isn't ready
      setTimeout(() => {
        const mockSKUs = [
          { id: 1, code: 'SKU001', name: 'Product 1', price: 100, total_quantity: 50 },
          { id: 2, code: 'SKU002', name: 'Product 2', price: 200, total_quantity: 25 },
          { id: 3, code: 'SKU003', name: 'Product 3', price: 150, total_quantity: 30 }
        ];
        setSkus(mockSKUs);
      }, 500);
      
      // Uncomment this for real API
      /*
      const response = await fetch('/api/skus');
      const data = await response.json();
      setSkus(data);
      */
    } catch (error) {
      console.error('Error fetching SKUs:', error);
      showNotification('Failed to load inventory items', 'error');
    }
  };

  const handleCustomerChange = (e) => {
    setSelectedCustomer(e.target.value);
  };
  
  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  // Define toggleUserMenu function
  const toggleUserMenu = () => {
    setUserMenuOpen(!userMenuOpen);
  };
  
  const closeUserMenu = () => {
    setUserMenuOpen(false);
  };

  const handleItemChange = (index, field, value) => {
    const updatedItems = [...orderItems];
    updatedItems[index][field] = value;
    
    // If SKU changed or quantity changed, recalculate subtotal
    if (field === 'sku_id' || field === 'quantity') {
      const selectedSku = skus.find(sku => sku.id === parseInt(updatedItems[index].sku_id));
      const price = selectedSku ? selectedSku.price : 0;
      updatedItems[index].subtotal = price * updatedItems[index].quantity;
    }
    
    setOrderItems(updatedItems);
  };

  const addOrderItem = () => {
    setOrderItems([...orderItems, { sku_id: '', quantity: 1, subtotal: 0 }]);
  };

  const removeOrderItem = (index) => {
    const updatedItems = [...orderItems];
    updatedItems.splice(index, 1);
    setOrderItems(updatedItems.length ? updatedItems : [{ sku_id: '', quantity: 1, subtotal: 0 }]);
  };

  const handleNewCustomerChange = (e) => {
    const { name, value } = e.target;
    setNewCustomer({
      ...newCustomer,
      [name]: name === 'credit_limit' ? parseFloat(value) : value
    });
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  const validateCustomerForm = () => {
    const newErrors = {};
    
    if (!newCustomer.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!newCustomer.contact_info.trim()) {
      newErrors.contact_info = 'Contact information is required';
    }
    
    if (!newCustomer.credit_limit || newCustomer.credit_limit <= 0) {
      newErrors.credit_limit = 'Credit limit must be greater than 0';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const addNewCustomer = async () => {
    if (!validateCustomerForm()) return;
    
    try {
      // Simulate API response if backend isn't ready
      const newCustomerId = customers.length + 1;
      const addedCustomer = {
        id: newCustomerId,
        ...newCustomer
      };
      
      setCustomers([...customers, addedCustomer]);
      setSelectedCustomer(newCustomerId.toString());
      setShowAddCustomerModal(false);
      setNewCustomer({ name: '', contact_info: '', credit_limit: 500 });
      showNotification('Customer added successfully', 'success');
      
      // Uncomment this for real API
      /*
      const response = await fetch('/api/customers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newCustomer)
      });
      
      if (response.ok) {
        const addedCustomer = await response.json();
        setCustomers([...customers, addedCustomer]);
        setSelectedCustomer(addedCustomer.id);
        setShowAddCustomerModal(false);
        setNewCustomer({ name: '', contact_info: '', credit_limit: 500 });
        showNotification('Customer added successfully', 'success');
      } else {
        showNotification('Failed to add customer', 'error');
      }
      */
    } catch (error) {
      console.error('Error adding customer:', error);
      showNotification('Failed to add customer', 'error');
    }
  };

  const calculateTotals = () => {
    const subtotal = orderItems.reduce((sum, item) => sum + (item.subtotal || 0), 0);
    const discountAmount = (subtotal * discount) / 100;
    const afterDiscount = subtotal - discountAmount;
    const taxAmount = (afterDiscount * tax) / 100;
    const total = afterDiscount + taxAmount;
    
    return {
      subtotal: subtotal.toFixed(2),
      discountAmount: discountAmount.toFixed(2),
      taxAmount: taxAmount.toFixed(2),
      total: total.toFixed(2),
      change: (amountReceived - total).toFixed(2)
    };
  };

  // Calculate totals for the current order items
  const totals = calculateTotals();

  // Function to print receipt
  const printReceipt = (order) => {
    setIsPrinting(true);
    showNotification('Preparing receipt...', 'warning');
    
    // Create receipt content
    const receipt = generateReceiptContent(order);
    
    // Create a hidden iframe for printing
    const printFrame = document.createElement('iframe');
    printFrame.style.position = 'absolute';
    printFrame.style.top = '-9999px';
    printFrame.style.left = '-9999px';
    document.body.appendChild(printFrame);
    
    printFrame.contentDocument.write(receipt);
    printFrame.contentDocument.close();
    
    // Wait for images/styles to load
    setTimeout(() => {
      try {
        printFrame.contentWindow.print();
        showNotification('Receipt printed successfully', 'success');
      } catch (error) {
        console.error('Error printing receipt:', error);
        showNotification('Failed to print receipt', 'error');
      } finally {
        // Clean up after printing
        setTimeout(() => {
          document.body.removeChild(printFrame);
          setIsPrinting(false);
        }, 1000);
      }
    }, 500);
  };
  
  // Generate HTML receipt content
  const generateReceiptContent = (order) => {
    const selectedCustomerObj = customers.find(c => c.id === parseInt(order.customerId));
    const customerName = selectedCustomerObj ? selectedCustomerObj.name : 'Walk-in Customer';
    
    const orderDate = new Date().toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
    
    const itemsHtml = order.items.map(item => {
      const sku = skus.find(s => s.id === parseInt(item.sku_id));
      const name = sku ? sku.name : 'Unknown Product';
      const price = sku ? sku.price : 0;
      
      return `
        <tr>
          <td>${name}</td>
          <td style="text-align: center;">${item.quantity}</td>
          <td style="text-align: right;">₹${price.toFixed(2)}</td>
          <td style="text-align: right;">₹${item.subtotal.toFixed(2)}</td>
        </tr>
      `;
    }).join('');
    
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Sales Receipt</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            font-size: 12px;
          }
          .receipt {
            width: 80mm;
            max-width: 80mm;
            margin: 0 auto;
            padding: 5mm;
          }
          .receipt-header {
            text-align: center;
            margin-bottom: 10px;
          }
          .receipt-header h1 {
            margin: 0;
            font-size: 18px;
          }
          .receipt-header p {
            margin: 5px 0;
          }
          .receipt-details {
            margin-bottom: 10px;
            border-top: 1px dashed #000;
            border-bottom: 1px dashed #000;
            padding: 5px 0;
          }
          .receipt-details div {
            display: flex;
            justify-content: space-between;
            margin: 3px 0;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin: 10px 0;
          }
          th, td {
            padding: 5px;
          }
          th {
            text-align: left;
            border-bottom: 1px solid #000;
          }
          .totals {
            margin-top: 10px;
            text-align: right;
          }
          .totals div {
            display: flex;
            justify-content: space-between;
            margin: 3px 0;
          }
          .net-total {
            font-weight: bold;
            font-size: 14px;
            border-top: 1px dashed #000;
            padding-top: 5px;
            margin-top: 5px;
          }
          .footer {
            margin-top: 20px;
            text-align: center;
            font-size: 10px;
          }
        </style>
      </head>
      <body>
        <div class="receipt">
          <div class="receipt-header">
            <h1>MIRA TEXTILE</h1>
            <p>123 Textile Market, Gujarat, India</p>
            <p>Tel: +91 1234567890 | GST: 24ABCDE1234F1Z5</p>
          </div>
          
          <div class="receipt-details">
            <div>
              <span>Order ID:</span>
              <span>${order.id || `INV-${Date.now().toString().slice(-6)}`}</span>
            </div>
            <div>
              <span>Date:</span>
              <span>${orderDate}</span>
            </div>
            <div>
              <span>Customer:</span>
              <span>${customerName}</span>
            </div>
            <div>
              <span>Payment Method:</span>
              <span>${
                order.paymentMethod === 'cash' ? 'Cash' :
                order.paymentMethod === 'card' ? 'Card' :
                order.paymentMethod === 'qr' ? 'QR/UPI' :
                'Credit'
              }</span>
            </div>
          </div>
          
          <table>
            <thead>
              <tr>
                <th>Item</th>
                <th style="text-align: center;">Qty</th>
                <th style="text-align: right;">Price</th>
                <th style="text-align: right;">Total</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHtml}
            </tbody>
          </table>
          
          <div class="totals">
            <div>
              <span>Subtotal:</span>
              <span>₹${order.totals.subtotal}</span>
            </div>
            <div>
              <span>Discount (${order.discount}%):</span>
              <span>-₹${order.totals.discountAmount}</span>
            </div>
            <div>
              <span>Tax (${order.tax}%):</span>
              <span>₹${order.totals.taxAmount}</span>
            </div>
            <div class="net-total">
              <span>TOTAL:</span>
              <span>₹${order.totals.total}</span>
            </div>
            ${order.paymentMethod === 'cash' ? `
            <div>
              <span>Amount Received:</span>
              <span>₹${order.amountReceived.toFixed(2)}</span>
            </div>
            <div>
              <span>Change:</span>
              <span>₹${order.totals.change}</span>
            </div>
            ` : ''}
          </div>
          
          <div class="footer">
            <p>Thank you for shopping with us!</p>
            <p>Returns and exchanges accepted within 7 days with receipt</p>
            <p>www.miratextile.com</p>
          </div>
        </div>
      </body>
      </html>
    `;
  };
  
  // Function to sync with inventory system
  const syncWithInventory = async (order) => {
    setIsInventorySyncing(true);
    showNotification('Syncing with inventory...', 'warning');
    
    try {
      // In a real app, this would be an API call to update inventory quantities
      // Simulate API call with setTimeout
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update local inventory data for demo purposes
      const updatedSkus = [...skus];
      
      order.items.forEach(item => {
        const skuIndex = updatedSkus.findIndex(s => s.id === parseInt(item.sku_id));
        if (skuIndex !== -1) {
          // Reduce quantity in stock
          updatedSkus[skuIndex] = {
            ...updatedSkus[skuIndex],
            total_quantity: Math.max(0, updatedSkus[skuIndex].total_quantity - item.quantity)
          };
        }
      });
      
      // Update state
      setSkus(updatedSkus);
      showNotification('Inventory updated successfully', 'success');
      
      // In a real app, you would also log the transaction in inventory history
      console.log('Inventory transaction logged:', {
        transaction_type: 'SALE',
        order_id: order.id || `INV-${Date.now().toString().slice(-6)}`,
        items: order.items.map(item => ({
          sku_id: item.sku_id,
          quantity: item.quantity
        })),
        timestamp: new Date().toISOString()
      });
      
    } catch (error) {
      console.error('Error syncing with inventory:', error);
      showNotification('Failed to update inventory', 'error');
    } finally {
      setIsInventorySyncing(false);
    }
  };
  
  // Function to save order to local storage
  const saveOrderToLocalStorage = (order) => {
    try {
      // Get existing orders
      const existingOrders = JSON.parse(localStorage.getItem('pos_orders') || '[]');
      
      // Add timestamp and order ID
      const orderToSave = {
        ...order,
        id: `INV-${Date.now().toString().slice(-6)}`,
        timestamp: new Date().toISOString()
      };
      
      // Add to beginning of array (newest first)
      existingOrders.unshift(orderToSave);
      
      // Keep only last 50 orders to prevent localStorage from getting too big
      const limitedOrders = existingOrders.slice(0, 50);
      
      // Save back to localStorage
      localStorage.setItem('pos_orders', JSON.stringify(limitedOrders));
      
      // Update state for recovery if needed
      setLastSavedOrder(orderToSave);
      
      showNotification('Order saved to local storage', 'success');
      return orderToSave.id;
    } catch (error) {
      console.error('Error saving order to local storage:', error);
      showNotification('Failed to save order locally', 'error');
      return null;
    }
  };
  
  // Retrieve orders from local storage
  const getLocalStorageOrders = () => {
    try {
      return JSON.parse(localStorage.getItem('pos_orders') || '[]');
    } catch (error) {
      console.error('Error retrieving orders from local storage:', error);
      return [];
    }
  };

  // Function to handle user logout
  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      localStorage.removeItem('authToken'); // In a real app, clear auth token
      sessionStorage.clear();
      navigate('/login');
    }
  };

  // Function to handle user profile
  const handleUser = () => {
    navigate('/Profile');
  };

  // Function to handle reset password
  const handleResetPassword = () => {
    navigate('/ResetPassword');
  };

  // Show notification message
  const showNotification = (message, type = 'success') => {
    setNotification({ show: true, message, type });
    
    // Auto-hide after 3 seconds
    setTimeout(() => {
      setNotification({ show: false, message: '', type: '' });
    }, 3000);
  };

  // Updated submitOrder function to use new features
  const submitOrder = async () => {
    if (!selectedCustomer || orderItems.some(item => !item.sku_id)) {
      showNotification('Please select a customer and add at least one item', 'error');
      return;
    }
    
    const totals = calculateTotals();
    
    try {
      // Create order object
      const order = {
        customerId: selectedCustomer,
        items: orderItems.filter(item => item.sku_id),
        paymentMethod: activePaymentTab,
        discount,
        tax,
        amountReceived,
        creditPeriodDays,
        totals
      };
      
      // First save locally in case network fails
      const orderId = saveOrderToLocalStorage(order);
      
      if (!orderId) {
        return; // Stop if local save failed
      }
      
      // Sync with inventory
      await syncWithInventory(order);
      
      // Print receipt if needed
      if (window.confirm('Do you want to print a receipt?')) {
        printReceipt({...order, id: orderId});
      }
      
      // In a real app, try to send to server
      // Simulate API call with setTimeout
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Reset form for next order
      setOrderItems([{ sku_id: '', quantity: 1, subtotal: 0 }]);
      setSelectedCustomer('');
      setDiscount(0);
      setTax(0);
      setAmountReceived(0);
      setActivePaymentTab('cash');
      
      showNotification(`Order ${orderId} completed successfully`, 'success');
      
    } catch (error) {
      console.error('Error submitting order:', error);
      showNotification('Error completing order. Order was saved locally.', 'error');
    }
  };

  const handlePaymentMethodChange = (method) => {
    setActivePaymentTab(method);
    
    // If QR payment method selected, generate QR code data
    if (method === 'qr') {
      const amount = totals.total;
      const upiId = "kanoptl1999-1@oksbi";
      const merchantName = "Mira Textile";
      // Properly formatted UPI payment link
      const qrData = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(merchantName)}&am=${amount}&cu=INR&tn=Order&tr=${Date.now()}`;
      setQrCodeData(qrData);
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
          <li className="active"><Link to="/pos"><FaCashRegister /> <span>POS</span></Link></li>
          <li><Link to="/CustomerManagement"><FaUsers /> <span>Customers</span></Link></li>
          <li><Link to="/Reportingpage"><FaFolder /> <span>Reports</span></Link></li>
        </ul>
      </div>

      {/* Main Content */}
      <div className={`main-content ${sidebarCollapsed ? 'collapsed' : ''}`}>
        {/* Top Bar */}
        <div className="top-bar">
          <div className="page-title">
            <h1>Point of Sale</h1>
            <p className="subtitle">Create and manage sales transactions</p>
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
                      <h3>{userData.name}</h3>
                      <p>{userData.email}</p>
                    </div>
                  </div>
                  <div className="user-actions">
                    <button className="reset-password-btn" onClick={handleResetPassword}>
                      <FaKey /> Reset Password
                    </button>
                    <button className="reset-password-btn" onClick={handleUser}>
                      <AiFillIdcard /> User Profile
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

        {/* POS Content */}
        {isLoading ? (
          <div className="loading-spinner" data-text="Loading POS data..."></div>
        ) : (
          <div className="pos-container">
            {/* Order Entry Section */}
            <div className="pos-card">
              <h2 className="pos-card-title"><FaShoppingCart /> Create Order</h2>
              
              {/* Customer Selection */}
              <div className="customer-selection">
                <select 
                  className="customer-select"
                  value={selectedCustomer} 
                  onChange={handleCustomerChange}
                >
                  <option value="">Select Customer</option>
                  {customers.map(customer => (
                    <option key={customer.id} value={customer.id}>
                      {customer.name} - {customer.contact_info}
                    </option>
                  ))}
                </select>
                <button 
                  className="add-customer-btn"
                  onClick={() => setShowAddCustomerModal(true)}
                >
                  <FaUserPlus /> New Customer
                </button>
              </div>

              {/* Order Items */}
              <table className="order-items-table">
                          <thead>
                            <tr>
                    <th>Product</th>
                              <th>Quantity</th>
                    <th>Price</th>
                              <th>Subtotal</th>
                    <th></th>
                            </tr>
                          </thead>
                          <tbody>
                            {orderItems.map((item, index) => (
                    <tr key={index} className="order-item-row">
                                <td>
                                  <select
                    className="sku-select"
                                    value={item.sku_id}
                                    onChange={(e) => handleItemChange(index, 'sku_id', e.target.value)}
                                  >
                    <option value="">Select Product</option>
                                    {skus.map(sku => (
                                      <option key={sku.id} value={sku.id}>
                      {sku.code} - {sku.name} (₹{sku.price})
                                      </option>
                                    ))}
                                  </select>
                                </td>
                                <td>
                                  <input
                                    type="number"
                                    className="quantity-input"
                                    value={item.quantity}
                                    min="1"
                                    onChange={(e) => handleItemChange(index, 'quantity', parseInt(e.target.value))}
                                  />
                                </td>
                      <td>
                        {item.sku_id ? (
                          <span>₹{skus.find(sku => sku.id === parseInt(item.sku_id))?.price || 0}</span>
                        ) : '-'}
                      </td>
                      <td>
                        <span className="subtotal">₹{item.subtotal || 0}</span>
                      </td>
                                <td>
                                  <button 
                                    className="remove-item-btn"
                        onClick={() => removeOrderItem(index)}
                        disabled={orderItems.length === 1}
                        title="Remove Item"
                                  >
                                    <FaTrash />
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
            
            <button className="add-item-btn" onClick={addOrderItem}>
              <FaPlus /> Add Product
                    </button>

                  {/* Discount and Tax */}
                  <div className="discount-tax-container">
                    <div className="form-field">
                <label htmlFor="discount">Discount (%)</label>
                      <input
                  id="discount"
                        type="number"
                  className="discount-input"
                  value={discount}
                        min="0"
                        max="100"
                  onChange={(e) => setDiscount(parseFloat(e.target.value) || 0)}
                      />
                    </div>
                    <div className="form-field">
                <label htmlFor="tax">Tax (%)</label>
                      <input
                  id="tax"
                        type="number"
                        className="tax-input"
                  value={tax}
                  min="0"
                  onChange={(e) => setTax(parseFloat(e.target.value) || 0)}
                      />
                  </div>
                </div>
              </div>

          {/* Order Summary Section */}
          <div className="pos-card">
            <h2 className="summary-title"><FaRupeeSign /> Order Summary</h2>

                    {/* Totals */}
                    <div className="totals-container">
                      <div className="total-row">
                <span className="total-label">Subtotal</span>
                <span className="total-value">₹{totals.subtotal}</span>
                      </div>
                      <div className="total-row">
                <span className="total-label">Discount ({discount}%)</span>
                <span className="total-value">-₹{totals.discountAmount}</span>
                      </div>
                      <div className="total-row">
                <span className="total-label">Tax ({tax}%)</span>
                <span className="total-value">₹{totals.taxAmount}</span>
                      </div>
                      <div className="total-row net-amount">
                <span className="total-label">Total Amount</span>
                <span className="total-value">₹{totals.total}</span>
                    </div>
                  </div>

            {/* Payment Section */}
            <div className="payment-section">
              <h3 className="payment-title"><FaCreditCard /> Payment Details</h3>
              
                    <div className="payment-tabs">
                <div 
                        className={`payment-tab ${activePaymentTab === 'cash' ? 'active' : ''}`}
                  onClick={() => handlePaymentMethodChange('cash')}
                >
                  <FaMoneyBillWave /> Cash
                </div>
                <div 
                  className={`payment-tab ${activePaymentTab === 'card' ? 'active' : ''}`} 
                  onClick={() => handlePaymentMethodChange('card')}
                >
                  <FaCreditCard /> Card
                </div>
                <div 
                  className={`payment-tab ${activePaymentTab === 'qr' ? 'active' : ''}`} 
                  onClick={() => handlePaymentMethodChange('qr')}
                >
                  <FaQrcode /> UPI/QR
                </div>
                <div 
                        className={`payment-tab ${activePaymentTab === 'credit' ? 'active' : ''}`}
                  onClick={() => handlePaymentMethodChange('credit')}
                      >
                  <AiFillIdcard /> Credit
                </div>
                    </div>

                      {activePaymentTab === 'cash' && (
                <div className="cash-payment">
                          <div className="form-field">
                    <label htmlFor="amount-received">Amount Received</label>
                            <input
                      id="amount-received"
                              type="number"
                      className="amount-received-input"
                              value={amountReceived}
                      min="0"
                              onChange={(e) => setAmountReceived(parseFloat(e.target.value) || 0)}
                            />
                          </div>
                  
                  {amountReceived > 0 && amountReceived >= parseFloat(totals.total) && (
                            <div className="change-amount">
                      Change to Return: ₹{totals.change}
                            </div>
                          )}
                        </div>
                      )}

              {activePaymentTab === 'card' && (
                <div className="card-payment">
                  <div className="form-field">
                    <label htmlFor="card-amount">Card Amount</label>
                    <input
                      id="card-amount"
                      type="number"
                      className="amount-received-input"
                      value={parseFloat(totals.total)}
                      readOnly
                    />
                              </div>
                  <div className="card-instructions">
                    <p>Proceed to card payment terminal to complete the transaction.</p>
                            </div>
                </div>
              )}
              
              {activePaymentTab === 'qr' && (
                <div className="qr-payment">
                  <div className="qr-code">
                    <QRCodeSVG value={qrCodeData} size={150} />
                  </div>
                  <div className="qr-details">
                    <p>Scan to pay: ₹{totals.total}</p>
                    <p className="qr-instructions">Scan the QR code using any UPI app to make payment</p>
                  </div>
                        </div>
                      )}

                      {activePaymentTab === 'credit' && (
                <div className="credit-payment">
                          <div className="form-field">
                    <label htmlFor="credit-amount">Credit Amount</label>
                            <input
                      id="credit-amount"
                              type="number"
                      className="amount-received-input"
                      value={parseFloat(totals.total)}
                      readOnly
                    />
                  </div>
                  <div className="form-field">
                    <label htmlFor="credit-period">Credit Period (Days)</label>
                    <input
                      id="credit-period"
                      type="number"
                      className="credit-period-input"
                              value={creditPeriodDays}
                      min="1"
                              onChange={(e) => setCreditPeriodDays(parseInt(e.target.value) || 30)}
                            />
                          </div>
                        </div>
                      )}

                  <div className="submit-container">
                    <button 
                      className="complete-sale-btn"
                      onClick={submitOrder}
                      disabled={
                        !selectedCustomer || 
                        orderItems.some(item => !item.sku_id) ||
                        parseFloat(totals.total) <= 0 ||
                        (activePaymentTab === 'cash' && amountReceived < parseFloat(totals.total))
                      }
                    >
                      <FaSave /> Complete Sale
                    </button>
                  </div>
            
                  {/* Additional action buttons */}
                  <div className="additional-actions">
                    {lastSavedOrder && (
                      <>
                        <button 
                          className="action-button print-button" 
                          onClick={() => printReceipt(lastSavedOrder)}
                          disabled={isPrinting}
                        >
                          <FaPrint /> {isPrinting ? 'Printing...' : 'Print Last Receipt'}
                        </button>
                        <button 
                          className="action-button sync-button" 
                          onClick={() => syncWithInventory(lastSavedOrder)}
                          disabled={isInventorySyncing}
                        >
                          <FaDatabase /> {isInventorySyncing ? 'Syncing...' : 'Sync Inventory'}
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Add Customer Modal */}
      {showAddCustomerModal && (
        <div className="modal-overlay">
          <div className="modal-container">
            <div className="modal-header">
              <h2>Add New Customer</h2>
            </div>
            <div className="modal-body">
              <div className="modal-form-group">
                <label htmlFor="customer-name">Customer Name*</label>
                <input
                  id="customer-name"
                  type="text"
                  className={`form-input ${errors.name ? 'input-error' : ''}`}
                  placeholder="Enter customer name"
                  name="name"
                  value={newCustomer.name}
                  onChange={handleNewCustomerChange}
                />
                {errors.name && <p className="form-error">{errors.name}</p>}
              </div>
              
              <div className="modal-form-group">
                <label htmlFor="contact-info">Contact Information*</label>
                <input
                  id="contact-info"
                  type="text"
                  className={`form-input ${errors.contact_info ? 'input-error' : ''}`}
                  placeholder="Phone number or email"
                  name="contact_info"
                  value={newCustomer.contact_info}
                  onChange={handleNewCustomerChange}
                />
                {errors.contact_info && <p className="form-error">{errors.contact_info}</p>}
              </div>
              
              <div className="modal-form-group">
                <label htmlFor="credit-limit">Credit Limit*</label>
                <input
                  id="credit-limit"
                  type="number"
                  className={`form-input ${errors.credit_limit ? 'input-error' : ''}`}
                  placeholder="Enter credit limit"
                  name="credit_limit"
                  value={newCustomer.credit_limit}
                  onChange={handleNewCustomerChange}
                  min="0"
                />
                {errors.credit_limit && <p className="form-error">{errors.credit_limit}</p>}
              </div>
            </div>
            <div className="modal-footer">
              <button 
                className="cancel-btn"
                onClick={() => setShowAddCustomerModal(false)}
              >
                Cancel
              </button>
              <button 
                className="confirm-btn"
                onClick={addNewCustomer}
              >
                Add Customer
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Notification Toast */}
      {notification.show && (
        <div className={`toast-notification ${notification.type}`}>
          {notification.message}
        </div>
      )}
    </div>
  );
};

export default POSInterface;
