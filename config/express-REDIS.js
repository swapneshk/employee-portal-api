var express = require("express"),
    logger = require("morgan"),
    session = require("express-session"),
    RedisStore = require('connect-redis')(session), // If express >= 4 pass session to Redis store
    cookieParser = require("cookie-parser"),
    bodyParser = require("body-parser"),
    passport = require("passport");


module.exports = function(app, config) {

  app.use(logger("dev"));

  app.use(bodyParser());
  app.use(cookieParser());
  //app.use(session({ secret: "my secret phrase" }));
  app.use(session({ store: new RedisStore, secret: 'my secret password' }));
  app.use(passport.initialize());
  app.use(passport.session());

  app.use(function(req, res, next) {
    if(req.user) res.setHeader("Authenticated User", req.user._id);
    return next();
  });
};
