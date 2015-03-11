var mongoose = require("mongoose");
var ticketcountSchema = mongoose.Schema({
    event: {type:mongoose.Schema.Types.ObjectId,ref: 'Event'},
    account: {type:mongoose.Schema.Types.ObjectId,ref: 'Client'},
    owner_id: mongoose.Schema.Types.ObjectId,
    number_of_ticket: String,
    date: Date,
    shift: String,
    tickets_strings:{},
    description: String
});
var Ticketcount = mongoose.model("Ticketcount", ticketcountSchema);