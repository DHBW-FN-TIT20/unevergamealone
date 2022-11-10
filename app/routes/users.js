/**
 * Router and controller for user operations.
 * @module users
 */
let express = require('express');
let router = require('express-promise-router')();
let userController = require("../controllers/usersController")
const userValidater = require('../handlers/middleware.js');

/**
 * GET of /users/logout
 */
router.get("/logout", userValidater.isLoggedIn, async function(req, res, next){
    userController.logout(req, res, next);
});

/**
 * GET of /users/sign-up
 */
router.get('/sign-up', userValidater.isLoggedIn, async function(req, res, next){
    userController.getSignUp(req, res, next);
});

/**
 * GET of /users/sign-in
 */
router.get('/sign-in', userValidater.isLoggedIn, userController.getSignIn);

/**
 * POST of /users/sign-up
 */
router.post('/sign-up', async function(req, res, next){
    await userController.signUp(req, res, next);
});

/**
 * POST of /users/sign-in
 */
router.post('/sign-in', async function(req, res, next){
    await userController.signIn(req, res, next);
});

module.exports = router;