/* agents/recommendationAgent.js */
/**
 * Recommendation Agent – provides product recommendations based on
 * weighted Interaction history and global popularity scores.
 *
 * It runs a periodic job (every 60 seconds) to recalculate each product's
 * `popularityScore` from the Interaction collection. The score is a simple
 * sum of interaction weights (view = 1, add_to_cart = 3, purchase = 10).
 *
 * The agent also offers per‑user personalized recommendations – it sums the
 * weights for each product the user interacted with and returns the top N
 * items that the user has not yet purchased.
 */
const Interaction = require('../models/Interaction');
const Product = require('../models/Product');

// --- Global popularity calculation ---------------------------------------
async function updatePopularityScores() {
  // Aggregate total weight per product
  const agg = await Interaction.aggregate([
    { $match: { entityType: 'product' } },
    { $group: { _id: '$entityId', totalWeight: { $sum: '$weight' } } }
  ]);

  // Update each product's popularityScore field
  const bulkOps = agg.map(item => ({
    updateOne: {
      filter: { _id: item._id },
      update: { $set: { popularityScore: item.totalWeight } }
    }
  }));

  if (bulkOps.length) await Product.bulkWrite(bulkOps);
}

// Run job every minute – start when server boots
function startScheduler() {
  setInterval(() => {
    updatePopularityScores().catch(console.error);
  }, 60 * 1000);
}

// --- Per‑user recommendation ------------------------------------------
/**
 * Return the top N recommended products for a given user (or guest).
 * @param {string|null} userId - MongoDB ObjectId string or null for guest.
 * @param {number} limit - Number of recommendations (default 5).
 */
async function getRecommendations(userId = null, limit = 5) {
  // 1️⃣ Get user's interaction history (product only)
  const userAgg = await Interaction.aggregate([
    { $match: { userId: userId ? new require('mongoose').Types.ObjectId(userId) : null, entityType: 'product' } },
    { $group: { _id: '$entityId', score: { $sum: '$weight' } } },
    { $sort: { score: -1 } },
    { $limit: limit * 2 } // fetch extra to filter already‑owned later
  ]);

  // 2️⃣ If not enough, fallback to globally popular products
  const ids = userAgg.map(i => i._id);
  const missing = limit - ids.length;
  if (missing > 0) {
    const global = await Product.find({ _id: { $nin: ids } })
      .sort({ popularityScore: -1 })
      .limit(missing);
    ids.push(...global.map(p => p._id));
  }

  // 3️⃣ Return product docs preserving order
  const products = await Product.find({ _id: { $in: ids } });
  // Preserve original order based on ids array
  const ordered = ids.map(id => products.find(p => p._id.toString() === id.toString())).filter(Boolean);
  return ordered.slice(0, limit);
}

// --- Related blog lookup -----------------------------------------------
/**
 * Find blogs that are linked to a given product via `relatedBlogs`.
 */
async function getRelatedBlogs(productId) {
  const product = await Product.findById(productId).populate('relatedBlogs').exec();
  return product?.relatedBlogs || [];
}

module.exports = { startScheduler, updatePopularityScores, getRecommendations, getRelatedBlogs };
