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
  FaEdit,
  FaTrash,
  FaSync,
  FaFilter,
  FaSearch,
  FaPlusCircle,
  FaDownload,
  FaUpload,
  FaBoxOpen,
  FaTags,
  FaListAlt,
  FaRupeeSign,
  FaCashRegister,
  FaHistory,
  FaCalendarAlt
} from 'react-icons/fa';
import { AiFillIdcard } from 'react-icons/ai';
import '../styles/dashboard.css';
import '../styles/inventory.css';
import LoadingAnimation from '../components/LoadingAnimation';
import { useAuth } from '../context/AuthContext';

// Dummy data for inventory items
const dummyInventoryData = [
  {
    id: 1,
    sku: 'FBR-CTN-001',
    name: 'Cotton Fabric',
    category: 'Fabric',
    price: 350,
    quantity: 150,
    size: 'Standard',
    color: 'White',
    status: 'In Stock',
    lastUpdated: '2023-05-10'
  },
  {
    id: 2,
    sku: 'FBR-SLK-002',
    name: 'Silk Fabric',
    category: 'Fabric',
    price: 850,
    quantity: 75,
    size: 'Standard',
    color: 'Red',
    status: 'In Stock',
    lastUpdated: '2023-05-12'
  },
  {
    id: 3,
    sku: 'FBR-PLY-003',
    name: 'Polyester Blend',
    category: 'Fabric',
    price: 250,
    quantity: 200,
    size: 'Standard',
    color: 'Blue',
    status: 'In Stock',
    lastUpdated: '2023-05-15'
  },
  {
    id: 4,
    sku: 'BTN-PLS-001',
    name: 'Plastic Buttons',
    category: 'Accessories',
    price: 120,
    quantity: 500,
    size: 'Small',
    color: 'Black',
    status: 'In Stock',
    lastUpdated: '2023-05-18'
  },
  {
    id: 5,
    sku: 'FBR-LNN-004',
    name: 'Linen Fabric',
    category: 'Fabric',
    price: 450,
    quantity: 8,
    size: 'Standard',
    color: 'Beige',
    status: 'Low Stock',
    lastUpdated: '2023-05-20'
  },
  {
    id: 6,
    sku: 'ZPR-MTL-001',
    name: 'Metal Zippers',
    category: 'Accessories',
    price: 85,
    quantity: 350,
    size: 'Medium',
    color: 'Silver',
    status: 'In Stock',
    lastUpdated: '2023-05-22'
  },
  {
    id: 7,
    sku: 'THR-CTN-001',
    name: 'Cotton Thread',
    category: 'Accessories',
    price: 50,
    quantity: 5,
    size: 'Standard',
    color: 'Assorted',
    status: 'Low Stock',
    lastUpdated: '2023-05-25'
  },
  {
    id: 8,
    sku: 'FBR-DNM-005',
    name: 'Denim Fabric',
    category: 'Fabric',
    price: 550,
    quantity: 100,
    size: 'Standard',
    color: 'Blue',
    status: 'In Stock',
    lastUpdated: '2023-05-28'
  },
  {
    id: 9,
    sku: 'BTN-WOD-002',
    name: 'Wooden Buttons',
    category: 'Accessories',
    price: 180,
    quantity: 250,
    size: 'Medium',
    color: 'Brown',
    status: 'In Stock',
    lastUpdated: '2023-05-30'
  },
  {
    id: 10,
    name: 'Velvet Fabric',
    sku: 'FBR-VLV-006',
    category: 'Fabric',
    price: 750,
    quantity: 50,
    size: 'Standard',
    color: 'Purple',
    status: 'In Stock',
    lastUpdated: '2023-06-01'
  }
];

// Categories for filtering
const categories = [
  { id: 'all', name: 'All Categories' },
  { id: 'fabric', name: 'Fabric' },
  { id: 'accessories', name: 'Accessories' },
  { id: 'lowstock', name: 'Low Stock Items' }
];

