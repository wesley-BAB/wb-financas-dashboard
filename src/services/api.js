// API Configuration
const API_BASE_URL = 'http://localhost:3001/api';

// Generic API request handler
const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  // Add auth token if available
  const token = localStorage.getItem('auth-token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  try {
    const response = await fetch(url, config);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
};

// Authentication API
export const authApi = {
  login: async (username, password) => {
    const response = await apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });
    
    if (response.token) {
      localStorage.setItem('auth-token', response.token);
      localStorage.setItem('current-user', JSON.stringify(response.user));
    }
    
    return response;
  },

  register: async (username, password) => {
    return await apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });
  },

  logout: () => {
    localStorage.removeItem('auth-token');
    localStorage.removeItem('current-user');
  },

  getCurrentUser: () => {
    const userStr = localStorage.getItem('current-user');
    return userStr ? JSON.parse(userStr) : null;
  }
};

// Users API
export const usersApi = {
  getAll: async () => {
    return await apiRequest('/users');
  },

  create: async (userData) => {
    return await apiRequest('/users', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },

  update: async (id, userData) => {
    return await apiRequest(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  },

  delete: async (id) => {
    return await apiRequest(`/users/${id}`, {
      method: 'DELETE',
    });
  }
};

// Categories API
export const categoriesApi = {
  getAll: async () => {
    return await apiRequest('/categories');
  },

  create: async (categoryData) => {
    return await apiRequest('/categories', {
      method: 'POST',
      body: JSON.stringify(categoryData),
    });
  },

  update: async (id, categoryData) => {
    return await apiRequest(`/categories/${id}`, {
      method: 'PUT',
      body: JSON.stringify(categoryData),
    });
  },

  delete: async (id) => {
    return await apiRequest(`/categories/${id}`, {
      method: 'DELETE',
    });
  }
};

// Types API
export const typesApi = {
  getAll: async () => {
    return await apiRequest('/types');
  },

  create: async (typeData) => {
    return await apiRequest('/types', {
      method: 'POST',
      body: JSON.stringify(typeData),
    });
  },

  update: async (id, typeData) => {
    return await apiRequest(`/types/${id}`, {
      method: 'PUT',
      body: JSON.stringify(typeData),
    });
  },

  delete: async (id) => {
    return await apiRequest(`/types/${id}`, {
      method: 'DELETE',
    });
  }
};

// Transactions API
export const transactionsApi = {
  getAll: async (userId, startDate, endDate) => {
    const params = new URLSearchParams();
    if (userId) params.append('userId', userId);
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    
    const query = params.toString() ? `?${params.toString()}` : '';
    return await apiRequest(`/transactions${query}`);
  },

  create: async (transactionData) => {
    return await apiRequest('/transactions', {
      method: 'POST',
      body: JSON.stringify(transactionData),
    });
  },

  update: async (id, transactionData) => {
    return await apiRequest(`/transactions/${id}`, {
      method: 'PUT',
      body: JSON.stringify(transactionData),
    });
  },

  delete: async (id) => {
    return await apiRequest(`/transactions/${id}`, {
      method: 'DELETE',
    });
  },

  getStats: async (userId, startDate, endDate) => {
    const params = new URLSearchParams();
    if (userId) params.append('userId', userId);
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    
    const query = params.toString() ? `?${params.toString()}` : '';
    return await apiRequest(`/transactions/stats${query}`);
  }
};