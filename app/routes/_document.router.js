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

import Document from '../models/document.model';

import _ from 'lodash';

export default (app, router, auth, admin, paid) => {

  router.route('/document')
    .post(auth, admin, (req, res) => {
      var safeProperties = req.body;
      Document.create(safeProperties)
      .then( (document) => {
        res.json(document);
      })
      .error( (err) => {
        res.status(500).send(err);
      });
    })

    .get(auth, paid, (req, res) => {
      Document.find().sort({position: 1}).populate('sections')
      .then( (documents) => {
        res.json(documents);
      })
      .error( (err) => {
        res.status(500).send(err);
      });
    });

  router.route('/document/:document_id')
    .get(auth, paid, (req, res) => {
      Document.findById(req.params.document_id).populate(['part','state','assignments'])
      .populate({
        path: 'sections',
        populate: {
          path: 'inputs'
        }
      })
      .populate({
        path: 'sections',
        populate: {
          path: 'children',
          populate: {
            path: 'inputs'
          }
        }
      })
      .then( (document) => {
        res.json(document);
      })
      .error( (err) => {
        res.status(500).send(err);
      });
    })
    
    .put(auth, admin, (req, res) => {
      Document.findOne({'_id': req.params.document_id})
      .then( (document) => {
        var safeProperties = req.body;
        _.assign(document, safeProperties);
        return document.save().then( () => document );
      })
      .then( (document) => {
        res.json(document);
      })
      .error( (err) => {
        res.status(500).send(err);
      });
    })

    .delete(auth, admin, (req, res) => {

      Document.remove({
        _id : req.params.document_id
      })
      .then( () => {
        res.status(200).send({});
      })
      .error( (err) => {
        res.status(500).send(err);
      });
    });
};
