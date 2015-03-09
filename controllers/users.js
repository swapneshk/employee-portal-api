var User = require("mongoose").model("User"),
    Availability = require("mongoose").model("Availability"),
    encrypt = require("../utilities/encryption"),
    Timeslot = require("mongoose").model("Timeslot"),
    formidable = require('formidable');
    var nodemailer = require("nodemailer");
    // create reusable transport method (opens pool of SMTP connections)
    var transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: 'testteam.e37@gmail.com',
            pass: 'testing@2012'
        }
    });
exports.getUsers = function( req, res ) {
  User.find({}).exec(function(err, collection) {
    res.send(collection);
  });
};

exports.createUser = function( req, res, next ) {
  console.log(req.body);
  var origpass = req.body.password;
  var userData = req.body;
  userData.email    = userData.email.toLowerCase();
  userData.salt     = encrypt.createSalt();
  userData.password = encrypt.hashPassword(userData.salt, userData.password);

  User.create(userData, function(err, user) {
    if (err) {
      if (err.toString().indexOf('E11000') > -1) {
        err = new Error("That email is already part of this system.");
      }
      res.status(400);
      return res.send({ reason: err.toString() });
    }

    req.logIn(user, function(err) {
      if (err) { return next(err); }
      res.send(user);
          var email = req.body.email;
          // setup e-mail data with unicode symbols
          var mailOptions = {
                from: "Team SmartData | <testteam.e37@gmail.com>", // sender address
                to: userData.email, // list of receivers
                subject: "EMS Account", // Subject line                
                html: "Hello "+userData.first_name+",<br><br>Your EMS Account has been created. Following are the details.<br><br> EMS Url :<b>"+req.protocol + "://"+req.get('host')+"</b><br><br> EMS Id :<b>"+userData.email+"</b><br><br> EMS Password :<b>"+origpass+"</b><br><br>Note :- Kindly login to your EMS Account and fill in your personal details and update your password.<br><br><br>Thanks" // html body
          };  
          // send mail with defined transport object
          transporter.sendMail(mailOptions, function(error, info){
              if(error){
                  console.log(error);
              }else{
                  console.log('Message sent: ' + info.response);
              }
          });
    });
  });
};

exports.updateUser = function( req, res ) {
  console.log("--UPDATE USER--");
  var user = req.body;
  User.findOneAndUpdate({_id: req.body._id}, user, function(err, user){
    if (err) {
      res.send({"message": "Something went wrong!", "err": err, "status_code": "500"});
    }
    else{
      res.send({"message": "success", "data": user, "status_code": "200"});
    }
  });
};

/* 
exports.updateUser = function( req, res ) {
  var user = req.body;
 
  User.findOne({_id: req.body._id}, function(err, user){
    if (err) {
      res.send({"message": "Something went wrong!", "err": err, "status_code": "500"});
    }
    else{        
      user.email = req.body.email;
      user.first_name = req.body.first_name;
      user.last_name = req.body.last_name;
      user.address.line1 = req.body.address.line1;
      user.address.line2 = req.body.address.line2;
      user.address.city = req.body.address.city;
      user.address.state = req.body.address.state;
      user.address.zip = req.body.address.zip;
      user.phone = req.body.phone;
      console.log("--UPDATE PROFILE--");
      console.log(user);
      user.save(function(err){
        if (err) return handleError(err);
        else return res.send({"message": "success", "data": user, "status_code": "200"});
      });
    }
  });
};
*/

exports.getUserById = function( req, res ) {
  req.params.id = req.params.id.substring(1);
  User.findOne({ _id:req.params.id }).exec(function(err, user) {
    res.send(user);
  });
};

exports.updateUserInfo = function(req, res) {  
  var data = req.body;
  console.log("--EMPLOYEE DATA EDIT--");
  console.log(data);
  delete data['password'];
  //console.log(data);
  //return false;
  //data.salt = encrypt.createSalt();
  //data.password = encrypt.hashPassword(data.salt, req.body.password);
  console.log(data);
  User.update({_id: req.body._id},data, {upsert: true}, function(err, result){
  if (err) {
    console.log(err);
  }
  else {
    res.send({"message": "success", "data": data, "status_code": "200"});
  }
  })
  /*User.findOne({_id: req.body._id}, function(err, user){
    if (err) {
      res.send({"message": "Something went wrong!", "err": err, "status_code": "500"});
    }
    else {      
      User(data).save(function(err){
        if (err) return handleError(err);
        else return res.send({"message": "success", "data": user, "status_code": "200"});
      });
    }
  });*/
};

