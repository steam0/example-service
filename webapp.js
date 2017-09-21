/* Web server */
var express = require('express');
var cors = require('cors');
var app = express();
var requestClient = require('request');
app.use(cors());

var server = app.listen(3000, function() {
	var host = server.address().address;
  	var port = server.address().port;

	console.log('Server is listening at http://%s:%s', host, port);
});

// API

app.get('/test', function (request, response) {
	console.log("Header input");
	console.log(request.headers);
	//console.log(request.query);

	authorize(request, response, function (err, res, body) {
			console.log("Yes");
			console.log(err);
			console.log(body);
			/*var body = {
				"working": "yes",
				"testing": "no"
			}*/
			response.set('Content-Type', 'application/json');
			return response.send(body);
	});
});


function authorize(request, response, callback) {
	var options = {
		url: 'http://10.0.1.7:8000/auth/authorize',
		method: 'GET',
		headers: {
			'Authorization': request.headers.authorization
		}
	};

	console.log("Header output");
	console.log(options.headers);

	requestClient(options, function(err, res, body) {
		 if (res && (res.statusCode === 200 || res.statusCode === 201)) {
			 callback(err, res, body);
		 } else {
			 console.log("Access denied:" + res.statusCode);
			 response.statusCode = 500
			 response.body = body;
			 return response.end();
		 }
	 });

}
