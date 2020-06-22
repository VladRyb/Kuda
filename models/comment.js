const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  body: String,
  likes: Array,
  autor: String,
  date: String,
  idPost: String,
});

module.exports = mongoose.model('Comment', commentSchema);
