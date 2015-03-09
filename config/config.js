var path = require("path");
var rootPath = path.normalize(__dirname + "/../");

module.exports = {
  development: {
    rootPath: rootPath,
    db: "mongodb://localhost:27017/event-manager",
    port: process.env.PORT || 3030,
    interfacePath: path.normalize(rootPath + "/../interface/generated")
  },
  production: {
    rootPath: rootPath,
    db: "mongodb://localhost:27017/event-manager",
    port: process.env.PORT || 80,
    interfacePath: path.normalize(rootPath + "/public")
  }
};