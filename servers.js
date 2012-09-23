var url = require("url"),
util = require('util'),
ee = require('events').EventEmitter,
_ = require('underscore');

var Servers = function (initialSites) {
	if (! (this instanceof arguments.callee)) {
		return new arguments.callee(arguments);
	}
	var sites = [];
	var that = this;
	return {
		add: function (site) {
			var geo = {
				geo : geoip.lookup(site.ip),
				host : url.parse(site.site).hostname
			};
			this.sites.push(geo);
			that.emit('add', geo);
			return geo;
		}
	};
};
util.inherits(Servers, ee);
module.exports = Servers;
