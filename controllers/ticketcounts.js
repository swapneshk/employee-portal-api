var Ticketcount = require("mongoose").model("Ticketcount");
exports.saveticketcount = function(req,res){
    Ticketcount(req.body).save(function(err,response){
       if (!err) {
        res.json({"message": "success", "status_code": "200"});
       }
    });
};

exports.gettickets = function(req,res){
    var ownerId = req.body.ownerId;
    var condition = {owner_id: ownerId};
    Ticketcount.find(condition).populate('event account').exec(function(err,response){
            if(err)
                res.json({"message": "error", "data": err, "status_code": "500"});
            else
                res.json({"message": "success", "data": response, "status_code": "200"});      
    });
}