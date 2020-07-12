var createError = require('http-errors');
var express = require('express');
var path = require('path');
var logger = require('morgan');

var echoRouter = require('./routes/echo');
var fibRouter = require('./routes/fib');
var delayRouter = require('./routes/delay');
var healthRouter = require('./routes/health');

var app = express();

const basePath = process.env.BASE_PATH || "/"

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(basePath, healthRouter);
app.use(basePath, echoRouter);
app.use(basePath, fibRouter);
app.use(basePath, delayRouter);

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
  console.error(err)
  res.send('error');
});

module.exports = app;
