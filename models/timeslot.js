var mongoose = require("mongoose"),
    encrypt = require("../utilities/encryption");

var timeslotSchema = mongoose.Schema({
        morning_start_time: Number,
        morning_end_time: Number,
        morning_start_period: String,
        morning_end_period: String,
        afternoon_start_time: Number,
        afternoon_end_time: Number,
        afternoon_start_period: String,
        afternoon_end_period: String,
        night_start_time: Number,
        night_end_time: Number,
        night_start_period: String,
        night_end_period: String,
        late_night_start_time: Number,
        late_night_end_time: Number,
        late_night_start_period: String,
        late_night_end_period: String,
        last_modified_date: Date,
        last_modified_by: mongoose.Schema.Types.ObjectId
});

var Timeslot = mongoose.model("Timeslot", timeslotSchema);