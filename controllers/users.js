var User = require("mongoose").model("User"),
    encrypt = require("../utilities/encryption");

exports.getUsers = function( req, res ) {
  User.find({}).exec(function(err, collection) {
    res.send(collection);
  });
};

exports.createUser = function( req, res, next ) {
  var userData = req.body;
  userData.email    = userData.email.toLowerCase();
  userData.salt     = encrypt.createSalt();
  userData.password = encrypt.hashPassword(userData.salt, userData.password);

  User.create(userData, function(err, user) {
    if (err) {
      if (err.toString().indexOf('E11000') > -1) {
        err = new Error("That email is already part of this system.");
      }
      res.status(400);
      return res.send({ reason: err.toString() });
    }

    req.logIn(user, function(err) {
      if (err) { return next(err); }
      res.send(user);
    });
  });
};

// exports.updateUser = function( req, res ) {
//   var userData = req.body;
//   var user = {};

//   if (req.user._id === userData._id) {
//     user = req.user;
//   } else if (req.user.hasRole("admin")) {
//     user = userData;
//   } else {
//     res.status(403);
//     return res.end();
//   }

//   if (userData.updatePassword) {
//     user.salt     = encrypt.createSalt();
//     user.password = encrypt.hashPassword(user.salt, userData.password);
//   }

//   user.save(function(err) {
//     if (err) {
//       res.status(400);
//       return res.send({ reason: err.toString() });
//     }
//     res.send(user);
//   });
// };

exports.getUserById = function( req, res ) {
  User.findOne({ _id:req.params.id }).exec(function(err, user) {
    res.send(user);
  });
};