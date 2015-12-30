/* Web server */
var express = require('express');
var cors = require('cors');
var app = express();
app.use(cors());

var server = app.listen(3000, function() {
	console.log('Server is listening');
});

/* Telldus API */
var TelldusAPI = require('telldus-live');
var path = require('path');

/* Hue API */
var HueApi = require('hue-module');

/* Telldus API Keys */
var publicKey    = 'FEHUVEW84RAFR5SP22RABURUPHAFRUNU';
var privateKey   = 'ZUXEVEGA9USTAZEWRETHAQUBUR69U6EF';
var token        = 'e7cb08c52b487e6c6393841dd9ae89760566db00d';
var tokenSecret  = 'b113722d19c8b825f3a805fc65e8d68d';
var cloud;

cloud = new TelldusAPI.TelldusAPI({ publicKey  : publicKey
                                  , privateKey : privateKey }).login(token, tokenSecret, function(err, user) {
	if (!!err) {
  		return console.log('login error: ' + err.message);
	}
	
	console.log("Connected to the Telldus Live API");
}).on('error', function(err) {
	console.log('background error: ' + err.message);
});

/* Hue API Keys */
var hueAPIkey = "352b12401b73b8af87f56902124609f";
var internalip = "192.168.0.10";
var externalip = "84.208.132.246:9050";
var hueip = internalip;

//HueApi.load(hueip, hueAPIkey);


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
