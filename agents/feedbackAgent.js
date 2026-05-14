const Interaction = require('../models/Interaction');
const Blog = require('../models/Blog');
const Product = require('../models/Product');
const recommendationAgent = require('./recommendationAgent');

/**
 * Log an interaction (view, cart, purchase, like) for reinforcement feedback.
 * @param {string} type - e.g., 'product_view', 'add_to_cart', 'blog_view'
 * @param {string} entityId - Product ID or Blog ID
 * @param {string} sessionId - User session ID
 * @param {Object} [metadata={}] - Optional extra context
 * @param {string} [userId=null] - User ID if logged in
 */
async function logInteraction(type, entityId, sessionId, metadata = {}, userId = null) {
  try {
    const weight = Interaction.WEIGHT_MAP[type] || 1;
    let entityType = 'product';
    if (type.startsWith('blog_')) {
      entityType = 'blog';
    }

    const interaction = new Interaction({
      type,
      entityId,
      entityType,
      sessionId,
      userId,
      weight,
      metadata
    });

    await interaction.save();

    // Trigger specific side-effects based on interaction type
    if (type === 'blog_view') {
      await Blog.findByIdAndUpdate(entityId, { $inc: { viewCount: 1 } });
    } else if (type === 'blog_like') {
      await Blog.findByIdAndUpdate(entityId, { $inc: { likeCount: 1 } });
    }

    // After logging, check if we need to promote blogs
    if (entityType === 'blog') {
      promoteFeaturedBlogs();
    }

  } catch (err) {
    console.error('Error logging interaction:', err);
  }
}

/**
 * Periodically or event-driven: Auto-tag blogs based on linked product categories
 * This reinforces the connection between content and inventory.
 */
async function autoTagBlogs() {
  try {
    const blogs = await Blog.find({}).populate('relatedProducts');
    for (const blog of blogs) {
      if (blog.relatedProducts && blog.relatedProducts.length > 0) {
        const productCategories = blog.relatedProducts.map(p => p.category);
        const uniqueCategories = [...new Set(productCategories)];
        
        // Add categories to tags if they aren't already there
        let updated = false;
        for (const cat of uniqueCategories) {
          if (!blog.tags.includes(cat)) {
            blog.tags.push(cat);
            updated = true;
          }
        }
        
        if (updated) {
          await blog.save();
        }
      }
    }
  } catch (err) {
    console.error('Error auto-tagging blogs:', err);
  }
}

/**
 * Promote blogs with high view/like counts to "featured" status automatically.
 */
async function promoteFeaturedBlogs() {
  try {
    // Find top 3 blogs by view count and like count combination
    const topBlogs = await Blog.aggregate([
      {
        $addFields: {
          engagementScore: { $add: ["$viewCount", { $multiply: ["$likeCount", 2] }] }
        }
      },
      { $sort: { engagementScore: -1 } },
      { $limit: 3 }
    ]);

    const topIds = topBlogs.map(b => b._id);

    // Set these to featured, set others to not featured
    await Blog.updateMany({ _id: { $in: topIds } }, { $set: { featured: true } });
    await Blog.updateMany({ _id: { $nin: topIds } }, { $set: { featured: false } });

  } catch (err) {
    console.error('Error promoting featured blogs:', err);
  }
}

/**
 * Called when a product is created or updated to sync relationships.
 */
async function onProductUpdate(productId) {
    // We could automatically find blogs matching product name/category and link them
    try {
        const product = await Product.findById(productId);
        if(!product) return;
        
        // Find blogs whose content mentions this product
        const regex = new RegExp(product.name, 'i');
        const relevantBlogs = await Blog.find({ content: regex });
        
        if(relevantBlogs.length > 0) {
            const blogIds = relevantBlogs.map(b => b._id);
            // Add blogs to product.relatedBlogs if not present
            let updated = false;
            for(let id of blogIds) {
                if(!product.relatedBlogs.includes(id)) {
                    product.relatedBlogs.push(id);
                    updated = true;
                }
            }
            if(updated) await product.save();
            
            // Add product to blog.relatedProducts
            for(let blog of relevantBlogs) {
                if(!blog.relatedProducts.includes(productId)) {
                    blog.relatedProducts.push(productId);
                    await blog.save();
                }
            }
        }
    } catch(err) {
        console.error("Error in onProductUpdate:", err);
    }
}


module.exports = {
  logInteraction,
  autoTagBlogs,
  promoteFeaturedBlogs,
  onProductUpdate
};
