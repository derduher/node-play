
var Crawler = require('./crawler');
var Queue = require('./queue');
var queue = new Queue('http://reddit.com');

var max = 0;
var concurrent_max = 3, concurrent = 0;
var nextInLine = function (site) {
	concurrent--;
	while (queue.length() && max < 50 && concurrent < concurrent_max) {
		max++;
		console.log('processing queue: ' + queue.length() + ' ' + max);
		concurrent++;
		return new Crawler(queue, this);
	}
};

console.log(Crawler);
var crawler = new Crawler(queue, nextInLine);
