const express = require('express');
const router = express.Router();

const bcrypt = require('bcryptjs');

const jwt = require('jsonwebtoken');

const User = require('../models/User');

// create a new user
router.post('/register', (req, res, next) => {
  const { username, password } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => {
      const user = new User({
        username,
        password: hash,
      })
    
      const promise = user.save();
    
      promise
        .then((data) => {
          res.json(data);
        })
        .catch((err) => {
          res.json(err);
        });
    })
});

// login and generate a token
router.post('/login', (req, res, next) => {
  const { username, password } = req.body;

  User.findOne({
    username
  }, (err, user) => {
    if (err) {
      throw err;
    }
    if (!user) {
      res.json({
        status: false,
        message: 'Authentication failed, user not found.', 
      });
    } else {
      bcrypt.compare(password, user.password)
        .then((result) => {
          if (!result) {
            res.json({
              status: false,
              message: 'Authentication failed, wrong password.',
            });
          } else {
            const payload = {
              username,
            };

            const token = jwt.sign(payload, req.app.get('jwt_secret_key'), {
              expiresIn: 720 // 12 hours
            });

            res.json({
              status: true,
              token,
            })
          }
        });
    }
  });
});

module.exports = router;
