const API_BASE_URL = 'http://localhost:5000/api';

// Helper to make API requests with auth token
const apiRequest = async (endpoint, options = {}) => {
  const token = localStorage.getItem('token');
  
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Something went wrong');
  }

  return data;
};

export const authService = {
  login: async (credentials) => {
    const data = await apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    if (data.token) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data));
    }
    return data;
  },

  register: async (userData) => {
    const data = await apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
    if (data.token) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data));
    }
    return data;
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getProfile: async () => {
    return await apiRequest('/auth/profile');
  },

  updateProfile: async (profileData) => {
    const data = await apiRequest('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
    if (data.token) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data));
    }
    return data;
  },

  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },
};

export const discussionService = {
  create: async (discussionData) => {
    return await apiRequest('/discussions', {
      method: 'POST',
      body: JSON.stringify(discussionData),
    });
  },

  getAll: async (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.category) params.append('category', filters.category);
    if (filters.search) params.append('search', filters.search);
    if (filters.tag) params.append('tag', filters.tag);
    
    const queryStr = params.toString() ? `?${params.toString()}` : '';
    return await apiRequest(`/discussions${queryStr}`);
  },

  getById: async (id) => {
    return await apiRequest(`/discussions/${id}`);
  },

  update: async (id, discussionData) => {
    return await apiRequest(`/discussions/${id}`, {
      method: 'PUT',
      body: JSON.stringify(discussionData),
    });
  },

  delete: async (id) => {
    return await apiRequest(`/discussions/${id}`, {
      method: 'DELETE',
    });
  },
};

export const commentService = {
  create: async (commentData) => {
    return await apiRequest('/comments', {
      method: 'POST',
      body: JSON.stringify(commentData),
    });
  },

  getByDiscussion: async (discussionId) => {
    return await apiRequest(`/comments/discussion/${discussionId}`);
  },

  delete: async (commentId) => {
    return await apiRequest(`/comments/${commentId}`, {
      method: 'DELETE',
    });
  },
};
