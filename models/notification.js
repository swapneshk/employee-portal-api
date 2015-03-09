var mongoose = require("mongoose"),
    encrypt = require("../utilities/encryption");

var notificationSchema = mongoose.Schema({
  receiver_id: mongoose.Schema.Types.ObjectId,
  message: String,
  sender_id: mongoose.Schema.Types.ObjectId,
  sender_name: String,
  sent_date: Date,
  marked_received_date: Date,
  is_marked: Boolean
});

var Notification = mongoose.model("Notification", notificationSchema);

