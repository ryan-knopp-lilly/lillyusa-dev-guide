// Content Model

var http = require("http");
var https = require("https");
var resolver = require('contentful-resolve-response');

// Private 
var _data = {};
var _menu = {};

// Config
var contentfulSpace = 'uq90qnoqk0hl';
var accessToken = '36f8a860f8f397db6c3654f803dd8184553549275d7f5e4bf904be0a6f1537fe';
var refresh = 3600000;

exports.init = function(){
	var options = {
		host: 'US_Proxy_Indy.xh1.lilly.com',
		port: 9000,
		path: '/spaces/' + contentfulSpace + '/entries?access_token=' + accessToken + '&content_type=60PxcHAXoAGkQ6E40WOC2E&include=10',
		method: 'GET', 
		headers: {
			Host: 'cdn.contentful.com'
		}
	};
	
	callback = function(response) {
		var body = ""; 
		response.on('data', function (chunk) {
			body += chunk;
		});
		
		response.on('end', function () {
			console.log("Content Received");
			_data = resolver(JSON.parse(body));
		});
	}
	
	http.request(options, callback).end();
	
	setInterval(function() {
		console.log("Refreshing Content");
  		http.request(options, callback).end();
	}, refresh);
}

exports.raw = function(){
	return _data;
}

exports.menu = function(permalink){
  var menuRoot = [];
  for(var e = 0; e<_data.length; e++){
    var catIndex = -1;
    for(var i=0; i<menuRoot.length; i++){
      if(_data[i].fields.category.fields.categoryName == _data[e].fields.category.fields.categoryName){
        catIndex = i;
        break;
      }
    }
	
	var isActive = false;
	if(_data[e].fields.permalink == permalink) isActive = true;
        
    if(catIndex != -1){
		
		if(menuRoot[catIndex].active == false && isActive)
		{
			menuRoot[catIndex].active = true;
		}
      menuRoot[catIndex].articles.push(
		  {
			  "title" : _data[e].fields.title, 
			  "permalink" : _data[e].fields.permalink,
			  "active" : isActive
		  }
	   );
    }
    else{
		menuRoot.push(
			{
			  "category" : _data[e].fields.category.fields.categoryName, 
			  "articles" : [{"title" : _data[e].fields.title, "permalink" : _data[e].fields.permalink, "active" : isActive}],
			  "active" : isActive
			}
		);
    }
  }
  return menuRoot;
}

exports.article = function(permalink){
	for(var e = 0; e<_data.length; e++){
		if(_data[e].fields.permalink == permalink){
			return _data[e];
		}
	}
	return null;
}

