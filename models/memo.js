var mongoose = require("mongoose"),
    encrypt = require("../utilities/encryption");

var memoSchema = mongoose.Schema({
        title: String,
        description: String,
        creator_name: String,
        created_by: mongoose.Schema.Types.ObjectId,
        created_date: Date,
        sent_to: [{user_id: mongoose.Schema.Types.ObjectId, mark_read: {type: Boolean, default: false}, read_date: Date}],
        admin_checked: { type: Boolean, default: false }
});

var Memo = mongoose.model("Memo", memoSchema);