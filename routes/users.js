/**
 * @module users
 * @description Router and controller for user operations.
 */
let express = require('express');
let router = express.Router();
const app = require('../app')
const bcrypt = require('bcryptjs');
const uuid = require('uuid');
const jwt = require('jsonwebtoken');
const User = require('../database/Models/User/User');
const UserPlatform = require('../database/Models/UserPlatform/UserPlatform');
const userValidater = require('../handlers/users.js');
const Token = require('../database/Models/JWT/Token');

//User sign-up
router.post('/sign-up', userValidater.validateRegister, (req, res, next) => {
    let salt = bcrypt.genSaltSync(10);
    let hashedPw = bcrypt.hashSync(req.body.password, salt);
    let username = req.body.username;
    let email = req.body.email;
    let os = req.body.os;
    let platforms = app.platformRepo.selectAll();

    //get all checked platforms with username
    let userPlatforms = [];
    for (let i = 0; i <= platforms.length; i++) {
        if (req.body[i] == 'on') {
            let userPlatform = new UserPlatform(username, req.body[i + "_uName"], i);
            userPlatforms.push(userPlatform);
        }
    }
    //add userdata to db
    app.userRepo.insert(new User(username, hashedPw, email, os));
    for (const userPlatform of userPlatforms) {
        app.userPlatformRepo.insert(userPlatform);
    }
    return res.redirect("/users/sign-in");
});

router.get('/sign-up', userValidater.isLoggedIn, function (req, res, next) {
    let platforms = app.platformRepo.selectAll();
    res.render('sign-up', { platforms: platforms });
});

router.get('/sign-in', userValidater.isLoggedIn, function (req, res, next) {
    res.render('sign-in', { title: 'Einloggen' });
});

//User log-in
router.post('/sign-in', (req, res, next) => {
    const username = req.body.username;
    const password = req.body.password;
    let user = app.userRepo.selectByUsername(username);
    if (!user) {
        return res.send("Username oder Passwort sind falsch.");
    }
    if (bcrypt.compareSync(password, user.password)) {
        const token = jwt.sign({
            username: user.username
        },
            'SECRETKEY', {
            expiresIn: '24h'
        }
        );
        res.cookie("jwt", token, { httpOnly: true });
        return res.redirect(302, '/gaming/');
    }
});

// User Logout
router.post("/logout", userValidater.isLoggedIn, (req, res, next) => {
    const user_token = req.cookies['jwt'];
    const exp = req.userData.exp;
    const token = new Token(user_token, exp);

    app.tokenRepo.insert(token);

    return res.redirect(302, '/');
})

module.exports = router;