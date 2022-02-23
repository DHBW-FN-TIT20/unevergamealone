let express = require('express');
let router = express.Router();
const app = require('../app')
const bcrypt = require('bcryptjs');
const uuid = require('uuid');
const jwt = require('jsonwebtoken');
const User = require('../database/User');
const userValidater = require('../handlers/users.js');

/* GET users listing. */
router.get('/', function(req, res, next) {
    res.send('respond with a resource');
});

//User sign-up
router.post('/sign-up', userValidater.validateRegister, (req, res, next) => {

});

router.get('/sign-up', function(req, res, next) {
    let salt = bcrypt.genSaltSync(10);
    let hashedPw = bcrypt.hashSync("Sesam1234!", salt);
    app.userRepo.insert(new User("Floqueboque", hashedPw));
    res.render('sign-up', { title: 'Registrieren' });
});

router.get('/sign-in', function(req, res, next) {

    let user = app.userRepo.selectByUsername("Floqueboque");
    res.render('sign-in', { title: 'Einloggen', user: user.username });
});

//User log-in
router.post('/sign-in', (req, res, next) => {
    const username = req.body.username;
    const password = req.body.password;
    let user = app.userRepo.selectByUsername(username);
    if (!user) {
        return res.send(alert("Username oder Passwort sind falsch."));
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

module.exports = router;