const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  excerpt: { type: String, required: true },
  content: { type: String, required: true },
  coverImage: { type: String, required: true },
  author: { type: String, default: 'Rudrakrit Team' },
  category: {
    type: String,
    required: true,
    enum: ['How to Wear', 'Product Effects', 'Rituals', 'Spiritual Guide', 'Science & Research']
  },
  tags: [{ type: String }],
  relatedProducts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
  viewCount: { type: Number, default: 0 },
  likeCount: { type: Number, default: 0 },
  likedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  featured: { type: Boolean, default: false },
  readTime: { type: Number, default: 5 }, // minutes
  published: { type: Boolean, default: true }
}, { timestamps: true });

// Auto-generate slug from title before save
blogSchema.pre('validate', function() {
  if (this.title && !this.slug) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
  }
  // Estimate read time from content length (~200 words per minute)
  if (this.content) {
    const wordCount = this.content.replace(/<[^>]*>/g, '').split(/\s+/).length;
    this.readTime = Math.max(1, Math.ceil(wordCount / 200));
  }
});

module.exports = mongoose.model('Blog', blogSchema);
