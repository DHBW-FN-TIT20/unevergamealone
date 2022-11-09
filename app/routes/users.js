/**
 * Router and controller for user operations.
 * @module users
 */
let express = require('express');
let router = express.Router();
let userController = require("../controllers/usersController")
const userValidater = require('../handlers/middleware.js');

/**
 * GET of /users/logout
 */
router.get("/logout", userValidater.isLoggedIn, userController.logout)

/**
 * GET of /users/sign-up
 */
router.get('/sign-up', userValidater.isLoggedIn, userController.getSignUp);

/**
 * GET of /users/sign-in
 */
router.get('/sign-in', userValidater.isLoggedIn, userController.getSignIn);

/**
 * POST of /users/sign-up
 */
router.post('/sign-up', /*userValidater.validateRegister,*/ userController.signUp);

/**
 * POST of /users/sign-in
 */
router.post('/sign-in', userController.signIn);

module.exports = router;