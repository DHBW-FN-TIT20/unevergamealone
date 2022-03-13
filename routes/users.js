/**
 * @module users
 * @description Router and controller for user operations.
 */
let express = require('express');
let router = express.Router();
let userController = require("../controllers/usersController")
const app = require('../app')
const bcrypt = require('bcryptjs');
const uuid = require('uuid');
const jwt = require('jsonwebtoken');
const User = require('../database/Models/User/User');
const UserPlatform = require('../database/Models/UserPlatform/UserPlatform');
const userValidater = require('../handlers/middleware.js');
const Token = require('../database/Models/JWT/Token');


//User sign-up
router.post('/sign-up', /*userValidater.validateRegister,*/ userController.signUp);

router.get('/sign-up', userValidater.isLoggedIn, userController.getSignUp);

router.get('/sign-in', userValidater.isLoggedIn, userController.getSignIn);

router.post('/sign-in', userController.signIn);

// User Logout
router.get("/logout", userValidater.isLoggedIn, (req, res, next) => {
    const user_token = req.cookies['jwt'];
    const exp = req.userData.exp;
    const token = new Token(user_token, exp);

    app.tokenRepo.insert(token);

    return res.redirect(302, '/');
})

module.exports = router;