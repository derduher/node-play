var http = require('http'),
https = require('https'),
select = require('soupselect').select,
htmlparser = require("htmlparser"),
url = require("url"),
ee = require('events').EventEmitter,
util = require('util'),
sys = require('sys');

htmlHandler = function(err, dom) {
	if (err) {
		sys.debug("Error: " + err);
	} else {

		// soupselect happening here...
		var hrefs = select(dom, 'a[href]');

		hrefs.forEach(function(node) {
			var thelink = url.resolve(site,node.attribs.href);
			theParsedLink = url.parse(thelink);
			if (theParsedLink.protocol.indexOf('http') !== -1) {
				this.queue.push(thelink);
			} else {console.log("not handled: " + thelink);}
		});
		this.emit('parsed', site);
	}
};

var responseHandler = function (res) {
	console.log(this);
	var body = '';
	if (res.statusCode === 301 || res.statusCode === 302) {
		this.queue.push(res.headers.location);
		this.emit('redirect', this.site);
	} else if (res.statusCode === 200 && res.headers['content-type'].indexOf('text/html') !== -1) {
		res.on('data', function (chunk) {
			body += chunk;
		});
		res.on('end', function () {
			var handler = new htmlparser.DefaultHandler(function (err, dom) {htmlHandler.call(crawler, err, dom);});

			var parser = new htmlparser.Parser(handler);
			parser.parseComplete(body);
		});
	} else {
		console.log(res);
	}
};

var Crawler = function (queue, callback) {
	if (! (this instanceof arguments.callee)) {
		return new arguments.callee(arguments);
	}
	var site = queue.pop();
	console.log("crawling: " + site);
	clientLib = http;
	if (url.parse(site).protocol === 'https:') {
		clientLib = https;
	}
	var crawler = this;
	crawler.site = site;
	crawler.queue = queue;
	crawler.callback = callback;
	console.log(crawler);

	var client = clientLib.get(site, responseHandler);

	client.on('error', function(e) {
		console.log('problem with request: ' + e.message);
		crawler.emit('error', site);
	});

	this.on('parsed', crawler.callback);
	this.on('redirect', crawler.callback);
	this.on('error', crawler.callback);
};
util.inherits(Crawler, ee);
module.exports = Crawler;
