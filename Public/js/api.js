const API_URL = '/api';

const api = {
  getProducts: async () => {
    const res = await fetch(`${API_URL}/products`);
    return res.json();
  },
  
  login: async (email, password) => {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message);
    return data;
  },

  register: async (name, email, password) => {
    const res = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message);
    return data;
  },

  addProduct: async (productData, token) => {
    const res = await fetch(`${API_URL}/products`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(productData)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message);
    return data;
  },

  placeOrder: async (orderData, token) => {
    const res = await fetch(`${API_URL}/orders`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(orderData)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message);
    return data;
  },

  getUserProfile: async (token) => {
    const res = await fetch(`${API_URL}/users/profile`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message);
    return data;
  },

  updateUserProfile: async (userData, token) => {
    const res = await fetch(`${API_URL}/users/profile`, {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(userData)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message);
    return data;
  },

  getMyOrders: async (token) => {
    const res = await fetch(`${API_URL}/orders/myorders`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message);
    return data;
  },

  // --- BLOG API ---
  getBlogs: async (category = 'All') => {
    const res = await fetch(`${API_URL}/blogs?category=${encodeURIComponent(category)}`);
    return res.json();
  },
  
  getFeaturedBlogs: async () => {
    const res = await fetch(`${API_URL}/blogs/featured`);
    return res.json();
  },
  
  getBlogBySlug: async (slug) => {
    const res = await fetch(`${API_URL}/blogs/${slug}`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.message);
    return data;
  },
  
  likeBlog: async (id, token, sessionId) => {
    const res = await fetch(`${API_URL}/blogs/${id}/like`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ sessionId })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message);
    return data;
  },

  // --- AI API ---
  chat: async (message, sessionId) => {
    const res = await fetch(`${API_URL}/ai/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, sessionId })
    });
    return res.json();
  },

  getRecommendations: async (productId = null) => {
    const res = await fetch(`${API_URL}/ai/recommendations${productId ? '?productId='+productId : ''}`);
    return res.json();
  },

  getTrending: async () => {
    const res = await fetch(`${API_URL}/ai/trending`);
    return res.json();
  },

  logInteraction: async (type, entityId, sessionId, userId = null) => {
    await fetch(`${API_URL}/ai/interact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type, entityId, sessionId, userId })
    }).catch(err => console.error('Error logging interaction', err));
  }
};
