var express = require("express"),
    logger = require("morgan"),
    session = require("express-session"),
    cookieParser = require("cookie-parser"),
    bodyParser = require("body-parser"),
    passport = require("passport");


module.exports = function(app, config) {

  app.use(logger("dev"));

  app.set(express.static( config.interfacePath ));

  app.use(bodyParser());
  app.use(cookieParser());
  app.use(session({ secret: "my secret phrase" }));
  app.use(passport.initialize());
  app.use(passport.session());

  app.use(function(req, res, next) {
    if(req.user) res.setHeader("Authenticated User", req.user._id);
    return next();
  });
};
