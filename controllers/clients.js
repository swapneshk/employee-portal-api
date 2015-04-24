var Client = require("mongoose").model("Client");

  // Create Client For An _id[Manager + Admin]
  exports.createClient = function( req, res, next ) {
    console.log("--CREATE CLIENT--");
    var clientData = req.body;

    Client.create(clientData, function(err, client) {
      if (!err) {      
        console.log(client);
        res.send(client);      
      }
      else{
        res.send({ reason: err.toString() });      
      }
    });

  };  
  
  // Fetch ALL Clients For An _id[Manager]
  exports.getManagerClients = function( req, res ) {
    console.log("--FIND MANAGER CLIENTS--");
    var userID = req.body.manager_id;    
    console.log(req.body);
    if (userID) {      
      Client.find({created_by: userID ,$or:[{is_deleted:{$exists:false}},{is_deleted:false}]}, null, {sort: {created_date: -1}}, function(err, clients) {
        console.log(clients);
        res.send({"status_code": "200", "data": clients});
      });
    }
  };
  
  // Fetch ALL Clients For An _id[Admin]
  exports.getAllClients = function( req, res ) {
    console.log("--FIND ADMIN CLIENTS---");   
    
    Client.find({$or:[{is_deleted:{$exists:false}},{is_deleted:false}]}, null, {sort: {created_date: -1}}, function(err, clients){
      console.log(clients);
      res.send({"status_code": "200", "data": clients});
    });
  };  

  // Update Client For An _id
  exports.updateClient = function( req, res ) {
    console.log("--UPDATE CLIENT--");
    var clientData = req.body;
    
    Client.findOneAndUpdate({_id: req.body._id}, clientData, function(err, client){
      if (err) {
        res.send({"message": "Something went wrong!", "err": err, "status_code": "500"});
      }
      else {
        res.send({"message": "success", "data": client, "status_code": "200"});
      }
    });

    /*
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
    */
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

  exports.delclients=function(req,res){
      console.log("---delete clients---");
      console.log(req.body.clientid);
      var clientid = req.body.clientid;
      Client.update({_id:clientid},{$set:{is_deleted:true}},{},function(err,response){
        if(err){
              res.json({"message": "error", "data": err, "status_code": "500"});
              }
        else{
              res.json({"message": "success", "data": response, "status_code": "200"});
            }
      });

}

// delmanagerclients
exports.delmanagerclients=function(req,res){
  console.log("---delete clients---");
      console.log(req.body.clientid);
      var clientid = req.body.clientid;
      Client.update({_id:clientid},{$set:{is_deleted:true}},{},function(err,response){
        if(err){
              res.json({"message": "error", "data": err, "status_code": "500"});
              }
        else{
              res.json({"message": "success", "data": response, "status_code": "200"});
            }
      });

}

  // Remove Client By An _id - COMMENTED FOR THE TIME BEING by @Swapnesh on @05-08-2014
  /*
  exports.removeClient = function( req, res ) {
    console.log("--REMOVE CLIENT--");
    
    Client.findById(req.body._id, function(err, client){
      if (err) {
        res.send({"message": "Something went wrong!", "err": err, "status_code": "500"});
      }
      else{
        client.is_active = false;
        client.save(function(err){
          if (err) return handleError(err);
          else return res.send({"message": "success", "data": client, "status_code": "200"});
        });
      }
    });      
  };
  */