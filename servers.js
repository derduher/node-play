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
	this.sites = {};
};
// I'm not sure why this needs to be before adding the add method
util.inherits(Servers, events.EventEmitter);
Servers.prototype.add = function (site) {
	var host = url.parse(site.site).hostname;
	if (this.sites[host]) {
		return this.sites[host];
	}
	var location = geoip.lookup(site.ip);
	if (location) {
		var geo = {
			location : location,
			host : host
		};
		this.sites[host]= geo;
		this.emit('add', geo);
		return geo;
	}
	this.emit('failed', site);
	return location;
};
module.exports = Servers;
