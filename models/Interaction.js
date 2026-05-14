const mongoose = require('mongoose');

const interactionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  sessionId: { type: String, required: true },
  type: {
    type: String,
    required: true,
    enum: ['product_view', 'add_to_cart', 'purchase', 'blog_view', 'blog_like', 'search', 'chat']
  },
  entityId: { 
    type: mongoose.Schema.Types.ObjectId, 
    required: function() { return this.type !== 'chat' && this.type !== 'search'; } 
  },
  entityType: { type: String, enum: ['product', 'blog'], default: 'product' },
  weight: { type: Number, default: 1 },
  metadata: { type: mongoose.Schema.Types.Mixed, default: {} } // extra context: search query, chat message, etc.
}, { timestamps: true });

// Index for fast aggregation queries
interactionSchema.index({ entityId: 1, type: 1 });
interactionSchema.index({ userId: 1, entityId: 1 });
interactionSchema.index({ sessionId: 1 });
interactionSchema.index({ createdAt: -1 });

// Static: weight map for interaction types
interactionSchema.statics.WEIGHT_MAP = {
  product_view: 1,
  add_to_cart: 3,
  purchase: 10,
  blog_view: 2,
  blog_like: 5,
  search: 1,
  chat: 1
};

module.exports = mongoose.model('Interaction', interactionSchema);
