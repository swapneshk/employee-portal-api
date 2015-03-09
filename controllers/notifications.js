var Notification = require("mongoose").model("Notification");

exports.getNotifications = function(data, callback) {
    var userId = data.user_id;
    Notification.find({receiver_id: userId}, function(err, response){
        if (err)
            callback({"message": "error", "data": err, "status_code": "500"});
        else
            callback({"message": "success", "data": response, "status_code": "200"});
    });  
};

exports.createNotification = function(data) {
    console.log("-- CREATE NOTIFICATIONS --");

    var notificationData = data;
    var x = 0;
    for(var i=0; i< notificationData.length; i++) {
        // Code
        Notification(notificationData[i]).save(function(err,response){
            if (err)
                return false;
        });    
        if (x === notificationData.length - 1) {
            return true;
        }
        x++;
    }
};

exports.markNotifications = function(req, res) {
    console.log("-- MARK NOTIFICATIONS --");
    
    var notificationData = req.body;
};