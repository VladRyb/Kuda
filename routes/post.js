const express = require('express');
const User = require('../models/users');
const Post = require('../models/post');
const Comment = require('../models/comment');
const UserGoogle = require('../models/userGoogle');
const { SMS, whatsapp } = require('../SMS');

const router = express.Router();

let id;

router.get('/:id', async (req, res) => {
  id = req.params.id;
  const post = await Post.findById({ _id: req.params.id });
  const indexUser = post.users.findIndex((item) => {
    return item === `${req.session.user._id}`;
  });
  let checkUser = false;
  if (indexUser >= 0) {
    checkUser = true;
  }

  const comments = await (
    await Comment.find({ idPost: req.params.id })
  ).reverse();
  if (req.session.user) {
    res.render('post-detals', {
      post,
      user: req.session.user,
      comment: comments,
      checkUser,
    });
  } else {
    res.redirect('/login');
  }
});

router.post('/', async (req, res) => {
  const posts = await Post.findById({ _id: id });

  res.json({
    location: {
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          id: 0,
          geometry: {
            type: 'Point',
            coordinates: posts.location[0],
          },
          properties: {
            balloonContent: posts.title,
          },
        },
      ],
    },
  });
});

router.post('/pod', async (req, res) => {
  const post = await Post.findById({ _id: id });
  let user = await User.findById({ _id: req.session.user._id });
  if (!user) {
    user = await UserGoogle.findById({ _id: req.session.user._id });
  }
  const userPosts = user.posts;
  const { users } = post;
  const check = users.find((item) => item === req.session.user._id);
  if (!check) {
    userPosts.push(post);
    users.push(req.session.user._id);
    await Post.updateOne({ _id: id }, { users });
    await User.updateOne({ _id: req.session.user._id }, { posts: userPosts });
    await UserGoogle.updateOne(
      { _id: req.session.user._id },
      { posts: userPosts }
    );
    res.json({ check: 'Подписка оформлена' });
    const bodyText = `Вы решили посетить: ${post.title}.
    Которое пройдет: ${post.date}
    В: ${post.time}`;
    // SMS(bodyText, user.phone);
    whatsapp(bodyText, user.phone);
  } else {
    res.json({ check: 'Вы уже подписаны' });
  }
});

router.post('/poddel', async (req, res) => {
  const post = await Post.findById({ _id: id });
  let user = await User.findById({ _id: req.session.user._id });
  if (!user) {
    user = await UserGoogle.findById({ _id: req.session.user._id });
  }
  const userPosts = user.posts;
  const { users } = post;
  const deletePost = userPosts
    .map((item) => {
      return item._id;
    })
    .indexOf(id);
  const check = users.findIndex((item) => item === req.session.user._id);
  if (check === -1 && deletePost === -1) {
    res.json({ check: 'Вы не подписаны' });
  } else {
    userPosts.splice(deletePost, 1);
    users.splice(check, 1);
    res.json({ check: 'Вы отписаны' });
    await User.updateOne({ _id: user._id }, { posts: userPosts });
    await UserGoogle.updateOne({ _id: user._id }, { posts: userPosts });
    await Post.updateOne({ _id: id }, { users });
  }
});

router.post('/like', async (req, res) => {
  const post = await Post.findById({ _id: id });
  const { likes } = post;
  const check = likes.findIndex((item) => item === req.session.user._id);
  if (check === -1) {
    likes.push(req.session.user._id);
    await Post.updateOne({ _id: id }, { likes });
    res.json({ like: likes.length });
  } else {
    likes.splice(check, 1);
    await Post.updateOne({ _id: id }, { likes });
    res.json({ like: likes.length });
  }
});

router.post('/comment', async (req, res) => {
  if (req.body.textComment !== '') {
    const comment = new Comment({
      body: req.body.textComment,
      autor: req.session.user.username,
      date: new Date(),
      idPost: id,
    });
    comment.save();
    res.json({ comment });
  }
});

router.post('/comment/delete', async (req, res) => {
  await Comment.deleteOne({ _id: req.body.id });
  res.json({ id: req.body.id });
});

module.exports = router;
