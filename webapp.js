/* Logging */
var logger = require('winston');
logger.remove(logger.transports.Console);
logger.add(logger.transports.Console, {'timestamp':true});

/* Web server */
var express = require('express');
var cors = require('cors');
var app = express();
var requestClient = require('request');

app.use(cors());

var server = app.listen(3000, function() {
	var host = server.address().address;
  	var port = server.address().port;

	logger.log("info", "Server is listening at http://%s:%s", host, port);
});

// API
app.get('/test', function (request, response) {
	logger.log("info", "GET /test request");
	authorize(request, response, function (err, res, body) {
			logger.log("info", JSON.stringify(body));
			producer.on('ready', function () {
				logger.log("info", "Kafka producer is ready")
			  var message = 'Info message returned from example-service';

			  producer.send([{ topic: "node-test", messages: message}], function (err, result) {
					logger.log("info", "Producer send er fullført")
					if (err) {
						logger.log("error", err);
					}

					if (result) {
						logger.log("info", result);
					}
			  });
			});
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
		logger.log("error", "Missing auth server configuration.")
		logger.log("error", "ip:" + server_ip)
		logger.log("error", "port:" + server_port)
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
				 logger.log("info","Access denied:" + res.statusCode);
			 } else {
				 logger.log("info","Access denied with unknown response");
			 }

			 	response.statusCode = 500
			 	response.body = body;
			 	return response.end();
		 }
	 });
}

/**
 * Kafka init
 * Use this Kafka config in all services
 */
 var kafka_ip = process.env.KAFKA_IP;
 var kafka_port = process.env.KAFKA_PORT;

 if (kafka_ip == null || kafka_port == null) {
	 logger.log("error", "Missing kafka server configuration.")
	 logger.log("error", "ip:" + kafka_ip)
	 logger.log("error", "port:" + kafka_port)
 }

var kafka = require('kafka-node');
var Producer = kafka.Producer;
var Client = kafka.Client;
var client = new Client(kafka_ip+':'+kafka_port);
var producer = new Producer(client, { requireAcks: 1 });
