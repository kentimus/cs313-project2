const wishlistModel = require("../models/wishlistModel.js");
const userModel = require("../models/userModel.js");

function viewWishlist(req, res){
    if(req.params.username){
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
}

function addToWishlist(req, res){
    if(req.session.username != null){
        userModel.getUser(req.session.username, function(err, result){
            let itemName = req.query.name.substring(0,99);
            wishlistModel.addItem(result[0].id, itemName, req.query.price, req.query.url, req.query.thumb, function(){
                res.end("item added!"); 
            });
        });
    }
}

function remove(req, res){
    let id = req.query.id;
    let userid = req.session.userid;
    wishlistModel.deleteItem(id, userid, function(err, result){
        if(result.rowCount > 0){
            res.status(200).json({ 'success' : true });   
        } else {
            res.status(200).json({ 'success' : false });
        }
    });
}

module.exports = {
    viewWishlist : viewWishlist,
    addToWishlist : addToWishlist,
    remove        : remove
}