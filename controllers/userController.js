function addNewUser(req, res){
    const username = req.query.username;
    const password = req.query.password;
    const email    = req.query.email;
    const hashedPassword = passwordHash.generate(password);
    addUserToDb(username, hashedPassword, email, function(err, result){
        if(err){ console.log(err); }
        
        let sendBack = {
          'success' : true,
          'username' : username
        };
        res.status(200).json(sendBack);
    });
}

module.exports = {
    
}