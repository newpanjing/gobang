var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var bodyParser = require('body-parser');

var cookieParser = require('cookie-parser');
var session = require('express-session');


var config = require('./core/common/config');

var RedisStore = require('connect-redis')(session);

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


app.locals.config = config;

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));


app.use(cookieParser('123'));
app.use(session({
    store: new RedisStore({
        "host": config.redis.host,
        "port": config.redis.port,
        "db": 0,
        "ttl": 3600,
        "logErrors": true
    }),
    secret: '123',//与cookieParser中的一致
    resave: true,
    saveUninitialized: true
}));


var index = require('./routes/index');
app.use('/', index);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});


module.exports = app;
