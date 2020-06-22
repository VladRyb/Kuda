const express = require('express');
const bcrypt = require('bcrypt');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const { sessionChecker } = require('../middleware/auth');
const User = require('../models/users');
const Post = require('../models/post');
const UserGoogle = require('../models/userGoogle');
require('dotenv').config();

const saltRounds = 10;
const router = express.Router();

//
//
//
// Google
//
//

router.use(passport.initialize());
router.use(passport.session());

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

passport.use(
  new GoogleStrategy(
    {
      clientID: `${process.env.clientID}`,
      clientSecret: `${process.env.clientSecret}`,
      callbackURL: '/auth/google/callback',
    },
    async (accessToken, refreshToken, profile, done) => {
      const user = await UserGoogle.find({ googleId: profile.id });
      if (user.length >= 1) {
        done(null, user);
      } else {
        const newUser = new UserGoogle({
          username: profile.displayName,
          googleId: profile.id,
        });
        await newUser.save();
        await done(null, newUser);
      }
    }
  )
);
router.get(
  '/auth/google',
  passport.authenticate('google', {
    scope: ['profile'],
  })
);

router.get(
  '/auth/google/callback',
  passport.authenticate('google'),
  (req, res) => {
    req.session.user = req.session.passport.user[0];
    res.redirect('/');
  }
);
//
//
//
//
//

router.get('/', async (req, res) => {
  const post = await Post.find({});
  if (req.session.user) {
    res.render('index', {
      title: 'What to see',
      post,
      user: req.session.user,
    });
  } else {
    res.render('index', {
      title: 'What to see',
      post,
    });
  }
});

router
  .route('/signup')
  .get(sessionChecker, (req, res) => {
    res.render('signup');
  })
  .post(async (req, res, next) => {
    try {
      const { username, email, phone, password } = req.body;
      const user = new User({
        username,
        email,
        phone,
        password: await bcrypt.hash(password, saltRounds),
      });
      await user.save();
      req.session.user = user;
      res.redirect('/');
    } catch (error) {
      const errorMess = Object.values(error.keyValue);
      const errorKey = Object.keys(error.keyValue);
      if (errorKey[0] === 'username') {
        res.render('signup', {
          error,
          valid: {
            user: 'is-invalid',
          },
          status: `${errorMess}, Уже занято`,
        });
      }
      if (errorKey[0] === 'email') {
        res.render('signup', {
          error,
          valid: {
            email: 'is-invalid',
          },
          status: `${errorMess}, Уже занято`,
        });
      }
      res.render('signup', {
        error,
      });
    }
  });

router
  .route('/login')
  .get(sessionChecker, (req, res) => {
    res.render('login');
  })
  .post(async (req, res) => {
    const { username, password } = req.body;

    const user = await User.findOne({ username });

    if (user && (await bcrypt.compare(password, user.password))) {
      req.session.user = user;
      res.redirect('/');
    } else {
      res.redirect('/login');
    }
  });

router.get('/logout', async (req, res, next) => {
  if (req.session.user) {
    try {
      await req.session.destroy();
      res.clearCookie('user_sid');
      res.redirect('/');
    } catch (error) {
      next(error);
    }
  } else {
    res.redirect('/login');
  }
});

module.exports = router;