const InventoryManagement = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [userData, setUserData] = useState({
    name: user?.full_name || user?.username || '',
    email: user?.email || '',
    role: user?.role || ''
  });
  // State management
  const [inventory, setInventory] = useState(dummyInventoryData);
  const [filteredInventory, setFilteredInventory] = useState(dummyInventoryData);
  const [loading, setLoading] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [newProduct, setNewProduct] = useState({
    sku: '',
    name: '',
    category: 'Fabric',
    price: '',
    quantity: '',
    size: 'Standard',
    color: '',
    status: 'In Stock',
    lastUpdated: new Date().toISOString().slice(0, 10)
  });
  
  useEffect(() => {
    fetchUserData();
  }, [user]);

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

  // Filter inventory based on search and category
  useEffect(() => {
    let result = inventory;
    
    // Filter by search term
    if (searchTerm) {
      result = result.filter(item => 
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Filter by category
    if (activeCategory !== 'all') {
      if (activeCategory === 'lowstock') {
        result = result.filter(item => item.quantity < 10);
      } else {
        result = result.filter(item => 
          item.category.toLowerCase() === activeCategory.toLowerCase()
        );
      }
    }
    
    setFilteredInventory(result);
  }, [searchTerm, activeCategory, inventory]);

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

  // Category selection handler
  const handleCategoryChange = (categoryId) => {
    setActiveCategory(categoryId);
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

  // Handle opening add product modal
  const handleOpenAddModal = () => {
    setShowAddModal(true);
  };

  // Handle closing add product modal
  const handleCloseAddModal = () => {
    setShowAddModal(false);
    // Reset form
    setNewProduct({
      sku: '',
      name: '',
      category: 'Fabric',
      price: '',
      quantity: '',
      size: 'Standard',
      color: '',
      status: 'In Stock',
      lastUpdated: new Date().toISOString().slice(0, 10)
    });
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProduct({
      ...newProduct,
      [name]: value
    });
  };

  // Handle form submission
  const handleAddProduct = (e) => {
    e.preventDefault();
    
    // Validate form
    if (!newProduct.sku || !newProduct.name || !newProduct.price || !newProduct.quantity) {
      alert('Please fill all required fields');
      return;
    }

    // Create new product with ID
    const product = {
      ...newProduct,
      id: inventory.length + 1,
      price: parseFloat(newProduct.price),
      quantity: parseInt(newProduct.quantity),
      status: parseInt(newProduct.quantity) < 10 ? 'Low Stock' : 'In Stock'
    };

    // Add to inventory
    setInventory([...inventory, product]);
    
    // Close modal
    handleCloseAddModal();
    
    // Show success message
    alert('Product added successfully!');
  };

  // Export inventory data to CSV
  const handleExportCSV = () => {
    // Create CSV content
    const headers = ['SKU', 'Name', 'Category', 'Price', 'Quantity', 'Size', 'Color', 'Status', 'Last Updated'];
    
    let csvContent = headers.join(',') + '\n';
    
    // Add data rows
    filteredInventory.forEach(item => {
      const row = [
        item.sku,
        `"${item.name}"`, // Quote product name to handle commas in names
        item.category,
        item.price,
        item.quantity,
        item.size,
        item.color,
        item.status,
        item.lastUpdated
      ];
      csvContent += row.join(',') + '\n';
    });
    
    // Create a blob and download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    
    // Create temporary link and trigger download
    const link = document.createElement('a');
    const timestamp = new Date().toISOString().split('T')[0];
    link.href = url;
    link.setAttribute('download', `inventory_export_${timestamp}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Import inventory data from CSV
  const handleImportCSV = () => {
    // Create file input element
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '.csv';
    
    // Handle file selection
    fileInput.onchange = (e) => {
      const file = e.target.files[0];
      if (!file) return;
      
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const csvData = event.target.result;
          const lines = csvData.split('\n');
          
          // Get headers and verify format
          const headers = lines[0].split(',');
          if (headers.length < 8) {
            alert('Invalid CSV format. Please use the correct template.');
            return;
          }
          
          // Parse data rows
          const newInventory = [];
          let skippedRows = 0;
          
          for (let i = 1; i < lines.length; i++) {
            if (!lines[i].trim()) continue; // Skip empty lines
            
            const values = lines[i].split(',');
            if (values.length < 8) {
              skippedRows++;
              continue;
            }
            
            // Extract product name - handle quoted values that might contain commas
            let productName = values[1];
            if (productName.startsWith('"') && !productName.endsWith('"')) {
              // Find the closing quote
              let nameIndex = 2;
              while (nameIndex < values.length && !values[nameIndex - 1].endsWith('"')) {
                productName += ',' + values[nameIndex];
                nameIndex++;
              }
              // Adjust the remaining values
              values.splice(1, nameIndex - 1, productName);
            }
            
            // Clean up quotes from product name
            productName = productName.replace(/^"(.+)"$/, '$1');
            
            // Create product object
            const product = {
              id: inventory.length + newInventory.length + 1,
              sku: values[0],
              name: productName,
              category: values[2],
              price: parseFloat(values[3]),
              quantity: parseInt(values[4]),
              size: values[5],
              color: values[6],
              status: parseInt(values[4]) < 10 ? 'Low Stock' : 'In Stock',
              lastUpdated: values[8] || new Date().toISOString().split('T')[0]
            };
            
            // Validate required fields
            if (!product.sku || !product.name || isNaN(product.price) || isNaN(product.quantity)) {
              skippedRows++;
              continue;
            }
            
            newInventory.push(product);
          }
          
          // Update inventory
          if (newInventory.length > 0) {
            setInventory([...inventory, ...newInventory]);
            alert(`Successfully imported ${newInventory.length} products.${skippedRows > 0 ? ` Skipped ${skippedRows} invalid rows.` : ''}`);
          } else {
            alert('No valid products found in the CSV file.');
          }
          
    } catch (error) {
          console.error('Error parsing CSV:', error);
          alert('Error parsing CSV file. Please check the format and try again.');
        }
      };
      
      reader.readAsText(file);
    };
    
    // Trigger file selection
    fileInput.click();
  };

  // Handle edit product
  const handleEditProduct = (productId) => {
    const product = inventory.find(item => item.id === productId);
    if (product) {
      setEditingProduct({
        ...product,
        price: product.price.toString(),
        quantity: product.quantity.toString()
      });
      setShowEditModal(true);
    }
  };

  // Handle delete product
  const handleDeleteProduct = (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      setInventory(inventory.filter(item => item.id !== productId));
      alert('Product deleted successfully!');
    }
  };

  // Handle closing edit modal
  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setEditingProduct(null);
  };

  // Handle form input changes for editing
  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditingProduct({
      ...editingProduct,
      [name]: value
    });
  };

  // Handle form submission for editing
  const handleSaveProduct = (e) => {
    e.preventDefault();
    
    // Validate form
    if (!editingProduct.sku || !editingProduct.name || !editingProduct.price || !editingProduct.quantity) {
      alert('Please fill all required fields');
      return;
    }

    // Update product
    const updatedProduct = {
      ...editingProduct,
      price: parseFloat(editingProduct.price),
      quantity: parseInt(editingProduct.quantity),
      status: parseInt(editingProduct.quantity) < 10 ? 'Low Stock' : 'In Stock',
      lastUpdated: new Date().toISOString().slice(0, 10)
    };

    // Update inventory
    setInventory(inventory.map(item => 
      item.id === updatedProduct.id ? updatedProduct : item
    ));
    
    // Close modal
    handleCloseEditModal();
    
    // Show success message
    alert('Product updated successfully!');
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
          <li className="active"><Link to="/inventory/manage"><FaBox /> <span>Inventory</span></Link></li>
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
            <h1>Inventory Management</h1>
            <p className="subtitle">Manage your products and stock levels</p>
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

        {/* Inventory Content */}
        <div className="inventory-content">
          {/* Inventory Actions */}
          <div className="inventory-actions">
            <div className="search-container">
              <div className="search-input-wrapper">
                <FaSearch className="search-icon" />
                <input 
                  type="text" 
                  placeholder="Search inventory..." 
                  value={searchTerm}
                  onChange={handleSearch}
                  className="search-input"
                />
              </div>
            </div>
            <div className="action-buttons">
              <button className="action-button primary" onClick={handleOpenAddModal}>
                <FaPlusCircle /> Add Product
              </button>
              <button className="action-button secondary" onClick={handleImportCSV}>
                <FaUpload /> Import
              </button>
              <button className="action-button tertiary" onClick={handleExportCSV}>
                <FaDownload /> Export
              </button>
            </div>
          </div>

          {/* Category Filter */}
          <div className="category-filter">
            {categories.map(category => (
              <button 
                key={category.id}
                className={`category-btn ${activeCategory === category.id ? 'active' : ''}`}
                onClick={() => handleCategoryChange(category.id)}
              >
                {category.name}
              </button>
            ))}
              </div>

          {/* Inventory Table */}
          {loading ? (
            <LoadingAnimation size="large" text="Loading inventory data..." />
          ) : (
            <div className="inventory-table-container">
              <table className="inventory-table">
                <thead>
                  <tr>
                    <th>SKU</th>
                    <th>Product Name</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Quantity</th>
                    <th>Status</th>
                    <th>Last Updated</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredInventory.length === 0 ? (
                    <tr>
                      <td colSpan="8" className="no-data">No products found</td>
                    </tr>
                  ) : (
                    filteredInventory.map((product) => (
                      <tr key={product.id} className={product.quantity < 10 ? 'low-stock' : ''}>
                        <td>{product.sku}</td>
                        <td>
                          <div className="product-cell">
                            <span className="product-color" style={{ backgroundColor: product.color.toLowerCase() }}></span>
                            <span>{product.name}</span>
              </div>
                        </td>
                        <td>{product.category}</td>
                        <td>{formatCurrency(product.price)}</td>
                        <td>
                          <div className="quantity-cell">
                            <span className={`quantity-indicator ${product.quantity < 10 ? 'low' : 'normal'}`}></span>
                            {product.quantity}
            </div>
                        </td>
                        <td>
                          <span className={`status-badge ${product.quantity < 10 ? 'low-stock' : 'in-stock'}`}>
                            {product.quantity < 10 ? 'Low Stock' : 'In Stock'}
                          </span>
                        </td>
                        <td>{product.lastUpdated}</td>
                        <td>
                          <div className="action-cell">
                            <button 
                              className="icon-button edit"
                              onClick={() => handleEditProduct(product.id)}
                              title="Edit Product"
                            >
                              <FaEdit />
                            </button>
                            <button 
                              className="icon-button delete"
                              onClick={() => handleDeleteProduct(product.id)}
                              title="Delete Product"
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
          
          {/* Inventory Stats */}
          <div className="inventory-stats">
            <div className="stat-card">
              <div className="stat-icon products">
                <FaBoxOpen />
              </div>
              <div className="stat-content">
                <h3>Total Products</h3>
                <p className="stat-value">{inventory.length}</p>
        </div>
      </div>

            <div className="stat-card">
              <div className="stat-icon categories">
                <FaTags />
              </div>
              <div className="stat-content">
                <h3>Categories</h3>
                <p className="stat-value">2</p>
              </div>
            </div>
            
            <div className="stat-card">
              <div className="stat-icon low-stock">
                <FaListAlt />
              </div>
              <div className="stat-content">
                <h3>Low Stock Items</h3>
                <p className="stat-value">{inventory.filter(item => item.quantity < 10).length}</p>
              </div>
            </div>
            
            <div className="stat-card">
              <div className="stat-icon total-value">
                <FaRupeeSign />
              </div>
              <div className="stat-content">
                <h3>Inventory Value</h3>
                <p className="stat-value">
                  {formatCurrency(
                    inventory.reduce((total, item) => total + (item.price * item.quantity), 0)
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add Product Modal */}
      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Add New Product</h2>
              <button className="modal-close" onClick={handleCloseAddModal}>&times;</button>
            </div>
            <form onSubmit={handleAddProduct} className="add-product-form">
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="sku">SKU*</label>
                  <input
            type="text"
                    id="sku"
                    name="sku"
                    value={newProduct.sku}
                    onChange={handleInputChange}
                    placeholder="e.g. FBR-CTN-001"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="name">Product Name*</label>
                  <input
            type="text"
                    id="name"
                    name="name"
                    value={newProduct.name}
                    onChange={handleInputChange}
                    placeholder="e.g. Cotton Fabric"
                    required
                  />
                </div>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="category">Category*</label>
                  <select
                    id="category"
                    name="category"
                    value={newProduct.category}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="Fabric">Fabric</option>
                    <option value="Accessories">Accessories</option>
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="size">Size</label>
                  <select
                    id="size"
                    name="size"
                    value={newProduct.size}
                    onChange={handleInputChange}
                  >
                    <option value="Standard">Standard</option>
                    <option value="Small">Small</option>
                    <option value="Medium">Medium</option>
                    <option value="Large">Large</option>
                  </select>
                </div>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="price">Price (₹)*</label>
                  <input
            type="number"
                    id="price"
                    name="price"
                    value={newProduct.price}
                    onChange={handleInputChange}
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="quantity">Quantity*</label>
                  <input
                    type="number"
                    id="quantity"
                    name="quantity"
                    value={newProduct.quantity}
                    onChange={handleInputChange}
                    placeholder="0"
                    min="0"
                    required
                  />
                </div>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="color">Color</label>
                  <input
            type="text"
                    id="color"
                    name="color"
                    value={newProduct.color}
                    onChange={handleInputChange}
                    placeholder="e.g. White"
                  />
                </div>
              </div>
              
              <div className="form-actions">
                <button type="button" className="cancel-btn" onClick={handleCloseAddModal}>Cancel</button>
                <button type="submit" className="submit-btn">Add Product</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Product Modal */}
      {showEditModal && editingProduct && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Edit Product</h2>
              <button className="modal-close" onClick={handleCloseEditModal}>&times;</button>
            </div>
            <form onSubmit={handleSaveProduct} className="add-product-form">
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="edit-sku">SKU*</label>
                  <input
                    type="text"
                    id="edit-sku"
                    name="sku"
                    value={editingProduct.sku}
                    onChange={handleEditInputChange}
                    placeholder="e.g. FBR-CTN-001"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="edit-name">Product Name*</label>
                  <input
                    type="text"
                    id="edit-name"
                    name="name"
                    value={editingProduct.name}
                    onChange={handleEditInputChange}
                    placeholder="e.g. Cotton Fabric"
                    required
                  />
                </div>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="edit-category">Category*</label>
                  <select
                    id="edit-category"
                    name="category"
                    value={editingProduct.category}
                    onChange={handleEditInputChange}
                    required
                  >
                    <option value="Fabric">Fabric</option>
                    <option value="Accessories">Accessories</option>
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="edit-size">Size</label>
                  <select
                    id="edit-size"
                    name="size"
                    value={editingProduct.size}
                    onChange={handleEditInputChange}
                  >
                    <option value="Standard">Standard</option>
                    <option value="Small">Small</option>
                    <option value="Medium">Medium</option>
                    <option value="Large">Large</option>
                  </select>
                </div>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="edit-price">Price (₹)*</label>
                  <input
            type="number"
                    id="edit-price"
                    name="price"
                    value={editingProduct.price}
                    onChange={handleEditInputChange}
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="edit-quantity">Quantity*</label>
                  <input
                    type="number"
                    id="edit-quantity"
                    name="quantity"
                    value={editingProduct.quantity}
                    onChange={handleEditInputChange}
                    placeholder="0"
                    min="0"
                    required
                  />
                </div>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="edit-color">Color</label>
                  <input
            type="text"
                    id="edit-color"
                    name="color"
                    value={editingProduct.color}
                    onChange={handleEditInputChange}
                    placeholder="e.g. White"
                  />
                </div>
              </div>
              
              <div className="form-actions">
                <button type="button" className="cancel-btn" onClick={handleCloseEditModal}>Cancel</button>
                <button type="submit" className="submit-btn">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default InventoryManagement;