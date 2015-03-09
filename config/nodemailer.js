var nodemailer = require("nodemailer");

// create reusable transport method (opens pool of SMTP connections)
var transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: 'testteam.e37@gmail.com',
        pass: 'testing@2012'
    }
});

module.exports = function(email, password, callBack){

// setup e-mail data with unicode symbols
var mailOptions = {
    from: "Test Team | <testteam.e37@gmail.com>", // sender address
    to: email, // list of receivers
    subject: "Hello Swapnesh", // Subject line
    text: "Hello world", // plaintext body
    html: "<b>Hello world</b>" // html body
}

// send mail with defined transport object
smtpTransport.sendMail(mailOptions, function(error, response){
    if(error){
        console.log(error);
        callBack(error);
    }else{
        console.log("Message sent: " + response.message);
    }

    // if you don't want to use this transport object anymore, uncomment following line
    //smtpTransport.close(); // shut down the connection pool, no more messages
});

callBack(null);
}