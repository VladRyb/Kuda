const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  title: String,
  body: String,
  likes: Array,
  users: Array,
  date: String,
  time: String,
  location: Array,
});

module.exports = mongoose.model('Post', postSchema);
