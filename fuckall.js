var http = require('http'),
	sys = require('sys');

	console.log('here');
function Fuckall () {
	var server = http.createServer(function (request, response) {
		request.on('end', function () {
			var resp = sys.inspect(request);
			response.writeHead(200, {
				'content-type': 'text/plain',
				'content-length': resp.length
			});
			response.write(resp);
			response.end();
		});
	});
	server.listen(80);
};
console.log(Fuckall);
module.exports = Fuckall;
