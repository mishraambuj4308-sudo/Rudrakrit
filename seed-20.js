const mongoose = require('mongoose');
require('dotenv').config();
const Product = require('./models/Product');

// Base generated images we already have in Public/images
const imgRudraksha = '/images/rudraksha_5mukhi_1777698076714.png';
const imgSphatik = '/images/sphatik_mala_1777698131324.png';
const imgTulsi = '/images/tulsi_mala_1777698386352.png';
const imgParad = '/images/parad_shivling_1777698533571.png';

// External placeholders replaced with reliable local images to fix broken images
const imgIncense = imgTulsi;
const imgStatue = imgParad;
const imgBowl = imgSphatik;
const imgStones = imgSphatik;

const products = [
  // Malas (using generated images)
  { name: '1 Mukhi Premium Rudraksha', image: imgRudraksha, category: 'Malas', price: 5000, description: 'Extremely rare 1 Mukhi Rudraksha for ultimate meditation.', countInStock: 2 },
  { name: '5 Mukhi Rudraksha Mala', image: imgRudraksha, category: 'Malas', price: 1500, description: 'Standard 5 Mukhi mala for daily wear.', countInStock: 50 },
  { name: '7 Mukhi Rudraksha Mala', image: imgRudraksha, category: 'Malas', price: 2500, description: 'Brings wealth and prosperity.', countInStock: 15 },
  { name: '14 Mukhi Rudraksha', image: imgRudraksha, category: 'Malas', price: 12000, description: 'The highest form of Lord Shiva blessing.', countInStock: 1 },
  
  // Crystal & Wood (using generated images)
  { name: 'Sphatik (Crystal) Mala', image: imgSphatik, category: 'Malas', price: 2200, description: 'Helps in concentration and cools the body.', countInStock: 30 },
  { name: 'Rose Quartz Mala', image: imgSphatik, category: 'Malas', price: 2800, description: 'Stone of universal love.', countInStock: 20 },
  { name: 'Original Tulsi Mala', image: imgTulsi, category: 'Malas', price: 800, description: 'Essential for devotees of Lord Krishna.', countInStock: 100 },
  { name: 'Sandalwood (Chandan) Mala', image: imgTulsi, category: 'Malas', price: 1200, description: 'Calms the mind and enhances meditation.', countInStock: 40 },

  // Deities & Idols (using generated & external images)
  { name: 'Parad (Mercury) Shivling', image: imgParad, category: 'Deities', price: 5500, description: 'Solid Parad Shivling for extreme spiritual benefit.', countInStock: 10 },
  { name: 'Brass Ganesha Idol', image: imgStatue, category: 'Deities', price: 3400, description: 'Remover of obstacles, beautifully crafted in brass.', countInStock: 5 },
  { name: 'Shiva Nataraja Statue', image: imgStatue, category: 'Deities', price: 4200, description: 'The cosmic dancer.', countInStock: 3 },
  { name: 'Buddha Meditation Head', image: imgStatue, category: 'Deities', price: 2100, description: 'Brings peace to your living space.', countInStock: 8 },

  // Ritual Items
  { name: 'Tibetan Singing Bowl', image: imgBowl, category: 'Rituals', price: 3000, description: 'Produces sound that invokes deep state of relaxation.', countInStock: 12 },
  { name: 'Hand-hammered Copper Bowl', image: imgBowl, category: 'Rituals', price: 1500, description: 'For offering water or flowers during puja.', countInStock: 25 },
  { name: 'Premium Sandalwood Incense', image: imgIncense, category: 'Rituals', price: 300, description: 'Hand-rolled natural agarbatti.', countInStock: 200 },
  { name: 'Loban Dhoop Cups', image: imgIncense, category: 'Rituals', price: 450, description: 'Cleanses the aura and removes negative energy.', countInStock: 150 },
  
  // Healing Stones
  { name: 'Amethyst Healing Cluster', image: imgStones, category: 'Gemstones', price: 1800, description: 'Relieves stress and strain.', countInStock: 10 },
  { name: 'Citrine Wealth Crystal', image: imgStones, category: 'Gemstones', price: 2400, description: 'Attracts wealth, prosperity and success.', countInStock: 14 },
  { name: 'Tiger Eye Bracelet', image: imgStones, category: 'Gemstones', price: 600, description: 'A stone of protection.', countInStock: 60 },
  { name: '7 Chakra Healing Bracelet', image: imgStones, category: 'Gemstones', price: 900, description: 'Balances all 7 chakras in the body.', countInStock: 45 }
];

mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/Rudrakrit')
  .then(async () => {
    console.log('MongoDB Connected for 20-Product Seeding');
    await Product.deleteMany(); 
    await Product.insertMany(products);
    console.log('Successfully inserted 20 diverse products!');
    process.exit(0);
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
