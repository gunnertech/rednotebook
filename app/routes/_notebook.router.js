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

import Notebook from '../models/notebook.model';

import _ from 'lodash';

export default (app, router, auth, admin, paid) => {

  router.route('/notebook')

    .get(auth, paid, (req, res) => {
      Notebook.find().populate({
        path: 'parts',
        populate: {
          path: 'documents'
        }
      })
      .then( (notebooks) => {
        res.json(notebooks);
      })
      .error( (err) => {
        res.status(500).send(err);
      });
    });

};
