// State Management
let currentUser = JSON.parse(localStorage.getItem('user')) || null;
let cart = JSON.parse(localStorage.getItem('cart')) || [];
let products = [];
let isLoginMode = true;

// Initialization
document.addEventListener('DOMContentLoaded', () => {
  updateAuthUI();
  updateCartUI();
  loadProducts();
});

// UI Navigation
function showSection(sectionId) {
  document.querySelectorAll('main > section').forEach(sec => {
    sec.classList.remove('section-active');
    sec.classList.add('section-hidden');
  });
  const sec = document.getElementById(sectionId);
  sec.classList.remove('section-hidden');
  sec.classList.add('section-active');

  if (sectionId === 'shop') loadProducts();
  if (sectionId === 'profile') loadProfile();
}

// Authentication Modal
function openAuthModal() { document.getElementById('auth-modal').classList.add('active'); }
function closeAuthModal() { document.getElementById('auth-modal').classList.remove('active'); }

function toggleAuthMode() {
  isLoginMode = !isLoginMode;
  document.getElementById('auth-title').innerText = isLoginMode ? 'Login' : 'Register';
  document.getElementById('auth-name').style.display = isLoginMode ? 'none' : 'block';
  document.getElementById('auth-name').required = !isLoginMode;
  document.getElementById('auth-submit').innerText = isLoginMode ? 'Login' : 'Register';
  document.getElementById('auth-switch-text').innerText = isLoginMode ? "Don't have an account?" : "Already have an account?";
  document.querySelector('.auth-switch a').innerText = isLoginMode ? "Register here" : "Login here";
}

async function handleAuth(e) {
  e.preventDefault();
  const email = document.getElementById('auth-email').value;
  const password = document.getElementById('auth-password').value;

  try {
    if (isLoginMode) {
      currentUser = await api.login(email, password);
    } else {
      const name = document.getElementById('auth-name').value;
      currentUser = await api.register(name, email, password);
    }
    localStorage.setItem('user', JSON.stringify(currentUser));
    updateAuthUI();
    closeAuthModal();
    alert(`Welcome, ${currentUser.name}!`);
  } catch (err) {
    alert(err.message);
  }
}

function updateAuthUI() {
  const authBtn = document.getElementById('auth-btn');
  const navAdmin = document.getElementById('nav-admin');
  const navProfile = document.getElementById('nav-profile');

  if (currentUser) {
    authBtn.innerText = 'Logout';
    authBtn.onclick = logout;
    navProfile.style.display = 'block';
    if (currentUser.role === 'admin') {
      navAdmin.style.display = 'block';
    } else {
      navAdmin.style.display = 'none';
    }
  } else {
    authBtn.innerText = 'Login';
    authBtn.onclick = openAuthModal;
    navProfile.style.display = 'none';
    navAdmin.style.display = 'none';
  }
}

function logout() {
  currentUser = null;
  localStorage.removeItem('user');
  updateAuthUI();
  showSection('home');
}

// Products
async function loadProducts() {
  const productList = document.getElementById('product-list');
  try {
    products = await api.getProducts();
    if(products.length === 0) {
      productList.innerHTML = '<p>No products available yet. Check back later.</p>';
      return;
    }
    
    productList.innerHTML = products.map(p => `
      <div class="product-card glass">
        <img src="${p.image || 'https://images.unsplash.com/photo-1599839619722-39751411ea63?w=500&q=80'}" alt="${p.name}" class="product-img">
        <div class="product-info">
          <span class="product-category">${p.category}</span>
          <h3 class="product-title">${p.name}</h3>
          <p class="product-price">₹${p.price}</p>
          <button class="btn-outline add-to-cart-btn" onclick="addToCart('${p._id}')">Add to Cart</button>
        </div>
      </div>
    `).join('');
  } catch (err) {
    productList.innerHTML = '<p>Error loading products.</p>';
  }
}

// Cart
function toggleCart() {
  document.getElementById('cart-sidebar').classList.toggle('open');
}

function addToCart(productId) {
  const product = products.find(p => p._id === productId);
  if (!product) return;

  const existing = cart.find(item => item.product === productId);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({
      product: product._id,
      name: product.name,
      price: product.price,
      image: product.image || 'https://images.unsplash.com/photo-1599839619722-39751411ea63?w=500&q=80',
      qty: 1
    });
  }
  
  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartUI();
  
  // Show cart briefly
  const sidebar = document.getElementById('cart-sidebar');
  sidebar.classList.add('open');
  setTimeout(() => sidebar.classList.remove('open'), 2000);
}

