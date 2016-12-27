'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _notebook = require('../models/notebook.model');

var _notebook2 = _interopRequireDefault(_notebook);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// ```
// _notebook.router.js
// (c) 2016 Gunner Technology
// cody@gunnertech.com.com
// ```

// */app/routes/_notebook.router.js*

// # Notebook API object

// HTTP Verb  Route                   Description

// GET        /api/notebook             Get all of the notebooks
// GET        /api/notebook/:notebook_id  Get a single notebook by notebook id
// POST       /api/notebook             Create a single notebook
// DELETE     /api/notebook/:notebook_id  Delete a single notebook
// PUT        /api/notebook/:notebook_id  Update a notebook with new info

exports.default = function (app, router, auth, admin, paid) {

  router.route('/notebook').get(auth, paid, function (req, res) {
    _notebook2.default.find().populate({
      path: 'parts',
      populate: {
        path: 'documents'
      }
    }).then(function (notebooks) {
      res.json(notebooks);
    }).error(function (err) {
      res.status(500).send(err);
    });
  });
};