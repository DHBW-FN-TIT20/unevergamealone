/**
 * @module usersController
 */
const app = require('../app')
const bcrypt = require('bcryptjs');
const uuid = require('uuid');
const jwt = require('jsonwebtoken');
const User = require('../database/Models/User/User');
const UserPlatform = require('../database/Models/UserPlatform/UserPlatform');
const userValidater = require('../handlers/middleware.js');

module.exports = {
    /**
     * Renders views/sign-in.pug
     * @param {*} req the request
     * @param {*} res the response
     * @param {*} next next function
     */
    getSignIn: function(req, res, next) {
        res.render('sign-in', { title: 'Einloggen' });
    },
    /**
     * Gets all platforms and renders views/sign-up.pug
     * @param {*} req the request
     * @param {*} res the response
     * @param {*} next next function
     */
    getSignUp: function(req, res, next) {
        let platforms = app.platformRepo.selectAll();
        res.render('sign-up', { platforms: platforms });
    },
    signUp: function(req, res, next) {
        let response;
        let salt = bcrypt.genSaltSync(10);
        let hashedPw = bcrypt.hashSync(req.body.password, salt);
        let username = req.body.username;
        let email = req.body.email;
        let os = req.body.os;
        let platforms = app.platformRepo.selectAll();

        try {
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

            response = res.status(201).json({
                status: "success",
                game: username
            });
        } catch (error) {
            console.error(error);
            response = res.status(400).json({
                status: "error",
                msg: JSON.stringify(error)
            })
        } finally {
            return response;
        }
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