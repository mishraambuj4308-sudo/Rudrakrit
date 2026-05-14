const mongoose = require('mongoose');

const uri = 'mongodb+srv://mishraambuj4308_db_user:OV1XngwNQDPCjdQP@cluster0.ojp9t0a.mongodb.net/Rudrakrit';

mongoose.connect(uri)
  .then(() => {
    console.log('Connected successfully!');
    process.exit(0);
  })
  .catch(err => {
    console.error('Connection failed:', err.message);
    process.exit(1);
  });
