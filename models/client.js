var mongoose = require("mongoose");

var contactSchema = new mongoose.Schema({ cntnumber: String, cnttype: String});

var clientSchema = mongoose.Schema({
  name: {
    type: String,
    require: "{PATH} is required"
  },
  address: {
    street1: String,
    street2: String,
    city: String,
    state: String,
    zip: String
  },
  description: {
    type: String
  },
  contact_name: {
    type: String
  },
  contact_email: {
    type: String
  },
  contact_phone: {
    type: String
  },
  contact_fax: {
    type: String
  },
  is_account: {
    type: Boolean
  },
  is_active: {
    type: Boolean
  },
  created_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  created_date: {
    type: Date,
    default: Date.now
  },
  modified_on: {
    type: Date
  },
  contactArr: [contactSchema]
});

var Client = mongoose.model("Client", clientSchema);

