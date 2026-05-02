const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
require('dotenv').config();
const Product = require('./models/Product');

// Paths to generated images
const sourceDir = 'C:\\Users\\shree\\.gemini\\antigravity\\brain\\485cc414-5a0f-4cad-bcb6-b9fff63d52b1';
const destDir = path.join(__dirname, 'Public', 'images');

// Ensure destination directory exists
if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

// Map of images to copy
const images = {
  rudraksha: 'rudraksha_5mukhi_1777698076714.png',
  sphatik: 'sphatik_mala_1777698131324.png',
  tulsi: 'tulsi_mala_1777698386352.png',
  parad: 'parad_shivling_1777698533571.png'
};

// Copy images to Public/images
for (const [key, filename] of Object.entries(images)) {
  const srcPath = path.join(sourceDir, filename);
  const destPath = path.join(destDir, filename);
  if (fs.existsSync(srcPath)) {
    fs.copyFileSync(srcPath, destPath);
    console.log(`Copied ${filename}`);
  } else {
    console.log(`Source image not found: ${srcPath}`);
  }
}

// Product Data
const products = [
  {
    name: '5 Mukhi Premium Rudraksha Mala',
    image: `/images/${images.rudraksha}`,
    description: 'Authentic 5 Mukhi Rudraksha Mala sourced directly from the Himalayas. Blessed in Varanasi. Known for bringing peace and lowering blood pressure.',
    category: 'Malas',
    price: 1500,
    countInStock: 50,
    rating: 5,
    numReviews: 12
  },
  {
    name: 'Sphatik (Crystal) Quartz Mala',
    image: `/images/${images.sphatik}`,
    description: 'High-quality transparent Sphatik Mala. Helps in concentration, cools the body, and calms the mind. Excellent for chanting mantras.',
    category: 'Malas',
    price: 2200,
    countInStock: 30,
    rating: 4.8,
    numReviews: 8
  },
  {
    name: 'Sacred Tulsi Wood Mala',
    image: `/images/${images.tulsi}`,
    description: 'Handcrafted from pure Tulsi wood. Essential for devotees of Lord Krishna and Vishnu. Purifies the aura and brings spiritual upliftment.',
    category: 'Malas',
    price: 800,
    countInStock: 100,
    rating: 4.5,
    numReviews: 24
  },
  {
    name: 'Parad (Mercury) Shivling',
    image: `/images/${images.parad}`,
    description: 'A solid Parad Shivling for extreme spiritual benefit. Worshipping Parad Shivling is considered highly auspicious in Vedic astrology and Puranas.',
    category: 'Deities',
    price: 5500,
    countInStock: 10,
    rating: 5,
    numReviews: 3
  }
];

mongoose.connect('mongodb://127.0.0.1:27017/Rudrakrit')
  .then(async () => {
    console.log('MongoDB Connected for Seeding');
    await Product.deleteMany(); // Clear existing
    console.log('Cleared existing products');
    await Product.insertMany(products);
    console.log('Successfully inserted new premium products!');
    process.exit(0);
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
