const jwt = require("jsonwebtoken");

const validateRegister = (req, res, next) => {
    // username min length 4
    if (!req.body.username || req.body.username.length < 4) {
        return res.status(400).send({
            msg: 'Bitte geben Sie einen Benutzernamen mit mindestens 4 Zeichen ein.'
        })
    }
    // password min 6 chars
    if (!req.body.password || req.body.password.length < 6) {
        return res.status(400).send({
            msg: 'Please enter a password with min. 6 chars'
        });
    }
    // password (repeat) does not match
    if (!req.body.password_repeat ||
        req.body.password != req.body.password_repeat
    ) {
        return res.status(400).send({
            msg: 'Both passwords must match'
        });
    }
    next();
}

let isLoggedIn = (req, res, next) => {
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
        req.userData = decoded;
        next();
    } catch (err) {
        return res.status(401).send({
            msg: 'Your session is not valid!'
        });
    }
}

module.exports.validateRegister = validateRegister;
module.exports.isLoggedIn = isLoggedIn;