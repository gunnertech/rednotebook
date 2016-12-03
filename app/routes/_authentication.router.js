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

// POST   */api/auth/logout*      Route to logout and redirect to the
//                                appropriate view

// ## Authentication API object

// Load user model
import User from '../models/user.model.js';
import Recurly from 'node-recurly';
import authConfig from '../../config/auth';
import jwt from 'jsonwebtoken'; 

function generateToken(user){
  return jwt.sign(user, authConfig.secret, {
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

let recurly = new Recurly({
  API_KEY:      process.env.RECURLY_API_KEY,
  SUBDOMAIN:    process.env.RECURLY_ACCOUNT_NAME,
  ENVIRONMENT:  process.env.RECURLY_ACCOUNT_ENV,
  DEBUG: false
}); 

// Load the Mongoose ObjectId function to cast string as
// ObjectId
let ObjectId = require('mongoose').Types.ObjectId;

export default (app, router, passport, auth, admin, paid) => {

  // ### Authentication API Routes

  // Route to test if the user is logged in or not
  router.get('/auth/loggedIn', auth, (req, res) => {

    // If the user is authenticated, return a user object
    // else return 0
    res.send({ content: 'success' });
  });

  // Route to log a user in
  router.post('/auth/login', (req, res, next) => {

    // Call `authenticate()` from within the route handler, rather than
    // as a route middleware. This gives the callback access to the `req`
    // and `res` object through closure.

    // If authentication fails, `user` will be set to `false`. If an
    // exception occured, `err` will be set. `info` contains a message
    // set within the Local Passport strategy.
    passport.authenticate('local-login', (err, user, info) => {

      if (err)
        return next(err);

      // If no user is returned...
      if (!user) {

        // Set HTTP status code `401 Unauthorized`
        res.status(401).send({});

        // Return the info message
        // return next(info.loginMessage);
      }

      // Use login function exposed by Passport to establish a login
      // session
      req.login(user, (err) => {

        if (err)
          return next(err);

        var recurlyAccountCode = user.recurlyAccountCode || 'recurly_1_11';

        recurly.subscriptions.listByAccount(recurlyAccountCode, {}, function(response) {
          if(typeof(response.data.subscriptions.subscription.length) == 'undefined') {
            user.recurlyAccountStatus = response.data.subscriptions.subscription.state;
            user.save()
            .then(function() {
              // Set HTTP status code `200 OK`
              res.status(200);

              // Return the user object
              var userInfo = setUserInfo(user);
              res.status(200).json({
                token: 'JWT ' + generateToken(userInfo),
                user: user
              });
            });
          } else {
            console.log(response.data.subscriptions.subscription.length);
          }
        });        
      });

    }) (req, res, next);
  });

  router.post('/auth/signup', (req, res, next) => {

    // Call `authenticate()` from within the route handler, rather than
    // as a route middleware. This gives the callback access to the `req`
    // and `res` object through closure.

    // If authentication fails, `user` will be set to `false`. If an
    // exception occured, `err` will be set. `info` contains a message
    // set within the Local Passport strategy.
    passport.authenticate('local-signup', (err, user, info) => {
      if (err)
        return next(err);

      // If no user is returned...
      if (!user) {
        console.log(info)
        // Set HTTP status code `401 Unauthorized`
        res.status(401).json(info);

        // // Return the info message
        // return next(info.signupMessage);
      } else {
        var userInfo = setUserInfo(user);
        res.status(201).json({
          token: 'JWT ' + generateToken(userInfo),
          user: user
        });
      }

    }) (req, res, next);
  });

  // Route to log a user out
  router.post('/auth/logout', (req, res) => {

    req.logOut();

    // Even though the logout was successful, send the status code
    // `401` to be intercepted and reroute the user to the appropriate
    // page
    res.sendStatus(401);
  });

  // Route to get the current user
  // The `auth` middleware was passed in to this function from `routes.js`
  router.get('/auth/user', paid, (req, res) => {

    // Send response in JSON to allow disassembly of object by functions
    res.json(req.user);
  });

  // Route to delete a user. Accepts a url parameter in the form of a
  // username, user email, or mongoose object id.
  // The `admin` Express middleware was passed in from `routes.js`
  router.delete('/auth/delete/:uid', admin, (req, res) => {

    User.remove({

      // Model.find `$or` Mongoose condition
      $or : [

        { 'local.username' : req.params.uid },

        { 'local.email' : req.params.uid },

        { '_id' : ObjectId(req.params.uid) }
      ]
    }, (err) => {

      // If there are any errors, return them
      if (err)
        return next(err);

      // HTTP Status code `204 No Content`
      res.sendStatus(204);
    });
  });
};
