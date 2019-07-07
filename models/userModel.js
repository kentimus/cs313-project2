const connectionString = process.env.DATABASE_URL;
const { Pool } = require('pg')
const pool = new Pool({connectionString: connectionString});

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

module.exports = {
    addUserToDb : addUserToDb,
    getUser : getUser
}