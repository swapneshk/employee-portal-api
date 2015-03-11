var Payroll = require("mongoose").model("Payroll");
exports.addpayroll = function(req,res){
    Payroll(req.body).save(function(err,response){
       if (!err) {
        res.json({"message": "success", "status_code": "200"});
       }
    });
};

exports.getpayrolls = function(req,res){
    var ownerId = req.body.ownerId;
    var condition = {owner_id: ownerId};
    Payroll.find(condition).populate('emp_id').exec(function(err,response){
            if(err)
                res.json({"message": "error", "data": err, "status_code": "500"});
            else
                res.json({"message": "success", "data": response, "status_code": "200"});      
    });
}