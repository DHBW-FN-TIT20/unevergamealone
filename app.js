let createError = require('http-errors');
let express = require('express');
let path = require('path');
let cookieParser = require('cookie-parser');
let logger = require('morgan');
const AppDB = require('./database/db');
const UserRepository = require('./database/UserRepository');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const gamingRouter = require('./routes/gaming');

let app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('shared', path.join(__dirname, 'views/shared'));
app.set('gaming', path.join(__dirname, 'views/gaming'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use("/files", express.static(path.join(__dirname, 'files')));

//Configure routes
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/users/sign-up', usersRouter);
app.use('/users/sign-in', usersRouter);
app.use('/gaming', gamingRouter);
app.use('/gaming/steam', gamingRouter);

//Configure database
const db = new AppDB("./database/unevergamealone.sqlite");
const userRepo = new UserRepository(db);
userRepo.createTable();


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