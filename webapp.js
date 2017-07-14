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

/* Telldus API */
var TelldusAPI = require('telldus-live');
var path = require('path');

/* Hue API */
var HueApi = require('node-hue-api').HueApi;

/* Telldus API Keys */
var publicKey    = 'FEHUVEW84RAFR5SP22RABURUPHAFRUNU';
var privateKey   = 'ZUXEVEGA9USTAZEWRETHAQUBUR69U6EF';
var token        = 'e7cb08c52b487e6c6393841dd9ae89760566db00d';
var tokenSecret  = 'b113722d19c8b825f3a805fc65e8d68d';

var cloud = new TelldusAPI.TelldusAPI({ publicKey  : publicKey
                                  , privateKey : privateKey }).login(token, tokenSecret, function(err, user) {
	if (!!err) {
  		return console.log('login error: ' + err.message);
	}
	
	console.log("Connected to Telldus Live API");
}).on('error', function(err) {
	console.log('background error: ' + err.message);
});

/* Hue API Keys */
var hueAPIkey = "352b12401b73b8af87f56902124609f"
var internalip = "10.0.1.3"
var externalip = "84.208.132.246:9050"
var hueip = internalip

// Use this
var api = new HueApi(hueip, hueAPIkey);

/* Telldus REST api */
app.get('/listClients', function (request, response) {
	cloud.getDevices(function(err, devices) {
		if (!!err) {
			return console.log('getDevices: ' + err.message);	
		}
		response.end(JSON.stringify(devices));
	});  
})

app.get('/listSensors', function (request, response) {
	cloud.getSensors(function(err, sensors) {
		if (!!err) {
			return console.log('getSensors: ' + err.message);
		}
		response.end(JSON.stringify(sensors));
	});
});

app.get('/sensor', function (request, response) {
	console.log(request.query);
	var sensor = request.query;
	cloud.getSensorInfo(sensor, function(err, sensor) {
		if (!!err) {
			return console.log('getSensor: ' + err.message);
		}	
		response.end(JSON.stringify(sensor));
	});
});

app.get('/client', function (request, response) {
	console.log(request.query);
	var device = request.query;
	var onP
	if (device.onP == "true") {
		onP = true;
	} else if (device.onP == "false") {
		onP = false;
	}
	
	cloud.onOffDevice(device, onP, function(err, result) {
		if (!!err) {
			return console.log('getDevice: ' + err.message);
		}
		response.end(JSON.stringify(result));
	});
});

/* Hue REST API */

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
 *	id: 1
 *	brightness: 255
 * }
 */
app.put('/hue/group', function (request, response) {
	console.log(request.query)
	
	var id = request.query.id;
	var brightness = request.query.brightness;

	var state = HueApi.lightState.create().brightness(brightness);

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
