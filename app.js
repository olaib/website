var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

const PORT = process.env.PORT || '3000';

var indexRouter = require('./routes/index');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// enable database session store
var Sequelize = require('sequelize')
var session = require('express-session');
const bodyParser = require("body-parser");
var SequelizeStore = require('connect-session-sequelize')(session.Store);

var sequelize = new Sequelize({
    "dialect": "sqlite",
    "storage": "./session.sqlite"
});


var myStore = new SequelizeStore({
    db: sequelize
})


// enable sessions
app.use(session({
    secret: "somesecretkey",
    store: myStore,
    resave: false, // Force save of session for each request
    saveUninitialized: false, // Save a session that is new, but has not been modified
    cookie: {maxAge: 10 * 60 * 1000} // milliseconds!
}));

myStore.sync();
app.use('/', indexRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    if (err.status === 404) {
        res.render('404');
        return;
    }
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

module.exports = app;
