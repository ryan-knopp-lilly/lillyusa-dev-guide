var express = require('express');
var router = express.Router();
var contentful = require('contentful');
var request = require('request');

var client = contentful.createClient({
  space: 'uq90qnoqk0hl',
  accessToken: '36f8a860f8f397db6c3654f803dd8184553549275d7f5e4bf904be0a6f1537fe'
});

// Friendlier names for Content Type id's
var ContentTypes = {
  Category: '1Mr5wIjjAgSgsw88iKeGca',
  Article:  '60PxcHAXoAGkQ6E40WOC2E',
};

// GET home page. 
router.get('/', function(req, res, next) {
  retrieveMenu();
  console.log(client.space());
  res.render('index', { title: "Herp" });
});

// GET Guideline Article




// Retrieve Menu
function retrieveMenu () {
  return client.entries({ content_type: ContentTypes.Category }).then(function (categories) {
    console.log("I made it");
    var menuItems = categories.map(function (category) {
      return category;
    }).join('');
  });
}

module.exports = router;
