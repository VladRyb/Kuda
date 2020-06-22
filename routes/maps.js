const express = require('express');

const router = express.Router();
const User = require('../models/users');
const Post = require('../models/post');

const points = [];

/* GET users listing. */
router.get('/', async (req, res) => {
  res.render('maps');
});

router.post('/', async (req, res) => {
  const posts = await Post.find({});

  posts.map((item, index) => {
    const { location } = item;
    const { title } = item;
    const elem = {
      type: 'Feature',
      id: index,
      geometry: {
        type: 'Point',
        coordinates: location[0],
      },
      properties: {
        balloonContent: title,
      },
    };
    points.push(elem);
  });

  res.json({
    location: {
      type: 'FeatureCollection',
      features: points,
    },
  });
});

module.exports = router;
