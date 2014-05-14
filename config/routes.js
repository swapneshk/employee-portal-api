var auth = require("./authentication"),
    users = require("../controllers/users"),
    mongoose = require("mongoose"),
    User = mongoose.model("User");

module.exports = function(app, config) {

  app.get("/api/users", auth.requiresRole("admin"), users.getUsers);
  app.get("/api/users/:id", users.getUserById);

  app.post("/api/users", users.createUser);
  // app.put("/api/users", users.updateUser);

  app.all("/api/*", function( req, res ) {
    res.send(404);
  });

  app.post("/login", auth.authenticate);
  app.post("/logout", function( req, res ) {
    req.logout();
    res.end();
  });

  app.get("*", function( req, res ) {
    res.sendfile( config.interfacePath + '/index.html' );
  });
};