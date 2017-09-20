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

app.get('/test', function (request, response) {
	console.log("Testing auth");
	console.log(request.query);

	response.end();
});
