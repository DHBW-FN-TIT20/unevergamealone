const app = require('../app')
const bcrypt = require('bcryptjs');
const uuid = require('uuid');
const jwt = require('jsonwebtoken');
const User = require('../database/Models/User/User');
const UserPlatform = require('../database/Models/UserPlatform/UserPlatform');
const userValidater = require('../handlers/users.js');

module.exports = {
    getLogin: function(req, res, next) {
        res.render('sign-in', { title: 'Einloggen' });
    },
    getSignUp: function(req, res, next) {
        let platforms = app.platformRepo.selectAll();
        res.render('sign-up', { platforms: platforms });
    },
    signUp: function(req, res, next) {
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
    },
    signIn: function(req, res, next) {
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
    }
};