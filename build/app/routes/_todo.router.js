'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _todo = require('../models/todo.model');

var _todo2 = _interopRequireDefault(_todo);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (app, router) {

  // ### Todo API Routes

  // Define routes for the todo item API

  router.route('/todo')

  // ### Create a todo item

  // Accessed at POST http://localhost:8080/api/todo

  // Create a todo item
  .post(function (req, res) {

    _todo2.default.create({

      text: req.body.text

    }, function (err, todo) {

      if (err) res.send(err);

      // DEBUG
      console.log('Todo created: ' + todo);

      _todo2.default.find(function (err, todos) {
        if (err) res.send(err);

        res.json(todos);
      });
    });
  })

  // ### Get all of the todo items

  // Accessed at GET http://localhost:8080/api/todo
  .get(function (req, res) {

    // Use mongoose to get all todo items in the database
    _todo2.default.find(function (err, todo) {

      if (err) res.send(err);else res.json(todo);
    });
  });

  router.route('/todo/:todo_id')

  // ### Get a todo item by ID

  // Accessed at GET http://localhost:8080/api/todo/:todo_id
  .get(function (req, res) {

    // Use mongoose to a single todo item by id in the database
    _todo2.default.findOne(req.params.todo_id, function (err, todo) {

      if (err) res.send(err);else res.json(todo);
    });
  })

  // ### Update a todo item by ID

  // Accessed at PUT http://localhost:8080/api/todo/:todo_id
  .put(function (req, res) {

    // use our todo model to find the todo item we want
    _todo2.default.findOne({

      '_id': req.params.todo_id

    }, function (err, todo) {

      if (err) res.send(err);

      // Only update a field if a new value has been passed in
      if (req.body.text) todo.text = req.body.text;

      // save the todo item
      return todo.save(function (err) {

        if (err) res.send(err);

        return res.send(todo);
      });
    });
  })

  // ### Delete a todo item by ID

  // Accessed at DELETE http://localhost:8080/api/todo/:todo_id
  .delete(function (req, res) {

    // DEBUG
    console.log('Attempting to delete todo with id: ' + req.params.todo_id);

    _todo2.default.remove({

      _id: req.params.todo_id
    }, function (err, todo) {

      if (err) res.send(err);

      console.log('Todo successfully deleted!');

      _todo2.default.find(function (err, todos) {
        if (err) res.send(err);

        res.json(todos);
      });
    });
  });
}; // ```
// _todo.js
// (c) 2016 David Newman
// david.r.niciforovic@gmail.com
// _todo.js may be freely distributed under the MIT license
// ```

// */app/routes/_todo.router.js*

// ## Todo API object

// HTTP Verb  Route                 Description

// GET        /api/todo             Get all of the todo items
// GET        /api/todo/:todo_id    Get a single todo item by todo item id
// POST       /api/todo             Create a single todo item
// DELETE     /api/todo/:todo_id    Delete a single todo item
// PUT        /api/todo/:todo_id    Update a todo item with new info

// Load the todo model