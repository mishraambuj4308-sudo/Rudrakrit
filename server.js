const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static('public')); // lowercase 'public' since it maps to the Public folder

mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log(err));

app.use('/api/products', require('./routes/ProductRoutes'));
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));
app.use('/api/users', require('./routes/userRoutes'));

app.listen(5000, () => {
  console.log("Server running on port 5000");
});
