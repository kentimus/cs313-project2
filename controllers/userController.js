const passwordHash = require('password-hash');
const userModel = require("../models/userModel.js");

function addNewUser(req, res){
    const username = req.query.username;
    const password = req.query.password;
    const email    = req.query.email;
    const hashedPassword = passwordHash.generate(password);
    userModel.addUserToDb(username, hashedPassword, email, function(err, result){
        if(err){ console.log(err); }
        
        let sendBack = {
          'success' : true,
          'username' : username
        };
        req.session.username = username;
        
        res.status(200).json(sendBack);
    });
}

function signIn(req, res){
    const username = req.query.username;
    const password = req.query.password; 
    userModel.getUser(username, function(err, result){
        let sendBack = {
          'success' : true,
          'username' : username
        };
        
        if(result.length == 0){
            sendBack.success = false;
            sendBack.message = "user not found";
        } else {
            const dbPass = result[0].password;
            if(!passwordHash.verify(password, dbPass)){
                sendBack.success = false;
                sendBack.message = "incorrect password";
            }
        }
        req.session.userid = result[0].id;
        req.session.username = username;
        res.status(200).json(sendBack);
    });
}

function signOut(req, res){
    req.session.destroy();
    res.end("logged out");
}
  



module.exports = {
    addNewUser : addNewUser,
    signIn     : signIn,
    signOut    : signOut
}