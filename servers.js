var url = require("url"),
util = require('util'),
geoip = require('geoip-lite'),
events = require('events'),
_ = require('underscore');

var Servers = function () {
	if (! (this instanceof arguments.callee)) {
		return new arguments.callee(arguments);
	}
	events.EventEmitter.call(this);
	this.sites = [];
};
util.inherits(Servers, events.EventEmitter);
Servers.prototype.add = function (site) {
	var location = geoip.lookup(site.ip);
	if (location) {
		var geo = {
			location : location,
			host : url.parse(site.site).hostname
		};
		this.sites.push(geo);
		this.emit('add', geo);
		return geo;
	}
	this.emit('failed', site);
	return location;
};
module.exports = Servers;
