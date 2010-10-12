var sys   = require('sys');
var path  = require('path');
var fs    = require('fs');

var Users = function() {};

Users.prototype = {
  getCollection: function(db, callback) {
    db.collection('users', function(error, user_collection) {
      if( error ) callback(error);
      else callback( null, user_collection );
    });
  },

  findAll: function(db, callback) {
    this.getCollection(db, function(error, user_collection) {
      if( error ) callback(error);
      else {
        user_collection.find(function(error, cursor) {
          if( error ) callback(error);
          else {
            cursor.toArray(function(error, results) {
              if( error ) callback(error);
              else callback(null, results);
            });
          }
        });
      }
    });
  },

  findById: function(db, id, callback) {
    this.getCollection(db, function(error, user_collection) {
      if( error ) callback(error);
      else {
        user_collection.findOne({_id: ObjectID.createFromHexString(id)}, function(error, result) {
          if( error ) callback(error);
          else callback(null, result);
        });
      }
    });
  },

  findByName: function(db, name, callback) {
    this.getCollection(db, function(error, user_collection) {
      if( error ) callback(error);
      else {
        user_collection.findOne({'name':'persson'}, function(error, result) {
          if( error ) callback(error);
          else callback(null, result);
        });
      }
    });
  },

  save: function(db, users, callback) {
    this.getCollection(db, function(error, user_collection) {
      if( error ) callback(error);
      else {
        if( typeof(users.length) == "undefined")
          users = [users];
      }

      user_collection.insert(users, function() {
        callback(null, users);
      });
    });
  }
};

exports.Users = Users;
