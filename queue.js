var url = require("url"),
_ = require('underscore');

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
var Queue = function (initialSites) {
	var sites = Array.prototype.slice.call(arguments);
	var q = {};
	_(sites).each(function (i) {
		var parsed = url.parse(i);
		q[parsed.hostname] = [i];
	});
	return {
		push: function (item) {
			var parsed = url.parse(item);
			if (this[item]) { this[item]++;}
			else {
				this[item] = 1;
				if (!q[parsed.hostname]) {
					q[parsed.hostname] = [];
				}
				q[parsed.hostname].push(item);
			}
		},
		pop: function () {
			var keys = _(q).keys(),
			key = keys[getRandomInt(0, _(q).size() - 1)];
			var popped = q[key].pop();
			if (!q[key].length) {
				delete q[key];
			}
			return popped;
		},
		length: function () {
			return _(q).reduce(function (memo, i) {return memo + i.length;}, 0);
		}
	};
};
module.exports = Queue;
