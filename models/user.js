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
  phone: String,
  password_change: {
    type: Boolean,
    default: true
  },
  created_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  created_date: Date,
  date_of_birth: Date,
  driver_license: String,
  last_login: Date,
  prof_image: String,
  logged_in: {
    type: Boolean,
    default: false
  }
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

