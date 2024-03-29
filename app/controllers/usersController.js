/**
 * Controller for all user functions
 * @module usersController
 */
const app = require('../app');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../database/Models/User/User');
const UserPlatform = require('../database/Models/UserPlatform/UserPlatform');
const Token = require('../database/Models/JWT/Token');

module.exports = {
    /**
     * Renders views/sign-in.pug
     * @param {Request} req The req object represents the HTTP request and has properties for the request query string, parameters, body, HTTP headers, and so on
     * @param {Response} res The res object represents the HTTP response that an Express app sends when it gets an HTTP request.
     * @param {*} next Control to the next handler
     * @returns str rendered HTML string
     */
    getSignIn: function(req, res, next) {
        res.render('sign-in', { title: 'Einloggen' });
    },
    /**
     * Gets all platforms and renders views/sign-up.pug
     * @param {Request} req The req object represents the HTTP request and has properties for the request query string, parameters, body, HTTP headers, and so on
     * @param {Response} res The res object represents the HTTP response that an Express app sends when it gets an HTTP request.
     * @param {*} next Control to the next handler
     * @returns str rendered HTML string
     */
    getSignUp: async function(req, res, next) {
        let platforms = await app.platformRepo.selectAll();
        res.render('sign-up', { platforms: platforms, title: "Registrieren" });
    },

    /**
     * POST-Request logout current user
     * @param {Request} req The req object represents the HTTP request and has properties for the request query string, parameters, body, HTTP headers, and so on
     * @param {Response} res The res object represents the HTTP response that an Express app sends when it gets an HTTP request.
     * @param {*} next Control to the next handler
     * @returns Redirect Redirect to /index.html
     */
    logout: async function (req, res, next) {
        const user_token = req.cookies['jwt'];
        const exp = req.userData.exp;
        const token = new Token(user_token, exp);
    
        await app.tokenRepo.insert(token);
    
        return res.redirect(302, '/');
    },

    /**
     * POST-Request create a new user
     * @param {Request} req The req object represents the HTTP request and has properties for the request query string, parameters, body, HTTP headers, and so on
     * @param {Response} res The res object represents the HTTP response that an Express app sends when it gets an HTTP request.
     * @param {*} next Control to the next handler
     * @returns (str|Redirect) JSON with more infos or Redirect to /gaming/ if already logged in
     */
    signUp: async function(req, res, next) {
        let response;
        let salt = bcrypt.genSaltSync(10);
        let hashedPw = bcrypt.hashSync(req.body.password, salt);
        let username = req.body.username;
        let email = req.body.email;
        let os = req.body.os;
        let platforms = await app.platformRepo.selectAll();

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
            await app.userRepo.insert(new User(username, hashedPw, email, os));
            for (const userPlatform of userPlatforms) {
                await app.userPlatformRepo.insert(userPlatform);
            }

            response = res.status(201).json({
                game: username
            });
        } catch (error) {
            console.error(error);

            msg = "";
            status_code = 500;

            if (error.code === "ER_DUP_ENTRY") {
                msg = `Der User ${username} existiert bereits`;
                status_code = 409;
            }

            response = res.status(status_code).json({
                msg: msg
            })

        } finally {
            return response;
        }
    },
    /**
     * POST-Request to sign in
     * @param {Request} req The req object represents the HTTP request and has properties for the request query string, parameters, body, HTTP headers, and so on
     * @param {Response} res The res object represents the HTTP response that an Express app sends when it gets an HTTP request.
     * @param {*} next Control to the next handler
     * @returns (str|Redirect) JSON with more infos or Redirect to /gaming/ if already logged in
     */
    signIn: async function(req, res, next) {
        await app.db.connect();
        const username = req.body.username;
        const password = req.body.password;
        let user = await app.userRepo.selectByUsername(username);
        if (!user) {
            return res.status(401).json({
                msg: "Username oder Passwort ist falsch."
            });
        }
        if (bcrypt.compareSync(password, user.password)) {
            const token = jwt.sign({
                    username: user.username
                },
                process.env.JWT_TOKEN, {
                    expiresIn: '24h'
                }
            );
            res.cookie("jwt", token, { httpOnly: true });
            return res.redirect(302, '/gaming/');
        } else {
            return res.status(401).json({
                msg: "Username oder Passwort ist falsch."
            });
        }
    }
};