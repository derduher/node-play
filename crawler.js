var http = require('http'),
https = require('https'),
select = require('soupselect').select,
htmlparser = require("htmlparser"),
url = require("url"),
ee = require('events').EventEmitter,
util = require('util'),
sys = require('sys');

var queue = {q:[],
	push: function (item) {
		if (this[item]) { this[item]++;}
		else { this[item] = 1; this.q.push(item);}
	},
	pop: function () {
		return this.q.pop();
	}
};
var max = 0;
var concurrent_max = 3, concurrent = 0;

var nextInLine = function (site) {
	while (queue.q.length && max < 50 && concurrent < concurrent_max) {
		max++;
		console.log('processing queue: ' + queue.q.length + ' ' + max);
		concurrent++;
		return new Crawler(queue.pop());
	}
};

function Crawler (site) {
	if (!queue[site]) {
		queue[site] = 0;
	}
	console.log("crawling: " + site);
	clientLib = http;
	if (url.parse(site).protocol === 'https:') {
		clientLib = https;
	}
	var crawler = this;
	var client = clientLib.get(site, function (res) {
		console.log('got response: ' + res.statusCode);
		var body = '';
		if (res.statusCode === 301 || res.statusCode === 302) {
			queue.push(res.headers.location);
			crawler.emit('redirect', site);
		} else if (res.headers['content-type'].indexOf('text/html') !== -1) {
			res.on('data', function (chunk) {
				body += chunk;
			});
			res.on('end', function () {
				var handler = new htmlparser.DefaultHandler(function(err, dom) {
					if (err) {
						sys.debug("Error: " + err);
					} else {

						// soupselect happening here...
						var href = select(dom, 'a[href]');

						href.forEach(function(link) {
							var thelink = url.resolve(site,link.attribs.href);
							theParsedLink = url.parse(thelink);
							if (theParsedLink.protocol.indexOf('http') !== -1) {
								queue.push(thelink);
							} else {console.log("not handled: " + thelink);}
						});
						crawler.emit('parsed', site);
					}
				});

				var parser = new htmlparser.Parser(handler);
				parser.parseComplete(body);
			});
		} else {
			console.log(res.headers);
		}
		concurrent--;
	});
	client.on('error', function(e) {
		console.log('problem with request: ' + e.message);
		crawler.emit('error', site);
	});
	this.on('parsed', nextInLine);
	this.on('redirect', nextInLine);
	this.on('error', nextInLine);
}
util.inherits(Crawler, ee);
module.exports = Crawler;
