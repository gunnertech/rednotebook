'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _document = require('../models/document.model');

var _document2 = _interopRequireDefault(_document);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// ```
// _document.router.js
// (c) 2016 Gunner Technology
// cody@gunnertech.com.com
// ```

// */app/routes/_document.router.js*

// # Document API object

// HTTP Verb  Route                   Description

// GET        /api/document             Get all of the documents
// GET        /api/document/:document_id  Get a single document by document id
// POST       /api/document             Create a single document
// DELETE     /api/document/:document_id  Delete a single document
// PUT        /api/document/:document_id  Update a document with new info

exports.default = function (app, router, auth, admin, paid) {

  router.route('/document').post(auth, admin, function (req, res) {
    var safeProperties = req.body;
    _document2.default.create(safeProperties).then(function (document) {
      res.json(document);
    }).error(function (err) {
      res.status(500).send(err);
    });
  }).get(auth, paid, function (req, res) {
    _document2.default.find().sort({ position: 1 }).populate('sections').then(function (documents) {
      res.json(documents);
    }).error(function (err) {
      res.status(500).send(err);
    });
  });

  router.route('/document/:document_id').get(auth, paid, function (req, res) {
    _document2.default.findById(req.params.document_id).populate(['part', 'state', 'assignments']).populate({
      path: 'sections',
      populate: {
        path: 'inputs'
      }
    }).populate({
      path: 'sections',
      populate: {
        path: 'children',
        populate: {
          path: 'inputs'
        }
      }
    }).then(function (document) {
      res.json(document);
    }).error(function (err) {
      res.status(500).send(err);
    });
  }).put(auth, admin, function (req, res) {
    _document2.default.findOne({ '_id': req.params.document_id }).then(function (document) {
      var safeProperties = req.body;
      _lodash2.default.assign(document, safeProperties);
      return document.save().then(function () {
        return document;
      });
    }).then(function (document) {
      res.json(document);
    }).error(function (err) {
      res.status(500).send(err);
    });
  }).delete(auth, admin, function (req, res) {

    _document2.default.remove({
      _id: req.params.document_id
    }).then(function () {
      res.status(200).send({});
    }).error(function (err) {
      res.status(500).send(err);
    });
  });
};