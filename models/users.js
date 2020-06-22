const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, unique: true, required: true },
  email: { type: String, unique: true, required: true },
  phone: String,
  googleId: String,
  password: { type: String, required: true },
  posts: Array,
});

module.exports = mongoose.model('User', userSchema);
