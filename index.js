require('dotenv').config();
const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 5000
const session = require('client-sessions');
const pagesController    = require("./controllers/pagesController");
const userController     = require("./controllers/userController");
const wishlistController = require("./controllers/wishlistController");
const searchController   = require("./controllers/searchController");

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
  .get('/', pagesController.showHomePage)
  .get('/view/:username', wishlistController.viewWishlist)
  .get('/add-new-user', userController.addNewUser)
  .get('/add-to-wishlist', wishlistController.addToWishlist)
  .get('/sign-in', userController.signIn)
  .get('/sign-out', userController.signOut)
  .get('/amazon', searchController.amazon)
  .get('/remove', wishlistController.remove)
  .listen(PORT, () => console.log(`Listening on ${ PORT }`))