'use strict';

// import the `mongoose` helper utilities

var _chai = require('chai');

var _chai2 = _interopRequireDefault(_chai);

var _todo = require('../app/models/todo.model');

var _todo2 = _interopRequireDefault(_todo);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var utils = require('./utils');

var should = _chai2.default.should();

// import our `Todo` mongoose model


describe('Todo: models', function () {

  describe('create()', function () {

    it('should create a new Todo', function (done) {

      // Create a `Todo` object to pass to `Todo.create()``
      var t = {

        text: 'Write better tests... <.<'
      };

      _todo2.default.create(t, function (err, createdTodo) {

        // Confirm that that an error does not exist
        should.not.exist(err);

        // verify that the returned `todo` is what we expect
        createdTodo.text.should.equal('Write better tests... <.<');

        // Call done to tell mocha that we are done with this test
        done();
      });
    });
  });
});