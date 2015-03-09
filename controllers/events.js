var Event = require("mongoose").model("Event");
var fs = require('fs');

  // Create Client For An _id[Manager + Admin]
  exports.createEvent = function( req, res, next ) {
    console.log("--CREATE EVENT--");
    var eventData = req.body;
    eventData.event_data.created_at = new Date();
    console.log(eventData);
    if (true === eventData.is_repeat) {
      var dat = eventData.recurring_event_data;
      eventData.recurring_event_data=[];
      eventData.recurring_event_data[0]=dat;
      console.log(eventData);
    }

    Event.create(eventData, function(err, event) {
      if (!err) {
        // If Shift Data Exists
        if ( typeof eventData.shiftData !== 'undefined' && eventData.shiftData.length > 0 ) {
          for(var i =0; i < eventData.shiftData.length; i++ ) {
            eventData.shiftData[i].eventid = event._id;
            eventData.shiftData[i].shiftid = event._id+"_"+i;
            eventData.shiftData.push();
          }
          eventData.shift_template_id = eventData.shiftData;
          // Find One And Update
          Event.findOneAndUpdate({_id: event._id}, {shift_template_id: eventData.shift_template_id}, function(err, event){
            console.log("--I am in loop 2--");
            console.log("--EVENT DETAILS--");
            console.log(event);
            if (err) {
              res.send({"message": "Something went wrong!", "err": err, "status_code": "500"});
            }
            else {
              res.send({"message": "success", "data": event, "status_code": "200"});
            }
          });
        }
        else {
          res.send({"status_code": "200", "event": event,"message": "Added Successfully"});
        }  
      }
      else{
        res.send({ reason: err.toString() });      
      }
    });

  };
  
  exports.getEvents = function( req, res, next ) {
    console.log("--GET ADMIN EVENTS--");
    console.log(req.session.user.roles[0]);
    if ( "admin" === req.session.user.roles[0] ) {
      Event.find({}, null,{ sort: {"event_data.created_at": -1 } },function(err, events){
        res.send({"status_code": "200", "events": events, "message": "All Event List"});
      });
    }
    else {
      res.send({"status_code": "400", "message": "You are not authorized."});
    }
  };
  
  exports.getManagerEvents = function( req, res, next ) {
    console.log("--GET MANAGER EVENTS--");
    console.log(req.body);
    if ( "manager" === req.session.user.roles[0] ) {
      Event.find({set_up_person: req.body.manager_id}, null,{ sort: {"event_data.created_at": -1 } },function(err, events){
        res.send({"status_code": "200", "events": events, "message": "All Event List"});
      });
    }
    else {
      res.send({"status_code": "400", "message": "You are not authorized."});
    }
  };
  
  exports.getEventById = function(req, res){
    console.log("--GET EVENT BY ID--");
    
    if (req.params.id) {
      Event.findById(req.params.id, function(err, event){
        if (!err) {
          res.send({"status_code": "200", "data": event});
        }
        else{
          res.send({"status_code": "500", "data": err});
        }
      });
    }
  };
  
  // Update Event For An _id
  exports.updateEvent = function( req, res ) {
    console.log("--UPDATE EVENT--");
    var updateData = req.body;
    if (true === updateData.is_repeat) {
      var dat = updateData.recurring_event_data;
      updateData.recurring_event_data=[];
      updateData.recurring_event_data[0]=dat;
    }
    
    if (typeof updateData.shiftData !== 'undefined' && updateData.shiftData.length > 0 ) {
      for(var i =0; i < updateData.shiftData.length; i++ ) {
        updateData.shiftData[i].eventid = req.body._id;
        updateData.shiftData[i].shiftid = req.body._id+"_"+i;
        updateData.shiftData.push();
      }
      updateData.shift_template_id = updateData.shiftData;
    }
    
    Event.findOneAndUpdate({_id: req.body._id}, updateData, function(err, event){
      if (err) {
        res.send({"message": "Something went wrong!", "err": err, "status_code": "500"});
      }
      else {
        logData("logs/update-event.log", event, "UPDATE", req.session.user.roles[0], req.session.user._id);
        res.send({"message": "success", "data": event, "status_code": "200"});
      }
    });
  };
  
  // WRITE DATA TO LOG FILE
  var logData = function(path, data, action, role, uid){
    
    var writeData = "";
    writeData += "[" + new Date() + "]";
    writeData += "\t["+action+"]\t";
    writeData += "[ACTION BY: "+role+"]\t";
    writeData += "[ACTION ID: "+uid+"]\t";
    writeData += "[RESULT: " + JSON.stringify(data) + "]\t\n";
    writeData += "==================================================================================================================";
    writeData += "\n\n";
    
    fs.appendFile(path, writeData, function(err) {
      if(err) throw err;
        //res.send({"message": "success", "data": data, "status_code": "200"});
    });    
  };
  
  /*
  // Fetch ALL Clients For An _id[Manager]
  exports.getManagerClients = function( req, res ) {
    console.log("--FIND MANAGER CLIENTS--");
    var userID = req.body.manager_id;    
    console.log(req.body);
    if (userID) {      
      Client.find({created_by: userID}).exec(function(err, clients) {
        console.log(clients);
        res.send({"status_code": "200", "data": clients});
      });
    }
  };
  
  // Fetch ALL Clients For An _id[Admin]
  exports.getAllClients = function( req, res ) {
    console.log("--FIND ADMIN CLIENTS--");   
    
    Client.find({}, function(err, clients){
      console.log(clients);
      res.send({"status_code": "200", "data": clients});
    });
  };  

  // Update Client For An _id
  exports.updateClient = function( req, res ) {
    console.log("--UPDATE CLIENT--");
    var user = req.body;
    console.log(req.body);   
    Client.findById(req.body._id, function(err, client){
      if (err) {
        res.send({"message": "Something went wrong!", "err": err, "status_code": "500"});
      }
      else{
        client.name = req.body.name;
        client.address.street1 = req.body.address.street1;
        client.address.street2 = req.body.address.street2;
        client.address.city = req.body.address.city;
        client.description = req.body.description;
        client.contact_name = req.body.contact_name;
        client.contact_email = req.body.contact_email;
        client.contact_phone = req.body.contact_phone;
        client.contact_fax = req.body.contact_fax;
        client.is_account = req.body.is_account;
        client.is_active = req.body.is_active;
        client.modified_on = new Date();
        console.log(client);
        client.save(function(err){
          if (err) return handleError(err);
          else return res.send({"message": "success", "data": client, "status_code": "200"});
        });
      }
    });  
  };
  
  exports.getClientById = function(req, res){
    console.log("--GET CLIENT BY ID--");
    
    if (req.params.id) {
      Client.findById(req.params.id, function(err, client){
        if (!err) {
          res.send({"status_code": "200", "data": client});
        }
        else{
          res.send({"status_code": "500", "data": err});
        }
      });
    }
  };
  */
  
  exports.getschedulecount = function(req,res){
      var currdate = req.body.currDate;
      var loginuserid = req.body._id;
      var f_type = req.body.fetchtype;
      if (f_type == 'today') {
        var conditions = {set_up_person: loginuserid,start_date:{$lte:currdate},end_date:{$gte:currdate}};
      }
      if (f_type == 'week') {
        var startweek = req.body.startWeek;
        var endweek = req.body.endWeek;
        var firstand = {$and:[{start_date:{$gte:startweek}},{start_date:{$lte:endweek}}]};
        var secondand = {$and:[{end_date:{$gte:startweek}},{end_date:{$lte:endweek}}]};
        var conditions = {set_up_person: loginuserid, $or:[firstand,secondand]};
      }
      if (f_type == 'month') {
        var currMonthStartDate = req.body.currMonthStartDate;
        var currMonthEndDate = req.body.currMonthEndDate;
        var firstand = {$and:[{start_date:{$gte:currMonthStartDate}},{start_date:{$lte:currMonthEndDate}}]};
        var secondand = {$and:[{end_date:{$gte:currMonthStartDate}},{end_date:{$lte:currMonthEndDate}}]};
        var conditions = {set_up_person: loginuserid, $or:[firstand,secondand]};
      }
      Event.find(conditions).exec(function(err, events) {
        console.log(events);
        res.send({"status_code": "200", "data": events});
      });
  }
  