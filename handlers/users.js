const jwt = require("jsonwebtoken");

const validateRegister = (req, res, next) => {
    // username min length 4
    if (!req.body.username || req.body.username.length < 4) {
        return res.status(400).send({
            msg: 'Bitte geben Sie einen Benutzernamen mit mindestens 4 Zeichen ein.'
        })
    }
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