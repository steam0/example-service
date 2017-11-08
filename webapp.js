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

// Teslajs Config
var username = process.env.TESLA_USERNAME;
var password = process.env.TESLA_PASSWORD;
var authToken = null;
var vehicle = {};

teslajs.login(username, password, function(err, result) {
	console.log("Logging in with User(" + username + ")")
	if (result.error) {
		console.log(JSON.stringify(result.error));
		process.exit(1);
	}

	authToken = result.authToken;

	if (authToken) {
		console.log("Login successfull");
		console.log(authToken);
	}
});

/**
* API
*/

// Get all vehicles
app.get('/vehicles', function(request, response) {
	var options = {
		authToken: authToken
	}

	teslajs.vehicles(options, function(err, vehicles) {
		if (err) {
				console.log(err);
				response.statusCode = 500;
				response.end();
		}

		response.send(vehicles);
	});
});

// Get charge state for vehicle
app.get('/chargeState', function(request, response) {
	var options = {
		authToken: authToken,
		vehicleID: request.query.id
	}

	teslajs.chargeState(options, function (err, chargeState) {
		if (err) {
			console.log(err)
			response.statusCode = 500;
			response.end();
			return;
		}

    console.log("Current charge level: " + chargeState.battery_level + '%');
		response.send(chargeState);
  });

	/*authorize(request, response, function(err, res, body) {
		console.log(request.query);

	})*/
});

app.get('/test', function (request, response) {
	authorize(request, response, function (err, res, body) {
			console.log(body);
			response.set('Content-Type', 'application/json');
			response.statusCode = res.statusCode
			return response.send(body);
	});
});


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
