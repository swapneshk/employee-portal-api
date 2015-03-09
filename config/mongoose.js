var mongoose = require("mongoose"),
    userModel = require("../models/user"),
    clientModel = require("../models/client"),
    eventModel = require("../models/event"),
    timeslotModel = require("../models/timeslot"),
    availabilityModel = require("../models/availability"),
    notificationModel = require("../models/notification"),
    memoModel = require("../models/memo");
    Timeoffrequest = require("../models/timeoffrequest");
    Ticketcount = require("../models/ticketcount");
    Payroll = require("../models/payroll");


module.exports = function(config) {
  mongoose.connect(config.db);

  var db = mongoose.connection;
  db.on("error", console.error.bind(console, "connection error..."));
  db.once("open", function callback() {
    console.log("event-manager db opened");
  });

};

