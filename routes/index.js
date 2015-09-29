var express = require('express');
var router = express.Router();
var request = require('request');
var async = require('async');
var md = require("node-markdown").Markdown;
var moment = require("moment");

var hbs = require('hbs');
hbs.registerHelper("addClass", function(shouldAdd, value) {
  if(shouldAdd) return value;
  else return "";
});


// Get Stuff from Contentful
var content = require('../content');
content.init();


// GET home page. 
router.get('/', function(req, res, next) {
  res.render('index', { title: "Home", menu: content.menu({}), article: "derp" })
});

// GET Guideline Article
router.get('/:permalink', function (req, res, next) {
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

module.exports = router;
