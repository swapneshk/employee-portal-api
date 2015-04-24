var auth = require("./authentication"),
    users = require("../controllers/users"),
    clients = require("../controllers/clients"),
    images = require("../controllers/images"),
    events = require("../controllers/events"),
    availabilities = require("../controllers/availabilities"),
    timeoffrequests = require("../controllers/timeoffrequests"),
    ticketcounts = require("../controllers/ticketcounts"),
    payrolls = require("../controllers/payrolls"),
    notifications = require("../controllers/notifications"),
    memos = require("../controllers/memos"),
    mongoose = require("mongoose"),
    encrypt = require("../utilities/encryption"),
    User = mongoose.model("User"),
    Client = mongoose.model("Client"),
    Availability = mongoose.model("Availability"),
    Memo = mongoose.model("Memo"),
    Timeoffrequest = mongoose.model("Timeoffrequest"),
    Ticketcount = mongoose.model("Ticketcount"),
    Payroll = mongoose.model("Payroll"),
    Event = mongoose.model("Event");
var nodemailer = require("nodemailer");

// create reusable transport method (opens pool of SMTP connections)
var transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: 'testteam.e37@gmail.com',
        pass: 'testing@2012'
    }
});

module.exports = function(app, config, io) {

  //app.get("/api/users", auth.requiresRole("admin"), users.getUsers);
  app.get("/api/users", users.getUsers);
  app.get("/api/users/:id", users.getUserById);

  app.post("/api/users", users.createUser);
  app.put("/api/users", users.updateUser);
  app.post('/api/delempl',users.delempl); //to delete user
  app.post('/api/delmanagerempl',users.delmanagerempl); //to delete manager user
  app.get("/api/getempl", function(req, res){
    User.find({roles: ["employee"],$or:[{is_deleted:{$exists:false}},{is_deleted:false}]}, null, {sort: {created_date: -1}}, function(err, users){
      //console.log(users);
      if (err) {
        res.send({"message": "Something went wrong!", "err": err, "status_code": "500"});
      }
      else {
        res.send({"message": "success", "data": users, "status_code": "200"});
      }
    });    
  });
  
  app.post("/api/getmanagerempl", function(req, res){
    var manager_id = req.body.manager_id;
    console.log(manager_id);
    User.find({created_by: manager_id ,$or:[{is_deleted:{$exists:false}},{is_deleted:false}]}, null, {sort: {created_date: -1}}, function(err, users){
      if (err) {
        console.log(err);
        res.send({"message": "Something went wrong!", "err": err, "status_code": "500"});
      }
      else{
        console.log(users);
        res.send({"message": "success", "data": users, "status_code": "200"});
      }
    });
  });
  
  app.post("/api/forsendmail", function(req, res){
    var email = req.body.email;
    // setup e-mail data with unicode symbols
    var mailOptions = {
        from: "Team SmartData | <testteam.e37@gmail.com>", // sender address
        to: email, // list of receivers
        subject: "Hello Swapnesh", // Subject line
        text: "Hello world", // plaintext body
        html: "<b>Hello world</b>" // html body
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
  
  // API to update a particular user information
  app.put("/api/users/:id", users.updateUserInfo);
  
  // API for forget Password - 23-07-2014 @Swapnesh
  app.post('/api/forgetpassword', function(req, res){
    var userEmail = req.body.email;
    console.log(userEmail);    
    
    var randomPass = Math.random().toString(36).substring(7);
    console.log(randomPass);

    User.findOne({email: userEmail}, function(err, user){
      if (err) {
        res.send({"message": "Something went wrong!", "err": err, "status_code": "500"});
      }
      else{
        user.salt     = encrypt.createSalt();        
        user.password = encrypt.hashPassword(user.salt, randomPass);
        user.save(function(err){
          if (err) return handleError(err);
          else {
            // setup e-mail data with unicode symbols
            var mailOptions = {
                from: "Team SmartData | <testteam.e37@gmail.com>", // sender address
                to: userEmail, // list of receivers
                subject: "Password Change Request", // Subject line                
                html: "Your password changed successfully. Your new password is <b>"+randomPass+"</b>." // html body
            };
            // send mail with defined transport object
            transporter.sendMail(mailOptions, function(error, info){
                if(error){
                    console.log(error);
                }else{
                    console.log('Message sent: ' + info.response);
                }
            });
            return res.send({"message": "success", "data": user, "status_code": "200"});
          }
        });
      }
    });
  });
  
  // API for employee list - 30-07-2014 @Swapnesh
  app.get('/api/admnemplist', function(req, res){
    User.find({roles: ["employee"]}, function(err, users){
      //console.log(users);
      if (err) {
        res.send({"message": "Something went wrong!", "err": err, "status_code": "500"});
      }
      else {
        res.send({"message": "success", "data": users, "status_code": "200"});
      }
    })
  });  

  app.post("/api/login", auth.authenticate);
  app.post("/logout", function( req, res ) {
    req.logout();
    res.end();
  });

  // Create client
  app.post('/api/clients', clients.createClient);
  app.post('/api/delclients',clients.delclients); //to delete user
  app.post('/api/delmanagerclients',clients.delmanagerclients); //to delete manager clients
  
  // Get Manager Client List
  app.post('/api/managerclients', clients.getManagerClients);
  
  // Get Admin client list[ALL - Manager+Admin]
  app.get('/api/clients', clients.getAllClients);
  
  // Get Client By Id
  app.get('/api/clientbyid/:id', clients.getClientById);
  
  // Update a client
  app.put('/api/clients', clients.updateClient);
  
  // Create Image
  app.post('/api/imageupload', images.upload);
  
  // Create Events
  app.post('/api/events', events.createEvent);
  
  // Fetch Event List For Admin
  app.get('/api/events', events.getEvents);
  
  // Fetch Event List For Manager
  app.post('/api/managerevents', events.getManagerEvents);
  
  // Fetch Event by ID
  app.get('/api/events/:id', events.getEventById);
  
  // Update and event
  app.put('/api/events', events.updateEvent);
  
  // Save Image
  app.post('/api/fileUpload', images.fileUpload);
  
  // Fetch Time Slot
  app.get('/api/timeslot', users.getTimeSlot);
  
  // Save Time Slot Data
  app.post('/api/timeslot', users.saveTimeSlot);
  
  // Assign Event to employee
  app.post('/api/assignment', availabilities.assignEvent);
  
  // Update employee availability by manager
  app.post('/api/updateAvailability', availabilities.updateAvailability);
  
  // Remove Assigned Event to employee
  app.post('/api/removeAssignedEvent', availabilities.removeAssignEvent);
  
  //Get Employee Schedules
  app.get('/api/getemployeeSchedule/:employee_id', availabilities.getEmployeeSchedules);
  
  //Save time Off requests
  app.post('/api/savetimeoffrequests', timeoffrequests.savetimeoff);
  
  //Get Timeoff Requests
  app.post('/api/gettimeoff', timeoffrequests.gettimeoff);
  
  //Update Timeoff Requests
  app.post('/api/updatetimeoff', timeoffrequests.updatetimeoffRequest);
  
  //Get Employee Schedules
  app.get('/api/gettimeoff/:timeoffid', timeoffrequests.gettimeoff);
  
  //Get Other Employees on Same Event
  app.post('/api/otherEmpOnEvents', availabilities.otherEmpOnEvents);
  
  //Get Hours worked on daily basis
  app.post('/api/dailyWorkHours', users.getDailyWorkHours);
  
  //Save Ticket count records
  app.post('/api/saveticketCount', ticketcounts.saveticketcount);
  
  //Get tickets
  app.post('/api/gettickets', ticketcounts.gettickets);
  
   //Save payrolls records
  app.post('/api/addPayroll', payrolls.addpayroll);
  
  //Get payrolls
  app.post('/api/getPayrolls', payrolls.getpayrolls);
  
  //Get Schedules Counts
  app.post('/api/getschedulecount', events.getschedulecount);
  
   //Get Employee Availability Status
  app.post('/api/getEmployeeAvailabilityStatus', users.getEmployeeAvailabilityStatus);
  
   //Check Employee Availability Mark
  app.post('/api/checkmarkavailability', availabilities.checkMarkAvailability);
  
  //Check Logged In Employee List
  app.post('/api/checkloggedin', users.checkLoggedin);

  // get shifts for employee
  app.get('/api/getshifts', availabilities.getshifts);
  //shifts checked by employee
  app.post('/api/checkedshifts',availabilities.checkedshifts);
  //for shift acknowledgement
  app.get('/api/getshiftsacknowledgement', availabilities.getshiftsacknowledgement);
  //to check notification
  // app.get('/api/chknotification', availabilities.chknotification);
  app.post("/api/logout", function( req, res ) {
    
    User.findOneAndUpdate({_id: req.body.loggedid}, {logged_in:false}, function(err, response){
      if (err) {
        console.log(err);
      }
      else{
         req.logout();
         res.end();
      }
    });
  });
  
  //Get Other Employees on Same Event without shifts
  app.post('/api/otherEmpOnEventsNoShift', availabilities.otherEmpOnEventsNoShift);
  
  // Change Password
  app.post('/api/changepassword', function(req, res){
    
      var newPassword = req.body.new_pass;
      var userEmail = req.body.email;
      var userId = req.body._id;

      if ((req.user._id == userId) && (req.user.email == userEmail)  ) {
        User.findOne({email: userEmail}, function(err, user){
          if (err) {
            res.send({"message": "Something went wrong!", "err": err, "status_code": "500"});
          }
          else{
            user.salt     = encrypt.createSalt();        
            user.password = encrypt.hashPassword(user.salt, newPassword);
            user.password_change = true;
            user.save(function(err) {
              if (err)
                  res.send({"message": "error", "data": err, "status_code": "500"});
              else
                  res.send({"message": "success", "data": user, "status_code": "200"});
            });
          }
        });
      }
      else {
        res.send({"message": "Something went wrong!", "err": "Not Authorized", "status_code": "500"});
      } 
 
    });
  
  // Get week employee availability from employee id
  app.post('/api/empweekavailability', availabilities.getEmpWeekAvailability);
  
  // Save week availability
  app.post('/api/weekavailability', availabilities.saveWeekAvailability);
  
  // Get Day wise availability for an employee
  app.post('/api/dayavailability', availabilities.dayAvailability);
  
  /* API FOR MEMOS */
  app.post('/api/getmemos', memos.getMemos); // RETRIEVE all memos
  app.post('/api/memos', memos.createMemo); // CREATE new memo
  app.get('/api/memos/:id', memos.getMemo); // GET memo
  app.post('/api/delmemo',memos.delmemo); //to delete
  app.post('/api/updmemo',memos.updmemo); //to update
  app.post('/api/markread', memos.markMemo); // MARK MEMO AS READ
  

  /* API TO FILTER EMPLOYEE LIST ON DATE RANGE - viewadminemployee */
  app.post('/api/filterEmpByDate', users.filterEmpByDate);

io.on('connection', function (socket) {
  
  socket.emit('connection', "Connection Created.");
  
  socket.on('send memo notification', function(data) {
    console.log("Socket Send Memo Notification Loop");
    console.log(data);
    notifications.createNotification(data);
  });
  
  socket.on('get notifications', function(data){
    console.log("Socket Get Notifications Loop");
    console.log(data);
    notifications.getNotifications(data, function(response){
        console.log("Socket Get Notifications RESPONSE Loop");
        console.log(response);
        socket.emit('notification data', response.data);
    });
  });
  socket.on('get availability notification', function(data){
    availabilities.getnotificationicon(data, function(count){
      console.log("+=+========================+");
      console.log(count);
      socket.emit('notification icon data',count.data);
    });
  });
  
});
   
  /*
  app.get("*", function( req, res ) {
    res.sendfile( config.interfacePath + '/index.html' );
  });
  */
  
  
};