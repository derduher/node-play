var http = require('http'),
	sys = require('sys');

function Crawler () {
	var client = http.get('http://google.com', function (res) {
		console.log('got response' + res.statusCode);
	});
	client.on('error', function(e) {
		console.log('problem with request: ' + e.message);
	});
}
module.exports = Crawler;
