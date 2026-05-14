const mongoose = require('mongoose');
require('dotenv').config({ path: 'd:/Rudrakrit/.env' });

const uri = process.env.MONGO_URI;
console.log('Testing URI:', uri);

mongoose.connect(uri)
  .then(() => {
    console.log('Connected successfully!');
    process.exit(0);
  })
  .catch(err => {
    console.error('Connection failed:', err.message);
    process.exit(1);
  });
