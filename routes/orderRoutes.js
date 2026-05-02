const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const { protect, admin } = require('../middleware/authMiddleware');

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const {
      orderItems,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
    } = req.body;

    if (orderItems && orderItems.length === 0) {
      res.status(400).json({ message: 'No order items' });
      return;
    } else {
      const order = new Order({
        orderItems,
        user: req.user._id,
        shippingAddress,
        paymentMethod,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
      });

      const createdOrder = await order.save();
      res.status(201).json(createdOrder);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
router.get('/myorders', protect, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
