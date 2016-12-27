'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Create a `schema` for the `Todo` object
var todoSchema = new _mongoose2.default.Schema({
  text: { type: String }
});

// Expose the model so that it can be imported and used in
// the controller (to search, delete, etc.)
// ```
// todo.model.js
// (c) 2016 David Newman
// david.r.niciforovic@gmail.com
// todo.model.js may be freely distributed under the MIT license
// ```

// */app/models/todo.model.js*

// ## Todo Model

// Note: MongoDB will autogenerate an _id for each Todo object created

// Grab the Mongoose module
exports.default = _mongoose2.default.model('Todo', todoSchema);