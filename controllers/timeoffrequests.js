var Timeoffrequest = require("mongoose").model("Timeoffrequest");
exports.savetimeoff = function(req,res){
    Timeoffrequest(req.body).save(function(err,response){
       if (!err) {
        res.json({"message": "success", "status_code": "200"});
       }
    });
};

exports.gettimeoff = function(req,res){
    var empID = req.body.userId;
    if(req.body.role == "employee") {
        var condition = {employee_id: empID};
    }
    if(req.body.role == "manager" || req.body.role == "admin") {
        var condition = {manager_id: empID};
    }
    if(req.params.timeoffid){
        var condition = {_id: req.params.timeoffid};
    }
    Timeoffrequest.find(condition).populate('employee_id').exec(function(err,response){
            if(err)
                res.json({"message": "error", "data": err, "status_code": "500"});
            else
                res.json({"message": "success", "data": response, "status_code": "200"});      
    });
};

exports.updatetimeoffRequest = function(req,res){
    Timeoffrequest.findOne({_id:req.body._id},function(err,response){
         if (null!==response) {
            response.status = req.body.status;
            response.manager_comment = req.body.manager_comment;
            response.save(function(err,updateResponse){
                    if (!err) {
                        res.json({"message":"success","status_code":"200"});
                    }         
            });
         }
        
    });
        
};
