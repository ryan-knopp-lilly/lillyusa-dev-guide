var express = require('express');
var router = express.Router();
var contentful = require('contentful');
var request = require('request');
var async = require('async');

var client = contentful.createClient({
  space: 'uq90qnoqk0hl',
  accessToken: '36f8a860f8f397db6c3654f803dd8184553549275d7f5e4bf904be0a6f1537fe'
});

// Friendlier names for Content Type id's
var ContentTypes = {
  Category: '1Mr5wIjjAgSgsw88iKeGca',
  Article:  '60PxcHAXoAGkQ6E40WOC2E',
};

var allContent = buildContent();

// GET home page. 
router.get('/', function(req, res, next) {
  res.render('index', { title: "Home", menu: allContent.menu, article: "derp" })
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
    res.render('index', { title: allContent.article[reqArticle].title, menu: allContent.menu, article: "derp" })
  }
  else{
    res.render('error');
  }
  
});

// Retrieve Content
function buildContent(){ 
  var content = {
    "menu" : [],
    "article" : []
  };

  client.entries({ content_type: ContentTypes.Article }).then(
    function(response){

      response.forEach(function(entry) {
        //var catIndex = content.menu.indexOf(entry.fields.category.fields.categoryName);
        
        var catIndex = -1;
        for(var i=0; i<content.menu.length; i++){
          if(content.menu[i].category == entry.fields.category.fields.categoryName){
            catIndex = i;
            break;
          }
        }
        
        if(catIndex != -1){
          content.menu[catIndex].articles.push({"title" : entry.fields.title, "permalink" : entry.fields.permalink});
        }
        else{
          content.menu.push({"category" : entry.fields.category.fields.categoryName, "articles" : [{"title" : entry.fields.title, "permalink" : entry.fields.permalink}]});
        }
        content.article.push(
          {
            "title" : entry.fields.title,
            "category" : entry.fields.category,
            "permalink" : entry.fields.permalink,
            "body" : entry.fields.body
          }
        );
      }, this);
      return content;
      
    }
  );
  
  return content;
}

module.exports = router;
