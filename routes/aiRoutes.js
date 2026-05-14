const express = require('express');
const router = express.Router();
const chatAgent = require('../agents/chatAgent');
const recommendationAgent = require('../agents/recommendationAgent');
const feedbackAgent = require('../agents/feedbackAgent');
const Product = require('../models/Product');

// @desc    Chat with AI
// @route   POST /api/ai/chat
// @access  Public
router.post('/chat', async (req, res) => {
  try {
    const { message, sessionId } = req.body;
    if (!message || !sessionId) {
      return res.status(400).json({ message: 'Message and sessionId are required' });
    }
    const response = await chatAgent.processMessage(message, sessionId);
    res.json({ response });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Get product recommendations
// @route   GET /api/ai/recommendations/:productId?
// @access  Public
router.get('/recommendations', async (req, res) => {
  try {
    // In a real app we might get userId from a token if passed, but this can be public
    const userId = req.query.userId || null;
    const limit = Number(req.query.limit) || 5;
    const products = await recommendationAgent.getRecommendations(userId, limit);
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Get trending products
// @route   GET /api/ai/trending
// @access  Public
router.get('/trending', async (req, res) => {
  try {
    const limit = Number(req.query.limit) || 4;
    const trending = await Product.find({}).sort({ popularityScore: -1 }).limit(limit);
    res.json(trending);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Log interaction
// @route   POST /api/ai/interact
// @access  Public
router.post('/interact', async (req, res) => {
  try {
    const { type, entityId, sessionId, metadata, userId } = req.body;
    if (!type || !entityId || !sessionId) {
      return res.status(400).json({ message: 'type, entityId, and sessionId are required' });
    }
    
    await feedbackAgent.logInteraction(type, entityId, sessionId, metadata, userId);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
