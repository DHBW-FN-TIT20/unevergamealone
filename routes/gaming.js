let express = require('express');
let router = express.Router();
const app = require('../app')
const bcrypt = require('bcryptjs');
const uuid = require('uuid');
const jwt = require('jsonwebtoken');
const User = require('../database/User');
const userValidater = require('../handlers/users.js');

router.get('/', userValidater.isLoggedIn, (req, res, next) => {
    console.log(req.userData);
    res.sendFile("platforms.html", { root: __dirname + "/../public/gaming" });
});

router.get('/steam', userValidater.isLoggedIn, (req, res, next) => {
    return res.render('games', { title: 'Steam' });
});

module.exports = router;