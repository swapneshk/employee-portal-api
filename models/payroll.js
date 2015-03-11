var mongoose = require("mongoose");
var payrollSchema = mongoose.Schema({
    owner_id: mongoose.Schema.Types.ObjectId,
    emp_id: {type:mongoose.Schema.Types.ObjectId,ref: 'User'},
    pay_rate: String,
    total_hours: String,
    time_to: Date,
    time_from:Date,
    description: String
});
var Payroll = mongoose.model("Payroll", payrollSchema);