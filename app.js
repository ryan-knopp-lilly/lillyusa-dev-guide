var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var request = require('request');
var async = require('async');
var md = require("node-markdown").Markdown;
var moment = require("moment");

var hbs = require('hbs');
hbs.registerHelper("addClass", function(shouldAdd, value) {
  if(shouldAdd) return value;
  else return "";
});


var app = express();

// view engine setup
app.listen(process.env.PORT || 5000, function() {
  console.log("listening on " + app.get('port'));
});

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


// Get Stuff from Contentful
var content = require('./content');
content.init();


// GET home page. 
app.get('/', function(req, res, next) {
  res.render('index', { title: "Home", menu: content.menu({}), article: "derp" })
});

// GET Search
app.get('/search', function(req, res, next) {
  res.setHeader('Content-Type', 'application/json');
  res.send(JSON.stringify(content.menu({})));
});

// GET Guideline Article
app.get('/:permalink', function (req, res, next) {
  var articleContent = content.article(req.params.permalink);
  res.render(
    'article', 
    { 
      title: articleContent.fields.title, 
      menu: content.menu(req.params.permalink), 
      article: md(articleContent.fields.body),
      revised: moment(articleContent.sys.updatedAt).format("MMMM Do YYYY, h:mm:ss a")
    });
});



// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
