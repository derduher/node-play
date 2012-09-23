
var Crawler = require('./crawler');
var Queue = require('./queue');
var events = require('events');
var Servers = require('./servers');
var queue = new Queue('http://www.google.com', 'http://slashdot.org', 'http://www.yahoo.com', 'http://www.rottentomatoes.com', 'http://www.github.com');
var servers = new Servers();
//servers.on('add', function(geo) {
	//console.log(geo.location.ll);
//});
//servers.on('failed', function(geo) {
	//console.warn(geo.site);
//});

var sites_crawled = 0,
concurrent_max = 10,
concurrent = 1,
max_sites = 1000;
var nextInLine = function (site) {
	concurrent--;
	while (queue.length() && sites_crawled < max_sites && concurrent < concurrent_max) {
		concurrent++;
		sites_crawled++;
		crawler.crawl();
	}
	site = site || '';
	//console.log(sites_crawled, queue.length(), concurrent, site.substr(7,30));
	if (concurrent < 1) {
		console.log('done');
		console.log(crawler.errors);
	}
};

var crawler = new Crawler(queue, servers, nextInLine);
nextInLine();
