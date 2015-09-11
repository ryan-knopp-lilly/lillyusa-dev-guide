var express = require('express');
var router = express.Router();
var contentful = require('contentful');
var request = require('request');
var async = require('async');

// Get Stuff from Contentful
var content = require('../content');
content.init();

// GET home page. 
router.get('/', function(req, res, next) {
  res.render('index', { title: "Home", menu: buildMenu(), article: "derp" })
});

// GET Guideline Article
router.get('/:permalink', function (req, res, next) {
  console.log(req.params.permalink);
  var reqArticle = -1;
  for(var i=0; i<allContent.article.length; i++){
    if(allContent.article[i].permalink == req.params.permalink){
      reqArticle = i;
      break;
    }
  }
  if(reqArticle != -1){
    res.render('index', { title: 'derp', menu: buildMenu(), article: "derp" })
  }
  else{
    res.render('error');
  }
  
});

// Retrieve Content
function buildMenu(){ 
  var menu = {};
  console.log(content.get());
  content.get().items.forEach(function(entry) {
    var catIndex = -1;
    for(var i=0; i<menu.length; i++){
      if(menu[i].category == entry.fields.category.fields.categoryName){
        catIndex = i;
        break;
      }
    }
        
    if(catIndex != -1){
      menu[catIndex].articles.push({"title" : entry.fields.title, "permalink" : entry.fields.permalink});
    }
    else{
      menu.push({"category" : entry.fields.category, "articles" : [{"title" : entry.fields.title, "permalink" : entry.fields.permalink}]});
    }
  });
  return menu;
}
 

module.exports = router;
