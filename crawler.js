var http = require('http'),
https = require('https'),
select = require('soupselect').select,
htmlparser = require("htmlparser"),
url = require("url"),
ee = require('events').EventEmitter,
util = require('util'),
geoip = require('geoip-lite'),
ent = require('entities'),
sys = require('sys');


var Crawler = function (queue, servers, callback) {
	if (! (this instanceof arguments.callee)) {
		return new arguments.callee(arguments);
	}

	var badExt = /\.(?:gif|jpg|jpeg|png|m4v|pdf|txt|mp3)$/;

	var htmlHandler = function(err, dom, site) {
		if (err) {
			sys.debug("Error: " + err);
		} else {

			// soupselect happening here...
			var hrefs = select(dom, 'a[href]');

			hrefs.forEach(function(node) {
				var dec = ent.decode(node.attribs.href);
				var thelink = url.resolve(site, dec);
				theParsedLink = url.parse(thelink);
				if (theParsedLink.protocol.indexOf('http') !== -1 && !badExt.test(thelink)) {
					queue.push(thelink);
				} else {
					if (theParsedLink.protocol.indexOf('mailto:') !== -1) {
						thelink = 'mailto';
					} else if (theParsedLink.protocol.indexOf('javascript') !== -1) {
						thelink = 'javascript';
					} else if (theParsedLink.protocol.indexOf('ftp:') !== -1) {
						thelink = 'ftp';
					} else if (badExt.test(thelink)) {
						thelink = 'badext';
					}
					if (errors.nothandled[thelink]) {
						errors.nothandled[thelink]++;
					} else {
						errors.nothandled[thelink] = 1;
					}
				}
			});
			crawler.emit('parsed', site);
		}
	};

	var responseHandler = function (res, site) {
		var body = '';
		if (res.statusCode === 301 || res.statusCode === 302) {
			queue.push(res.headers.location);
			crawler.emit('redirect', site);
		} else if (res.statusCode === 200 && res.headers['content-type'] && res.headers['content-type'].indexOf('text/html') !== -1) {
			res.on('data', function (chunk) {
				body += chunk;
			});
			res.on('end', function () {
				var ip = res.connection.remoteAddress;
				if (ip) {
					var geo = geoip.lookup(res.connection.remoteAddress);
					servers.add({ip: ip, site: site})
				}
				var handler = new htmlparser.DefaultHandler(function (err, dom) {htmlHandler.call(this, err, dom, site);});

				var parser = new htmlparser.Parser(handler);
				parser.parseComplete(body);
			});
		} else {
			errors.badResponse[site] = {status: res.statusCode, headers: res.headers};
			crawler.emit('error', site);
		}
	};

	var crawler = this;
	var crawl = function () {
		var site = queue.pop();
		clientLib = http;
		if (url.parse(site).protocol === 'https:') {
			clientLib = https;
		}

		var client = clientLib.get(site, function (res) {responseHandler.call(this, res, site);});

		client.on('error', function(e) {
			console.log('problem with request: ' + e.message);
			crawler.emit('error', site);
		});

	};
	this.on('parsed', callback);
	this.on('redirect', callback);
	this.on('error', callback);
	var errors = {badResponse: {}, nothandled:{}};
	return {crawl: crawl, htmlHandler: htmlHandler, errors: errors};
};
util.inherits(Crawler, ee);
module.exports = Crawler;
