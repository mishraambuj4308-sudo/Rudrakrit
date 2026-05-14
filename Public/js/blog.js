async function loadBlogSection(category = 'All') {
  const blogList = document.getElementById('blog-list');
  blogList.innerHTML = '<div class="loader"></div>';
  
  try {
    const blogs = await api.getBlogs(category);
    if (blogs.length === 0) {
      blogList.innerHTML = '<p>No spiritual guidance articles found for this category yet.</p>';
      return;
    }
    
    blogList.innerHTML = blogs.map(b => `
      <div class="blog-card glass" onclick="openBlogPost('${b.slug}')">
        <div class="blog-img-wrapper">
          <img src="${b.coverImage || '/images/sphatik_mala_1777698131324.png'}" alt="${b.title}" class="blog-img">
          <span class="blog-category-badge">${b.category}</span>
        </div>
        <div class="blog-info">
          <h3 class="blog-title">${b.title}</h3>
          <p class="blog-excerpt">${b.excerpt}</p>
          <div class="blog-meta">
            <span><i class="fa-solid fa-clock"></i> ${b.readTime} min read</span>
            <span><i class="fa-solid fa-eye"></i> ${b.viewCount} views</span>
            <span><i class="fa-solid fa-heart" style="color: #ef4444;"></i> <span id="like-count-${b._id}">${b.likeCount}</span></span>
          </div>
        </div>
      </div>
    `).join('');
  } catch (err) {
    blogList.innerHTML = '<p>Error loading blogs.</p>';
  }
  
  // Also load products for the main wisdom page
  try {
      const wisdomProductList = document.getElementById('wisdom-product-list');
      if (wisdomProductList) {
          wisdomProductList.innerHTML = '<div class="loader"></div>';
          const trendingProducts = await api.getTrending();
          if (trendingProducts.length > 0) {
              wisdomProductList.innerHTML = trendingProducts.map(p => `
                <div class="product-card glass" style="transform: scale(0.95);">
                  <img src="${p.image}" alt="${p.name}" class="product-img">
                  <div class="product-info">
                    <h3 class="product-title" style="font-size: 1.1rem;">${p.name}</h3>
                    <p class="product-price">₹${p.price}</p>
                    <button class="btn-primary w-100" onclick="addToCart('${p._id}'); api.logInteraction('add_to_cart', '${p._id}', sessionId, currentUser ? currentUser._id : null)">Buy</button>
                  </div>
                </div>
              `).join('');
          } else {
              wisdomProductList.innerHTML = '<p>Check out our shop for spiritual items.</p>';
          }
      }
  } catch (e) {
      console.error('Error loading wisdom products', e);
  }
}

async function openBlogPost(slug) {
  try {
    const blog = await api.getBlogBySlug(slug);
    
    // Log view
    api.logInteraction('blog_view', blog._id, sessionId, currentUser ? currentUser._id : null);
    
    const modal = document.getElementById('blog-modal');
    document.getElementById('blog-modal-title').innerText = blog.title;
    document.getElementById('blog-modal-img').src = blog.coverImage || '/images/sphatik_mala_1777698131324.png';
    document.getElementById('blog-modal-content').innerHTML = blog.content;
    document.getElementById('blog-modal-author').innerText = `By ${blog.author} | ${new Date(blog.createdAt).toLocaleDateString()}`;
    
    // Setup like button
    const likeBtn = document.getElementById('blog-like-btn');
    likeBtn.onclick = () => handleLikeBlog(blog._id);
    document.getElementById('blog-modal-like-count').innerText = blog.likeCount;
    
    // Always show Products in Wisdom Area
    const relatedContainer = document.getElementById('blog-related-products');
    relatedContainer.style.display = 'block';
    const rpGrid = document.getElementById('blog-related-grid');
    
    // Use blog's related products, or fallback to fetching trending products so it's NEVER empty
    let productsToShow = [];
    if (blog.relatedProducts && blog.relatedProducts.length > 0) {
        productsToShow = blog.relatedProducts;
    } else {
        productsToShow = await api.getTrending();
    }
    
    rpGrid.innerHTML = productsToShow.map(p => `
      <div class="product-card glass" style="transform: scale(0.9); margin: 0; min-width: 200px;">
        <img src="${p.image}" alt="${p.name}" class="product-img">
        <div class="product-info">
          <h4 style="font-size: 1rem;">${p.name}</h4>
          <p>₹${p.price}</p>
          <button class="btn-outline btn-small" onclick="addToCart('${p._id}'); api.logInteraction('add_to_cart', '${p._id}', sessionId, currentUser ? currentUser._id : null)">Buy</button>
        </div>
      </div>
    `).join('');
    
    modal.classList.add('active');
  } catch (err) {
    alert('Failed to load blog post');
  }
}

function closeBlogModal() {
  document.getElementById('blog-modal').classList.remove('active');
}

async function handleLikeBlog(id) {
  if (!currentUser) {
    alert("Please login to like this post.");
    openAuthModal();
    return;
  }
  try {
    const res = await api.likeBlog(id, currentUser.token, sessionId);
    document.getElementById('blog-modal-like-count').innerText = res.likeCount;
    const cardLike = document.getElementById(`like-count-${id}`);
    if(cardLike) cardLike.innerText = res.likeCount;
    
    const icon = document.querySelector('#blog-like-btn i');
    icon.classList.add('fa-beat');
    setTimeout(() => icon.classList.remove('fa-beat'), 1000);
  } catch (err) {
    alert(err.message);
  }
}

// Blog Category Filtering
function filterBlogs(category) {
  document.querySelectorAll('.blog-filter-btn').forEach(btn => btn.classList.remove('active'));
  event.target.classList.add('active');
  loadBlogSection(category);
}
