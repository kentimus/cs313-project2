function showHomePage(req, res){
    let params = { username : null };
    if(req.session.username){
        params = {
            username : req.session.username
        }
    } 
    res.render('pages/index', params);
}

module.exports = {
    showHomePage : showHomePage
}