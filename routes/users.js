const express = require('express');

const router = express.Router();
const User = require('../models/users');
const UserGoogle = require('../models/userGoogle');

/* GET users listing. */
router.get('/', async (req, res) => {
  let user = await User.findById({ _id: req.session.user._id });
  if (!user) {
    user = await UserGoogle.findById({ _id: req.session.user._id });
  }

  res.render('users', { user });
});

router.get('/update', async (req, res) => {
  let user = await User.findById({ _id: req.session.user._id });
  if (!user) {
    user = await UserGoogle.findById({ _id: req.session.user._id });
  }
  res.render('updateUser', { user });
});

router.post('/update', async (req, res) => {
  await User.updateOne(
    { _id: req.session.user._id },
    { email: req.body.email, phone: `${req.body.phone}` }
  );
  await UserGoogle.updateOne(
    { _id: req.session.user._id },
    { email: req.body.email, phone: `${req.body.phone}` }
  );
  res.redirect('/user');
});

module.exports = router;
