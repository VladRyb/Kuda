const mongoose = require('mongoose');
const Post = require('./post');
const rybajs = require('ryba-js');

mongoose.connect('mongodb://localhost:27017/learnAuth', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const arr = [];

for (let i = 0; i < 20; i++) {
  const random = Math.random();
  const num = Math.floor(random * 100) / 100;
  const number = Math.floor(random * 100) / 1000;
  const post = new Post({
    title: rybajs(),
    body: rybajs(10),
    time: '10:00 - 20:00',
  });
  arr.push(post);
}
console.log(arr);
