// src/pages/InventoryManagement.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Modal from '../components/Modal';
import FormInput from '../components/FormInput';
import '../styles/InventoryManagement.css';

const API_BASE_URL = 'http://localhost:8082/api';

const InventoryManagement = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [formData, setFormData] = useState({
    sku: '',
    name: '',
    description: '',
    price: '',
    quantity: '',
    category: '',
    size: '',
    color: ''
  });

  // Fetch products from the API
  const fetchProducts = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/Login');
        return;
      }

      const response = await fetch(`${API_BASE_URL}/admin/products`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.status === 401 || response.status === 403) {
        navigate('/Login');
        return;
      }

      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }

      const data = await response.json();
      if (data.success) {
        setProducts(data.data);
      } else {
        throw new Error(data.message || 'Failed to fetch products');
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      setError('Failed to load products. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const resetForm = () => {
    setFormData({
      sku: '',
      name: '',
      description: '',
      price: '',
      quantity: '',
      category: '',
      size: '',
      color: ''
    });
    setIsEditMode(false);
    setCurrentProduct(null);
  };

  const handleOpenAddModal = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (product) => {
    setFormData({
      sku: product.sku,
      name: product.name,
      description: product.description || '',
      price: product.price,
      quantity: product.quantity,
      category: product.category || '',
      size: product.size || '',
      color: product.color || ''
    });
    setCurrentProduct(product);
    setIsEditMode(true);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/Login');
        return;
      }

      const url = isEditMode 
        ? `${API_BASE_URL}/admin/products/${currentProduct.id}`
        : `${API_BASE_URL}/admin/products`;
      
      const method = isEditMode ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method: method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (response.status === 401 || response.status === 403) {
        navigate('/Login');
        return;
      }

      const data = await response.json();
      
      if (data.success) {
        // Refresh the product list
        fetchProducts();
        // Close the modal and reset form
    setIsModalOpen(false);
        resetForm();
        alert(isEditMode ? 'Product updated successfully!' : 'Product added successfully!');
      } else {
        throw new Error(data.message || 'Failed to save product');
      }
    } catch (error) {
      console.error('Error saving product:', error);
      alert(`Error: ${error.message}`);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) {
      return;
    }
    
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/Login');
        return;
      }

      const response = await fetch(`${API_BASE_URL}/admin/products/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.status === 401 || response.status === 403) {
        navigate('/Login');
        return;
      }

      const data = await response.json();
      
      if (data.success) {
        // Refresh the product list
        fetchProducts();
        alert('Product deleted successfully!');
      } else {
        throw new Error(data.message || 'Failed to delete product');
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      alert(`Error: ${error.message}`);
    }
  };

  return (
    <div className="inventory-container">
      <Navbar userRole="Inventory Staff" />
      <div className="inventory-header">
      <h1>Inventory Management</h1>
        <div className="header-buttons">
          <button className="add-product-button" onClick={handleOpenAddModal}>Add New Product</button>
        </div>
      </div>
      
      {error && <div className="error-message">{error}</div>}
      
      {isLoading ? (
        <div className="loading">Loading products...</div>
      ) : (
        <div className="table-container">
      <table className="inventory-table">
        <thead>
          <tr>
            <th>SKU</th>
                <th>Name</th>
                <th>Category</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Size</th>
            <th>Color</th>
                <th>Actions</th>
          </tr>
        </thead>
        <tbody>
              {products.length === 0 ? (
                <tr>
                  <td colSpan="8" className="no-data">No products found</td>
                </tr>
              ) : (
                products.map((product) => (
                  <tr key={product.id} className={product.quantity < 10 ? 'low-quantity' : ''}>
                    <td>{product.sku}</td>
                    <td>{product.name}</td>
                    <td>{product.category || '-'}</td>
                    <td>₹{product.price}</td>
                    <td>{product.quantity}</td>
                    <td>{product.size || '-'}</td>
                    <td>{product.color || '-'}</td>
                    <td className="action-buttons">
                      <button 
                        className="edit-button"
                        onClick={() => handleOpenEditModal(product)}
                      >
                        Edit
                      </button>
                      <button 
                        className="delete-button"
                        onClick={() => handleDelete(product.id)}
                      >
                        Delete
                      </button>
                    </td>
            </tr>
                ))
              )}
        </tbody>
      </table>
        </div>
      )}
      
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => {
          setIsModalOpen(false);
          resetForm();
        }} 
        title={isEditMode ? "Edit Product" : "Add New Product"}
      >
        <form onSubmit={handleSubmit} className="product-form">
        <FormInput
          label="SKU"
            name="sku"
            value={formData.sku}
            onChange={handleInputChange}
            required
          />
          <FormInput
            label="Name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
        />
        <FormInput
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            type="textarea"
        />
        <FormInput
            label="Price"
            name="price"
            type="number"
            value={formData.price}
            onChange={handleInputChange}
            required
            min="0"
            step="0.01"
        />
        <FormInput
          label="Quantity"
            name="quantity"
          type="number"
            value={formData.quantity}
            onChange={handleInputChange}
            required
            min="0"
          />
          <FormInput
            label="Category"
            name="category"
            value={formData.category}
            onChange={handleInputChange}
            type="select"
            options={['T-Shirt', 'Shirt', 'Pants', 'Jeans', 'Dress', 'Jacket', 'Other']}
          />
          <FormInput
            label="Size"
            name="size"
            value={formData.size}
            onChange={handleInputChange}
            type="select"
            options={['XS', 'S', 'M', 'L', 'XL', 'XXL', 'Custom']}
          />
          <FormInput
            label="Color"
            name="color"
            value={formData.color}
            onChange={handleInputChange}
            type="select"
            options={['Black', 'White', 'Red', 'Blue', 'Green', 'Yellow', 'Purple', 'Pink', 'Brown', 'Gray', 'Other']}
          />
          <div className="form-buttons">
            <button type="submit" className="save-button">
              {isEditMode ? 'Update Product' : 'Add Product'}
            </button>
            <button 
              type="button" 
              className="cancel-button"
              onClick={() => {
                setIsModalOpen(false);
                resetForm();
              }}
            >
              Cancel
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default InventoryManagement;