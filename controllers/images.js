var User = require("mongoose").model("User");
var formidable = require('formidable'),
    http = require('http'),
    util = require('util'),
    fs = require("fs"),
    path = require('path');
   
// CREATE
exports.upload = function (req, res) {
    /*
    if (req.session.user) {
        var user_id = req.session.user._id;
        var curTimeStamp = Date.now();
        var form = new formidable.IncomingForm();
        
        form.uploadDir = __dirname + '/upload';
        form.keepExtensions = true;
    
        form.on('fileBegin', function(name, file) {
            var my_text = "profile_" + user_id + "_time_" +curTimeStamp + "_" + file.name;
            file.path = form.uploadDir + "/" + my_text;

            User.findOne({_id: user_id}, function(err, user){
                user.prof_image = my_text;
                user.save(function(err){
                    if (err) return handleError(err);
                    else return res.send({"message": "success", "data": user, "status_code": "200"});
                });
            });
        });
        form.parse(req);
        
    }
    */
};

// File upload for employee image on edit form by @Swapnesh on @26-08-2014
exports.fileUpload = function(req, res) {
    
    var form = new formidable.IncomingForm();
    form.parse(req, function(err, fields, files) {
        
        // Handling file data
        var old_path = files.file.path, // '/tmp/cbd0418a51549902e4b1dd7c839e0910'
            file_size = files.file.size,
            file_ext = files.file.name.split(".").pop(),
            index = old_path.lastIndexOf('/') + 1,
            file_name = old_path.substr(index),
            new_path = path.join(process.env.PWD, '/uploads/', file_name + '.' + file_ext),
            save_image = file_name + '.' + file_ext;

        fs.readFile(old_path, function(err, data) {
            fs.writeFile(new_path, data, function(err) {
                fs.unlink(old_path, function(err) {
                    if (err) {
                        res.status(500);
                        res.json({'success': false});
                    } else {
                        res.status(200);
                        res.json({'success': true, old_path: old_path, new_path: new_path, save_image_name: save_image});
                    }
                });
            });
        });    

    });    
    
};