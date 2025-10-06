/**
 * Application Configuration
 * 
 * This file contains all the configuration settings for the application.
 * It's recommended to use this file for all environment-specific variables.
 */

// API Configuration
const API_CONFIG = {
  // Base URL for backend API
  BASE_URL: process.env.REACT_APP_API_URL || 'http://localhost:8082/api',
  
  // Timeouts
  TIMEOUT: 30000, // 30 seconds
  
  // API Endpoints
  ENDPOINTS: {
    // Auth endpoints
    AUTH: {
      LOGIN: '/auth/login',
      LOGOUT: '/auth/logout',
      REFRESH: '/auth/refresh',
      FORGOT_PASSWORD: '/auth/forgot-password',
      RESET_PASSWORD: '/auth/reset-password',
    },
    
    // User endpoints
    USER: {
      PROFILE: '/admin/users/profile',
      CURRENT: '/admin/users/current',
      ALL: '/admin/users',
    },
    
    // Dashboard endpoints
    DASHBOARD: {
      METRICS: '/dashboard/metrics',
      SALES: '/dashboard/sales',
      INVENTORY: '/dashboard/inventory-distribution',
      TRENDS: '/dashboard/monthly-trends',
      CREDITS: '/dashboard/outstanding-credits',
    },
    
    // Inventory endpoints
    INVENTORY: {
      PRODUCTS: '/admin/products',
    },
  },
};

// Authentication Configuration
const AUTH_CONFIG = {
  // Token settings
  TOKEN_KEY: 'token',
  REFRESH_TOKEN_KEY: 'refreshToken',
  USER_KEY: 'user',
  
  // Token expiration (in milliseconds)
  TOKEN_EXPIRATION: 8 * 60 * 60 * 1000, // 8 hours
  
  // Default roles
  ROLES: {
    ADMIN: 'STORE_MANAGER',
    STAFF: 'INVENTORY_STAFF',
    CASHIER: 'CASHIER',
  },
};

// UI Configuration
const UI_CONFIG = {
  // Theme settings
  THEMES: {
    LIGHT: 'light',
    DARK: 'dark',
  },
  
  // Animation durations (in milliseconds)
  ANIMATION: {
    TOAST_DURATION: 3000,
  },
  
  // Default settings
  DEFAULTS: {
    PAGINATION_SIZE: 10,
    TABLE_PAGE_SIZES: [5, 10, 25, 50],
    DATE_FORMAT: 'YYYY-MM-DD',
    TIMESTAMP_FORMAT: 'YYYY-MM-DD HH:mm:ss',
  },
};

// Export all configuration objects
export { API_CONFIG, AUTH_CONFIG, UI_CONFIG };

// For backward compatibility, export API_BASE_URL directly
export const API_BASE_URL = API_CONFIG.BASE_URL; 