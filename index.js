require('dotenv').config();
const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 5000
const connectionString = process.env.DATABASE_URL;
const { Pool } = require('pg')
const pool = new Pool({connectionString: connectionString});
const passwordHash = require('password-hash');
const session = require('client-sessions');

express()
  .use(express.static(path.join(__dirname, 'public')))
  .use(session({
    cookieName: 'session',
    secret: 'random_string_goes_here',
    duration: 180 * 60 * 1000,
    activeDuration: 30 * 60 * 1000,
  }))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .get('/', (req, res) => res.render('pages/index'))
  .get('/view/:username', function(req, res){
    getWishlist(req.params.username, function(err, items){
       if(err){
            // do some error stuff here
        } else {
            var params = {
                error    : null,
                items    : items,
                wishlistUser : req.params.username
            }   
        }
        res.render('pages/view',params);
       });     
  })
  .get('/add-new-user', function(req, res){
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
  })
  .get('/sign-in', function(req, res){
    const username = req.query.username;
    const password = req.query.password; 
    getUser(username, function(err, result){
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
        res.status(200).json(sendBack);
    });
  })
  .listen(PORT, () => console.log(`Listening on ${ PORT }`))



function addUserToDb(username, password, email, callback){
    var sql = "INSERT INTO users (username, password, email) VALUES ($1, $2, $3)";
    var params = [username, password, email];
    pool.query(sql, params, function(err, result){
        if(err){ console.log(err); }
        callback(null, result.rows);
    });
}
function getUser(username, callback){
    var sql = "SELECT * FROM users WHERE username = $1";
    var params = [username];
    pool.query(sql, params, function(err, result){
        if(err){ console.log(err); }
        callback(null, result.rows);
    });
}
function getWishlist(username, callback){
    // this function will eventually get items from the database.
    // for now, just sends back dummy data
    let items = {
        "items" : [
            { 
                "name" : "kayak1",
                'price' : '$199.99',
                'url'   : 'https://walmart.com',
                'thumb' : 'https://kentroper.com/eraseme/kayak.jpg'
            },
            { 
                "name" : "kayak2",
                'price' : '$299.99',
                'url'   : 'https://walmart.com',
                'thumb' : 'https://kentroper.com/eraseme/kayak.jpg'
            },
            { 
                "name" : "kayak3",
                'price' : '$399.99',
                'url'   : 'https://walmart.com',
                'thumb' : 'https://kentroper.com/eraseme/kayak.jpg'
            }
        ]
    };
    callback(null, items);
}