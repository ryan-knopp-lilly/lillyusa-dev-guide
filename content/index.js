// Content

var http = require("http");
var https = require("https");
var proxy = process.env.HTTP_PROXY;


var data = {};
var contentfulSpace = 'uq90qnoqk0hl';
var accessToken = '36f8a860f8f397db6c3654f803dd8184553549275d7f5e4bf904be0a6f1537fe';
var refresh = 3600000;

exports.init = function(){
	var options = {
		host: 'cdn.contentful.com',
		path: '/spaces/' + contentfulSpace + '/entries?access_token=' + accessToken + '&content_type=60PxcHAXoAGkQ6E40WOC2E&include=10',
		method: 'GET'
	};
	
	var body = ""; 
	
	callback = function(response) {
		response.on('data', function (chunk) {
			body += chunk;
		});
		
		response.on('end', function () {
			console.log("Content Received");
			console.log(body);
			data = JSON.parse(body);
		});
	}
	
	http.request(options, callback).end();
	
	setInterval(function() {
		console.log("Refreshing Content");
  		http.request(options, callback).end();
	}, refresh);
}

exports.get = function(){
	return data;
}

