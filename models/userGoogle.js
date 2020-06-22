const mongoose = require('mongoose');

const googleSchema = new mongoose.Schema({
  username: String,
  email: String,
  phone: String,
  googleId: String,
  posts: Array,
});

module.exports = mongoose.model('UserGoogle', googleSchema);
