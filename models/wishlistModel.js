const connectionString = process.env.DATABASE_URL;
const { Pool } = require('pg')
const pool = new Pool({connectionString: connectionString});


function addItem(userid, name, price, url, thumb, callback){
    var sql = "INSERT INTO wishlist (user_id, name, price, url, thumb) VALUES ($1, $2, $3, $4, $5)";
    var params = [userid, name, price, url, thumb];
    pool.query(sql, params, function(err, result){
        if(err){ console.log(err); }
        callback(null, result.rows);
    });
}
function getWishlist(user_id, callback){
    var sql = "SELECT * FROM wishlist WHERE user_id = $1";
    var params = [user_id];
    pool.query(sql, params, function(err, result){
        if(err){ console.log(err); }
        callback(null, result.rows);
    });
}

function deleteItem(id, userid, callback){
    let sql = "DELETE FROM wishlist WHERE id = $1 AND user_id = $2";
    let params = [id, userid];
    pool.query(sql, params, function(err, result){
       if(err){ console.log(err); }
        callback(null, result);
    });
}

module.exports = {
    addItem     : addItem,
    getWishlist : getWishlist,
    deleteItem  : deleteItem
}