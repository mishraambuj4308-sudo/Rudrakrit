const API_URL = 'http://localhost:5000/api';

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
  }
};
