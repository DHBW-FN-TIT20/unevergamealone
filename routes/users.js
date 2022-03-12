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


//User sign-up
router.post('/sign-up', userValidater.validateRegister, userController.signUp);

router.get('/sign-up', userController.getSignUp);

router.get('/sign-in', userController.getSignIn);

router.post('/sign-in', userController.signIn);

module.exports = router;