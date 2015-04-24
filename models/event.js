var mongoose = require("mongoose"),
    encrypt = require("../utilities/encryption");

var shiftTemplateSchema = new mongoose.Schema({ start_time: String, end_time: String, eventid: mongoose.Schema.Types.ObjectId, shiftid: String});

var recurringSchema = new mongoose.Schema({
        type: Number,
        option_sel: String,
        option_data: mongoose.Schema.Types.Mixed    
    });

var eventSchema = mongoose.Schema({
    shift_template_id: [shiftTemplateSchema],
    recurring_event_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event'
    },
    set_up_person: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    is_repeat: Boolean,
    recurring_event_data: [recurringSchema],
    name: String,
    description: String,
    start_date: Date,
    end_date: Date,
    is_active: Boolean,
    
    
    event_data: {
        created_at: Date,
        updated_at: Date,
        event_type: String,
        number_of_people: Number,
        contact_name: String,
        contact_phone: String,
        contact_email: String,
        paid_valet: Boolean,
        after_call: Boolean,
        billed: Boolean,
        date_billed: Date,
        paid: Boolean,
        date_paid: Date,
        require_setup: Boolean,
        date_called: Date,
        ready_time_for_valet: Date,
        number_of_cars: Number,
        number_of_valets_needed: Number,
        notes: String,
        quotes: String,
        hear_about_us: String
    },
    location_address: {
        street1: String,
        street2: String,
        city: String,
        state: String,
        zip: String
    },
    billing_address: {
        street1: String,
        street2: String,
        city: String,
        state: String,
        zip: String
    },
    shiftstarttime: String,
    shiftendtime: String,
    shiftnumber: Number,
    accounttype: mongoose.Schema.Types.Mixed,
    accountname: String
});

var Event = mongoose.model("Event", eventSchema);