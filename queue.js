
var Queue = function (initialSite) {
	var q = [];
	q.push(initialSite);
	return {
		push: function (item) {
			if (this[item]) { this[item]++;}
			else { this[item] = 1; q.push(item);}
		},
		pop: function () {
			return q.pop();
		},
		length: function () {
			return q.length;
		}
	};
};
module.exports = Queue;
