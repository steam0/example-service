/* Web server */
var express = require('express');
var cors = require('cors');
var teslajs = require('teslajs')
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
	console.log(request);
	authorize(request, response, function (err, res, body) {
			console.log(body);
			response.set('Content-Type', 'application/json');
			response.statusCode = res.statusCode
			return response.send(body);
	});
});


/**
 * Authorize method
 * Use this method to authorize requests using the
 * auth service
 */
function authorize(request, response, callback) {
	var server_ip = process.env.AUTH_SERVER_IP;
	var server_port = process.env.AUTH_SERVER_PORT;

	if (server_ip == null || server_port == null) {
		console.log("Missing auth server configuration.")
		console.log("ip:" + server_ip)
		console.log("port:" + server_port)
		response.statusCode = 500;
		return response.end("Missing auth server configuration.");

	}

	var options = {
		url: 'http://'+ process.env.AUTH_SERVER_IP + ':' + process.env.AUTH_SERVER_PORT + '/auth/authorize',
		method: 'GET',
		headers: {
			'Authorization': request.headers.authorization
		}
	};

	requestClient(options, function(err, res, body) {
		 if (res && (res.statusCode === 200 || res.statusCode === 201)) {
			 callback(err, res, body);
		 } else {
			 	if (res) {
			 		console.log("Access denied:" + res.statusCode);
				}

			 	response.statusCode = 500
			 	response.body = body;
			 	return response.end();
		 }
	 });

}
