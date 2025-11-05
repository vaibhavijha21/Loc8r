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

  // Admin-specific auth endpoints
  async adminRegister(adminData) {
    return this.request('/admin/register', {
      method: 'POST',
      body: JSON.stringify(adminData),
    });
  }

  async adminLogin(credentials) {
    return this.request('/admin/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  // Admin methods
  async getPendingClaims() {
    return this.request('/admin/claims/pending');
  }

  async getAllClaims() {
    return this.request('/admin/claims');
  }

  async getAdminAnalytics() {
    return this.request('/admin/analytics');
  }

  async getAllUsers() {
    return this.request('/admin/users');
  }

  async getAllItems() {
    return this.request('/admin/items');
  }

  async updateClaimStatus(claimId, status) {
    return this.request(`/admin/claims/${claimId}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
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

  // Get single item details (includes images, claims, lost/found info)
  async getItem(itemId) {
    return this.request(`/items/${itemId}`);
  }

  // Build full URL for uploaded files (backend serves /uploads statically)
  getUploadUrl(path) {
    if (!path) return '';
    // if DB already stores an absolute URL, return it as-is
    if (/^https?:\/\//i.test(path)) return path;
    // API_BASE_URL is like http://localhost:4000/api -> remove /api to get root
    const root = API_BASE_URL.replace(/\/api\/?$/, '');
    // ensure path starts with '/'
    return `${root}${path.startsWith('/') ? path : '/' + path}`;
  }


  isAuthenticated() {
    return !!this.token;
  }
}


const apiService = new ApiService();
export default apiService;