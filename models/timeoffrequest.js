var mongoose = require("mongoose");
var timeoffSchema = mongoose.Schema({
    employee_id: {type:mongoose.Schema.Types.ObjectId,ref: 'User'},
    manager_id: mongoose.Schema.Types.ObjectId,
    daytype: String,
    startdate: Date,
    enddate: Date,
    shift: String,
    description: String,
    status:String,
    manager_comment:String,
    applyDate: Date
});
var Timeoffrequest = mongoose.model("Timeoffrequest", timeoffSchema);