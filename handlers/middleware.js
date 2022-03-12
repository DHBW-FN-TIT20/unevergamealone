const jwt = require("jsonwebtoken");
const app = require('../app')
const Token = require('../database/Models/JWT/Token');


const validateRegister = (req, res, next) => {
    // username min length 4
    if (!req.body.username || req.body.username.length < 4) {
        return res.status(400).send({
            msg: 'Bitte geben Sie einen Benutzernamen mit mindestens 4 Zeichen ein.'
        })
    }

    //Passwort muss zwischen 6 und 20 Zeichen lang sein
    //Muss eins folgender Sonderzeichen enthalten !#,+-?_
    //Muss eine Zahl enthalten
    if (req.body.password.length < 8) {
        return res.status(400).send({
            msg: 'Das Passwort muss mindestens 8 Zeichen lang sein.'
        })
    }

    // password (repeat) does not match
    if (!req.body.password_repeat ||
        req.body.password != req.body.password_repeat
    ) {
        return res.status(400).send({
            msg: 'Die Passwörter stimmen nicht überein.'
        });
    }
    next();
}

/**
 * Check if the User is Logged in an save it to req.userData
 * 
 * Redirect to the sign-in if the Token is invalid
 * or if you call the sign-in or sign-up you get redirected
 * to the /gaming
 * @param {Request} req 
 * @param {Response} res 
 * @param {callback} next 
 */
let isLoggedIn = (req, res, next) => {
    const sign_in_or_sign_up = req.path.includes("sign-in") || req.path.includes("sign-up");
    try {
        let token = req.cookies['jwt'];
        if (token.startsWith('Bearer ')) {
            // Remove Bearer from string
            token = token.slice(7, token.length);
        }
        // const token = res.getHeader("jwt");
        const decoded = jwt.verify(
            token,
            'SECRETKEY'
        );

        const invalid = app.tokenRepo.selectToken(new Token(token, decoded.exp));

        req.userData = decoded;
        if (sign_in_or_sign_up && invalid === undefined) {
            return res.redirect('/gaming');
        }
        next();
    } catch (err) {
        if (sign_in_or_sign_up) {
            next();
        }
        return res.status(401).redirect('/users/sign-in');
    }
}

module.exports.validateRegister = validateRegister;
module.exports.isLoggedIn = isLoggedIn;