var mongoose = require("mongoose"),
    encrypt = require("../utilities/encryption");

var userSchema = mongoose.Schema({
  first_name: {
    type: String,
    require: "{PATH} is required"
  },
  last_name: {
    type: String,
    require: "{PATH} is required"
  },
  email: {
    type: String,
    require: "{PATH} is required",
    unique: true
  },
  salt: {
    type: String,
    require: "{PATH} is required"
  },
  password: {
    type: String,
    require: "{PATH} is required"
  },
  roles: [String],
  address: {
    line1: String,
    line2: String,
    city: String,
    state: String,
    zip: String
  },
  active: {
    type: Boolean,
    default: false
  },
  phone: String
});
userSchema.methods = {
  authenticate: function(password) {
    return encrypt.hashPassword(this.salt, password) === this.password;
  },
  hasRole: function(role) {
    return this.roles.indexOf(role) > -1;
  }
};
var User = mongoose.model("User", userSchema);

