// ```
// _input.router.js
// (c) 2016 Gunner Technology
// cody@gunnertech.com.com
// ```

// */app/routes/_input.router.js*

// # Input API object

// HTTP Verb  Route                   Description

// GET        /api/input             Get all of the inputs
// GET        /api/input/:input_id  Get a single input by input id
// POST       /api/input             Create a single input
// DELETE     /api/input/:input_id  Delete a single input
// PUT        /api/input/:input_id  Update a input with new info

import Input from '../models/input.model';

import _ from 'lodash';

export default (app, router, auth, admin) => {

  router.route('/input')
    .post(admin, (req, res) => {
      var safeProperties = req.body;
      Input.create(safeProperties)
      .then( (input) => {
        res.json(input);
      })
      .error( (err) => {
        res.status(500).send(err);
      });
    })

    .get(auth, (req, res) => {
      Input.find().sort({position: 1})
      .then( (inputs) => {
        res.json(inputs);
      })
      .error( (err) => {
        res.status(500).send(err);
      });
    });

  router.route('/input/:input_id')
    .get(auth, (req, res) => {
      Input.findOne({'_id': req.params.input_id}).populate(['master','children','responses'])
      .then( (input) => {
        res.json(input);
      })
      .error( (err) => {
        res.status(500).send(err);
      });
    })
    
    .put(admin, (req, res) => {
      Input.findOne({'_id': req.params.input_id})
      .then( (input) => {
        var safeProperties = req.body;
        _.assign(input, safeProperties);
        return input.save().then( () => input );
      })
      .then( (input) => {
        res.json(input);
      })
      .error( (err) => {
        res.status(500).send(err);
      });
    })

    .delete(admin, (req, res) => {

      Input.remove({
        _id : req.params.input_id
      })
      .then( () => {
        res.status(200).send({});
      })
      .error( (err) => {
        res.status(500).send(err);
      });
    });
};
