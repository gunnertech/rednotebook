'use strict';

// import the `mongoose` helper utilities

var _chai = require('chai');

var _chai2 = _interopRequireDefault(_chai);

var _recipe = require('../app/models/recipe.model');

var _recipe2 = _interopRequireDefault(_recipe);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var utils = require('./utils');

var should = _chai2.default.should();

// import our `Recipe` mongoose model


describe('Recipe: models', function () {

  describe('create()', function () {

    it('should create a new Recipe', function (done) {

      // Create a `Recipe` object to pass to `Recipe.create()``
      var r = {

        title: 'Peanut Butter Cookies',

        tags: [{
          name: 'tag1'
        }, {
          name: 'tag2'
        }],

        rating: 5,

        creator: 'datatype_void',

        description: 'Peanut butter... cookies... what else is there to say?',

        ingredients: [{
          amount: '1/2',

          unit: 'cup',

          name: 'coconut flour'
        }, {
          amount: '1',

          unit: 'cup',

          name: 'crunchy peanut butter'
        }, {
          amount: '1/2',

          unit: 'cup',

          name: 'coconut sugar'
        }, {
          amount: '1/2',

          unit: 'teaspoon',

          name: 'magic'
        }],

        directions: [{
          step: 'Mix everything'
        }, {
          step: 'Bake at 350F until satisfied'
        }, {
          step: 'Enjoy delectable cookies'
        }]
      };

      _recipe2.default.create(r, function (err, createdRecipe) {

        // Confirm that that an error does not exist
        should.not.exist(err);

        // verify that the returned `recipe` is what we expect
        createdRecipe.title.should.equal(r.title);

        // The `Recipe` object should have a tags property
        should.exist(createdRecipe.tags);

        // Which should be an array with a length equal to
        // that of the test object we created
        createdRecipe.tags.should.have.length(r.tags.length);

        // For each `tag` object in the `tags` array,
        // check if it has a property `name` and then
        // see if the `name` value is equal to the
        // one we passed in with the test object
        for (var i in createdRecipe.tags) {

          should.exist(createdRecipe.tags[i].name);

          createdRecipe.tags[i].should.equal(r.tags[i]);
        }

        // It should also have `rating`, `creator`, and `description`
        // properties equal to those that we passed in
        createdRecipe.rating.should.equal(r.rating);
        createdRecipe.creator.should.equal(r.creator);
        createdRecipe.description.should.equal(r.description);

        // The `Recipe` object should have an `ingredients` property
        should.exist(createdRecipe.ingredients);
        // `ingredients` should be an array with a length equal to
        // that of the test object's `ingredients` property
        createdRecipe.ingredients.should.have.length(r.ingredients.length);

        // For each `ingredient` object in the `ingredients` array,
        // check if it has a property `amount` and then
        // see if the `amount` value is equal to the
        // one we passed in with the test object
        // Repeat for the `unit` and `name` properties
        // for each `ingredient`
        for (var _i in createdRecipe.ingredients) {

          should.exist(createdRecipe.ingredients[_i].amount);
          should.exist(createdRecipe.ingredients[_i].unit);
          should.exist(createdRecipe.ingredients[_i].name);

          createdRecipe.ingredients[_i].amount.should.equal(r.ingredients[_i].amount);

          createdRecipe.ingredients[_i].unit.should.equal(r.ingredients[_i].unit);

          createdRecipe.ingredients[_i].name.should.equal(r.ingredients[_i].name);
        }

        // The `Recipe` object should have a `directions` property
        should.exist(createdRecipe.directions);

        // Which should be an array with a length equal to
        // that of the test object we created
        createdRecipe.directions.should.have.length(r.directions.length);

        // For each `direction` object in the `directions` array,
        // check if it has a property `step` and then
        // see if the `step` value is equal to the
        // one we passed in with the test object
        for (var _i2 in createdRecipe.directions) {

          should.exist(createdRecipe.directions[_i2].step);

          createdRecipe.directions[_i2].should.equal(r.directions[_i2]);
        }

        // Call done to tell mocha that we are done with this test
        done();
      });
    });
  });
});