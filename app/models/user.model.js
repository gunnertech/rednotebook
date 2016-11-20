// ```
// user.model.js
// (c) 2016 David Newman
// david.r.niciforovic@gmail.com
// user.model.js may be freely distributed under the MIT license
// ```

// */app/models/user.model.js*

// ## User Model

// Note: MongoDB will autogenerate an _id for each User object created

// Grab the Mongoose module
import mongoose from 'mongoose';

// Import library to hash passwords
import bcrypt from 'bcrypt-nodejs';
import Document from './document.model';
import Assignment from './assignment.model';

// Define the schema for the showcase item
let userSchema = mongoose.Schema({

  local : {
    username : { type : String, unique : true },

    password : String,

    email : { type : String, unique : true }
  },

  states: [{type: mongoose.Schema.Types.ObjectId, ref:'State'}],
  assignments: [{type: mongoose.Schema.Types.ObjectId, ref:'Assignment'}],
  responses: [{type: mongoose.Schema.Types.ObjectId, ref:'Response'}],
  notifications: [{type: mongoose.Schema.Types.ObjectId, ref:'Notification'}],
  lastPaidAt : {type: Date},

  role : { type : String }
});

userSchema.pre('save', function (next) {
  var self = this;
  
  mongoose.model('User', userSchema).count({})
  .then(function (count) {
    if(count === 0) {
      self.role = 'admin';
    }

    next();
  });
});

userSchema.pre('save', function (next) {
  this.lastPaidAt = this.lastPaidAt || Date.now();
  next();
});

userSchema.post('save', function (user) { // ASSIGN DOCUMENTS TO THE NEW USER
  Document.find()
  .then(function(documents) {
    documents.forEach(function(document) {
      if(!document.state || document.state == user.state) {
        Assignment.count({
          user: user._id,
          document: document._id
        })
        .then(function(count) {
          if(count === 0) {
            Assignment.create({
              user: user._id,
              document: document._id
            })
            .then(( (assignments) => {} )) 
            .error(( (err) => console.log(err) ))
            ;
          }
        });
      }
    });
  });
});

// ## Methods

// ### Generate a hash
userSchema.methods.generateHash = function(password) {

  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// ### Check if password is valid
userSchema.methods.validPassword = function(password) {

  return bcrypt.compareSync(password, this.local.password);
};

// Create the model for users and expose it to the app
export default mongoose.model('User', userSchema);