// Get Time Slot Data
exports.getTimeSlot = function(req, res){
  Timeslot.find({}).exec(function(err, collection) {
    res.send(collection);
  });
};

exports.saveTimeSlot = function(req, res){
  
  if (!req.body._id) {
    Timeslot.create(req.body, function(err, slot) {
      if (err) {
        res.send({"err": err});
      }
      else {
        console.log("slot saved");
        console.log(slot);
        res.send({"message": "success", "data": slot, "status_code": "200"});
      }
    });
  }
  else if (req.body._id) {
    Timeslot.findOneAndUpdate({_id: req.body._id}, req.body, function(err, slot){
      if (err) {
        res.send({"message": "Something went wrong!", "err": err, "status_code": "500"});
      }
      else{
        res.send({"message": "success", "data": slot, "status_code": "200"});
      }
    });
  }
  else {
    res.send({"message": "error", "data": "error", "status_code": "500"});
  }
  
};

exports.filterEmpByDate = function(req, res) {
  console.log("-- FILTER EMPLOYEE BY DATE --");
  var data = req.body;
  if (data.userRole === "admin") {
    var usercondition = {};
  }
  else if (data.userRole === "manager") {
    var usercondition = {created_by: data.userId};
  }
  else {
    res.send({"message": "error", "data": "Not Authorized.", "status_code": "500"});
  }
  User.find(usercondition, null, {sort: {created_date: -1}}, function(err, users){
    if (err)
      res.send({"message": "Something went wrong!", "err": err, "status_code": "500"});
    else {
      var empId = [];
      for(var i=0;i< users.length;i++){
        empId.push(users[i]._id);
      }
      if ( undefined === data.filter_end_date ) {
        var conditions = {employee_id: {$in: empId}, currDate: new Date(data.filter_start_date)};
      }
      else {
        var conditions = {employee_id: {$in: empId}, currDate: {$lte: new Date(data.filter_end_date), $gte: new Date(data.filter_start_date)}};
      }
      Availability.find(conditions, function(err, users){
        var userData = [];
        var x = 0;
        if (users.length) {
          for(var k=0; k< users.length; k++){
            if (!(users[k].is_morning_scheduled && users[k].is_afternoon_scheduled && users[k].is_night_scheduled && users[k].is_late_night_scheduled)) {
              userData.push(users[k].employee_id);
            }
            if (x === users.length -1 ) {
              User.find({_id: {$in: userData}}, null, {sort: {created_date: -1}}, function(err, users){
                res.send({"message": "success", "data": users, "status_code": "200"});
              });
            }
            x++;
          }
        }else{
            res.send({"message": "No users found", "status_code": "500"});
        }
      });
    }
  });
};

exports.getDailyWorkHours = function(req,res){
  var empId = req.body._id;
  var currdate = req.body.currDate;
  Availability.find({employee_id:empId, currDate:{"$lt" : currdate }},{manager_schedule:1, currDate:1},function(err,response){
    res.send({"data": response});
  });
};

exports.getEmployeeAvailabilityStatus = function(req,res){
        var loginId = req.body._id;
        var startWeek = req.body.startWeek;
        var endWeek = req.body.endWeek;
        //var condition = ;
        User.find({created_by:loginId,roles: ["employee"]}).exec(function(err, response){
            if (err){
                console.log(err);
                res.json({"message": "error", "data": err, "status_code": "500"});
            }
            else{
                res.json({"message": "success", "data": response, "status_code": "200"});
            }
        });
}
exports.checkLoggedin = function(req,res){
        var condition = {_id:{$in:req.body.empids}};
        User.find(condition).exec(function(err, response){
            if (err){
                console.log(err);
                res.json({"message": "error", "data": err, "status_code": "500"});
            }
            else{
                res.json({"message": "success", "data": response, "status_code": "200"});
            }
        }); 
}