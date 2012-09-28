var app = require('http').createServer(handler)
  , io = require('socket.io')
  , ws = io.listen(app)
  , servers = require('./client')

app.listen(80);
var static = require('node-static');

//
// Create a node-static server instance to serve the './public' folder
//
var file = new(static.Server)('./public');

function handler (req, res) {
    req.addListener('end', function () {
        //
        // Serve files!
        //
        file.serve(req, res);
    });
}

var buffer = [];
ws.on('connection', function (socket) {
	servers.on('add', function(geo) {
		buffer.push(geo);
	});
	setInterval(function () {
		if (buffer.length) {
			socket.emit('server', buffer);
			buffer = [];
		}
	}, 2000);
});
