/**
 * @module app
 */

//require external libraries
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const fs = require("fs");
const logger = require('morgan');
const cookieParser = require('cookie-parser');

/**
 * Class handling sql requests
 * @see /database/db.js
 */
const AppDB = require('./database/db');

//import repositorys
const UserRepository = require('./database/Models/User/UserRepository');
const PlatformRepository = require('./database/Models/Platform/PlatformRepository');
const UserPlatformRepository = require('./database/Models/UserPlatform/UserPlatformRepository');
const GameRepository = require('./database/Models/Game/GameRepository')
const TokenRepository = require('./database/Models/JWT/TokenRepository')

/**
 * Index router
 */
const indexRouter = require('./routes/index');
/**
 * User router
 */
const usersRouter = require('./routes/users');
/**
 * Gaming router
 */
const gamingRouter = require('./routes/gaming');

/**
 * Create express app
 */
const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('shared', path.join(__dirname, 'views/shared'));
app.set('gaming', path.join(__dirname, 'views/gaming'));
app.set('view engine', 'pug');

//external libs setup
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

//configure and require filesystem folder with static files
app.use(express.static(path.join(__dirname, 'public')));

//Configure routes
app.use('/', indexRouter);
app.use("/impressum", indexRouter);
app.use('/users', usersRouter);
app.use('/users/sign-up', usersRouter);
app.use('/users/sign-in', usersRouter);
app.use('/gaming', gamingRouter);
app.use('/gaming/show/:game', gamingRouter);
app.use('/gaming/game/:gamename', gamingRouter);
app.use('/gaming/add', gamingRouter);
app.use('/gaming/new', gamingRouter);

//Configure database
if (!fs.existsSync("./database/unevergamealone.sqlite")) {
    const db = new AppDB("./database/unevergamealone.sqlite");
    const userRepo = new UserRepository(db);
    const platformRepo = new PlatformRepository(db);
    const userPlatformRepo = new UserPlatformRepository(db);
    const gameRepo = new GameRepository(db);
    const tokenRepo = new TokenRepository(db);
    userRepo.createTable();
    userRepo.initialSetup();
    platformRepo.createTable();
    platformRepo.initialSetup();
    userPlatformRepo.createTable();
    userPlatformRepo.initialSetup();
    gameRepo.createGameTable();
    gameRepo.createGameUserMappingTable();
    gameRepo.initialSetup();
    tokenRepo.createTable();
}

const db = new AppDB("./database/unevergamealone.sqlite", { fileMustExist: true });
const userRepo = new UserRepository(db);
const platformRepo = new PlatformRepository(db);
const userPlatformRepo = new UserPlatformRepository(db);
const gameRepo = new GameRepository(db);
const tokenRepo = new TokenRepository(db);



// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
exports.userRepo = userRepo;
exports.platformRepo = platformRepo;
exports.userPlatformRepo = userPlatformRepo;
exports.gameRepo = gameRepo;
exports.tokenRepo = tokenRepo;