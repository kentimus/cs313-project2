require('dotenv').config();
const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 5000
const passwordHash = require('password-hash');
const session = require('client-sessions');
const userController = require("./controllers/userController");
const userModel = require("./models/userModel.js");
const wishlistModel = require("./models/wishlistModel.js");
const amazon = require('amazon-product-api');
const client = amazon.createClient({
  awsId: "W7JRL+kAxQv6gkc/jTjX0eo6IWFnGAbvBcUR+/Ss",
  awsSecret: process.env.AWS_SECRET,
  awsTag: "itscheese-20"
});

express()
  .use(express.static(path.join(__dirname, 'public')))
  .use(session({
    cookieName: 'session',
    secret: 'supersecretsessionstringthatyoullneverguess',
    duration: 180 * 60 * 1000,
    activeDuration: 30 * 60 * 1000,
  }))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .get('/', function(req, res){
    let params = { username : null };
    if(req.session.username){
        params = {
            username : req.session.username
        }
    } 
    res.render('pages/index', params);
  })
  .get('/view/:username', function(req, res){
    console.log("37!");
    if(req.params.username){
        console.log(req.params.username);
        userModel.getUser(req.params.username, function(err, result){
            if(result[0]){
                wishlistModel.getWishlist(result[0].id, function(err, items){
                   if(err){
                        // do some error stuff here
                    } else {
                        var params = {
                            username : req.session.username,
                            error    : null,
                            items    : items,
                            wishlistUser : req.params.username
                        }
                    }
                    res.render('pages/view',params);
                   }); 
            } else {
                var params = {
                    username : req.session.username,
                    error    : "cannot find user " + req.params.username,
                    items    : null,
                    wishlistUser : req.params.username
                }
                res.render('pages/view',params);
            }  
        });   
    }
  })
  .get('/add-new-user', function(req, res){
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
    
  })
  .get('/add-to-wishlist', function(req, res){
    if(req.session.username != null){
        userModel.getUser(req.session.username, function(err, result){
            let itemName = req.query.name.substring(0,99);
            wishlistModel.addItem(result[0].id, itemName, req.query.price, req.query.url, req.query.thumb, function(){
                res.end("item added!"); 
            });
        });
    }
  })
  .get('/sign-in', function(req, res){
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
        req.session.username = username;
        res.status(200).json(sendBack);
    });
  })
  .get('/sign-out', function(req, res){
    console.log("93");
    req.session.username=null;
    res.end("logged out");
  })
  .get('/amazon', function(req, res){
    const keywords = req.query.keywords;
    client.itemSearch({
        keywords : keywords,
        responseGroup: 'ItemAttributes,Images'
    }, function(err, results, response) {
      if (err) {
        console.log(err);
      } else {
        res.status(200).json(results);
      }
    });
  })
  .listen(PORT, () => console.log(`Listening on ${ PORT }`))

