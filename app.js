//requiring all the needed modules
var createError = require('http-errors');
const sequelize = require("./models").sequelize;
const port = 3000;
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var bodyParser = require('body-parser')
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
//creating app.use for logger
app.use(logger('dev'));
//creating app.use for express
app.use(express.json());
//creating app.use for bodyparser
app.use(bodyParser.urlencoded({ extended: false }));
//creating app.use for cookieParser
app.use(cookieParser());
//creating app.use for the static pages 
app.use('/static',express.static(path.join(__dirname, 'public')));

//creating app.use for both index and user routes
app.use('/', indexRouter);
app.use('/users', usersRouter);
////creating app.use for 404 error 
app.use((req, res, next) => {
  next(createError(404));
});

// error handler for dev and production
app.use((err, req, res, next) => {
  
  res.locals.message = err.message;
  res.locals.error = err ;

  // rendering the error page
  if(err.status === 404){
    res.render('page-not-found')
  }else{
    res.status(500);
    res.render('error');
    console.log(err);
  }
});

//Adding port, listen's on port 3000

sequelize.sync().then(() => {
    app.listen(port, () => {
      console.log(`application running on port ${port}`);
    });
  });

  //exporting app
module.exports = app;