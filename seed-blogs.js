const mongoose = require('mongoose');
require('dotenv').config();
const Blog = require('./models/Blog');
const Product = require('./models/Product');

async function seedBlogs() {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/Rudrakrit');
    console.log('MongoDB Connected for Blog Seeding');

    await Blog.deleteMany();
    
    // Fetch products to link
    const rudrakshaMala = await Product.findOne({ name: /5 Mukhi/i });
    const sphatikMala = await Product.findOne({ name: /Sphatik/i });
    const shivling = await Product.findOne({ name: /Shivling/i });

    const blogs = [
      {
        title: "How to Wear a 5-Mukhi Rudraksha Mala",
        excerpt: "Learn the proper rituals and mantras to energize your mala before wearing it for the first time.",
        content: `
          <h3>The Sacred 5-Mukhi Rudraksha</h3>
          <p>The 5-Mukhi Rudraksha represents Lord Shiva in the form of Kalagni. It is the most widely worn bead, bringing peace of mind and general health and wellbeing.</p>
          
          <h3>Step-by-Step Wearing Ritual</h3>
          <p><strong>1. Cleansing:</strong> Wash the mala gently with Gangajal (holy water) or unboiled milk.</p>
          <p><strong>2. Energizing:</strong> Apply sandalwood paste (chandan) to the beads and offer light incense.</p>
          <p><strong>3. Mantra Chanting:</strong> Face East or North and chant the mantra <em>"Om Hreem Namah"</em> 108 times using the mala.</p>
          <p><strong>4. Intent:</strong> Set your clear, positive intention before placing the mala around your neck.</p>
          
          <p><em>Remember to remove your mala before sleeping, showering, or consuming non-vegetarian food or alcohol.</em></p>
        `,
        coverImage: "/images/rudraksha_5mukhi_1777698076714.png",
        author: "Swami Rudranand",
        category: "How to Wear",
        tags: ["Malas", "Rudraksha", "Ritual"],
        relatedProducts: rudrakshaMala ? [rudrakshaMala._id] : [],
        featured: true,
        viewCount: 154,
        likeCount: 42
      },
      {
        title: "Crystal Healing with Sphatik Mala",
        excerpt: "Discover how the cooling energy of clear quartz (Sphatik) can balance your chakras and calm your mind.",
        content: `
          <h3>The Power of Clear Quartz</h3>
          <p>Sphatik, also known as clear quartz, is a master healer stone. It amplifies energy and thought, and balances the physical, mental, emotional and spiritual planes.</p>
          
          <h3>Benefits of Wearing Sphatik</h3>
          <ul>
            <li>Cools the body temperature, making it ideal for those with pitta dosha.</li>
            <li>Enhances focus and concentration, making it an excellent tool for students and meditators.</li>
            <li>Shields against negative energies and purifies the aura.</li>
          </ul>
          
          <p>To maximize its benefits, wash your Sphatik mala under cold running water once a week and let it charge under the light of the full moon.</p>
        `,
        coverImage: "/images/sphatik_mala_1777698131324.png",
        author: "Aanya Sharma",
        category: "Product Effects",
        tags: ["Gemstones", "Crystal Healing", "Sphatik"],
        relatedProducts: sphatikMala ? [sphatikMala._id] : [],
        featured: false,
        viewCount: 89,
        likeCount: 15
      },
      {
        title: "Daily Rituals with Parad Shivling",
        excerpt: "A guide on how to perform daily Abhishek on your Parad Shivling to attract wealth and spiritual growth.",
        content: `
          <h3>The Significance of Parad</h3>
          <p>Parad (Mercury) is considered the semen of Lord Shiva in ancient texts. A Shivling made of solidified Parad is highly auspicious and is said to grant the fruits of worshiping millions of stone Shivlings.</p>
          
          <h3>Daily Abhishek Routine</h3>
          <p>For daily worship, keep it simple but devoted:</p>
          <p>1. Offer a mixture of water and milk to the Shivling while chanting <em>"Om Namah Shivaya"</em>.</p>
          <p>2. Offer Bael leaves (Bilva Patra) if available.</p>
          <p>3. Light a ghee lamp and incense.</p>
          <p>4. Meditate quietly in front of the Shivling for 10-15 minutes.</p>
        `,
        coverImage: "/images/parad_shivling_1777698533571.png",
        author: "Pandit Dinesh",
        category: "Rituals",
        tags: ["Deities", "Shiva", "Puja"],
        relatedProducts: shivling ? [shivling._id] : [],
        featured: true,
        viewCount: 210,
        likeCount: 65
      }
    ];

    await Blog.insertMany(blogs);
    console.log('Successfully seeded blogs!');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

seedBlogs();
