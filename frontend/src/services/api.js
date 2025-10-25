// API service for connecting frontend to backend
const API_BASE_URL = 'http://localhost:4000/api';

class ApiService {
  constructor() {
    this.token = localStorage.getItem('authToken');
  }

  // Set authentication token
  setToken(token) {
    this.token = token;
    localStorage.setItem('authToken', token);
  }

  // Clear authentication token
  clearToken() {
    this.token = null;
    localStorage.removeItem('authToken');
  }

  // Get headers with authentication
  getHeaders() {
    const headers = {
      'Content-Type': 'application/json',
    };
    
    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }
    
    return headers;
  }

  // Get headers for file uploads
  getFileHeaders() {
    const headers = {};
    
    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }
    
    return headers;
  }

  // Generic request method
  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const config = {
      headers: this.getHeaders(),
      ...options,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Request failed');
      }

      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Authentication methods
  async register(userData) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async login(credentials) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  // Item methods
  async getItems() {
    return this.request('/items');
  }

  async searchItems(query) {
    return this.request(`/items/search?q=${encodeURIComponent(query)}`);
  }

  async createItem(itemData) {
    const formData = new FormData();
    
    // Add all form fields
    Object.keys(itemData).forEach(key => {
      if (key === 'images' && Array.isArray(itemData[key])) {
        // Handle multiple images
        itemData[key].forEach((image, index) => {
          formData.append('images', image);
        });
      } else if (key !== 'images') {
        formData.append(key, itemData[key]);
      }
    });

    const url = `${API_BASE_URL}/items`;
    const response = await fetch(url, {
      method: 'POST',
      headers: this.getFileHeaders(),
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to create item');
    }

    return data;
  }

  // Check if user is authenticated
  isAuthenticated() {
    return !!this.token;
  }
}

// Create and export a singleton instance
const apiService = new ApiService();
export default apiService;