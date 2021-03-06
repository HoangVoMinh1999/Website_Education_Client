require('dotenv').config()
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var hbs = require('express-handlebars')
var bcryptjs = require('bcryptjs')
var hbs_loop = require('handlebars-loop')
const hbs_sections = require("express-handlebars-sections");
const session = require('express-session');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.engine('hbs',hbs(
  {extname:'hbs',
  defaultLayout:'Default_Layout',
  layoutDir:__dirname+'/views/layouts/',  
  helpers: {section: hbs_sections()
  }}))
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(express.static('public'))

//--- Config Session
app.set('trust proxy', 1);
app.use(session({
  secret: 'SECRET_KEY',
  resave: false,
  saveUninitialized: true,
  cookie: {
   // secure: true
  }
}));

app.use(async function(req,res,next){
  if (req.session.IsAuth === true){
    res.locals.IsAuth = req.session.IsAuth;
    res.locals.Account = req.session.Account;
  }
  next()
})

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

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
