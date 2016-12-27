'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _userModel = require('../models/user.model.js');

var _userModel2 = _interopRequireDefault(_userModel);

var _nodeRecurly = require('node-recurly');

var _nodeRecurly2 = _interopRequireDefault(_nodeRecurly);

var _auth = require('../../config/auth');

var _auth2 = _interopRequireDefault(_auth);

var _jsonwebtoken = require('jsonwebtoken');

var _jsonwebtoken2 = _interopRequireDefault(_jsonwebtoken);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// ```
// _authentication.router.js
// (c) 2016 David Newman
// david.r.niciforovic@gmail.com
// _authentication.router.js may be freely distributed under the MIT license
// ```

// */app/routes/_authentication.router.js*

// GET    */api/auth/user*        Get user data from session object in
//                                Node

// GET    */api/auth/loggedin*    Route to test if the user is logged in
//                                or not

// POST   */api/auth/login*       Route to login

//                                appropriate view
// POST   */api/auth/logout*      Route to logout and redirect to the

// ## Authentication API object

// Load user model
function generateToken(user) {
  return _jsonwebtoken2.default.sign(user, _auth2.default.secret, {
    expiresIn: 10080
  });
}

function setUserInfo(user) {
  return {
    _id: user._id,
    email: user.email || (user.local ? user.local.email : ""),
    role: user.role
  };
}

var recurly = new _nodeRecurly2.default({
  API_KEY: process.env.RECURLY_API_KEY,
  SUBDOMAIN: process.env.RECURLY_ACCOUNT_NAME,
  ENVIRONMENT: process.env.RECURLY_ACCOUNT_ENV,
  DEBUG: false
});

// Load the Mongoose ObjectId function to cast string as
// ObjectId
var ObjectId = require('mongoose').Types.ObjectId;

exports.default = function (app, router, passport, auth, admin, paid) {

  // ### Authentication API Routes

  // Route to test if the user is logged in or not
  router.get('/auth/loggedIn', auth, function (req, res) {

    // If the user is authenticated, return a user object
    // else return 0
    res.send({ content: 'success' });
  });

  // Route to log a user in
  router.post('/auth/login', function (req, res, next) {

    // Call `authenticate()` from within the route handler, rather than
    // as a route middleware. This gives the callback access to the `req`
    // and `res` object through closure.

    // If authentication fails, `user` will be set to `false`. If an
    // exception occured, `err` will be set. `info` contains a message
    // set within the Local Passport strategy.
    passport.authenticate('local-login', function (err, user, info) {

      if (err) return next(err);

      // If no user is returned...
      if (!user) {
        // Set HTTP status code `401 Unauthorized`
        return res.status(401).send({});

        // Return the info message
        // return next(info.loginMessage);
      }

      // Use login function exposed by Passport to establish a login
      // session
      req.login(user, function (err) {

        if (err) return next(err);

        var recurlyAccountCode = user.recurlyAccountCode || 'recurly_1_11';

        recurly.subscriptions.listByAccount(recurlyAccountCode, {}, function (response) {
          if (response.data.subscriptions && typeof response.data.subscriptions.subscription.length == 'undefined') {
            user.recurlyAccountStatus = response.data.subscriptions.subscription.state;
            user.save().then(function () {
              // Return the user object
              var userInfo = setUserInfo(user);
              res.status(200).json({
                token: 'JWT ' + generateToken(userInfo),
                user: user
              });
            });
          } else {
            var userInfo = setUserInfo(user);
            res.status(200).json({
              token: 'JWT ' + generateToken(userInfo),
              user: user
            });
          }
        });
      });
    })(req, res, next);
  });

  router.post('/auth/signup', function (req, res, next) {

    // Call `authenticate()` from within the route handler, rather than
    // as a route middleware. This gives the callback access to the `req`
    // and `res` object through closure.

    // If authentication fails, `user` will be set to `false`. If an
    // exception occured, `err` will be set. `info` contains a message
    // set within the Local Passport strategy.
    passport.authenticate('local-signup', function (err, user, info) {
      if (err) return next(err);

      // If no user is returned...
      if (!user) {
        // Set HTTP status code `401 Unauthorized`
        res.status(401).json(info);

        // // Return the info message
        // return next(info.signupMessage);
      } else {
        _userModel2.default.update({ _id: user._id }, { $addToSet: { states: req.body.state } }).then(function () {
          var userInfo = setUserInfo(user);
          res.status(201).json({
            token: 'JWT ' + generateToken(userInfo),
            user: user
          });
        });
      }
    })(req, res, next);
  });

  // Route to log a user out
  router.post('/auth/logout', function (req, res) {

    req.logOut();

    // Even though the logout was successful, send the status code
    // `401` to be intercepted and reroute the user to the appropriate
    // page
    res.sendStatus(401);
  });

  // Route to get the current user
  // The `auth` middleware was passed in to this function from `routes.js`
  router.get('/auth/user', auth, function (req, res) {

    // Send response in JSON to allow disassembly of object by functions
    _userModel2.default.findById(req.user._id).populate(['assignments', 'responses']).populate({ path: 'notifications', options: { sort: { 'createdAt': -1 } } }).then(function (user) {
      user.responses.forEach(function (response) {
        if (response.isEncrypted) {
          response.encryptionKey = req.headers.encryptionkey;
        }
      });

      res.json(user);
    });
  });

  // Route to delete a user. Accepts a url parameter in the form of a
  // username, user email, or mongoose object id.
  // The `admin` Express middleware was passed in from `routes.js`
  router.delete('/auth/delete/:uid', auth, admin, function (req, res) {

    _userModel2.default.remove({

      // Model.find `$or` Mongoose condition
      $or: [{ 'local.username': req.params.uid }, { 'local.email': req.params.uid }, { '_id': ObjectId(req.params.uid) }]
    }, function (err) {

      // If there are any errors, return them
      if (err) return next(err);

      // HTTP Status code `204 No Content`
      res.sendStatus(204);
    });
  });
};