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
            if (!err)
                res.send({"message": "success", "data": response, "status_code": "200"});
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
                res.send({"message": "success", "data": response, "status_code": "200"});
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