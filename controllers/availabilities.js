var Availability = require("mongoose").model("Availability"),
User = require("mongoose").model("User"),
Event = require("mongoose").model("Event");
var nodemailer = require("nodemailer");
// create reusable transport method (opens pool of SMTP connections)
var transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: 'testteam.e37@gmail.com',
        pass: 'testing@2012'
    }
});
//var ObjectID = require("mongoose").ObjectID;
    exports.saveWeekAvailability = function(req, res){
        console.log("-- SAVE WEEK AVAILABILITY --");
        weekData = req.body;
        weekData.sort(function(a, b){ var dateA = new Date(a.currDate); var dateB = new Date(b.currDate); return dateA-dateB;});
        var x=0;
        var resultArr = [];
        for(var i=0; i< weekData.length; i++) {
            (function(i) {                
                Availability.findOne({employee_id:weekData[i].employee_id,currDate:weekData[i].currDate},function(err,response){
                    console.log("============= RESPONSE ==============");
                    console.log("I: "+i);
                    console.log("X: "+x);
                    if ( null !== response ) {
                        if ( undefined !== weekData[i].morning_schedule_time )
                            response.morning_schedule_time = weekData[i].morning_schedule_time;
                        if ( undefined !== weekData[i].afternoon_schedule_time )
                            response.afternoon_schedule_time = weekData[i].afternoon_schedule_time;
                        if ( undefined !== weekData[i].night_schedule_time )
                            response.night_schedule_time = weekData[i].night_schedule_time;
                        if ( undefined !== weekData[i].late_night_schedule_time )
                        response.late_night_schedule_time = weekData[i].late_night_schedule_time;
                        response.is_morning_scheduled = weekData[i].is_morning_scheduled;
                        response.is_afternoon_scheduled = weekData[i].is_afternoon_scheduled;
                        response.is_night_scheduled = weekData[i].is_night_scheduled;
                        response.is_late_night_scheduled = weekData[i].is_late_night_scheduled;
                        console.log("-----------IN NULL IN NULL IN NULL---------------");
                        console.log(response);
                        console.log(response.currDate);
                        
                        response.save(function(err,updateResponse){
                            if(!err){
                                resultArr.push(response); 
                            }
                            if (x==weekData.length-1) {
                                resultArr.sort(function(a, b){ var dateA = new Date(a.currDate); var dateB = new Date(b.currDate); return dateA-dateB;});
                                console.log("--RESULT ARR RESPONSE ((00))");
                            res.json({"message": "success", "data": resultArr,"status_code": "200"});
                            } 
                        }); 
                    }
                    else{
                        addAvailability(x);
                    }
                    x++;
                })
            })(i);
        }
        function addAvailability(counter) {            
            Availability(weekData[counter]).save(function(err,saveResponse){
                if (!err) {
                    //add details to array for response
                    resultArr.push(saveResponse);
                }
                if ( counter==weekData.length-1 ) {
                    res.json({"message": "success", "data": resultArr,"status_code": "200"});
                }
                
            })
        }
    };
    
    exports.getEmpWeekAvailability = function(req, res) {
        console.log("-- GET WEEK EMPLOYEE AVAILABILITY --");
        var empData = req.body;
        var empID = empData._id;
        Availability.find({employee_id: empID}, function(err, response){
            if ( err )
                res.json({"message": "error", "data": err, "status_code": "500"});
            else
                res.json({"message": "success", "data": response, "status_code": "200"});
        });
    };
    
    exports.dayAvailability = function(req, res) {
        console.log("-- GET DAY AVAILABILITY --");
        var empID = req.body._id;
        var weekDay = req.body.weekDay;        
        Availability.findOne({employee_id: empID, currDate: weekDay}, function(err, response){
            console.log(response);
            if (null !== response) {
                res.json(response);
            }else{
                res.json({"currDate":weekDay});
            }
            
        });
    };
    
    exports.assignEvent = function(req,res){
        console.log("--  ASSIGN EVENT TO EMPLOYEE --");
        Availability.findOne({employee_id:req.body.employee_id, currDate:req.body.assignDate},function(err,response){
            console.log(err);
            if ( null !== response ) {
                if (req.body.assignShift == 'morning') {
                    response.manager_schedule.morning_schedule_details.is_morning_scheduled = true;
                    response.manager_schedule.morning_schedule_details.event = req.body.event_id;
                }else if (req.body.assignShift == 'afternoon') {
                    response.manager_schedule.afternoon_schedule_details.is_afternoon_scheduled = true;
                    response.manager_schedule.afternoon_schedule_details.event = req.body.event_id;
                }else if (req.body.assignShift == 'night') {
                    response.manager_schedule.night_schedule_details.is_night_scheduled = true;
                    response.manager_schedule.night_schedule_details.event = req.body.event_id;
                }else if (req.body.assignShift == 'latenight') {
                    response.manager_schedule.late_night_schedule_details.is_late_night_scheduled = true;
                    response.manager_schedule.late_night_schedule_details.event = req.body.event_id;
                }
                response.manager_schedule.modified_date = req.body.modified_date;
                response.manager_schedule.modified_by = req.body.modified_by;
                console.log(response);
                response.save(function(err,updateResponse){
                    console.log(err);
                        if(!err){
                            res.json({"message": "success", "status_code": "200"});
                        }   
                });
            }
            else{
                var assignedData = {};
                assignedData.manager_schedule = {};
                assignedData.manager_schedule.morning_schedule_details = {};
                assignedData.manager_schedule.afternoon_schedule_details = {};
                assignedData.manager_schedule.night_schedule_details = {};
                assignedData.manager_schedule.late_night_schedule_details = {};
                assignedData.employee_id = req.body.employee_id;
                assignedData.currDate = req.body.assignDate;
                if (req.body.assignShift == 'morning') {
                    assignedData.manager_schedule.morning_schedule_details.is_morning_scheduled = true;
                    assignedData.manager_schedule.morning_schedule_details.event = req.body.event_id;
                }else if (req.body.assignShift == 'afternoon') {
                    assignedData.manager_schedule.afternoon_schedule_details.is_afternoon_scheduled = true;
                    assignedData.manager_schedule.afternoon_schedule_details.event = req.body.event_id;
                }else if (req.body.assignShift == 'night') {
                    assignedData.manager_schedule.night_schedule_details.is_night_scheduled = true;
                    assignedData.manager_schedule.night_schedule_details.event = req.body.event_id;
                }
                else if (req.body.assignShift == 'latenight') {
                    assignedData.manager_schedule.late_night_schedule_details.is_late_night_scheduled = true;
                    assignedData.manager_schedule.late_night_schedule_details.event = req.body.event_id;
                }
                assignedData.manager_schedule.modified_date = req.body.modified_date;
                assignedData.manager_schedule.modified_by = req.body.modified_by;
                Availability(assignedData).save(function(err,saveResponse){
                    console.log(err);
                    if(!err){
                        res.json({"message": "success", "status_code": "200"});
                    }
                })
            }
            
            User.findOne({ _id:req.body.employee_id }).exec(function(err, user) {
                //For event info
                Event.findOne({ _id:req.body.event_id }).exec(function(err, event) {
                    var email = req.body.email;
                    // setup e-mail data with unicode symbols
                    var mailOptions = {
                          from: "Team SmartData | <testteam.e37@gmail.com>", // sender address
                          to: user.email, // list of receivers
                          subject: "Event Assignment", // Subject line                
                          html: "Hello "+user.first_name+",<br><br>A new event has been assigned to you for <b>"+req.body.assignShift+"</b> shift. Following are the details:<br><br> Event Name :<b>"+event.name+"</b><br><br> Event Start Date :<b>"+event.start_date+"</b><br><br> Event Start Date :<b>"+event.end_date+"</b><br><br>Note :- Kindly login to your EMS Account and see the full details of your assignment.<br><br><br>Thanks" // html body
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
            
        });
    };
    
    exports.updateAvailability = function(req,res){
        console.log("Update employee availability");
        Availability.findOne({employee_id:req.body.employee_id,currDate:req.body.assignDate},function(err,response){
            if ( null !== response ) {
                if (req.body.assignShift == 'morning') {
                    response.is_morning_scheduled = req.body.employee_availability;
                }else if (req.body.assignShift == 'afternoon') {
                    response.is_afternoon_scheduled = req.body.employee_availability;
                }else if (req.body.assignShift == 'night') {
                    response.is_night_scheduled = req.body.employee_availability;
                }else if (req.body.assignShift == 'latenight') {
                    response.is_late_night_scheduled = req.body.employee_availability;
                }
                response.modified_date = req.body.modified_date;
                response.modified_by = req.body.modified_by;
                response.save(function(err,updateResponse){
                        if(!err){
                            res.json({"message": "success", "status_code": "200"});
                        }   
                });
            }else{
                var assignedData = {};
                if (req.body.assignShift == 'morning') {
                    assignedData.is_morning_scheduled = req.body.employee_availability;
                }else if (req.body.assignShift == 'afternoon') {
                    assignedData.is_afternoon_scheduled = req.body.employee_availability;
                }else if (req.body.assignShift == 'night') {
                    assignedData.is_night_scheduled = req.body.employee_availability;
                }else if (req.body.assignShift == 'latenight') {
                    assignedData.is_late_night_scheduled = req.body.employee_availability;
                }
                assignedData.employee_id = req.body.employee_id;
                assignedData.currDate = req.body.assignDate;
                assignedData.modified_date = req.body.modified_date;
                assignedData.modified_by = req.body.modified_by;
                Availability(assignedData).save(function(err,response){
                    if (!err) {
                        res.json({"message":"success","status_code":"200"});
                    }
                })
            }
            
        });
    }
    
    exports.removeAssignEvent = function(req,res){
        console.log("Remove Assigned Event");
        Availability.findOne({employee_id:req.body.employee_id, currDate:req.body.assignDate},function(err,response){
            console.log(err);
            if (null!==response) {
                if (req.body.assignShift == 'morning') {
                    response.manager_schedule.morning_schedule_details.is_morning_scheduled = false;
                    response.manager_schedule.morning_schedule_details.event = null;
                }else if (req.body.assignShift == 'afternoon') {
                    response.manager_schedule.afternoon_schedule_details.is_afternoon_scheduled = false;
                    response.manager_schedule.afternoon_schedule_details.event = null;
                }else if (req.body.assignShift == 'night') {
                    response.manager_schedule.night_schedule_details.is_night_scheduled = false;
                    response.manager_schedule.night_schedule_details.event = null;
                }
                else if (req.body.assignShift == 'latenight') {
                    response.manager_schedule.late_night_schedule_details.is_late_night_scheduled = false;
                    response.manager_schedule.late_night_schedule_details.event = null;
                }
                console.log(response);
                response.save(function(err,updateResponse){
                    if (!err) {
                        res.json({"message":"success","status_code":"200"});
                    }
                });
            }
        });
    }
    
     exports.getEmployeeSchedules = function(req, res) {
        console.log("-- Get Employee Schedules --");
        var empID = req.params.employee_id;
        Availability.find({employee_id: empID},{employee_id:1, manager_schedule:1, currDate:1}).populate('manager_schedule.morning_schedule_details.event manager_schedule.afternoon_schedule_details.event manager_schedule.night_schedule_details.event manager_schedule.late_night_schedule_details.event').exec(function(err, response){
            if ( err ){
                console.log(err);
                res.json({"message": "error", "data": err, "status_code": "500"});
            }
            else{
                res.json({"message": "success", "data": response, "status_code": "200"});
            }
        });
    }
    
    exports.otherEmpOnEvents = function(req,res){
        if (req.body.shift == 'morning') {
           var condition = {'manager_schedule.morning_schedule_details.event':req.body.event,currDate:req.body.currDate,employee_id:{$ne : req.body.curremployee}};
        }
        if (req.body.shift == 'afternoon') {
           var condition = {'manager_schedule.afternoon_schedule_details.event':req.body.event,currDate:req.body.currDate,employee_id:{$ne : req.body.curremployee}};
        }
        if (req.body.shift == 'night') {
           var condition = {'manager_schedule.night_schedule_details.event':req.body.event,currDate:req.body.currDate,employee_id:{$ne : req.body.curremployee}};
        }
        if (req.body.shift == 'latenight') {
           var condition = {'manager_schedule.late_night_schedule_details.event':req.body.event,currDate:req.body.currDate,employee_id:{$ne : req.body.curremployee}};
        }
        Availability.find(condition).populate('employee_id').exec(function(err, response){
            if (err){
                console.log(err);
                res.json({"message": "error", "data": err, "status_code": "500"});
            }
            else{
                res.json({"message": "success", "data": response, "status_code": "200"});
            }
        }); 
    }
    
    exports.getEmployeeAvailabilityStatus = function(req,res){
        var loginId = req.body._id;
        User.find(condition).populate('employee_id').exec(function(err, response){
            if (err){
                res.json({"message": "error", "data": err, "status_code": "500"});
            }
            else{
                res.json({"message": "success", "data": response, "status_code": "200"});
            }
        }); 
    }
    
    exports.checkMarkAvailability = function(req, res) {
        console.log("-- CHECK MARK AVAILABILITY --");
        console.log(req.body);
        var empID = req.body.empids;
        var startWeek = req.body.startWeek;
        var endWeek = req.body.endWeek;
        //var empID = ["54a94bee325ac1e013136cb7","54aa34fb09dc5a54232e44b0","54ab79dd7b662793180135bb"];
        //var startWeek = "2015-01-23T18:30:00Z";
        //var endWeek = "2015-01-23T18:30:00Z";
        var mongoose = require("mongoose");
        Availability.aggregate() 
            .match( { employee_id : {$in : empID.map(
                    function(id){ return mongoose.Types.ObjectId(id); }) },currDate: {$lte: new Date(endWeek), $gte: new Date(startWeek)} } )
            .group({_id : "$employee_id",count: { $sum: 1 } })
            .exec(function (err, response) {
              if (err) console.log(err);
              if ( response !== undefined && response.length > 0) {
                var x = 0;
                for (var i=0; i< response.length; i++) {
                   if(response[i].count == 7) {
                        var index = empID.indexOf(response[i]._id);
                        if (index > -1) {
                            empID.splice(index, 1);
                        }
                   }
                   if (x === response.length -1 ) {
                      User.find({_id: {$in: empID}}, function(err, users){
                        res.json({"message": "success", "data": users, "status_code": "200"});
                      });
                    }
                  x++;
                }
              }else{
                User.find({_id: {$in: empID}}, function(err, users){
                    res.json({"message": "success", "data": users, "status_code": "200"});
                });
              }
            });
    };
    
    exports.otherEmpOnEventsNoShift = function(req,res){
        var condition = {$or:[{'manager_schedule.morning_schedule_details.event':req.body.event},{'manager_schedule.afternoon_schedule_details.event':req.body.event},{'manager_schedule.night_schedule_details.event':req.body.event},{'manager_schedule.late_night_schedule_details.event':req.body.event}]};
        Availability.find(condition,{employee_id:1}).populate('employee_id').exec(function(err, response){
            if (err){
                console.log(err);
                res.json({"message": "error", "data": err, "status_code": "500"});
            }
            else{
                res.json({"message": "success", "data": response, "status_code": "200"});
            }
        }); 
    }

    //function to get shifts
    exports.getshifts=function(req,res){
        console.log("========");
        // console.log(req.session.user);
        var fields={};

        fields.employee_id=req.session.user._id;

        Availability.find(fields,function(err, data){
            if(err){
                console.log(err);
            }
            else{
                console.log(data);
                res.json({"message": "success", "data": data, "status_code": "200"});
            
            }
        }).populate("manager_schedule.morning_schedule_details.event manager_schedule.late_night_schedule_details.event manager_schedule.afternoon_schedule_details.event manager_schedule.night_schedule_details.event");
    // }).populate("event")
    }


    exports.checkedshifts= function(req,res){
        Availability.findOne({_id:req.body.ID},function(err,data){
            if(!err){
                if(req.body.case == 'Morning'){
                    // console.log("Val: ", data.manager_schedule.morning_schedule_details.is_approve);
                    data.manager_schedule.morning_schedule_details.is_approve = true;
                    // console.log("Before Data: ", data);
                    data.save(function(err,data1){
                        if(err)
                            throw err;
                        // console.log("------");
                        // console.log("Ret Data: ", data1);
                    });
                    res.json({"message": "success", "status_code": "200"});
                }
                else if(req.body.case == 'LateNyt'){
                    data.manager_schedule.late_night_schedule_details.is_approve=true;
                    data.save();
                    res.json({"message": "success", "status_code": "200"});
                }
                else if(req.body.case == 'Afternoon'){
                    data.manager_schedule.afternoon_schedule_details.is_approve=true;
                    data.save();
                    res.json({"message": "success", "status_code": "200"});
                }
                else if (req.body.case == 'Night'){
                    data.manager_schedule.night_schedule_details.is_approve=true;
                    data.save();
                    res.json({"message": "success", "status_code": "200"});
                }
            }
            else{
                res.json(err);
            }

        });
    }

    exports.getshiftsacknowledgement=function(req,res){
        console.log("==========================================================================");
        // console.log(req.session.user);
        var fields={};

        fields.modified_by=req.session.user._id;

        Availability.find(fields,function(err, data){
            if(err){
                console.log(err);
            }
            else{
                console.log(data);
                res.json({"message": "success", "data": data, "status_code": "200"});
            
            }
        })
        .populate("manager_schedule.morning_schedule_details.event manager_schedule.late_night_schedule_details.event manager_schedule.afternoon_schedule_details.event manager_schedule.night_schedule_details.event")
        .populate("modified_by employee_id")
        .sort({currDate:-1});
    }







    exports.getnotificationicon =function(id,callback){
         console.log("///////////////////////////////////////////////");
        console.log(id);
        var fields={};
        setTimeout(function(){
        fields.employee_id=id.user_id;
        Availability.find(fields,function(err, data){
            if(err){
                console.log(err);
                callback({"message": "error", "data": err, "status_code": "500"});
            }
            else{
                console.log(data);
                var count=0;
                for(i in data)
                {
                    console.log('morning_schedule'+data[i].is_morning_scheduled);
                    if(data[i].is_morning_scheduled == true){
                        console.log("morning case");
                        console.log(data[i].manager_schedule.morning_schedule_details.is_approve );
                        if(data[i].manager_schedule.morning_schedule_details.is_approve == false){
                            count = count+1;
                        }
                    }                   
                    if(data[i].is_afternoon_scheduled == true){
                        console.log("aftrnoon case");
                        if(data[i].manager_schedule.afternoon_schedule_details.is_approve == false){
                            console.log(data[i].manager_schedule.afternoon_schedule_details.is_approve);
                            count = count+1;
                        }
                    }
                    if(data[i].is_night_scheduled == true){
                        console.log("nyt case");
                        if(data[i].manager_schedule.night_schedule_details.is_approve != true){
                            console.log(data[i].manager_schedule.night_schedule_details.is_approve);
                            count = count+1;
                        }
                    }
                    if (data[i].is_late_night_scheduled){
                        // console.log("lnyt case");
                        if(data[i].manager_schedule.late_night_schedule_details.is_approve != true){
                            console.log(data[i].manager_schedule.late_night_schedule_details.is_approve);
                            count = count+1;
                        }
                    }                    
                }
                callback({"message": "success", "data": count, "status_code": "200"});
            }

        })
        },100);
    }