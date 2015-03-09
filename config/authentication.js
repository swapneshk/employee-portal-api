var passport = require("passport");
var User = require("mongoose").model("User");
exports.authenticate = function( req, res, next ) {
  req.body.email = req.body.email.toLowerCase();
  //console.log(req.body);
  var auth = passport.authenticate('local', function(err, user) {
    if (err) { return next(err); }
    if (!user) { res.send({ success: false }); }
    req.logIn(user, function(err) {
      if (err) { return next(err); }
      if ( true === user.active )
      
    User.findOneAndUpdate({_id: user._id}, {logged_in:true}, function(err, response){
      if (err) {
        return next(err);
      }
      else{
         req.session.user = user;
         res.send({ success: true, user: user });
      }
    });
       
    });
  });
  auth( req, res, next );
};

exports.requireAPILogin = function( req, res, next ) {
  if (!req.isAuthenticated()) {
    res.status(403);
    res.end();
  } else {
    next();
  }
};

exports.requiresRole = function( role ) {
  return function(req, res, next) {
    if (!req.isAuthenticated() || req.user.roles.indexOf(role) === -1) {
      res.status(403);
      res.end();
    } else {
      next();
    }
  };
};