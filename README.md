# 🛕 Rudrakrit - Premium Spiritual E-commerce

Rudrakrit is a full-stack, single-page web application built for an academic major project. It serves as an e-commerce platform for spiritual items like Rudraksha Malas, Sphatik crystals, and Deities, sourced directly from Varanasi.

## ✨ Features

- **Premium UI/UX:** A beautiful, responsive, dark-mode glassmorphic design utilizing modern typography and smooth CSS animations.
- **Single Page Application (SPA):** Seamless navigation between Shop, Profile, and Admin sections without page reloads using Vanilla JavaScript DOM manipulation.
- **User Authentication:** Secure registration and login using JWT (JSON Web Tokens) and bcrypt password hashing.
- **Real-time User Profiles:** Users can update their personal details and shipping address, and view their order history in real-time.
- **Interactive Shopping Cart:** A sleek slide-out cart sidebar that persists across sessions using `localStorage`.
- **Admin Dashboard:** Role-based access control allowing 'admin' users to add new products directly to the catalog.
- **Database Seeding:** Comes with a pre-configured script (`seed-20.js`) to instantly populate the store with 20 diverse products.

## 🛠️ Technology Stack

- **Frontend:** Vanilla HTML5, CSS3 (Glassmorphism), Vanilla JavaScript (ES6+ fetch API)
- **Backend:** Node.js, Express.js
- **Database:** MongoDB, Mongoose ORM
- **Security:** bcryptjs (password hashing), jsonwebtoken (auth tokens)

## 🚀 Installation & Setup

1. **Prerequisites:** 
   - Ensure you have Node.js and MongoDB installed on your system.
   - Start your local MongoDB server (usually running on `mongodb://127.0.0.1:27017`).

2. **Install Dependencies:**
   Navigate to the project root directory and run:
   ```bash
   npm install
   ```

3. **Environment Variables:**
   Ensure you have a `.env` file in the root directory with the following configuration:
   ```env
   MONGO_URI=mongodb://127.0.0.1:27017/Rudrakrit
   JWT_SECRET=your_super_secret_jwt_key
   ```

4. **Seed the Database:**
   To populate the shop with the 20 initial products, run:
   ```bash
   node seed-20.js
   ```

5. **Start the Server:**
   ```bash
   node server.js
   ```

6. **View the Application:**
   Open your browser and navigate to `http://localhost:5000`.

## 👑 Admin Access
To test the Admin Dashboard:
1. Register a new user normally via the frontend.
2. Open your MongoDB GUI (like MongoDB Compass) and find the `users` collection in the `Rudrakrit` database.
3. Edit your user document and change the `"role"` field from `"user"` to `"admin"`.
4. Refresh the application and login. The "Admin" tab will now be visible in the navigation bar.

---
*Created for a final year major project exam.*
