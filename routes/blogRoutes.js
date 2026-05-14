const express = require('express');
const router = express.Router();
const Blog = require('../models/Blog');
const { protect, admin } = require('../middleware/authMiddleware');
const feedbackAgent = require('../agents/feedbackAgent');

// @desc    Get all published blogs
// @route   GET /api/blogs
// @access  Public
router.get('/', async (req, res) => {
  try {
    const category = req.query.category;
    const filter = { published: true };
    if (category && category !== 'All') {
      filter.category = category;
    }
    const blogs = await Blog.find(filter).sort({ createdAt: -1 });
    res.json(blogs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Get featured blogs
// @route   GET /api/blogs/featured
// @access  Public
router.get('/featured', async (req, res) => {
  try {
    const blogs = await Blog.find({ published: true, featured: true }).sort({ createdAt: -1 }).limit(3);
    res.json(blogs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Get single blog by slug
// @route   GET /api/blogs/:slug
// @access  Public
router.get('/:slug', async (req, res) => {
  try {
    const blog = await Blog.findOne({ slug: req.params.slug }).populate('relatedProducts');
    if (blog) {
      res.json(blog);
    } else {
      res.status(404).json({ message: 'Blog not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Create a blog
// @route   POST /api/blogs
// @access  Private/Admin
router.post('/', protect, admin, async (req, res) => {
  try {
    const blog = new Blog({
      title: req.body.title,
      excerpt: req.body.excerpt,
      content: req.body.content,
      coverImage: req.body.coverImage,
      category: req.body.category,
      tags: req.body.tags || [],
      relatedProducts: req.body.relatedProducts || []
    });

    const createdBlog = await blog.save();
    res.status(201).json(createdBlog);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Update a blog
// @route   PUT /api/blogs/:id
// @access  Private/Admin
router.put('/:id', protect, admin, async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (blog) {
      blog.title = req.body.title || blog.title;
      blog.excerpt = req.body.excerpt || blog.excerpt;
      blog.content = req.body.content || blog.content;
      blog.coverImage = req.body.coverImage || blog.coverImage;
      blog.category = req.body.category || blog.category;
      blog.tags = req.body.tags || blog.tags;
      blog.relatedProducts = req.body.relatedProducts || blog.relatedProducts;
      
      const updatedBlog = await blog.save();
      res.json(updatedBlog);
    } else {
      res.status(404).json({ message: 'Blog not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Like a blog
// @route   POST /api/blogs/:id/like
// @access  Private
router.post('/:id/like', protect, async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (blog) {
      // Check if user already liked
      if(blog.likedBy.includes(req.user._id)) {
        return res.status(400).json({ message: 'You already liked this blog' });
      }
      blog.likedBy.push(req.user._id);
      blog.likeCount += 1;
      await blog.save();
      
      // Log interaction
      const sessionId = req.body.sessionId || 'unknown';
      feedbackAgent.logInteraction('blog_like', blog._id, sessionId, {}, req.user._id);
      
      res.json({ message: 'Blog liked', likeCount: blog.likeCount });
    } else {
      res.status(404).json({ message: 'Blog not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
