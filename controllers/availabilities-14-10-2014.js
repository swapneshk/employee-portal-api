var Availability = require("mongoose").model("Availability");

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
        console.log(weekDay);
        
        Availability.findOne({employee_id: empID, currDate: weekDay}, function(err, response){
            res.json(response);
        });
    };