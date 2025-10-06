// Use the proxy configuration from package.json
// No need to specify the full URL as it will be proxied

// Simulated API responses
const SIMULATED_DELAY = 1500;

// API configuration
const API_BASE_URL = 'http://localhost:8080/api';

// Helper function to handle API responses
const handleResponse = async (response) => {
    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || 'Something went wrong');
    }
    return data;
};

// Helper function to get auth header
const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    return token ? { 'Authorization': `Bearer ${token}` } : {};
};

export const login = async (credentials) => {
    try {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(credentials)
        });
        
        const data = await handleResponse(response);
        
        // Store token in localStorage
        if (data.token) {
            localStorage.setItem('token', data.token);
        }
        
        return data;
    } catch (error) {
        console.error('Login error:', error);
        throw error;
    }
};

export const fetchUserProfile = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/auth/profile`, {
            headers: {
                ...getAuthHeader(),
                'Content-Type': 'application/json'
            }
        });
        
        return handleResponse(response);
    } catch (error) {
        console.error('Error fetching user profile:', error);
        throw error;
    }
};

export const forgotPassword = async (email) => {
    try {
        const response = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email })
        });
        
        return handleResponse(response);
    } catch (error) {
        console.error('Forgot password error:', error);
        throw error;
    }
};

export const resetPassword = async (token, newPassword) => {
    try {
        const response = await fetch(`${API_BASE_URL}/auth/reset-password`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ token, newPassword })
        });
        
        return handleResponse(response);
    } catch (error) {
        console.error('Reset password error:', error);
        throw error;
    }
};

// Product API functions
export const getAllProducts = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/products`, {
            headers: {
                ...getAuthHeader(),
                'Content-Type': 'application/json'
            }
        });
        
        return handleResponse(response);
    } catch (error) {
        console.error('Error fetching products:', error);
        throw error;
    }
};

export const createProduct = async (productData) => {
    try {
        const response = await fetch(`${API_BASE_URL}/products`, {
            method: 'POST',
            headers: {
                ...getAuthHeader(),
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(productData)
        });
        
        return handleResponse(response);
    } catch (error) {
        console.error('Error creating product:', error);
        throw error;
    }
};

export const updateProduct = async (productId, productData) => {
    try {
        const response = await fetch(`${API_BASE_URL}/products/${productId}`, {
            method: 'PUT',
            headers: {
                ...getAuthHeader(),
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(productData)
        });
        
        return handleResponse(response);
    } catch (error) {
        console.error('Error updating product:', error);
        throw error;
    }
};

export const updateInventory = async (productId, inventoryData) => {
    try {
        const response = await fetch(`${API_BASE_URL}/products/${productId}/inventory`, {
            method: 'PUT',
            headers: {
                ...getAuthHeader(),
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(inventoryData)
        });
        
        return handleResponse(response);
    } catch (error) {
        console.error('Error updating inventory:', error);
        throw error;
    }
};

export const deleteProduct = async (productId) => {
    try {
        const response = await fetch(`${API_BASE_URL}/products/${productId}`, {
            method: 'DELETE',
            headers: {
                ...getAuthHeader(),
                'Content-Type': 'application/json'
            }
        });
        
        return handleResponse(response);
    } catch (error) {
        console.error('Error deleting product:', error);
        throw error;
    }
};

export const getLowStockProducts = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/products/low-stock`, {
            headers: {
                ...getAuthHeader(),
                'Content-Type': 'application/json'
            }
        });
        
        return handleResponse(response);
    } catch (error) {
        console.error('Error fetching low stock products:', error);
        throw error;
    }
}; 