var Memo = require("mongoose").model("Memo");

exports.getMemos = function(req, res) {
    console.log("-- GET MEMOS --");
    
    var memoData  = req.body;
    if ( "adminInboxMsgs" === memoData.action ) {
        Memo.find({created_by: { $ne: memoData.userId}}, null, {sort: {created_date: -1}}, function(err, response){
            if (!err)
                res.send({"message": "success", "data": response, "status_code": "200"});
            else
                res.send({"message": "error", "data": err, "status_code": "500"});
        });
    }
    
    if ( "managerInboxMsgs" === memoData.action ) {
        Memo.find({sent_to: {$elemMatch:{user_id: memoData.userId}}}, null, {sort: {created_date: -1}}, function(err, response){
            if (!err)
                res.send({"message": "success", "data": response, "status_code": "200"});
            else
                res.send({"message": "error", "data": err, "status_code": "500"});
        });
    }
    
    if ( "empInboxMsgs" === memoData.action ) {
        Memo.find({sent_to: {$elemMatch:{user_id: memoData.userId}}}, null, {sort: {created_date: -1}}, function(err, response){
            if (!err)
                res.send({"message": "success", "data": response, "status_code": "200"});
            else
                res.send({"message": "error", "data": err, "status_code": "500"});
        });
    }
    
    if ( "getAllCreatedByMe" === memoData.action ) {
        Memo.find({created_by: memoData.userId}, null, {sort: {created_date: -1}}, function(err, response){
            if (!err){
                    for(i in response){
                        prev_time=response[i].created_date;
                        new_time = Date.now();
                        var diff = Math.abs(prev_time - new_time);
                        var minutes = Math.floor((diff/1000)/60);
                        response[i]['mins'] = minutes;
                        console.log('===========================');
                        console.log(response[i]);
                    }
                    setTimeout(function(){
                        console.log("=============================response sent back");
                        res.send({"message": "success", "data": response, "status_code": "200"});
                    },10)
            }
            else
                res.send({"message": "error", "data": err, "status_code": "500"});
        });
    }

};

exports.createMemo = function(req, res) {
    console.log("-- CREATE MEMO --");
    
    var memoData = req.body;
    console.log(memoData);
    Memo(memoData).save(function(err,response){
        if (!err)
            res.send({"message": "success", "data": response, "status_code": "200"});
        else
            res.send({"message": "error", "data": err, "status_code": "500"});
    });
};

exports.getMemo = function(req, res) {
    console.log("-- GET MEMO --");
    
    if (req.params.id) {
        Memo.findById(req.params.id, function(err, response){
            if (!err)
            { 
                res.send({"message": "success", "data": response, "status_code": "200"});
            }

            else
                res.send({"message": "error", "data": err, "status_code": "500"});
        });
    }
    else
        res.send({"message": "error", "data": "No Id requested", "status_code": "500"});
};

exports.markMemo = function(req, res) {
    console.log("-- MARK MEMO --");
    
    var memoData = req.body;
    if ( "admin" === memoData.user_role ) {
        Memo.findById(memoData.memoId, function(err, memo){
            if (!err) {
                memo.admin_checked = true;
                memo.save(function(err, memo){
                    res.send({"message": "error", "data": memo, "status_code": "500"});
                });
            }
            else
                res.send({"message": "error", "data": err, "status_code": "500"});
        });
    }
    else {
        Memo.findById(memoData.memoId, function(err, memo){
            if (!err) {
                memo.sent_to.forEach(function(element, key){
                    if(element.user_id == memoData.userId) {
                        element.mark_read = true;
                        memo.save(function(err, memo){
                            res.send({"message": "error", "data": memo, "status_code": "500"});
                        });
                    }
                });
            }
            else
                res.send({"message": "error", "data": err, "status_code": "500"});
        });
    }
};

//to delete memo
exports.delmemo=function(req, res,_id){
        console.log("---delete memo---");
        var a= req.body.Id;
        console.log(a);
        Memo.findOne({_id:a},function(err,data){
            console.log("+++data+++");
            console.log(data);
            prev_time=data.created_date;
            new_time = Date.now();
            var diff = Math.abs(prev_time - new_time);
            var min = Math.floor((diff/1000)/60);
            if(min>15){
                console.log("if");
                res.json({"code":"500", "response":"time has exceeded 15 mins"})
            }else{
                console.log("else");
                Memo.findByIdAndRemove(a,function(err){
                    if(err){
                        console.log(err);
                        res.send('err');
                    }
                    else{
                        res.send('done');
                    }
                });    
            }
        })        
};

//update Memo
exports.updmemo=function(req,res)
{
    console.log("---update memo");
    var title1= req.body.title;
    var description1= req.body.description;
    Memo.update({_id: req.body._id},{$set:{title:title1,description:description1}},function(err,data){
        if (err) {
        res.send({"message": "Something went wrong!", "err": err, "status_code": "500"});
      }
        else {
        res.send({"message": "success", "data": data, "status_code": "200"});
      }
    });
};