/* Web server */
var express = require('express');
var cors = require('cors');
var app = express();
app.use(cors());

var server = app.listen(3000, function() {
	var host = server.address().address;
  	var port = server.address().port;

	console.log('Server is listening at http://%s:%s', host, port);
});

/* Hue API */
var hue = require('node-hue-api');
var HueApi = hue.HueApi;

/* Hue API Keys */
var hueAPIkey = "352b12401b73b8af87f56902124609f"
var internalip = "10.0.1.3"
var externalip = "84.208.132.246:9050"
var hueip = internalip

// Use this
var api = new HueApi(hueip, hueAPIkey);

/* Hue REST API */

/**
 * GET all groups
 */
app.get('/hue/groups', function (request, response) {
	console.log("GET all groups");
	console.log(request.query);

	api.groups(function(err, result) {
    		if (err) hue_error(err);

    		// Debug
		console.log(result)
		response.status(200)
		response.end(JSON.stringify(result))
	});
});

/**
 * GET a single group
 * {
 *  id: 1
 * }
 */
app.get('/hue/group', function (request, response) {
	console.log("GET single group");
	console.log(request.query);

	var id = request.query.id

	api.getGroup(id, function(err, result) {
    		if (err) hue_error(err);

    		response.status(200)
		response.end(JSON.stringify(result))
	});
});

/**
 * POST a state to a specific group
 * {
 *	id: 1,
 *	state: 0,
 *	brightness: 255
 * }
 */
app.put('/hue/group', function (request, response) {
	console.log(request.query)

	var id = request.query.id;
	var brightness = request.query.brightness;

	if (request.query.on === "true") {
		var state = hue.lightState.create().on().brightness(brightness);
	} else {
		var state = hue.lightState.create().off().brightness(brightness);
	}

	console.log(state);

	api.setGroupLightState(id, state, function (err, lights) {
		if (err) {
			hue_error(response, 404);
		}

		response.status(200)
		response.end(JSON.stringify(lights))
	});
});


/*
 * What we need:
 * + Get all lights
 * + Get all groups
 * + Set state of light
 * + Set state of group
 * - Schedule light
 * - Schedule group
 * - Add new light
 * - Remove light
 */

 function hue_error(response, errorCode) {
 	var error
 	if (errorCode == 500) {
 		error = "Internal Server Error - Request received but Hue Hub is not reachable"
 	} else if (errorCode == 404) {
 		error = "Not found - The requested element was not found"
 	}
 	console.log(error)
 	response.status(errorCode).send(error);
 }
