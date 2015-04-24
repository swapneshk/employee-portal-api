var mongoose = require("mongoose"),
    encrypt = require("../utilities/encryption");

var availabilitySchema = mongoose.Schema({
        employee_id: {type: mongoose.Schema.Types.ObjectId, ref: 'User'}, 
        currDate: Date,
        slot_time: {
            morning_start_time: String,
            morning_start_time_period: String,
            morning_end_time: String,
            morning_end_time_period: String,
            afternoon_start_time: String,
            afternoon_start_time_period: String,
            afternoon_end_time: String,
            afternoon_end_time_period: String,
            night_start_time: String,
            night_start_time_period: String,
            night_end_time: String,
            night_end_time_period: String,
            late_night_start_time: String,
            late_night_start_time_period: String,
            late_night_end_time: String,
            late_night_end_time_period: String,
        },
        morning_schedule_time: Date,
        afternoon_schedule_time: Date,
        night_schedule_time: Date,
        late_night_schedule_time: Date,
        is_morning_scheduled: Boolean,
        is_afternoon_scheduled: Boolean,
        is_night_scheduled: Boolean,
        is_late_night_scheduled: Boolean,
        modified_date: Date,
        modified_by: {type:mongoose.Schema.Types.ObjectId,ref:'User'},
        manager_schedule: {
           modified_date: Date,
           modified_by: mongoose.Schema.Types.ObjectId,
           morning_schedule_details:{
                is_approve: {type:Boolean,default:false},
                is_morning_scheduled: Boolean,
                event: {type: mongoose.Schema.Types.ObjectId, ref: 'Event'}
                },
           afternoon_schedule_details:{
                is_approve: {type:Boolean,default:false},
                is_afternoon_scheduled: Boolean,
                event: {type: mongoose.Schema.Types.ObjectId, ref: 'Event'}
                },
           night_schedule_details:{
                is_approve: {type:Boolean,default:false},
                is_night_scheduled: Boolean,
                event: {type: mongoose.Schema.Types.ObjectId, ref: 'Event'}
                },
           late_night_schedule_details:{
                is_approve: {type:Boolean,default:false},
                is_late_night_scheduled: Boolean,
                event: {type: mongoose.Schema.Types.ObjectId, ref: 'Event'}
                }
        }
});

var Availability = mongoose.model("Availability", availabilitySchema);