function updateCartUI() {
  document.getElementById('cart-badge').innerText = cart.reduce((acc, item) => acc + item.qty, 0);
  
  const cartItemsContainer = document.getElementById('cart-items');
  if (cart.length === 0) {
    cartItemsContainer.innerHTML = '<p style="text-align:center; margin-top:2rem;">Your cart is empty.</p>';
    document.getElementById('cart-total').innerText = '0';
    return;
  }

  cartItemsContainer.innerHTML = cart.map(item => `
    <div class="cart-item">
      <img src="${item.image}" alt="${item.name}">
      <div class="cart-item-info">
        <h4>${item.name}</h4>
        <p>₹${item.price} x ${item.qty}</p>
      </div>
      <button style="margin-left:auto; background:none; border:none; color:#ef4444;" onclick="removeFromCart('${item.product}')">
        <i class="fa-solid fa-trash"></i>
      </button>
    </div>
  `).join('');

  const total = cart.reduce((acc, item) => acc + (item.price * item.qty), 0);
  document.getElementById('cart-total').innerText = total;
}

function removeFromCart(productId) {
  cart = cart.filter(item => item.product !== productId);
  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartUI();
}

async function checkout() {
  if (!currentUser) {
    alert('Please login to checkout.');
    openAuthModal();
    return;
  }
  if (cart.length === 0) {
    alert('Your cart is empty.');
    return;
  }

  // Dummy Checkout Process
  try {
    const total = cart.reduce((acc, item) => acc + (item.price * item.qty), 0);
    const orderData = {
      orderItems: cart,
      shippingAddress: { street: '123 Test St', city: 'Varanasi', postalCode: '221001', country: 'India' },
      paymentMethod: 'COD',
      itemsPrice: total,
      taxPrice: 0,
      shippingPrice: 0,
      totalPrice: total
    };

    await api.placeOrder(orderData, currentUser.token);
    alert('Order placed successfully! May peace be with you.');
    cart = [];
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartUI();
    toggleCart();
  } catch(err) {
    alert('Failed to place order: ' + err.message);
  }
}

// Admin
async function handleAddProduct(e) {
  e.preventDefault();
  if (!currentUser || currentUser.role !== 'admin') return;

  const productData = {
    name: document.getElementById('prod-name').value,
    image: document.getElementById('prod-image').value,
    category: document.getElementById('prod-category').value,
    description: document.getElementById('prod-desc').value,
    price: Number(document.getElementById('prod-price').value),
    countInStock: Number(document.getElementById('prod-stock').value)
  };

  try {
    await api.addProduct(productData, currentUser.token);
    alert('Product added successfully!');
    e.target.reset();
    loadProducts(); // refresh products
  } catch (err) {
    alert(err.message);
  }
}

// Profile
async function loadProfile() {
  if (!currentUser) return;
  try {
    const profile = await api.getUserProfile(currentUser.token);
    document.getElementById('prof-name').value = profile.name;
    document.getElementById('prof-email').value = profile.email;
    if (profile.address) {
      document.getElementById('prof-street').value = profile.address.street || '';
      document.getElementById('prof-city').value = profile.address.city || '';
      document.getElementById('prof-postal').value = profile.address.postalCode || '';
      document.getElementById('prof-country').value = profile.address.country || '';
    }
    
    // Load Orders
    const orders = await api.getMyOrders(currentUser.token);
    const orderContainer = document.getElementById('user-orders');
    if (orders.length === 0) {
      orderContainer.innerHTML = '<p>No orders placed yet.</p>';
    } else {
      orderContainer.innerHTML = orders.map(order => `
        <div style="border-bottom: 1px solid var(--glass-border); padding: 1rem 0;">
          <p><strong>Order ID:</strong> ${order._id}</p>
          <p><strong>Total:</strong> ₹${order.totalPrice} | <strong>Status:</strong> ${order.isDelivered ? 'Delivered' : 'Processing'}</p>
          <p style="font-size: 0.9rem; color: var(--primary-color);">Items: ${order.orderItems.map(i => i.name).join(', ')}</p>
        </div>
      `).join('');
    }
  } catch (err) {
    console.error('Failed to load profile', err);
  }
}

async function handleProfileUpdate(e) {
  e.preventDefault();
  if (!currentUser) return;
  
  const userData = {
    name: document.getElementById('prof-name').value,
    email: document.getElementById('prof-email').value,
    password: document.getElementById('prof-password').value || undefined,
    address: {
      street: document.getElementById('prof-street').value,
      city: document.getElementById('prof-city').value,
      postalCode: document.getElementById('prof-postal').value,
      country: document.getElementById('prof-country').value,
    }
  };

  try {
    const updatedProfile = await api.updateUserProfile(userData, currentUser.token);
    // Update local storage
    currentUser.name = updatedProfile.name;
    currentUser.email = updatedProfile.email;
    localStorage.setItem('user', JSON.stringify(currentUser));
    
    alert('Profile updated successfully!');
    document.getElementById('prof-password').value = '';
    updateAuthUI();
  } catch(err) {
    alert(err.message);
  }
}
