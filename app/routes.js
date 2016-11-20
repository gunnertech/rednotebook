// ```
// routes.js
// (c) 2015 David Newman
// david.r.niciforovic@gmail.com
// routes.js may be freely distributed under the MIT license
// ```

// */app/routes.js*

import moment from 'moment';

// ## Node API Routes

// Define routes for the Node backend

// Load our API routes for user authentication
import authRoutes from './routes/_authentication.router.js';

import partRoutes from './routes/_part.router.js';
import documentRoutes from './routes/_document.router.js';
import sectionRoutes from './routes/_section.router.js';
import inputRoutes from './routes/_input.router.js';
import responseRoutes from './routes/_response.router.js';
import stateRoutes from './routes/_state.router.js';



export default (app, router, passport) => {

  // ### Express Middlware to use for all requests
  router.use((req, res, next) => {

    console.log('I sense a disturbance in the force...'); // DEBUG

    // Make sure we go to the next routes and don't stop here...
    next();
  });

  // Define a middleware function to be used for all secured routes
  let auth = (req, res, next) => {

    if (!req.isAuthenticated())
      res.status(401).json({message: "Not logged in"});

    else
      next();
  };

  // Define a middleware function to be used for all secured administration
  // routes
  let admin = (req, res, next) => {

    if (!req.isAuthenticated() || req.user.role !== 'admin')
      res.status(401).json({message: "Not Authorized"});

    else
      next();
  };

  let paid = (req, res, next) => {
    if (!req.isAuthenticated()) {
      res.status(401).json({message: "Not Authorized"});
    } else if(req.user.role == 'admin') {
      next();
    } else {
      var currentMonth = moment().startOf('month');
      var lastPaidMonth = moment(req.user.lastPaidAt);

      if(currentMonth.month() == lastPaidMonth.month()) {
        res.status(401).json({message: "Not Paid"});
      } else {
        next();
      }
    }
  };

  // ### Server Routes

  // Handle things like API calls,

  // #### Authentication routes

  // Pass in our Express app and Router.
  // Also pass in auth & admin middleware and Passport instance
  authRoutes(app, router, passport, auth, admin);

  // #### RESTful API Routes

  partRoutes(app, router, auth, admin);
  documentRoutes(app, router, auth, admin);
  sectionRoutes(app, router, auth, admin);
  inputRoutes(app, router, auth, admin);
  responseRoutes(app, router, auth, admin);
  stateRoutes(app, router, auth, admin);
	

	// All of our routes will be prefixed with /api
	app.use('/api', router);

  // ### Frontend Routes

  // Route to handle all Angular requests
  app.get('*', (req, res) => {

    // Load our src/app.html file
    //** Note that the root is set to the parent of this folder, ie the app root **
    res.sendFile('/dist/index.html', { root: __dirname + "/../"});
  });
};
